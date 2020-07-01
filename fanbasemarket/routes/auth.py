from flask_jwt_extended import (
    jwt_required, create_access_token,
    jwt_refresh_token_required, create_refresh_token,
    get_jwt_identity, get_raw_jwt
)
from fanbasemarket.models import User, BlacklistedToken
from fanbasemarket.routes.utils import bad_request, ok
from fanbasemarket import session, jwt
from flask import Blueprint, request
from json import loads

auth = Blueprint('auth', __name__)


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(tok):
    matches = BlacklistedToken.query.filter(jwt=tok['jti']).all()
    return matches != []


@auth.route('/register', methods=['POST'])
def create_user():
    req_data = loads(request.get_json())
    pwrd = req_data['password']
    pwrd_c = req_data['confirm_password']
    if pwrd != pwrd_c:
        return bad_request('passwords do not match')
    uname = req_data['username']
    email = req_data['email']
    try:
        u = User(username=uname, email=email,
                 password=pwrd)
        session.add(u)
        session.commit()
        access_jwt = create_access_token(identity=uname)
        refresh_jwt = create_refresh_token(identity=uname)
        ret = {'access_token': access_jwt}
        to_set = {'refresh_token': refresh_jwt}
        return ok(ret, created=True, cookies=to_set)
    except:
        return bad_request('username/email is already in use')


@auth.route('/login', methods=['POST'])
def login_user():
    req_data = loads(request.get_json())
    uname = req_data['username']
    pwrd = req_data['password']
    user = User.query.filter_by(username=uname).first()
    if user is None:
        return bad_request('invalid username')
    if user.check_password(pwrd):
        access_jwt = create_access_token(identity=uname)
        refresh_jwt = create_refresh_token(identity=uname)
        ret = {'access_token': access_jwt}
        to_set = {'refresh_token': refresh_jwt}
        return ok(ret, cookies=to_set)
    return bad_request('invalid password')


@auth.route('/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh_jwt():
    user = get_jwt_identity()
    access_jwt = create_access_token(identity=user)
    ret = {'access_token': access_jwt}
    return ok(ret)


@auth.route('/logout', methods=['DELETE'])
@jwt_required
def logout_user():
    jti = get_raw_jwt()['jti']
    to_add = BlacklistedToken(jwt=jti)
    try:
        session.add(to_add)
        session.commit()
        return ok({})
    except:
        return bad_request('could not log user out')

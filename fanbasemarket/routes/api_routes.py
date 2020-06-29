from flask_jwt_extended import (
    jwt_required, create_access_token,
    jwt_refresh_token_required, create_refresh_token,
    jwt_optional, get_jwt_identity
)
from flask import Blueprint, Response, request
from fanbasemarket import session, jwt
from fanbasemarket.models import User
from json import dumps, loads

api = Blueprint('api', __name__)

def bad_request(msg):
    r = Response(dumps({'message': msg}))
    r.status_code = 400
    return r

def ok(dict_payload, created=False, cookies={}):
    payload = dumps(payload)
    r = Response(payload)
    for k, v in cookies.items():
        r.set_cookie(k, v, httponly=True)
    r.status_code = 201 if created else 200
    return r

@api.route('/register', methods=['POST'])
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
    except Exception as e:
        return bad_request('username/email is already in use')

@api.route('/login', methods=['POST'])
def login_user():
    req_data = loads(request.get_json())
    uname = req_data['username']
    pwrd = req_data['password']
    user = User.query.filter_by(username=uname).first()
    if user is None:
        return bad_request('invalid username')
    if user.check_password(pwrd):
        access_jwt = create_access_token(identity=username)
        refresh_jwt = create_refresh_token(identity=username)
        ret = {'access_token': access_jwt}
        to_set = {'refresh_token': refresh_jwt}
        return ok(ret, cookies=to_set)
    return bad_request('invalid password')

@api.route('/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh_jwt():
    user = get_jwt_identity()
    access_jwt = create_access_token(identity=user)
    ret = {'access_token': access_jwt}
    return ok(ret)


from flask_jwt_extended import (
    jwt_required, create_access_token,
    jwt_refresh_token_required, create_refresh_token,
    get_jwt_identity, get_raw_jwt, unset_jwt_cookies, set_refresh_cookies
)
from fanbasemarket.models import User, BlacklistedToken
from fanbasemarket.routes.utils import bad_request, ok
from fanbasemarket import app, jwt, get_db
from flask import Blueprint, request
from flask_cors import cross_origin, CORS

auth = Blueprint('auth', __name__)
CORS(auth)


@auth.after_request
def creds(response):
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(tok):
    matches = BlacklistedToken.query.filter_by(jwt=tok['jti']).all()
    return matches != []


@auth.route('/register', methods=['POST'])
@cross_origin(origin='http://localhost:3000/')
def create_user():
    with app.app_context():
        db = get_db()
        req_data = request.get_json()
        pwrd = req_data['password']
        pwrd_c = req_data['confirm-password']
        if pwrd != pwrd_c:
            return bad_request('passwords do not match')
        uname = req_data['userName']
        email = req_data['email']
        try:
            u = User(username=uname, email=email,
                    password=pwrd)
            db.session.add(u)
            db.session.commit()
            access_jwt = create_access_token(identity=uname)
            refresh_jwt = create_refresh_token(identity=uname)
            resp = ok({'access_token': access_jwt, 'username': uname})
            set_refresh_cookies(resp, refresh_jwt)
            return resp
        except:
            return bad_request('username/email is already in use')


@auth.route('/login', methods=['POST'])
@cross_origin(origin='http://localhost:3000/')
def login_user():
    with app.app_context():
        db = get_db()
        req_data = request.get_json()
        uname = req_data['username']
        pwrd = req_data['password']
        user = User.query.filter_by(username=uname).first()
        if user is None:
            return bad_request('invalid username')
        if user.check_password(pwrd):
            access_jwt = create_access_token(identity=uname)
            refresh_jwt = create_refresh_token(identity=uname)
            resp = ok({'access_token': access_jwt, 'username': uname})
            set_refresh_cookies(resp, refresh_jwt)
            return resp
        return bad_request('invalid password')


@auth.route('/refresh', methods=['POST'])
@cross_origin(origin='http://localhost:3000/')
@jwt_refresh_token_required
def refresh_jwt():
    user = get_jwt_identity()
    access_jwt = create_access_token(identity=user)
    resp = ok({'access_token': access_jwt, 'username': user})
    return resp


@auth.route('/logout', methods=['DELETE'])
@cross_origin(origin='http://localhost:3000/')
@jwt_required
def logout_user():
    tok = get_raw_jwt()['jti']
    with app.app_context():
        db = get_db()
        blTok = BlacklistedToken(jwt=tok)
        db.session.add(blTok)
        db.session.commit()
        resp = ok({})
        unset_jwt_cookies(resp)
        return resp

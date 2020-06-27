from flask import Blueprint, Response, request
from fanbasemarket.models import User
from fanbasemarket import session, secret
from json import dumps, loads

api = Blueprint('api', __name__)

def bad_request(msg):
    r = Response(dumps({'message': msg}))
    r.status_code = 400
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
        r = Response(dumps({'jwt', u.gen_auth_token()}))
        r.status_code = 201
        return r
    except Exception as e:
        return bad_request('username/email is already in use')

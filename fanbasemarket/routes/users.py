from flask import Blueprint, request
from flask_cors import CORS, cross_origin
from flask_jwt_extended import jwt_required, get_current_user, get_jwt_identity
from datetime import datetime

from fanbasemarket import app, get_db
from fanbasemarket.models import Purchase, User, Teamprice, Team
from fanbasemarket.queries.team import get_price
from fanbasemarket.queries.user import get_active_holdings, get_user_graph_points, \
                                       get_leaderboard
from fanbasemarket.routes.utils import bad_request, ok
from fanbasemarket.queries.user import buy_shares

users = Blueprint('users', __name__)
CORS(users)


@users.after_request
def creds(response):
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

@users.route('/leaderboard', methods=['GET'])
@cross_origin('http://localhost:3000/')
def leaderboard():
    with app.app_context():
        db = get_db()
        return ok(get_leaderboard(db))

@users.route('/usrPg', methods=['GET'])
@cross_origin('http://localhost:3000/')
def gen_usrPg():
    with app.app_context():
        db = get_db()
        heads = request.headers
        if 'date' not in heads:
            date = str(datetime.utcnow())
        else:
            date = heads['date']
        uname = heads['username']
        matches = User.query.filter_by(username=uname).all()
        if not matches:
            return bad_request('no such user')
        user_obj = matches[0]
        uid = user_obj.id
        all_purchases = get_active_holdings(uid, db, date=date)
        payload = {'available_funds': user_obj.available_funds}
        payload['holdings'] = all_purchases
        payload['graphData'] = get_user_graph_points(uid, db)
        return ok(payload)

@users.route('buyShares', methods=['POST'])
@cross_origin('http://localhost:3000/')
@jwt_required
def make_purchase():
    uname = get_jwt_identity()
    with app.app_context():
        db = get_db()
        usr = User.query.filter(User.username == uname).first()
        js = request.get_json()
        buy_shares(usr, js['abr'], int(js['num_shares']), db)
        return ok({})

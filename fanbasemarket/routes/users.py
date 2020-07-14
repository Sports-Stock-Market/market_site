from flask import Blueprint, request
from flask_cors import CORS, cross_origin
from flask_jwt_extended import jwt_required, get_current_user
from sqlalchemy import desc
from datetime import datetime

from fanbasemarket import session
from fanbasemarket.models import Purchase, User, Teamprice, Team
from fanbasemarket.queries.team import get_price
from fanbasemarket.queries.user import get_active_holdings, get_user_graph_points
from fanbasemarket.routes.utils import bad_request, ok

users = Blueprint('users', __name__)
CORS(users)


@users.after_request
def creds(response):
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response


@users.route('/totalAssets', methods=['GET'])
@cross_origin('http://localhost:3000/')
def get_total_assets():
    body = request.get_json()
    date = body['date']
    uname = body['username']
    matches = User.query.filter_by(username=uname).all()
    user_obj = matches[0]
    if not matches:
        return bad_request('no such user')
    uid = user_obj.id
    all_purchases = get_active_holdings(uid, date)
    payload = {'available_funds': user_obj.available_funds, 'holdings': []}
    for purchase in all_purchases:
        holding = {}
        tid = purchase.team_id
        team = session.query(Team).filter(Team.id == tid)
        holding['name'] = team.name
        holding['abr'] = team.abr
        price = get_price(tid, date)
        holding['price'] = price
        holding['position'] = {
            'bought': purchase.purchased_for,
            'shares': purchase.amt_shares
        }
        payload['holdings'].append(holding)
    return ok(payload)


@users.route('/graphPts', methods=['GET'])
@cross_origin('http://localhost:3000/')
def make_purchase():
    body = request.get_json()
    uname = body['username']
    user = session.query(User).filter(User.username == uname).first()
    if user is None:
        return bad_request('no such user')
    return ok(get_user_graph_points(user.id))

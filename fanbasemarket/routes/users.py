from flask import Blueprint, request
from flask_cors import CORS, cross_origin
from flask_jwt_extended import jwt_required, get_current_user
from sqlalchemy import desc
from datetime import datetime

from fanbasemarket import Session
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
    session = Session()
    heads = request.headers
    if 'date' not in heads:
        date = str(datetime.utcnow())
    else:
        date = heads['date']
    uname = heads['username']
    matches = User.query.filter_by(username=uname).all()
    if not matches:
        Session.remove()
        return bad_request('no such user')
    user_obj = matches[0]
    uid = user_obj.id
    all_purchases = get_active_holdings(uid, session, date=date)
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
    Session.remove()
    return ok(payload)


@users.route('/usrPg', methods=['GET'])
@cross_origin('http://localhost:3000/')
def gen_usrPg():
    session = Session()
    heads = request.headers
    if 'date' not in heads:
        date = str(datetime.utcnow())
    else:
        date = heads['date']
    uname = heads['username']
    matches = User.query.filter_by(username=uname).all()
    if not matches:
        Session.remove()
        return bad_request('no such user')
    user_obj = matches[0]
    uid = user_obj.id
    all_purchases = get_active_holdings(uid, session, date=date)
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
    payload['graphData'] = get_user_graph_points(uid, session)
    Session.remove()
    return ok(payload)

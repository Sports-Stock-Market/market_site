from flask import Blueprint, request
from flask_cors import CORS, cross_origin
from sqlalchemy import desc
from datetime import datetime

from fanbasemarket import session, STRPTIME_FORMAT
from fanbasemarket.models import Purchase, User, UninvestedAmount, Teamprice, Team
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
    if not matches:
        return bad_request('no such user')
    uid = matches[0].id
    all_purchases = session.query(Purchase).\
        filter(Purchase.user_id == uid).\
        filter(Purchase.exists).\
        filter(Purchase.purchased_at <= date).\
        all()
    uninvested = session.query(UninvestedAmount).\
        filter(UninvestedAmount.user_id == uid).\
        filter(UninvestedAmount.date <= date).\
        order_by(desc(UninvestedAmount.date)).\
        first()
    payload = {'uninvested': uninvested.amount, 'holdings': []}
    for purchase in all_purchases:
        holding = {}
        tid = purchase.team_id
        team = session.query(Team).filter(Team.id == tid)
        holding['name'] = team.name
        holding['abr'] = team.abr
        price = session.query(Teamprice). \
            filter(Teamprice.team_id == tid). \
            filter(Teamprice.date <= date). \
            order_by(desc(Teamprice.date)). \
            first().elo
        holding['price'] = price
        holding['position'] = {
            'bought': purchase.purchased_for,
            'shares': purchase.amt_shares
        }
        payload['holdings'].append(holding)
    return ok(payload)

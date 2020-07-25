from datetime import datetime, timedelta
from json import dumps

from sqlalchemy import and_, not_

from fanbasemarket.queries.utils import get_graph_x_values
from fanbasemarket.models import Purchase, User


def get_active_holdings(uid, db, date=None):
    if not date:
        date = datetime.utcnow().strftime('%Y-%m-%d')
    results = db.session.query(Purchase).\
        filter(Purchase.user_id == uid).\
        filter(Purchase.exists).\
        filter(Purchase.purchased_at <= date).\
        all()
    return results


def get_assets_in_date_range(uid, previous_balance, end, db, start=None):
    if start is None:
        previous_purchases = db.session.query(Purchase).\
            filter(Purchase.user_id == uid).\
            filter(Purchase.purchased_at <= end).all()
        previous_sales = db.session.query(Purchase).\
            filter(Purchase.user_id == uid).\
            filter(not_(Purchase.sold_at == None)).\
            filter(Purchase.sold_at <= end).all()
    else:
        previous_purchases = db.session.query(Purchase). \
            filter(Purchase.user_id == uid).\
            filter(and_(Purchase.purchased_at <= end, Purchase.purchased_at > start)).all()
        previous_sales = db.session.query(Purchase).\
            filter(Purchase.user_id == uid).\
            filter(not_(Purchase.sold_at == None)).\
            filter(and_(Purchase.sold_at <= end, Purchase.sold_at > start)).all()
    total = previous_balance
    if not previous_purchases:
        return end, total
    last_date = previous_purchases[0].purchased_at
    for purchase in previous_purchases:
        total -= purchase.purchased_for
        if purchase.purchased_at >= last_date:
            last_date = purchase.purchased_at
    for sale in previous_sales:
        if sale.sold_at >= last_date:
            last_date = sale.sold_at
            total += sale.sold_for
    return last_date, total

def get_current_usr_value(uid, db):
    now = str(datetime.utcnow())
    _, t = get_assets_in_date_range(uid, 1500, now, db)
    return t

def get_leaderboard(db):
    usrs_all = User.query.all()
    vals = [(u.username, get_current_usr_value(u.id, db)) for u in usrs_all]
    return [{'username': x, 'value': y} for x, y in vals]   

def get_user_graph_points(uid, db):
    x_values_dict = get_graph_x_values()
    data_points = []
    data_points = {}
    for k, x_values in x_values_dict.items():
        data_points[k] = []
        initial_date, val = get_assets_in_date_range(uid, 15000, x_values[0], db)
        data_points[k].append({'date': str(initial_date), 'price': val})
        for i, x_val in enumerate(x_values[:-1]):
            date, val = get_assets_in_date_range(uid, val, x_values[i + 1], db, start=x_val)
            date_s = str(date)
            data_points[k].append({'date': date_s, 'price': val})
    return data_points

def buy_shares(usr, abr, num_shares, db):
    team = Team.query.filter(Team.abr == abr).first()
    price = num_shares * team.price * 1.01
    if usr.available_funds < price:
        raise ValueError('not enough funds')
    usr.available_funds -= price
    db.session.add(usr)
    db.session.commit()
    now = datetime.utcnow()
    purchase = Purchase(team_id=team.id, user_id=user.id, purchased_at=now,
                        purchased_for=team.price, amt_shares=num_shares)
    db.session.add(purchase)
    db.session.commit()
    team.price *= 1.01
    db.session.add(team)
    db.session.commit()
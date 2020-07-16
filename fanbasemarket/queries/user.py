from datetime import datetime, timedelta
from json import dumps

from sqlalchemy import and_, not_

from fanbasemarket.queries.utils import get_graph_x_values
from fanbasemarket.models import Purchase


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


def get_user_graph_points(uid, db):
    x_values = get_graph_x_values()
    data_points = []
    initial_date, val = get_assets_in_date_range(uid, 15000, x_values[0], db)
    data_points.append({'date': str(initial_date), 'price': val})
    for i, x_val in enumerate(x_values[:-1]):
        date, val = get_assets_in_date_range(uid, val, x_values[i + 1], db, start=x_val)
        date_s = str(date)
        data_points.append({'date': date_s, 'price': val})
    return data_points
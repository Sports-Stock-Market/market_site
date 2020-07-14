from datetime import datetime, timedelta
from json import dumps

from sqlalchemy import and_, not_

from fanbasemarket import session
from fanbasemarket.models import Purchase


def get_active_holdings(uid, date=None):
    if not date:
        date = datetime.utcnow().strftime('%Y-%m-%d')
    return session.query(Purchase).\
        filter(Purchase.user_id == uid).\
        filter(Purchase.exists).\
        filter(Purchase.purchased_at <= date).\
        all()


def get_assets_in_date_range(uid, previous_balance, end, start=None):
    if start is None:
        previous_purchases = session.query(Purchase).\
            filter(Purchase.user_id == uid).\
            filter(Purchase.purchased_at <= end).all()
        previous_sales = session.query(Purchase).\
            filter(Purchase.user_id == uid).\
            filter(not_(Purchase.sold_at == None)).\
            filter(Purchase.sold_at <= end).all()
    else:
        previous_purchases = session.query(Purchase). \
            filter(Purchase.user_id == uid).\
            filter(and_(Purchase.purchased_at <= end, Purchase.purchased_at > start)).all()
        previous_sales = session.query(Purchase).\
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


def get_user_graph_points(uid):
    now = datetime.utcnow()
    beginning_of_day = datetime(now.year, now.month, now.day)
    week_ago = beginning_of_day - timedelta(weeks=1)
    month_ago = beginning_of_day - timedelta(weeks=4)
    beginning_of_year = datetime(now.year, 1, 1)
    x_values = []
    while beginning_of_year <= beginning_of_day:
        x_values.append(beginning_of_year)
        beginning_of_year += timedelta(weeks=1)
    while month_ago <= beginning_of_day:
        x_values.append(month_ago)
        month_ago += timedelta(days=1)
    while week_ago <= beginning_of_day:
        x_values.append(week_ago)
        week_ago += timedelta(days=1)
    while beginning_of_day <= now:
        x_values.append(beginning_of_day)
        beginning_of_day += timedelta(hours=0.5)
    x_values = sorted(x_values)
    data_points = []
    initial_date, val = get_assets_in_date_range(uid, 15000, x_values[0])
    data_points.append({'date': str(initial_date), 'price': val})
    for i, x_val in enumerate(x_values[:-1]):
        date, val = get_assets_in_date_range(uid, val, x_values[i + 1], start=x_val)
        date_s = str(date)
        data_points.append({'date': date_s, 'price': val})
    return data_points

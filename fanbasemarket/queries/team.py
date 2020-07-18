from datetime import datetime

from sqlalchemy import desc

from fanbasemarket.models import Teamprice
from fanbasemarket.queries.utils import get_graph_x_values


def get_price(tid, db, date=None):
    if not date:
        date = datetime.utcnow().strftime('%Y-%m-%d')
    prices = db.session.query(Teamprice). \
        filter(Teamprice.team_id == tid). \
        filter(Teamprice.date <= date). \
        order_by(desc(Teamprice.date)). \
        all()
    return prices[-1].elo

def get_team_graph_points(tid, db):
    x_values = get_graph_x_values()
    data_points = []
    for x_val in x_values:
        price = get_price(tid, db, date=x_val)
        data_points.append({'date': str(x_val), 'price': price})
    return data_points

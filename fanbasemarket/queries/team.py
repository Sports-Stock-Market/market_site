from datetime import datetime

from sqlalchemy import desc

from fanbasemarket.models import Teamprice
from fanbasemarket.queries.utils import get_graph_x_values


def get_price(tid, db, date=None):
    if not date:
        date = datetime.utcnow().strftime('%Y-%m-%d')
    return db.session.query(Teamprice). \
        filter(Teamprice.team_id == tid). \
        filter(Teamprice.date <= date). \
        order_by(desc(Teamprice.date)). \
        first().elo

def get_team_graph_points(tid, db):
    x_values_dict = get_graph_x_values()
    data_points = {}
    for k, x_values in x_values_dict.items():
        l = []
        for x_val in x_values:
            price = get_price(tid, db, date=x_val)
            l.append({'date': str(x_val), 'price': price})
        data_points[k] = l
    return data_points

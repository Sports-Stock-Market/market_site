from datetime import datetime

from sqlalchemy import desc

from fanbasemarket import session
from fanbasemarket.models import Teamprice
from fanbasemarket.queries.utils import get_graph_x_values
from fanbasemarket import session


def get_price(tid, date=None):
    if not date:
        date = datetime.utcnow().strftime('%Y-%m-%d')
    prices = session.query(Teamprice). \
        filter(Teamprice.team_id == tid). \
        filter(Teamprice.date <= date). \
        order_by(desc(Teamprice.date)). \
        all()
    return prices[-1].elo

def get_team_graph_points(tid):
    x_values = get_graph_x_values()
    data_points = []
    for x_val in x_values:
        price = get_price(tid, x_val)
        data_points.append({'date': str(x_val), 'price': price})
    return data_points

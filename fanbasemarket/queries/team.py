from datetime import datetime

from sqlalchemy import desc

from fanbasemarket import session
from fanbasemarket.models import Teamprice


def get_price(tid, date=None):
    if not date:
        date = datetime.utcnow().strftime('%Y-%m-%d')
    price = session.query(Teamprice). \
        filter(Teamprice.team_id == tid). \
        filter(Teamprice.date <= date). \
        order_by(desc(Teamprice.date)). \
        first().elo
    return price

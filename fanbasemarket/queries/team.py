from datetime import datetime

from sqlalchemy import desc

from sqlalchemy.ext.declarative import declarative_base
from fanbasemarket.models import Teamprice, Player
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

def update_teamPrice(team, delta, dt, db):
    newprice = team.price + delta
    team.prev_price = team.price
    team.price = newprice
    db.session.add(team)
    db.session.commit()
    price_obj = Teamprice(date=dt, team_id=team.id, elo=newprice)
    db.session.add(price_obj)
    db.session.commit()

def set_player_rating(team, db):
    players = Player.query.filter(Player.team_id==team.id).all()
    return sum([player.rating * player.mpg for player in players])
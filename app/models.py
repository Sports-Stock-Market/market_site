from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import Table, Column, Integer, String, Boolean, ForeignKey, DateTime
from datetime import datetime
from json import dumps

class User(Model):
    id = Column(Integer, primary_key=True)
    username = Column(String(64), index=True, unique=True)
    email = Column(String(120), index=True, unique=True)
    password_hash = Column(String(128))
    total_assets = Column(Float)
    cash = Column(Integer, default=10000)
    money = Column(Integer, default=10000)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def serialize(self):
        return dumps({'id': self.id, 'username': self.username,
                      'email': self.email,
                      'total_assets': self.total_assets,
                      'cash': cash, 'money': money})

class Team(Model):
    id = Column(Integer, primary_key=True)
    name = Column(String(140))
    price = Column(Float)
    num_team = Column(Integer)
    buy_quant = Column(Integer)

    def serialize(self):
        return dumps({'id': self.id, 'name': self.name,
                      'price': self.price, 'num_team': self.num_team,
                      'buy_quant': self.buy_quant})

class Purchase(Model):
    id = Column(Integer, primary_key=True)
    team_id = Column(Integer, ForeignKey('team.id'))
    user_id = Column(Integer, ForeignKey('user.id'))
    exists = Column(Boolean, default=True)
    purchased_at = Column(DateTime)
    purchased_for = Column(Float)

    def serialize(self):
        return dumps({'id': self.id, 'team_id': self.team_id,
                      'user_id': self.user_id, 'exists': self.exists,
                      'purchased_at': self.purchased_at,
                      'purchased_for': self.purchased_for})

class Short(Model):
    id = Column(Integer, primary_key=True)
    team_id = Column(Integer, ForeignKey('team.id'))
    user_id = Column(Integer, ForeignKey('user.id'))
    shorted_at = Column(DateTime)
    shorted_for = Column(Float)
    expires_at = Column(DateTime)

    def serialize(self):
        return dumps({'id': self.id, 'team_id': self.team_id,
                      'user_id': self.user_id,
                      'shorted_at': self.shorted_at,
                      'shorted_for': self.shorted_for,
                      'expires_at': self.expires_at})

class Teamprice(Model):
    id = Column(Integer, primary_key=True)
    date = Column(DateTime, index=True)
    team_id = Column(Integer, ForeignKey('team.id')
    price = Column(Float)

    def serialize(self):
        return dumps({'id': self.id, 'date': self.date,
                      'team_id': self.team_id, 'price': self.price})

class Listing(Model):
    id = Column(Integer, primary_key=True)
    team_id = Column(Integer, ForeignKey('team.id'))
    user_id = Column(Integer, ForeignKey('user.id'))
    price = Column(Float)
    posted_at = Column(DateTime, index=True, default=datetime.utcnow)
    
    def serialize(self):
        return dumps({'id': self.id, 'team_id': self.team_id,
            'user_id': self.user_id, 'price': self.price,
            'posted_at': self.posted_at})


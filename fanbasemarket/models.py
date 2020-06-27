from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import Table, Column, Integer, String, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime, timedelta
from fanbasemarket import secret
from json import dumps
from jwt import encode

Base = declarative_base()

class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    username = Column(String(64), index=True, unique=True)
    email = Column(String(120), index=True, unique=True)
    password_hash = Column(String(128))
    money = Column(Integer, default=10000)
    
    @property
    def password():
        raise ValueError('Password is a write-only field')

    @password.setter
    def password(self, pword):
        self.password_hash = generate_password_hash(pword)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def serialize(self):
        return dumps({'id': self.id, 'username': self.username,
                      'email': self.email, 'money': self.money})

    # https://realpython.com/token-based-authentication-with-flask/
    def gen_auth_token(self):
        try:
            now = datetime.utcnow()
            end = now + timedelta(days=0, minutes=15)
            data = {
                'exp': end,
                'iat': now,
                'sub': self.id
            }
            return encode(data, secret, algorithm='HS256')
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        data = jwt.decode(auth_token, secret)
        return data['sub']

class Team(Base):
    __tablename__ = 'team'
    id = Column(Integer, primary_key=True)
    name = Column(String(140))
    price = Column(Float)
    num_team = Column(Integer)
    buy_quant = Column(Integer)

    def serialize(self):
        return dumps({'id': self.id, 'name': self.name,
                      'price': self.price, 'num_team': self.num_team,
                      'buy_quant': self.buy_quant})

class Purchase(Base):
    __tablename__ = 'purchase'
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

class Short(Base):
    __tablename__ = 'short'
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

class Teamprice(Base):
    __tablename__ = 'teamprice'
    id = Column(Integer, primary_key=True)
    date = Column(DateTime, index=True)
    team_id = Column(Integer, ForeignKey('team.id'))
    price = Column(Float)

    def serialize(self):
        return dumps({'id': self.id, 'date': self.date,
                      'team_id': self.team_id, 'price': self.price})

class Listing(Base):
    __tablename__ = 'listing'
    id = Column(Integer, primary_key=True)
    team_id = Column(Integer, ForeignKey('team.id'))
    user_id = Column(Integer, ForeignKey('user.id'))
    price = Column(Float)
    posted_at = Column(DateTime, index=True, default=datetime.utcnow)
    
    def serialize(self):
        return dumps({'id': self.id, 'team_id': self.team_id,
            'user_id': self.user_id, 'price': self.price,
            'posted_at': self.posted_at})

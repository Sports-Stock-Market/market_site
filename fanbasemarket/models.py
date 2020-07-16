from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime
from werkzeug.security import generate_password_hash, check_password_hash
from fanbasemarket import Base
from datetime import datetime
from json import dumps


class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    username = Column(String(64), index=True, unique=True)
    email = Column(String(120), index=True, unique=True)
    password_hash = Column(String(128))
    available_funds = Column(Float, default=15000)
    confirmed = Column(Boolean, default=False)
    
    @property
    def password(self):
        raise ValueError('Password is a write-only field')

    @password.setter
    def password(self, pword):
        self.password_hash = generate_password_hash(pword)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def serialize(self):
        return dumps({'id': self.id, 'username': self.username,
                      'email': self.email, 'money': self.money})


class Team(Base):
    __tablename__ = 'team'
    id = Column(Integer, primary_key=True)
    name = Column(String(140))
    abr = Column(String(10))

    def serialize(self):
        return dumps({'id': self.id, 'name': self.name})


class Purchase(Base):
    __tablename__ = 'purchase'
    id = Column(Integer, primary_key=True)
    team_id = Column(Integer, ForeignKey('team.id'))
    user_id = Column(Integer, ForeignKey('user.id'))
    exists = Column(Boolean, default=True)
    purchased_at = Column(DateTime)
    sold_at = Column(DateTime, nullable=True)
    sold_for = Column(Float, nullable=True)
    purchased_for = Column(Float)
    amt_shares = Column(Integer)

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
    elo = Column(Float)

    def serialize(self):
        return dumps({'id': self.id, 'date': self.date,
                      'team_id': self.team_id, 'elo': self.elo})


class Game(Base):
    __tablename__ = 'game'
    id = Column(Integer, primary_key=True)
    home = Column(Integer, ForeignKey('team.id'))
    away = Column(Integer, ForeignKey('team.id'))
    home_score = Column(Integer, default=0)
    away_score = Column(Integer, default=0)
    start = Column(DateTime)

    def serialize(self):
        return dumps({'id': self.id, 'home': self.home,
                      'away': self.away, 'start': self.start})


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


class BlacklistedToken(Base):
    __tablename__ = 'blacklistedtoken'
    id = Column(Integer, primary_key=True)
    jwt = Column(String(100))

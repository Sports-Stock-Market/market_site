from werkzeug.security import generate_password_hash, check_password_hash
from fanbasemarket import db
from datetime import datetime
from json import dumps


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    available_funds = db.Column(db.Float, default=15000)
    confirmed = db.Column(db.Boolean, default=False)
    
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


class Team(db.Model):
    __tablename__ = 'team'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(140))
    abr = db.Column(db.String(10))
    price = db.Column(db.Float, default=0.0)
    prev_price = db.Column(db.Float, default=0.0)
    fs_rating = db.Column(db.Float, default=0.0)
    rating = db.Column(db.Float, default=0.0)
    delta = db.Column(db.Float, default=0.0)

    def serialize(self):
        return dumps({'id': self.id, 'name': self.name})

class Player(db.Model):
    __tablename__ = 'player'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(140))
    rating = db.Column(db.Integer)
    initial_mpg = db.Column(db.Float)
    mpg = db.Column(db.Float)
    pos1 = db.Column(db.String(5))
    pos2 = db.Column(db.String(5))
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'))
    is_injured = db.Column(db.Boolean, default=False)

class Purchase(db.Model):
    __tablename__ = 'purchase'
    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    exists = db.Column(db.Boolean, default=True)
    purchased_at = db.Column(db.DateTime)
    sold_at = db.Column(db.DateTime, nullable=True)
    sold_for = db.Column(db.Float, nullable=True)
    purchased_for = db.Column(db.Float)
    amt_shares = db.Column(db.Integer)

    def serialize(self):
        return dumps({'id': self.id, 'team_id': self.team_id,
                      'user_id': self.user_id, 'exists': self.exists,
                      'purchased_at': self.purchased_at,
                      'purchased_for': self.purchased_for})


class Short(db.Model):
    __tablename__ = 'short'
    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    shorted_at = db.Column(db.DateTime)
    shorted_for = db.Column(db.Float)
    expires_at = db.Column(db.DateTime)

    def serialize(self):
        return dumps({'id': self.id, 'team_id': self.team_id,
                      'user_id': self.user_id,
                      'shorted_at': self.shorted_at,
                      'shorted_for': self.shorted_for,
                      'expires_at': self.expires_at})


class Teamprice(db.Model):
    __tablename__ = 'teamprice'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, index=True)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'))
    elo = db.Column(db.Float)

    def serialize(self):
        return dumps({'id': self.id, 'date': self.date,
                      'team_id': self.team_id, 'elo': self.elo})


class Game(db.Model):
    __tablename__ = 'game'
    id = db.Column(db.Integer, primary_key=True)
    home = db.Column(db.Integer, db.ForeignKey('team.id'))
    away = db.Column(db.Integer, db.ForeignKey('team.id'))
    home_score = db.Column(db.Integer, default=0)
    away_score = db.Column(db.Integer, default=0)
    start = db.Column(db.DateTime)

    def serialize(self):
        return dumps({'id': self.id, 'home': self.home,
                      'away': self.away, 'start': self.start})


class Listing(db.Model):
    __tablename__ = 'listing'
    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    price = db.Column(db.Float)
    posted_at = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    
    def serialize(self):
        return dumps({'id': self.id, 'team_id': self.team_id,
                      'user_id': self.user_id, 'price': self.price,
                      'posted_at': self.posted_at})


class BlacklistedToken(db.Model):
    __tablename__ = 'blacklistedtoken'
    id = db.Column(db.Integer, primary_key=True)
    jwt = db.Column(db.String(100))

class Sale(db.Model):
    __tablename__ = 'sale'
    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    sold_for = db.Column(db.Float)
    date = db.Column(db.DateTime)
    amt_sold = db.Column(db.Integer)

class PurchaseTransaction(db.Model):
    __tablename__ = 'purchasetransaction'
    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'))
    date = db.Column(db.DateTime)
    purchased_for = db.Column(db.Float)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    amt_purchased = db.Column(db.Integer)

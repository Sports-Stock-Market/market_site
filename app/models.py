from app import db,login
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(UserMixin,db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    total_assets = db.Column(db.Float)
    port = db.relationship('Portfolio', backref = 'user', uselist = False)

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Portfolio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    teams = db.Column(db.String(140))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    cash = db.Column(db.Integer, default=10000)
    money = db.Column(db.Float, default = 10000)

    def __repr__(self):
        return '<Portfolio {}>'.format(self.money)

class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    team = db.Column(db.String(140))
    price = db.Column(db.Float)
    num_team = db.Column(db.Integer)
    buy_at = db.Column(db.Float)
    buy_quant = db.Column(db.Integer)
    portfolio_id = db.Column(db.Integer, db.ForeignKey('portfolio.id'))

    def __repr__(self):
        return '<Team {}>'.format(self.team)

class ShortTeam(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    team = db.Column(db.String(140))
    price = db.Column(db.Float)
    num_team = db.Column(db.Integer)
    portfolio_id = db.Column(db.Integer, db.ForeignKey('portfolio.id'))
    timestamp = db.Column(db.DateTime, index=True)
    buy_at = db.Column(db.Float)

    def __repr__(self):
        return '<Team {}>'.format(self.team)

class Teamprice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, index=True)
    team = db.Column(db.String(140))
    price = db.Column(db.Float)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    team = db.Column(db.String(140))
    price = db.Column(db.Float)
    num_team = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


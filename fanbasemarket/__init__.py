from sqlalchemy_utils import database_exists, create_database
from fanbasemarket.pricing.utils import get_schedule_range
from fanbasemarket.pricing.elo import home_rating_change
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from flask_jwt_extended import JWTManager
from nba_api.stats.static import teams
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from flask_executor import Executor
from dotenv import load_dotenv
from datetime import datetime
from flask_cors import CORS
from string import capwords
from flask import Flask, g
from os import getenv
from flask_socketio import SocketIO, emit


STRPTIME_FORMAT = '%m/%d/%Y'
K = 40
H = 100

load_dotenv()
db_usr = getenv('DB_USR')
db_pass = getenv('DB_PASS')
db_host = getenv('DB_HOST')
db_name = getenv('DB_NAME')
load_start = datetime.strptime(getenv('LOAD_START'), STRPTIME_FORMAT)

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql://{db_usr}:{db_pass}@{db_host}/{db_name}?ssl=false'
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['JWT_TOKEN_LOCATION'] = ['cookies', 'headers']
app.config['JWT_SECRET_KEY'] = getenv('API_SECRET')
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['JWT_SESSION_COOKIE'] = False

db = SQLAlchemy(app)
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins="*")

from fanbasemarket.models import *

try:
    db.create_all()
except:
    pass


# Populate DB with NBA Teams
teams_all = teams.get_teams()
team_names = [(team['full_name'], team['abbreviation']) for team in teams_all]
for t_name, t_abr in team_names:
    q = Team.query.filter_by(name=t_name).all()
    if len(q) == 0:
        t_obj = Team(name=t_name, abr=t_abr)
        db.session.add(t_obj)
        db.session.commit()
        t_price = Teamprice(date=load_start, team_id=t_obj.id, elo=1500.00)
        db.session.add(t_price)
        db.session.commit()

prices = Teamprice.query.all()
if len(prices) == len(team_names):
    # Populate DB with historic results and prices
    schedules = get_schedule_range(load_start.year, datetime.today().year)
    for schedule in schedules:
        for game in schedule:
            home_name = capwords(game['home_team'].value)
            away_name = capwords(game['away_team'].value)
            start_time = game['start_time']
            home_score = game['home_team_score']
            away_score = game['away_team_score']
            if home_score is None:
                home_score = 0
            if away_score is None:
                away_score = 0
            home_team = Team.query.filter_by(name=home_name).first()
            away_team = Team.query.filter_by(name=away_name).first()
            game = Game(home=home_team.id, away=away_team.id, home_score=home_score,
                        away_score=away_score, start=start_time)
            db.session.add(game)
            db.session.commit()
            home_elo = Teamprice.query.filter_by(team_id=home_team.id).all()[-1].elo
            away_elo = Teamprice.query.filter_by(team_id=away_team.id).all()[-1].elo
            mov = home_score - away_score
            elo_delta = home_rating_change(home_elo - away_elo, K, int(mov > 0), mov, h=H,
                                           use_mov=True)
            new_home_price = Teamprice(date=start_time, team_id=home_team.id,
                                       elo=home_elo + elo_delta)
            db.session.add(new_home_price)
            db.session.commit()
            new_away_price = Teamprice(date=start_time, team_id=away_team.id,
                                       elo=away_elo - elo_delta)
            db.session.add(new_away_price)
            db.session.commit()
db.session.remove()

executor = Executor(app)

def get_db():
    if 'db' not in g:
        g.db = SQLAlchemy(app)
    return g.db

@app.teardown_appcontext
def teardown_db(exc):
    db = g.pop('db', None)
    if db is not None:
        db.session.remove()

from fanbasemarket.routes.auth import auth
from fanbasemarket.routes.users import users
# from fanbasemarket.routes.teams import teams


def create_app():
    app.register_blueprint(auth, url_prefix='/api/auth/')
    app.register_blueprint(users, url_prefix='/api/users/')
    # app.register_blueprint(teams, url_prefix='/api/teams/')
    return app

def send_new_prices():
    emit('prices', {'Chicago Bulls': 1500}, broadcast=True)
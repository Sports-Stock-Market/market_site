from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.orm import scoped_session, sessionmaker
from flask_jwt_extended import JWTManager
from nba_api.stats.static import teams
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from flask_executor import Executor
from dotenv import load_dotenv
from datetime import datetime, timedelta
from flask_cors import CORS
from string import capwords
from flask import Flask, g
from os import getenv

import pandas as pd
import string
import time
import csv
import math


STRPTIME_FORMAT = '%m/%d/%Y'
K = 40
H = 100

INJURIES = {'2019-11-01':[['Paul George', 'Clippers', 'Month']],
    '2019-10-25': [['Deandre Ayton', 'Suns', 'Month']],
    '2019-11-02':[['Stephen Curry', 'Warriors', 'Season']], 
    '2019-12-18':[['Karl-Anthony Towns', 'Timberwolves', 'Month']], 
    '2020-02-12':[['Karl-Anthony Towns', 'Timberwolves', 'Year']], 
    '2020-02-05':[['Tyler Herro', 'Heat', 'Month']], 
    '2019-11-16':[['Kyrie Irving', 'Nets', 'Month']],
    '2019-12-20':[['Norman Powell', 'Raptors', 'Month']], 
    '2019-10-23':[['Marvin Bagley III', 'Kings', 'Month']],
    '2020-01-22':[['Marvin Bagley III', 'Kings', 'Season']],
    '2020-01-24':[['Lauri Markkanen', 'Bulls', 'Month']], 
    '2020-01-31':[['Clint Capela', 'Hawks', 'Season'], ['Marc Gasol', 'Raptors', 'Season']], 
    '2019-11-15':[['Jonathan Isaac', 'Magic', 'Month']], 
    '2020-01-01':[['Jonathan Isaac', 'Magic', 'Season']], 
    '2020-03-05':[['Bradley Beal', 'Wizards', 'Season'], ['DeAndre Jordan', 'Nets', 'Season']],
    '2019-12-08':[['Rodney Hood', 'Trail Blazers', 'Season']],
    '2020-03-06':[['Pascal Siakam', 'Raptors', 'Season']],
    '2019-11-16':[['Nikola Jokic', 'Nuggets', 'Season']]
}

STARTING_ELOS = {
    '76ers': 1525, 'Bucks': 1575, 'Bulls': 1200, 'Cavaliers': 1000, 
    'Celtics': 1455, 'Clippers': 1600, 'Grizzlies': 1100, 'Hawks': 1200, 
    'Heat': 1325, 'Hornets': 1050, 'Jazz': 1475, 'Kings': 1250, 
    'Knicks': 1200, 'Lakers': 1580, 'Magic': 1200, 'Mavericks': 1300, 
    'Nets': 1350, 'Nuggets': 1450, 'Pacers': 1300, 'Pelicans': 1250,
    'Pistons': 1100, 'Raptors': 1345, 'Rockets': 1525, 'Spurs': 1300, 'Suns' : 1250,
    'Thunder': 1250, 'Timberwolves': 1200, 'Trail Blazers': 1415, 'Warriors': 1400,
    'Wizards': 1200
}

def get_starting_elo(tname):
    for k in STARTING_ELOS.keys():
        if k in tname:
            return STARTING_ELOS[k]

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

from fanbasemarket.models import *
from fanbasemarket.pricing.elo import simulate
from fanbasemarket.queries.team import set_player_rating

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
        p = get_starting_elo(t_name)
        t_obj = Team(name=t_name, abr=t_abr, price=p, prev_price=p)
        db.session.add(t_obj)
        db.session.commit()
        t_price = Teamprice(date=load_start, team_id=t_obj.id, elo=p)
        db.session.add(t_price)
        db.session.commit()

# load player data now
players_all = Player.query.all()
if len(players_all) == 0:
    df = pd.read_csv('player_data/new_2k_ratings.csv')
    for ix, row in df.iterrows():
        name = row['Name']
        pos1 = row['Primary']
        pos2 = '' if pd.isna(row['Secondary']) else row['Secondary']
        tid = Team.query.filter(Team.name.contains(row['Team'])).first().id
        init_mpg = row['MPG']
        rating = row['Rating']
        new_p = Player(name=name, rating=rating, initial_mpg=init_mpg, mpg=init_mpg, \
                       pos1=pos1, pos2=pos2, team_id=tid)
        db.session.add(new_p)
        db.session.commit()
    for team in Team.query.all():
        team.fs_rating = set_player_rating(team, db)
        team.rating = set_player_rating(team, db)
        db.session.add(team)
        db.session.commit()
    simulate(2019, 2020, 45, 100, True, INJURIES, db) 

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
from fanbasemarket.routes.teams import teams


def create_app():
    app.register_blueprint(auth, url_prefix='/api/auth/')
    app.register_blueprint(users, url_prefix='/api/users/')
    app.register_blueprint(teams, url_prefix='/api/teams/')
    return app

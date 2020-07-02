from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_utils import database_exists, create_database
from flask_jwt_extended import JWTManager
from sqlalchemy.orm import scoped_session, sessionmaker
from nba_api.stats.static import teams
from sqlalchemy import create_engine
from dotenv import load_dotenv
from datetime import datetime
from flask import Flask
from os import getenv

STRPTIME_FORMAT = '%m/%d/%Y'

load_dotenv()
db_usr = getenv('DB_USR')
db_pass = getenv('DB_PASS')
db_host = getenv('DB_HOST')
db_name = getenv('DB_NAME')
load_start = datetime.strptime(getenv('LOAD_START'), STRPTIME_FORMAT)

app = Flask(__name__)

app.config['JWT_TOKEN_LOCATION'] = ['json', 'cookies']
app.config['JWT_SECRET_KEY'] = getenv('API_SECRET')
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
jwt = JWTManager(app)

mysql_url = f'mysql://{db_usr}:{db_pass}@{db_host}/{db_name}?ssl=false'
engine = create_engine(mysql_url)
Session = scoped_session(sessionmaker(bind=engine))
session = Session()
Base = declarative_base()
Base.query = Session.query_property()
from fanbasemarket.models import Base, Team, Teamprice
if not database_exists(engine.url):
    create_database(engine.url)
Base.metadata.create_all(engine, checkfirst=True)

# Populate DB with NBA Teams
teams_all = teams.get_teams()
team_names = [team['full_name'] for team in teams_all]
for t_name in team_names:
    q = Team.query.filter_by(name=t_name).all()
    if len(q) == 0:
        t_obj = Team(name=t_name)
        session.add(t_obj)
        session.commit()
        t_price = Teamprice(date=load_start, team_id=t_obj.id, elo=1500.00)
        session.add(t_price)
        session.commit()

from fanbasemarket.routes.auth import auth


def create_app():
    app.register_blueprint(auth, url_prefix='/api/auth/')
    return app

from sqlalchemy_utils import database_exists, create_database
from flask_jwt_extended import JWTManager
from sqlalchemy.orm import sessionmaker
from fanbasemarket.models import Base
from sqlalchemy import create_engine
from dotenv import load_dotenv
from flask import Flask
from os import getenv

load_dotenv()
db_usr = getenv('DB_USR')
db_pass = getenv('DB_PASS')
db_host = getenv('DB_HOST')
db_name = getenv('DB_NAME')

app = Flask(__name__)

app.config['JWT_TOKEN_LOCATION'] = ['json', 'cookies']
app.config['JWT_SECRET_KEY'] = getenv('API_SECRET')
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
jwt = JWTManager(app)

mysql_url = f'mysql://{db_usr}:{db_pass}@{db_host}/{db_name}?ssl=false'
engine = create_engine(mysql_url)
if not database_exists(engine.url):
    create_database(engine.url)
Base.metadata.create_all(engine, checkfirst=True)
Session = sessionmaker(bind=engine)
session = Session()

from fanbasemarket.routes.auth import auth

def create_app():
    app.register_blueprint(auth, url_prefix='/api/auth/')
    return app


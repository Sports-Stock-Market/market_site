from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from dotenv import load_dotenv
from .models import Base
from flask import Flask
from os import getenv

load_dotenv()

db_usr = getenv('DB_USR')
db_pass = getenv('DB_PASS')
db_host = getenv('DB_HOST')
db_name = getenv('DB_NAME')

mysql_url = f'mysql://{db_usr}:{db_pass}@{db_host}/{db_name}?ssl=false'

engine = create_engine(mysql_url)
if not database_exists(engine.url):
    create_database(engine.url)
Base.metadata.create_all(engine, checkfirst=True)
Session = sessionmaker(bind=engine)
session = Session()

def create_app():
    app = Flask(__name__)
    return app


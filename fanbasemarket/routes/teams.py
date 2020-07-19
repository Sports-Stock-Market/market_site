from flask import Blueprint, request
from flask_cors import CORS, cross_origin
from fanbasemarket import app, get_db
from fanbasemarket.models import Team
from fanbasemarket.routes.utils import ok, bad_request
from fanbasemarket.queries.team import get_team_graph_points

teams = Blueprint('teams', __name__)
CORS(teams)


@teams.after_request
def creds(response):
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

@teams.route('allTeamData', methods=['GET'])
@cross_origin('http://localhost:3000/')
def all_team_data():
    with app.app_context():
        db = get_db()
        teams_all = Team.query.all()
        payload = {}
        for team in teams_all:
            d = {}
            d['graph'] = get_team_graph_points(team.id, db)
            d['price'] = d['graph']['1D'][-1]
            d['name'] = team.name
            payload[team.abr] = d
        return ok(payload)

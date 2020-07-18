from flask import Blueprint, request
from flask_cors import CORS, cross_origin
from fanbasemarket import app
from fanbasemarket.models import Team
from fanbasemarket.routes.utils import ok, bad_request
from fanbasemarket.queries.team import get_team_graph_points

teams = Blueprint('teams', __name__)
CORS(teams)


@teams.after_request
def creds(response):
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

@teams.route('/graphPts')
@cross_origin('http://localhost:3000/')
def gen_team_graph_pts():
    body = request.get_json()
    tname = body['team_name']
    with app.app_context():
        db = get_db()
        team = db.session.query(Team).filter(Team.name == tname).first()
        if team is None:
            return bad_request('no such team')
        return ok(get_team_graph_points(team.id, db))

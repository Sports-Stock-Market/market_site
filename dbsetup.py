from fanbasemarket import db
from fanbasemarket.models import *
from fanbasemarket.pricing.elo import simulate
from fanbasemarket.queries.team import set_player_rating
from nba_api.stats.static import teams
from os import getenv
import pandas as pd

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

STRPTIME_FORMAT = '%m/%d/%Y'
K = 40

H = 100

LOAD_START = datetime.strptime(getenv('LOAD_START'), STRPTIME_FORMAT)

def get_starting_elo(tname):
    for k in STARTING_ELOS.keys():
        if k in tname:
            return STARTING_ELOS[k]

db.create_all()

# Populate DB with NBA Teams
teams_all = teams.get_teams()
team_names = [(team['full_name'], team['abbreviation']) for team in teams_all]
for t_name, t_abr in team_names:
    p = get_starting_elo(t_name)
    t_obj = Team(name=t_name, abr=t_abr, price=p, prev_price=p)
    db.session.add(t_obj)
    db.session.commit()
    t_price = Teamprice(date=LOAD_START, team_id=t_obj.id, elo=p)
    db.session.add(t_price)
    db.session.commit()

# Load player data
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

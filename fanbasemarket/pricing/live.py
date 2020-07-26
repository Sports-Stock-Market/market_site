from requests import get
from nba_api.stats.static import teams
from fanbasemarket.pricing.nba_data import liveGame, mov_multiplier
from fanbasemarket.queries.team import update_teamPrice, set_teamPrice
from fanbasemarket.models import Team, Teamprice
from datetime import datetime

generate_url = lambda s: f'http://data.nba.net/10s/prod/v1/{s}/scoreboard.json'

def bigboy_pulls_only(db):
    k = 45
    h = 80
    today = datetime.utcnow()
    url = generate_url(today.strftime('%Y%m%d'))
    games = get(url).json()['games']
    nba_teams = teams.get_teams()
    prices = {}
    ret = []
    for game in games:
        l = {}
        l['start'] = game['startTimeUTC']
        l['is_on'] = game['isGameActivated']
        l['arena'] = game['arena']['name']
        ht, vt = game['hTeam'], game['vTeam']
        l['home_team'] = ht['triCode']
        l['away_team'] = vt['triCode']
        l['home_score'], l['away_score'] = ht['linescore'], \
                                           vt['linescore']
        home_score = 0.0 if ht['score'] == '' else float(ht['score'])
        away_score = 0.0 if vt['score'] == '' else float(vt['score'])
        l['score_margin'] = home_score - away_score
        l['period'] = game['period']['current']
        l['clock'] = game['clock']
        ret.append(l)
    results = []
    for i in ret:
        if not i['is_on']:
            continue
        home_abv = i['home_team']
        away_abv = i['away_team']
        home_tObj = Team.query.filter(Team.abr == home_abv).first()
        away_tObj = Team.query.filter(Team.abr == away_abv).first()
        score_margin = i['score_margin']
        period = i['period']
        clock = i['clock']
        if ':' in clock:
            for team in nba_teams:
                if str(team['abbreviation']) == home_abv:
                    home_team = str([team["nickname"]])
                    prices[home_team] = 0
                elif str(team['abbreviation']) == away_abv:
                    away_team = str([team["nickname"]])
                    prices[away_team] = 0
            home_elo = Teamprice.query.filter(Teamprice.team_id == home_tObj.id).filter(Teamprice.date <= i['start']).all()[-1].elo
            away_elo = Teamprice.query.filter(Teamprice.team_id == away_tObj.id).filter(Teamprice.date <= i['start']).all()[-1].elo
            i_home_win_prob = 1/(1+10**((away_elo - home_elo - h)/400))
            i_away_win_prob = 1 - i_home_win_prob
            minutes = float(clock[:clock.index(":")])
            seconds = float(clock[clock.index(":")+1:])
            since_period = round(minutes + (seconds /60.0), 2)
            time_left_in_q = 12 - since_period
            if period <= 4: 
                time_elapsed = ((period)-1) * 12 + (time_left_in_q)
            else:
                time_elapsed = 48 + ((period - 4) * 5 - since_period)
            
            live_prob = liveGame(time_elapsed, score_margin, i_home_win_prob, period)
            if score_margin > 0:
                proj_mov = score_margin * live_prob/100
            else:
                proj_mov = -score_margin * (1-live_prob/100)
            marginofv = mov_multiplier(home_elo, away_elo, proj_mov)
            elo_change = k * marginofv * ((live_prob - (i_home_win_prob*100))/100)
            set_teamPrice(home_tObj, home_elo + elo_change, today, db)
            results.append({home_abv: {'date': str(today), 'price': new_home_elo}})
            set_teamPrice(away_tObj, away_elo - elo_change, today, db)
            results.append({away_abv: {'date': str(today), 'price': new_away_elo}})
        else:
            print(clock)
    return results
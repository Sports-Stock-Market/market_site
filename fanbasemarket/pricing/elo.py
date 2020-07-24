from datetime import datetime, timedelta
from string import capwords
from fanbasemarket.pricing.utils import get_schedule_range
from fanbasemarket.queries.team import update_teamPrice
from fanbasemarket.queries.player import new_injury_mins
from fanbasemarket.models import Player, Team

def proj_home_win_pct(h, elo_diff):
    '''probability of home team winning based on elo ratings'''
    return 1 / (10 ** ((-elo_diff - h) / 400) + 1)

def mov_multiplier(score_diff, elo_diff):
    '''determines the factor a resulting elo change should be scaled by based on margin of victory'''
    mov = score_diff if elo_diff > 0 else -score_diff  # negative mov if lower rating wins
    return ((abs(mov) + 3) ** 0.8) / (0.006 * mov + 7.5)

def home_rating_change(k, h, score_diff, elo_diff, use_mov=False):
    '''change in elo to home team (opposite change to away) after a game result'''
    if use_mov:
        return k * mov_multiplier(score_diff, elo_diff) * ((score_diff > 0) - proj_home_win_pct(h, elo_diff))
    return k * ((score_diff > 0) - proj_home_win_pct(h, elo_diff))

def season_elo_reset(team, date, db):
    newprice = (.75 * team.price) + 375
    update_teamPrice(team, newprice - team.price, date, db)

def apply_injury(team, player_name, duration, date, db):
    end_of_season = datetime.strptime('2020-03-08', '%Y-%m-%d')
    days_left = (end_of_season - date).days
    # injure player
    inj_player = Player.query.filter(Player.name==player_name).first()
    inj_player.is_injured = True
    inj_mpg = inj_player.mpg
    inj_player.mpg = 0
    db.session.add(inj_player)
    db.session.commit()
    # rebalance minutes
    players = Player.query.filter(Player.team_id==team.id).all()
    total_rating = sum([player.rating for player in players])
    for player in players:
        if not player.is_injured:
            if inj_player.pos2 != '':
                if player.pos1 == inj_player.pos1:
                    player.mpg += (player.rating / total_rating) * (inj_mpg * .4225)
                if player.pos2 == inj_player.pos1:
                    player.mpg += (player.rating / total_rating) * (inj_mpg * .2275)
                if player.pos1 == inj_player.pos2:
                    player.mpg += (player.rating / total_rating) * (inj_mpg * .2275)
                if player.pos2 == inj_player.pos2:
                    player.mpg += (player.rating / total_rating) * (inj_mpg * .1225)
            else:
                if player.pos1 == inj_player.pos1:
                    player.mpg = inj_mpg * .65
                if player.pos2 == inj_player.pos1:
                    player.mpg = inj_mpg * .35
            if player.mpg > 35.5:
                player.mpg = 35.5
            db.session.add(player)
            db.session.commit()
    sev = 100 * (team.fs_rating - team.rating) / team.fs_rating
    if duration == 'Day':
            sev = sev * .1
    elif duration == 'Week':
        sev = sev * .225
    elif duration == 'Month':
        sev = sev * .5
    else:
        sev = sev * .69
    if days_left < 100 and duration == 'Month':
        sev = sev + ((100 -days_left) * .1)

    if days_left < 70 and duration == 'Week':
        print("Initial Sev: " + str(sev))
        sev = sev + ((70 - days_left) * .2)
    
    if days_left < 63 and duration == 'Day':
        print("Initial Sev: " + str(sev))
        sev = sev + ((63 - days_left) * .2)
    update_teamPrice(team, (1 - (sev / 100)) - team.price, date, db)

def recover_from_injury(team, player_name, db):
    inj_player = Player.query.filter(Player.name==player_name).first()
    inj_player.mpg = inj_player.initial_mpg
    db.session.add(inj_player)
    db.session.commit()
    players = Player.query.filter(Player.team_id==team.id).all()
    for player in players:
        if player.pos1 == inj_player.pos1 or player.pos2 == inj_player.pos1 or \
           player.pos1 == inj_player.pos2 or player.pos2 == inj_player.pos2:
           player.mpg = player.initial_mpg
           db.session.add(player)
           db.session.commit()

def simulate(start_yr, end_yr, k, h, use_mov, injuries, db):
    active_injuries = []
    for season in get_schedule_range(start_yr, end_yr):
        teams = Team.query.all()
        season_start = season[0]['start_time']
        for team in teams:
            season_elo_reset(team, season_start, db)
        prev_date = season_start - timedelta(days=1)
        for game in season:
            if game['home_team_score'] is None:
                continue
            date_obj = game['start_time'].replace(tzinfo=None)
            date = date_obj.strftime('%Y-%m-%d')
            if date != prev_date:
                new = []
                for d, active_inj in active_injuries:
                    if date_obj < d:
                        new.append((d, active_inj))
                    else:
                        inj_team = Team.query.filter(Team.name.contains(injury[1])).first()
                        recover_from_injury(team, injury[0], db)
                active_injuries = new
                if date in injuries.keys():
                    for injury in injuries[date]:
                        inj_team = Team.query.filter(Team.name.contains(injury[1])).first()
                        apply_injury(team, injury[0], injury[2], date_obj, db)
                        if injury[2] == 'Day':
                            ret_d = date_obj + timedelta(days=1)
                        elif injury[2] == 'Week':
                            ret_d = date_obj + timedelta(weeks=1)
                        else:
                            ret_d = date_obj + timedelta(weeks=4) 
                        active_injuries.append((ret_d, injury))
            home_tname = capwords(game['home_team'].name.replace('_', ' '))
            away_tname = capwords(game['away_team'].name.replace('_', ' '))
            home_team = Team.query.filter(Team.name==home_tname).first()
            away_team = Team.query.filter(Team.name==away_tname).first()
            score_diff = int(game['home_team_score']) - int(game['away_team_score'])
            elo_diff = home_team.price - away_team.price
            elo_change = home_rating_change(k, h, score_diff, elo_diff, use_mov)
            update_teamPrice(home_team, elo_change, date_obj, db)
            update_teamPrice(away_team, -elo_change, date_obj, db)
            prev_date = date

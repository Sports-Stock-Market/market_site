from nba_api.stats.endpoints import leaguedashplayerstats, playbyplay, leaguegamefinder, winprobabilitypbp
from nba_api.stats.static import teams
from basketball_reference_web_scraper import client
from basketball_reference_web_scraper.data import OutputType
import pandas as pd
from os import listdir, mkdir
from csv import writer, reader
import matplotlib.pyplot as plt
import matplotlib.axes as ax
import requests

# rapid api info
headers = {
    'x-rapidapi-host': "api-nba-v1.p.rapidapi.com",
    'x-rapidapi-key': "55efa7661cmsh31358981baa365cp127e45jsne5a56fb694d0"
}
base_url = "https://api-nba-v1.p.rapidapi.com/"

# date should be provided in the form yyyy-mm-dd
def get_games_on_date(date):
    url = '{}/games/date/{}'.format(base_url, date)
    response = requests.request('GET', url, headers=headers).json()
    if response['api']['status'] == 404:
        raise ValueError(response['api']['message'])
    games = response['api']['games']
    return games

# functions to pull and read CSVs 
format_year = lambda yr: '{}-{}'.format(yr-1, str(yr)[-2:])
def get_schedule_df(end_yr):

    if 'schedules' not in listdir('.'):
        mkdir('schedules')
    fname = '{}-{}_schedule.csv'.format(end_yr-1, str(end_yr)[-2:])
    path = f'schedules/{fname}'
    if fname not in listdir('schedules'):
        client.season_schedule(season_end_year=end_yr,
                               output_type=OutputType.CSV,
                               output_file_path=path)
    return pd.read_csv(path)

def get_schedule_range_df(start_yr, end_yr):
    return [get_schedule_df(yr) for yr in range(start_yr+1, end_yr+1)]

def players_stats_from(end_yr):
    return leaguedashplayerstats.LeagueDashPlayerStats(measure_type_detailed_defense='Advanced', season=format_year(end_yr)).get_data_frames()[0]

def getPbpCSV(gameid):
    return playbyplay.PlayByPlay(gameid).get_data_frames()[0].to_csv('./game_data/playbyplay.csv')

def winprobCSV(game_id):
    return winprobabilitypbp.WinProbabilityPBP(game_id).get_data_frames()[0].to_csv('./game_data/winprob.csv')
    #winprob = pd.read_csv("winprob.csv")
    #winprob['HOME_PCT'] = winprob['HOME_PCT'].astype(float)
    #winprob['VISITOR_PCT'] = winprob['VISITOR_PCT'].astype(float)
    #return winprob['HOME_PCT'], winprob['VISITOR_PCT']

#Minute model functions
def get_player_mpg(name):
    stats_df = pd.read_csv("./player_data/mpgfile.csv")
    arr = stats_df.loc[stats_df['PLAYER_NAME'] == name]['MIN'].values
    if len(arr) > 0:
        return arr[0]
    return 0

def add_2k_minutes():
    path = "./player_data/2k_ratings.csv"
    new_path = "./player_data/new_2k_ratings.csv"
    with open(path, 'r') as read_obj, \
        open(new_path, 'w', newline='') as write_obj:
        csv_reader = reader(read_obj)
        csv_writer = writer(write_obj)
        for row in csv_reader:
            row.append(str(get_player_mpg(row[0])))
            csv_writer.writerow(row)

#Live changes
def mov_multiplier(h_elo, a_elo, score_margin):
    mov = score_margin if h_elo - a_elo > 0 else -score_margin
    return ((abs(mov) + 3) ** 0.8) / (0.006 * mov + 7.5)

def getDateInfo(date, gameonday):
    game = {}
    all_elo = pd.read_csv("./sim_data/2019-2020_data.csv")
    nba_teams = teams.get_teams()
    all_games = pd.read_csv("./game_data/allgames.csv",dtype={"GAME_ID":"string"})
    all_games = all_games[['GAME_ID', 'GAME_DATE', "MATCHUP"]]
    on_date = all_games[all_games["GAME_DATE"] == date]
    on_date = on_date[~on_date["MATCHUP"].str.contains("vs.")]
    for i, gamez in on_date.iterrows():
        words = gamez["MATCHUP"].split(" ")
        gameid = gamez["GAME_ID"]
        home_team=[]
        away_team=[]
        for team in nba_teams:
            team_elo = float(all_elo.loc[all_elo['Date'] == date][team["nickname"]].values)
            if str(team['abbreviation']) == words[2]:
                home_team = [team["nickname"], team_elo]
            elif str(team['abbreviation']) == words[0]:
                away_team = [team["nickname"], team_elo]
        game_info = [*home_team, *away_team]
        game[gameid] = game_info
        game = removeGLeague(game)
    nbagameids = []
    for i in game.keys():
        nbagameids.append(i)
    values = game.values()
    values_list = list(values)
    home_elo = int(values_list[gameonday][1])
    away_elo = int(values_list[gameonday][3])
    h_elo_prob = 1/(1+10**((away_elo - home_elo - 100)/400))
    a_elo_prob = 1 - h_elo_prob
    return home_elo,away_elo,h_elo_prob,a_elo_prob, nbagameids[gameonday]

def playbyplay_scores(game_id):
    pbp = pd.read_csv("./game_data/playbyplay.csv")
    scores_list = []
    pbp = pbp[['SCORE', 'PCTIMESTRING', "PERIOD", "SCOREMARGIN"]]
    pbp = pbp[pbp["SCOREMARGIN"].notna()]
    #pbp["SCOREMARGIN"] = pbp["SCOREMARGIN"].map(lambda s: int(s[0])-int(s[-1]))
    for i, game in pbp.iterrows():
        minutes = float(game["PCTIMESTRING"][:game["PCTIMESTRING"].index(":")])
        seconds = float(game["PCTIMESTRING"][game["PCTIMESTRING"].index(":")+1:])
        since_period = round(minutes + (seconds /60.0), 1)
        if float(game["PERIOD"]) <= 4: 
            time_elapsed = ((float(game["PERIOD"])-1) * 12 + (12 - since_period))
        elif float(game["PERIOD"]) == 5:
            time_elapsed = ((float(game["PERIOD"])-1) * 12 + (5 - since_period))
        else:
            time_elapsed = ((float(game["PERIOD"])-1) * 12 + (5 - since_period) + 5)


        if game["SCOREMARGIN"] == "TIE":
            game["SCOREMARGIN"] = 0
        scores_list.append((time_elapsed,int(game["SCOREMARGIN"])))
    return scores_list

def removeGLeague(d):
    for i in d.keys():
        if not d[i]:
            d.pop(i)
            break
    return d

def liveGame(time_elapsed, score_margin, initial_prob):
    #initial_prob = 40
    time_left = 48 - time_elapsed
    score_margin_noabs = round(score_margin,2)
    score_margin_nocap = score_margin
    if score_margin < 0:
        score_margin = abs(score_margin)
        score_margin_nocap = abs(score_margin_nocap)
        initial_prob = 100 - initial_prob
        team = "Away leads by: " + str(score_margin)
    else:
        team = "Home leads by: " + str(score_margin)

    if initial_prob > 50:
        y_int = ( ( ( (initial_prob - 50) /47) * (time_left - 48) ) + initial_prob)*10
    else:
        y_int = ( ( ( (initial_prob - 50) /47) * (time_left - 48) ) + initial_prob)*10


    if time_left >= 41:
        live_w = (12.466 * score_margin) + y_int
    elif time_left >= 34:
        live_w = (15.61 * score_margin) + y_int
    elif time_left >= 27:
        live_w = (-0.4924 * ((score_margin)**2)) + (30.235 * score_margin) + y_int
    elif time_left >= 20:
        live_w = (-0.7378 * (score_margin)**2) + (38.449 * score_margin) + y_int
    elif time_left >= 13:
        live_w = (-0.8934 * (score_margin) ** 2) + 42.765 * score_margin + y_int
    elif time_left >= 6:
        live_w = (-1.0865 * (score_margin) **2) + (47.695 * score_margin) + y_int
    elif time_left >= 2:
        if score_margin >=4:
            score_margin = score_margin * 1.5
            if score_margin >= 18.974:
                score_margin = 18.974
        
        live_w = (-1.4237 * ((score_margin) **2)) + (54.695 * score_margin) + y_int
    elif time_left > 0:
        if score_margin >=4:
            score_margin = score_margin * 2.5
            if score_margin >= 18.974:
                score_margin = 18.974
        
        live_w = (-1.4237 * ((score_margin) **2)) + (54.695 * score_margin) + y_int

    elif time_left == 0:
        live_w = 1000

    if live_w > 999:
     live_w = 999

    if score_margin_noabs < 0:
        return round((100 - live_w/10),2)
    else:
        return round(live_w/10,2)

def fullGame(date, gameonday, k):
    alldata = getDateInfo(date, gameonday)
    initial_prob = alldata[2]*100
    getPbpCSV(alldata[-1])
    scores = playbyplay_scores(alldata[-1])
    print(scores)
    pct = [{"Time Remaining": 48.0, "Odds to win": initial_prob}]
    elos = [{"Time Remaining": 48.0, "Home Team": alldata[0], "Away Team": alldata[1]}]
    for pair in scores:
        time_remaining = round(48 - pair[0],2)
        liveprobs = liveGame(pair[0], pair[1],initial_prob)
        if pair[1] > 0:
            proj_mov = pair[1] * liveprobs/100
        else:
            proj_mov = -pair[1] * (1-liveprobs/100)
        marginofv = mov_multiplier(alldata[0], alldata[1], proj_mov)
        elo_change = k * marginofv * ((liveprobs - initial_prob)/100)
        elos.append({"Time Remaining": time_remaining, "Home Team": alldata[0] + elo_change, "Away Team": alldata[1] - elo_change})
        pct.append({"Time Remaining" : time_remaining,"Odds to win": liveprobs})
    full_prob = sorted(pct, key = lambda i: i['Time Remaining'])
    full_elo = sorted(elos, key = lambda i: i['Time Remaining'])
    probs_df = pd.DataFrame(full_prob)
    ax1 = probs_df.plot(x = "Time Remaining", y = "Odds to win", kind = "line")
    ax1.set(xlim = (0,48), ylim = (0,110))
    elo_df = pd.DataFrame(full_elo)
    ax = elo_df.plot(x = "Time Remaining", y = "Home Team", kind = "line")
    plt.show()


#fullGame("0021900925")
#getDateInfo("2020-02-29", 1)
#h_elo_prob = 1/(1+10**((away_elo - home_elo)/400))
#celtics = 1/(1+10**((1669 - 1558)/400))
#heat = 1/(1+10**((1377 - 1542)/400))
#print(heat)
#a_elo_prob = 1/(1+10**((home_elo - away_elo)/400))
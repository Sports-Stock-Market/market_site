from datetime import datetime

def find(sorted_list, team_name):
    low = 0
    high = len(sorted_list) - 1
    while low <= high:
        middle = (low + high)//2
        if sorted_list[middle].name == team_name:
            return sorted_list[middle]
        elif sorted_list[middle].name > team_name:
            high = middle - 1
        else:
            low = middle + 1
    return -1

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

class Team:
    '''
    a class of information about an NBA team

    ...

    Attributes
    ----------
    name : string
        string representation of team name
    players : list of player objects, optional (default = [])
        list of all players on team
    elo_rating : float (default = 1500.00)
        team strength rating provided updated by elo formulas

    Methods
    -------
    season_elo_reset(game)
        weighted average of elo with mean elo to start new season 

    '''

    def __init__(self, name, players=[], elo_rating=1500.00):
        self.name = name
        self.players = players
        self.positions = {}
        self.elo_rating = elo_rating
        self.fs_player_rating = 0
        self.player_rating = 0

    def __str__(self):
        return self.name
    
    def __repr__(self):
        return self.name

    def __eq__(self, other):
        return self.name == other.name
    
    def __lt__(self, other):
        return self.name < other.name

    def update_elo(self, change):
        self.elo_rating = round(self.elo_rating + change, 2)

    def season_elo_reset(self):
        ''' weighted average of elo with mean elo to start new season '''
        self.elo_rating = round((0.75 * self.elo_rating) + 375, 2)

    def setup(self):
        self.set_player_pos()
        self.fs_player_rating = self.update_player_rating()

    def set_player_pos(self):
        positions = {'PG': [], 'PG2': [], 'SG': [], 'SG2': [], 'SF': [], 'SF2': [], 'PF': [], 'PF2': [], 'C': [], 'C2': []}
        for player in self.players:
            positions[player.prim_pos].append(player)
            if player.sec_pos:
                positions[player.sec_pos + '2'].append(player)
        self.positions = positions
        return positions

    def update_player_rating(self):
        rating = sum([player.rating * player.mpg for player in self.players])
        return rating

    def new_injury_mins(self, player):
        new_mins = {}
        if player.sec_pos:
            new_mins[player.prim_pos] = player.mpg * 0.4225
            new_mins[player.prim_pos + '2'] = player.mpg * 0.2275
            new_mins[player.sec_pos] = player.mpg * 0.2275
            new_mins[player.sec_pos + '2'] = player.mpg * 0.1225
        else:
            new_mins[player.prim_pos] = player.mpg * 0.65
            new_mins[player.prim_pos + '2'] = player.mpg * 0.35
        return new_mins

    def injury(self, injury):
        # if running for anything other than 2020 season, change last_day accordingly
        last_day = datetime.strptime('2020-03-08', '%Y-%m-%d')
        days_left = (last_day-injury[3]).days
        #print(days_left)
        self.reset_players()
        for i,player in enumerate(self.players):
            if player.name == injury[0]:
                self.print_mpg()
                self.players[i].is_injured = True
                break
        self.rebalance_minutes()
        self.print_mpg()
        sev = round(100 *(self.fs_player_rating - self.player_rating)/self.fs_player_rating, 2)
        if injury[2] == 'Day':
            sev = sev * .1
        elif injury[2] == 'Week':
            sev = sev * .225
        elif injury[2] == 'Month':
            sev = sev * .5
        else:
            sev = sev * .69
            #sev *= days_left/250
            #sev = sev + sev * days_left/350
        

        if days_left < 100 and injury[2] == 'Month':
            sev = sev + ((100 -days_left) * .1)

        if days_left < 70 and injury[2] == 'Week':
            print("Initial Sev: " + str(sev))
            sev = sev + ((70 - days_left) * .2)
        
        if days_left < 63 and injury[2] == 'Day':
            print("Initial Sev: " + str(sev))
            sev = sev + ((63 - days_left) * .2)
            
        print(sev)

       # print(self.elo_rating)
        self.elo_rating *= (1 - (sev/100))
        #print(self.elo_rating)

    def add_position_mins(self, pos, mins):
        players = self.positions[pos]
        total_rating = sum([player.rating for player in players])
        for player in players:
            if not player.is_injured:
                player.mpg += (player.rating/total_rating) * mins
                if player.mpg > 35.5:
                    player.mpg = 35.5
    
    def rebalance_minutes(self):
        for player in self.players:
            if player.is_injured:
                new_mins = self.new_injury_mins(player)
                player.mpg = 0
                for pos in new_mins.keys():
                    self.add_position_mins(pos, new_mins[pos])
        self.player_rating = self.update_player_rating()

    def print_mpg(self):
        for player in self.players:
            pass
            #print(player.name, player.rating, player.prim_pos, player.sec_pos, player.mpg)

    def reset_players(self):
        for player in self.players:
            player.is_injured = False
            player.mpg = player.init_mpg

class Player:
    def __init__(self, name, rating, mpg, team, prim_pos, sec_pos="", is_injured=False):
        self.name = name
        self.rating = rating
        self.init_mpg = mpg
        self.mpg = mpg
        self.prim_pos = prim_pos
        self.sec_pos = sec_pos
        self.team = team
        self.is_injured = is_injured

    def __str__(self):
        return self.name
    
    def __repr__(self):
        return self.name
    
    def __eq__(self, other):
        return self.name == other.name
    
    def __lt__(self, other):
        return self.name < other.name

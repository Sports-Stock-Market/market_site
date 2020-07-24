from fanbasemarket.models import Player

def new_injury_mins(player):
    new_mins = {}
    if player.pos2 != '':
        new_mins[player.pos1] = player.mpg * 0.4225
        new_mins[player.pos1 + '2'] = player.mpg * 0.2275
        new_mins[player.pos2] = player.mpg * 0.2275
        new_mins[player.pos2 + '2'] = player.mpg * 0.1225
    else:
        new_mins[player.pos1] = player.mpg * 0.65
        new_mins[player.pos1 + '2'] = player.mpg * 0.35
    return new_mins
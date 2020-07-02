def proj_home_win_pct(game, h=0):
    '''probability of home team winning based on elo ratings'''
    return 1 / (10 ** ((-game.elo_diff - h) / 400) + 1)


def mov_multiplier(game):
    '''determines the factor a resulting elo change should be scaled by based on margin of victory'''
    mov = game.mov if game.elo_diff > 0 else -game.mov  # negative mov if lower rating wins
    return ((abs(mov) + 3) ** 0.8) / (0.006 * mov + 7.5)


def home_rating_change(game, k, use_mov=False):
    '''change in elo to home team (opposite change to away) after a game result'''
    h_w_pct = proj_home_win_pct(game)
    if use_mov:
        return k * mov_multiplier(game) * (game.result - h_w_pct)
    return k * (game.result - h_w_pct)

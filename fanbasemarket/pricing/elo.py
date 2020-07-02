def proj_home_win_pct(elo_diff, h=0):
    '''probability of home team winning based on elo ratings'''
    return 1 / (10 ** ((-elo_diff - h) / 400) + 1)


def mov_multiplier(elo_diff, mov_):
    '''determines the factor a resulting elo change should be scaled by based on margin of victory'''
    mov = mov_ if elo_diff > 0 else -mov_  # negative mov if lower rating wins
    return ((abs(mov) + 3) ** 0.8) / (0.006 * mov + 7.5)


def home_rating_change(elo_diff, k, result, mov, use_mov=False, h=0):
    '''change in elo to home team (opposite change to away) after a game result'''
    h_w_pct = proj_home_win_pct(elo_diff, h)
    if use_mov:
        return k * mov_multiplier(elo_diff, mov) * (result - h_w_pct)
    return k * (result - h_w_pct)

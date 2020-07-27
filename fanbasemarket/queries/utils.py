from datetime import datetime, timedelta

def get_graph_x_values():
    now = datetime.utcnow()
    beginning_of_day = datetime(now.year, now.month, now.day)
    week_ago = beginning_of_day - timedelta(weeks=1)
    month_ago = beginning_of_day - timedelta(weeks=4)
    beginning_of_szn = datetime(2019, 10, 23)
    x_values = {
        '1D': [],
        '1W': [],
        '1M': [],
        'SZN': []
    }
    while beginning_of_szn <= beginning_of_day:
        x_values['SZN'].append(beginning_of_szn)
        beginning_of_szn += timedelta(weeks=1)
    while month_ago <= beginning_of_day:
        x_values['1M'].append(month_ago)
        month_ago += timedelta(days=1)
    while week_ago <= beginning_of_day:
        x_values['1W'].append(week_ago)
        week_ago += timedelta(days=1)
    while beginning_of_day <= now:
        x_values['1D'].append(beginning_of_day)
        beginning_of_day += timedelta(minutes=5)
    return x_values
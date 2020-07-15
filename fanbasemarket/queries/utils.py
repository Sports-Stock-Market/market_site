from datetime import datetime, timedelta

def get_graph_x_values():
    now = datetime.utcnow()
    beginning_of_day = datetime(now.year, now.month, now.day)
    week_ago = beginning_of_day - timedelta(weeks=1)
    month_ago = beginning_of_day - timedelta(weeks=4)
    beginning_of_year = datetime(now.year, 1, 1)
    x_values = []
    while beginning_of_year <= beginning_of_day:
        x_values.append(beginning_of_year)
        beginning_of_year += timedelta(weeks=1)
    while month_ago <= beginning_of_day:
        x_values.append(month_ago)
        month_ago += timedelta(days=1)
    while week_ago <= beginning_of_day:
        x_values.append(week_ago)
        week_ago += timedelta(days=1)
    while beginning_of_day <= now:
        x_values.append(beginning_of_day)
        beginning_of_day += timedelta(hours=0.5)
    return [str(d) for d in sorted(x_values)]
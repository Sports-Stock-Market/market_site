from basketball_reference_web_scraper import client


def get_schedule_range(start_yr, end_yr):
    schedules = []
    for year in range(start_yr + 1, end_yr + 1):
        try:
            schedule = client.season_schedule(season_end_year=year)
            schedules.append(schedule)
        except:
            pass
    return schedules

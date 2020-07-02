from basketball_reference_web_scraper import client


def get_schedule_range(start_yr, end_yr):
    return [client.season_schedule(season_end_year=yr) for
            yr in range(start_yr+1, end_yr+1)]

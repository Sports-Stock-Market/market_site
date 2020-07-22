from setuptools import setup

setup(
    name='fanbasemarket',
    packages=['fanbasemarket'],
    include_package_data=True,
    install_requires=[
        'flask',
        'werkzeug',
        'setuptools',
        'sqlalchemy',
        'sqlalchemy-utils',
        'flask-jwt-extended',
        'python-dotenv',
        'nba-api',
        'basketball_reference_web_scraper',
        'flask-cors',
        'flask-executor',
        'flask-socketio'
    ],
)

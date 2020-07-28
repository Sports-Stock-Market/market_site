heroku addons:create cleardb:ignite
server: gunicorn wsgi:app
web: cd frontend && npm start
initdb: python dbsetup.py
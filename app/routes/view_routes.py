from flask import Flask, render_template, flash, redirect, url_for
from app import app
from flask import request, g
from werkzeug.urls import url_parse
from sqlalchemy.sql import exists, operators

@app.before_request
def global_user():
    g.user = current_user

@app.context_processor
def template_user():
    try:
        return {'user': g.user}
    except AttributeError:
        return {'user': None}


@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET', 'POST'])
def index():
    flash('hello friend')

    return render_template('index.html', title='Home')


@app.route('/portfolio', methods=['GET', 'POST'])
def portfolio():
    flash('welcome to portfolio, friend')

    return render_template('portfolio.html', title='Portfolio')

@app.route('/short', methods=['GET', 'POST'])
def short():
    flash('welcome to shorting, friend')
    
    return render_template('short.html', title='Short')


@app.route('/post', methods=['GET', 'POST'])
def post():
    flash('welcome to posting, friend')

    return render_template('post.html', title = 'Post')

@app.route('/marketplace', methods=['GET', 'POST'])
def marketplace():
    flash('welcome to marketplace, friend')
    
    return render_template('marketplace.html', title = 'Marketplace')

@app.route('/search', methods=['GET', 'POST'])
def search():
    flash('welcome to search, friend')
    
    return render_template('search.html', title = 'Search')

@app.route('/rankings', methods=['GET', 'POST'])
def rankings():
    flash('welcome to rankings, friend')
    
    return render_template('rankings.html', title = 'Rankings')


@app.route('/prices', methods=['GET', 'POST'])
def prices():
    flash('welcome to team prices, friend')

    return render_template('prices.html', title = 'Team Prices')


@app.route('/myposts', methods=['GET', 'POST'])
def myposts():
    flash('welcome to your posts, friend')

    return render_template('myposts.html', title = 'My Offers')
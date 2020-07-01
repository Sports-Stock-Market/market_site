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
        'flask-jwt-extended'
    ],
)

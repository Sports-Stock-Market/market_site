from flask import Response
from json import dumps

def bad_request(msg):
    r = Response(dumps({'message': msg}))
    r.status_code = 400
    return r


def ok(dict_payload, created=False):
    payload = dumps(dict_payload)
    r = Response(payload)
    r.status_code = 201 if created else 200
    return r

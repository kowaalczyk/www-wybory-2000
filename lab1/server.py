import sqlite3
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from json import dumps


# config
db_file = 'db/lab1_dev.db'

# setup
app = Flask(__name__)
api = Api(app)


#helpers

def get_cursor():
    conn = sqlite3.connect(db_file)
    conn.row_factory = dict_factory
    return conn.cursor()

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


# resources

class ListaWojewodztw(Resource):
    def get(self):
        cur = get_cursor()
        cur.execute('select * from wojewodztwa order by Kod_wojewodztwa asc')
        rows = cur.fetchall()
        return jsonify(rows)

class ListaOkregow(Resource):
    def get(self):
        cur = get_cursor()
        cur.execute('select distinct Nr_okr from kraj order by Nr_okr asc')
        rows = cur.fetchall()
        list = ["Okręg numer {}".format(d['Nr_okr']) for d in rows]
        return jsonify(list)

class ListaGmin(Resource):
    def get(self):
        cur = get_cursor()
        cur.execute('select distinct Kod_gminy, gmina from kraj order by Kod_gminy asc')
        rows = cur.fetchall()
        return jsonify(rows)

# class Ogolne(Resource):
#     # TODO
#
# class Swiat(Resource):
#     # TODO
#
# class Kraj(Resource):
#     # TODO
#
# class Wojewodtwo(Resource):
#     # TODO

class Okreg(Resource):
    def get(self, id):
        print("Got okreg request with id={}".format(id))
        return jsonify({"id": id})
    # TODO: This is just a test, remove

# class Gmina(Resource):
#     # TODO


# routes

# api.add_resource(Ogolne, '/')
# api.add_resource(Swiat, '/swiat')
# api.add_resource(Kraj, '/kraj')
# api.add_resource(Wojewodztwo, '/wojewodztwo/<int:id>')
api.add_resource(Okreg, '/okreg/<int:id>')
# api.add_resource(Gmina, '/gmina/<int:id>')
api.add_resource(ListaWojewodztw, '/listy/wojewodztwa')
api.add_resource(ListaOkregow, '/listy/okregi')
api.add_resource(ListaGmin, '/listy/gminy')


#server

app.run(port=2137)
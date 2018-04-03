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

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


# resources

class ListaWojewodztw(Resource):
    def get(self):
        conn = sqlite3.connect(db_file)
        conn.row_factory = dict_factory
        cur = conn.cursor()
        cur.execute('select * from wojewodztwa')
        rows = cur.fetchall()
        for row in rows:
            print(row)
        return jsonify(rows)
#
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


#server

app.run(port=2137)
import sqlite3
from flask import Flask, jsonify
from flask_restful import Resource, Api


# config
db_file = 'db/lab1_dev.db'
candidate_name_labels = [
    'Dariusz_Maciej_GRABOWSKI',
    'Piotr_IKONOWICZ',
    'Jarosław_KALINOWSKI',
    'Janusz_KORWIN-MIKKE',
    'Marian_KRZAKLEWSKI',
    'Aleksander_KWAŚNIEWSKI',
    'Andrzej_LEPPER',
    'Jan_ŁOPUSZAŃSKI',
    'Andrzej_Marian_OLECHOWSKI',
    'Bogdan_PAWŁOWSKI',
    'Lech_WAŁĘSA',
    'Tadeusz_Adam_WILECKI'
]

# setup
app = Flask(__name__)
api = Api(app)


# helpers

def get_cursor():
    conn = sqlite3.connect(db_file)
    conn.row_factory = dict_factory
    return conn.cursor()


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


def sum_query_string(with_total=False):
    arr = ["sum(\"{}\")".format(x) for x in candidate_name_labels]
    if (with_total):
        arr.append('sum(Głosy_ważne)')
    return ', '.join(arr)


# resources TODO: add error handling everywhere !!!

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
        ret = [d['Nr_okr'] for d in rows]
        return jsonify(ret)


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
class Kraj(Resource):
    def get(self):
        cur = get_cursor()

        # main query
        query = "select {} from kraj".format(sum_query_string(with_total=True))
        cur.execute(query)
        rows = cur.fetchall()

        # last item in rows is a sum of all
        normal_data = list(rows[0].values())[:-1]
        sum_votes = list(rows[0].values())[-1]
        percent_data = [float("{0:2.2f}".format(100 * x / sum_votes)) for x in normal_data]

        # sub-category query
        query = "select min(wojewodztwa.nazwa), {} from kraj left join wojewodztwa " \
                "on kraj.Kod_wojewodztwa = wojewodztwa.Kod_wojewodztwa " \
                "group by wojewodztwa.Kod_wojewodztwa " \
                "order by wojewodztwa.Kod_wojewodztwa asc".format(sum_query_string())
        cur.execute(query)
        rows = cur.fetchall()
        filterable_data = [{'label': list(r.values())[0], 'data': list(r.values())[1:]} for r in rows]

        ret = {
            'scope': {
                'name': 'Polska',
                'type': 'Wyniki krajowe (nie obejmują głosów oddawanych poza granicami Polski)',
                'location': '',
                'href': False
            },
            'subScope': {
                'type': 'wojewodztwo',
                'href': '/listy/wojewodztwa'
            },
            'data': {
                'normal': [{
                    'label': 'Suma głosów',
                    'data': normal_data
                }],
                'percent': [{
                    'label': 'Procent głosów',
                    'data': percent_data
                }],
                'filterable': filterable_data,
            }
        }
        return jsonify(ret)


class Wojewodztwo(Resource):
    def get(self, id):
        cur = get_cursor()

        # main query
        query = "select {} from kraj where Kod_wojewodztwa=\"{}\"".format(sum_query_string(with_total=True), id)
        cur.execute(query)
        rows = cur.fetchall()

        # last item in rows is a sum of all
        normal_data = list(rows[0].values())[:-1]
        sum_votes = list(rows[0].values())[-1]
        percent_data = [float("{0:2.2f}".format(100 * x / sum_votes)) for x in normal_data]

        # sub-category query
        query = "select min(\"Nr_okr\"), {} from kraj " \
                "where Kod_wojewodztwa=\"{}\" " \
                "group by \"Nr_okr\" " \
                "order by \"Nr_okr\" asc".format(sum_query_string(), id)
        cur.execute(query)
        rows = cur.fetchall()
        filterable_data = [{'label': list(r.values())[0], 'data': list(r.values())[1:]} for r in rows]

        # name query TODO: This should be possible without it
        query = "select Nazwa from wojewodztwa where Kod_wojewodztwa=\"{}\"".format(id)
        cur.execute(query)
        rows = cur.fetchall()
        print(query)
        name = rows[0]['Nazwa']

        ret = {
            'scope': {
                'name': name,
                'type': 'województwo',
                'location': 'Polska',
                'href': '/listy/wojewodztwa'
            },
            'subScope': {
                'type': 'okręg wyborczy',
                'href': '/listy/okregi'
            },
            'data': {
                'normal': [{
                    'label': 'Suma głosów',
                    'data': normal_data
                }],
                'percent': [{
                    'label': 'Procent głosów',
                    'data': percent_data
                }],
                'filterable': filterable_data,
            }
        }
        return jsonify(ret)

class Okreg(Resource):
    def get(self, id):
        cur = get_cursor()

        # main query
        query = "select {} from kraj where \"Nr_okr\"=\"{}\"".format(sum_query_string(with_total=True), id)
        cur.execute(query)
        rows = cur.fetchall()

        # last item in rows is a sum of all
        normal_data = list(rows[0].values())[:-1]
        sum_votes = list(rows[0].values())[-1]
        percent_data = [float("{0:2.2f}".format(100 * x / sum_votes)) for x in normal_data]

        # sub-category query
        query = "select min(Gmina), {} from kraj " \
                "where \"Nr_okr\"=\"{}\" " \
                "group by Kod_gminy " \
                "order by Kod_gminy asc".format(sum_query_string(), id)
        cur.execute(query)
        rows = cur.fetchall()
        filterable_data = [{'label': list(r.values())[0], 'data': list(r.values())[1:]} for r in rows]

        # location query TODO: This should be possible without it
        query = "select Nazwa from kraj left join wojewodztwa " \
                "on kraj.Kod_wojewodztwa = wojewodztwa.Kod_wojewodztwa " \
                "where kraj.Nr_okr=\"{}\" limit 1".format(id)
        cur.execute(query)
        rows = cur.fetchall()
        print(query)
        parent_scope_name = rows[0]['Nazwa']

        ret = {
            'scope': {
                'name': "Okręg wyborczy #{}".format(id),
                'type': 'okręg wyborczy',
                'location': parent_scope_name,
                'href': '/listy/okregi'
            },
            'subScope': {
                'type': 'gmina',
                'href': '/listy/gminy'
            },
            'data': {
                'normal': [{
                    'label': 'Suma głosów',
                    'data': normal_data
                }],
                'percent': [{
                    'label': 'Procent głosów',
                    'data': percent_data
                }],
                'filterable': filterable_data,
            }
        }
        return jsonify(ret)


class Gmina(Resource):
    def get(self, id):
        cur = get_cursor()

        # main query
        query = "select {} from kraj where \"Kod_gminy\"=\"{}\"".format(sum_query_string(with_total=True), id)
        cur.execute(query)
        rows = cur.fetchall()

        # last item in rows is a sum of all
        normal_data = list(rows[0].values())[:-1]
        sum_votes = list(rows[0].values())[-1]
        percent_data = [float("{0:2.2f}".format(100 * x / sum_votes)) for x in normal_data]

        # sub-category query
        query = "select min(Nr_obw) as Nr_obw, {} from kraj " \
                "where \"Kod_gminy\"=\"{}\" " \
                "order by Nr_obw asc".format(sum_query_string(), id)
        cur.execute(query)
        rows = cur.fetchall()
        filterable_data = [{'label': list(r.values())[0], 'data': list(r.values())[1:]} for r in rows]

        # location query TODO: This should be possible without it
        query = "select Nazwa, kraj.Nr_okr, Gmina from kraj left join wojewodztwa " \
                "on kraj.Kod_wojewodztwa = wojewodztwa.Kod_wojewodztwa " \
                "where kraj.Kod_gminy=\"{}\" limit 1".format(id)
        cur.execute(query)
        rows = cur.fetchall()
        print(query)
        parent_scope_name = "{} okręg wyborczy #{}".format(rows[0]['Nazwa'], rows[0]['Nr_okr'])
        current_scope_name = rows[0]['Gmina']

        ret = {
            'scope': {
                'name': current_scope_name,
                'type': 'gmina',
                'location': parent_scope_name,
                'href': '/listy/gminy'
            },
            'subScope': {
                'type': 'obwod',
                'href': False
            },
            'data': {
                'normal': [{
                    'label': 'Suma głosów',
                    'data': normal_data
                }],
                'percent': [{
                    'label': 'Procent głosów',
                    'data': percent_data
                }],
                'filterable': filterable_data,
            }
        }
        return jsonify(ret)


# routes

# api.add_resource(Ogolne, '/')
# api.add_resource(Swiat, '/swiat')
api.add_resource(Kraj, '/kraj')
api.add_resource(Wojewodztwo, '/wojewodztwo/<id>')
api.add_resource(Okreg, '/okreg/<id>')
api.add_resource(Gmina, '/gmina/<id>')
api.add_resource(ListaWojewodztw, '/listy/wojewodztwa')
api.add_resource(ListaOkregow, '/listy/okregi')
api.add_resource(ListaGmin, '/listy/gminy')

# server

app.run(port=2137)

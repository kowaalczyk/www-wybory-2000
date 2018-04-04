# TODO: 1. complete missing routes
# TODO: 2. add color generation in back-end
# TODO: 3. use vue-router and async requests to update data
# TODO: 4. fix bug during chart update
# TODO: 5. add error handling everywhere !!!

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


def get_standard_results(query):
    # main query
    cur = get_cursor()
    cur.execute(query)
    rows = cur.fetchall()

    # percent calculation - last item in rows must be a sum of all other
    normal_data = list(rows[0].values())[:-1]
    sum_votes = list(rows[0].values())[-1]
    percent_data = [float("{0:2.2f}".format(100 * x / sum_votes)) for x in normal_data]
    return (normal_data, percent_data)


def get_filterable_results(query):
    cur = get_cursor()
    cur.execute(query)
    rows = cur.fetchall()
    return [{'label': list(r.values())[0], 'data': list(r.values())[1:]} for r in rows]


def get_location_rows(key, val):
    cur = get_cursor()
    query = "select Nazwa, kraj.Nr_okr, Gmina from kraj left join wojewodztwa " \
            "on kraj.Kod_wojewodztwa = wojewodztwa.Kod_wojewodztwa " \
            "where kraj.\"{}\"=\"{}\" limit 1".format(key, val)
    cur.execute(query)
    return cur.fetchall()


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
        query = "select {} from kraj".format(sum_query_string(with_total=True))
        normal_data, percent_data = get_standard_results(query)

        query = "select min(wojewodztwa.nazwa), {} from kraj left join wojewodztwa " \
                "on kraj.Kod_wojewodztwa = wojewodztwa.Kod_wojewodztwa " \
                "group by wojewodztwa.Kod_wojewodztwa " \
                "order by wojewodztwa.Kod_wojewodztwa asc".format(sum_query_string())
        filterable_data = get_filterable_results(query)

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
        query = "select {} from kraj where Kod_wojewodztwa=\"{}\"".format(sum_query_string(with_total=True), id)
        normal_data, percent_data = get_standard_results(query)

        query = "select min(\"Nr_okr\"), {} from kraj " \
                "where Kod_wojewodztwa=\"{}\" " \
                "group by \"Nr_okr\" " \
                "order by \"Nr_okr\" asc".format(sum_query_string(), id)
        filterable_data = get_filterable_results(query)

        rows = get_location_rows("Kod_wojewodztwa", id)
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
        query = "select {} from kraj where \"Nr_okr\"=\"{}\"".format(sum_query_string(with_total=True), id)
        normal_data, percent_data = get_standard_results(query)

        query = "select min(Gmina), {} from kraj " \
                "where \"Nr_okr\"=\"{}\" " \
                "group by Kod_gminy " \
                "order by Kod_gminy asc".format(sum_query_string(), id)
        filterable_data = get_filterable_results(query)

        rows = get_location_rows("Nr_okr", id)
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
        query = "select {} from kraj where \"Kod_gminy\"=\"{}\"".format(sum_query_string(with_total=True), id)
        normal_data, percent_data = get_standard_results(query)

        query = "select min(Nr_obw) as Nr_obw, {} from kraj " \
                "where \"Kod_gminy\"=\"{}\" " \
                "order by Nr_obw asc".format(sum_query_string(), id)
        filterable_data = get_filterable_results(query)

        rows = get_location_rows("Kod_gminy", id)
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

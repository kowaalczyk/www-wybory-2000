# TODO: 5. add error handling everywhere !!!
import random
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
app = Flask(__name__, static_folder='', static_url_path='')
api = Api(app)


# db helpers


def get_cursor():
    conn = sqlite3.connect(db_file)
    conn.row_factory = dict_factory
    return conn.cursor()


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


def query_string(with_total=False):
    arr = ["\"{}\"".format(x) for x in candidate_name_labels]
    if with_total:
        arr.append('sum(Głosy_ważne)')
    return ', '.join(arr)


def sum_query_string(with_total=False):
    arr = ["sum(\"{}\")".format(x) for x in candidate_name_labels]
    if with_total:
        arr.append('sum(Głosy_ważne)')
    return ', '.join(arr)


def sum_union_query_string(with_total=False):
    arr = ["sum(\"{}\") as \"{}\"".format(x, x) for x in candidate_name_labels]
    if with_total:
        arr.append('sum(\"Głosy_ważne\") as \"Głosy_ważne\"')
    return ', '.join(arr)


# db queries


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
    return [{'label': list(r.values())[0], 'data': [int(i) for i in list(r.values())[1:]]} for r in rows]


def get_location_rows(key, val):
    cur = get_cursor()
    query = "select Nazwa, kraj.Nr_okr, Gmina from kraj left join wojewodztwa " \
            "on kraj.Kod_wojewodztwa = wojewodztwa.Kod_wojewodztwa " \
            "where kraj.\"{}\"=\"{}\" limit 1".format(key, val)
    cur.execute(query)
    return cur.fetchall()


def get_wojewodztwa():
    cur = get_cursor()
    cur.execute('select * from wojewodztwa order by Kod_wojewodztwa asc')
    rows = cur.fetchall()
    return [{'href': "/wojewodztwo/{}".format(r['id']),
             'text': r['Nazwa']} for r in rows]


def get_okregi(id_woj=None):
    cur = get_cursor()
    if id_woj is not None:
        cur.execute("select distinct Nr_okr from kraj where Kod_wojewodztwa=\"{}\" order by Nr_okr asc".format(id_woj))
    else:
        cur.execute("select distinct Nr_okr from kraj order by Nr_okr asc")
    rows = cur.fetchall()
    return [{'href': "/okreg/{}".format(r['Nr_okr']),
             'text': "Okręg wyborczy #{}".format(r['Nr_okr'])} for r in rows]


def get_gminy(id_okr=None):
    cur = get_cursor()
    if id_okr is not None:
        cur.execute("select distinct Kod_gminy, Gmina from kraj where Nr_okr=\"{}\" order by Gmina asc".format(id_okr))
    else:
        cur.execute("select distinct Kod_gminy, Gmina from kraj order by Gmina asc")
    rows = cur.fetchall()
    return [{'href': "/gmina/{}".format(r['Kod_gminy']),
             'text': "{}".format(r['Gmina'])} for r in rows]


# response helpers


def random_color():
    r = lambda: random.randint(0, 255)
    return [r(), r(), r()]


def background_color(color):
    return "rgba({}, {}, {}, {})".format(color[0], color[1], color[2], 0.2)


def border_color(color):
    return "rgba({}, {}, {}, {})".format(color[0], color[1], color[2], 1)


def compose_response(scope, subscope,
                     normal_data, percent_data, filterable_data,
                     submenu1=[], submenu2=[]):
    # set up colors
    normal_color = random_color()
    percent_color = random_color()
    for d in filterable_data:
        c = random_color()
        d.update({
            "backgroundColor": background_color(c),
            "borderColor": border_color(c),
            "borderWidth": 1
        })

    # compose dict response
    return {
        'scope': scope,
        'subScope': subscope,
        'data': {
            'normal': [{
                'label': 'Suma głosów',
                'data': normal_data,
                'backgroundColor': background_color(normal_color),
                'borderColor': border_color(normal_color),
                'borderWidth': 1
            }],
            'percent': [{
                'label': 'Procent głosów',
                'data': percent_data,
                'backgroundColor': background_color(percent_color),
                'borderColor': border_color(percent_color),
                'borderWidth': 1
            }],
            'filterable': filterable_data,
        },
        'subMenus': {
            'submenu1': submenu1,
            'submenu2': submenu2
        }
    }


# api resources


class Ogolne(Resource):
    def get(self):
        query = "select {} from (select {} from swiat " \
                "union select {} from kraj)".format(sum_query_string(with_total=True),
                                                    sum_union_query_string(with_total=True),
                                                    sum_union_query_string(with_total=True))
        normal_data, percent_data = get_standard_results(query)
        filterable_data = [{
            'label': 'Suma głosów',
            'data': normal_data,
        }]
        ret = compose_response(
            {
                'name': 'Wyniki wyborów',
                'type': 'Sumaryczne wyniki wyborów w kraju i za granicą',
                'location': '',
                'href': False
            },
            {
                'type': 'państwo',
                'href': False
            },
            normal_data,
            percent_data,
            filterable_data
        )
        return jsonify(ret)


class Swiat(Resource):
    def get(self):
        query = "select {} from swiat".format(sum_query_string(with_total=True))
        normal_data, percent_data = get_standard_results(query)

        query = "select \"Państwo\", {} from swiat " \
                "group by \"Państwo\" order by \"Państwo\" asc".format(
            ", ".join(["\"{}\"".format(e) for e in candidate_name_labels]))
        filterable_data = get_filterable_results(query)

        ret = compose_response(
            {
                'name': 'Świat',
                'type': 'Wyniki zagraniczne',
                'location': '',
                'href': False
            },
            {
                'type': 'państwo',
                'href': False
            },
            normal_data,
            percent_data,
            filterable_data
        )
        return jsonify(ret)


class Kraj(Resource):
    def get(self):
        query = "select {} from kraj".format(sum_query_string(with_total=True))
        normal_data, percent_data = get_standard_results(query)

        query = "select min(wojewodztwa.nazwa), {} from kraj left join wojewodztwa " \
                "on kraj.Kod_wojewodztwa = wojewodztwa.Kod_wojewodztwa " \
                "group by wojewodztwa.Kod_wojewodztwa " \
                "order by wojewodztwa.Kod_wojewodztwa asc".format(sum_query_string())
        filterable_data = get_filterable_results(query)

        ret = compose_response(
            {
                'name': 'Polska',
                'type': 'Wyniki krajowe (nie obejmują głosów oddawanych poza granicami Polski)',
                'location': '',
                'href': False
            },
            {
                'type': 'wojewodztwo',
                'href': True
            },
            normal_data,
            percent_data,
            filterable_data,
            submenu2=get_wojewodztwa()
        )
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

        ret = compose_response(
            {
                'name': name,
                'type': 'województwo',
                'location': 'Polska',
                'href': True
            },
            {
                'type': 'okręg wyborczy',
                'href': True
            },
            normal_data,
            percent_data,
            filterable_data,
            submenu1=get_wojewodztwa(),
            submenu2=get_okregi(id)
        )
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

        ret = compose_response(
            {
                'name': "Okręg wyborczy #{}".format(id),
                'type': 'okręg wyborczy',
                'location': parent_scope_name,
                'href': True
            },
            {
                'type': 'gmina',
                'href': True
            },
            normal_data,
            percent_data,
            filterable_data,
            submenu1=get_okregi(),
            submenu2=get_gminy(id)
        )
        return jsonify(ret)


class Gmina(Resource):
    def get(self, id):
        query = "select {} from kraj where \"Kod_gminy\"=\"{}\"".format(sum_query_string(with_total=True), id)
        normal_data, percent_data = get_standard_results(query)

        query = "select Nr_obw, {} from kraj " \
                "where \"Kod_gminy\"=\"{}\" " \
                "order by Nr_obw asc".format(query_string(), id)
        filterable_data = get_filterable_results(query)

        rows = get_location_rows("Kod_gminy", id)
        parent_scope_name = "{} okręg wyborczy #{}".format(rows[0]['Nazwa'], rows[0]['Nr_okr'])
        current_scope_name = rows[0]['Gmina']

        ret = compose_response(
            {
                'name': current_scope_name,
                'type': 'gmina',
                'location': parent_scope_name,
                'href': True
            },
            {
                'type': 'obwod',
                'href': False
            },
            normal_data,
            percent_data,
            filterable_data,
            submenu1=get_gminy()
        )
        return jsonify(ret)


# api routes


api.add_resource(Ogolne, '/api/')
api.add_resource(Swiat, '/api/swiat')
api.add_resource(Kraj, '/api/kraj')
api.add_resource(Wojewodztwo, '/api/wojewodztwo/<id>')
api.add_resource(Okreg, '/api/okreg/<id>')
api.add_resource(Gmina, '/api/gmina/<id>')


# other routes


@app.route('/')
def root():
    return app.send_static_file('html/index.html')


# server
app.run(port=2137)

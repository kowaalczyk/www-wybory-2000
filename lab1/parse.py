import sqlite3
from sqlite3 import Error

# parameters
import pandas as pd

db_file = 'db/lab1_dev.db'
swiat_excel = 'raw_data/xls/zagranica.xls'


# script

# open db connection
conn = None
print('connecting to database...')
try:
    conn = sqlite3.connect(db_file)
    print(sqlite3.version)
except Error as e:
    print(e)
    conn.close()
    exit(1)
print("connected to sqlite v.{}, db file: {}".format(sqlite3.version, db_file))

# make sure all tables are clean
print('cleaning database...')
try:
    conn.execute('drop table if exists ogolne')
    conn.execute('drop table if exists swiat')
    conn.execute('drop table if exists kraj')
    conn.execute('drop table if exists wojewodztwo')
    conn.execute('drop table if exists okreg')
    conn.execute('drop table if exists gmina')
    conn.execute('drop table if exists obwod')
except Error as e:
    print(e)
    exit(1)
print('database clean')

# TODO: load obwod, gmina, okreg, wojewodztwo, kraj

# load swiat
df = pd.read_excel(swiat_excel, index=[0], )
try:
    df.to_sql('swiat', conn, if_exists='fail', index=True, index_label='id')
except Exception as e:
    print(e)
    exit(1)

# TODO: load ogolne

# clean up and exit
print('closing database connection...')
conn.close()
print('database connection closed')
print('if you see this, all went well, you can run the server by executing:')
print('python3.6 server.py')
print('bye!')
exit(0)

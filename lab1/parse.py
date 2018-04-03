import os
import re
import sqlite3
from sqlite3 import Error

# PARAMS
import pandas as pd

db_file = 'db/lab1_dev.db'
swiat_excel = 'raw_data/xls/zagranica.xls'
obwod_excel_dir = 'raw_data/xls/obwody'
obwod_index = ['Kod_gminy', 'Nr_obw']
gmina_excel_dir = 'raw_data/xls/gminy'



# SCRIPT

# open db connection
conn = None
print('connecting to database...')
try:
    conn = sqlite3.connect(db_file)
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

print('loading data...')
# load obwod
print('obwod...')
dir = os.fsencode(obwod_excel_dir)
for file in os.listdir(dir):
    filename = os.fsdecode(file)
    if filename.startswith('obw'):
        print(filename)
        df = pd.read_excel("{}/{}".format(obwod_excel_dir, filename))
        df.rename(columns=lambda x: re.sub("\s+", "_", x), inplace=True)
        df.rename(columns=lambda x: re.sub("[|.|, ]", "", x), inplace=True)
        df.set_index(obwod_index, inplace=True)
        try:
            df.to_sql('obwod', conn, if_exists='append', index=True)
        except Exception as e:
            print(e)
            exit(1)

# TODO: load gmina, okreg, wojewodztwo, kraj
# load gmina
print('gmina...')
dir = os.fsencode(gmina_excel_dir)
for file in os.listdir(dir):
    filename = os.fsdecode(file)
    if filename.startswith('gm-'):
        print(filename)
        df = pd.read_excel("{}/{}".format(obwod_excel_dir, filename))
        df.rename(columns=lambda x: re.sub("\s+", "_", x), inplace=True)
        df.rename(columns=lambda x: re.sub("[|.|, ]", "", x), inplace=True)
        df.set_index(obwod_index, inplace=True)
        try:
            df.to_sql('obwod', conn, if_exists='append', index=True)
        except Exception as e:
            print(e)
            exit(1)

# load swiat
print('swiat...')
df = pd.read_excel(swiat_excel)
df.rename(columns=lambda x: re.sub("[\s|.|,]+", "_", x))
try:
    df.to_sql('swiat', conn, if_exists='fail', index=True, index_label='id')
except Exception as e:
    print(e)
    exit(1)

# TODO: load ogolne

# clean up and exit
print('all data saved to database')
print('closing database connection...')
conn.close()
print('database connection closed')
print('if you see this, all went well, you can run the server by executing:')
print('python3.6 server.py')
print('bye!')
exit(0)

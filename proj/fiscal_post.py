# edit my_title, my_description, my_post, my_script_id

from datetime import datetime
import pandas as pd
import sqlalchemy as db
from . import uqntdb as udb

engine = db.create_engine(f"mssql+pymssql://{udb.UQNT_USER}:{udb.UQNT_PASS}@{udb.UQNT_SERVER}:1433/{udb.UQNT_DB}")

class Post:
    def __init__(self, title, description, post, script_id):
        self.date = datetime.now()
        self.title = title
        self.description = description
        self.post = post
        self.scriptid = script_id

my_title = "Gov't Spending and Economic Outcomes" # max 50 bytes
my_description ="Examining Rate of Change in Gov't Expenditures, GDP, and Unemployment" # max 200 bytes
my_post ="""
The plots show rates of change in real GDP and umemployment in relation to rates of change in federal government 
expenditures from the previous year (from 1962-2022). Also provided are the probabilities of increasing rates of change in expenditures occuring with 
increasing rates of change in real GDP, decreasing rates of change in unemployment. 
"""
my_script_id = 2

new_post = Post(my_title, my_description, my_post, my_script_id)

start_values = "values("
end_values = ")"
my_date = str(new_post.date.year) + '/' + str(new_post.date.month) + '/' + str(new_post.date.day)
my_time = str(new_post.date.hour) + str(new_post.date.minute) + str(new_post.date.second)

df = pd.DataFrame({'post_date' : [my_date],
                    'post_time' : [my_time],
                    'title' : [new_post.title],
                    'post_description' : [new_post.description],
                    'post' : [new_post.post],
                    'script_id' : [new_post.scriptid],       
                    })

def update_posts():
    cnxn = engine.connect()
    df.to_sql('posts', cnxn,  if_exists='append', index=False)
    cnxn.close()

update_posts()
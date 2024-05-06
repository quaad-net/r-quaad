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

my_title = 'Savings vs Consumption' # max 50 bytes
my_description ='Personal Savings Decreasing in Relation To Consumption.' # max 200 bytes
my_post ="""
As shown by the increasing spread between consumption and saving, data suggests that Americans are 
spending more of their income as opposed to saving when compared to years past. The “normalized” 
datasets below show savings, consumption, M1, and CPI on the same scale to give a better view of how 
these move in relation to each other. M1 and CPI have been included due to their potential impacts on 
consumption habits. It should be noted that consumption combined with spending does not account for 
total income (income/property taxes, transfer payments, etc. are not included).
"""
my_script_id = 1

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
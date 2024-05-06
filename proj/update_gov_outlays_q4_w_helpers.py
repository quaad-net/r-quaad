import pandas as pd
import sqlalchemy as db
from . import uqntdb as udb

engine = db.create_engine(f"mssql+pymssql://{udb.UQNT_USER}:{udb.UQNT_PASS}@{udb.UQNT_SERVER}:1433/{udb.UQNT_DB}")

#SQL query 
cnxn = engine.connect()
dataset = 'select * from gov_outlays_by_class_q4'
dataset_df = pd.read_sql(dataset, cnxn)
cnxn.close()

j = int(0) # for helper_id
parent_cls_desc =''

# Create array of objects consisting of main class with sub classes
for i in range(len(dataset_df)):
    try:
        my_subclass = int(dataset_df.loc[i, 'parent_id'])
        dataset_df.loc[i, 'subclass_helper'] = j # Matches parent_class_helper
        dataset_df.loc[i, 'parent_cls_desc'] = parent_cls_desc
    except(ValueError): # Where val = nan. These are the header/main classes
        parent_cls_desc = dataset_df.loc[i, 'classification_description'] # Captures main/parent class in var
        dataset_df.loc[i, 'parent_cls_desc'] = parent_cls_desc
        dataset_df.loc[i, 'parent_class_helper'] = j+1
        dataset_df.loc[i, 'subclass_helper'] = 0
        j+=1
        
dataset_df.to_csv("./gov_outlays_q4_w_helpers.csv")
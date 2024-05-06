from django.shortcuts import render
from pathlib import Path
from django.http import JsonResponse, HttpResponse
import pandas as pd
import os
from sklearn import preprocessing
import sqlalchemy as db

IS_HEROKU_APP = "DYNO" in os.environ and not "CI" in os.environ

if IS_HEROKU_APP:
   engine = db.create_engine(f"mssql+pymssql://{os.environ.get('UQNT_USER')}:{os.environ.get('UQNT_PASS')}@{os.environ.get('UQNT_SERVER')}:1433/{os.environ.get('UQNT_DB')}")
else:
    from . import uqntdb as udb
    engine = db.create_engine(f"mssql+pymssql://{udb.UQNT_USER}:{udb.UQNT_PASS}@{udb.UQNT_SERVER}:1433/{udb.UQNT_DB}")

   
def fiscal(request):

    try:
        return render(request, 'fiscal_generic.html')
    except:
        if IS_HEROKU_APP:
            response = render(request, 'handler500.html')
            response.status_code = 500
            return response

def fiscal_posts(request):

    try:
        return render(request, 'fiscal_posts.html')
    except:
        if IS_HEROKU_APP:
            response = render(request, 'handler500.html')
            response.status_code = 500
            return response
        
async def fiscalquery(request, startDate, endDate):

    try:
        cnxn = engine.connect()

        fiscal_1 = f'select round(ttl_gov_expend, 1) as ttl_gov_expend, round(fygfd, 1) as federal_debt, date as yr ' 
        fiscal_2 = f'from cbo_annual_cy_plus where date between {startDate} and {endDate} order by yr;'
        fiscal_data = fiscal_1 + fiscal_2
        fiscal_data_df = pd.read_sql(fiscal_data, cnxn)
        fiscal_data_jsn = fiscal_data_df.to_json(orient='records')

        gov_outlays_1 = f'select fiscal_year, classification_description as clsdesc, parent_cls_desc, subclass_helper, current_fiscal_year_to_date_gross_outlays_amount '
        gov_outlays_2 = f"as amt from gov_outlays_q4_w_helpers where fiscal_year = {startDate} and classification_description like 'Total--%' "
        gov_outlays_3 = f'and Sequence_Level_Number = 2 and current_fiscal_year_to_date_gross_outlays_amount > 0 '
        gov_outlays_4 = f'order by current_fiscal_year_to_date_gross_outlays_amount desc'
        gov_outlays = gov_outlays_1 + gov_outlays_2 + gov_outlays_3 + gov_outlays_4
        gov_outlays_df = pd.read_sql(gov_outlays, cnxn)
        gov_outlays_jsn = gov_outlays_df.to_json(orient='records')

        year_ttl_all_cls_1 = f"select sum(current_fiscal_year_to_date_gross_outlays_amount) as year_ttl_all_cls from gov_outlays_q4_w_helpers where fiscal_year = {startDate} and classification_description like 'Total--%' " 
        year_ttl_all_cls_2 = f'and Sequence_Level_Number = 2 and current_fiscal_year_to_date_gross_outlays_amount > 0'
        year_ttl_all_cls = year_ttl_all_cls_1 + year_ttl_all_cls_2
        year_ttl_all_cls_df = pd.read_sql(year_ttl_all_cls, cnxn)
        year_ttl_all_cls_jsn = year_ttl_all_cls_df.to_json(orient='records')

        allObjs = [fiscal_data_jsn, gov_outlays_jsn, year_ttl_all_cls_jsn]
        cnxn.close()
        return JsonResponse(allObjs, safe= False)
        
    except:
        if IS_HEROKU_APP:
            response = render(request, 'handler500.html')
            response.status_code = 500
            return response

def get_assoc_chts(request, scriptID):

    try:
        match int(scriptID):
            case 1:
            
                cnxn = engine.connect()
                dataset = 'select date, pmsave as personal_saving, pce, m1, cpiu, personal_income from cbo_annual_cy_plus where date between 1990 and 2023'
                dataset_df = pd.read_sql(dataset, cnxn)
                cnxn.close()

                # Calculate change in personal_saving
                for i in range(len(dataset_df)):
                    if i != 0: 
                        dataset_df.loc[i, 'change_in_saving'] = round(((dataset_df['personal_saving'][i] - dataset_df['personal_saving'][i - 1])/dataset_df['personal_saving'][i-1]) * 100, 2)
                        dataset_df.loc[i, 'change_in_m1'] = round(((dataset_df['m1'][i] - dataset_df['m1'][i - 1])/dataset_df['m1'][i-1]) * 100, 2)

                    else:
                        dataset_df.loc[i, 'change_in_saving'] = 0
                        dataset_df.loc[i, 'change_in_m1'] = 0

                # Get top 10 increases in personal_saving
                get_top_savings = (dataset_df.sort_values('change_in_saving', ascending= False)).head(10)

                # Normalize dataset

                savings = dataset_df['personal_saving']
                consumption = dataset_df['pce']
                m1 = dataset_df['m1']
                cpi = dataset_df['cpiu']

                savings_norm = preprocessing.normalize([savings])
                consumption_norm = preprocessing.normalize([consumption])
                m1_norm =  preprocessing.normalize([m1])
                cpi_norm = preprocessing.normalize([cpi])

                dates = []
                for i in range(len(dataset_df)):
                    dates.append(dataset_df.loc[i, 'date'])

                savings_norm_list = savings_norm[0].tolist()
                consumption_norm_list = consumption_norm[0].tolist()
                m1_norm_list = m1_norm[0].tolist()
                cpi_norm_list = cpi_norm[0].tolist()

                norms = [dates, savings_norm_list, consumption_norm_list, m1_norm_list, cpi_norm_list]
                norms_df = pd.DataFrame(norms).transpose()
                norms_df.columns = ['Year', 'Savings', 'Consumption', 'M1', 'CPI']

                norms_jsn = norms_df.to_json(orient='records')
                top_savings_jsn = get_top_savings.to_json(orient='records')
                dataset_jsn = dataset_df.to_json(orient='records')

                allObjs = [norms_jsn, top_savings_jsn, dataset_jsn]
                return JsonResponse(allObjs, safe=False)
    except:
        if IS_HEROKU_APP:
            response = render(request, 'handler500.html')
            response.status_code = 500
            return response

async def gov_expend_plus(request, startDate, endDate):
    
    try:
        cnxn = engine.connect()
        gov_expend = f'select * from gov_expend_set where date between {startDate} and {endDate};' 
        gov_expend_df = pd.read_sql(gov_expend, cnxn)
        gov_expend_jsn = gov_expend_df.to_json(orient='records')
        allObjs = [gov_expend_jsn]
        cnxn.close()
        return JsonResponse(allObjs, safe=False)
    except:
        if IS_HEROKU_APP:
            response = render(request, 'handler500.html')
            response.status_code = 500
            return response

async def get_posts(request):

    try:
        cnxn = engine.connect()
        my_posts_qry = """
        select format(post_date, 'MM/dd/yyyy') as post_date, 
        post_time,title, post_description, post, id, script_id from posts
        order by post_date desc, post_time desc
        """
        get_posts_df = pd.read_sql(my_posts_qry, cnxn)
        get_posts_jsn = get_posts_df.to_json(orient='records')
        allObjs = [get_posts_jsn]
        cnxn.close()
        return JsonResponse(allObjs, safe=False)
    except:
        if IS_HEROKU_APP:
            response = render(request, 'handler500.html')
            response.status_code = 500
            return response

def gov_outlays_tbl_drilldown(request, classID):

    try:
        cnxn = engine.connect()

        my_qry = f'select classification_description, parent_cls_desc, current_fiscal_year_to_date_gross_outlays_amount as amt from gov_outlays_q4_w_helpers where subclass_helper = {classID} '
        my_qry_df = pd.read_sql(my_qry, cnxn)
        my_qry_jsn  = my_qry_df.to_json(orient='records')

        allObjs = [my_qry_jsn]
        cnxn.close()
        return JsonResponse(allObjs, safe=False)
    except:
        if IS_HEROKU_APP:
            response = render(request, 'handler500.html')
            response.status_code = 500
            return response

def index(request):

    try:
        return render(request, 'main.html')
    except:
        if IS_HEROKU_APP:
            response = render(request, 'handler500.html')
            response.status_code = 500
            return response

async def update_outlays(request, year):

    try:
        cnxn = engine.connect()
        
        gov_outlays_1 = f'select fiscal_year, classification_description as clsdesc, parent_cls_desc, subclass_helper, current_fiscal_year_to_date_gross_outlays_amount '
        gov_outlays_2 = f"as amt from gov_outlays_q4_w_helpers where fiscal_year = {year} and classification_description like 'Total--%' "
        gov_outlays_3 = f'and Sequence_Level_Number = 2 and current_fiscal_year_to_date_gross_outlays_amount > 0 '
        gov_outlays_4 = f'order by current_fiscal_year_to_date_gross_outlays_amount desc'
        gov_outlays = gov_outlays_1 + gov_outlays_2 + gov_outlays_3 + gov_outlays_4
        gov_outlays_df = pd.read_sql(gov_outlays, cnxn)
        gov_outlays_jsn = gov_outlays_df.to_json(orient='records')

        year_ttl_all_cls_1 = f"select sum(current_fiscal_year_to_date_gross_outlays_amount) as year_ttl_all_cls from gov_outlays_q4_w_helpers where fiscal_year = {year} and classification_description like 'Total--%' " 
        year_ttl_all_cls_2 = f'and Sequence_Level_Number = 2 and current_fiscal_year_to_date_gross_outlays_amount > 0'
        year_ttl_all_cls = year_ttl_all_cls_1 + year_ttl_all_cls_2
        year_ttl_all_cls_df = pd.read_sql(year_ttl_all_cls, cnxn)
        year_ttl_all_cls_jsn = year_ttl_all_cls_df.to_json(orient='records')
        allObjs = [gov_outlays_jsn, year_ttl_all_cls_jsn]

        cnxn.close()
        return JsonResponse(allObjs, safe= False)
    except:
        if IS_HEROKU_APP:
            response = render(request, 'handler500.html')
            response.status_code = 500
            return response

# Error and Testing

def handler404(request, exception):
    response = render(request, 'handler404.html')
    response.status_code = 404
    return response

def handler500(request):
    response = render(request, 'handler500.html')
    response.status_code = 500
    return response

def test(request):
    if IS_HEROKU_APP:
        response = render(request, 'handler500.html')
        response.status_code = 500
        return response
    else:
        return render(request, 'test.html')
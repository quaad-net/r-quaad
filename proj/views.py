from django.shortcuts import render
from pathlib import Path
from django.http import JsonResponse, HttpResponse
import pandas as pd
import os
from sklearn import preprocessing

IS_HEROKU_APP = "DYNO" in os.environ and not "CI" in os.environ
devEnv = False

if(os.getenv('QUAAD_DEV')):
        devEnv = True
        from . import uqntdb as udb
import sqlalchemy as db
if devEnv == True:
    engine = db.create_engine(f"mssql+pymssql://{udb.UQNT_USER}:{udb.UQNT_PASS}@{udb.UQNT_SERVER}:1433/{udb.UQNT_DB}")
else:
    engine = db.create_engine(f"mssql+pymssql://{os.environ.get('UQNT_USER')}:{os.environ.get('UQNT_PASS')}@{os.environ.get('UQNT_SERVER')}:1433/{os.environ.get('UQNT_DB')}")

def index(request):
    """Returns current home page"""
    try:
        return render(request, 'index.html')
    except:
        if IS_HEROKU_APP:
            response = render(request, 'handler500.html')
            response.status_code = 500
            return response

# remove first if-statement in each function def when ready for production
def projects(request):

    try:
        # if IS_HEROKU_APP:
        #     raise('err')
        return render(request, 'projects_generic.html')
    except:
        if IS_HEROKU_APP:
            response = render(request, 'handler500.html')
            response.status_code = 500
            return response
        
def fiscal(request):

    try:
        # if IS_HEROKU_APP:
        #     raise('err')
        return render(request, 'fiscal_generic.html')
    except:
        if IS_HEROKU_APP:
            response = render(request, 'handler500.html')
            response.status_code = 500
            return response

def fiscal_posts(request):

    try:
        # if IS_HEROKU_APP:
        #     raise('err')
        return render(request, 'fiscal_posts.html')
    except:
        if IS_HEROKU_APP:
            response = render(request, 'handler500.html')
            response.status_code = 500
            return response
        
async def fiscalquery(request, startDate, endDate):

    try:
        # if IS_HEROKU_APP:
        #     raise('err')
        cnxn = engine.connect()

        mainEcon = f'select round(ttl_gov_expend, 1) as ttl_gov_expend, date as yr from cbo_annual_cy_plus where date between {startDate} and {endDate} order by yr;'
        mainEcon_df = pd.read_sql(mainEcon, cnxn)
        mainEcon_jsn = mainEcon_df.to_json(orient='records')

        gov_outlays = f'select fiscal_year, classification_description as clsdesc, current_fiscal_year_to_date_gross_outlays_amount as amt from gov_outlays_by_class where fiscal_year = {startDate} and current_fiscal_year_to_date_gross_outlays_amount > 0 order by current_fiscal_year_to_date_gross_outlays_amount desc;'
        gov_outlays_df = pd.read_sql(gov_outlays, cnxn)
        gov_outlays_jsn = gov_outlays_df.to_json(orient='records')

        allObjs = [mainEcon_jsn, gov_outlays_jsn]
        cnxn.close()
        return JsonResponse(allObjs, safe= False)
    except:
        if IS_HEROKU_APP:
            response = render(request, 'handler500.html')
            response.status_code = 500
            return response

async def update_outlays(request, year):

    try:
        # if IS_HEROKU_APP:
        #     raise('err')
        cnxn = engine.connect()
        outlays = f'select fiscal_year, classification_description as clsdesc, current_fiscal_year_to_date_gross_outlays_amount as amt from gov_outlays_by_class where fiscal_year = {year} and current_fiscal_year_to_date_gross_outlays_amount > 0 order by current_fiscal_year_to_date_gross_outlays_amount desc;'
        outlays_df  = pd.read_sql(outlays, cnxn)
        outlays_jsn = outlays_df.to_json(orient='records')
        allObjs = [outlays_jsn]
        cnxn.close()
        return JsonResponse(allObjs, safe= False)
    except:
        if IS_HEROKU_APP:
            response = render(request, 'handler500.html')
            response.status_code = 500
            return response

async def gov_expend_plus(request, startDate, endDate):
    
    try:
        # if IS_HEROKU_APP:
        #     raise('err')
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

async def price_index(request, startDate, endDate):
    
    # remove first if statement when ready to publish
    try:
        # if IS_HEROKU_APP:
        #     raise('err')
        cnxn = engine.connect()
        price_index = f'select year(date) as yr, round(cpiaucsl, 2) as cpiaucsl, round(CSUSHPINSA, 2) as CSUSHPINSA, round(HLTHSCPIMEPS, 2) as HLTHSCPIMEPS, round(IPMAN, 2) as IPMAN, round(PPIACO , 2) as PPIACO from price_idx where year(date) between {startDate} and {endDate};'
        price_index_df = pd.read_sql(price_index, cnxn)
        price_index_jsn = price_index_df.to_json(orient='records')
        allObjs = [price_index_jsn]
        cnxn.close()
        return JsonResponse(allObjs, safe=False)
    except:
        if IS_HEROKU_APP:
            response = render(request, 'handler500.html')
            response.status_code = 500
            return response

async def get_posts(request):

    try:
        # if IS_HEROKU_APP:
        #     raise('err')
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
    
def get_assoc_chts(request, scriptID):

    try:
        # if IS_HEROKU_APP:
        #     raise('err')
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

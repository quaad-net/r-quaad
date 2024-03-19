from django.shortcuts import render
#from django.views import generic
from pathlib import Path
from django.http import JsonResponse, HttpResponse

#connect to sql db
import pyodbc
import pandas as pd
import sqlalchemy
server = 'uqnt.database.windows.net'
database = 'uqnt'
username = 'eukoh'
password = '{1Cartoon!}'   
driver= '{ODBC Driver 17 for SQL Server}'
multipleActiveResultSets = True
integratedsecurity= 'SSPI'

# Connection
myCnStr = f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password};MultipleActiveResultSets={multipleActiveResultSets};Integrated Security={integratedsecurity}'
cnxn = pyodbc.connect(myCnStr)
cursor = cnxn.cursor()

def index(request):
    """Returns current home page"""

    return render(request, 'index.html')

def projects(request):
    return render(request, 'projects_generic.html')

def fiscal(request):
    return render(request, 'fiscal_generic.html')

async def fiscalquery(request, startDate, endDate):
    mainEcon = f'select round(ttl_gov_expend, 1) as ttl_gov_expend, yr from main_econ_measures where yr between {startDate} and {endDate} order by yr;'
    mainEcon_df = pd.read_sql(mainEcon, cnxn)
    mainEcon_jsn = mainEcon_df.to_json(orient='records')

    cbo = f'select * from cbo_measures where date between {startDate} and {endDate} order by date;'
    cbo_df = pd.read_sql(cbo, cnxn)
    cbo_jsn = cbo_df.to_json(orient='records')

    gov_outlays = f'select fiscal_year, classification_description as clsdesc, current_fiscal_year_to_date_gross_outlays_amount as amt from gov_outlays_by_class where fiscal_year = {startDate} and current_fiscal_year_to_date_gross_outlays_amount > 0 order by current_fiscal_year_to_date_gross_outlays_amount desc;'
    gov_outlays_df = pd.read_sql(gov_outlays, cnxn)
    gov_outlays_jsn = gov_outlays_df.to_json(orient='records')

    side_bar_lbls = f"select * from gov_expend_plus_headers where not column_name ='year' and not column_name = 'gov_expend' order by column_name;"
    side_bar_lbls_df = pd.read_sql(side_bar_lbls, cnxn)
    side_bar_lbls_jsn = side_bar_lbls_df.to_json(orient='records')

    allObjs = [mainEcon_jsn, cbo_jsn, gov_outlays_jsn, side_bar_lbls_jsn]
    return JsonResponse(allObjs, safe= False)
    
async def update_outlays(request, year):
    outlays = f'select fiscal_year, classification_description as clsdesc, current_fiscal_year_to_date_gross_outlays_amount as amt from gov_outlays_by_class where fiscal_year = {year} and current_fiscal_year_to_date_gross_outlays_amount > 0 order by current_fiscal_year_to_date_gross_outlays_amount desc;'
    outlays_df  = pd.read_sql(outlays, cnxn)
    outlays_jsn = outlays_df.to_json(orient='records')
    allObjs = [outlays_jsn]
    return JsonResponse(allObjs, safe= False)

async def gov_expend_plus(request, startDate, endDate):
    gov_expend = f'select * from gov_expend_plus where year between {startDate} and {endDate};'
    gov_expend_df = pd.read_sql(gov_expend, cnxn)
    gov_expend_jsn = gov_expend_df.to_json(orient='records')
    allObjs = [gov_expend_jsn]
    return JsonResponse(allObjs, safe=False)

async def price_index(request, startDate, endDate):
    price_index = f'select year(date) as yr, round(cpiaucsl, 2) as cpiaucsl, round(CSUSHPINSA, 2) as CSUSHPINSA, round(HLTHSCPIMEPS, 2) as HLTHSCPIMEPS, round(IPMAN, 2) as IPMAN, round(PPIACO , 2) as PPIACO from price_idx where year(date) between {startDate} and {endDate};'
    price_index_df = pd.read_sql(price_index, cnxn)
    price_index_jsn = price_index_df.to_json(orient='records')
    allObjs = [price_index_jsn]
    return JsonResponse(allObjs, safe=False)

def test(request):
    return render(request, 'fiscalquery.html')

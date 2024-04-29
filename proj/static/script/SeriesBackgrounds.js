export function mySeriesColor(category){
    const mySeriesBackGrounds = new Map();
    mySeriesBackGrounds.set('year', 'rgb(255, 157, 255)')
    mySeriesBackGrounds.set('gov_expend', 'rgb(7, 179, 247)')
    mySeriesBackGrounds.set('gdp', 'rgb(242, 138, 58)')
    mySeriesBackGrounds.set('real_gdp', 'rgb(91, 79, 91)')
    mySeriesBackGrounds.set('gross_domestic_income', 'rgb(52, 146, 146)')
    mySeriesBackGrounds.set('personal_income', 'rgb(218, 172, 112)')
    mySeriesBackGrounds.set('corp_profits', 'rgb(0, 80, 146)')
    mySeriesBackGrounds.set('personal_consumption', 'rgb(79, 234, 156)')
    mySeriesBackGrounds.set('real_personal_consumption', 'rgb(20, 2, 141)')
    mySeriesBackGrounds.set('gov_consumption_and_investments', 'rgb(135, 169, 183)')
    mySeriesBackGrounds.set('real_gov_consumption_and_investments', 'rgb(160, 51, 0)')
    mySeriesBackGrounds.set('net_exports', 'rgb(138, 43, 226)')
    mySeriesBackGrounds.set('exports', 'rgb(165, 42, 42)')
    mySeriesBackGrounds.set('imports', 'rgb(220, 20, 60)')
    mySeriesBackGrounds.set('real_net_exports', 'rgb(210, 105, 30)')
    mySeriesBackGrounds.set('real_exports', 'rgb(0, 0, 139)')
    mySeriesBackGrounds.set('real_imports', 'rgb(0, 100, 0)')
    mySeriesBackGrounds.set('federal_debt', 'rgb(85, 107, 47)')
    mySeriesBackGrounds.set('money_supply_m1', 'rgb(72, 61, 139)')
    mySeriesBackGrounds.set('personal_savings', 'rgb(255, 20, 147)')
    mySeriesBackGrounds.set('CPI', 'black')
    return mySeriesBackGrounds.get(category);
}



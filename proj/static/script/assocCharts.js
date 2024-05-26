import { createStackedBar, createTimeSeries, createScatterPlot} from './jsCharts.js'

export function assocCharts(scriptID, JSONdata, canvas, canvas2){

    //scriptID = scriptID from SQL table. 
    //Functions written under each switch case below should be relevant to the record fetched from SQL table

    switch(scriptID){
        case 1:
           const normsJSN = JSON.parse(JSONdata[0])
           const datasetJSN = JSON.parse(JSONdata[2])
           const normsYr = [], normsSav = [], normsConsump = [], normsMI = [], normsCPI = []
           for(const idx in normsJSN){
            normsYr.push(normsJSN[idx]['Year'])
            normsSav.push(normsJSN[idx]['Savings'])
            normsConsump.push(normsJSN[idx]['Consumption'])
            normsMI.push(normsJSN[idx]['M1'])
            normsCPI.push(normsJSN[idx]['CPI'])
           }
           
           const myAdditionalSets = [normsConsump, normsMI, normsCPI]
           const myAdditionalLabels = ['personal_consumption', 'money_supply_m1', 'CPI']
           createTimeSeries('personal_savings', normsYr, normsSav, canvas, myAdditionalSets, myAdditionalLabels, 'NORMALIZED DATASETS')

           const actualPersonalConsump = [], actualPersonalSav = [], actualPersonalInc = []
           for(const idx in datasetJSN){
            actualPersonalConsump.push(datasetJSN[idx]['pce'])
            actualPersonalSav.push(datasetJSN[idx]['personal_saving'])
            actualPersonalInc.push(datasetJSN[idx]['personal_income'])
           }

           //order items for stacked bar chart from largest to smallest
           const myStackedLabels = ['personal_consumption', 'personal_savings']
           const myStackedvals = [actualPersonalConsump, actualPersonalSav]
           createStackedBar(myStackedLabels, normsYr, myStackedvals, canvas2, 'CONSUMPTION AND SAVING | in billions | USD')
        
        case 2:
            const expenditures = JSON.parse(JSONdata[0])
            const prob_incr_expend_incr_rgdp = JSON.parse(JSONdata[1])
            const prob_incr_expend_decr_unemp = JSON.parse(JSONdata[2])
            const chg_expend_rgdp = []
            const chg_expend_unemp  = []
            
            for(const idx in expenditures){
                chg_expend_rgdp.push({x: `${expenditures[idx]['chg_in_expd_prev_yr']}`, y: `${expenditures[idx]['chg_in_real_gdp']}`})
                chg_expend_unemp.push({x: `${expenditures[idx]['chg_in_expd_prev_yr']}`, y: `${expenditures[idx]['chg_in_unemp']}`})
            }

            createScatterPlot(canvas, 'yellow',  'Rate Chg{x: expend, y: real_GPD}', chg_expend_rgdp)
            createScatterPlot(canvas2, 'orange', 'Rate Chg{x: expend, y: non_cyclical_unemploy}', chg_expend_unemp)

            const chartFooter = document.querySelector('#cfd-4')
            chartFooter.textContent = 'prob_incr_expend_incr_rgdp: ' + prob_incr_expend_incr_rgdp +' ' + '| prob_incr_expend_decr_unemp: ' + prob_incr_expend_decr_unemp + ' | '
            
            let dv = document.createElement('a')
            dv.textContent = 'Datasets'
            dv.setAttribute('href', 'https://1drv.ms/x/s!Ar6VAGa9JiSkjPd-syTq2Jk9FM1zGQ?e=381fBB')
            dv.setAttribute('target', '_blank')
            dv.setAttribute('rel','noopener noreferrer')
            chartFooter.append(dv)
            
            chartFooter.style.display = 'block'
    }
}


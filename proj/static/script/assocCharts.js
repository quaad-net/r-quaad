//import { createStackedBar, createTimeSeries} from '/static/script/jsCharts.js'

function assocCharts(scriptID, JSONdata, canvas, canvas2){

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
           createStackedBar(myStackedLabels, normsYr, myStackedvals, canvas2, 'CONSUMPTION VS SAVING | in billions | USD')

    }
}


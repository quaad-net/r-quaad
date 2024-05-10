const  mySeriesColor = new Map();
mySeriesColor.set('year', 'rgb(255, 157, 255)')
mySeriesColor.set('gov_expend', 'blueviolet')
mySeriesColor.set('gdp', 'rgb(242, 138, 58)')
mySeriesColor.set('real_gdp', 'rgb(91, 79, 91)')
mySeriesColor.set('gross_domestic_income', 'rgb(52, 146, 146)')
mySeriesColor.set('personal_income', 'rgb(218, 172, 112)')
mySeriesColor.set('corp_profits', 'rgb(0, 80, 146)')
mySeriesColor.set('personal_consumption', 'rgb(79, 234, 156)')
mySeriesColor.set('real_personal_consumption', 'rgb(20, 2, 141)')
mySeriesColor.set('gov_consumption_and_investments', 'rgb(135, 169, 183)')
mySeriesColor.set('real_gov_consumption_and_investments', 'rgb(160, 51, 0)')
mySeriesColor.set('net_exports', 'rgb(138, 43, 226)')
mySeriesColor.set('exports', 'rgb(165, 42, 42)')
mySeriesColor.set('imports', 'rgb(220, 20, 60)')
mySeriesColor.set('real_net_exports', 'rgb(210, 105, 30)')
mySeriesColor.set('real_exports', 'rgb(0, 0, 139)')
mySeriesColor.set('real_imports', 'rgb(0, 100, 0)')
mySeriesColor.set('federal_debt', 'white')
mySeriesColor.set('money_supply_m1', 'rgb(72, 61, 139)')
mySeriesColor.set('personal_savings', 'rgb(255, 20, 147)')
mySeriesColor.set('CPI', 'black')
mySeriesColor.set('gov_receipts', 'blue')
export { mySeriesColor }
//mySeriesColor.get(category);

// export const myBkGrd = [
//     'rgb(138, 43, 226)', 'rgb(165, 42, 42)', 'rgb(220, 20, 60)', 'rgb(210, 105, 30)', 'rgb(0, 0, 139)', 'rgb(0, 100, 0)', 'rgb(85, 107, 47)',
//     'rgb(72, 61, 139)', 'rgb(255, 20, 147)', 'rgb(255, 0, 255)'
// ]

// export const myBkGrd = [      
//       '#380003', '#680106', '#980209', '#c8030c', '#f80410', '#fb323c', '#fc6269', '#fd9297', '#fec2c5', '#feeaeb',
// ]

export const myBkGrd = [      
      '#191970', '#000080', '#00008B', '#0000CD', '#0000FF', '#4169E1', '#4682B4', '#6495ED', '#1E90FF', '#B0C4DE',
]

// export const myBkGrd = []
// function redSat(){
//     var h = 0, s = 50, l = 50
//     for(var i = 1; i <=10; i++){
//         myBkGrd.push(`hsl(${h}, ${s}%, ${l}%)`)
//         h+=2
//         s-=2
//         l+=2

//     }
// }
// redSat()
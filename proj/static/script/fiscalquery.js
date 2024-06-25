import { mySeriesColor, myBkGrd } from './seriesColors.js'
import { getPosts } from './fiscalPosts.js'
import { origins as or } from './dataHelpers.js'

// DOM vars
var startDate
var endDate
var firstInput = document.querySelector('#input-1')
var secInput = document.querySelector('#input-2')
var qryBtn = document.querySelector("#qryBtn")
var mobileMenu = document.querySelector(".mb-icon-menu")
var sideBar = document.querySelector(".sidebar")
var mobileHeader = document.querySelector(".mobile-header")
var sidebarClose = document.querySelector(".sidebar-close")
var mbTabs = document.querySelectorAll(".mb-tab-btn")
var ht = document.querySelector('html')
var getBaseURL = ht.baseURI
var auxModal = document.querySelector('#aux-modal')
var hlprIcon =  document.querySelectorAll('.helper-icon')
var aboutBtn = document.querySelector('#about-btn')

// non-DOM vars
var MSeries
var MSeriesExists = false
var fedDebtChart
var outlaysCht;
var dataForChts
const dt = new Date()
const curYr =  dt.getFullYear()
const myStartYr = curYr - 6
const myEndYr = curYr - 1
let myTopOutlaysClassID
let myOtherOutlaysVals
let myOtherOutlaysList
let SubClassList
let prevYearTtl = []
let receiptsBarChart
let qryStart, qryEnd
let curPage = 'Overview'

// Event Listeners

firstInput.addEventListener('click', function(){
  firstInput.value = ""
})
secInput.addEventListener('click', function(){
  secInput.value = ""
})
firstInput.addEventListener('input', captureStartDate)
secInput.addEventListener('input', caputureEndDate)

mobileMenu.addEventListener("click", function(){ 
  mobileHeader.style.display = "none"
  sideBar.style.display = "block"
})

sidebarClose.addEventListener("click", function(){
  sideBar.style.display = "none"
  mobileHeader.style.display = "block"
})

function hlprIconListn(){

  // Adds source information to modal

  for (const c of hlprIcon){
    c.addEventListener('click', function(){

      const tableHeader = document.querySelector('.aux-table-modal-header')
      tableHeader.textContent  = ''
      const rowSect = document.querySelector('.aux-table-modal-rows')
      while(rowSect.firstChild){
        rowSect.removeChild(rowSect.firstChild)
      }
      const dv = document.createElement('div')
      dv.textContent = or.getOrigin(c.id).source
      dv.setAttribute('class', 'aux-table-modal-row')
      dv.setAttribute('id', 'hlpr-info')
      rowSect.appendChild(dv)
      tableHeader.textContent = 'Source'
      auxModal.style.display = 'block'
    })
  }
}

//header tab click events
for(const b of mbTabs){

  b.addEventListener('click', async function(){

    //sets color of tabs in header
    //returns "Overview" or "Posts"

    const t1 = document.querySelector("#mb-tab-1")
    const t2 = document.querySelector("#mb-tab-2")
    const coreElem = document.querySelector('.core')

    if(b.id == 'mb-tab-1'){ //Overview
      if(curPage != 'Overview'){
        curPage = 'Overview'
        const response = await fetch(getBaseURL)
        const responseTxt = await response.text()
        var parser = new DOMParser()
        var newDoc = parser.parseFromString(responseTxt, 'text/html')
        var coreDiv = newDoc.querySelector('.core')
        coreElem.innerHTML = coreDiv.innerHTML

        b.style.backgroundColor = "rgb(102, 1, 1)"
        t2.style.background = 'none'

        // // add style
        // const headElem = document.querySelector('head')
        // var myStyle = document.createElement("link")
        // myStyle.rel = "stylesheet"
        // myStyle.setAttribute('id', 'fiscal-styles')
        // myStyle.href =  newDoc.querySelector('#fiscal-styles').href //gets stylesheet from fetched document "/fiscalquery.css"
        // headElem.appendChild(myStyle)

        //reassign elements
        firstInput = document.querySelector('#input-1')
        secInput = document.querySelector('#input-2')
        qryBtn = document.querySelector("#qryBtn")
        mobileMenu = document.querySelector(".mb-icon-menu")
        sideBar = document.querySelector(".sidebar")
        mobileHeader = document.querySelector(".mobile-header")
        sidebarClose = document.querySelector(".sidebar-close")
        mbTabs = document.querySelectorAll(".mb-tab-btn")
        firstInput.addEventListener('click', function(){
          firstInput.value = ""
        })
        secInput.addEventListener('click', function(){
          secInput.value = ""
        })
        firstInput.addEventListener('input', captureStartDate)
        secInput.addEventListener('input', caputureEndDate)

        mobileMenu.addEventListener("click", function(){ 
          mobileHeader.style.display = "none"
          sideBar.style.display = "block"
        })
        sidebarClose.addEventListener("click", function(){
          sideBar.style.display = "none"
          mobileHeader.style.display = "block"
        })
        MSeriesExists = false
        outlayYearModal()
        qryBtn.addEventListener("click", function(){
          runQry()
        })
        runQry(myStartYr, myEndYr)
        auxModal = document.querySelector('#aux-modal')
        hlprIcon =  document.querySelectorAll('.helper-icon')
        auxTableModal()
        hlprIconListn()
        aboutBtn = document.querySelector('#about-btn')
        aboutFiscal()
        selectEconData()
      }
    }
    if(b.id == 'mb-tab-2'){ //Posts
      if(curPage != 'Posts'){
        curPage = 'Posts'
        const response = await fetch('posts')
        const responseTxt = await response.text()

        var parser = new DOMParser()
        var newDoc = parser.parseFromString(responseTxt, 'text/html')
        var coreDiv = newDoc.querySelector('.core')
        coreElem.innerHTML = coreDiv.innerHTML;

        b.style.backgroundColor = "rgb(102, 1, 1)"
        t1.style.background = 'none'

        // // add style
        // const headElem = document.querySelector('head')
        // var myStyle = document.createElement("link")
        // myStyle.rel = "stylesheet"
        // //myStyle.type = "text/css"
        // myStyle.setAttribute('id', 'posts-styles')
        // myStyle.href =  newDoc.querySelector('#posts-styles').href //gets stylesheet from fetched document "/fiscal_posts.css"
        // headElem.appendChild(myStyle)

        //reassign elements
        mobileMenu = document.querySelector(".mb-icon-menu")
        sideBar = document.querySelector(".sidebar")
        mobileHeader = document.querySelector(".mobile-header")
        sidebarClose = document.querySelector(".sidebar-close")
        mbTabs = document.querySelectorAll(".mb-tab-btn")
        mobileMenu.addEventListener("click", function(){ 
          mobileHeader.style.display = "none"
          sideBar.style.display = "block"
        })
        sidebarClose.addEventListener("click", function(){
          sideBar.style.display = "none"
          mobileHeader.style.display = "block"
        })
        auxModal = document.querySelector('#aux-modal')
        auxTableModal()
        aboutBtn = document.querySelector('#about-btn')
        aboutFiscal()
        getPosts()
      }
    }

  })
}

// Startup
runQry(myStartYr, myEndYr)
outlayYearModal()
document.querySelector("#mb-tab-1").style.backgroundColor = 'rgb(102, 1, 1)'
auxTableModal()
hlprIconListn()
aboutFiscal()
selectEconData()

// Functions

function captureStartDate(e) {
  startDate = e.target.value
}
function caputureEndDate(e){
    endDate = e.target.value
}

async function runQry(startyear, endyear){ 

  // For "search" button and intial page load
  // No parameters included when called on button click

  var userinp1
  var userinp2

  if(startyear){
    userinp1 = Number(startyear)
    userinp2 = Number(endyear)
  }
  else{
    userinp1 = Number(firstInput.value)
    userinp2 = Number(secInput.value)
  }

  if(userinp1 == 0){
    window.alert('Please enter a start year.')
  }
  else if(userinp2 == 0){
    window.alert('Please enter an end year.')
  }
  else if(userinp1 > userinp2){ 
    window.alert('Invalid year range.')
  }
  else{
      if(userinp1 > userinp2){
        window.alert('Invalid year range.')
      }
      else if(userinp1 < 1960){
        window.alert('Data available 1960-2023.')
      }
      else if(userinp2 > 2023){
        window.alert('Data available 1960-2023.')
      }
      else{
        var getStartYr = 0
        var getEndYr = 0
        getStartYr += userinp1
        getEndYr += userinp2

        //adjustment to produce range
        if(getStartYr == getEndYr){
          getStartYr -=5
        }
      
        const my_qry_btn_url = 'q-' + getStartYr + '/' + getEndYr
        const response = await fetch(my_qry_btn_url)
        dataForChts = await response.text() 
        formatJSN(dataForChts, getStartYr)
      
        //adds years of available data to modal (years available determined by initial query search)
        var myYears = []
        var i = 0
        if(getEndYr > getStartYr){
          while ((getStartYr + i) < getEndYr) {
            myYears.push(getStartYr + i)
            i++
          }
          myYears.push(getEndYr)
        }
        else{myYears.push(getStartYr)}
        update_outlayModal(myYears)
      
        // Show intial years of query
        if(startyear){
          firstInput.value = startyear
          secInput.value = endyear
        }

        if(sideBar.style.display!='none'){
          sidebarClose.click()
          window.scrollTo(0, 0)
        }

        // set years for selectEconomicData
        qryStart = getStartYr
        qryEnd = getEndYr
      }
  }
}

qryBtn.addEventListener("click", function(){
  runQry()
})

function extractContent(textcontent) {
  var span = document.createElement('span')
  span.innerHTML = textcontent
  return span.textContent
}

function formatJSN(myJSNStr, start){

    var gov_expd = [], gov_receipts = [], fedDebt =[], yr = []
    var myData = JSON.parse(myJSNStr);
    var fedDebtData = JSON.parse(myData[0])
    var gov_outlays = JSON.parse(myData[1])
    var year_ttl_all_cls = JSON.parse(myData[2])
    var expendituresAndReceipts = JSON.parse(myData[4])
    var current_tax_receipts  = [], contrib_for_gov_social_insur = [], income_receipts_on_assets = [],
    current_transfer_receipts = [], current_surplus_of_government_enterprises = []
    
    for(const idx in prevYearTtl){
      prevYearTtl.pop()
    }
    prevYearTtl.push(JSON.parse(myData[3]))

    for (const idx in fedDebtData){
      fedDebt.push(fedDebtData[idx]['federal_debt'])
      yr.push(fedDebtData[idx]['yr'])
    }

    for (const idx in expendituresAndReceipts){

      // Data for main series
      gov_expd.push(expendituresAndReceipts[idx]['total_expenditures'])
      gov_receipts.push(expendituresAndReceipts[idx]['total_receipts'])

      // Data for receipts chart
      current_tax_receipts.push(expendituresAndReceipts[idx]['current_tax_receipts'])
      contrib_for_gov_social_insur.push(expendituresAndReceipts[idx]['contrib_for_gov_social_insur'])
      income_receipts_on_assets.push(expendituresAndReceipts[idx]['income_receipts_on_assets'])
      current_transfer_receipts.push(expendituresAndReceipts[idx]['current_transfer_receipts'])
      current_surplus_of_government_enterprises.push(expendituresAndReceipts[idx]['current_surplus_of_government_enterprises'])
    }

    const receiptsCategories = ['current_tax_receipts', 'contrib_for_gov_social_insur', 
      'income_receipts_on_assets', 'current_transfer_receipts'
    ] // 'current_surplus_of_government_enterprises' not included 

    const receiptsVals = [
      current_tax_receipts, contrib_for_gov_social_insur, income_receipts_on_assets, 
      current_transfer_receipts
    ] // 'current_surplus_of_government_enterprises' not included 

    if(MSeriesExists){
      MSeries.destroy()
      fedDebtChart.destroy()
      receiptsBarChart.destroy()
      createMainSeries('gov_expend', yr, gov_expd)
      addDataSets(MSeries, 'gov_receipts', gov_receipts)
      createFedDebtSeries('federal_debt', yr, fedDebt)
      var destroy = true
      format_outlays(gov_outlays, year_ttl_all_cls, start, destroy)
      createReceiptsBarChart(receiptsCategories, yr, receiptsVals, document.querySelector('#receipts-cht'))
    }
    else{
      createMainSeries('gov_expend', yr, gov_expd) 
      addDataSets(MSeries, 'gov_receipts', gov_receipts)
      createFedDebtSeries('federal_debt', yr, fedDebt)
      format_outlays(gov_outlays, year_ttl_all_cls, start)
      createReceiptsBarChart(receiptsCategories, yr, receiptsVals, document.querySelector('#receipts-cht'))
    }

}

function addDataSets(chart, label, newData) {

    chart.data.datasets.push( 
      {
        label: label,
        data: newData,
        borderColor: mySeriesColor.get(label),
        fill: 'origin',
        backgroundColor: mySeriesColor.get(label),
        pointStyle: 'circle',
        pointBorderColor: 'blue'
      }
    )

  chart.update();
}

const plugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, args, options) => {
    const {ctx} = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over'
    ctx.fillStyle = options.color || '#99ffff'
    ctx.fillRect(0, 0, chart.width, chart.height)
    ctx.restore()
  }
};

function createMainSeries(category, yrs, vals) {
  
    Chart.defaults.font.family = "poppins, sans-serif"
    Chart.defaults.font.size = 12
    Chart.defaults.elements.line.tension = 0.4
    Chart.defaults.color = 'white'
    Chart.defaults.elements.point.radius = 3

    MSeries = new Chart(
      document.getElementById("MainSeriesCht"),
      {
        type: 'line',
        options: {
          maintainAspectRatio: false,
          responsive: true,
          animation: {
            duration: 2000,
          },
          interaction: { 
            mode: 'x', //used for interactions based on x coord
          },
          plugins: {
            title: {
              display: true,
              text: "[Expenditures & Receipts]",
              font: {
                weight: 'bold',
                family: 'georgia sans-serif',
                size: 17
              }
            },
            customCanvasBackgroundColor: {
              color: 'transparent',
            },
            legend: {
              display: false,
              labels:{
                usePointStyle: true,
              },
              title: {
                display: true,
                text: "",
                font: {
                  weight: 'bold',
                }
              }
            },
            tooltip: {
              enabled: true,
              usePointStyle: false,
              callbacks: {
                labelPointStyle: function(context) {
                  return {
                      pointStyle: 'circle',
                  };
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: true,
                color: 'lightcoral',
                drawTicks: false,
              }
            },
            y: {
              grid: {
                display: false,
                color: 'lightgray',
                drawTicks: false,
              }
            },
          }
        },
        plugins: [ plugin ],
        data: {
          labels: yrs,  
          datasets: [ 
            {
              label: category, //name of dataset 
              data: vals,
              backgroundColor: 'transparent',
              borderColor: mySeriesColor.get(category),
              fill: 1,
              backgroundColor: mySeriesColor.get(category),
              pointStyle: 'circle',
              pointBorderColor: 'blueviolet',
              //tension: 0.4
            }
          ],
        }
      }
    );
    MSeriesExists = true
};

function createFedDebtSeries(category, yrs, vals){
  
  Chart.defaults.font.family = "poppins, sans-serif"
  Chart.defaults.font.size = 12
  Chart.defaults.elements.line.tension = 0.4
  Chart.defaults.color = 'white'
  Chart.defaults.elements.point.radius = 3

  fedDebtChart = new Chart(
    document.getElementById("debt-series-cht"),
    {
      type: 'line',
      options: {
        maintainAspectRatio: false,
        responsive: true,
        animation: {
          duration: 2000,
        },
        interaction: { 
          mode: 'x', //used for interactions based on x coord
        },
        plugins: {
          title: {
            display: true,
            text: "[Debt]",
            font: {
              weight: 'bold',
              family: 'georgia sans-serif',
              size: 17
            }
          },
          customCanvasBackgroundColor: {
            color: 'transparent',
          },
          legend: {
            display: false,
            labels:{
              display: false,
              usePointStyle: true,
            },
            title: {// legend title
              display: false,
              text: "",
              font: {
                size: 10,
                weight: 'bold',
              }
            }
          },
          tooltip: {
            enabled: true,
            usePointStyle: true,
            callbacks: {
              // labelColor: function(context) {
              //     return {
              //         //borderColor: 'rgb(0, 0, 255)',
              //         //backgroundColor: 'transparent',
              //         borderWidth: 5,
              //         //borderDash: [2, 2],
              //         //borderRadius: 2,
              //     };
              // },
              labelPointStyle: function(context) {
                return {
                    pointStyle: 'line',
                };
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: 'rgb(160, 51, 0)',
              drawTicks: false,
            }
          },
          y: {
            grid: {
              display: false,
              color: 'rgb(160, 51, 0)',
              drawTicks: false,
            }
          },
        }
      },
      plugins: [ plugin ],
      data: {
        labels: yrs,  // x vals
        datasets: [ 
          {
            label: category, //name of dataset 
            data: vals, // y vals
            backgroundColor: 'transparent',
            borderColor: mySeriesColor.get(category),
            fill: 'origin',
            backgroundColor: 'rgb(23, 23, 54)',
            //tension: 0.4
          }
        ],
      }
    }
  );
};

function createOutlays(mylabels, mydata) {

  if(mydata.length !=10){

    outlaysCht = new Chart(
      document.getElementById("outlays-cht"),
      {
        type: 'doughnut',
        //plugins: [ plugin ],
        data: {
          labels: ['not avail'], 
          datasets: [ 
            {
              data: [100],
              hoverOffset: 2,
              backgroundColor: myBkGrd,
              borderColor: 'white', 
              borderRadius: 2,
              borderWidth: 1
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              //align: 'left',
              display: false,
            },
            tooltip: {
              enabled: false,
            }
          },
          //borderColor: 'red',
          spacing: 25,
          //clip: {left: 25, top: 25, right: 25, bottom: 25},
          cutout: '75%',
        }
      }
    );
  }
  else{
    outlaysCht = new Chart(
      document.getElementById("outlays-cht"),
      {
        type: 'doughnut',
        //plugins: [ plugin ],
        data: {
          labels: mylabels,
          datasets: [ 
            {
              data: mydata,
              hoverOffset: 2,
              backgroundColor: myBkGrd,
              borderColor: 'white', 
              borderRadius: 2,
              borderWidth: 1

            }
          ]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              //align: 'left',
              display: false,
            }
          },
          //borderColor: 'red',
          spacing: 25,
          //clip: {left: 25, top: 25, right: 25, bottom: 25},
          cutout: '75%',
        }
      }
    );
  }
};

async function  updateOutlaysLegend(year, classes, percentages, amounts){ 

    const ax = document.querySelector(".aux1-table")

    while (ax.firstChild) {
      ax.removeChild(ax.firstChild)
    }  
    for(const i in classes){
      const dv = document.createElement("div")

      // To account for no data avail
      if(classes[0] == 'Other'){
        dv.textContent ='data not avail'
      }
      else{
        dv.textContent = classes[i]
        dv.setAttribute('class', 'parent-outlay')
      };
      
      const dv2 = document.createElement("div")
      dv2.textContent = percentages[i] + '%'

      // Get previous year total to determine change in total
      for(const idx in prevYearTtl[0]){
        if(classes[i] == (prevYearTtl[0][idx]['classification_description']).replace('Total--', '')){
          dv2.textContent += (` | chg: ${(((amounts[i] - prevYearTtl[0][idx]['current_fiscal_year_to_date_gross_outlays_amount']) /
          prevYearTtl[0][idx]['current_fiscal_year_to_date_gross_outlays_amount']) * 100).toFixed(2)}%`)
        }
      }
      dv2.setAttribute('class', 'outlay-perct')
      //dv2.style.color = myBkGrd[i]; //note: background color array is constant
      ax.appendChild(dv)
      ax.appendChild(dv2)
    }

    const outlay_yr = document.querySelector('.outlays-yr')
    outlay_yr.textContent = year
    const subtitle = document.createElement("span")
    subtitle.setAttribute("class", "subtitle")
    const brk = document.createElement("br")
    subtitle.textContent = 'percentages'
    outlay_yr.appendChild(brk)
    outlay_yr.appendChild(subtitle)
    add_listn_to_outlays_table()
    auxTableModal()
}

function outlayYearModal(){

  var modal = document.getElementById("options-modal")
  var btn = document.getElementById("tb2")
  var span = document.getElementsByClassName("close")[0]

  btn.onclick = function() { 
    modal.style.display = "block"
  }

  // Update Header
  var hd = document.querySelector(".modal-header-text")
  var hd2 = document.querySelector(".modal-header")
  var sp = document.createElement('span')
  sp.textContent = 'Year'
  var dv = document.createElement('div')
  dv.setAttribute("class", "modal-subtitle")
  dv.textContent = "expenditures by class"
  hd.appendChild(sp)
  hd2.append(dv)

  span.onclick = function() {
    modal.style.display = "none"
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none"
    }
  }

};

function update_outlayModal(years){

  //Updates modal with "years" based on query

  const modalContent = document.querySelector(".modal-body")
  while (modalContent.firstChild){
    modalContent.removeChild(modalContent.firstChild)
  }
  years.forEach((y)=>{
    var bElem = document.createElement("button")
    bElem.setAttribute("type", "button")
    bElem.setAttribute("class", "outlay-yrs-btn-modal")
    bElem.setAttribute("id", `yr${y}`)
    bElem.textContent = y
    modalContent.appendChild(bElem)
  });
  add_listn_to_years(years)
}

async function update_Outlays(date){

  const response = await fetch('q-outlays-' + date); 
  const outlaysJsn = await response.text()
  const myOutlaysData = JSON.parse(outlaysJsn)
  const myOutlays = JSON.parse(myOutlaysData[0])
  const myOutlayYrTtl = JSON.parse(myOutlaysData[1])
  for(const idx in prevYearTtl){
    prevYearTtl.pop()
  }
  prevYearTtl.push(JSON.parse(myOutlaysData[2]))
  const destroy = true
  format_outlays(myOutlays, myOutlayYrTtl, date, destroy)
   
}

function format_outlays(outlays, yeartotal, start, destroy){

  var cls_desc = []
  var outly_amt = []
  var gov_outlays = outlays
  var outlayPerct = []
  var topTen = 0
  var otherOtlyTtls = 0
  var idxCount = 0
  var OutlayTtls = 0
  var classDescr
  myTopOutlaysClassID = new Map()
  myOtherOutlaysVals = []
  myOtherOutlaysList = []
  SubClassList = []

  // Get year total
  for(var idx in yeartotal){
    OutlayTtls += yeartotal[idx]['year_ttl_all_cls']
  }

  // Get top 9 records
  for (var idx in gov_outlays){
    classDescr = (gov_outlays[idx]['clsdesc']).replace('Total--', '')
    idxCount += 1;
    if(topTen < 9){ 
      cls_desc.push(classDescr) 
      outlayPerct.push(Number((gov_outlays[idx]['amt'] / OutlayTtls) * 100).toFixed(2)) 
      outly_amt.push(gov_outlays[idx]['amt'])
      myTopOutlaysClassID.set(classDescr, gov_outlays[idx]['subclass_helper'] ) // Used to fetch drill down data and year change %
      SubClassList.push(gov_outlays[idx]['subclass_helper'])
      topTen += 1;
    }
    else{
      otherOtlyTtls += gov_outlays[idx]['amt'] //adds non top 10 amounts into 'Other' category
      myOtherOutlaysVals.push(gov_outlays[idx]['amt']) //used for otherOutlays drilldown
      myOtherOutlaysList.push(gov_outlays[idx]['clsdesc']) // ...
    }
  }

  cls_desc.push('Other')
  outlayPerct.push(Number((otherOtlyTtls / OutlayTtls) * 100).toFixed(2))

  if(destroy){outlaysCht.destroy()} 
  createOutlays(cls_desc, outlayPerct)
  updateOutlaysLegend(start, cls_desc, outlayPerct, outly_amt)

};

function add_listn_to_years(years){

    var xx = document.getElementsByClassName("close")[0];
    years.forEach((y)=>{
      document.querySelector(`#yr${y}`).addEventListener("click", function(){
        update_Outlays(`${y}`)
        xx.click()
      })
    })
}

function add_listn_to_outlays_table(){

  const parentOutlay = document.querySelectorAll('.parent-outlay')
  parentOutlay.forEach((p)=>{
    p.addEventListener('click', ()=>{

      // Gets composition of outlay class (subclasses) and their values
      if(p.textContent == 'Other'){
        const otherOutlays = true
        outlaysTblDrilldown(null, otherOutlays)
      }
      else{
        outlaysTblDrilldown(myTopOutlaysClassID.get(p.textContent))
      }
    })
  })
}

async function outlaysTblDrilldown(classID, otherOutlays){

  const tableHeader = document.querySelector('.aux-table-modal-header')
  tableHeader.textContent = ''
  const rowSect = document.querySelector('.aux-table-modal-rows')
  let drilldown
  
  while(rowSect.firstChild){
    rowSect.removeChild(rowSect.firstChild)
  }

  if(otherOutlays){}
  else{
    const drilldownReq = await fetch(`q-outlays-drilldown-${classID}`)
    const drilldownTxt = await drilldownReq.text()
    const drilldownData = JSON.parse(drilldownTxt)
    drilldown = JSON.parse(drilldownData[0])
  }

  if(otherOutlays){
    tableHeader.textContent = 'Other Expenditures'
    for(const idx in myOtherOutlaysList){
      const dv = document.createElement("div")
      dv.setAttribute('class', 'aux-table-modal-row')
      dv.textContent = myOtherOutlaysList[idx]
      const dv2 = document.createElement("div")
      dv2.setAttribute('class', 'aux-table-modal-row')
      dv2.textContent = new Intl.NumberFormat().format(myOtherOutlaysVals[idx])
      rowSect.appendChild(dv)
      rowSect.appendChild(dv2)
    }
  }
  else{
    tableHeader.textContent = (drilldown[0]['parent_cls_desc']).replace(':', '')
    for(const idx in drilldown){
      const dv = document.createElement("div")
      dv.setAttribute('class', 'aux-table-modal-row')
      const dv2 = document.createElement("div")
      dv2.setAttribute('class', 'aux-table-modal-row')

      const ttl = /Total/
      const colon = /:/
      if(ttl.test(drilldown[idx]['classification_description'])){
        dv.style.color = 'brown'
        dv2.style.color = 'brown'
        dv.textContent = drilldown[idx]['classification_description']
      }
      else {
        if(!colon.test(drilldown[idx]['classification_description'])){ // To avoid subclass headers
          if(Number(drilldown[idx]['amt']) != 0){
            dv.textContent = drilldown[idx]['classification_description']
          }
        }
        else{ 
          dv.textContent = drilldown[idx]['classification_description']
          if(colon.test(drilldown[idx]['classification_description'])){ // subclass headers
              dv.style.color = 'rgb(179, 179, 179)'
          }
        }
      }
      if(Number(drilldown[idx]['amt']) != 0){ // To exclude nulls
          dv2.textContent = new Intl.NumberFormat().format(drilldown[idx]['amt'])  
      }
      rowSect.appendChild(dv)
      rowSect.appendChild(dv2)
    }
  }
}

function auxTableModal(){ 

  const modal = document.querySelector('#aux-modal')
  const parentOutlay = document.querySelectorAll('.parent-outlay')
  const auxModalClose = document.querySelector('.aux-table-modal-close')
  
  parentOutlay.forEach((p)=>{
    p.addEventListener('click', ()=>{
      modal.style.display = "block"
    })
  })

  auxModalClose.onclick = function() {
    modal.style.display = "none"
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none"
    }
  }

  document.addEventListener('click', (event)=>{
    if(event.target == modal){
      modal.style.display = "none"
    }
  })

}

function aboutFiscal(){
  aboutBtn.addEventListener('click', function(){
    document.querySelector('.aux-table-modal-header').textContent  = ''
    const rowSect = document.querySelector('.aux-table-modal-rows')
    while(rowSect.firstChild){
      rowSect.removeChild(rowSect.firstChild)
    }
    const dv = document.createElement('div')
    dv.textContent = 'contact: eukoh@quaad.net'
    dv.setAttribute('class', 'aux-table-modal-row')
    rowSect.appendChild(dv)

    const dv2 = document.createElement('div')
    dv2.textContent = ''
    dv2.setAttribute('class', 'aux-table-modal-row')
    rowSect.appendChild(dv2)

    const dv3 = document.createElement('div')
    dv3.textContent = 'Github: https://github.com/quaad-net/fiscal.git'
    dv3.setAttribute('class', 'aux-table-modal-row')
    rowSect.appendChild(dv3)

    auxModal.style.display = 'block'

  })
}

function createReceiptsBarChart(categories, yrs, vals, canvas) {

  Chart.defaults.font.family = "poppins, sans-serif";
  Chart.defaults.font.size = 13;
  Chart.defaults.color = 'white';

  const data = {
    labels: yrs,
    datasets: [ 
      // {
      //   label: categories[4], 
      //   data:  vals[4],
      //   backgroundColor: mySeriesColor.get(categories[4]),
      //   borderWidth: 1,
      //   barThickness: 20
      // },
      {
        label: categories[3],
        data: vals[3],
        backgroundColor: mySeriesColor.get(categories[3]),
        borderWidth: 1,
        barThickness: 20
      },
      {
        label: categories[2], 
        data:  vals[2],
        backgroundColor: mySeriesColor.get(categories[2]),
        borderWidth: 1,
        barThickness: 20
      },
      {
        label: categories[1],
        data: vals[1],
        backgroundColor: mySeriesColor.get(categories[1]),
        borderWidth: 1,
        barThickness: 20
      },
      {
        label: categories[0],
        data: vals[0],
        backgroundColor: mySeriesColor.get(categories[0]),
        borderWidth: 1,
        barThickness: 20
      },
    ]
  }

receiptsBarChart = new Chart(

      canvas,
    {
      type: 'bar',
      data: data,
      options: {
        plugins: {
          title: {
            display: false,
            text: ''
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          }
        }
      }
    }
  )
}

function selectEconData(){

  const econGroup = document.querySelectorAll('.econ-group')

  function econTableModal(){ 

     const modal = document.querySelector('#econ-table-modal')
     const econModalClose = document.querySelector('.econ-table-modal-close')
  
     econModalClose.onclick = function() {
     modal.style.display = "none"
     }
  
     window.onclick = function(event) {
     if (event.target == modal) {
        modal.style.display = "none"
     }
     }
  
     document.addEventListener('click', (event)=>{
     if(event.target == modal){
        modal.style.display = "none"
     }
     })
  
  }

  async function getEconData(elemID){
     const header = document.querySelector('thead')
     while(header.firstChild){header.removeChild(header.firstChild)}
     const tbody = document.querySelector('tbody')
     while(tbody.firstChild){tbody.removeChild(tbody.firstChild)}
     const req = await fetch(`${elemID}/q-${qryStart}/${qryEnd}`)
     const res  = await req.text()
     const data = JSON.parse(res)
     const econData = JSON.parse(data[0])
     const obj = econData[0]  // Column headers/properties
     const headerTr = document.createElement('tr')

     // Add column headers 
     for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
           const columnHeader  = document.createElement('th')
           columnHeader.textContent = prop.replaceAll('_', ' ')
           headerTr.appendChild(columnHeader)
        }
     }
     header.appendChild(headerTr)

     for(const idx in econData){ // Access obj/row data
        const tr = document.createElement('tr')
        for(const val in econData[idx]){ // Access values in obj/row data
           const td = document.createElement('td')
           td.textContent =  econData[idx][val]
           tr.appendChild(td)   
        }
        tbody.appendChild(tr)
     }

  }

  econTableModal()
  econGroup.forEach((e)=>{
     e.addEventListener('click', function(){
        const modal = document.querySelector('#econ-table-modal')
        modal.style.display = "block"
        getEconData(e.id)
     })
  })
}
const firstInput = document.querySelector('#input-1');
const secInput = document.querySelector('#input-2');
firstInput.addEventListener('click', function(){
  firstInput.value = "";
})
secInput.addEventListener('click', function(){
  secInput.value = "";
})
firstInput.addEventListener('input', captureStartDate);
secInput.addEventListener('input', caputureEndDate);
const ht = document.querySelector('html');
const getBaseURL = ht.baseURI;
let startDate;
let endDate;
let setFiscalquery;
let MSeries;
let MSeriesExists = false;
let outlaysCht;
const myBkGrd = [
  'rgb(138, 43, 226)', 'rgb(165, 42, 42)', 'rgb(220, 20, 60)', 'rgb(210, 105, 30)', 'rgb(0, 0, 139)', 'rgb(0, 100, 0)', 'rgb(85, 107, 47)',
  'rgb(72, 61, 139)', 'rgb(255, 20, 147)', 'rgb(255, 0, 255)'
]
let OutlaysExist = false;
const dt = new Date();
const curYr =  dt.getFullYear();
const myStartYr = curYr - 6;
const myEndYr = curYr - 1; 
const myUrlStr = getBaseURL + 'q-' + myStartYr + '/' + myEndYr;
function captureStartDate(e) {
  startDate = e.target.value;
}
function caputureEndDate(e){
    endDate = e.target.value;
}
let fetchobj = [];
let dataForChts;
const qryBtn = document.querySelector("#qryBtn");
const mobileMenu = document.querySelector(".mb-icon-menu");
const sideBar = document.querySelector(".sidebar");
const mobileHeader = document.querySelector(".mobile-header");
const sidebarLbl = document.querySelectorAll(".sidebar-lbl"); 
const sidebarDataHd = document.querySelector(".datasets-list");
const sidebarClose = document.querySelector(".sidebar-close");

mobileMenu.addEventListener("click", function(){ 
  mobileHeader.style.display = "none";
  sideBar.style.display = "block";
})

sidebarClose.addEventListener("click", function(){
  sideBar.style.display = "none";
  mobileHeader.style.display = "block";
})

qryBtn.addEventListener("click", async function(){
  let userinp1 = Number(firstInput.value) ;
  let userinp2 = Number(secInput.value);
  if(userinp1 + 0 == 0){
    window.alert('Please enter a start year.');
  }
  else if(userinp2 ==0){
    window.alert('Please enter an end year.')
  }
  else if(userinp1 > userinp2){ 
    window.alert('Invalid year range.');
  }
  else{
      if(userinp1 > userinp2){
        window.alert('Invalid year range.');
      }
      else if(userinp1 < 1960){
        window.alert('Data available 1960-2023.');
      }
      else if(userinp2 > 2023){
        window.alert('Data available 1960-2023.');
      }
      else{
        let getStartYr = 0;
        let getEndYr = 0;
        getStartYr += Number(firstInput.value);
        getEndYr += Number(secInput.value);

        //adjust year range for certain user inputs
        if(getEndYr == 0){
          if(getStartYr == Number(curYr)){
            getStartYr -= 3;
            getEndYr = Number(curYr);
          }
          else{
            getEndYr = Number(curYr);
          }
        }
        if(getStartYr == getEndYr){
          getStartYr -=5;
        }
      
        let my_qry_btn_url = getBaseURL + 'q-' + getStartYr + '/' + getEndYr;
        const response = await fetch(my_qry_btn_url);
        dataForChts = await response.text();
        formatJSN(dataForChts, getStartYr);
      
        //adds years of available data to modal (years available determined by initial query search)
        let myYears = [];
        let i = 0; 
        if(getEndYr > getStartYr){
          while ((getStartYr + i) < getEndYr) {
            myYears.push(getStartYr + i);
            i++;
          };
          myYears.push(getEndYr);
        }
        else{myYears.push(getStartYr)};
        update_outlayModal(myYears);
      
        //add selected datasets in sidebar to array for query
        let myCat = [] //array of category names
        for (const lbl of sidebarLbl){
            if (lbl.style.backgroundColor == 'rgb(13, 13, 230)'){
              myCat.push(extractContent(lbl.textContent));
            }
        }
        getGovExpendPlus(myCat, getStartYr, getEndYr);
        sidebarClose.click();
      }
  }
  
});

function extractContent(textcontent) {
  let span = document.createElement('span');
  span.innerHTML = textcontent;
  return span.textContent
};

function formatJSN(myJSNStr, start){

    let cls_desc = [], outly_amt = [];
    let main_econ, gov_outlays;
    const myData = JSON.parse(myJSNStr);
    main_econ = JSON.parse(myData[0]);
    gov_outlays = JSON.parse(myData[1]);

    let gov_expd = [], yr = [];
    for (const idx in main_econ){
      gov_expd.push(main_econ[idx]['ttl_gov_expend']);
      yr.push(main_econ[idx]['yr']);
    };

    //select top 10 into array (qry returns result desc by 'amt')
    let topTen = 0; 
    let otherOtlyTtls = 0;
    let idxCount = 0;
    let OutlayTtls = 0;
    for(const idx in gov_outlays){
      OutlayTtls += gov_outlays[idx]['amt'];
    }
    for (const idx in gov_outlays){
      idxCount += 1;
      if(topTen < 9){ 
        cls_desc.push((gov_outlays[idx]['clsdesc']).replace('Total--', '')); //class description
        outly_amt.push(Math.round((gov_outlays[idx]['amt'] / OutlayTtls) * 100));
        topTen += 1;
      }
      else{
        otherOtlyTtls += gov_outlays[idx]['amt']; //adds non top 10 amounts into 'Other' category
       
      }
    };
    cls_desc.push('Other');
    outly_amt.push(Math.round((otherOtlyTtls / OutlayTtls) * 100)); 

    if(MSeriesExists){
      MSeries.destroy();
      createMainSeries('gov expend', yr, gov_expd);
      if(cls_desc.length = 10){
        outlaysCht.destroy();
        createOutlays(cls_desc, outly_amt);
        updateOutlaysLegend(start, cls_desc, outly_amt);
      }
    }
    else{
      createMainSeries('gov expend', yr, gov_expd);
      if(cls_desc.length = 10){
        createOutlays(cls_desc, outly_amt);
        updateOutlaysLegend(start, cls_desc, outly_amt);
      };
    }

};

function addData(chart, label, newData) {
  chart.data.labels = label;
  chart.data.datasets.forEach((dataset) => {
      //dataset.data.push(newData);
      dataset.data = newData;
  });
  chart.update();
}

function addDataSets(chart, label, newData, color) {
  chart.data.datasets.push( 
    {
      label: label,
      data: newData,
      borderColor: color,
    }
  );
  chart.update();
}

function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
      //dataset.data.pop();
      dataset.data = null;
  });
  chart.update();
}

function removeDataDoughnut(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
      dataset.data = null;
  });
  chart.update();
}

const plugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, args, options) => {
    const {ctx} = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || '#99ffff';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

function createMainSeries(category, yrs, vals) {
  
    Chart.defaults.font.family = "poppins, sans-serif"; //"Times, 'Times New Roman', serif, Georgia";
    Chart.defaults.font.size = 13;
    Chart.defaults.elements.line.tension = 0.4;
    Chart.defaults.color = 'white';
    Chart.defaults.elements.point.radius = 5;

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
            customCanvasBackgroundColor: {
              color: 'rgb(32, 32, 32)',
            },
            legend: {
              display: true,
              labels:{
                usePointStyle: true,
              },
              title: {
                display: false,
                text: "",
                font: {
                  size: 20,
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
              borderColor: 'blue',
              //tension: 0.4
            }
          ],
        }
      }
    );
    MSeriesExists = true;
};

function createOutlays(mylabels, mydata) {

  if(mydata.length !=10){

    outlaysCht = new Chart(
      document.getElementById("outlays-cht"),
      {
        type: 'doughnut',
        //plugins: [ plugin ],
        data: {
          labels: ['not avail'], //x-axis 
          datasets: [ //y-axis 
            {
              data: [100],
              hoverOffset: 2,
              backgroundColor: myBkGrd,
              borderColor: 'white', 
              borderRadius: 5
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
          labels: mylabels, //x-axis 
          datasets: [ //y-axis 
            {
              data: mydata,
              hoverOffset: 2,
              backgroundColor: myBkGrd,
              borderColor: 'white', 
              borderRadius: 5
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

function updateOutlaysLegend(year, classes, amounts){

    const ax = document.querySelector(".aux1-table");
    while (ax.firstChild) {
      ax.removeChild(ax.firstChild);
    }  
    for(const i in classes){
      const dv = document.createElement("div");

      //to account for no data avail
      if(classes[0] == 'Other'){
        dv.textContent ='data not avail'
      }
      else{
        dv.textContent = classes[i]
      };
      
      const dv2 = document.createElement("div")
      dv2.textContent = amounts[i] + '%'; 
      //dv2.style.color = myBkGrd[i]; //note: background color array is constant
      ax.appendChild(dv);
      ax.appendChild(dv2);
    }

    const outlay_yr = document.querySelector('.outlays-yr');
    outlay_yr.textContent = year;
    let subtitle = document.createElement("span");
    subtitle.setAttribute("class", "subtitle");
    let brk = document.createElement("br");
    subtitle.textContent = 'percentages';
    outlay_yr.appendChild(brk);
    outlay_yr.appendChild(subtitle);
}

function outlayYearModal(){

  var modal = document.getElementById("options-modal");
  var btn = document.getElementById("tb2"); //year button @ outlays by class chart
  var span = document.getElementsByClassName("close")[0];
  var modalOptions = document.querySelector(".options-modal-content");

  btn.onclick = function() { 
    if(window.screen.width<=600){
      modalOptions.style.top = '"' + window.scrollY + 'px' + '"';
    }
    modal.style.display = "block";
  }

  //updates header text
  let hd = document.querySelector(".modal-header-text");
  let hd2 = document.querySelector(".modal-header");
  let sp = document.createElement('span');
  sp.textContent = 'Year';
  let dv = document.createElement('div');
  dv.setAttribute("class", "modal-subtitle");
  dv.textContent = "expenditures by class"
  hd.appendChild(sp);
  hd2.append(dv);


  //<span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  //close modal
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

};

function update_outlayModal(years){
  //Updates modal with available years of data

  const modalContent = document.querySelector(".modal-body");
  while (modalContent.firstChild){
    modalContent.removeChild(modalContent.firstChild);
  }
  years.forEach((y)=>{
    let bElem = document.createElement("button");
    bElem.setAttribute("type", "button");
    bElem.setAttribute("class", "outlay-yrs-btn-modal");
    bElem.setAttribute("id", `yr${y}`);
    bElem.textContent = y;
    modalContent.appendChild(bElem);
  });
  add_listn_to_years(years);
}

async function update_Outlays(date){

  const setUrl = getBaseURL + 'q-outlays-' + date;
  const response = await fetch(setUrl); 
  const outlaysJsn = await response.text();
  format_outlaysJSN(outlaysJsn, date);
   
}

function format_outlaysJSN(myJSNStr, start){

  let cls_desc = [], outly_amt = [], gov_outlays, myData;
  myData = JSON.parse(myJSNStr);
  gov_outlays = JSON.parse(myData[0]);

  let topTen = 0; 
  let otherOtlyTtls = 0;
  let OutlayTtls = 0

  for(const idx in gov_outlays){
    OutlayTtls += gov_outlays[idx]['amt'];
  }

  for (const idx in gov_outlays){
    if(topTen < 9){ //selects into array top 10 desc
      cls_desc.push((gov_outlays[idx]['clsdesc']).replace('Total--', '')); //class description
      outly_amt.push(Math.round((gov_outlays[idx]['amt'] / OutlayTtls) * 100)); 
      topTen += 1;
    }
    else{
      otherOtlyTtls += gov_outlays[idx]['amt']; //adds non top 10 to 'other'
    }
  };
  cls_desc.push('Other');
  outly_amt.push(Math.round((otherOtlyTtls / OutlayTtls) * 100)); 

  if(cls_desc.length = 10){
    outlaysCht.destroy();
    createOutlays(cls_desc, outly_amt);
    updateOutlaysLegend(start, cls_desc, outly_amt);
  }
};

// //to load intial datasets and charts 
window.addEventListener("load", (event) => {

  initialDataSets();
  outlayYearModal(); //generates modal

  //adds years of available data to modal (years available a determined by intial query search)
  let myYears = [];
  let i = 0; 
  if(myEndYr > myStartYr){
    while ((myStartYr + i) < myEndYr) {
      myYears.push(myStartYr + i);
      i++;
    };
    myYears.push(myEndYr);
  }
  else{myYears.push(myStartYr)};
  update_outlayModal(myYears); //updates modal with new years
});

function initialDataSets(){
  //adds additional initial datasets to gov expenditures series

  SideLblListn();
  firstInput.value = myStartYr;
  secInput.value = myEndYr;
  sidebarLbl.forEach((s)=>{
    switch (s.textContent){
      case 'personal savings':
        s.style.backgroundColor = 'rgb(13, 13, 230)';
        break;
      case 'personal consumption':
        s.style.backgroundColor = 'rgb(13, 13, 230)';
        break;
    }
  })
  qryBtn.click(); 
}

function add_listn_to_years(years){
    //adds event listeners to all years in modal

    let xx = document.getElementsByClassName("close")[0];
    years.forEach((y)=>{
      document.querySelector(`#yr${y}`).addEventListener("click", function(){
        update_Outlays(`${y}`);
        xx.click();  
      });
    });
}

async function getGovExpendPlus(categories, startyear, endyear){

  let my_qry_btn_url = getBaseURL + 'q-expd-' + startyear + '/' + endyear;
  const response = await fetch(my_qry_btn_url);
  dataForChts = await response.text();
  formatGovExpendPlus(dataForChts, categories);
  
}

function formatGovExpendPlus(data, categories){
  let myData = JSON.parse(data);
  let govExpdPlus = JSON.parse(myData[0]);
  let gdp = [], real_gdp = [], gross_domestic_income = [], personal_income = [], corp_profits = [], personal_consumption = [];
  let real_personal_consumption = [], gov_consumption_and_investments = [], real_gov_consumption_and_investments = [], net_exports = [];
  let exports = [], imports = [], real_net_exports = [], real_exports = [], real_imports = [], federal_debt = [], money_supply_m1 = [], personal_savings = [];
  
  for (const idx in govExpdPlus){
    //year.push(govExpdPlus[idx]['year']);
    //gov_expend.push(govExpdPlus[idx]['gov_expend']);
    gdp.push(govExpdPlus[idx]['gdp']);
    real_gdp.push(govExpdPlus[idx]['real_gdp']);
    gross_domestic_income.push(govExpdPlus[idx]['gross_domestic_income']);
    personal_income.push(govExpdPlus[idx]['personal_income']);
    corp_profits.push(govExpdPlus[idx]['corp_profits']);
    personal_consumption.push(govExpdPlus[idx]['personal_consumption']);
    real_personal_consumption.push(govExpdPlus[idx]['real_personal_consumption']);
    gov_consumption_and_investments.push(govExpdPlus[idx]['gov_consumption_and_investments']);
    real_gov_consumption_and_investments.push(govExpdPlus[idx]['real_gov_consumption_and_investments']);
    net_exports.push(govExpdPlus[idx]['net_exports']);
    exports.push(govExpdPlus[idx]['exports']);
    imports.push(govExpdPlus[idx]['imports']);
    real_net_exports.push(govExpdPlus[idx]['real_net_exports']);
    real_exports.push(govExpdPlus[idx]['real_exports']);
    real_imports.push(govExpdPlus[idx]['real_imports']);
    federal_debt.push(govExpdPlus[idx]['federal_debt']);
    money_supply_m1.push(govExpdPlus[idx]['money_supply_m1']);
    personal_savings.push(govExpdPlus[idx]['personal_savings']);
  }

  function getMyData(category){
    const myDataArr = new Map();
    myDataArr.set('gdp', gdp);
    myDataArr.set('real_gdp', real_gdp);
    myDataArr.set('gross_domestic_income', gross_domestic_income);
    myDataArr.set('personal_income', personal_income);
    myDataArr.set('corp_profits', corp_profits);
    myDataArr.set('personal_consumption', personal_consumption);
    myDataArr.set('real_personal_consumption', real_personal_consumption);
    myDataArr.set('gov_consumption_and_investments', gov_consumption_and_investments);
    myDataArr.set('real_gov_consumption_and_investments', real_gov_consumption_and_investments);
    myDataArr.set('net_exports', net_exports);
    myDataArr.set('exports', exports);
    myDataArr.set('imports', imports);
    myDataArr.set('real_net_exports', real_net_exports);
    myDataArr.set('real_exports', real_exports);
    myDataArr.set('real_imports', real_imports);
    myDataArr.set('federal_debt', federal_debt);
    myDataArr.set('money_supply_m1', money_supply_m1);
    myDataArr.set('personal_savings', personal_savings);
    return myDataArr.get(category);
  }

  //replace spaces with underscores (for sql query)
  categories.forEach((c)=>{
    let myTxt = c;
    let qryCol = ''
    let undrSr = "_"
    for(const idx in myTxt){
      if(myTxt[idx]== ' '){
        qryCol += undrSr;
      }
      else{
        qryCol += myTxt[idx];
      }
    };
    addDataSets(MSeries, c, getMyData(qryCol), mySeriesColor(qryCol)); //qryCol replaces spaces(' ') in c.value with '_'
  });
}

function mySeriesColor(category){
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
  return mySeriesBackGrounds.get(category);
}

function SideLblListn(){
  for (const lbl of sidebarLbl){
    lbl.addEventListener('click', function(){
      if (lbl.style.backgroundColor != 'rgb(13, 13, 230)'){
        lbl.style.backgroundColor = 'rgb(13, 13, 230)';
      }
      else{
        lbl.style.backgroundColor = "";
      }
    });
  }
}

// async function getPriceIdx(){ 

//   let getStartYr = 0;
//   let getEndYr = 0;
//   getStartYr += Number(firstInput.value);
//   getEndYr += Number(secInput.value);
//   let myIdxUrl = getBaseURL + 'q-idx-' + getStartYr + '/' + getEndYr;
//   const response = await fetch(myIdxUrl);
//   const jsnStr = await response.text();
//   const myData = JSON.parse(jsnStr);
//   const p_idx = JSON.parse(myData[0]);
//   const idxdataSet = []


//   for(const idx in p_idx){
//     let rw = [];
//     rw.push(p_idx[idx]['yr']);
//     rw.push(p_idx[idx]['cpiaucsl']);
//     rw.push(p_idx[idx]['CSUSHPINSA']);
//     rw.push(p_idx[idx]['HLTHSCPIMEPS']);
//     rw.push(p_idx[idx]['IPMAN']);
//     rw.push(p_idx[idx]['PPIACO']);
//     idxdataSet.push(rw);
//   }

//   new DataTable('#price-idx', {
//     columns: [
//         { title: 'Year' },
//         { title: 'CPI' },
//         { title: 'Home' },
//         { title: 'Health Expd' },
//         { title: 'Industr Manufact' },
//         { title: 'Producer' }
//     ],
//     data: idxdataSet,
//     paging: false,
//     searching: false,
//     searchPanes: false,
//     responsive: true,
//     //scrollY: 
//   });

//   //removes text showing number of entries
//   let entr = document.querySelector(".dt-info");
//   let entr2 = document.querySelector(".dt-end");
//   entr.textContent = '';
//   entr2.textContent = '';
// };
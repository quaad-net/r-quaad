async function getPriceIdx(){ 

  var getStartYr = 0;
  var getEndYr = 0;
  getStartYr += Number(firstInput.value);
  getEndYr += Number(secInput.value);
  var myIdxUrl = 'q-idx-' + getStartYr + '/' + getEndYr;
  const response = await fetch(myIdxUrl);
  const jsnStr = await response.text();
  const myData = JSON.parse(jsnStr);
  const p_idx = JSON.parse(myData[0]);
  const idxdataSet = []


  for(const idx in p_idx){
    var rw = [];
    rw.push(p_idx[idx]['yr']);
    rw.push(p_idx[idx]['cpiaucsl']);
    rw.push(p_idx[idx]['CSUSHPINSA']);
    rw.push(p_idx[idx]['HLTHSCPIMEPS']);
    rw.push(p_idx[idx]['IPMAN']);
    rw.push(p_idx[idx]['PPIACO']);
    idxdataSet.push(rw);
  }

  new DataTable('#price-idx', {
    columns: [
        { title: 'Year' },
        { title: 'CPI' },
        { title: 'Home' },
        { title: 'Health Expd' },
        { title: 'Industr Manufact' },
        { title: 'Producer' }
    ],
    data: idxdataSet,
    paging: false,
    searching: false,
    searchPanes: false,
    responsive: true,
    //scrollY: 
  });

  // removes text showing number of entries
  var entr = document.querySelector(".dt-info");
  var entr2 = document.querySelector(".dt-end");
  entr.textContent = '';
  entr2.textContent = '';
};
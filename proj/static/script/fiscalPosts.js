function outlayYearModal(){

  var modal = document.getElementById("options-modal");
  var btn = document.getElementById("tb2"); //year button @ outlays by class chart
  var span = document.getElementsByClassName("close")[0];
  var modalOptions = document.querySelector(".options-modal-content");

  btn.onclick = function() { 
    modal.style.display = "block";
  }

  //updates header text
  var hd = document.querySelector(".modal-header-text");
  var hd2 = document.querySelector(".modal-header");
  var sp = document.createElement('span');
  sp.textContent = 'Year';
  var dv = document.createElement('div');
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
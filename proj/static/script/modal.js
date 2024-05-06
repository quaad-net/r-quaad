export function createModal(btnID, title){

  var modal = document.getElementById("options-modal");
  var btn = document.getElementById(btnID);
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
  dv.textContent = title
  hd.appendChild(sp);
  hd2.append(dv);


  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

};
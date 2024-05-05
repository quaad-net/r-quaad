let btn = document.querySelector(".cntct-btn");
let ct = document.querySelector(".contact");
let sp = document.createElement("span");
sp.setAttribute("class", "email");

ct.addEventListener("click", function(){
    sp.textContent = 'eukoh@quaad.net';
    ct.appendChild(sp);
})
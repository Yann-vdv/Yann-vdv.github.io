function afficher_div(nom) {
    var div = document.getElementById(nom);
    if (div.style.display == "none" || div.style.display == "") {
        div.style.display = "block";
    } else {
        div.style.display = "none";
    }
}
function afficher_div(nom) {
    var div = document.getElementById(nom);
    if (div.style.display == "none" || div.style.display == "") {
        div.style.display = "block";
        document.getElementById(nom + "_button").innerHTML = "voir moins";
    } else {
        div.style.display = "none";
        document.getElementById(nom + "_button").innerHTML = "voir plus";
    }
}
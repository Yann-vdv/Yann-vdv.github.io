$(document).ready(function () {

    $("#title").click(function (event) {
        location.reload();
    });

    //CONVERT IMAGE FOR STORAGE
    function getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = canvas.width * (img.height / img.width);

        var ctx = canvas.getContext("2d");
        canvas.width = img.width * 0.375;
        canvas.height = img.height * 0.375;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        var dataURL = canvas.toDataURL("image/png");

        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    };

    //MEMOIRE
    document.getElementById('result').innerHTML = navigator.deviceMemory || 'unknown'; //initialisation
    function mémoire() {
        setInterval(function () { document.getElementById('result').innerHTML = navigator.deviceMemory || 'unknown'; }, 10000);
    }
    mémoire(); //actualise toute les 10sec

    //BATTERY
    if ('getBattery' in navigator || ('battery' in navigator && 'Promise' in window)) {

        function onChargingChange() {
            document.getElementById('charging').innerHTML = (this.charging ? 'chargement' : 'déchargement');
        }
        function onChargingTimeChange() {
            if (this.chargingTime != "Infinity") {
                document.getElementById('chargingTime').innerHTML = 'environ' + this.chargingTime + ' s';
            }
            else {
                document.getElementById('chargingTime').innerHTML = 'infini';
            }
        }
        function onDischargingTimeChange() {
            if (this.dischargingTime != "Infinity") {
                document.getElementById('dischargingTime').innerHTML = 'environ' + this.dischargingTime + ' s';
            }
            else {
                document.getElementById('dischargingTime').innerHTML = 'infini';
            }
        }
        function onLevelChange() {
            document.getElementById('level').innerHTML = this.level * 100 + '%';
        }

        var batteryPromise;

        if ('getBattery' in navigator) {
            batteryPromise = navigator.getBattery();
        } else {
            batteryPromise = Promise.resolve(navigator.battery);
        }

        batteryPromise.then(function (battery) {
            document.getElementById('charging').innerHTML = battery.charging ? 'chargement' : 'déchargement';
            if (battery.chargingTime != "Infinity") {
                document.getElementById('chargingTime').innerHTML = battery.chargingTime + ' s';
            }
            else {
                document.getElementById('chargingTime').innerHTML = 'infini';
            }
            if (battery.dischargingTime != "Infinity") {
                document.getElementById('dischargingTime').innerHTML = battery.dischargingTime + ' s';
            }
            else {
                document.getElementById('dischargingTime').innerHTML = 'infini';
            }
            document.getElementById('level').innerHTML = battery.level * 100 + '%';

            battery.addEventListener('chargingchange', onChargingChange);
            battery.addEventListener('chargingtimechange', onChargingTimeChange);
            battery.addEventListener('dischargingtimechange', onDischargingTimeChange);
            battery.addEventListener('levelchange', onLevelChange);
        });
    };

    //AJOUT DES PRODUITS EN MEMOIRES
    function produitEnMémoire() {
        nbPTtemp = localStorage.getItem("nbProduitListeCourses");
        if (nbPTtemp == null) {
            nbProduitTotal = 0;
        }
        else {
            nbProduitTotal = parseInt(localStorage.getItem("nbProduitListeCourses"));
            for (let i = 1; i <= nbProduitTotal; i++) {
                if (localStorage.getItem(("produit", i)) != null) {             //si le produit a été suprimé, le passe
                    tab = localStorage.getItem(("produit", i)).split(",je split,");
                    nom = tab[0];
                    desc = tab[1];
                    picture = tab[2];
                    ajouterProduit(nom, desc, picture, i)
                }
            }
        }
    };
    produitEnMémoire();

    //VIDEO ET PHOTO
    function getUserMedia(options, successCallback, failureCallback) {
        var api = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia;
        if (api) {
            return api.bind(navigator)(options, successCallback, failureCallback);
        }
    }

    var theStream;

    $("#getStream").click(function (event) {

        event.preventDefault();

        if (!navigator.getUserMedia && !navigator.webkitGetUserMedia &&
            !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
            alert('User Media API not supported.');
            return;
        }

        var constraints = {
            video: true
        };

        getUserMedia(constraints, function (stream) {
            var mediaControl = document.querySelector('video');
            if ('srcObject' in mediaControl) {
                mediaControl.srcObject = stream;
            } else if (navigator.mozGetUserMedia) {
                mediaControl.mozSrcObject = stream;
            } else {
                mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
            }
            theStream = stream;

        }, function (err) {
            alert('Error: ' + err);
        });
        document.getElementById("getStream").classList = "d-none"
        document.getElementById("takePhoto").classList = "";
    });

    $("#takePhoto").click(function (event) {

        event.preventDefault();

        if (!('ImageCapture' in window)) {
            alert('ImageCapture is not available');
            return;
        }

        if (!theStream) {
            alert('Grab the video stream first!');
            return;
        }

        var theImageCapturer = new ImageCapture(theStream.getVideoTracks()[0]);

        theImageCapturer.takePhoto()
            .then(blob => {
                document.getElementById("takePhoto").classList = "d-none";
                document.getElementById("getStream").classList = "";
                theStream.getTracks()[0].stop();                        //stop la cam
                var theImageTag = document.getElementById("getStream");
                theImageTag.src = URL.createObjectURL(blob);
            })
            .catch(err => alert('Error: ' + err));
    });

    //AJOUT D'UN PRODUIT
    function ajouterProduit(nom, desc, picture, nbproduit) {
        var documentFragment = document.createRange().createContextualFragment(`
            <div>
                <h4>${nom}</h4>
                <p>${desc}</p>
            </div>
            <img id="pic" src=${picture}>
            <div>
                <img id="editProduit" data-nbProduit="${nbproduit}" src="image/edit.png">
                <img id="suprProduit" data-nbProduit="${nbproduit}" src="image/bin.png">
            </div>
        `)
        var listItem = document.createElement("li");
        listItem.appendChild(documentFragment);
        document.getElementById("listeDesCourses").appendChild(listItem);
    }

    //EDITER UN PRODUIT
    $('#listeDesCourses').on('click', '#editProduit', function () {
        var nbProduit = this.dataset.nbproduit
        //adapter le form pour éditer
        tab = localStorage.getItem(("produit", nbProduit)).split(",je split,");
        nom = tab[0];
        desc = tab[1];
        picture = tab[2];
        document.getElementById("Nom").value = nom;
        document.getElementById("Desc").value = desc;
        //si cam, cam stop
        if (!theStream in window) {
            theStream.getTracks()[0].stop();
        }
        document.getElementById("takePhoto").classList = "d-none";
        document.getElementById("getStream").classList = "";
        document.getElementById("getStream").src = picture;
        document.getElementById("btnNvProduit").classList = "d-none";
        document.getElementById("btnEditProduit").classList = "btn btn-primary";
        document.getElementById("btnEditProduit").dataset.nbProduit = nbProduit;
    });

    //SUPRIMER UN PRODUIT
    $('#listeDesCourses').on('click', '#suprProduit', function () {
        var nbProduit = this.dataset.nbproduit;
        localStorage.removeItem(nbProduit);
        location.reload();
    });

    //FORM EDITION PRODUIT
    $("#btnEditProduit").click(function (event) {

        event.preventDefault()

        //vérif si un nom est entré (minimum)
        if (document.getElementById("Nom").value == "") {
            alert("un nom est nécessaire");
            return
        }

        //récup des variables
        var nbProduit = document.getElementById("btnEditProduit").dataset.nbProduit;
        var nom = document.getElementById("Nom").value;
        var desc = document.getElementById("Desc").value;
        var picture = document.getElementById("getStream").src;

        //stockage dans le localstorage
        if ((picture.substr(0, 22) == "data:image/png;base64,") == false) {
            bannerImage = document.getElementById('getStream');
            var picture = getBase64Image(bannerImage);
            picture = "data:image/png;base64," + picture;
        }
        Liste = [nom, "je split", desc, "je split", picture];
        localStorage.setItem(("produit", nbProduit), Liste);
        location.reload();
    });

    //FORM NV PRODUIT
    $("#btnNvProduit").click(function (event) {

        event.preventDefault()

        //vérif si un nom est entré (minimum)
        if (document.getElementById("Nom").value == "") {
            alert("un nom est nécessaire");
            return
        }

        //récup des variables et ajout du produit sur la page
        nbProduitTotal = nbProduitTotal + 1;
        var nom = document.getElementById("Nom").value;
        var desc = document.getElementById("Desc").value;
        var picture = document.getElementById("getStream").src;
        ajouterProduit(nom, desc, picture, nbProduitTotal)

        //stockage dans le localstorage

        if (picture.substr(picture.length - 14, picture.length) != "camera--v1.png") {          //si aucune image n'est rentrée
            bannerImage = document.getElementById('getStream');
            var picture = getBase64Image(bannerImage);
            picture = "data:image/png;base64," + picture;
        }
        Liste = [nom, "je split", desc, "je split", picture];
        localStorage.setItem(("produit", nbProduitTotal), Liste);
        localStorage.setItem("nbProduitListeCourses", nbProduitTotal);

        //reset du form
        document.getElementById("Nom").value = "";
        document.getElementById("Desc").value = "";
        document.getElementById("getStream").src = "image/camera--v1.png";
    });
});
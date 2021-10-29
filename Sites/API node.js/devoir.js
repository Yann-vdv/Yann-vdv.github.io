const http = require("http");
const fs = require("fs");

function rand(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
const regexpRand = /^\/alea\/(\d+)\/(\d+)$/;
const regexpDN = /^\/donald\/neveux\/(\w+)/;
const regexpDN1 = /^\/donald\/neveux\/riri\w+fifi\w+loulou$/;
const regexpPicsouDollars = /^\/picsou\/(\d+)$/;

let tabDollars = [];
const serveur = http.createServer((req, res) => {
    if (req.method === "GET" && regexpRand.test(req.url)) {
        const match = regexpRand.exec(req.url);
        const min = parseInt(match[1]);
        const max = parseInt(match[2]);
        if (min > max) {
            res.writeHead(400);
            res.end();
        }
        else {
            res.end(`${rand(min, max)}`);
        }
    }
    else if (req.method === "GET" && regexpDN.test(req.url)) {
        if (regexpDN1.test(req.url)) {
            res.writeHead(200);        //optionel ?
            res.end();
        }
        else {
            res.writeHead(400);
            res.end();
        }
    }
    else if (req.method === "POST" && regexpPicsouDollars.test(req.url)) {
        const match = regexpPicsouDollars.exec(req.url);
        const n = parseInt(match[1]);
        tabDollars.push(n);
        res.end();
    }
    else if (req.method === "GET" && req.url === "/picsou/dollars") {
        res.end(JSON.stringify(tabDollars));
    }
    else if (req.method === "GET" && req.url === "/picsou/dollars/total") {
        let total = 0;
        let nbtotal = 0;
        tabDollars.forEach(elt => {
            total = total + elt;
            nbtotal = nbtotal + 1;
        });
        res.setHeader("Content-type", "application/json");
        res.end(`{ "total": "${total}", "nb_items": "${nbtotal}" }`);
    }
    else if (req.method === "GET" && req.url === "/index.html") {
        fs.readFile("Sites/API node.js/index.html", "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            res.end(data);
        });
    }
    else if (req.method === "DELETE" && req.url === "/picsou/bankrup") {
        tabDollars.length = 0;
        res.end()
    }
    //-------------------------------CSS--------------------------------//
    else if (req.method === "GET" && req.url === "/asset/css/style.css") {
        fs.readFile("Sites/API node.js/asset/css/style.css", "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            res.end(data);
        });
    }
    //-----------------------------------------------------------------//
    else {
        res.writeHead(404);
        res.end()
    }
});
serveur.listen(10001)
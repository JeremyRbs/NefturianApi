/* import de la librairie */
const express = require('express')
const app = express()
app.use(express.json())

// Après réception de la requête post
app.post('/nefturian', (req,res) => {

    let body = req.body;

    // Récupération d'une liste de planètes
    let planetes = listePlanetes(body.routes);

    //console.log(planetes);

    // Vérification du bon nombre de routes
    if(body.N != body.routes.length) {
        res.send(400, "Pas le bon nombre")
    }

    // Vérification de l'existence de la planète A
    if(planeteExiste(body.planetA, body.routes) == false) {
        res.send(400, "Planète A n'existe pas");
    }

    // Vérification de l'existence de la planète B
    if(planeteExiste(body.planetB, body.routes) == false) {
        res.send(400, "Planète B n'existe pas");
    }

    // Algorithme de Dikjstra
    let plusCourt = plusCourtChemin(planetes, body.routes, body.planetA, body.planetB);

    // Renvoie du chemin le plus court
    //console.log(plusCourt);
    res.send(plusCourt)
});

// Vérification de la mise en route du serveur
app.listen(8080, () => {
    console.log("Serveur à l'écoute")
})

// Fonction permettant la vérification de l'existence d'une planète
function planeteExiste(planete, liste) {
    for(let item of liste) {
        if(item.planet1 == planete || item.planet2 == planete) {
            return true;
        }
    }
    return false;
}

// Fonction permettant de retourner la liste des planètes reçues en JSON
function listePlanetes(liste) {
    let planetes = [];

    for(let p of liste) {
        if(planetes.includes(p.planet1) == false) {
            planetes.push(p.planet1);
        }
        if(planetes.includes(p.planet2) == false) {
            planetes.push(p.planet2);
        }
    }

    return planetes;

}

// Fonction permettant de trouver le plus court chemin
function plusCourtChemin(listeSommets, liste, planeteA, planeteB) {

    let calculRoute = [];

    // Algorithme de Dijkstra
    let pluscourt = [];
    let predecesseur = [];
    let indice = 0;

    for(let p of listeSommets) {
        pluscourt.push(0);
    }

    //while(indice != pluscourt.length){
        for(let p of liste) {

            if(planeteA == p.planet1){
                calculRoute.push(p.planet1);
            }
            
            if(calculRoute.length != 0 && planeteB != p.planet2){
                for(let q of liste) {
                    if(p.planet2 == q.planet1){
                        calculRoute.push(q.planet1);
                    }
                }
            }else{
                calculRoute.push(p.planet2)
            }
        }
        indice ++ ;
    //}

    let route = "'route' : [" + calculRoute + "], ";

    // Calcul du temps suivant la route
    let calculTemps = 0;
    let tailleRoute = calculRoute.length;

    for(let i = 0; i < calculRoute.length; i++) {
        for(let p of liste) {
            if(calculRoute[i] == (p.planet1) && calculRoute[i+1] == (p.planet2)) {
                calculTemps += p.time;
                i++;
            }
        }
    }

    let temps = "'time' : " + JSON.stringify(calculTemps);

    // Retour du résultat
    let resultat = "{" + route + temps + "}";
    return resultat;

}
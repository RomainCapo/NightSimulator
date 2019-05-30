/*
* Romain Capocasale
* INF2dlm-A
* He-Arc
* 15.05.2019
* NightSimulator
 */

// creation d'un tableau avec les noeuds
var nodes = new vis.DataSet([
{id: 'a', label: 'Republic Bar', drinkPriceAvg:12, ambience:9, x: 870, y: 0},
{id: 'b', label: 'Inside', drinkPriceAvg:10, ambience:9, x: 420, y: 50},
{id: 'c', label: 'Cerf', drinkPriceAvg:8, ambience:7, x: 290, y: 140},
{id: 'd', label: 'Glenn', drinkPriceAvg:5, ambience:5, x: 400, y: 105},
{id: 'e', label: 'Seven', drinkPriceAvg:12, ambience:10, x: 475, y: 110},
{id: 'f', label: 'Prestige', drinkPriceAvg:6, ambience:4, x: 250, y: 190},
{id: 'g', label: 'Charlot', drinkPriceAvg:7, ambience:3, x: 320, y: 210},
{id: 'h', label: 'Brasseur', drinkPriceAvg:8, ambience:5, x: 530, y: 170},
{id: 'i', label: 'Vibes Club', drinkPriceAvg:12, ambience:9, x: 630, y: 140},
{id: 'j', label: 'Bart', drinkPriceAvg:9, ambience:6,x: 720, y: 200},
{id: 'k', label: '21', drinkPriceAvg:6, ambience:7,x: 750, y: 150},
{id: 'l', label: 'King Du Lac', drinkPriceAvg:6, ambience:8, x: 600, y: 260},
{id: 'm', label: 'Bassin Bleu', drinkPriceAvg:8, ambience:5, x: 500, y: 280},
{id: 'n', label: 'Waves', drinkPriceAvg:15, ambience:4, x: 720, y: 300},
{id: 'o', label: 'Case a choc', drinkPriceAvg:11, ambience:10, x: 0, y: 140}
]);

// creations d'un tableau avec les cotes
var edges = new vis.DataSet([
{id:0, from:'a', to:'b'}, {id:1, from:'a', to:'k'}, {id:2, from:'a', to:'i'},
{id:3, from:'b', to:'c'}, {id:4, from:'b', to:'d'}, {id:5, from:'b', to:'e'},
{id:6, from:'c', to:'f'}, {id:7, from:'c', to:'g'},
{id:8, from:'d', to:'c'}, {id:9, from:'d', to:'h'}, {id:10, from:'d', to:'e'}, {id:11, from:'d', to:'g'},
{id:12, from:'e', to:'a'}, {id:13, from:'e', to:'h'}, {id:14, from:'e', to:'i'},
{id:15, from:'f', to:'g'},
{id:16, from:'g', to:'h'}, {id:17, from:'g', to:'l'}, {id:18, from:'g', to:'m'},
{id:19, from:'h', to:'i'}, {id:20, from:'h', to:'l'},
{id:21, from:'i', to:'n'}, {id:22, from:'i', to:'l'}, {id:23, from:'i', to:'j'}, {id:24, from:'i', to:'k'},
{id:25, from:'j', to:'k'}, {id:26, from:'j', to:'n'},
{id:27, from:'l', to:'m'}, {id:28, from:'l', to:'n'},
{id:29, from:'o', to:'c'}, {id:30, from:'o', to:'f'},
]);

//creation du reseau
var container = document.getElementById('mynetwork');

// fournit les donnees sous le format de la librairie
var data = {
    nodes: nodes,
    edges: edges
};

//options du graphe
var options = {
  physics:false,
   interaction: {
      dragNodes: false,
    },
    nodes :{
      color :'#5bc0de',
      shape: 'box',
      margin: 5,
    },
   edges: {
     hoverWidth: 1,
     color:{
       inherit:false
     },
     font: {
       align: 'top'
     }
   }
};

var network = new vis.Network(container, data, options);//Initialisation du reseau

let gr = new GraphRepresentation(nodes, edges);//création de l'objet permettant de dessiner sur le graphe
gr.initEdgesLabel();

let gc = new GraphComputation(nodes, edges);//création du graphe

let idBarClicked = -1;//id du noeud cliqué, -1 si aucun noeud cliqué
let isSimulationMode = false;//indique l'état dans lequel est le graphe, true -> en simulation, false -> pas en simulation

/**
 * Evenement lors d'un clic sur un noeud. Lors du clic, on colorie le noeud selon le mode de simulation et on récupère l'id di noeud.
 */
network.on('selectNode', function (properties) {
  let nodeID = properties.nodes[0];

  if (nodeID) {
    idBarClicked = this.body.nodes[nodeID].options.id;
  }

  if(!isSimulationMode){
    nodes.update({id:idBarClicked, color:'#0275d8'});
      document.getElementById("run").disabled = false;
   }

   document.getElementById('barInfo').style.visibility = "visible";
   document.getElementById('barName').textContent = nodes._data[nodeID].label;
   document.getElementById('barContent').innerHTML = '<ul><li>Drink price : ' + nodes._data[nodeID].drinkPriceAvg + '.-</li><li>Ambience : ' + nodes._data[nodeID].ambience + '/10</li></ul>';
});

/**
 * Evenement lors de la deselection d'un noeud. On decolorie le noeud desélectionné.
 */
network.on('deselectNode', function(properties){
    let deselectedNodeId = properties.previousSelection.nodes[0];

    if(!isSimulationMode){
      nodes.update({id:deselectedNodeId, color:'#5bc0de'});
      document.getElementById("run").disabled = true;
    }
    document.getElementById('barInfo').style.visibility = "hidden";
});

/**
 * Evenement lors du clic sur le bouton de lancement de la simulation
 */
function runClicEvent(){
  if(idBarClicked != -1){
    let selectedRadio = document.querySelector('input[name="simulation"]:checked').value;//on récupére le nom de la simulation que veux lancer l'utilisateur

    //ASP : All Shortest Paths
    switch (selectedRadio) {
      case 'allShortestPaths':
        //récupération du critère de simulation
        let eCritASP = document.getElementById("criterion");
        let critASP = eCritASP.options[eCritASP.selectedIndex].value;

        let simulationResult = gc.getAllShortestPaths(idBarClicked, critASP);

        gr.colorNode(idBarClicked, '#5cb85c');

        //affichage des resultats
        document.getElementById('result').innerHTML = gr.showAllShortestPaths(simulationResult, critASP);
        break;

      // Shortest Path
      case 'shortestPath':
        //récupération du bar séléctionné
        let eBars = document.getElementById("bars");
        let idBarSelected = eBars.options[eBars.selectedIndex].value;

        //récupération du critère de simulation
        let eCritSP = document.getElementById("criterion");
        let critSP = eCritSP.options[eCritSP.selectedIndex].value;

        let smallestPath = gc.getShortestPath(idBarClicked, idBarSelected, critSP);
        gr.drawPathOnGraph(smallestPath[0]);

        document.getElementById('result').innerHTML = gr.showSmallestPath(smallestPath[1], critSP);
        break;
      case 'moneyPath':
        let amount = parseInt(document.getElementById("amount").value);//récupération de l'argent de l'utilisateur

        if(isNaN(amount) || amount == 0){
          alert("Please enter a correct amount in the field");
        }

        let longestPathFromMoney = gc.getLongestPathFromMoney(idBarClicked, amount);

        if(longestPathFromMoney[0] != ""){
          gr.drawPathOnGraph(longestPathFromMoney[0]);
          document.getElementById('result').innerHTML = gr.showBarFromMoney(amount, longestPathFromMoney[1]);;
        }else{
          alert("The algorithme find no solutions !");
        }
        break;

      case 'shortestKPath':
        //récupération de la longeur du chemin
        let k = document.getElementById("k").value;
        let shortestKPath = gc.getShortestKPath(idBarClicked, parseInt(k));

        if(shortestKPath != ""){
          gr.drawPathOnGraph(shortestKPath[0]);
          document.getElementById('result').innerHTML = "<h3>The path has a distance of <strong>" + shortestKPath[1] + "</strong> meters !</h3>";
        }else{
          alert("The algorithme find no solutions !");
        }

    }

    isSimulationMode = true;

    document.getElementById("run").disabled = true;
    document.getElementById("exit").disabled = false;
  }
}

/**
 * Evenement lors du clic sur le bouton de fermeture de la simulation. On remet le graphe dans l'état normal
 */
function exitClicEvent(){
  gr.resetGraph();

  isSimulationMode = false;

  document.getElementById('result').innerHTML = '';

  document.getElementById("exit").disabled = true;
  document.getElementById("run").disabled = false;
}

/**
 * Evenement de clic sur un radio bouton. On affiche la liste déroulante des bars lors de la selection du chemin le plus court
 */
function radioClickEvent(){
  let selectedRadio = document.querySelector('input[name="simulation"]:checked').value;
  if(selectedRadio == 'shortestPath'){
    document.getElementById('barsGroup').style.display = "block";
  }else{
    document.getElementById('barsGroup').style.display = "none";
  }
}

/**
 * Permet de genéré en format html la liste deroulante permettant de choisir le bar voulu pour la simulation.
 */
function generateSelectBarsHtml(){
  let node = document.getElementById('bars');
  gr.getAllBarNames().forEach(function(e){
    let option = document.createElement("option");
    option.text = e;
    option.value = gr.getIdFromName(e);
    node.add(option);
  });
}

/**
 * Fonction main du programme
 */
(function() {
  generateSelectBarsHtml();

  //affichage des statistiques du bar
  document.getElementById('barStatContent').innerHTML = gr.showBarsStat(gc);
})();

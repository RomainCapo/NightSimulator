/*
* Romain Capocasale
* INF2dlm-A
* He-Arc
* 15.05.2019
* NightSimulator
 */

//gloabl varaible
let isSimulationMode = false;

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

let gr = new GraphRepresentation(nodes, edges);
gr.initEdgesLabel();
let gc = new GraphComputation(nodes, edges);//création du graphe

let idBarClicked = -1;//id du noeud cliqué, -1 si aucun noeud cliqué

/**
 * evenement lors d'un clic sur un noeud
 */
network.on('selectNode', function (properties) {
  let nodeID = properties.nodes[0];
  idBarClicked = 0;
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
 * evenement lors de la deselection d'un noeud
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
 * evenement lors du clic sur le bouton de lancement de la simulation
 */
function runClicEvent(){
  if(idBarClicked != -1){
    let selectedRadio = document.querySelector('input[name="simulation"]:checked').value;

    //ASP : All Shortest Paths
    switch (selectedRadio) {
      case 'allShortestPaths':
        let eCritASP = document.getElementById("criterion");
        let critASP = eCritASP.options[eCritASP.selectedIndex].value;

        let simulationResult = gc.getAllShortestPaths(idBarClicked, critASP);

        gr.colorNode(idBarClicked, '#5cb85c');

        let result = document.getElementById('result');
        result.innerHTML = gr.showSmallestPaths(simulationResult);
        break;

      // Shortest Path
      case 'shortestPath':
        let eBars = document.getElementById("bars");
        let idBarSelected = eBars.options[eBars.selectedIndex].value;

        let eCritSP = document.getElementById("criterion");
        let critSP = eCritSP.options[eCritSP.selectedIndex].value;

        let smallestPath = gc.getShortestPath(idBarClicked, idBarSelected, critSP);
        gr.drawPathOnGraph(smallestPath);
        break;
      default:

    }

    isSimulationMode = true;

    document.getElementById("run").disabled = true;
    document.getElementById("exit").disabled = false;
  }
}

/**
 * evenement lors du clic sur le bouton de fermeture de la simulation
 */
function exitClicEvent(){
  gr.resetGraph();

  isSimulationMode = false;

  document.getElementById('result').innerHTML = '';

  document.getElementById("exit").disabled = true;
  document.getElementById("run").disabled = false;
}

/**
 * permet de genéré en format html la liste deroulante permettant de choisir le bar voulu pour la simulation
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
 * fonction main du programme
 */
(function() {
  generateSelectBarsHtml();
  let maxDrinkPrice = gc.getMaxDrinkPrice();
  let minDrinkPrice = gc.getMinDrinkPrice();
  let maxAmbience = gc.getMaxAmbience();
  let minAmbience = gc.getMinAmbience();
  document.getElementById('barStatContent').innerHTML = "<ul><li>Max drink price : <strong>"+ maxDrinkPrice[0] +"</strong></li>" + "<li>Min drink price : <strong>"+ minDrinkPrice[0] +"</strong></li>" + "<li>Max ambience : <strong>"+ maxAmbience[0] +"</strong></li>" + "<li>Min ambience : <strong>"+ minAmbience[0] +"</strong></li></ul>";
})();

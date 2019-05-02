
//gloabl varaible
let isSimulationMode = false;

// creation d'un tableau avec les noeuds
var nodes = new vis.DataSet([
/*{id: 0, label: 'Inside', drinkPriceAvg:8, ambience:9, x: 350, y: 0},
{id: 1, label: 'Cerf', drinkPriceAvg:6, ambience:8, x: 90, y: 50},
{id: 2, label: 'Glenn', drinkPriceAvg:5, ambience:6, x: 300, y: 55},
{id: 3, label: 'Seven', drinkPriceAvg:11, ambience:10, x: 400, y: 60},*/


{id: 0, label: 'Charlot', drinkPriceAvg:7, ambience:4, x: 100, y: 80},
{id: 1, label: 'Brasseur', drinkPriceAvg:8, ambience:6, x: 300, y: 60},
{id: 2, label: '21', drinkPriceAvg:6, ambience:7,x: 650, y: 60},
{id: 3, label: 'King Du Lac', drinkPriceAvg:6, ambience:7, x: 400, y: 210},
{id: 4, label: 'Waves', drinkPriceAvg:11, ambience:4, x: 580, y: 150}
]);

// creations d'un tableau avec les cotes
var edges = new vis.DataSet([
{id: 0, from: 0, to: 1, label: '100'},
{id: 1, from: 0, to: 2, label: '550'},
{id: 2, from: 0, to: 3, label: '400'},
{id: 3, from: 0, to: 4, label: '550'},

{id: 4, from: 1, to: 2, label: '450'},
{id: 5, from: 1, to: 3, label: '200'},
{id: 6, from: 1, to: 4, label: '250'},

{id: 7, from: 2, to: 3, label: '250'},
{id: 8, from: 2, to: 4, label: '150'},


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

edges.add([{id: 9, from: 3, to:4, label: 'test'}])

let g = new Graph(nodes, edges);//création du graphe

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

   console.log(nodes._data[nodeID].label);

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
    let eBar = document.getElementById('nbBar');
    let nbBar = eBar.options[eBar.selectedIndex].text;

    let eOpt = document.getElementById('simulationOption');
    let simOpt = eOpt.options[eOpt.selectedIndex].value;

    let smallestPath = g.getSmallestWeightedPath(idBarClicked, nbBar, simOpt);
    console.log(smallestPath);
    g.drawPathOnGraph(smallestPath["path"], edges, nodes);

    isSimulationMode = true;

    document.getElementById("run").disabled = true;
    document.getElementById("exit").disabled = false;
  }
}

/**
 * evenement lors du clic sur le bouton de fermeture de la simulation
 */
function exitClicEvent(){
  g.resetGraph(nodes, edges);

  isSimulationMode = false;

  document.getElementById("exit").disabled = true;
  document.getElementById("run").disabled = false;
}

/**
 * permet de genéré en format html la liste deroulante permettant de choisir le nombre de bar voulu pour la simulation
 */
function generateSelectNbBarHtml(){
  let node = document.getElementById('nbBar');
  for(let i = 0; i < (g.listBar.length - 1); i++){
    let option = document.createElement("option");
    option.text = (i+1).toString();
    node.add(option);
  }
}

/**
 * fonction main du programme
 */
(function() {
  generateSelectNbBarHtml();
})();

//gloabl varaible
let isSimulationMode = false;

// creation d'un tableau avec les noeuds
var nodes = new vis.DataSet([
{id: 'a', label: 'Inside', drinkPriceAvg:8, ambience:9, x: 350, y: 0},
{id: 'b', label: 'Cerf', drinkPriceAvg:6, ambience:8, x: 90, y: 50},
{id: 'c', label: 'Glenn', drinkPriceAvg:5, ambience:6, x: 200, y: 55},
{id: 'd', label: 'Charlot', drinkPriceAvg:7, ambience:4, x: 100, y: 120},
{id: 'e', label: 'Brasseur', drinkPriceAvg:8, ambience:6, x: 300, y: 60},
//{id: 'f', label: 'McDo', drinkPriceAvg:6, ambience:8, x: 200, y: 30},
/*{id: 'f', label: '21', drinkPriceAvg:6, ambience:7,x: 650, y: 60},
{id: 'g', label: 'King Du Lac', drinkPriceAvg:6, ambience:7, x: 400, y: 210},
{id: 'h', label: 'Waves', drinkPriceAvg:11, ambience:4, x: 580, y: 150}*/
]);

// creations d'un tableau avec les cotes
var edges = new vis.DataSet([
{id:0, from:'a', to:'b'},
{id:1, from:'b', to:'c'},
{id:2, from:'b', to:'d'},
{id:3, from:'d', to:'c'},
{id:4, from:'a', to:'e'},
{id:5, from:'d', to:'c'},
{id:6, from:'e', to:'c'},
/*{id:7, from:'a', to:'g'},
{id:8, from:'c', to:'g'},
{id:9, from:'d', to:'g'},
{id:10, from:'e', to:'g'},
{id:11, from:'g', to:'h'},
{id:12, from:'e', to:'h'},
{id:13, from:'a', to:'h'},
{id:14, from:'a', to:'f'},
{id:15, from:'a', to:'h'},
{id:16, from:'f', to:'g'},
{id:17, from:'e', to:'f'},
{id:18, from:'h', to:'f'},*/
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
edges.update([{id:0, label:'800'}]);
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
    /*let eBar = document.getElementById('nbBar');
    let nbBar = eBar.options[eBar.selectedIndex].text;*/

    /*let eOpt = document.getElementById('simulationOption');
    let simOpt = eOpt.options[eOpt.selectedIndex].value;*/

    let selectedRadio = document.querySelector('input[name="simulation"]:checked').value;

    switch (selectedRadio) {
      case 'allShortestPaths':
        let simulationResult = gc.getAllShortestPaths(idBarClicked);
        //console.log(simulationResult);

        let result = document.getElementById('result');
        for(let i = 0; i < simulationResult.length; i++){
          result.innerHTML = simulationResult[i]
        }

        break;

      case 'shortestPath':
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
  //g.resetGraph(nodes, edges);

  isSimulationMode = false;

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
    node.add(option);
  });
}

/**
 * fonction main du programme
 */
(function() {
  generateSelectBarsHtml();
})();

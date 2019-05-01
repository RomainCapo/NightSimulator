// create an array with nodes
var nodes = new vis.DataSet([
{id: 0, label: 'Charlot', x: 100, y: 0},
{id: 1, label: 'Brasseur', x: 300, y: 0},
{id: 2, label: '21', x: 650, y: 0},
{id: 3, label: 'King Du Lac', x: 400, y: 60},
{id: 4, label: 'Waves', x: 500, y: 65}
]);

// create an array with edges
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

{id: 9, from: 3, to:4, label: '100'}
]);

// create a network
var container = document.getElementById('mynetwork');

// provide the data in the vis format
var data = {
    nodes: nodes,
    edges: edges
};

var options = {
   physics: false,
   interaction: {
      dragNodes: false,// do not allow dragging nodes
    },
    nodes :{
      color :'#5bc0de',
      shape: 'box',
      margin: 5,
    },
   edges: {
     hoverWidth:3,
     color: {
          //inherit: false,
          color:'red'
     },
     font: {
       align: 'top'
     }
   }
};

// initialize your network!
var network = new vis.Network(container, data, options);

let g = new Graph(nodes, edges);

let idBarClicked = -1;

network.on('click', function(properties){
  edges.update({id: 0, color:'red'});
});

network.on('selectNode', function (properties) {
  let nodeID = properties.nodes[0];
  idBarClicked = 0;
  if (nodeID) {
    idBarClicked = this.body.nodes[nodeID].options.id;
  }
  nodes.update({id:idBarClicked, color:'#0275d8'});
});

network.on("deselectNode", function(properties){
    let deselectedNodeId = properties.previousSelection.nodes[0];
    nodes.update({id:deselectedNodeId, color:'#5bc0de'})
});

function runClickEvent(){
  if(idBarClicked != -1){
    let e = document.getElementById('nbBar');
    let idOption = e.options[e.selectedIndex].text;

    console.log(g.getSmallestWeightedPath(idBarClicked, idOption));
  }
}

function generateSelectHtml(){
  let node = document.getElementById('nbBar');
  for(let i = 0; i < (g.listBar.length - 1); i++){
    let option = document.createElement("option");
    option.text = (i+1).toString();
    node.add(option);
  }
}

//main
(function() {
  generateSelectHtml();
  edges.update({id:0, color:{highligh:'blue', color:'blue', hover:'blue', inherit:'blue'}, label:'blue'});
  //g.drawPathOnGraph("0123", edges);
})();

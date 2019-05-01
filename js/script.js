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
{from: 0, to: 1, label: '100'},
{from: 0, to: 2, label: '550'},
{from: 0, to: 3, label: '400'},
{from: 0, to: 4, label: '550'},

{from: 1, to: 2, label: '450'},
{from: 1, to: 3, label: '200'},
{from: 1, to: 4, label: '250'},

{from: 2, to: 3, label: '250'},
{from: 2, to: 4, label: '150'},

{from: 3, to:4, label: '100'}
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
   edges: {
     hoverWidth:3,
   }
};

// initialize your network!
var network = new vis.Network(container, data, options);

let g = new Graph(nodes, edges);

network.on('click', function (properties) {
  let nodeID = properties.nodes[0];
  let idBarClicked = 0;
  if (nodeID) {
    idBarClicked = this.body.nodes[nodeID].options.id;
  }
  console.log(g.getSmallestWeightedPath(idBarClicked, 2));
});

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
})();

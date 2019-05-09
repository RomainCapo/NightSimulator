/**
 * Clase regroupand différente fonction pour la représentation du graphe et l'interaction avec la libraire vis.js
 */
class GraphRepresentation{
  constructor(nodes, edges){
    this.nodes = nodes;
    this.edges = edges;
  }

  getNbNodes(){
    return Object.keys(this.nodes._data).length;
  }

  getAllBarNames(){
    let barNames = [];
    Object.entries(nodes._data).forEach(([key, val]) => {
      let node = nodes._data[key];
      barNames.push(node.label);
    });
    return barNames;
  }

  initEdgesLabel(){
  let length = Object.keys(this.edges._data).length;
  for(let i=0; i < length; i++){

    let from = this.edges._data[i].from;
    let to = this.edges._data[i].to;
    let distance = this._getDistanceBetweenTwoNodes(this.nodes._data[from], this.nodes._data[to]).toString();
    this.edges.update([{id: i, label:distance}])
    }
  }

  _getDistanceBetweenTwoNodes(node1, node2){
    return Math.ceil(Math.sqrt(Math.pow(node2.x - node1.x, 2) + Math.pow(node2.y - node1.y, 2)));
  }

  //================================================================================
  // Dessin du chemin
  //================================================================================

  // /**
  //  * permet de trouver l'id d'un cote a partir d'un depart et d'une arrivée
  //  * @param  {object} edges object edge de vis.js
  //  * @param  {number} from  id de depart
  //  * @param  {number} to    id d'arrive
  //  * @return {number}       id du cote
  //  */
  //   _findEdgeId(edges, from, to){
  //     let id = "-1";
  //     let length = Object.keys(edges).length;
  //     for(let i = 0; i < length; i++){
  //       if((edges[i]["from"] == from && edges[i]["to"] == to) || (edges[i]["from"] == to && edges[i]["to"] == from)){
  //         id = edges[i]["id"];
  //       }
  //     }
  //     return id;
  //   }
  // /**
  //  * dessine un chemin sur le graphe, change la couleur des sommet et change l'epaisseur des cote
  //  * @param  {string} path  chemin du graphe
  //  * @param  {object} edges objet noeud de vis.js sous format json
  //  * @param  {object} nodes objet edge de vis.js sous format json
  //  */
  //   drawPathOnGraph(path, edges, nodes){
  //     this._edgeDisabilityAllEdges(edges, true);
  //
  //     for(let i = 0; i< (path.length - 1); i++){
  //       let nodeId = this._findEdgeId(edges._data, path[i], path[i+1]);
  //       edges.update({id:nodeId, width:3, hidden:false});
  //
  //       nodes.update({id:path[i], color:'#5cb85c'});
  //     }
  //     nodes.update({id:path[path.length-1], color:'#5cb85c'});
  //   }
  //
  //   /**
  //    * reaffiche tous les cotes et reinitialise la couleur des sommets
  //    * @param {object} nodes edges objet noeud de vis.js sous format json
  //    * @param {object} edges objet edge de vis.js sous format json
  //    */
  //   resetGraph(nodes, edges){
  //     this._edgeDisabilityAllEdges(edges, false);
  //     let length = Object.keys(nodes._data).length;
  //     for(let i = 0; i < length; i++){
  //       nodes.update({id:nodes._data[i].id, color:'#5bc0de'});
  //     }
  //   }
  //
  // /**
  //  * change la visibilite de tous les cotes du graphe
  //  * @param  {object} edges objet edge de vis.js sous format json
  //  * @param  {boolean} disability indique si on veut cacher ou non les cotes
  //  */
  //   _edgeDisabilityAllEdges(edges, disability){
  //     let length = Object.keys(edges._data).length;
  //     for(let i = 0; i < length; i++){
  //       edges.update({id:edges._data[i].id, hidden:disability, width:1});
  //     }
  //   }

}

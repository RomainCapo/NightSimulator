/*
* Romain Capocasale
* INF2dlm-A
* He-Arc
* 15.05.2019
* NightSimulator
 */
/**
 * Clase regroupand différente fonction pour la représentation du graphe et l'interaction avec la libraire vis.js
 */
class GraphRepresentation{
  constructor(nodes, edges){
    this.nodes = nodes;
    this.edges = edges;
  }

  /**
   * Retourne le nombre de noeuds du graphe
   * @return {number} nombre de bars du graphe
   */
  getNbNodes(){
    return Object.keys(this.nodes._data).length;
  }

/**
 * Retournes tous les noms de bar dans un tableau
 * @return {array} bar du graphe
 */
  getAllBarNames(){
    let barNames = [];
    Object.entries(this.nodes._data).forEach(([key, val]) => {
        barNames.push(val.label);
    });
    return barNames;
  }

/**
 * Initialise les arretes du graphe en calculant la distance entre les 2 sommets que relie l'arrete.
 * Affiche egalement la distance sur le graphe
 */
  initEdgesLabel(){
  let length = Object.keys(this.edges._data).length;
  for(let i=0; i < length; i++){

    let from = this.edges._data[i].from;
    let to = this.edges._data[i].to;
    let distance = this._getDistanceBetweenTwoNodes(this.nodes._data[from], this.nodes._data[to]).toString();
    this.edges.update([{id: i, label:distance}])
    }
  }

  /**
   * Retourne la distance entre 2 noeuds du graphe
   * @param  {object} node1 noeud 1
   * @param  {object} node2 noeud 2
   * @return {number}       distance entre les 2 sommets
   */
  _getDistanceBetweenTwoNodes(node1, node2){
    return Math.ceil(Math.sqrt(Math.pow(node2.x - node1.x, 2) + Math.pow(node2.y - node1.y, 2)));
  }

/**
 * Retourne le nom du bar en fonction de l'id
 * @param  {number} id id du bar
 * @return {string}    nom du bar
 */
  getBarNameFromId(id){
    let barName ='';
    Object.entries(this.nodes._data).forEach(([key, val]) => {
      if(val.id == id){
        barName = val.label;
      }
    });
    return barName;
  }

/**
 * Retourne l'id du bar en fonction du nom
 * @param  {string} name nom du bar
 * @return {number}      id du bar
 */
  getIdFromName(name){
    let barId = -1;
    Object.entries(this.nodes._data).forEach(([key, val]) => {
      if(val.label == name){
        barId = val.id;
      }
    });
    return barId;
  }

  /**
   * Retourne les noms des bars dans un chemin
   * @param  {string} path chemin a traiter
   * @return {array}      tableau contentant les noms de bar du chemin
   */
  _getBarNameFromPath(path){
    let barPathName = [];
    for(let i = 0; i < path.length; i++){
    barPathName.push(this.getBarNameFromId(path[i]));
    }
    return barPathName;
  }

  /**
   * Methode d'affichage HTML. Retourne un string permettant d'affficher les différents chemin de bar sur la page
   * @param  {array} smallestPaths tableau contenant tous les chemins les plus court a partir d'un point
   * @return {string}               string en format html contenant l'affichage
   */
  showSmallestPaths(smallestPaths){
    let string = '<h1>Shortest way to go at :  </h1><br>';

    Object.entries(smallestPaths).forEach(([key, val]) => {
      string += '<span><h5><strong>' + this.getBarNameFromId(key) + ' : </strong>';

      let barNamePaths = this._getBarNameFromPath(val)

      barNamePaths.forEach(function(element, index){
        if(index == barNamePaths.length -1){
          string += element;
        }else {
            string += element + '->';
        }

      }, this);
      string += '</span></h5>';
  });
  return string;
}

  //================================================================================
  // Dessin du chemin
  //================================================================================

  colorNode(idNode, colorNode){
    this.nodes.update({id:idNode, color:colorNode});
  }

  /**
   * permet de trouver l'id d'un cote a partir d'un depart et d'une arrivée
   * @param  {object} edges object edge de vis.js
   * @param  {number} from  id de depart
   * @param  {number} to    id d'arrive
   * @return {number}       id du cote
   */
    _findEdgeId(edges, from, to){
      let id = "-1";
      let length = Object.keys(edges).length;
      for(let i = 0; i < length; i++){
        if((edges[i]["from"] == from && edges[i]["to"] == to) || (edges[i]["from"] == to && edges[i]["to"] == from)){
          id = edges[i]["id"];
        }
      }
      return id;
    }
  /**
   * dessine un chemin sur le graphe, change la couleur des sommet et change l'epaisseur des cote
   * @param  {string} path  chemin du graphe
   * @param  {object} edges objet noeud de vis.js sous format json
   * @param  {object} nodes objet edge de vis.js sous format json
   */
    drawPathOnGraph(path){
      //this._edgeDisabilityAllEdges(true);

      for(let i = 0; i< (path.length - 1); i++){
        let nodeId = this._findEdgeId(this.edges._data, path[i], path[i+1]);
        this.edges.update({id:nodeId, width:7, hidden:false});

        this.nodes.update({id:path[i], color:'#5cb85c'});
      }
      this.nodes.update({id:path[path.length-1], color:'#5cb85c'});
    }

    /**
     *  Reinitialise la couleur des sommets et la largeur des arretes
     */
    resetGraph(){
      Object.entries(this.nodes._data).forEach(([key, val]) => {
        this.nodes.update({id:val.id, color:'#5bc0de'});
      });

      Object.entries(this.edges._data).forEach(([key, val]) => {
        this.edges.update({id:val.id, width:1});
      });

      /*//this._edgeDisabilityAllEdges(this.edges, false);
      let nodesLength = Object.keys(this.nodes._data).length;
      for(let i = 0; i < nodesLength; i++){
        this.nodes.update({id:this.nodes._data[i].id, color:'#5bc0de'});
      }

      let edgesLength = Object.keys(this.edges._data).length;
      for(let i = 0; i < edgesLength; i++){
        this.edges.update({id:this.edges._data[i].id, width:1});
      }*/
    }

  // /**
  //  * change la visibilite de tous les cotes du graphe
  //  * @param  {boolean} disability indique si on veut cacher ou non les cotes
  //  */
  //   _edgeDisabilityAllEdges(disability){
  //     let length = Object.keys(this.edges._data).length;
  //     for(let i = 0; i < length; i++){
  //       this.edges.update({id:this.edges._data[i].id, hidden:disability, width:1});
  //     }
  //   }

}

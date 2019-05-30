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
  /**
   * constructeur de GraphRepresentation
   * @param {object} nodes object nodes de vis.js
   * @param {object} edges object edges de vis.js
   */
  constructor(nodes, edges){
    this.nodes = nodes;
    this.edges = edges;
  }

//================================================================================
// Méthodes utilitaires
//================================================================================

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
   * Retourne le nombre de noeuds du graphe
   * @return {number} nombre de bars du graphe
   */
  getNbNodes(){
    return Object.keys(this.nodes._data).length;
  }

  /**
  * Retournes tous les noms de bar dans un tableau
  * @return {array} bars du graphe
  */
  getAllBarNames(){
    let barNames = [];
    Object.entries(this.nodes._data).forEach(([key, val]) => {
        barNames.push(val.label);
    });
    return barNames;
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
 * permet de trouver l'id d'un cote a partir d'un depart et d'une arrivée
 * @param  {number} from  id de depart
 * @param  {number} to    id d'arrive
 * @return {number}       id du cote
 */
  _findEdgeId(from, to){
    let id = "-1";
    let edges = this.edges._data
    let length = Object.keys(edges).length;
    for(let i = 0; i < length; i++){
      if((edges[i]["from"] == from && edges[i]["to"] == to) || (edges[i]["from"] == to && edges[i]["to"] == from)){
        id = edges[i]["id"];
      }
    }
    return id;
  }

//================================================================================
// Méthodes de dessin et d'affichage
//================================================================================

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
   * Methode d'affichage HTML. Retourne un string permettant d'afficher les différents chemin de bar sur la page
   * @param  {array} smallestPaths tableau contenant tous les chemins les plus court a partir d'un point
   * @param  {string} criterion critere de la simulation
   * @return {string}               string en format html contenant l'affichage
   */
  showAllShortestPaths(smallestPaths, criterion){
    let string = '<h1>Shortest way to go at :  </h1><br>';

    Object.entries(smallestPaths).forEach(([key, val]) => {
      string += '<h5><strong>' + this.getBarNameFromId(key) + ' : </strong>';

      let barNamePaths = this._getBarNameFromPath(val[0])

      barNamePaths.forEach(function(element, index){
        if(index == barNamePaths.length -1){
          string += element;
        }else {
            string += element + '->';
        }

      }, this);
      if(criterion != "allCriterions"){
        string += '</h5><h6 id="weightInfo"><i>With a weight of <strong>'+ val[1] +'</strong></i></h6><br>';
      }else{
        string += "</h5>";
      }

    });
    return string;
  }

  /**
   * Methode d'affichage HTML. Retourne un string permettant d'afficher le poids du chemin
   * @param  {integer} weight    poids du chemin
   * @param  {string} criterion critère du chemin
   * @return {string}           affichage en format HTML
   */
  showSmallestPath(weight, criterion){
    let string = '';
    switch (criterion) {
      case 'distance':
        string = "<h3>The path has a distance of <strong>" + weight + "</strong> meters!</h3>";
        break;
      case 'drinkPriceAvg':
        string = "<h3>The total cost of the path is <strong>" + weight + "</strong> .-";
        break;
      case 'ambience':
        string = "<h3>The total ambience of the path is <strong>" + weight + " !</strong>";
        break;
      case 'allCriterions':
        //pas besoin d'affichage si tout les critéres ont été selectionné
        break;
      }
      return string;
  }

  /**
   * Méthode d'affichage HTML. Retourne un string permettant d'afficher l'argent utilisé et restant lors de la simulation avec le montant entré par l'utilisateur.
   * @param  {integer} amount    montant entré par l'utilisateur
   * @param  {integer} pathPrice cout du chemin trouvé
   * @return {string}           string en format html contenant l'affichage
   */
  showBarFromMoney(amount, pathPrice){
    return '<h3>The path has a cost of : <strong>' + pathPrice + '</strong></h3><h3>You have <strong>' + (amount - pathPrice) + ".-</strong> left</h3>";
  }

  showBarsStat(gc){
    let maxDrinkPrice = gc.getMaxDrinkPrice();
    let minDrinkPrice = gc.getMinDrinkPrice();
    let maxAmbience = gc.getMaxAmbience();
    let minAmbience = gc.getMinAmbience();

    return "<ul><li>Max drink price : <strong>"+ maxDrinkPrice[0] +"</strong></li>" + "<li>Min drink price : <strong>"+ minDrinkPrice[0] +"</strong></li>" + "<li>Max ambience : <strong>"+ maxAmbience[0] +"</strong></li>" + "<li>Min ambience : <strong>"+ minAmbience[0] +"</strong></li></ul>"
  }

  /**
   * Permet de colorer un noeud du graphe
   * @param  {number} idNode    id du noeud
   * @param  {string} colorNode couleur en hexadecimal du noeud
   */
  colorNode(idNode, colorNode){
      this.nodes.update({id:idNode, color:colorNode});
  }

  /**
   * dessine un chemin sur le graphe, change la couleur des sommet et change l'epaisseur des cote
   * @param  {string} path  chemin du graphe
   * @param  {object} edges objet noeud de vis.js sous format json
   * @param  {object} nodes objet edge de vis.js sous format json
   */
    drawPathOnGraph(path){
      for(let i = 0; i< (path.length - 1); i++){
        let nodeId = this._findEdgeId(path[i], path[i+1]);
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
    }
}

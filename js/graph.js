/**
 * represente un graphe
 */
class Graph {
  /**
   * constructeur du graphe
   * @param {object} nodes objet noeud de vis.js sous format json
   * @param {object} edges objet edges de vis.js sous format json
   */
  constructor(nodes, edges){
    this.listBar = [];
    this.contigMatrix;

    this._loadBarsFromJson(nodes);
    this._loadEdgesFromJson(edges);
  }

//================================================================================
// Initialisation
//================================================================================

/**
 * ajoute les noeuds du graphe dans une liste de bar
 * @param  {object} nodes objet noeud de vis.js sous format json
 */
  _loadBarsFromJson(nodes){
      Object.entries(nodes._data).forEach(([key, val]) => {
        let node = nodes._data[key]
        this.listBar.push(new Bar(node.id, node.label, node.drinkPriceAvg, node.ambience));
    });
  }

  /**
   * relie les sommets du graphe entre eux a partir de l'objet json
   * @param  {object} edges  objet edges de vis.js sous format json
   */
  _loadEdgesFromJson(edges){
    this._initContigMatrix();
    Object.entries(edges._data).forEach(([key, val]) => {
      let i = this._getIdFromString(edges._data[key].from);
      let j = this._getIdFromString(edges._data[key].to);
      let value = edges._data[key].label;
      this.contigMatrix[i][j] = parseInt(value);
      this.contigMatrix[j][i] = parseInt(value);
    });
  }

  /**
   * permet de construire la matrice de contiguité a partir de la liste des bar
   */
  _initContigMatrix(){
    let rows = this.listBar.length;
    let cols = this.listBar.length;
    this.contigMatrix = [];

    for(var i=0; i < rows; i++){
      this.contigMatrix.push([]);
      this.contigMatrix[i].push( new Array(cols));

      for(var j=0; j < cols; j++){
        this.contigMatrix[i][j] = 0;
      }
  }
}

_getIdFromString($string){
  let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  return alphabet.indexOf($string);
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

//================================================================================
// Calcul des chemins du graphe
//================================================================================

_resetBar(){
    for(let i = 0; i < this.listBar.length; i++){
      this.listBar[i].visited = false;
      this.listBar[i].meeted = false;
      this.listBar[i].idParent = "none";
    }
  }

  dijkstra(id){
    let tmp = [];
    this._resetBar();

    //on créé la file de priorité, on empile le 1er sommet et on l'indique comme rencontré
    let priorityQueue = new PriorityQueue();
    priorityQueue.enqueue(this.listBar[this._getIdFromString(id)], 0);
    this.listBar[this._getIdFromString(id)].meeted = true;

    while(!priorityQueue.isEmpty()){
      //this.logg(priorityQueue, "prio : ");
      let qE = priorityQueue.dequeue();
      let currentBar = qE.element;
      let currentPriority = qE.priority;
      let idParent = qE.idParent;

      currentBar.visited = true;
      tmp.push(currentBar.name);
      //this.logg(currentBar, "visited bar : ");

      let neighbours = this._getNeighbours(currentBar.id);
      for(let i = 0; i < neighbours.length; i++){
        let neighbourBar = neighbours[i]["bar"];
        let neighbourPriority = neighbours[i]["priority"]

        if(!neighbourBar.visited){
          let priority = currentPriority + neighbourPriority;

          if(!neighbourBar.meeted){
            priorityQueue.enqueue(neighbourBar, priority);
            neighbourBar.idParent = currentBar.id;
            neighbourBar.meeted = true;
          }else {
            if(priority < priorityQueue.getPriority(neighbourBar)){
              priorityQueue.decreasePriority(neighbourBar, priority);
              neighbourBar.idParent = currentBar.id;
            }
          }
        }
      }
    }
    //console.log(tmp);
  }

  getAllShortestPathFromDijkstra(id){
    /*this.dijkstra(id);
    let paths = [];
    this.listBar.forEach(function(e){
      let path += e.id
      this.logg(e);
    }, this);*/
  }

// /**
//  * permet de convertir les voisins d'un sommet sous la forme d'une chaine de caractere
//  * @param  {array} neighbours tableau contenant les voisins d'un sommet
//  * @return {string}   retourne les voisins
//  */
//   _getNeighboursInString(neighbours){
//     let string = "";
//     for(let i = 0; i < neighbours.length;i++){
//       string += neighbours[i]["bar"].id;
//     }
//     return string;
//   }
//
  /**
   * permet d'obtenir tout les voisins d'un sommet pour un id donné
   * @param  {string} idBar id du bar
   * @return {array}       tableau associatif contenant pour chaque case l'objet representant le bar, ainsi que la priorite du chemin le reliant
   */
    _getNeighbours(idBar){
      let intIdBar = this._getIdFromString(idBar);
      let neighbours = [];
      for(let i = 0; i < this.contigMatrix[intIdBar].length; i++){
        if(this.contigMatrix[intIdBar][i] != 0){
          let tmp = new Array(2);
          tmp["bar"] = this.listBar[i];
          tmp["priority"] = this.contigMatrix[intIdBar][i];
          neighbours.push(tmp);
        }
      }
      return neighbours;
    }

    static initEdgesLabel(nodes, edges){
    let length = Object.keys(edges._data).length;
    for(let i=0; i < length; i++){

      let from = edges._data[i].from;
      let to = edges._data[i].to;
      let distance = this._getDistanceBetweenTwoNodes(nodes._data[from], nodes._data[to]).toString();
      edges.update([{id: i, label:distance}])
      }
    }

    static _getDistanceBetweenTwoNodes(node1, node2){
      return Math.ceil(Math.sqrt(Math.pow(node2.x - node1.x, 2) + Math.pow(node2.y - node1.y, 2)));
    }

//================================================================================
// Méthode de debug
//================================================================================
    test(){

    /*  let pq = new PriorityQueue();
      let bar1 = new Bar('a', 'test', 12, 13)
      let bar2 = new Bar('b', 'test3', 612, 13)
      let bar3 = new Bar('c', 'test4', 12, 163)
      pq.enqueue(bar1, 12)
      pq.enqueue(bar2, 45)
      pq.enqueue(bar3, 120)
      this.logg(pq);

      pq.decreasePriority(bar2, 5);
      this.logg(pq);

      console.log(pq.getPriority(bar1));*/
      let bar1 = new Bar('a', 'test', 12, 13)
      this.logg(bar1)
      bar1.visited = true;
      this.logg(bar1)
    }

    logg(obj, text = ""){
      console.log(text + " " + JSON.stringify(obj));
    }
}

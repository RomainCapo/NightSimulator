/*
* Romain Capocasale
* INF2dlm-A
* He-Arc
* 15.05.2019
* NightSimulator
 */
/**
 * classe permettant de faire des calcules sur un graphe
 */
class GraphComputation {
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

_getStringFromID(id){
  let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  if(id > 26){
    return -1;
  }else{
    return alphabet[id];
  }
}

_getIdFromString(string){
  let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  if(string.length > 1){
    return -1
  }else{
    return alphabet.indexOf(string);
  }
}

//================================================================================
// Calcul des chemins du graphe
//================================================================================

/**
 * reinnitilise les attributs de tous les bars en vu d'un nouveau parcours avec dijkstra
 */
_resetBar(){
    for(let i = 0; i < this.listBar.length; i++){
      this.listBar[i].visited = false;
      this.listBar[i].meeted = false;
      this.listBar[i].idParent = "none";
    }
  }

priorityFunction(){

}

/**
 * execution de l'algorithme de dijkstra, on cherche les chemins les plus court entre un sommet initial et tous les autres sommets
 * @param  {string} id du bar a partir du quel on execute l'algorithme
 */
  _dijkstra(id, criterion){
    let tmp = [];
    this._resetBar();

    //on créé la file de priorité, on empile le 1er sommet et on l'indique comme rencontré
    let priorityQueue = new PriorityQueue();
    priorityQueue.enqueue(this.listBar[this._getIdFromString(id)], 0);
    this.listBar[this._getIdFromString(id)].meeted = true;

    while(!priorityQueue.isEmpty()){
      let qE = priorityQueue.dequeue();
      let currentBar = qE.element;
      let currentPriority = qE.priority;
      let idParent = qE.idParent;

      currentBar.visited = true;
      tmp.push(currentBar.name);

      let neighbours = this._getNeighbours(currentBar.id);
      for(let i = 0; i < neighbours.length; i++){
        let neighbourBar = neighbours[i]["bar"];
        let neighbourPriority = 0;

        switch (criterion) {
          case 'distance':
             neighbourPriority = neighbours[i]["priority"];
            break;
          case 'drinkPriceAvg':
            neighbourPriority = neighbourBar.drinkPriceAvg;
            break;
          case 'ambience':
            neighbourPriority = neighbourBar.ambience;
            break;
          case 'allCriterions':
            neighbourPriority = neighbours[i]["priority"] + neighbourBar.drinkPriceAvg + neighbourBar.ambience;
            break;
        }
        //let neighbourPriority = neighbourBar.drinkPriceAvg;

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
  }

/**
 * fonction recursive qui permet de reconstituer le chemin le plus court entre 2 sommet après l'execution de l'algorithme de dijkstra.
 * Attention l'algorithme de dijkstra doit etre execute avant d'appeler cette fonction.
 * @param  {string} barId id du bar auquel l'utilisateur souhaite se rendre
 * @return {string}       retourne le chemin le plus cout entre un sommet initial et le sommet précisé en parametre. Attention le chemin est dans le sens inverse.
 */
  _getShortestPathRecursive(barId){
    let currentBar = this.listBar[this._getIdFromString(barId)];
    if(currentBar.idParent == "none"){
      return currentBar.id;
    }else {
      return currentBar.id + this._getShortestPathRecursive(currentBar.idParent);
    }
  }

/**
 * permet de calculer le chemin le plus court entre 2 sommets.
 * @param  {string} startId id du sommet initial
 * @param  {string} endId   id du somment final
 * @return {string}         retourne le chemin le plus court entre 2 sommets.
 */
  getShortestPath(startId, endId, criterion){
    this._dijkstra(startId, criterion);
    return this._getShortestPathRecursive(endId).split("").reverse().join("");//permet de renverser le string renvoyer par la fonction
  }

/**
 * permet de calculer tous les chemin les plus courts a partir d'un sommet initial .
 * @param  {string} startId id du sommet initial
 * @return {array}         tableau contenant tous les chemins les plus court pour atteindre pour atteindre tous les sommets du graphe a partir d'un sommet initial.
 */
  getAllShortestPaths(startId, criterion){
    this._dijkstra(startId, criterion);
    let paths = [];
    this.listBar.forEach(function(e){
      paths[e.id] = this._getShortestPathRecursive(e.id).split("").reverse().join("");
    }, this);
    return paths;
  }
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
//================================================================================
// Statistiques du graphes
//================================================================================

getMaxDrinkPrice(){
  let barName = "";
  let max = 0;
  this.listBar.forEach((e) => {
    if(max < e.drinkPriceAvg){
      max = e.drinkPriceAvg;
      barName = e.name;
    }
  });
  return [barName, max];
}

getMinDrinkPrice(){
  let barName = "";
  let min = this.listBar[0].drinkPriceAvg;
  this.listBar.forEach((e) => {
    if(min > e.drinkPriceAvg){
      min = e.drinkPriceAvg;
      barName = e.name;
    }
  });
  return [barName, min];
}

getMaxAmbience(){
  let barName = "";
  let max = 0;
  this.listBar.forEach((e) => {
    if(max < e.ambience){
      max = e.ambience;
      barName = e.name;
    }
  });
  return [barName, max];
}

getMinAmbience(){
  let barName = "";
  let min = this.listBar[0].ambience;
  this.listBar.forEach((e) => {
    if(min > e.ambience){
      min = e.ambience;
      barName = e.name;
    }
  });
  return [barName, min];
}

getMaxDist(){
  let max = 0;
  for(let i = 0; i < this.contigMatrix.length; i++){
    for(let j = 0; j < this.contigMatrix.length;j++){
      if(max < this.contigMatrix[i][j]){
        max = this.contigMatrix[i][j];
      }
    }
  }
  return max;
}

getMinDist(){
  let min = 0;
  for(let i = 0; i < this.contigMatrix.length; i++){
    for(let j = 0; j < this.contigMatrix.length;j++){
      if(min < this.contigMatrix[i][j]){
        min = this.contigMatrix[i][j];
      }
    }
  }
  return min;
}

//================================================================================
// Méthode de debug
//================================================================================
    test(){
      console.log(this.getAllShortestPath());
      console.log(this.getShortestPath('d'));
    }

    logg(obj, text = ""){
      console.log(text + " " + JSON.stringify(obj));
    }
}

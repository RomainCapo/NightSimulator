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
// Initialisation de l'objet
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
      let i = edges._data[key].from;
      let j = edges._data[key].to;
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

//================================================================================
// Dessin du chemin
//================================================================================

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
  drawPathOnGraph(path, edges, nodes){
    this._edgeDisabilityAllEdges(edges, true);

    for(let i = 0; i< (path.length - 1); i++){
      let nodeId = this._findEdgeId(edges._data, path[i], path[i+1]);
      edges.update({id:nodeId, width:3, hidden:false});

      nodes.update({id:path[i], color:'#5cb85c'});
    }
    nodes.update({id:path[path.length-1], color:'#5cb85c'});
  }

  /**
   * reaffiche tous les cotes et reinitialise la couleur des sommets
   * @param {object} nodes edges objet noeud de vis.js sous format json
   * @param {object} edges objet edge de vis.js sous format json
   */
  resetGraph(nodes, edges){
    this._edgeDisabilityAllEdges(edges, false);
    let length = Object.keys(nodes._data).length;
    for(let i = 0; i < length; i++){
      nodes.update({id:nodes._data[i].id, color:'#5bc0de'});
    }
  }

/**
 * change la visibilite de tous les cotes du graphe
 * @param  {object} edges objet edge de vis.js sous format json
 * @param  {boolean} disability indique si on veut cacher ou non les cotes
 */
  _edgeDisabilityAllEdges(edges, disability){
    let length = Object.keys(edges._data).length;
    for(let i = 0; i < length; i++){
      edges.update({id:edges._data[i].id, hidden:disability, width:1});
    }
  }

//================================================================================
// Calcul des chemins du graphe
//================================================================================

/**
 * permet de convertir les voisins d'un sommet sous la forme d'une chaine de caractere
 * @param  {array} neighbours tableau contenant les voisins d'un sommet
 * @return {string}   retourne les voisins
 */
  _getNeighboursInString(neighbours){
    let string = "";
    for(let i = 0; i < neighbours.length;i++){
      string += neighbours[i]["bar"].id;
    }
    return string;
  }

  /**
   * permet d'obtenir tout les voisins d'un sommet pour un id donné
   * @param  {number} idBar id fu bar
   * @return {array}       tableau associatif contenant pour chaque case l'objet representant le bar, ainsi que la priorite du chemin le reliant
   */
    _getNeighbours(idBar){
      let neighbours = [];
      for(let i = 0; i < this.contigMatrix[idBar].length; i++){
        if(this.contigMatrix[idBar][i] != 0){
          let tmp = new Array(2);
          tmp["bar"] = this.listBar[i];
          tmp["priority"] = this.contigMatrix[idBar][i];
          neighbours.push(tmp);
        }
      }
      return neighbours;
    }

/**
 * retourne tout les chemins de longeur k possible pour un sommets donné
 * @param  {number} idBase id du sommet
 * @param  {number} k      longeur du chemin voulu
 * @return {array}        tableau contenant tous les chemins sous forme de string
 */
  _findAllPath(idBase, k){
    if(k < (this.listBar.length)){
      let neighboursString = this._getNeighboursInString(this._getNeighbours(idBase));
      let endPath = this._reduceArray(this.stringPermutations(neighboursString), k);
      return endPath.map(function(e) {return idBase + e});
    }else {
      return 0;
    }
  }

  _weigthFunction(current, next, option){
    let weigth = 0;
    if(option == "pathLength"){
      weigth = this.contigMatrix[current][next];
    }else if (option == "drinkPrice") {
      weigth = this.listBar[current].drinkPriceAvg;
    }else if (option == "barAmbience") {
      weigth = this.listBar[current].ambience;
    }
    return weigth;
  }

//// TODO: changer la fonction en maximum pour l'ambiance des bars
  getSmallestWeightedPath(idBase, k, option){
    let paths = this._findAllPath(idBase, k);

    let result = [];
    let weigth;
    for(let i = 0; i < paths.length; i++){
      let weigth = 0;
      for(let j = 0; j < (paths[i].length - 1); j++){

        /*if(option == "pathLength"){
          weigth += this.contigMatrix[paths[i][j]][paths[i][j+1]];
        }else if (option == "drinkPrice") {
          //console.log(listBar[paths[i][j]].name + " - " listBar[paths[i][j]].drinkPriceAvg);
          weigth += this.listBar[paths[i][j]].drinkPriceAvg;
        }else if (option == "barAmbience") {
          weigth += this.listBar[paths[i][j]].ambience;
        }*/
        weigth += this._weigthFunction(paths[i][j], paths[i][j+1], option);
      }
      let tmp = new Array(2);
      tmp["path"] = paths[i];
      tmp["weigth"] = weigth;
      result.push(tmp);
    }
    result.sort(function(a,b) {
      return a["weigth"]-b["weigth"];
    });
    return result[0];
  }

/**
 * permet de supprimer tout les chemins plus grand que k, puis supprime tout les chemins doublons
 * @param  {array} array tous les chemins sous forme de string
 * @param  {number} k     longeur du chemin
 * @return {array}       tableau avec les valeurs reduites selon les precedents critere
 */
  _reduceArray(array, k){
    let out = array.map(v => v.slice(0, k - length));
    return out.filter(function(value, index){ return out.indexOf(value) == index });
  }

  /**
   * permet d'obtenir toutes les permutation des characteres d'un string
   * exemple : ["test"] -> test, tets, tste, estt, ext
   * fonction prise du site : https://medium.com/@lindagmorales94/how-to-solve-a-string-permutation-problem-using-javascript-95ad5c388219
   * @param  {string } str string a permutter
   * @return {array}     tableau contenant tout les strings permutter
   */
  stringPermutations(str) {
    let letters = str.split('');
    let results = [[letters.shift()]];

    while (letters.length) {
        const currLetter = letters.shift()
        let tmpResults = []
        results.forEach(result => {
            let rIdx = 0
            while (rIdx <= result.length) {
                const tmp = [...result]
                tmp.splice(rIdx, 0, currLetter)
                tmpResults.push(tmp)
                rIdx++
            }
        })
        results = tmpResults
    }

    return results
      .map(letterArray => letterArray.join(''))
      .filter((el, idx, self) => (self.indexOf(el) === idx))
      .sort()
    }

    static creteEdge(nodes){
      //for(let i)
    }
}

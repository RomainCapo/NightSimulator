/*
* Romain Capocasale
* INF2dlm-A
* He-Arc
* 15.05.2019
* NightSimulator
 */
/**
 * Classe permettant qui représente le graphe algorithmiquement. Contient également toutes les méthodes de calcule sur le graphe.
 */
class GraphComputation {
  /**
   * Constructeur du graphe. On initialise le graphe a partir des objects vis.js
   * @param {object} nodes objet noeud de vis.js sous format json
   * @param {object} edges objet edges de vis.js sous format json
   */
  constructor(nodes, edges){
    this.listBar = [];//contient tous les bars
    this.contigMatrix;

    this._loadBarsFromJson(nodes);
    this._loadEdgesFromJson(edges);
  }

//================================================================================
// Méthodes d'initialisation
//================================================================================

/**
 * Ajoute les noeuds du graphe dans la liste de bar
 * @param  {object} nodes objet noeud de vis.js sous format json
 */
  _loadBarsFromJson(nodes){
      Object.entries(nodes._data).forEach(([key, val]) => {
        let node = nodes._data[key]
        this.listBar.push(new Bar(node.id, node.label, node.drinkPriceAvg, node.ambience));
    });
  }

  /**
   * Relie les sommets du graphe entre eux a partir de l'objet json
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
   * Permet de construire la matrice de contiguité a partir de la liste des bar
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
// Méthodes utilitaires du graphe
//================================================================================

  /**
   * Retourne l'identifiant du bar sous forme de string a partir de l'id en string
   * @param  {integer} id id du bar
   * @return {string}    id du bar sous forme de string
   */
  _getStringFromID(id){
    let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    if(id > 26){
      return -1;
    }else{
      return alphabet[id];
    }
  }

  /**
   * retourne l'id du bar a partir de l'identifiant en string
   * @param  {string} string identifiant du bar en string
   * @return {integer}        id du bar
   */
  _getIdFromString(string){
    let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    if(string.length > 1){
      return -1
    }else{
      return alphabet.indexOf(string);
    }
  }

  /**
   * Calcule la distance d'un chemin du graphe
   * @param  {string} path chemin a calculer
   * @return {integer}      distance du chemin
   */
  _computePathDistance(path){
    let distance = 0;
    for(let i = 0; i < path.length; i++){
      if((path.length-1) != i){
        distance += this.contigMatrix[this._getIdFromString(path[i])][this._getIdFromString(path[i+1])];
      }
    }
    return distance;
  }

  /**
   * Retourne le poids d'un chemin par rapport à son critère avec lequelle il a été calculé
   * @param  {string} path      chemin à traiter
   * @param  {string} criterion critère
   * @return {integer}           poids du chemin selon le critère
   */
  _computePathByCriterion(path, criterion){
    let weight = 0;
    if(criterion == "distance"){
      weight = this._computePathDistance(path);
    }else if(criterion == "allCriterions"){
      return -1;
    }else{
      for(let i = 0; i < path.length; i++){
        let id = this._getIdFromString(path[i]);
        weight += this.listBar[id][criterion];
      }
    }
    return weight;
  }

//================================================================================
// Méthodes de calcul des chemins les plus courts
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

  /**
   * Fonction de priorité de l'algorithme de djiksta, retourne la priorité du bar passé en paramètre selon le critère choisi
   * @param  {object} bar       object bar sur lequel on souhaite calculer la priorité
   * @param  {string} criterion critère de la simulation
   * @return {integer}           priorité du bar
   */
  _priorityFunction(bar, criterion){
  // comme pour l'ambiance on veut l'ambiance maximum et pas l'ambiance min on s'arrange pour renvoyer un petit nombre quand le bar à
  // une bonne ambiance et un grand nombre quand il  a une petite ambiance. Comme l'ambiance est echelonné sur 10, il suffit de soustraire à une constante pour réguler le tout
  const ambianceOffset = 11;

  let priority = 0;

  switch (criterion) {
    case 'distance':
       priority = bar["priority"];
      break;
    case 'drinkPriceAvg':
      priority = bar["bar"]["drinkPriceAvg"];
      break;
    case 'ambience':
      priority = ambianceOffset - bar["bar"]["ambience"];
      break;
    case 'allCriterions':
      priority = bar["priority"] + bar["bar"]["drinkPriceAvg"] + (ambianceOffset - bar["bar"]["ambience"]);
      break;
  }
  return priority;
}

/**
 * Algorithme de dijkstra, on cherche les chemins les plus court entre un sommet initial et tous les autres sommets.
 * @param  {string} id du bar a partir du quel on execute l'algorithme
 * @param  {string} criterion critère de la simulation
 */
  _dijkstra(id, criterion){
    this._resetBar();

    //(phase d'initialisation) on créé la file de priorité, on empile le 1er sommet et on l'indique comme rencontré
    let priorityQueue = new PriorityQueue();
    priorityQueue.enqueue(this.listBar[this._getIdFromString(id)], 0);
    this.listBar[this._getIdFromString(id)].meeted = true;

    //on execute l'algorithme tant que la file de priorité n'est pas vide
    while(!priorityQueue.isEmpty()){
      //on recupére un bar de la file de priorité et on sauve ces attributs dans des variable
      let qE = priorityQueue.dequeue();
      let currentBar = qE.element;
      let currentPriority = qE.priority;

      currentBar.visited = true;

      let neighbours = this._getNeighbours(currentBar.id);//on récupére tous les voisins du sommet courant
      for(let i = 0; i < neighbours.length; i++){
        let neighbourBar = neighbours[i]["bar"];

        let neighbourPriority = this._priorityFunction(neighbours[i], criterion);//on calcule la priorité du sommet voisin

        if(!neighbourBar.visited){
          let priority = currentPriority + neighbourPriority;//on calcule la priorité totale

          if(!neighbourBar.meeted){
            //si le sommet n'es pas rencontré, on le met dans la file de priorité avec sa priorité et on sauve son parent
            priorityQueue.enqueue(neighbourBar, priority);
            neighbourBar.idParent = currentBar.id;
            neighbourBar.meeted = true;
          }else {
            //si le sommet a deja été rencontré mais que ca priorité est plus petite que la précedente, on met a jour le sommet dans la file
            //de priorité et on change son parent
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
 * Fonction recursive qui permet de reconstituer le chemin le plus court entre 2 sommet après l'execution de l'algorithme de dijkstra.
 * Attention l'algorithme de dijkstra doit etre execute avant d'appeler cette fonction.
 * Attention le chemin est retourné dans le sens inverse.
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
 * Permet de calculer le chemin le plus court entre 2 sommets.
 * @param  {string} startId id du sommet initial
 * @param  {string} endId   id du somment final
 * @return {string}         retourne le chemin le plus court entre 2 sommets et son poids.
 */
  getShortestPath(startId, endId, criterion){
    this._dijkstra(startId, criterion);
    let path = this._getShortestPathRecursive(endId).split("").reverse().join("");//permet de renverser le string renvoyer par la fonction
    return [path, this._computePathByCriterion(path, criterion)];
  }

/**
 * permet de calculer tous les chemin les plus courts a partir d'un sommet initial selon un critère.
 * @param  {integer}  startId           id du bar initial
 * @param  {string}  criterion         critère de la simulation
 * @param  {Boolean} [withWeight=true] permet d'indiquer si l'on veut les poids des chemins ou non dans le tableau retourné
 * @return {array}                    retourne le tableau de tous les chemins les plus court a partir du bar initial jusqu'a tous les autres bars
 */
  getAllShortestPaths(startId, criterion, withWeight = true){
    this._dijkstra(startId, criterion);
    let paths = [];
    this.listBar.forEach(function(e){
      let path = this._getShortestPathRecursive(e.id).split("").reverse().join("");//permet de renverser le string renvoyer par la fonction

      if(withWeight){
        paths[e.id] = [path, this._computePathByCriterion(path, criterion)];
      }else{
        paths[e.id] = path;
      }

    }, this);
    return paths;
  }

  //================================================================================
  // Méthodes de calcul du chemin le plus court de longeur k
  //================================================================================

  /**
   * Algorithme de djikstra modifié permettant de trouver le chemin le plus court de longeur k (ou k est le nombre de sommet).
   * On garde la base de l'algorithme de djiksta, mais dans la file de priorité, on va en plus stocker le nonbre de sommet parcouru jusque ici.
   * Cette fois ci, on ajoute/met a jour le sommet dans le file de priorité uniquement si le nombre de sommet permettant d'atteindre le sommet actuel est plus petit que k
   * @param  {string} id id du sommet initial
   * @param  {integer} k  nombre de sommet du chemin
   */
  _dijkstraWithKLength(id, k){
    this._resetBar();

    //on créé la file de priorité, on empile le 1er sommet et on l'indique comme rencontré
    let priorityQueue = new PriorityQueue();
    priorityQueue.enqueue(this.listBar[this._getIdFromString(id)], 0, 0);
    this.listBar[this._getIdFromString(id)].meeted = true;

    //on execute l'algorithme tant que la file de priorité n'est pas vide
    while(!priorityQueue.isEmpty()){
      //on recupére un bar de la file de priorité et on sauve ces attributs dans des variable
      let qE = priorityQueue.dequeue();
      let currentBar = qE.element;
      let currentPriority = qE.priority;
      let currentNbBrowsedNode = qE.nbBrowsedNode;

      currentBar.visited = true;

      let neighbours = this._getNeighbours(currentBar.id);//on récupére tous les voisins du sommet courant
      for(let i = 0; i < neighbours.length; i++){
        let neighbourBar = neighbours[i]["bar"];
        let neighbourPriority = neighbours[i]["priority"];

        if(!neighbourBar.visited){
          let priority = currentPriority + neighbourPriority;//on calcule la priorité du sommet voisin
          let nbBrowsedNode = currentNbBrowsedNode + 1;//on calcule le nombre de sommet pour arriver au sommet voisin

          // si le nombre de sommet pour atteindre le voisin est plus petit que k, on ajoute sois le sommet sois on le met à jour en fonction
          // de si il a déjà été visité ou non
          if(nbBrowsedNode < k){
            if(!neighbourBar.meeted){
              priorityQueue.enqueue(neighbourBar, priority, nbBrowsedNode);
              neighbourBar.idParent = currentBar.id;
              neighbourBar.meeted = true;
            }else{
              priorityQueue.decreasePriority(neighbourBar, priority, nbBrowsedNode);
              neighbourBar.idParent = currentBar.id;
            }
          }
        }
      }
    }
  }

  /**
   * Permet de récupérer le chemin de longeur K avec le poids le plus faible possible
   * @param  {string} startId id du sommet de départ
   * @param  {integer} k       nombre de sommet du chemin
   * @return {string}         retourne le chemin de poids le plus court de longeur k
   */
  getShortestKPath(startId, k){
    this._dijkstraWithKLength(startId, k);

    let shortestPath = "";
    let minWeight = 9999999;//on prends un nombre arbitrairement grand pour calculer le minimum
    this.listBar.forEach(function(e){
      let currentPath = this._getShortestPathRecursive(e.id).split("").reverse().join("");//on recupère le chemin menant au bar et on l'inverse

      //on garde uniquement les chemins commencant par le point de départ et ceux de taille k+1
      if(startId == currentPath[0] && currentPath.length == k){
        let currentWeight = this._computePathByCriterion(currentPath, "distance");

        //si la priorité du chemin est plus petite on sauve ce chemin et son poids
        if(currentWeight < minWeight){
          shortestPath = currentPath;
          minWeight = currentWeight;
        }
      }
    }, this);
    return [shortestPath, minWeight];
  }

  //================================================================================
  // Méthode de calcul du chemin le plus long avec argent
  //================================================================================

    /**
     * Permet de calculer le chemin contenant le plus de bar possible avec la somme que l'utilisateur à renter depuis un certain bar.
     * Le chemin doit etre le plus long possible mais avec le poids le plus court possible.
     * Dans l'implémentation ci dessous, l'algorithme avec le plus de bar possible et non celui avec le prix le plus bas.
     * Exemple : si on a 4 chemin ["abcd" avec un poids de 40, "aefb" avec un poids de 35, "abf" avec un poids de 20, "aeb" avec un poids de 40],
     * l'algorithme retourneras le chemin "aefb" car c'est le chemin contenant le plus de bars avec le plus petit poids.
     * @param  {integer} id    id du bar de départ
     * @param  {integer} money montant que dispose l'utilisateur sur lui
     * @return {array}       retourne le chemin le plus long avec un poids minimum dans la 1ere case du tableau et le cout de celui-ci dans la 2eme
     */
    getLongestPathFromMoney(id, money){
      let paths = this.getAllShortestPaths(id, "drinkPriceAvg", false);//on calcule le chemin le plus court par rapport au prix des boissons
      let sortedPaths = Object.values(paths);//converti l'objet paths en array

      const maxPathLength = Math.max.apply(Math, sortedPaths.map(function (el) { return el.length }));//on récupére la longeur du plus long string du tableau

      let longestPathFromMoney = "";//contiendra le reultat final
      let i = maxPathLength;

      //on stocke la valeur du poids du chemin minimum
      //on demarre avec un nombre très grand, avec lequel on est sur de trouver un chemin qui a un poids plus petit
      let minPathPrice = 9999999999;

      //on tourne dans la boucle tant qu'on a pas trouvé le chemin
      while(longestPathFromMoney == ""){

        //si le compteur arrive a 0, c'est qu'on a trouvé aucuns chemin, on sort de la boucle pour éviter une boucle infini
        if(i == 0){
          break;
        }

        //on recupére tous les chemins de longeur k et on les parcours
        this.getAllPathsOfkLength(sortedPaths, i).forEach((e) =>{
          let pathPrice = this._computePathByCriterion(e, "drinkPriceAvg");//on calcule le poids du chemin

          //on controle que l'utilisateur ai assez d'argent et que le poids du chemin calculer est plus petit que celui trouver précedement
          if((pathPrice < money) && (pathPrice < minPathPrice)){
            minPathPrice = pathPrice;
            longestPathFromMoney = e;//le chemin actuelle devient le meilleur chemin
          }
        });
        i--;//si on a trouver aucun chemin de longeur k pour nos conditions on cherche des chemins de taille k-1
      }
      return [longestPathFromMoney, minPathPrice];
    }

    /**
     * retourne tous les chemins d'une longeur k
     * @param  {array} paths contient tous les chemins a traiter
     * @param  {integer} k   longeur des chemins
     * @return {array}       retourne les chemins de longeur k
     */
    getAllPathsOfkLength(paths, k){
      let kLengthPaths = [];
      paths.forEach((e) => {
        if(e.length == k)
        {
          kLengthPaths.push(e);
        }
      });
      return kLengthPaths;
    }

//================================================================================
// Méthodes de statistiques du graphe
//================================================================================

  /**
   * Permet d'obtenir le bar avec les boissons les plus chers
   * @return {string} nom du bar
   */
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

  /**
   * Permet d'obtenir le bar avec les boissons les moins chers
   * @return {string} nom du bar
   */
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

  /**
   * Permet d'obtenir le bar avec l'ambiance maximum
   * @return {string} nom du bar
   */
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

  /**
   * Permet d'obtenir le bar avec l'ambiance minimum
   * @return {string} nom du bar
   */
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
}

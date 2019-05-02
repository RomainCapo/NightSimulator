class Graph {
  constructor(nodes, edges){
    this.listBar = [];
    this.contigMatrix;

    this._loadBarsFromJson(nodes);
    this._loadEdgesFromJson(edges);
  }

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

  _loadBarsFromJson(nodes){
      Object.entries(nodes._data).forEach(([key, val]) => {
        let node = nodes._data[key]
        this.listBar.push(new Bar(node.id, node.label, node.drinkPriceAvg, node.ambience));
    });
  }

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

  drawPathOnGraph(path, edges, nodes){
    this.edgeDisabilityAllEdges(edges, true);

    for(let i = 0; i< (path.length - 1); i++){
      let nodeId = this._findEdgeId(edges._data, path[i], path[i+1]);
      edges.update({id:nodeId, width:3, hidden:false});

      nodes.update({id:path[i], color:'#5cb85c'});
    }
    nodes.update({id:path[path.length-1], color:'#5cb85c'});
  }

  _getNeighboursInString(neighbours){
    let string = "";
    for(let i = 0; i < neighbours.length;i++){
      string += neighbours[i]["bar"].id;
    }
    return string;
  }

  resetGraph(nodes, edges){
    this.edgeDisabilityAllEdges(edges, false);
    let length = Object.keys(nodes._data).length;
    for(let i = 0; i < length; i++){
      nodes.update({id:nodes._data[i].id, color:'#5bc0de'});
    }
  }

  edgeDisabilityAllEdges(edges, disability){
    let length = Object.keys(edges._data).length;
    for(let i = 0; i < length; i++){
      edges.update({id:edges._data[i].id, hidden:disability, width:1});
    }
  }

  findAllPath(idBase, k){
    if(k < (this.listBar.length)){
      let neighboursString = this._getNeighboursInString(this._getNeighbours(idBase));
      let endPath = this._reduceArray(this.stringPermutations(neighboursString), k);
      return endPath.map(function(e) {return idBase + e});
    }else {
      return 0;
    }
  }

  weigthFunction(){
    
  }

  getSmallestWeightedPath(idBase, k, option){
    let paths = this.findAllPath(idBase, k);

    let result = [];
    let weigth;
    for(let i = 0; i < paths.length; i++){
      let weigth = 0;
      for(let j = 0; j < (paths[i].length - 1); j++){

        if(option == "pathLength"){
          weigth += this.contigMatrix[paths[i][j]][paths[i][j+1]];
        }else if (option == "drinkPrice") {
          //console.log(listBar[paths[i][j]].name + " - " listBar[paths[i][j]].drinkPriceAvg);
          weigth += this.listBar[paths[i][j]].drinkPriceAvg;
        }else if (option == "barAmbience") {
          weigth += this.listBar[paths[i][j]].ambience;
        }

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

  _reduceArray(array, k){
    let out = array.map(v => v.slice(0, k - length));
    return out.filter(function(value, index){ return out.indexOf(value) == index });
  }

  //https://medium.com/@lindagmorales94/how-to-solve-a-string-permutation-problem-using-javascript-95ad5c388219
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

  _resetBar(){
    for(let i = 0; i < this.listBar.length; i++){
      this.listBar[i].visited = false;
      this.listBar[i].meeted = false;
    }
  }

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

  dijkstra(id){
    this._resetBar();
    let priorityQueue = new PriorityQueue();
    priorityQueue.enqueue(this.listBar[id], 0);
    while(!priorityQueue.isEmpty()){
      let qE = priorityQueue.dequeue();
      let bar = qE.element;
      let priority = qE.priority;

      bar.visited = true;

      let neighbours = this._getNeighbours(bar.id);
      for(let i = 0; i < neighbours.length; i++){
        if(!neighbours[i]["bar"].visited){
          priorityQueue.enqueue(neighbours[i]["bar"], priority + neighbours[i]["priority"]);
        }
      }
    }
  }

  test(){
  }
}

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
        this.listBar.push(new Bar(node.id, node.label, 1, 1));
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

  findAllPath(idBase, k){
    if(k < (this.listBar.length - 1)){
      let neighbours = this._getNeighbours(idBase);
      let endPath = this._reduceArray(this.stringPermutations("1234"), k);
      return endPath.map(function(e) {return idBase + e});
    }else {
      return 0;
    }
  }

  getSmallestWeightedPath(idBase, k){
    let paths = this.findAllPath(idBase, k);

    let result = [];
    let weigth;
    for(let i = 0; i < paths.length; i++){
      let weigth = 0;
      for(let j = 0; j < (paths[i].length - 1); j++){

        weigth += this.contigMatrix[paths[i][j]][paths[i][j+1]];
        //console.log(paths[i][j]);
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
      //console.log(priorityQueue.items);
      let qE = priorityQueue.dequeue();
      let bar = qE.element;
      let priority = qE.priority;

      bar.visited = true;

      console.log(bar.name + "-");
      let neighbours = this._getNeighbours(bar.id);
      for(let i = 0; i < neighbours.length; i++){
        if(!neighbours[i]["bar"].visited){
          console.log(neighbours[i]["bar"]);
          priorityQueue.enqueue(neighbours[i]["bar"], priority + neighbours[i]["priority"]);
          console.log(priorityQueue.items);
        }
      }
    }
  }

  test(){
    console.log(this.getSmallestWeightedPath(0,2));
  }
}

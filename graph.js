class Graph {
  constructor(){
    this.listBar = [];
    this.test = "rr";
  }

  loadBarsFromJson(nodes){
    let tmp = [];
    console.log(this.listBar);
    Object.keys(nodes._data).forEach(function(key) {
      let node = nodes._data[key];
      tmp.push(new Bar(node.id, node.name, 1,1));
    });
    this.listBar = tmp;
  }

  loadEdgesFromJson(edges){
    
  }
}

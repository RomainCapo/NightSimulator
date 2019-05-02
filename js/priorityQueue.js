//https://www.geeksforgeeks.org/implementation-priority-queue-javascript/
class QElement{
  constructor(element, priority){
    this.element = element;
    this.priority = priority;
  }
}

class PriorityQueue{
  constructor(){
    this.items = [];
  }

  enqueue(element, priority){
    var qElement = new QElement(element, priority);
    var contain = false;

    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].priority > qElement.priority) {
            this.items.splice(i, 0, qElement);
            contain = true;
            break;
        }
    }

    if (!contain) {
        this.items.push(qElement);
    }
  }

  isEmpty(){
    return (this.items.length == 0);
  }

  dequeue() {
    if (this.isEmpty())
        return "Underflow";
    return this.items.shift();
  }

/*  _resetBar(){
    for(let i = 0; i < this.listBar.length; i++){
      this.listBar[i].visited = false;
      this.listBar[i].meeted = false;
    }
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
  }*/
}

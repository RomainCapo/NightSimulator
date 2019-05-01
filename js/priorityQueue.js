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

}

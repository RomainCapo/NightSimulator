/**
 * Classe qui représente un élément qui sera plcaé dans la file de priorité
 */
class QElement{
  /**
   * Constructeur de QElement
   * @param {object} element  objet contenu dans la file de prioritée
   * @param {number} priority priorité de l'element en question
   */
  constructor(element, priority){
    this.element = element;
    this.priority = priority;
  }
}

/**
 * Classe représentant une queue de prioritée néccaissaire a l'implémentation de l'algorithm de Dijkstra.
 * Exemple pris du site et adapté : https://www.geeksforgeeks.org/implementation-priority-queue-javascript/
 */
class PriorityQueue{
  /**
   * Constructeur de PriorityQueue. Initialise le tableau représentant la  pile.
   */
  constructor(){
    this.items = [];
  }

/**
 * Permet de placer un element dans la file. Assure que le premier élément de la file sera toujours celui avec la plus petite priorité et le dernier celui avec la plus grand priorité.
 * @param  {object} element  objet a placé dans la file
 * @param  {number} priority priorité de l'element dans la file
 */
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

  getPriority(element){
    for(let i = 0; i < this.items.length; i++)
    {
      if(JSON.stringify(element) === JSON.stringify(this.items[i].element) )
      {
        return this.items[i].priority;
      }
    }
  }

  decreasePriority(element, priority, idParent){
    for(let i = 0; i < this.items.length; i++)
    {
      if(JSON.stringify(element) === JSON.stringify(this.items[i].element) )
      {
        if (i !== -1) this.items.splice(i, 1);
      }
    }

    this.enqueue(element, priority, idParent);
  }


/**
 * Permet d'enelver l'element avec la plus basse priorité de la file
 * @return {object} retourne l'élément avec la plus basse priorité
 */
  dequeue() {
    if (this.isEmpty())
        return "Underflow";
    return this.items.shift();
  }

/**
 * Indique si la file est vide ou non
 * @return {boolean} indique si la file est vide
 */
  isEmpty(){
    return (this.items.length == 0);
  }
}

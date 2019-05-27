/*
* Romain Capocasale
* INF2dlm-A
* He-Arc
* 15.05.2019
* NightSimulator
 */
/**
 * represente un sommet du graphe
 */
class Bar {
  /**
   * Constructeur de bar
   * @param {number} id            id du bar
   * @param {string} name          nom du bar
   * @param {number} drinkPriceAvg prix moyen de la boisson
   * @param {number} ambience      nombre entre 1 et 10 qui représente l'ambiance du bar
   */
  constructor(id, name, drinkPriceAvg, ambience){
    this.id = id;
    this.name = name;
    this.drinkPriceAvg = drinkPriceAvg;
    this.ambience = ambience;
    this.visited = false;
    this.meeted = false;
    this.idParent = 'none';//none si le sommet n'a été placé dans la file de priorité par aucuns autres sommets
  }
}

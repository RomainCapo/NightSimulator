# Titre
NigthSimulator

# Resumé
Le but du projet serait de représenter différents bars sous forme d'un graphe, chaques bars seraient séparés d’une certaine distance les uns des autres. De plus, chaques bars auraient comme attribut le prix moyen de la boisson, une note sur l'ambiance, etc (critère a ajouter). Il serait alors possible de lancer différentes simulation sur ce graphe.

# Objectif principale
Dans un premier temps, a partir d'un certain bar l'utilisateur pourra connaitre la distance la plus courte pour se rendre a chacun des autres bara. Le chemin sera calculé selon différents critères par rapport au choix de l'utilisateur:
  * la distance
  * le prix de la boisson
  * la note d'ambiance
  * avec tous les critère ci-dessus

# Objectif secondaire
A partir d'un certain bar, l'utilisateur a la possibilité de choisir combien de bar il souhaite visiter (k bar). L'algorithme recherche alors, le chemin le plus court de longeur k depuis un sommet précis.

# AlgoNum
## Objectif principale
* Algorithme de Dijkstra classique avec différents formule de calcul pour la fonction de priorié.

## Objectif secondaire
* Algorithme de Dijkstra en enregistrant le nombre de sommet parcouru.
* Algorithme par force brut (qui calule tous les chmemins possible et leur poids).

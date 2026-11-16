# Bos : le produit

Description donnée par Mickael le 16/11/2026. Source de vérité pour cadrer les
plans ; une précision ou un changement de cap va d'abord dans
`docs/decisions.md`.

## L'idée

Bos est un système complet qui rend disponibles des services aux acteurs qui
gravitent autour des bâtiments. Concrètement : installer des capteurs et des
actionneurs dans des bâtiments, puis, sur la base de leurs données et de leurs
capacités de pilotage, construire des services utiles.

## Les acteurs servis

Occupants, entreprises de maintenance, bailleurs, électriciens, propriétaires,
locataires, et d'autres acteurs non cités à ce jour. La liste n'est pas fermée.

## Exemples de services

- Gestion automatique de l'ombrage.
- Monitoring énergétique.
- Gestion des ouvertures de fenêtre automatiques.
- Sécurité intrusion.

## Exigence première

La plateforme doit être **hyper simple et intuitive** pour les utilisateurs
finaux. Chaque étape du parcours se juge d'abord à cette aune.

## Le parcours, de la configuration au service

1. **Configurateur en ligne** : le client encode les données de son bâtiment,
   puis sélectionne les services auxquels il souhaite souscrire.
2. **Package d'équipements** : la plateforme définit les équipements
   nécessaires à la réalisation de ces services.
3. **Commande** : le client valide la demande et commande directement en ligne.
4. **Commande aux fournisseurs** : les équipements sont commandés
   automatiquement auprès des différents fournisseurs, avec qui les prix ont
   été négociés au préalable.
5. **Plan d'exécution** : établi automatiquement et proposé au gestionnaire du
   projet, qui le valide.
6. **Réception et commissionnement** : les équipements sont réceptionnés, puis
   commissionnés très simplement dans la plateforme par le gestionnaire.
7. **Expédition** : dès que tous les équipements sont prêts et identifiés, le
   package est transmis au client.
8. **Installation** : par le client lui-même ou par un électricien partenaire,
   très rapidement et simplement, en mode « plug and play ».
9. **Services** : le client en dispose et les consulte depuis son interface
   client en ligne et depuis son application mobile.

## Souscrire à un nouveau service

Le client peut ensuite souscrire à de nouveaux services. La plateforme vérifie
si un équipement technique supplémentaire est nécessaire :

- **oui** : le processus de commande habituel s'enclenche (étapes 2 à 9) ;
- **non** : le nouveau service est accessible dès la première seconde qui suit
  la commande du client.

## Ce que cela implique pour la plateforme (à cadrer, rien n'est tranché)

Briques qui se lisent dans le parcours, chacune sujet d'un futur `/cadrer` :
le modèle du bâtiment ; le catalogue des services et des équipements, et la
règle qui déduit un package des services choisis ; la commande et le paiement ;
les fournisseurs et leurs prix ; le plan d'exécution et l'espace du
gestionnaire ; le commissionnement et l'identification des équipements ; la
collecte des données et le pilotage des actionneurs ; l'interface client ;
l'application mobile ; les rôles des différents acteurs.

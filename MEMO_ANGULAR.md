# Mémo Angular

## Commandes de base

### Lancer le serveur de développement
```bash
ng serve
```
Lance l'application en mode développement sur `http://localhost:4200/`

## Génération de composants

### Créer un nouveau composant
```bash
ng generate component home
```
ou en version courte :
```bash
ng g c home
```

Cette commande crée :
- `home.component.ts` : La logique du composant
- `home.component.html` : Le template HTML
- `home.component.css` : Les styles du composant
- `home.component.spec.ts` : Les tests unitaires

## Génération d'interfaces

### Créer une nouvelle interface
```bash
ng generate interface nomFichier
```
ou en version courte :
```bash
ng g i nomFichier
```

Cette commande crée un fichier TypeScript avec une interface vide que vous pouvez ensuite compléter.

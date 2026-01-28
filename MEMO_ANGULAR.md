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

## Concepts TypeScript/Angular

### 1. Duck Typing (Typage structurel)

**"Si ça marche comme un canard et ça fait coin-coin comme un canard, c'est un canard"**

TypeScript utilise le **typage structurel**. Un objet est compatible avec un type si sa structure correspond, même sans déclaration explicite.

**Exemple avec `HousingLocationInfo` :**

```typescript
// housinglocation.ts
export interface HousingLocationInfo {
    id: number;
    name: string;
    city: string;
    state: string;
    photo: string;
    availableUnits: number;
    wifi: boolean;
    laundry: boolean;
}

// housing.service.ts
protected housingLocationList: HousingLocationInfo[] = [
    {
      id: 0,
      name: 'Acme Fresh Start Housing',
      city: 'Chicago',
      state: 'IL',
      // ...
    }
];
```

L'objet littéral n'est **jamais explicitement déclaré** comme `HousingLocationInfo`, mais TypeScript l'accepte car il a **la même structure**.

```typescript
// ❌ Pas besoin de faire :
const location = new HousingLocationInfo(); // Impossible avec interface

// ✅ On fait juste :
const location: HousingLocationInfo = {
    id: 1,
    name: "Test",
    city: "Paris",
    // ...
}; // Duck typing !
```

### 2. Injection vs Instanciation en Angular

**Exemple avec `HousingService` :**

```typescript
// housing.service.ts
@Injectable({
  providedIn: 'root',  // Service disponible dans toute l'app
})
export class HousingService {
  getAllHousingLocations(): HousingLocationInfo[] { ... }
}
```

#### ❌ Sans Angular (instanciation classique) :
```typescript
const service = new HousingService(); // Mauvaise pratique en Angular !
```

#### ✅ Avec Angular (injection de dépendances) :
```typescript
export class HomeComponent {
  constructor(private housingService: HousingService) {}
  // Angular crée et injecte automatiquement l'instance !
}
```

**Avantages de l'injection :**
- **Singleton** : Une seule instance partagée dans toute l'application
- **Testabilité** : Facile de mocker les dépendances dans les tests
- **Découplage** : Le composant ne gère pas la création du service
- **Gestion automatique** : Angular gère le cycle de vie des instances

### 3. Interface vs Classe vs Record

#### Interface
```typescript
export interface HousingLocationInfo {
    id: number;
    name: string;
}
```
- **Contrat de structure** uniquement
- Disparaît après compilation (pas de JavaScript généré)
- Pas de logique, pas d'instanciation possible
- Utilisée pour typer des objets (duck typing)
- **Usage** : Définir la forme des données

#### Classe
```typescript
export class HousingService {
  readonly baseUrl = 'https://...';

  getAllHousingLocations(): HousingLocationInfo[] {
    return this.housingLocationList;
  }
}

export class HousingLocation {
  housingLocation = input.required<HousingLocationInfo>();
}
```
- **Structure + Logique** (méthodes, propriétés)
- Existe en JavaScript après compilation
- Peut être instanciée avec `new` (mais pas en Angular avec DI)
- Peut avoir constructeur, méthodes, encapsulation (private, protected, public)
- **Usage** : Logique métier, composants, services

#### Record (Type utilitaire TypeScript)
```typescript
// Transformer interface en dictionnaire
type HousingRecord = Record<number, HousingLocationInfo>;

const housings: HousingRecord = {
  0: { id: 0, name: "Acme", city: "Chicago", ... },
  1: { id: 1, name: "A113", city: "Santa Monica", ... }
};

// Accès par clé
const firstHousing = housings[0];
```
- Type générique pour créer des objets avec des clés dynamiques
- Format : `Record<KeyType, ValueType>`
- Pratique pour les maps/dictionnaires avec typage fort
- **Usage** : Structures de données indexées

#### Tableau comparatif

| Type | Compilation JS | Instanciation | Logique | Usage principal |
|------|---------------|---------------|---------|-----------------|
| **Interface** | ❌ Disparaît | ❌ Impossible | ❌ Non | Typer des données |
| **Classe** | ✅ Existe | ✅ `new` possible | ✅ Oui | Composants, services |
| **Record** | ❌ Type uniquement | N/A | ❌ Non | Dictionnaires typés |

### Exemple complet dans ce projet

```typescript
// 1. Interface définit la structure (duck typing)
interface HousingLocationInfo { id: number; name: string; }

// 2. Classe avec logique (injection)
@Injectable({ providedIn: 'root' })
class HousingService {
  // 3. Array d'objets validés par duck typing
  protected housingLocationList: HousingLocationInfo[] = [
    { id: 0, name: "Acme", ... }  // TypeScript valide la structure
  ];

  getAllHousingLocations() { return this.housingLocationList; }
}

// 4. Composant classe qui injecte le service
export class HomeComponent {
  constructor(private housingService: HousingService) {}

  ngOnInit() {
    this.housingList = this.housingService.getAllHousingLocations();
  }
}
```

## Formulaires réactifs (Reactive Forms)

### 1. Configuration de base

**Import des modules nécessaires :**
```typescript
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-details',
  imports: [ReactiveFormsModule],  // Import du module dans le composant
  // ...
})
```

### 2. Déclaration du FormGroup

**Structure du formulaire dans le TypeScript :**
```typescript
export class Details {
  applyForm = new FormGroup({
    firstName: new FormControl(''),    // Valeur initiale vide
    lastName: new FormControl(''),
    email: new FormControl(''),
  });
}
```

- **`FormGroup`** : Groupe tous les champs du formulaire ensemble
- **`FormControl`** : Représente chaque champ individuel
- Les valeurs entre parenthèses (`''`) sont les **valeurs initiales** des champs

### 3. Liaison dans le template

**Connexion HTML ↔ TypeScript :**
```html
<form [formGroup]="applyForm" (submit)="submitApplication()">
  <label for="first-name">First Name</label>
  <input id="first-name" type="text" formControlName="firstName" />

  <label for="last-name">Last Name</label>
  <input id="last-name" type="text" formControlName="lastName" />

  <label for="email">Email</label>
  <input id="email" type="email" formControlName="email" />

  <button type="submit" class="primary">Apply now</button>
</form>
```

**Syntaxes Angular importantes :**

| Syntaxe | Type | Description | Exemple |
|---------|------|-------------|---------|
| `[property]` | **Property binding** | Lie une propriété TypeScript → HTML | `[formGroup]="applyForm"` |
| `(event)` | **Event binding** | Écoute un événement HTML → TypeScript | `(submit)="submitApplication()"` |
| `formControlName` | **Directive** | Lie un input à un FormControl | `formControlName="firstName"` |

### 4. Event Binding : `(submit)`

**Qu'est-ce que `(submit)` ?**
```html
<form (submit)="submitApplication()">
```

- **`submit`** : Événement HTML natif déclenché quand on soumet un formulaire
- **`( )`** : Syntaxe Angular pour **écouter un événement**
- **`="submitApplication()"`** : Méthode à exécuter quand l'événement se produit

**Équivalent JavaScript vanilla :**
```javascript
form.addEventListener('submit', (event) => {
  submitApplication();
});
```

**Autres exemples d'event binding :**
- `(click)="onClick()"` : Écoute les clics
- `(input)="onChange()"` : Écoute les changements de saisie
- `(keyup)="onKeyUp()"` : Écoute les touches du clavier
- `(mouseenter)="onHover()"` : Écoute le survol de la souris

### 5. Traitement de la soumission

**Récupération des valeurs du formulaire :**
```typescript
submitApplication() {
  this.housingService.submitApplication(
    this.applyForm.value.firstName ?? '',
    this.applyForm.value.lastName ?? '',
    this.applyForm.value.email ?? '',
  );
}
```

- **`this.applyForm.value`** : Objet contenant toutes les valeurs du formulaire
- **`?? ''`** : Opérateur de coalescence nulle (nullish coalescing)
  - Retourne la valeur de gauche si elle existe
  - Retourne `''` si la valeur est `null` ou `undefined`

**Exemple de l'objet `value` :**
```typescript
// Si l'utilisateur a rempli le formulaire :
this.applyForm.value = {
  firstName: "Jean",
  lastName: "Dupont",
  email: "jean.dupont@example.com"
}
```

### 6. Schéma complet du flux

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPOSANT TYPESCRIPT                      │
├─────────────────────────────────────────────────────────────┤
│  applyForm = new FormGroup({                                │
│    firstName: new FormControl(''),                          │
│    lastName: new FormControl(''),                           │
│    email: new FormControl(''),                              │
│  });                                                         │
│                                                              │
│  submitApplication() {                                       │
│    // Récupération des valeurs                              │
│    const values = this.applyForm.value;                     │
│  }                                                           │
└──────────────┬────────────────────────────┬─────────────────┘
               │                            │
      [formGroup]="applyForm"      (submit)="submitApplication()"
               │                            │
               ▼                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      TEMPLATE HTML                           │
├─────────────────────────────────────────────────────────────┤
│  <form [formGroup]="applyForm" (submit)="submitApplication()">│
│    <input formControlName="firstName" />                    │
│    <input formControlName="lastName" />                     │
│    <input formControlName="email" />                        │
│    <button type="submit">Submit</button>                    │
│  </form>                                                     │
└─────────────────────────────────────────────────────────────┘
               │
               │ formControlName lie chaque input
               │ à son FormControl
               ▼
        Synchronisation bidirectionnelle automatique
```

### 7. Avantages des formulaires réactifs

✅ **Gestion programmatique** : Tout est contrôlé dans le TypeScript
✅ **Validation facilitée** : Ajout facile de validateurs
✅ **Testabilité** : Logique isolée dans la classe, facile à tester
✅ **Réactivité** : Observables pour écouter les changements en temps réel
✅ **Immutabilité** : Les changements créent de nouvelles instances

### 8. Exemple avec validation (optionnel)

```typescript
import { Validators } from '@angular/forms';

applyForm = new FormGroup({
  firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
  lastName: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
});

// Vérifier si le formulaire est valide
submitApplication() {
  if (this.applyForm.valid) {
    // Traiter les données
  } else {
    console.log('Formulaire invalide');
  }
}
```

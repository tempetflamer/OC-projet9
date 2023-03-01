# Projet 9 - Billed

Projet 9 du parcours "Développeur d'application - JavaScript React", "Débuggez et testez un SaaS RH" qui consiste au débogage de l'application web, de la rédaction d'un plan de test end-to-end manuel, ainsi que de l'écrit des tests unitaires et d'intégration de l'application.  

## Informations du projets

### Contexte
>Billed, une entreprise qui produit des solutions Saas destinées aux équipes de ressources humaines.
Dans deux semaines, l’équipe doit montrer la solution qui fonctionne à l’ensemble de l’entreprise. 
Matthieu, Lead Developer de la feature team a demandé à être aidé pour tenir les délais et vous avez appris hier lors de la réunion d’équipe que c’est vous qui avez été désigné !

### Tâches
- **[Bug - report] :** 
Fixer les bugs identifiés dans le rapport de bug fourni par Jest. Une copie est disponible dans le [kanban Notion](https://www.notion.so/a7a612fc166747e78d95aa38106a55ec?v=2a8d3553379c4366b6f66490ab8f0b90).
***Règles/contraintes :*** 
Utiliser Chrome Debugger.
---
- **[Bug - hunt] :** 
Fixer les bugs identifiés par Leila sur le parcours employé. Ils sont décrits dans le [kanban Notion](https://www.notion.so/a7a612fc166747e78d95aa38106a55ec?v=2a8d3553379c4366b6f66490ab8f0b90).
***Règles/contraintes :*** 
Utiliser Chrome Debugger.
---
- **[Tests unitaires et d’intégration] :** 
Ajouter des tests unitaires et d’intégration pour les fichiers Bills et NewBill. Ils vont permettre d’éliminer les bugs et d’éviter toute régression lors des prochaines évolutions de la solution.
Certains tests sont déjà développés (pour le Login et pour le Dashboard côté administrateur RH) : ils sont déjà cochés sur le kanban. Il faut s’en inspirer pour les restants.
***Règles/contraintes :***
Il faut assurer un taux de couverture global des containers de 80% minimum (tests unitaires & tests d’intégration).
---
- **[Test End-to-End]  :** 
Rédiger un plan de test End-to-End (E2E) sur le parcours employé pour guider Leïla.
***Règles/contraintes :*** 
Manque de temps pour automatiser les tests (E2E). Ils seront effectués manuellement par Leila.
S’inspirer du plan E2E que Garance a déjà rédigé sur le parcours administrateur RH.
---
**Autres informations :**
- L’application contient déjà des données test mais il est nécessaire d’en créer de nouvelles.
- Des comptes administrateur et employé ont été créés pour les tests dans le readme du code front-end. Il faut les utiliser pour pouvoir charger une note de frais côté employé et la consulter côté administrateur RH.


### Ressources

[Description des fonctionnalités](https://s3.eu-west-1.amazonaws.com/course.oc-static.com/projects/DA+JSR_P9/Billed+-+Description+des+fonctionnalite%CC%81s.pdf)

[Description pratique des besoins](https://course.oc-static.com/projects/DA+JSR_P9/Billed+-+Description+pratique+des+besoins+-.pdf)

[Rapport des bogues identifiés - kanban Notion](https://www.notion.so/a7a612fc166747e78d95aa38106a55ec?v=2a8d3553379c4366b6f66490ab8f0b90)

[Exemple de plan de tests End-to-End](https://course.oc-static.com/projects/DA+JSR_P9/Billed+-+E2E+parcours+administrateur.docx)

[Backend du projet à installer](https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-back)

[Front du projet à installer](https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Front)


## Mise en place du projet
Étant sur windows, j'ai installé win-node-env `npm i -g win-node-env` et fait des modifications supplémentaires dans le package.json pour le fonctionnement de l'application, les étapes de l'instalaltion se trouve ci-dessous.

### Back-end

Cloner le projet :
```
git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Back.git
```

Acceder au repertoire du projet :
```
cd Billed-app-FR-Back
```

Installer les dépendances du projet :
```
npm install
npm i -g win-node-env 
```

Ouvrir le fichier "package.json" et remplacer (pour utilisateurs windows) :
```
"test": "NODE_ENV=test sequelize-cli db:migrate && jest test -i tests/user.test.js --watch",
"run:dev": "NODE_ENV=development sequelize-cli db:migrate && node server.js",
```
par :
```
"test": "set NODE_ENV=test&& sequelize-cli db:migrate&& jest test -i tests/user.test.js --watch",
"run:dev": " set NODE_ENV=development&& sequelize-cli db:migrate&& node server.js",
```

Lancer l'API :
```
npm run run:dev
```

Accéder à l'API :

L'api est accessible sur le port `5678` => `http://localhost:5678`


### Front-end

Cloner le projet :
```
git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Front.git
```

Acceder au repertoire du projet :
```
cd Billed-app-FR-Front
```

Installer les dépendances du projet :
```
npm i
npm install -g live-server 
```

Lancer le projet (site) :
```
live-server
```
Le site ce lancera automatiquement sur le port 8080 => `http://127.0.0.1:8080/`


### Identifiants

administrateur : 
```
utilisateur : admin@company.tld 
mot de passe : admin
```

employé :
```
utilisateur : employee@company.tld
mot de passe : employee
```

### Lancer les tests (Front-end)

Lancer tous les tests
```
npm run test
```

Lancer un seul test (Login.js)
```
npm run test Login
```

Page de couverture de test :
`http://127.0.0.1:8080/coverage/lcov-report/`


Vous retrouverez également les étapes d'installation données dans leurs dossiers respectifs [Back](https://github.com/tempetflamer/OC-projet9/tree/main/Billed-app-FR-Back) & [Front](https://github.com/tempetflamer/OC-projet9/tree/main/Billed-app-FR-Front).


## Livrables

### Plan de test End-to-End
[E2E Employé](https://github.com/tempetflamer/Assets/blob/main/oc/oc9/Lecroq_Nicolas_plan_test_022023.pdf?raw=true)

### Rapport de test Jest :
![Test](https://github.com/tempetflamer/Assets/blob/main/oc/oc9/tests_report.jpg?raw=true)

### Rapports de couverture Jest :
![Couverture - Tous fichiers](https://github.com/tempetflamer/Assets/blob/main/oc/oc9/coverage_report_all_files.jpg?raw=true)

![Couverture - Conteneurs](https://raw.githubusercontent.com/tempetflamer/Assets/main/oc/oc9/coverage_report_containers.jpg?raw=true)

![Couverture - Vues](https://raw.githubusercontent.com/tempetflamer/Assets/main/oc/oc9/coverage_report_views.jpg)


## Compétences évaluées

- Écrire des tests unitaires avec JavaScript
- Débugger une application web avec le Chrome Debugger
- Rédiger un plan de test end-to-end manuel
- Écrire des tests d'intégration avec JavaScript
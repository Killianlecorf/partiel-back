# Projet Node.js avec Express, PostgreSQL et MikroORM

Ce projet utilise **Node.js**, **Express**, **PostgreSQL** comme base de données et **MikroORM** pour l'ORM (Object-Relational Mapper). Ce README vous guidera pour démarrer et configurer votre environnement.

## Prérequis

1. **Node.js** installé sur votre machine. Si ce n'est pas déjà fait, vous pouvez le télécharger ici : [Node.js](https://nodejs.org/)
2. **PostgreSQL** installé sur votre machine ou une base de données PostgreSQL disponible (vous pouvez installer PostgreSQL via [ce lien](https://www.postgresql.org/download/)).
3. **NPM** ou **Yarn** pour gérer les dépendances.

## Démarrage du projet

### 1. Cloner le repository

```bash
git clone https://github.com/Killianlecorf/partiel-back.git
```

### 2. Installer les dépendances

```bash
npm install
```
### 3. Configurer la base de données

Créez une base de données PostgreSQL avec pgadmin que l'on nomme "partiel" avec ce mot de passe "azqswx12" et comme user "postgres"

Ajouter ce code dans le .env

```js
PORT= 5656
JWT_SECRET='fewfouiwdjvniubgwrujfoirbegobijkertpiohgregret5h7tre85hg4'
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=azqswx12
DB_NAME=partiel
POSTGRES_PASSWORD=azqswx12
```

### 4. Créer les migrations

Pour créer des migrations qui synchroniseront la structure de votre base de données avec vos entités, exécutez la commande suivante :

```bash
npx mikro-orm migration:create
```

```bash
npx mikro-orm migration:up
```

### 5. Lancer le serveur Express

```bash
npm run dev
```
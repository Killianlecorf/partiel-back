# Étape 1: Construction de l'image de l'application Node.js
FROM node:18-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json (si présent)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code de l'application
COPY . .

# Étape 2: Préparer l'image de production
FROM node:18-alpine AS production

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires à partir de l'étape de construction
COPY --from=build /app /app

# Exposer le port que l'application va utiliser
EXPOSE 5656

# Lancer l'application avec la commande Node.js
CMD ["npm", "run", "dev"]

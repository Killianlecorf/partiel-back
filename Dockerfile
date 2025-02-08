FROM node:18

RUN apt-get update && apt-get install -y postgresql-client dos2unix

WORKDIR /usr/src/order-service

# Copier uniquement les fichiers nécessaires pour éviter l'invalidation du cache
COPY package*.json ./
RUN npm install --verbose

# Copier tout le reste du projet après installation des dépendances
COPY . .

# Convertir les scripts en format UNIX si nécessaire
RUN dos2unix init.sh wait-for-it.sh && chmod +x init.sh wait-for-it.sh

RUN npm run build

EXPOSE 5656

HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD curl -f http://localhost:5656/health || exit 1

CMD ["sh", "./init.sh"]
FROM node:20

RUN apt-get update && apt-get install -y postgresql-client dos2unix

WORKDIR /usr/src/partiel-back

COPY package*.json .
RUN npm install --verbose

COPY . .

RUN dos2unix init.sh wait-for-it.sh

RUN chmod +x init.sh wait-for-it.sh

RUN npm run build

EXPOSE 5656

CMD ["sh", "./init.sh"]
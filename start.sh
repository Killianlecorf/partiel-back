until pg_isready -h postgres -p 5432 -U postgres; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

npx mikro-orm migration:up --config src/Database/mikro-orm.config.ts

npm run dev

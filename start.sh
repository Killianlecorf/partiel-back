echo "Waiting for database to be ready..."
while ! nc -z db 5432; do
  sleep 1
done
echo "Database is ready!"

echo "Waiting for a few seconds before running migrations..."
sleep 5

echo "Running migrations..."
npm run migration:create
npm run migration:up

echo "Migrations applied!"
echo "Starting the application..."
npm run dev
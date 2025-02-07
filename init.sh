#!/bin/sh

# Attendre que PostgreSQL soit prêt
./wait-for-it.sh $DB_HOST:$DB_PORT --timeout=30 --strict -- echo "Postgres is up and running"

echo "Checking if database $DB_NAME exists..."
RESULT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -tAc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'")

if [ "$RESULT" = "1" ]; then
    echo "Database $DB_NAME already exists."
else
    echo "Creating database $DB_NAME..."
    PGPASSWORD=$DB_PASSWORD createdb -h $DB_HOST -U $DB_USER $DB_NAME
fi

MIGRATION_FLAG_FILE="/usr/src/partiel-back/.migration_completed"

if [ ! -f "$MIGRATION_FLAG_FILE" ]; then
    echo "Applying migrations..."
    npm run migration:up

    echo "Creating admin user..."
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "
    INSERT INTO public.\"users\" (
        name, 
        email, 
        password, 
        is_admin, 
        created_at, 
        update_at
    ) VALUES (
        'admin', 
        'admin@mail.com', 
        '\$2a\$10\$E.k2.fHZozM8fDeGQCLafu8QhUD6NMrV3x0v56l1AzpYIT7Bq5RO2', 
        true, 
        CURRENT_TIMESTAMP, 
        CURRENT_TIMESTAMP
    ) ON CONFLICT (email) DO NOTHING;"

    touch "$MIGRATION_FLAG_FILE"
fi

echo "Starting the service..."
npm run dev

#!/bin/sh

# Attendre que PostgreSQL soit prêt
./wait-for-it.sh postgres:5432 --timeout=30 --strict -- echo "Postgres is up and running"

# Définir les variables nécessaires pour la connexion à la base de données
DB_NAME=${POSTGRES_DB}
DB_USER=${POSTGRES_USER}
DB_PASS=${POSTGRES_PASSWORD}
DB_HOST=${POSTGRES_HOST:-postgres}
DB_PORT=${POSTGRES_PORT:-5432}

# Vérifier si la base de données existe
echo "Checking if database $DB_NAME exists..."
RESULT=$(PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -tAc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" || echo "ERROR")

if [ "$RESULT" = "1" ]; then
    echo "Database $DB_NAME already exists."
elif [ "$RESULT" = "ERROR" ]; then
    echo "Error connecting to Postgres. Check your credentials."
    exit 1
else
    echo "Database $DB_NAME does not exist. Creating..."
    PGPASSWORD=$DB_PASS createdb -h $DB_HOST -U $DB_USER $DB_NAME
    echo "Database $DB_NAME created successfully."
fi

# Supprimer les tables existantes pour éviter les conflits
echo "Dropping existing tables if they exist..."
PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "
DROP TABLE IF EXISTS public.\"product\" CASCADE;
DROP TABLE IF EXISTS public.\"order_item\" CASCADE;
DROP TABLE IF EXISTS public.\"user\" CASCADE;
DROP TABLE IF EXISTS public.\"order\" CASCADE;
DROP TABLE IF EXISTS mikro_orm_migrations CASCADE;
"

# Appliquer les migrations si elles n'ont pas été faites
MIGRATION_FLAG_FILE="/usr/src/order-service/.migration_completed"

if [ ! -f "$MIGRATION_FLAG_FILE" ]; then
    echo "Applying database migrations..."
    npx mikro-orm migration:up --config src/Database/mikro-orm.config.ts

    # Insérer l'utilisateur admin après les migrations
    echo "Creating admin user..."
    PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "
    INSERT INTO public.\"user\" (
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

    # Marquer les migrations comme terminées
    touch "$MIGRATION_FLAG_FILE"
    echo "Migrations and admin user creation completed."
else
    echo "Migrations have already been applied."
fi

# Lancer l'application après la création de la base de données et les migrations
echo "Starting the order service..."
npm start
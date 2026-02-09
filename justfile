set quiet := true

# List all available commands
default:
    just --list --unsorted

##################################
# Production

# Build production image
build:
    docker compose build

# Start production containers (detached)
run:
    op run --account my.1password.com --env-file=op.env -- docker compose up --detach

# Stop production containers
stop:
    docker compose down

# Tail production logs
logs:
    docker compose logs -f

# Open the production site in the default browser
open:
    open http://localhost:${FRONTEND_PORT:-3000}

# Remove production containers and volumes
[confirm("This will delete production volumes. Continue? (y/N)")]
clean:
    docker compose down --volumes --remove-orphans

##################################
# Development

# Start dev containers with hot reload (detached, rebuilds on changes)
dev:
    op run --account my.1password.com --env-file=op.env -- docker compose -f docker-compose.dev.yml up --build --detach

# Stop dev containers
dev-stop:
    docker compose -f docker-compose.dev.yml down

# Tail dev logs
dev-logs:
    docker compose -f docker-compose.dev.yml logs -f

# Open the dev site in the default browser
dev-open:
    open http://localhost:${DEV_FRONTEND_PORT:-3001}

# Remove dev containers (preserves volumes with personal data)
dev-clean:
    docker compose -f docker-compose.dev.yml down --remove-orphans

##################################
# Cleanup

# Remove all containers and volumes (production + dev)
clean-all: clean dev-clean

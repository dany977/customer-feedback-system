# Makefile
.PHONY: help build up down dev clean prod logs

help:
	@echo "Available commands:"
	@echo "  make dev      - Run in development mode with hot reload"
	@echo "  make prod     - Run in production mode"
	@echo "  make build    - Build Docker images"
	@echo "  make up       - Start containers"
	@echo "  make down     - Stop containers"
	@echo "  make clean    - Remove containers, volumes, and images"
	@echo "  make logs     - View logs"

dev:
	docker-compose -f docker-compose.dev.yml up --build

prod:
	docker-compose --profile production up --build -d

build:
	docker-compose -f docker-compose.dev.yml build
	docker-compose --profile production build

up:
	docker-compose --profile production up -d

down:
	docker-compose --profile production down
	docker-compose -f docker-compose.dev.yml down

clean:
	docker-compose --profile production down -v
	docker-compose -f docker-compose.dev.yml down -v
	docker system prune -af

logs:
	docker-compose --profile production logs -f

backend-shell:
	docker exec -it feedback_backend python manage.py shell

backend-migrate:
	docker exec -it feedback_backend python manage.py migrate

backend-createsuperuser:
	docker exec -it feedback_backend python manage.py createsuperuser
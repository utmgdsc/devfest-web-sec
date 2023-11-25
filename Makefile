up:
	docker compose -f compose.yaml up --build -d

down:
	docker compose -f compose.yaml down

logs:
	docker compose logs --follow

db:
	psql 'postgres://postgres:password@localhost:5432/library'

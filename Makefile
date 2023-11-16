define migration-run
	docker exec -it web_api sh -c "pnpm run migrate:up"
endef

dev:
	docker-compose -f docker-compose.dev.yaml up --build -d
	$(migration-run)

prod:
	docker-compose -f docker-compose.prod.yaml up --build -d
	$(migration-run)

clean:
	docker-compose down

.PHONY: dev prod clean
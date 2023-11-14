.PHONY: dev prod clean

dev:
	docker-compose up

prod:
	docker-compose -f docker-compose.prod.yaml up

clean:
	docker-compose down

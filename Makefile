.PHONY: install dev build start format lint check typecheck clean

install:
	bun install

dev:
	bun run dev

build:
	bun run build

start:
	bun run start

format:
	bun run format

lint:
	bun run lint

check:
	bun run check

typecheck:
	bun run typecheck

clean:
	rm -rf .next node_modules bun.lock

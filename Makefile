prepare-environment:
	@pipx install pre-commit
	@pipx ensurepath
	@pre-commit install

init: prepare-environment
	@echo "Installing Node.js dependencies..."
	@yarn install

format:
	@echo "🔤 Ordenando imports (eslint)..."
	@npx eslint . --fix
	@echo "🎨 Formateando (prettier)..."
	@npx prettier --write "**/*.{ts,tsx,js,jsx,json,yml,yaml,md}" --ignore-path .prettierignore --ignore-unknown

format-check:
	@npx prettier --check "**/*.{ts,tsx,js,jsx,json,yml,yaml,md}" --ignore-path .prettierignore --ignore-unknown

lint:
	@npx eslint .

typecheck:
	@npx tsc --noEmit

check: lint typecheck

build:
	@echo "🏗️  Compilando @sincpro/mobile-ui -> lib (tsc + tsc-alias)..."
	@rm -rf lib
	@npx tsc -p tsconfig.build.json
	@npx tsc-alias -p tsconfig.build.json
	@echo "✓ Build listo en ./lib (JS + .d.ts, alias @ resuelto a relativo)"

verify-format: format
	@if ! git diff --quiet; then \
	  echo >&2 "✘ El formateo ha modificado archivos. Por favor agrégalos al commit."; \
	  git --no-pager diff --name-only HEAD -- >&2; \
	  exit 1; \
	fi
	@echo "✓ Format verification passed"

VERSION := $(shell node -p "require('./package.json').version")

update-version:
ifndef VERSION
	$(error VERSION is required. Usage: make update-version VERSION=1.2.3)
endif
	@CURRENT_VERSION=$$(node -p "require('./package.json').version"); \
	if [ "$$CURRENT_VERSION" = "$(VERSION)" ]; then \
		echo "✓ Version is already $(VERSION), skipping update"; \
	else \
		npm version $(VERSION) --no-git-tag-version && echo "✓ Version updated to $(VERSION)"; \
	fi

publish: build
	@echo "📦 Publishing @sincpro/mobile-ui to NPM (source)..."
	@if [ -n "$$NPM_TOKEN" ]; then \
		echo "//registry.npmjs.org/:_authToken=$$NPM_TOKEN" > .npmrc.tmp; \
		chmod 600 .npmrc.tmp; \
		npm publish --access public --userconfig .npmrc.tmp; \
		rm -f .npmrc.tmp; \
	elif [ -n "$$NODE_AUTH_TOKEN" ]; then \
		npm publish --access public; \
	else \
		npm publish --access public; \
	fi
	@echo "✓ Published successfully"

clean:
	@rm -rf lib node_modules
	@echo "✓ Cleaned"

test:
	@echo "Running tests..."

.PHONY: prepare-environment init format format-check lint typecheck check build verify-format update-version publish clean test

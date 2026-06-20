prepare-environment:
	@pipx install pre-commit
	@pipx ensurepath
	@pre-commit install

init: prepare-environment
	@echo "Installing Node.js dependencies..."
	@yarn install

format:
	@npx prettier --write "**/*.{ts,tsx,js,jsx,json,yml,yaml,md}" --ignore-path .prettierignore --ignore-unknown

format-check:
	@npx prettier --check "**/*.{ts,tsx,js,jsx,json,yml,yaml,md}" --ignore-path .prettierignore --ignore-unknown

lint:
	@yarn lint

typecheck:
	@yarn typecheck

check: lint typecheck

build:
	@echo "🏗️  Building @sincpro/mobile_ui (ESM + types)..."
	@yarn bob build
	@echo "✓ Build artifacts ready in ./lib"

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
	@echo "📦 Publishing @sincpro/mobile_ui to NPM..."
	@npm publish --access public
	@echo "✓ Published successfully"

clean:
	@rm -rf lib node_modules
	@echo "✓ Cleaned"

test:
	@echo "Running tests..."

.PHONY: prepare-environment init format format-check lint typecheck check build verify-format update-version publish clean

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
	@npx prettier --experimental-cli --write "**/*.{ts,tsx,js,jsx,json,yml,yaml,md}" --ignore-path .prettierignore --ignore-unknown

lint:
	@npx eslint .

typecheck:
	@npx tsc --noEmit

storybook-check:
	@echo "🔎 Validando stories (tsconfig.stories.json)..."
	@npx tsc --noEmit -p tsconfig.stories.json
	@echo "✓ Stories OK"

storybook:
	@echo "📚 Iniciando Storybook on-device (Expo)..."
	@echo "   Pulsa 'a' (Android), 'i' (iOS) o escanea el QR con Expo Go."
	@npx expo start -c

storybook-android:
	@echo "📚 Storybook → Android (build nativo)..."
	@npx expo run:android

storybook-ios:
	@echo "📚 Storybook → iOS (build nativo)..."
	@npx expo run:ios

build:
	@echo "🏗️  Compilando @sincpro/mobile-ui -> dist (tsc + tsc-alias)..."
	@rm -rf dist
	@npx tsc -p tsconfig.build.json
	@npx tsc-alias -p tsconfig.build.json
	@find sincpro_mobile_ui -name '*.css' -exec sh -c 'mkdir -p "dist/$$(dirname "$${1#sincpro_mobile_ui/}")" && cp "$$1" "dist/$${1#sincpro_mobile_ui/}"' _ {} \;
	@echo "✓ Build listo en ./dist (JS + tipos; los subpaths se exponen vía exports)"

doctor:
	@bash scripts/doctor.sh

verify-format: format typecheck storybook-check doctor
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
	@echo "📦 Publishing @sincpro/mobile-ui to NPM..."
	@if [ -n "$$NPM_TOKEN" ]; then \
		echo "//registry.npmjs.org/:_authToken=$$NPM_TOKEN" > .npmrc.tmp; \
		chmod 600 .npmrc.tmp; \
		npm publish --access public --userconfig .npmrc.tmp; \
		rm -f .npmrc.tmp; \
	else \
		npm publish --access public; \
	fi
	@echo "✓ Published successfully"

clean:
	@rm -rf dist node_modules
	@echo "✓ Cleaned"

test:
	@echo "Running tests..."

.PHONY: prepare-environment init format format-check lint typecheck check verify build verify-format update-version publish clean test storybook-check storybook storybook-android storybook-ios

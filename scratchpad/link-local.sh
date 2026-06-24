#!/usr/bin/env bash
# Wire local builds of mobile-ui → core → odoo → tickets (no publish needed).
# Run from anywhere. Re-run after any yarn install in downstream repos.
set -euo pipefail

ROOT=/Users/andru1236/dev/mobile

UI_DIR=$ROOT/sincpro_mobile_ui
CORE_DIR=$ROOT/sincpro_mobile
ODOO_DIR=$ROOT/sincpro_mobile_odoo
TICKETS_DIR=$ROOT/sincpro_mobile_tickets

wire() {
  local src=$1 dest=$2
  echo "   → wiring dist/ into $dest"
  rm -rf "$dest"
  cp -r "$src" "$dest"
}

# ── 1. Build mobile-ui ────────────────────────────────────────────────────────
echo ""
echo "▶ 1/3  Building @sincpro/mobile-ui..."
(cd "$UI_DIR" && make build)

UI_DIST=$UI_DIR/dist

wire "$UI_DIST" "$CORE_DIR/node_modules/@sincpro/mobile-ui/dist"
wire "$UI_DIST" "$ODOO_DIR/node_modules/@sincpro/mobile-ui/dist"
wire "$UI_DIST" "$TICKETS_DIR/node_modules/@sincpro/mobile-ui/dist"

# ── 2. Build sincpro_mobile (core) ────────────────────────────────────────────
echo ""
echo "▶ 2/3  Building @sincpro/mobile (core)..."
(cd "$CORE_DIR" && make build)

CORE_DIST=$CORE_DIR/dist

wire "$CORE_DIST" "$ODOO_DIR/node_modules/@sincpro/mobile/dist"
wire "$CORE_DIST" "$TICKETS_DIR/node_modules/@sincpro/mobile/dist"

# ── 3. Build sincpro_mobile_odoo ──────────────────────────────────────────────
echo ""
echo "▶ 3/3  Building @sincpro/mobile-odoo..."
(cd "$ODOO_DIR" && make build)

ODOO_DIST=$ODOO_DIR/dist

wire "$ODOO_DIST" "$TICKETS_DIR/node_modules/@sincpro/mobile-odoo/dist"

echo ""
echo "✓ Wiring completo. Listo para correr tickets en local."
echo "  ⚠  Si haces yarn install en algún repo, vuelve a correr este script."

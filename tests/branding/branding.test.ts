/**
 * Runtime tests for `branding.ts`: brand logo + mesh asset singletons, set/get round-trip.
 */
import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

(globalThis as { __DEV__?: boolean }).__DEV__ = true;

async function loadModules() {
  return { branding: await import("@sincpro/mobile-ui/branding") };
}

describe("branding", () => {
  it("getBrandingLogo is undefined before setBranding", async () => {
    const { branding } = await loadModules();
    (branding.__resetBranding as () => void)();
    assert.equal((branding.getBrandingLogo as () => unknown)(), undefined);
  });

  it("getBrandingMesh is undefined before setBranding", async () => {
    const { branding } = await loadModules();
    (branding.__resetBranding as () => void)();
    assert.equal((branding.getBrandingMesh as () => unknown)(), undefined);
  });

  it("setBranding + getBrandingLogo round-trips", async () => {
    const { branding } = await loadModules();
    (branding.__resetBranding as () => void)();
    (branding.setBranding as (c: unknown) => void)({ logo: "FAKE_LOGO" });
    assert.equal((branding.getBrandingLogo as () => unknown)(), "FAKE_LOGO");
  });

  it("setBranding + getBrandingMesh round-trips", async () => {
    const { branding } = await loadModules();
    (branding.__resetBranding as () => void)();
    (branding.setBranding as (c: unknown) => void)({ mesh: "FAKE_MESH" });
    assert.equal((branding.getBrandingMesh as () => unknown)(), "FAKE_MESH");
  });

  it("getBrandingMeshSize passes through setBranding({ meshSize })", async () => {
    const { branding } = await loadModules();
    (branding.__resetBranding as () => void)();
    (branding.setBranding as (c: unknown) => void)({ meshSize: 80 });
    assert.equal((branding.getBrandingMeshSize as () => unknown)(), 80);
  });

  it("__resetBranding clears all state", async () => {
    const { branding } = await loadModules();
    (branding.setBranding as (c: unknown) => void)({
      logo: "LOGO_X",
      mesh: "MESH_X",
      meshSize: 56,
    });
    (branding.__resetBranding as () => void)();
    assert.equal((branding.getBrandingLogo as () => unknown)(), undefined);
    assert.equal((branding.getBrandingMesh as () => unknown)(), undefined);
    assert.equal((branding.getBrandingMeshSize as () => unknown)(), undefined);
  });
});

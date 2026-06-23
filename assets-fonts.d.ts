// Ambient declarations for bundled font assets (Satoshi .otf). Metro resolves these to an
// asset module id (number) at runtime; this lets TS accept `import X from "...otf"`.
declare module "*.otf" {
  const asset: number;
  export default asset;
}
declare module "*.ttf" {
  const asset: number;
  export default asset;
}

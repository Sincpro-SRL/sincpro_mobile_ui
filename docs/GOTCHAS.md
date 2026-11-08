# GOTCHAS — Trampas conocidas (Sincpro Mobile)

> Cada entrada es **síntoma → causa → fix**. Son cosas que **ya nos pasaron** y que el typecheck
> muchas veces **no** detecta. Si ves un comportamiento raro, busca el síntoma acá antes de investigar de cero.
> Las marcadas 🔴 rompen en **runtime** (no en compilación).

---

## Runtime (no los atrapa `tsc`)

### 🔴 Pantalla en blanco / rutas que no matchean → `const enum`

- **Síntoma:** la app arranca, pasa el splash, pero queda en blanco; las rutas parecen no funcionar.
- **Causa:** un `const enum` (típicamente `AppScreen`) cuyos miembros se inicializan desde otro enum (`LOGIN = OdooScreen.LOGIN`). Babel/Metro **no inlinea `const enum` entre módulos** (con `isolatedModules`), así que en runtime los valores quedan `undefined` → `<Route path={undefined}>` no matchea → blanco.
- **Fix:** usar `enum` regular, nunca `const enum`. Convertí todos: `grep -rl "const enum" .` → cambiá `const enum`→`enum`. Aplica también a enums que un paquete **publica** y otro **consume** (el `.d.ts` declara `const enum` pero el `.js` lo inlineó/eliminó → el consumidor lo ve `undefined`).

### 🔴 "RepositoryFacade: Repository not found" al arrancar → `repos.get()` eager

- **Síntoma:** crash al iniciar, repos no encontrados.
- **Causa:** un service singleton resuelve repos en field-init (`private readonly x = repos.get(...)`), que corre al **importar** el módulo, **antes** de que `bootstrap()` registre los repos.
- **Fix:** getter lazy → `private get x() { return repos.get(...); }`. (En la migración de distribution fueron 28 sitios.)

### Eventos que "desaparecen" del barrel `@sincpro/mobile/domain`

- **Síntoma:** un evento existe pero no se puede importar desde el barrel raíz del dominio.
- **Causa:** se re-exporta el mismo símbolo por dos `export *` (su barrel de contexto **y** `domain/events.ts`). TypeScript lo elimina del barrel raíz en silencio.
- **Fix:** un evento se exporta por **una sola ruta**: `domain/events.ts`. Los barrels de contexto no re-exportan sus eventos.

---

## Dependencias / packaging

### 🔴 CI falla: `Package "" refers to a non-existing file '.../sincpro_mobile_ui'`

- **Síntoma:** `yarn install` rompe en CI (no local).
- **Causa:** una dependencia `@sincpro/...` declarada como `file:../sincpro_mobile_ui`. Funciona local (carpetas hermanas) pero en CI el repo se clona **solo** → la ruta no existe.
- **Fix:** las apps consumen del **registry** (versión publicada) en `dependencies` y en `resolutions`. Nada de `file:` en repos que corren CI.

### 🔴 `OdooModule is not assignable to DomainModule` (tipos idénticos que no matchean)

- **Síntoma:** error de tipos entre paquetes con tipos que deberían ser el mismo.
- **Causa:** **dos copias físicas** de `@sincpro/mobile` en el árbol (ej. yarn1 con `file:` copia el `node_modules` anidado de la dep). TypeScript trata cada copia como identidades distintas.
- **Fix:** una sola copia. Consumir del registry + `peerDependencies` (la app provee la única instancia). Si quedó una copia anidada: borrarla (`rm -rf node_modules/@sincpro/mobile-odoo/node_modules/@sincpro/mobile`).

### Deep import a un subpath de **directorio** no resuelve

- **Síntoma:** `Cannot find module '@sincpro/mobile/domain/entity'` en un consumidor, aunque el archivo existe.
- **Causa:** el `exports` con wildcard `"./*": "./dist/*.js"` cubre subpaths de **archivo**, no de **directorio-index**.
- **Fix:** agregá una entrada explícita por cada barrel de directorio: `"./domain/entity": "./dist/domain/entity/index.js"`.

### Falta un paquete transitivo en una app que usa `file:`

- **Síntoma:** `Cannot find module 'clsx'` (u otro) en runtime, aunque el lib lo tiene.
- **Causa:** un link `file:` no instala las deps transitivas del lib.
- **Fix:** declarar la dep faltante en la app, o (mejor) consumir del registry.

---

## UI / Expo / build nativo

### 🔴 La app deja de responder a toques al cerrar una sheet o mientras se ve un toast

- **Síntoma:** después de cerrar una sheet (o mientras hay un toast o una "píldora" de actividad visible) ningún toque responde; la pantalla se ve normal.
- **Causa:** el overlay vive en **otra ventana nativa**. Un `Modal` de RN, o la sheet de `@expo/ui` (diálogo Compose en Android), captura todos los toques de la pantalla, y `pointerEvents="box-none"` no los devuelve a la ventana de abajo. Si se desmonta sin cerrarse (`index -1` sin `hide()`), la ventana puede quedar viva.
- **Fix:** overlays en la misma ventana, en el `OverlayHost` (`Dialog.Sheet`, Toast). Nunca `Modal` salvo pantalla completa. Diagnóstico: `adb shell dumpsys window windows | grep "Window #"` muestra una ventana extra de la app.

### 🔴 Freeze o toques erráticos en filas y botones → `Pressable` de RN con `className`

- **Síntoma:** al tocar una fila o un botón la UI se traba o el toque no responde.
- **Causa:** el interop de NativeWind sobre el `Pressable` de React Native re-entra en el render al tocar (peor con `style={({ pressed }) => …}`).
- **Fix:** usar `@sincpro/mobile-ui/primitives/Pressable` (TouchableOpacity). El estado presionado va en `activeOpacity`; el seleccionado, en `style` con tokens.

### La barra del teclado (anterior / siguiente) queda pegada abajo en Android

- **Síntoma:** la barra no sigue al teclado, o queda visible sin teclado.
- **Causa:** un formulario consciente del teclado dentro de una ventana aparte (sheet nativa o `Modal`): keyboard-controller solo sigue la ventana principal y el `Modal` de RN. Además, cada formulario montaba su propia barra.
- **Fix:** una sola `Form.KeyboardToolbarHost` en la raíz (Android apagada por defecto) y sheets en el `OverlayHost` (misma ventana).

### Lista lenta: todas las filas se repintan con cualquier cambio

- **Síntoma:** escribir en el buscador o abrir algo hace que la lista entera se repinte.
- **Causa:** renderer inline en `ListViewV2.Content`, un array nuevo en cada render (`items.slice(...)` sin memo) u overlays dentro de las filas.
- **Fix:** renderer con `useCallback`, filas con `memo` y sin estado, datos con `useMemo`, una sola sheet por pantalla. Verificar con `make perf-test`.

### Reassure marca "redundant updates" al abrir o cerrar una sheet (esperado)

- **Síntoma:** `make perf-test` reporta `Redundant updates: 2` en el escenario de la sheet.
- **Causa:** la sheet se declara en la pantalla y se dibuja en el `OverlayHost`. Al cambiar `visible`, la pantalla hace un commit en el que el portal sigue devolviendo `null` (sin cambio visible). En el mismo commit, el layout effect del portal actualiza el store y el host dibuja en un `nested-update`, **antes de pintar**. No hay un frame extra.
- **Fix:** ninguno; es el costo del patrón portal (el mismo de `@gorhom/portal`). Sí es un problema un redundante que **no** venga seguido de un `nested-update`, o un aumento del conteo de renders.

### 🔴 Un modal oscurece media pantalla y la tarjeta sale cortada abajo → `KeyboardAwareScrollView` con `style` de posición

- **Síntoma:** en `PromoModal`, el fondo oscuro cubría solo la mitad de arriba y la tarjeta quedaba centrada en la mitad de abajo, cortada.
- **Causa:** keyboard-controller (1.22) envuelve su scroll en un `ReanimatedClippingScrollView` con `flexGrow/flexShrink: 1` y le pasa el `style` al scroll **de adentro**. Un `position: "absolute"` o un margen se pierden y el envoltorio se reparte la columna con sus hermanos.
- **Fix:** `KeyboardAwareScrollView` solo vive en `Form.KeyboardForm` (hay un contrato que lo exige). Sin inputs, se usa un `ScrollView` normal, que sí respeta `style`.

### Logo/branding desaparece tras migrar (Display.Logo, HomeHeader, AuthFormView)

- **Síntoma:** login/perfil/home renderizan pero **sin logo** (espacio vacío donde iba el logo).
- **Causa:** el design system standalone (`@sincpro/mobile-ui`) entrega assets **por props**, no por el mapa `EDomain` del monolito. `Display.Logo` renderiza `null` si no recibe `source`; `LoginScreen`/`ProfileScreen` (odoo) muestran logo solo si les pasás `logoSource`.
- **Fix:** pasar el asset explícitamente: `<LoginScreen logoSource={require(".../<APP>/logo.png")} />`, `<ProfileScreen logoSource={...} />`, y en headers locales `<Display.Logo source={require(...)} />`. El asset vive en `assets/<APP>/logo.png` (repo-root). Mismo patrón para cualquier branding que el monolito resolvía por dominio.

### NativeWind: estilos `className` no se aplican (render sin estilos)

- **Síntoma:** la UI renderiza pero sin estilos de Tailwind.
- **Causa:** falta `jsxImportSource: "nativewind"` → se usa `react/jsx-runtime` en vez de `nativewind/jsx-runtime`.
- **Fix:** en `tsconfig` `"jsxImportSource": "nativewind"`; en `babel.config.js` `["babel-preset-expo", { jsxImportSource: "nativewind" }]` + `"nativewind/babel"`. El lib debe compilarse con `jsxImportSource: nativewind` en `tsconfig.build.json`.

### Icono/splash nativos no cambian aunque `app.json` esté bien

- **Síntoma:** la app muestra el icono/splash por defecto de Expo.
- **Causa:** existe un `android/` (o `ios/`) **prebuildeado stale**; los recursos nativos se hornean en `prebuild` y no se actualizan al editar `app.json`.
- **Fix:** `npx expo prebuild --clean -p android` (regenera). Verificá `android/app/src/main/res/values/colors.xml` (splash bg) y los mipmaps.

### Icono adaptativo Android se ve "raro" (doble círculo / recortado / diminuto)

- **Síntoma:** el icono se ve mal enmascarado.
- **Causa:** `adaptiveIcon.foregroundImage` apunta a un icono full-bleed (con su propio fondo). Android le agrega su `backgroundColor` + máscara → doble fondo / recorte.
- **Fix:** el foreground debe ser **transparente** con el glifo centrado dentro de la safe-zone (~58–66%). Generar con Pillow/sips un PNG 1024 transparente con el logo centrado; `backgroundColor` sólido aparte.

### 🔴 Pantalla en blanco tras el splash → layouts presentacionales usados como navegador

- **Síntoma:** el splash desaparece pero no se monta ninguna pantalla.
- **Causa:** un layout de mobile-ui solo presenta `children`; no registra rutas ni monta un navegador. Los wrappers antiguos `TabNavigatorLayout` se eliminaron.
- **Fix:** el host monta su navegador, restaura la sesión antes de decidir los guards y compone los providers de AppShell. mobile-ui no registra rutas ni reserva el borde que ya cubre ese navegador. Durante las fases de publicación, no mezclar consumidores viejos con esta major.
- **Otras causas de blanco tras splash:** fuentes no cargadas (usar `useAppFonts()` + `SplashScreen` en el AppShell); y el `const enum` de arriba (rutas con `path` undefined).

---

### 🔴 `make build` falla con "React Compiler must compile every component"

- **Síntoma:** el build lista `· skipped <archivo>: <motivo>` y termina con error.
- **Causa:** React Compiler no puede compilar ese componente, y lo publicaría sin memoización automática. Los motivos que ya nos pasaron:
  - `try/finally` (o `throw` dentro de `try/catch`) en un handler del componente;
  - un parámetro por defecto con una expresión (`radius = size * 2`, `onPress = item.onPress`, `(a) => ...`);
  - leer `ref.current` en el render (`useRef(new Animated.Value(0)).current`).
- **Fix:**
  - **async:** `attempt(task)` + `errorMessage(cause, fallback)` de `utils/async` (no lanzan; la limpieza va después);
  - **defaults:** constante de módulo o `prop ?? valor` en el cuerpo;
  - **objetos estables:** `const [value] = useState(() => new Animated.Value(0))`, que además no crea uno nuevo en cada render.

### Un badge o pill sale en la fuente del sistema, o una clase `font-*`/`text-*` no hace nada

- **Síntoma:** un texto del DS se ve en San Francisco/Roboto en vez de IBM Plex, o `className="text-xs font-semibold"` no cambia el tamaño ni el peso.
- **Causa:** `Typography.Text` pone la variante (familia, tamaño, peso) en `style`, que gana sobre `className`. Un `Text` de RN con `font-*` toma la familia del preset de tailwind, que no sigue `configureFonts`, y el sistema cae a la fuente por defecto.
- **Fix:** todo texto pasa por `Typography.Text`. El tamaño y el peso salen de `variant`/`semibold`/`bold`, y `className` queda para color y espaciado. Los pills usan `Display/pill` (`PillLabel`). Un contrato de `tests/sdk58` prohíbe importar `Text` de react-native fuera de Typography.

### Un contador "99+" se ve como "99-" o "99·"

- **Síntoma:** el contador de un ícono corta el último carácter.
- **Causa:** un hijo `position: "absolute"` se mide contra el ancho de su padre (un ícono de 24pt). El texto no entra, salta de línea y el alto fijo lo recorta.
- **Fix:** `CountBadge` con `anchor={{ top, right }}`, que lo monta en un contenedor ancho, sin toques y alineado a la derecha.

### Una pantalla con `GradientSurface` sale en blanco

- **Síntoma:** el splash `hero` (o cualquier fondo con degradado) no se ve; queda el fondo de la app.
- **Causa:** `GradientSurface` aplica `className` a su vista **interna**. Con `className="flex-1"` y la externa sin altura, la interna arranca de base 0 y todo colapsa a 0 de alto.
- **Fix:** para llenar el padre, pasar `style={{ flex: 1 }}` (la vista externa); `className` queda para el layout del contenido.

### Los botones del pie de una sheet no aparecen

- **Síntoma:** una `Sheet` con `footer` y los snap points por defecto (`60%`, `90%`) no muestra el pie hasta que se arrastra hacia arriba.
- **Causa:** el panel mide lo que el snap más alto y reposa hundido mostrando el más bajo; lo que va al final del panel queda fuera de la pantalla.
- **Fix:** las acciones van en `footer` (`SheetSurface` lo fija al borde visible). Si un componente dibuja sus acciones dentro del contenido, que use un solo snap point.

### Una clase de color no pinta nada

- **Síntoma:** un divisor o un borde no se ve, o sale negro.
- **Causa:** la clase nombra un token que el preset no define (`bg-border-divider`, `border-brand-accent`).
- **Fix:** usar los tokens del preset. Un contrato de `tests/sdk58` falla si una clase de color nombra un token inexistente.

## Lint / tooling

### ESLint marca `import/export` falso en barrels solo-tipos (rojo en VSCode)

- **Síntoma:** `No named exports found in module '@sincpro/mobile/domain/connectivity'` sobre barrels que solo re-exportan `interface`/`type`. `tsc` está verde.
- **Causa:** `eslint-plugin-import` con el resolver de Node por defecto no entiende `paths` ni re-exports de tipo.
- **Fix:** configurar el resolver TypeScript en `eslint.config.js`:
  ```js
  settings: { "import/resolver": { typescript: { project: "./tsconfig.json" } } }
  ```

### `make format` / pre-commit crashea: "ESLint couldn't find an eslint.config file"

- **Síntoma:** `make verify-format`/`format` falla con error de config de ESLint.
- **Causa:** el repo (típicamente una app) no tiene `eslint.config.js` ni los plugins instalados, pero el Makefile corre `eslint .`.
- **Fix:** agregar `eslint.config.js` (igual que las libs: `eslint-config-expo/flat` + prettier + simple-import-sort + resolver TS) y las devDeps de eslint.

### `@mapped` u otros decoradores: TS1241

- **Síntoma:** "Unable to resolve signature of method decorator".
- **Causa:** falta `experimentalDecorators`.
- **Fix:** en `tsconfig.json` → `"experimentalDecorators": true, "emitDecoratorMetadata": true`.

---

## Drift de API entre paquetes

### Props que ya no existen (ej. `EventTimelineItem` ya no acepta `formatDate`)

- **Síntoma:** TS2322 al pasar una prop a un componente del core/ui.
- **Causa:** el componente cambió su API en una versión nueva del paquete; el código consumidor quedó atrás.
- **Fix:** alinear con el `.d.ts` instalado (`node_modules/@sincpro/mobile*/dist/**/*.d.ts`); quitar/renombrar la prop. Al migrar código viejo, esperar varios de estos.

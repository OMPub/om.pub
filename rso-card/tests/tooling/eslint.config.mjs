// Static-analysis gate for the RSO card (dev file, three.js NOT inlined).
// Rules chosen to catch exactly the audit-class defects (undefined refs, dead vars,
// unreachable code, duplicate keys, bad assignments) with zero type-noise.
export default [{
  files: ["**/*.mjs"],
  languageOptions: { ecmaVersion: 2023, sourceType: "module", globals: {
    // browser runtime the card actually uses
    window:"readonly", document:"readonly", location:"readonly", navigator:"readonly",
    console:"readonly", performance:"readonly", localStorage:"readonly",
    requestAnimationFrame:"readonly", cancelAnimationFrame:"readonly", setTimeout:"readonly",
    clearTimeout:"readonly", setInterval:"readonly", clearInterval:"readonly",
    fetch:"readonly", Worker:"readonly", Blob:"readonly", URL:"readonly", URLSearchParams:"readonly",
    TextDecoder:"readonly", TextEncoder:"readonly", DecompressionStream:"readonly", Response:"readonly",
    crypto:"readonly", MessageChannel:"readonly", structuredClone:"readonly", scheduler:"readonly",
    innerWidth:"readonly", innerHeight:"readonly", devicePixelRatio:"readonly", matchMedia:"readonly",
    AbortController:"readonly", Image:"readonly", ResizeObserver:"readonly", PerformanceObserver:"readonly",
    getComputedStyle:"readonly", FileReader:"readonly", Event:"readonly", CustomEvent:"readonly",
    addEventListener:"readonly", removeEventListener:"readonly", dispatchEvent:"readonly",
    parent:"readonly", top:"readonly", self:"readonly", DOMMatrix:"readonly", queueMicrotask:"readonly",
    // the vendored namespace (imported at runtime; three.js is NOT in this file)
    THREE:"readonly",
  }},
  rules: {
    "no-undef":"error", "no-unused-vars":["error",{args:"none",caughtErrors:"none",ignoreRestSiblings:true}],
    "no-unreachable":"error", "no-dupe-keys":"error", "no-dupe-args":"error",
    "no-const-assign":"error", "no-self-assign":"error", "no-self-compare":"error",
    "no-constant-binary-expression":"error", "use-isnan":"error", "valid-typeof":"error",
    "no-func-assign":"error", "no-import-assign":"error", "no-setter-return":"error",
  },
}];

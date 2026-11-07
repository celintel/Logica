(function (L) {
  L.Config = {
    chunk: 16,
    margin: 2,
    wrap: 128,
    cell: 8,
    speed: 14,
    maxStepsPerFrame: 8,
    start: { x: 50, y: 50 },
    set: { range: 128, min: 4, max: 32, initial: 15, tick: 20, drift: 0.4 },
    walk: { gapPure: 220, gapBlend: 90, chance: 0.06 },
    hit: {
      gap: 30,
      chance: [0, 0.04, 0.15, 0.4, 0.75, 1],
      shieldMin: 50,
      shieldMax: 200,
      cap: 4,
      capPerK: 3,
      spread: 60,
      spreadPerK: 35,
      forcedMax: 4
    }
  };
})(window.Logica = window.Logica || {});

(function (L) {
  const EMPTY = 0;
  const FLOOR = 1;
  const VALUE_OFFSET = 2;
  const STATE_SHIFT = 8;
  const STATE_MASK = 127;
  const HIGHLIGHT = 0x8000;

  const Cell = {
    EMPTY,
    FLOOR,
    isPainted: (cell) => (cell & 255) !== EMPTY,
    isFloor: (cell) => (cell & 255) === FLOOR,
    value: (cell) => (cell & 255) - VALUE_OFFSET,
    state: (cell) => (cell >> STATE_SHIFT) & STATE_MASK,
    highlighted: (cell) => (cell & HIGHLIGHT) !== 0,
    solid: (value, state, highlighted) =>
      (value + VALUE_OFFSET) | (state << STATE_SHIFT) | (highlighted ? HIGHLIGHT : 0)
  };

  function create(config) {
    const size = config.chunk;
    const wrap = config.wrap;
    const chunks = new Map();
    let cachedX = null;
    let cachedY = null;
    let cached = null;

    const wrapped = (n) => ((n % wrap) + wrap) % wrap;

    function chunkAt(cx, cy, allocate) {
      if (cx === cachedX && cy === cachedY && cached) return cached;
      const key = cx + ',' + cy;
      let chunk = chunks.get(key);
      if (!chunk && allocate) {
        chunk = new Uint16Array(size * size);
        chunks.set(key, chunk);
      }
      if (chunk) {
        cachedX = cx;
        cachedY = cy;
        cached = chunk;
      }
      return chunk;
    }

    function get(x, y) {
      const cx = Math.floor(x / size);
      const cy = Math.floor(y / size);
      const chunk = chunkAt(cx, cy, false);
      return chunk ? chunk[(y - cy * size) * size + (x - cx * size)] : EMPTY;
    }

    function paint(view, margin, rules, clearing) {
      const field = L.Operators.fieldFn(rules.state);
      const x0 = Math.floor(view.x0) - margin;
      const x1 = Math.ceil(view.x1) + margin;
      const y0 = Math.floor(view.y0) - margin;
      const y1 = Math.ceil(view.y1) + margin;

      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          if (x >= clearing.x0 && x < clearing.x1 && y >= clearing.y0 && y < clearing.y1) continue;
          const cx = Math.floor(x / size);
          const cy = Math.floor(y / size);
          const chunk = chunkAt(cx, cy, true);
          const index = (y - cy * size) * size + (x - cx * size);
          if (chunk[index]) continue;
          const value = field(wrapped(x), wrapped(y));
          chunk[index] = rules.set.has(value)
            ? Cell.solid(value, rules.state, rules.shielded.has(value))
            : FLOOR;
        }
      }
    }

    return {
      get,
      paint,
      get chunkCount() {
        return chunks.size;
      }
    };
  }

  L.Cell = Cell;
  L.World = { create };
})(window.Logica = window.Logica || {});

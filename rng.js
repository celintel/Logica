(function (L) {
  function create(seed) {
    let state = seed >>> 0;

    function next() {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    const int = (n) => Math.floor(next() * n);
    const chance = (p) => next() < p;
    const pick = (list) => list[int(list.length)];
    const take = (list) => list.splice(int(list.length), 1)[0];

    return { next, int, chance, pick, take };
  }

  L.Rng = { create };
})(window.Logica = window.Logica || {});

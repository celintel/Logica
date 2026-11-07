(function (L) {
  const LIGHTNESS = [62, 52, 46, 58, 40, 70, 50];
  const FLOOR = '#12141c';
  const BACKGROUND = '#07080c';

  function create() {
    const ops = L.Operators;
    const range = L.Config.set.range;
    const hue = (v) => Math.round((v * 360) / range);

    const table = Array.from({ length: ops.total }, (_, state) =>
      Array.from({ length: range }, (_, v) => {
        const pure = state < ops.count;
        const saturation = pure ? 85 : 95;
        const lightness = pure ? LIGHTNESS[state] : 74 + ((state - ops.count) % ops.count) * 2;
        return 'hsl(' + hue(v) + ' ' + saturation + '% ' + lightness + '%)';
      })
    );

    const highlight = Array.from({ length: range }, (_, v) => 'hsl(' + hue(v) + ' 100% 93%)');

    return {
      background: BACKGROUND,
      swatch: (v) => table[0][v],
      color(cell) {
        if (L.Cell.isFloor(cell)) return FLOOR;
        const v = L.Cell.value(cell);
        return L.Cell.highlighted(cell) ? highlight[v] : table[L.Cell.state(cell)][v];
      }
    };
  }

  L.Palette = { create };
})(window.Logica = window.Logica || {});

(function (L) {
  function create(canvas, config, world, palette) {
    const ctx = canvas.getContext('2d');
    const cell = config.cell;
    let width = 0;
    let height = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function viewRect(position) {
      const halfW = width / 2 / cell;
      const halfH = height / 2 / cell;
      return {
        x0: position.x - halfW,
        x1: position.x + halfW,
        y0: position.y - halfH,
        y1: position.y + halfH
      };
    }

    function draw(position) {
      const view = viewRect(position);
      const ox = width / 2 - position.x * cell;
      const oy = height / 2 - position.y * cell;

      ctx.fillStyle = palette.background;
      ctx.fillRect(0, 0, width, height);

      for (let y = Math.floor(view.y0); y <= Math.ceil(view.y1); y++) {
        for (let x = Math.floor(view.x0); x <= Math.ceil(view.x1); x++) {
          const value = world.get(x, y);
          if (!L.Cell.isPainted(value)) continue;
          ctx.fillStyle = palette.color(value);
          ctx.fillRect(Math.floor(ox + x * cell), Math.floor(oy + y * cell), cell, cell);
        }
      }

      ctx.fillStyle = '#fff';
      ctx.fillRect(width / 2 - 3, height / 2 - 3, 6, 6);
    }

    window.addEventListener('resize', resize);
    resize();

    return { draw, viewRect };
  }

  L.Renderer = { create };
})(window.Logica = window.Logica || {});

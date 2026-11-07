(function (L) {
  function create(config) {
    const position = { x: config.start.x, y: config.start.y };
    let cellX = Math.floor(position.x);
    let cellY = Math.floor(position.y);

    function update(dt, velocity) {
      position.x += velocity.x * config.speed * dt;
      position.y += velocity.y * config.speed * dt;
      const nextX = Math.floor(position.x);
      const nextY = Math.floor(position.y);
      const crossed = Math.abs(nextX - cellX) + Math.abs(nextY - cellY);
      cellX = nextX;
      cellY = nextY;
      return Math.min(crossed, config.maxStepsPerFrame);
    }

    return { position, update };
  }

  L.Player = { create };
})(window.Logica = window.Logica || {});

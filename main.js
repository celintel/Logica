(function (L) {
  const config = L.Config;
  const canvas = document.getElementById('view');

  const events = L.Events.create();
  const rng = L.Rng.create(Date.now());
  const walk = L.OpWalk.create(rng);
  const levelSet = L.LevelSet.create(rng, config.set);
  const director = L.Director.create({ rng, config, levelSet, walk, events });
  const world = L.World.create(config);
  const palette = L.Palette.create();
  const renderer = L.Renderer.create(canvas, config, world, palette);
  const player = L.Player.create(config);
  const input = L.Input.create(canvas);
  const panel = L.DevPanel.create({
    root: document.getElementById('dev-panel'),
    toggle: document.getElementById('dev-toggle'),
    director, levelSet, walk, world, palette, events, config
  });

  director.reset();
  const clearing = renderer.viewRect(player.position);
  let last = performance.now();

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    const crossed = player.update(dt, input.velocity());
    for (let i = 0; i < crossed; i++) director.step();

    const rules = Object.assign({ state: walk.state }, levelSet.rules(director.steps));
    world.paint(renderer.viewRect(player.position), config.margin, rules, clearing);
    renderer.draw(player.position);
    panel.render();
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})(window.Logica);

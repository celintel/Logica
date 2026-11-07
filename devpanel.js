(function (L) {
  const MAX_LOG = 7;

  function create({ root, toggle, director, levelSet, walk, world, palette, events, config }) {
    const logs = [];
    let open = false;
    let dirty = true;

    const actions = {
      mutate: () => director.mutate(),
      shift: () => director.shift(),
      hit: () => director.hit(true),
      reroll: () => {
        director.reset();
        events.emit('log', 'set rerolled');
      },
      auto: () => director.toggleAuto()
    };

    events.on('log', (text) => {
      logs.unshift(director.steps + ': ' + text);
      logs.length = Math.min(logs.length, MAX_LOG);
      dirty = true;
    });
    events.on('change', () => {
      dirty = true;
    });

    function setOpen(value) {
      open = value;
      root.classList.toggle('on', open);
      dirty = true;
    }

    toggle.addEventListener('click', () => setOpen(!open));
    addEventListener('keydown', (e) => {
      if (e.code === 'Backquote') setOpen(!open);
    });
    root.addEventListener('click', (e) => {
      const action = actions[e.target.dataset.action];
      if (action) action();
    });

    function template() {
      const state = walk.state;
      const active = L.Operators.parts(state);
      const steps = director.steps;
      const shieldedCount = levelSet.values.filter((v) => levelSet.isShielded(v, steps)).length;
      const untilTick = config.set.tick - (steps % config.set.tick);

      const operators = L.Operators.names
        .map((n, i) => '<span class="op' + (active.includes(i) ? ' current' : '') + '">' + n + '</span>')
        .join('');

      const chips = levelSet.values
        .sort((a, b) => a - b)
        .map(
          (v) =>
            '<span class="chip' + (levelSet.isShielded(v, steps) ? ' shielded' : '') +
            '" style="background:' + palette.swatch(v) + '">' + v + '</span>'
        )
        .join('');

      return (
        '<div>steps <b>' + steps + '</b> · set <b>' + levelSet.size + '</b> · chunks <b>' +
        world.chunkCount + '</b> · tick in ' + untilTick + ' · shielded <b>' + shieldedCount +
        '</b> · auto ' + (director.auto ? 'on' : 'off') + '</div>' +
        '<div class="row">' + operators + '</div>' +
        '<div class="row">now <b>' + L.Operators.name(state) + '</b></div>' +
        '<div class="row">' + chips + '</div>' +
        '<button data-action="mutate">mutate set</button>' +
        '<button data-action="shift">next operator</button>' +
        '<button data-action="hit">prime hit</button>' +
        '<button data-action="reroll">reroll set</button>' +
        '<button data-action="auto">toggle auto</button>' +
        '<div class="log">' + logs.join('\n') + '</div>'
      );
    }

    function render() {
      if (!open || !dirty) return;
      dirty = false;
      root.innerHTML = template();
    }

    return { render };
  }

  L.DevPanel = { create };
})(window.Logica = window.Logica || {});

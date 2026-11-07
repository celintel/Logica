(function (L) {
  function create({ rng, config, levelSet, walk, events }) {
    const { set: setCfg, walk: walkCfg, hit: hitCfg } = config;
    let steps = 0;
    let lastShift = 0;
    let lastHit = -Infinity;
    let auto = true;

    const log = (text) => events.emit('log', text);

    function mutate() {
      levelSet.mutate(walk.state, steps).forEach((change) => log('set ' + change));
    }

    function shift() {
      walk.advance();
      levelSet.pin(walk.state, steps);
      lastShift = steps;
      log('operator → ' + L.Operators.name(walk.state));
    }

    function hit(force) {
      if (!force && steps - lastHit < hitCfg.gap) return;

      let combo;
      if (force) {
        const ids = [...Array(L.Predicates.count).keys()];
        const size = 1 + rng.int(hitCfg.forcedMax);
        combo = [];
        while (combo.length < size) combo.push(rng.take(ids));
      } else {
        combo = L.Predicates.combo(steps);
      }

      const k = combo.length;
      if (!force) {
        if (!k) return;
        if (!rng.chance(hitCfg.chance[Math.min(k, hitCfg.chance.length - 1)])) return;
      }

      let pool = L.Predicates.members(combo, setCfg.range, 'every');
      if (pool.length < 2) pool = L.Predicates.members(combo, setCfg.range, 'some');

      const picked = [];
      const limit = hitCfg.cap + hitCfg.capPerK * k;
      while (picked.length < limit && pool.length) picked.push(rng.take(pool));

      const duration = Math.min(
        hitCfg.shieldMax,
        hitCfg.shieldMin + rng.int(hitCfg.spread + hitCfg.spreadPerK * k)
      );

      levelSet.inject(picked, steps + duration);
      lastHit = steps;
      log(
        'prime hit ' + L.Predicates.names(combo).join('+') +
        ' (x' + k + ') +' + picked.length + ', shield ' + duration
      );
    }

    function step() {
      steps++;
      if (auto) {
        if (steps % setCfg.tick === 0) mutate();
        if (L.Predicates.isPrime(steps)) {
          const gap = walk.isBlend() ? walkCfg.gapBlend : walkCfg.gapPure;
          if (steps - lastShift >= gap && rng.chance(walkCfg.chance)) shift();
          hit(false);
        }
      }
      events.emit('change');
    }

    return {
      step,
      mutate,
      shift,
      hit,
      reset() {
        levelSet.reset(walk.state, steps);
        events.emit('change');
      },
      toggleAuto() {
        auto = !auto;
        events.emit('change');
      },
      get steps() {
        return steps;
      },
      get auto() {
        return auto;
      }
    };
  }

  L.Director = { create };
})(window.Logica = window.Logica || {});

(function (L) {
  function create(rng, cfg) {
    let values = [];
    const shield = new Map();

    const isShielded = (v, step) => (shield.get(v) || 0) > step;
    const freeIndices = (step) =>
      values.map((_, i) => i).filter((i) => !isShielded(values[i], step));
    const randomValue = () => rng.int(cfg.range);

    function add() {
      let v;
      let tries = 0;
      do v = randomValue();
      while (values.includes(v) && ++tries < 200);
      values.push(v);
    }

    function pin(state, step) {
      const pins = L.Operators.pins(state);
      pins.forEach((v) => {
        if (values.includes(v)) return;
        const candidates = freeIndices(step).filter((i) => !pins.includes(values[i]));
        if (candidates.length) values[rng.pick(candidates)] = v;
      });
    }

    function reset(state, step) {
      values = [];
      shield.clear();
      for (let i = 0; i < cfg.initial; i++) add();
      pin(state, step);
    }

    function mutate(state, step) {
      const changes = [];
      const growChance = (cfg.max - values.length) / (cfg.max - cfg.min);

      if (values.length < cfg.max && rng.chance(growChance)) {
        add();
        changes.push('grew');
      } else if (values.length > cfg.min) {
        const free = freeIndices(step);
        if (free.length) {
          values.splice(rng.pick(free), 1);
          changes.push('shrank');
        }
      }

      if (rng.chance(cfg.drift)) {
        const free = freeIndices(step);
        if (free.length) {
          values[rng.pick(free)] = randomValue();
          changes.push('drifted');
        }
      }

      values = [...new Set(values)];
      pin(state, step);
      return changes;
    }

    function inject(list, until) {
      list.forEach((v) => {
        shield.set(v, until);
        if (!values.includes(v)) values.push(v);
      });
    }

    function rules(step) {
      return {
        set: new Set(values),
        shielded: new Set(values.filter((v) => isShielded(v, step)))
      };
    }

    return {
      reset,
      mutate,
      inject,
      pin,
      rules,
      isShielded,
      get size() {
        return values.length;
      },
      get values() {
        return [...values];
      }
    };
  }

  L.LevelSet = { create };
})(window.Logica = window.Logica || {});

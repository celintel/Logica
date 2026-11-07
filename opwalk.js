(function (L) {
  function create(rng) {
    let state = 0;

    function advance() {
      const ops = L.Operators;
      if (ops.isBlend(state)) {
        state = ops.resolve(state);
      } else {
        let partner;
        do partner = rng.int(ops.count);
        while (partner === state);
        state = ops.blend(state, partner);
      }
      return state;
    }

    return {
      advance,
      isBlend: () => L.Operators.isBlend(state),
      get state() {
        return state;
      }
    };
  }

  L.OpWalk = { create };
})(window.Logica = window.Logica || {});

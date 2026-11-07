(function (L) {
  const gcd = (a, b) => {
    while (b) [a, b] = [b, a % b];
    return a;
  };

  const defs = [
    { name: 'XOR', fn: (x, y) => x ^ y, pin: null },
    { name: 'AND', fn: (x, y) => x & y, pin: 0 },
    { name: 'OR', fn: (x, y) => x | y, pin: 127 },
    { name: 'NAND', fn: (x, y) => ~(x & y) & 127, pin: 127 },
    { name: 'XNOR', fn: (x, y) => ~(x ^ y) & 127, pin: 127 },
    { name: 'NOR', fn: (x, y) => ~(x | y) & 127, pin: 0 },
    { name: 'GCD', fn: gcd, pin: 1 }
  ];

  const count = defs.length;
  const total = count + count * count;

  const isBlend = (state) => state >= count;
  const blend = (a, b) => count + a * count + b;
  const parts = (state) =>
    isBlend(state)
      ? [Math.floor((state - count) / count), (state - count) % count]
      : [state];
  const resolve = (state) => parts(state).pop();
  const name = (state) => parts(state).map((i) => defs[i].name).join('⊕');
  const pins = (state) =>
    parts(state).map((i) => defs[i].pin).filter((v) => v !== null);

  function fieldFn(state) {
    const ops = parts(state).map((i) => defs[i].fn);
    if (ops.length === 1) return ops[0];
    return (x, y) => ops[0](x, y) ^ ops[1](x, y);
  }

  L.Operators = {
    count,
    total,
    names: defs.map((d) => d.name),
    isBlend,
    blend,
    parts,
    resolve,
    name,
    pins,
    fieldFn
  };
})(window.Logica = window.Logica || {});

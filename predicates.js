(function (L) {
  const isPrime = (n) => {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return true;
  };

  const reverse = (n) => Number(String(n).split('').reverse().join(''));
  const whenPrime = (n, test) => isPrime(n) && test(n);

  const defs = [
    { name: 'prime', test: (n) => isPrime(n) },
    { name: 'twin', test: (n) => whenPrime(n, (p) => isPrime(p - 2) || isPrime(p + 2)) },
    { name: 'cousin', test: (n) => whenPrime(n, (p) => isPrime(p - 4) || isPrime(p + 4)) },
    { name: 'sexy', test: (n) => whenPrime(n, (p) => isPrime(p - 6) || isPrime(p + 6)) },
    { name: 'Sophie', test: (n) => whenPrime(n, (p) => isPrime(2 * p + 1)) },
    { name: 'safe', test: (n) => whenPrime(n, (p) => p % 2 === 1 && isPrime((p - 1) / 2)) },
    { name: 'Mersenne', test: (n) => whenPrime(n, (p) => ((p + 1) & p) === 0) },
    { name: 'emirp', test: (n) => whenPrime(n, (p) => reverse(p) !== p && isPrime(reverse(p))) },
    { name: 'palindrome', test: (n) => whenPrime(n, (p) => reverse(p) === p) },
    { name: 'isolated', test: (n) => whenPrime(n, (p) => !isPrime(p - 2) && !isPrime(p + 2)) }
  ];

  function combo(n) {
    const result = [];
    defs.forEach((d, i) => {
      if (d.test(n)) result.push(i);
    });
    return result;
  }

  function members(indices, limit, mode) {
    const result = [];
    for (let v = 0; v < limit; v++) {
      const hit =
        mode === 'every'
          ? indices.every((i) => defs[i].test(v))
          : indices.some((i) => defs[i].test(v));
      if (hit) result.push(v);
    }
    return result;
  }

  L.Predicates = {
    count: defs.length,
    isPrime,
    combo,
    members,
    names: (indices) => indices.map((i) => defs[i].name)
  };
})(window.Logica = window.Logica || {});

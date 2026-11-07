(function (L) {
  function create() {
    const handlers = {};
    return {
      on(type, fn) {
        (handlers[type] = handlers[type] || []).push(fn);
      },
      emit(type, payload) {
        (handlers[type] || []).forEach((fn) => fn(payload));
      }
    };
  }

  L.Events = { create };
})(window.Logica = window.Logica || {});

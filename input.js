(function (L) {
  const JOYSTICK_RADIUS = 50;
  const clamp = (v) => Math.max(-1, Math.min(1, v));

  function create(target) {
    const keys = {};
    let drag = null;

    addEventListener('keydown', (e) => {
      keys[e.code] = true;
      if (e.code === 'Space') e.preventDefault();
    });
    addEventListener('keyup', (e) => {
      keys[e.code] = false;
    });

    target.addEventListener('pointerdown', (e) => {
      drag = { ox: e.clientX, oy: e.clientY, x: e.clientX, y: e.clientY };
      target.setPointerCapture(e.pointerId);
    });
    target.addEventListener('pointermove', (e) => {
      if (drag) {
        drag.x = e.clientX;
        drag.y = e.clientY;
      }
    });
    const release = () => {
      drag = null;
    };
    target.addEventListener('pointerup', release);
    target.addEventListener('pointercancel', release);

    function velocity() {
      let x = 0;
      let y = 0;
      if (keys.ArrowLeft || keys.KeyA) x--;
      if (keys.ArrowRight || keys.KeyD) x++;
      if (keys.ArrowUp || keys.KeyW) y--;
      if (keys.ArrowDown || keys.KeyS) y++;
      if (drag) {
        x += clamp((drag.x - drag.ox) / JOYSTICK_RADIUS);
        y += clamp((drag.y - drag.oy) / JOYSTICK_RADIUS);
      }
      const length = Math.hypot(x, y);
      if (length > 1) {
        x /= length;
        y /= length;
      }
      return { x, y };
    }

    return { velocity };
  }

  L.Input = { create };
})(window.Logica = window.Logica || {});

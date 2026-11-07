# Logica

A generative infinite grid. Each cell is painted once, just outside the viewport, from a bitwise field and a small set of numbers. The rules change as you walk. Painted cells never change.

## Run

Open `index.html` in a browser, or open the bundled `dist/logica.html`.

To rebuild the bundle:

    node build.js

No dependencies. Scripts are plain files attached to the global `Logica`, so it runs from `file://`.

## Controls

- WASD or arrow keys to move
- Drag anywhere to steer (touch)
- Backtick or the `dev` button opens the dev panel

## How it works

**Field.** For a cell (x, y), take X = x mod 128 and Y = y mod 128. An operator maps (X, Y) to a value in 0..127. Coordinates stay small however far you go.

**Level set.** A set of distinct values in 0..127. A cell is solid if its field value is in the set. Otherwise it is floor. Solid cells are coloured by value.

**Painting.** Each frame, unpainted cells in the viewport plus a 2-cell margin are painted with the current operator and set. The cells visible at load are never painted, so you start in an empty clearing.

**Steps.** One step per cell boundary crossed. Everything that changes the rules is driven by the step count.

**Mutation.** Every 20 steps the set grows or shrinks (size stays within 4..32) and may replace one value.

**Operators.** XOR, AND, OR, NAND, XNOR, NOR, GCD. The active state is either one operator or a blend of two, where a blend is the XOR of the two fields. A shift happens only on prime step counts, with a 6% chance and a minimum gap since the last one. From a pure operator it picks a random partner and enters the blend. From a blend it resolves to the partner.

**Pins.** Some values make an operator's structure visible (AND needs 0 for the Sierpinski triangle, for example). The current operator's pins are kept in the set.

**Prime hits.** On a prime step count, ten predicates are tested against the step number: prime, twin, cousin, sexy, Sophie Germain, safe, Mersenne, emirp, palindromic, isolated. The ones that hold form a combo. The more that hold, the likelier a hit fires. A hit adds values matching the combo to the set and shields them from mutation for 50 to 200 steps. Cells painted while shielded are drawn in a bright tint.

## Layout

    src/config.js      tunables
    src/events.js      event emitter
    src/rng.js         seeded random (mulberry32)
    src/operators.js   operator table, blend codes, pins
    src/predicates.js  primality and the ten predicates
    src/levelset.js    set, shields, mutate, inject, pin
    src/opwalk.js      operator state machine
    src/director.js    step counter, mutation, shifts, hits
    src/world.js       chunk storage, cell packing, paint
    src/palette.js     colours
    src/input.js       keyboard and pointer
    src/player.js      position, step counting
    src/renderer.js    canvas drawing
    src/devpanel.js    dev panel
    src/main.js        wiring and frame loop

## Cell format

Each cell is a 16-bit value in a 16x16 chunk.

    bits 0-7    0 unpainted, 1 floor, otherwise value + 2
    bits 8-14   operator state code
    bit 15      painted while shielded

State codes: 0 to 6 are the pure operators. 7 and up are blends, coded as 7 + a*7 + b.

## Adding an operator

Add an entry to `defs` in `src/operators.js`:

    { name: 'MIN', fn: (x, y) => Math.min(x, y), pin: null }

`fn` must return an integer in 0..127. `pin` is a value that makes its structure show, or `null`. Blend states, palette tables and the dev panel size themselves from the table. Palette lightness for pure operators is listed in `src/palette.js` and needs one more entry.

## Tuning

Everything is in `src/config.js`: wrap size, chunk size, margin, speed, set size and tick, operator gaps and chance, hit chances, shield length.

## Randomness

All randomness goes through `Logica.Rng`. `main.js` seeds it with `Date.now()`. Pass a fixed seed to make the rule changes repeatable for a given path.

## Known limits

- No collision. You walk through solid cells.
- The field repeats every 128 cells. The world does not, because the rules change between paintings.
- Some operator blends produce near-empty or near-solid fields.

// TODO: import V from ./vectors.js and everything else.

// TODO: uncomment when all is done.
// // --------------- Canvas section ---------------
// // Canvas.
// const cnv = document.getElementById('collider');
// const ctx = cnv.getContext('2d');
// const ctx.centre = (ctx) => V.Vector( (ctx.width / 2), (ctx.height / 2) );


// --------------- Creation section ---------------
const particlesArray = [];

// Create a particle.
const particlePush = (x, y, r, vx, vy) => particlesArray.push({
    coord: V.Vector( x, y ),
    radius: r,
    mass: ( r**3 * Math.PI * 4/3 ),
    velocity: V.Vector( vx, vy )
});

// Create a random particle.
const addRandomParticle = () => particlePush(
    rnd(ctx.width), rnd(ctx.height),
    rnd(2, 20),
    rnd(5, -5), rnd(5, -5)
);

// // Create a dot: a particle with radius = 0.5
// // TODO: Rename Dot.
// const randomDot = () => particlePush(
//     rnd(ctx.width), rnd(ctx.height),
//     0.5,
//     rnd(5, -5), rnd(5, -5)
// );

// // Create an array of n random dots.
// const dotsArray = [];

// const addRandomDots = (n) => {
//     for (let a = 0; a < n; a++) {
//         dotsArray.push(randomDot());
//     };
// };


// --------------- Movement section ---------------
// Moving is merely changing position.

const move = (pos, vel) => V.Add(pos, vel);

const moveAll = (arr) => {
    for (let p of arr) {
        p.coord = move( p.coord, p.velocity);
    };
};


// --------------- Forces section ---------------
// A force is a vector. TODO: take inputs from html.

// Friction coefficient.
let μ = 0.01;
// TODO: friction force is wrong.
// TODO: stop at treshold speed.
// const friction = (vel, k) => V.Mult(vel, -k);

// ----- Gravity subsection -----
// Gravitational constant.
// TODO: take as input.
const γ = 10**-2;

// Downwards gravity.
const downG = V.Vector( 0, γ );

// Centripetal gravity (like a black hole).
// Depends on current position of a particle.
// TODO: ctx.centre
const centreG = (pos) => V.Mult( V.Inv2P(pos, ctx.centre), γ );

// Universal gravity.
// |F| = γ * m1 * m2 / l^2
// TODO: to think: the force is reciprocal for both particles.
const univG = (a, b) => V.Mult( V.Inv2P(a, b), (γ * a.mass * b.mass) );


// --------------- Collisions section ---------------
// Collisions with borders.
const borderTouch = (p) => {
    if (( p.coord.x < 0 ) || ( p.coord.x > ctx.width )) { p.velocity.x *= -1; }
    if (( p.coord.y < 0 ) || ( p.coord.y > ctx.height )) { p.velocity.y *= -1; }
};

// Collisions with each other.
const twoParticlesInteract = (a, b) => {

    // Interaction vector.
    const interV = V.V2P( a.coord, b.coord ); // TODO: shouldn't it be b, a?
    const treshold = a.radius + b.radius;

    if ( V.Length(interV) <= treshold ) {
        // TODO: shouldn't a momentum be used here as well?

        // Un-stick the particles.
        // inV vector: how deep the particles have moved into each other.
        const inV = V.Mult( V.Unit(interV),
                            ((treshold + 1) - V.Length(interV)));

        // outV: a vector to move a particle out.
        const massRatio = 1 / (a.mass + b.mass);
        const outV = (p) => V.Mult(inV, (massRatio * p.mass) ); // TODO: check if particles get stuck.

        a.coord = move( a.coord, outV(b) );
        b.coord = move( b.coord, outV(a) );

        // Changing particles velocity after collision.
        const momentum = (p) => V.Mult( p.velocity, p.mass );
        const momentumProj = (p) => V.Proj( momentum(p), interV );
        const massesCentre = V.Add( momentum(a), momentum(b) );
        const massesCentreProj = V.Proj( massesCentre, interV );

        const newMomentumProj = (p) => V.Add( massesCentreProj, V.Neg(momentum(p)) );
        const newMomentum = (p) => V.Add( newMomentumProj(p), V.Norm(momentum(p), interV) );
        const newVelocity = (p) => V.Mult( newMomentum(p), (1 / p.mass) );

        a.velocity = newVelocity(a);
        b.velocity = newVelocity(b);
    }
};


// --------------- Inputs and events section ---------------

// ----- Buttons and sliders subsection -----
const addEventToTags = (className, tagName, event, f) => {

    const elems = document.getElementsByClassName(className);
    for (let el of elems) {

        const tags = el.getElementsByTagName(tagName);
        for (let t of tags) {
            t.addEventListener(event, f);
        }
    }
};

// Presets.
const idValueSet = (idElem, number) => document.getElementById(idElem).value = number;
const idChechedSet = (idElem, bool) => document.getElementById(idElem).checked = bool;

const setForces = (fr, dg, cg, ug, bd) => {
    idValueSet("frictionSlider", fr);
    idValueSet("downGravSlider", dg);
    idValueSet("centreGravSlider", cg);
    idValueSet("univGravSlider", ug);
    idChechedSet("bordersCheckbox", bd);
};

const applyPreset = (presetName) => {
    switch (presetName) {
    case "gas":
        setForces(0, 0, 0, 0, 1); break;
    case "planets":
        setForces(0, 0, 0, 9, 0); break;
    case "balls":
        setForces(5, 9, 0, 0, 1); break;
    case "billiards":
        setForces(1, 0, 0, 0, 1); break;
    }
};

// Sliders.
// TODO: the wheel acceleration does not work in all browsers. Rework.
const scroll = (e) => (
    e.target.valueAsNumber += ( e.deltaY / -Math.abs(e.deltaY) )
);
addEventToTags("slider", "input", "wheel", scroll);

// 'Random' button.
addEventToTags("button_add-random", "button", "click", addRandomParticle);

// TODO: Start/stop button.

// ----- Mouse controls subsection -----
// TODO.

// --------------- Actions section ---------------

// // The force changes the velocity of a particle.
// const accel = (f, p) => p.velocity = V.Add(f, p.velocity);

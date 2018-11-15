// TODO: import V from ./vectors.js and everything else.

// TODO: uncomment when all is done.
// // --------------- Canvas section ---------------
// // Canvas.
// const cnv = document.getElementById('collider');
// const ctx = cnv.getContext('2d');
// const ctx.centre = (ctx) => V.Vector( (ctx.width / 2), (ctx.height / 2) );


// --------------- Creation section ---------------
// Create a particle.
const particle = (x, y, r, vx, vy) => ({
    coord: V.Vector( x, y ),
    radius: r,
    mass: ( r**3 * Math.PI * 4/3 ),
    velocity: V.Vector( vx, vy )
});

// Create a random particle.
const randomParticle = () => particle(
    rnd(ctx.width), rnd(ctx.height),
    rnd(2, 20),
    rnd(5, -5), rnd(5, -5)
);

// Create an array of n random particles.
const particlesArray = [];

const addRandomParticles = (n) => {
    for (let a = 0; a < n; a++) {
        particlesArray.push(randomParticle());
    };
};

// Create a dot: a particle with radius = 0.5
// TODO: Rename Dot. Or something.
const randomDot = () => particle(
    rnd(ctx.width), rnd(ctx.height),
    0.5,
    rnd(5, -5), rnd(5, -5)
);

// Create an array of n random dots.
const dotsArray = [];

const addRandomDots = (n) => {
    for (let a = 0; a < n; a++) {
        dotsArray.push(randomDot());
    };
};


// --------------- Movement section ---------------
// Moving is merely changing position.

// TODO: make a proper 'move' function.
const moveP = (p, v) => ( p.coord = V.Add( p.coord, v ));

const moveAll = (arr) => {
    for (let p of arr) {
        moveP(p, p.velocity);
    };
};


// --------------- Forces section ---------------
// A force is a vector.

// Friction coefficient. TODO: take as input.
let fricK = 0.01;
// Friction force; depends on current velocity. TODO: stop at treshold speed.
const friction = (vel, k) => V.Mult(vel, -k);

// ----- Gravity subsection -----
// Gravitational constant.
// TODO: take as input.
const γ = 10**-2;

// Downwards gravity.
const downG = V.Vector( 0, γ );

// Centre-pointing gravity (like a black hole).
// Depends on current position of a particle.
// TODO: ctx.centre
const centreG = (pos) => V.Mult( V.Inv2P(pos, ctx.centre), γ );

// Universal gravity.
// F = γ * m1 * m2 / l^2
// TODO: the force is reciprocal for both particles.
const univG = (a, b) => V.Mult( V.Inv2P(a, b), (γ * a.mass * b.mass) );


// --------------- Collisions section ---------------
const twoParticlesInteract = (a, b) => {

    // Interaction vector.
    const interV = V.V2P( a.coord, b.coord ); // TODO: shouldn't it be b, a?
    const treshold = a.radius + b.radius;

    if ( V.Length(interV) <= treshold ) {
        // TODO: a momentum could be used here also. To think.
        const massRatio = 1 / (a.mass + b.mass);

        // Un-stuck the particles.
        // inV vector: how deep the particles have moved into each other.
        const inV = V.Mult( V.Unit(interV),
                            (treshold - V.Length(interV)) );
        // outV: a vector to move a particle out.
        const outV = (p) => V.Mult(inV, (massRatio * p.mass * 1.1) ); // TODO: check if particles get stuck.
        move(a.coord, outV(b)); // TODO: change to moveP.
        move(b.coord, outV(a));

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


// --------------- Actions section ---------------

// // The force changes the velocity of a particle.
// const accel = (f, p) => p.velocity = V.Add(f, p.velocity);

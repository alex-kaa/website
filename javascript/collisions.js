"use strict";

// --------------- Import section ---------------
import * as V from  "./vectors.js";
import * as F from "./useful-functions.js";


// --------------- Canvas section ---------------
// Canvas.
const cnv = document.getElementById('collider');
const ctx = cnv.getContext('2d');

const canvasSize = () => {

    if (( cnv.width !== F.html.clientWidth ) || ( cnv.height !== F.html.clientHeight )) {
        cnv.width = F.html.clientWidth,
        cnv.height = F.html.clientHeight,
        cnv.centre = V.Vector( (cnv.width / 2), (cnv.height / 2) );
    }
};


// --------------- Creation section ---------------
const particlesArray = [];

// const massesMatrix = [];        // Maybe later.

// Create a particle.
const particlePush = (x, y, r, vx, vy, clr) => {

    particlesArray.push(
        { coord: V.Vector( x, y ),
          radius: r,
          mass: ( r**3 * Math.PI * 4/3 ),
          velocity: V.Vector( vx, vy ),
          color: clr });
};

// Create a random particle.
const addRandomParticle = () => particlePush(
    F.rnd(cnv.width), F.rnd(cnv.height),
    F.rnd(3, 20),
    F.rnd(3, -3), F.rnd(3, -3),
    F.rndRGB()
);

// // Create a dot: a particle with radius = 0.5
// // TODO: Rename Dot.
// const randomDot = () => particlePush(
//     F.rnd(cnv.width), F.rnd(cnv.height),
//     0.5,
//     F.rnd(5, -5), F.rnd(5, -5),
//     F.rndRGB()
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
const moveParticle = (p) => p.coord = V.Add( p.coord, V.Mult(p.velocity, 1) );


// --------------- Forces section ---------------
// A force is a vector.

// Friction. Depends on velocity. TODO: still wrong.
const fricK = () => F.idNumberGet("frictionSlider") * 0.01;
const fricF = (vel) => V.Mult( vel, -fricK() );


// ----- Gravity subsection -----
// Downwards gravity.
const downK = () => F.idNumberGet("downGravSlider") * 0.01;
const downG = () => V.Vector( 0, downK() );


// Centripetal gravity (like a black hole).
// Depends on current position of a particle.
// TODO: goes wild when close to the centre.
// TODO: { x: NaN, y: NaN } when in the centre.
const centreK = () => F.idNumberGet("centreGravSlider") * 50;
const centreG = (pos) => V.Mult( V.InvSq2P(cnv.centre, pos),
                                 centreK() );

// Universal gravity.
// Depends on masses of particles and distance between them.
// |F| = γ * m1 * m2 / l^2
const univK = () => F.idNumberGet("univGravSlider") * 0.01;
const univG = (a, b) => V.Mult( V.InvSq2P(a.coord, b.coord),
                                ( univK() * a.mass * b.mass ));

// particlePush(151, 100, 20, 0, 0.125, "#0f0");
// particlePush(280, 105, 10, 0, -1, "#00f");


// ----- Applying forces -----
const applySimpleForces = (p) => (
    p.velocity = V.Sum( p.velocity,
                        fricF(p.velocity),
                        downG()
                        // centreG(p.coord)
                      )
);

const applyUnivG = (a, b) => (
    a.velocity = V.Add( a.velocity,
                        V.Neg( V.Mult( univG(a, b),
                                       (1 / a.mass)))),

    b.velocity = V.Add( b.velocity,
                        V.Mult( univG(a, b),
                                (1 / b.mass)))
);


// --------------- Collisions section ---------------
// Collisions with borders.
const borderTouch = (p) => {

    if ((p.coord.x - p.radius) < 0) {
        p.coord.x = p.radius;
        p.velocity.x *= -1;

    } else if ((p.coord.x + p.radius) > cnv.width) {
        p.coord.x = cnv.width - p.radius;
        p.velocity.x *= -1;
    }

    if ((p.coord.y - p.radius) < 0) {
        p.coord.y = p.radius;
        p.velocity.y *= -1;

    } else if ((p.coord.y + p.radius) > cnv.height) {
        p.coord.y = cnv.height - p.radius;
        p.velocity.y *= -1;
    }
};


// Collisions with each other.
// TODO: think of something interesting upon collision.
// TODO: see if using momenta would be better.
const twoParticlesInteract = (a, b) => {

    // Interaction vector.
    const interV = V.V2P( a.coord, b.coord );
    const threshold = a.radius + b.radius;
    const massRatio = (p) => ( p.mass / (a.mass + b.mass) );

    if ( V.Length(interV) < threshold ) {

        // Un-stick the particles.
        // inV vector: how deep the particles have penetrated into each other.
        const inV = V.Mult( V.Unit(interV),
                            (threshold - V.Length(interV)));

        // outV: a vector to move a particle out.
        const outV = (p) => V.Mult( inV, massRatio(p) );

        a.coord = V.Add( a.coord, outV(b) );
        b.coord = V.Add( b.coord, V.Neg( outV(a)) );

        // Changing velocities of particles after collision.
        const massesCentreV = V.Add( V.Mult( a.velocity, massRatio(a) ),
                                     V.Mult( b.velocity, massRatio(b) ));

        const massesCentreProj = V.Proj( massesCentreV, interV );

        const newVelocityProj = (p) => V.Sub( massesCentreProj,
                                              V.Proj(p.velocity, interV));

        const newVelocity = (p) => V.Sum( newVelocityProj(p),
                                          V.Norm( p.velocity, interV ),
                                          massesCentreProj);

        a.velocity = newVelocity(a);
        b.velocity = newVelocity(b);

    } else { applyUnivG(a, b); }

};


// --------------- Inputs and events section ---------------
// ----- Sidebar subsection -----
const sidebarOpen = (e) => {
    e.target.style.transform = "translateX(0%)";
    e.target.style.transition = "transform 0.5s";
    document.getElementById("sidebarHandle").innerHTML = "»";
};

const sidebarClose = (e) => {
    e.target.style.transform = "translateX(88%)";
    document.getElementById("sidebarHandle").innerHTML = "«";
};

F.addEventToId("sidebarControls", "mouseenter", sidebarOpen);
F.addEventToId("sidebarControls", "mouseleave", sidebarClose);


// ----- Buttons and sliders subsection -----
// Presets.
const setForces = (fr, dg, cg, ug, bd, tr) => {
    F.idValueSet("frictionSlider", fr);
    F.idValueSet("downGravSlider", dg);
    F.idValueSet("centreGravSlider", cg);
    F.idValueSet("univGravSlider", ug);
    F.idCheckedSet("bordersCheckbox", bd);
    F.idCheckedSet("trailCheckbox", tr);
};

const createPlanets = () => (
    particlePush( cnv.centre.x, cnv.centre.y,
                  50,
                  0, -0.016,
                  "yellow" ),

    particlePush( (cnv.centre.x + 100), cnv.centre.y,
                  5,
                  0, 7,
                  "red" ),

    particlePush( (cnv.centre.x + 150), cnv.centre.y,
                  5,
                  0, 6,
                  "blue" ),

    particlePush( (cnv.centre.x + 170), cnv.centre.y,
                  3,
                  0, 6,
                  "cyan" ),

    particlePush( (cnv.centre.x + 200), cnv.centre.y,
                  2,
                  0, 5.5,
                  "green" ),

    particlePush( (cnv.centre.x + 230), cnv.centre.y,
                  3,
                  0, 5.3,
                  "magenta" ),

    particlePush( (cnv.centre.x + 250), cnv.centre.y,
                  2,
                  0, 5,
                  "pink" )
);

const applyPreset = (e) => {

    switch (e.target.value) {
    case "gas":
        setForces(0, 0, 0, 0, 1, 0);
        if ( particlesArray.length < 20 ) {
            for (let n = 0; n < 20; n++) { addRandomParticle(); }
        };
        break;

    case "planets":
        particlesArray.length = 0;
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        setForces(0, 0, 0, 1, 0, 0);
        createPlanets();
        break;

    case "balls":
        setForces(5, 9, 0, 0, 1, 0); break;

    case "billiards":
        setForces(1, 0, 0, 0, 1, 0); break;
    }
};
F.addEventToTags("dropdown", "select", "click", applyPreset);

// Sliders.
// TODO: the wheel acceleration does not work in some browsers. Rework.
// TODO: remove default.
const scroll = (e) => (
    e.target.valueAsNumber += ( e.deltaY / -Math.abs(e.deltaY) )
);
F.addEventToTags("slider", "input", "wheel", scroll);

// 'Random' button.
F.addEventToTags("button_add-random", "button", "click", addRandomParticle);

// Start/stop button.
const startStopButton = (e) => {
    if (e.target.innerHTML === "Stop") { e.target.innerHTML = "Start"; }
    else { e.target.innerHTML = "Stop"; }
};
F.addEventToTags("button_start", "button", "click", startStopButton);


// ----- Mouse controls subsection -----
// TODO.


// --------------- Drawing section ---------------
const drawLine = (Ax, Ay, Bx, By, color) => (
    ctx.save(),
    ctx.strokeStyle = color,
    ctx.beginPath(),
    ctx.moveTo( Ax, Ay ),
    ctx.lineTo( Bx, By ),
    ctx.stroke(),
    ctx.restore
);

const drawV = (start, vector, color) => (
    drawLine(start.coord.x,
             start.coord.y,
             (start.coord.x + vector.x),
             (start.coord.y + vector.y),
             color)
);

const drawParticle = (p) => (
    ctx.save(),
    ctx.strokeStyle = p.color,
    ctx.fillStyle = p.color,
    ctx.beginPath(),
    ctx.arc(p.coord.x, p.coord.y, p.radius, Math.PI * 2, false),
    // ctx.rect(p.coord.x, p.coord.y, 1, 1),
    // ctx.stroke(),
    ctx.fill(),
    ctx.restore
);

const drawAll = () => {

    if ( !F.idCheckedGet("trailCheckbox") ) { ctx.clearRect(0, 0, cnv.width, cnv.height); }

    particlesArray.map(drawParticle);
};


// --------------- Action! ---------------
const applyAll = () => (
    F.combineByTwo(particlesArray, twoParticlesInteract),
    particlesArray.map(applySimpleForces),
    particlesArray.map(moveParticle)
);

const action = () => {
    if ( F.idCheckedGet("bordersCheckbox")) { particlesArray.map(borderTouch); }
    if ( F.innerHtmlGet("button_start", "button") === "Stop" ) { applyAll(); }

    canvasSize();
    drawAll();
    window.requestAnimationFrame(action);
};
action();

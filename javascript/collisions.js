// --------------- Things for testing section ---------------
// --------------- Things for testing section ---------------
// --------------- Things for testing section ---------------
// --------------- Things for testing section ---------------
// TODO: export
// Randomising functions.
const rnd = (max, min = 0) => ( (Math.random() * (max - min)) + min );

const rndColor = () => Math.floor(rnd(255));

const rndRGB = () => (
    'rgb( ' + rndColor() + ', ' + rndColor() + ', ' + rndColor() + ' )'
);

const combineByTwo = (arr, f) => {
    for (let n = 0; n < arr.length; n++) {
        for (let m = (n + 1); m < arr.length; m++) {
            f( arr[n], arr[m] );
        };
    };
};

// Working with DOM.
const addEventToTags = (className, tagName, event, f) => {

    const classes = document.getElementsByClassName(className);
    for (let el of classes) {

        const tags = el.getElementsByTagName(tagName);
        for (let t of tags) {
            t.addEventListener(event, f);
        }
    }
};

const removeEventFromTags = (className, tagName, event, f) => {

    const classes = document.getElementsByClassName(className);
    for (let el of classes) {

        const tags = el.getElementsByTagName(tagName);
        for (let t of tags) {
            t.removeEventListener(event, f);
        }
    }
};

const idValueGet = (idElem) => document.getElementById(idElem).value;
const idNumberGet = (idElem) => document.getElementById(idElem).valueAsNumber;
const idCheckedGet = (idElem) => document.getElementById(idElem).checked;

const idValueSet = (idElem, value) => document.getElementById(idElem).value = value;
const idCheckedSet = (idElem, bool) => document.getElementById(idElem).checked = bool;

const innerHtmlGet = (className, tagName) => {

    const classes = document.getElementsByClassName(className);
    for (let el of classes) {

        const tags = el.getElementsByTagName(tagName);
        for (let t of tags) {
            return t.innerHTML;
        }
    }
};

const innerHtmlSet = (className, tagName, text) => {

    const classes = document.getElementsByClassName(className);
    for (let el of classes) {

        const tags = el.getElementsByTagName(tagName);
        for (let t of tags) {
            t.innerHTML = text;
        }
    }
};

// const ctx = { width: 300, height: 300 };
// ctx.centre = (ctx) => V.Vector( (ctx.width / 2), (ctx.height / 2) );

// --------------- Vectors section ---------------
const V = {
    // ---------- Creating vectors.
    // Create a vector from 2 coordinates.
    Vector: (x, y) => ({ x: x, y: y }),

    // Vector length and direction.
    Length: (v) => Math.hypot(v.x, v.y),
    Dir: (v) => Math.atan(v.y / v.x),

    // Vector from direction (in radians) and length.
    VfromDL: (dir, len) => V.Vector( ( Math.cos(dir) * len ),
                                     ( Math.sin(dir) * len ) ),

    // ---------- Simple operations.
    // Addition: V̅1 + V̅2 => V̅3.
    Add: (v, u) => V.Vector( (v.x + u.x), (v.y + u.y) ),

    Sum: (...v) => {
        let temp = V.Vector(0, 0);
        for (let n = 0; n < v.length; n++) {
            temp = V.Add( temp, v[n] );
        }
        return temp;
    },

    // Subtraction: V̅1 - V̅2 => V̅3. TODO: wrong! Fix.
    Sub: (v, u) => V.Vector( (v.x - u.x), (v.y - u.y)),

    // Create a vector between 2 points.
    // V2P( A, B ) => A̅B̅
    V2P: (posA, posB) => V.Sub(posA, posB),

    // Multiplication: V̅1 × C => V̅2.
    Mult: (v, c) => V.Vector( (v.x * c), (v.y * c) ),

    // Opposite vector of equal length.
    Neg: (v) => V.Mult(v, -1),

    // Unit vector (Length = 1).
    // U̅ = V̅ / |V̅|
    Unit: (v) => {        // TODO: special case where V.Length(v) = 0.
        if (V.Length(v) === 0) { return V.Vector(0, 0); }
        else { return V.Mult( v, (1 / V.Length(v)) ); }
    },


    // ---------- Inverse-square.
    // Inverse-square vector.
    // I̅ = V̅ / |V̅|^2
    // TODO: special case where V.Length(v) = 0. Check.
    Inv: (v) => V.Mult( V.Unit(v),
                        (1 / (V.Length(v))**2) ),


    // V.Mult(V.Unit(particlesArray[0].coord),
           // (1 / (V.Length(particlesArray[0].coord))**2));

    // {
    //     if (V.Length(v) <= 10) { return V.Vector(0, 0); }
    //     else { return V.Mult( V.Unit(v), (1 / (V.Length(v) + 1))**2 ); }
    // },


    // Inverse-square vector between two points.
    // TODO: special case where V.Length(v) = 0.
    Inv2P: (posA, posB) => V.Inv( V.V2P(posA, posB)),


    // ---------- Dot product and projections.
    // Dot product: U̅ × V̅ => C.
    Dot: (v, u) => ( v.x * u.x + v.y * u.y ),

    // Projection of V̅ onto U̅.
    Proj: (v, u) => V.Mult( V.Inv(u), V.Dot(v, u) ),
    // Normal to projection of V̅ onto U̅.
    Norm: (v, u) => V.Sub( v, V.Proj(v, u) )
    // Proj(v, u) ⟂ Norm(v, u).
    // Proj(v, u) + Norm(v, u) = v̅.

};
// --------------- Things for testing section ---------------
// --------------- Things for testing section ---------------
// --------------- Things for testing section ---------------
// --------------- Things for testing section ---------------



// TODO: import V from ./vectors.js and everything else.

// --------------- Canvas section ---------------
// Canvas.
const cnv = document.getElementById('collider');
const ctx = cnv.getContext('2d');
ctx.width = cnv.width;
ctx.height = cnv.height;
ctx.centre = V.Vector( (ctx.width / 2), (ctx.height / 2) );


// --------------- Creation section ---------------
const particlesArray = [];

// Create a particle.
const particlePush = (x, y, r, vx, vy, clr) => particlesArray.push({
    coord: V.Vector( x, y ),
    radius: r,
    mass: ( r**3 * Math.PI * 4/3 ),
    velocity: V.Vector( vx, vy ),
    color: clr
});

// Create a random particle.
const addRandomParticle = () => particlePush(
    rnd(ctx.width), rnd(ctx.height),
    rnd(3, 20),
    rnd(1, -1), rnd(1, -1),
    rndRGB()
);

// // Create a dot: a particle with radius = 0.5
// // TODO: Rename Dot.
// const randomDot = () => particlePush(
//     rnd(ctx.width), rnd(ctx.height),
//     0.5,
//     rnd(5, -5), rnd(5, -5),
//     rndRGB()
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

// Friction and downG seem to be fine;
// TODO: centreG and univG go wild.

// Friction. Depends on velocity. TODO: still wrong (or not? to check).
const fricK = () => idNumberGet("frictionSlider") * 0.01;
const fricF = (vel) => V.Mult( vel, -fricK() );

// ----- Gravity subsection -----
// Downwards gravity.
const downK = () => idNumberGet("downGravSlider") * 0.01;
const downG = () => V.Vector( 0, downK() );


// Centripetal gravity (like a black hole).
// Depends on current position of a particle.
// TODO: goes wild when close to the centre.
const centreK = () => idNumberGet("centreGravSlider") * 50;
const centreG = (pos) => V.Mult( V.Inv2P(ctx.centre, pos),
                                 centreK() );

// Universal gravity.
// Depends on masses of particles and distance between them.
// |F| = γ * m1 * m2 / l^2
const univK = () => idNumberGet("univGravSlider") * 100;
const univG = (a, b) => V.Mult( V.Inv2P(a.coord, b.coord),
                                ( univK() * a.mass * b.mass ));

particlePush(152, 153, 20, 0, 0, "#0f0");
particlePush(272, 152, 10, 0, -2, "#00f");


// ----- Applying forces -----
const applySimpleForces = (p) => (
    p.velocity = V.Sum( p.velocity,
                        fricF(p.velocity),
                        downG(),
                        centreG(p.coord))
);

const applyUnivG = (a, b) => (
    a.velocity = V.Add( a.velocity,
                        V.Neg( V.Mult( univG(a, b),
                                       (1 / (a.mass**2))))),

    b.velocity = V.Add( b.velocity,
                        V.Mult( univG(a, b),
                                (1 / (b.mass**2))))
);


// --------------- Collisions section ---------------
// Collisions with borders.
const borderTouch = (p) => {

    if ((p.coord.x - p.radius) < 0) {
        p.coord.x = p.radius;
        p.velocity.x *= -1;

    } else if ((p.coord.x + p.radius) > ctx.width) {
        p.coord.x = ctx.width - p.radius;
        p.velocity.x *= -1;
    }

    if ((p.coord.y - p.radius) < 0) {
        p.coord.y = p.radius;
        p.velocity.y *= -1;

    } else if ((p.coord.y + p.radius) > ctx.height) {
        p.coord.y = ctx.height - p.radius;
        p.velocity.y *= -1;
    }
};


// Collisions with each other.
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

        // console.log("V.Norm( a.velocity, interV )", V.Norm( a.velocity, interV ));
        // console.log("V.Norm( b.velocity, interV )", V.Norm( b.velocity, interV ));
        
        // console.log("massesCentreV", massesCentreV);
        // console.log("massesCentreProj", massesCentreProj);

        // console.log("newVelocityProj(a)", newVelocityProj(a));
        // console.log("newVelocityProj(b)", newVelocityProj(b));

        // console.log("newVelocity(a)", newVelocity(a));
        // console.log("newVelocity(b)", newVelocity(b));
        
        a.velocity = newVelocity(a);
        b.velocity = newVelocity(b);

    }
};


// --------------- Inputs and events section ---------------
// ----- Buttons and sliders subsection -----
// Presets.
const setForces = (fr, dg, cg, ug, bd) => {
    idValueSet("frictionSlider", fr);
    idValueSet("downGravSlider", dg);
    idValueSet("centreGravSlider", cg);
    idValueSet("univGravSlider", ug);
    idCheckedSet("bordersCheckbox", bd);
};

const applyPreset = (e) => {
    switch (e.target.value) {
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
addEventToTags("dropdown", "select", "click", applyPreset);

// Sliders.
// TODO: the wheel acceleration does not work in all browsers. Rework.
// TODO: remove default.
const scroll = (e) => (
    e.target.valueAsNumber += ( e.deltaY / -Math.abs(e.deltaY) )
);
addEventToTags("slider", "input", "wheel", scroll);

// 'Random' button.
addEventToTags("button_add-random", "button", "click", addRandomParticle);

// Start/stop button.
const startStopButton = (e) => {
    if (e.target.innerHTML === "Stop") { e.target.innerHTML = "Start"; }
    else { e.target.innerHTML = "Stop"; }
};
addEventToTags("button_start", "button", "click", startStopButton);


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
    ctx.fillStyle = p.color,
    ctx.beginPath(),
    ctx.arc(p.coord.x, p.coord.y, p.radius, Math.PI * 2, false),
    ctx.fill(),
    ctx.restore
);

const drawAll = () => {
    if ( !idCheckedGet("trailCheckbox") ) { ctx.clearRect(0, 0, ctx.width, ctx.height); }
    particlesArray.map(drawParticle);
};

const drawCentre = () => (      // TEST
    ctx.save(),
    ctx.fillStyle = "#fff",
    ctx.beginPath(),
    ctx.rect(150, 150, 1, 1),
    ctx.fill(),
    ctx.restore
);


// --------------- Action! ---------------
const applyAll = () => (

    combineByTwo(particlesArray, twoParticlesInteract),

    particlesArray.map(applySimpleForces),
    combineByTwo(particlesArray, applyUnivG),

    particlesArray.map(moveParticle),

    drawAll()
);

const action = () => {
    if ( idCheckedGet("bordersCheckbox")) { particlesArray.map(borderTouch); }
    if ( innerHtmlGet("button_start", "button") === "Stop" ) { applyAll(); }
    drawAll();
    drawCentre();               // TEST
    window.requestAnimationFrame(action);
};
action();

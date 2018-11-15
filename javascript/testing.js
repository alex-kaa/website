// --------------- Things for testing ---------------

const ctx = { width: 300, height: 300 };
ctx.centre = (ctx) => V.Vector( (ctx.width / 2), (ctx.height / 2) );
const rnd = (max, min = 0) => ( (Math.random() * (max - min)) + min );

const V = {
    // ---------- Creating vectors.
    // Create a vector from 2 coordinates.
    Vector: (x, y) => ({ x: x, y: y }),

    // Create a vector between 2 points.
    // V2P( A, B ) => A̅B̅
    V2P: (a, b) => V.Vector( (b.x - a.x), (b.y - a.y) ),

    // Vector length and direction.
    Length: (v) => Math.hypot(v.x, v.y),
    Dir: (v) => Math.atan(v.y / v.x),

    // Vector from direction (in radians) and length.
    VofDL: (dir, len) => V.Vector( ( Math.cos(dir) * len ),
                                        ( Math.sin(dir) * len ) ),

    // ---------- Simple operations.
    // Addition: V̅1 + V̅2 => V̅3.
    Add: (v, u) => V.Vector( (v.x + u.x), (v.y + u.y) ),

    // Subtraction: V̅1 - V̅2 => V̅3.
    Sub: (v, u) => V.V2P(u, v),

    // Multiplication: V̅1 × C => V̅2.
    Mult: (v, c) => V.Vector( (v.x * c), (v.y * c) ),

    // Opposite vector of equal length.
    Neg: (v) => V.Mult(v, -1),

    // Unit vector (Length = 1).
    // U̅ = V̅ / |V̅|
    Unit: (v) => V.Mult( v, (1 / V.Length(v)) ),


    // ---------- Inverse-square.
    // Inverse-square vector.
    // I̅ = V̅ / |V̅|^2
    Inv: (v) => V.Mult( v, (1 / V.Length(v))**2 ),

    // Inverse-square vector between two points.
    Inv2P: (a, b) => V.Inv( V.V2P(a, b)),


    // ---------- Dot product and projections.
    // Dot product: V̅1 × V̅2 => C.
    Dot: (v, u) => ( v.x * u.x + v.y * u.y ),

    // Projection of V̅ onto U̅.
    Proj: (v, u) => V.Mult( V.Inv(u), V.Dot(v, u) ),
    // Normal to projection of V̅ onto U̅.
    Norm: (v, u) => V.Sub( v, V.Proj(v, u) )
    // Proj(v, u) ⟂ Norm(v, u).
    // Proj(v, u) + Norm(v, u) = v̅.
};

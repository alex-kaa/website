// TODO: wrap the whole thing in curly brackets.
// export default {};

// A vector is an object of the form { x: x-coordinate, y: y-coordinate }.


// ---------- Creating vectors.
// Create a vector from 2 coordinates.
const Vector = (x, y) => ({ x: x, y: y });

// Create a vector between 2 points.
// V2P( A, B ) => A̅B̅
const V2P = (a, b) => Vector( (b.x - a.x), (b.y - a.y) );

// Vector length and direction.
const Length = (v) => Math.hypot(v.x, v.y);
const Dir = (v) => Math.atan(v.y / v.x);

// Vector from direction (in radians) and length.
const VofDL = (dir, len) => Vector( ( Math.cos(dir) * len ),
                                  ( Math.sin(dir) * len ) );

// ---------- Simple operations.
// Addition: V̅1 + V̅2 => V̅3.
const Add = (v, u) => Vector( (v.x + u.x), (v.y + u.y) );

// Subtraction: V̅1 - V̅2 => V̅3.
const Sub = (v, u) => V2P(u, v);

// Multiplication: V̅1 × C => V̅2.
const Mult = (v, c) => Vector( (v.x * c), (v.y * c) );

// Opposite vector of equal length.
const Neg = (v) => Mult(v, -1);

// Unit vector (Length = 1).
// U̅ = V̅ / |V̅|
const Unit = (v) => Mult( v, (1 / Length(v)) );


// ---------- Inverse-square.
// Inverse-square vector.
// I̅ = V̅ / |V̅|^2
const Inv = (v) => Mult( v, (1 / Length(v))**2 );

// Inverse-square vector between two points.
const Inv2P = (a, b) => Inv( V2P(a, b));


// ---------- Dot product and projections.
// Dot product: V̅1 × V̅2 => C.
const Dot = (v, u) => ( v.x * u.x + v.y * u.y );

// Projection of V̅ onto U̅.
const Proj = (v, u) => Mult( Inv(u), Dot(v, u) );
// Normal to projection of V̅ onto U̅.
const Norm = (v, u) => Sub( v, Proj(v, u) );
// Proj(v, u) ⟂ Norm(v, u).
// Proj(v, u) + Norm(v, u) = v̅.

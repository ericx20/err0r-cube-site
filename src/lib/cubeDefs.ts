// ----- FACES AND MOVES -----

export const FACES = ["R", "L", "U", "D", "F", "B"] as const
export type Face = typeof FACES[number]
export type Facelet = Face | "O" | "X"
export type IndexedFacelet = number // int from 0 to 53, represents a facelet
export type FaceletIndex = number // int from 0 to 53, represents a facelet's location
export type Move = `${Face}${"'" | "2" | ""}`
export type Alg = Array<Move>
export type Perm<T = number> = [T, T]
export type Piece = Exclude<`${"U" | "D" | ""}${"F" | "B" | ""}${"R" | "L" | ""}`, "">


// ----- CUBE STATE REPRESENTATIONS -----

// FaceletCube represents the state of the cube based on the coloured tiles
// (a.k.a. "facelets").
// FaceletCube is an array of 54 facelet colours.
// The order of the facelet colours is the same as reading a standard cube net
// from left to right
export type FaceletCube = Array<Facelet>

// IndexedFaceletCube is like FaceletCube, but we label each facelet not by its
// colour but by its solved position's index, which is unique
// This lets us distinguish between facelets of the same colour, and talk about
// specific facelet positions on the cube.
// IndexedFaceletCube is an array of 54 numbers, each number is within 0 to 53.
export type IndexedFaceletCube = Array<IndexedFacelet>

export type Cube = FaceletCube | IndexedFaceletCube

// The order of edges is the same as reading a standard cube net from left to right
// UB, UL, UR, UF, BL, FL, FR, BR, DF, DL, DR, DB
export type EO = Array<boolean>

export interface Mask {
  solvedFaceletIndices: Readonly<Array<IndexedFacelet>>
  eoFaceletIndices: Readonly<Array<IndexedFacelet>>
}

// ----- SOLVER -----
export interface SolverConfig {
  moveset: Readonly<Array<Move>>
  // TODO
}
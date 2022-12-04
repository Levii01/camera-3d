import { sin, cos, getWindowSize, getWidth, getHeight } from "./util";

const cameraMove = (x, y, z) => [
  [1, 0, 0, x],
  [0, 1, 0, y],
  [0, 0, 1, z],
  [0, 0, 0, 1],
];

const cameraRotateX = (x) => [
  [1, 0, 0, 0],
  [0, cos(x), sin(x), 0],
  [0, -sin(x), cos(x), 0],
  [0, 0, 0, 1],
];

const cameraRotateY = (x) => [
  [cos(x), 0, -sin(x), 0],
  [0, 1, 0, 0],
  [sin(x), 0, cos(x), 0],
  [0, 0, 0, 1],
];

const cameraRotateZ = (x) => [
  [cos(x), sin(x), 0, 0],
  [-sin(x), cos(x), 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];

const cameraZoom = (s) => [
  [s, 0, 0, 0],
  [0, s, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];

export const mvp = () => {
  const [nx, ny] = getWindowSize();
  return [
    [nx / 2, 0, 0, (nx - 1) / 2],
    [0, ny / 2, 0, (ny - 1) / 2],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
};

export const mper = ({ l, r, b, t, n, f }) => [
  [(2 * n) / (r - l), 0, (l + r) / (l - r), 0],
  [0, (2 * n) / (t - b), (b + t) / (b - t), 0],
  [0, 0, (f + n) / (n - f), (2 * f * n) / (f - n)],
  [0, 0, 1, 0],
];

export const orthViewVolume = {
  l: -getWidth() / 2, // left
  r: getWidth() / 2, // right
  b: -getHeight() / 2, // bottom
  t: getHeight() / 2, // top
  n: -900, // near,
  f: -1000, // far
};

export const morth = ({ l, r, b, t, n, f }) => [
  [2 / (r - l), 0, 0, (r + l) / (l - r)],
  [0, 2 / (t - b), 0, (t + b) / (b - t)],
  [0, 0, 2 / (n - f), (n + f) / (f - n)],
  [0, 0, 0, 1],
];

export const makeMove = (key) => {
  switch (key) {
    case "W": return cameraMove(0, 0, 1);
    case "S": return cameraMove(0, 0, -1);
    case "A": return cameraMove(1, 0, 0);
    case "D": return cameraMove(-1, 0, 0);
    case "R": return cameraMove(0, 1, 0);
    case "F": return cameraMove(0, -1, 0);

    case "+": return cameraZoom(2);
    case "-": return cameraZoom(0.5);

    case "ARROWUP": return cameraRotateX(-0.1);
    case "ARROWDOWN": return cameraRotateX(0.1);
    case "ARROWLEFT": return cameraRotateY(0.1);
    case "ARROWRIGHT": return cameraRotateY(-0.1);
    case "[": return cameraRotateZ(0.1);
    case "]": return cameraRotateZ(-0.1);
    default: return false;
  }
}

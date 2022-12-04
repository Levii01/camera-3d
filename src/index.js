import "./index.css";
import { multiply } from "./scripts/matrix";
import { getHeight, getWidth } from "./scripts/util";
import { makeMove, mper, mvp, orthViewVolume } from "./scripts/camera";
import { buildCube, cubeCenterPoint } from "./scripts/cube";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const setCanvasDimensions = () => {
  canvas.width = getWidth();
  canvas.height = getHeight();
};

window.addEventListener("resize", () => {
  setCanvasDimensions();
  render();
});
setCanvasDimensions();

let cubes = [
  ...buildCube(4, [-3, -1, -14]),
  ...buildCube(2, [-4, 0, -11]),
  ...buildCube(2, [-4, -2, -11]),

  ...buildCube(2, [2, 0, -11]),
  ...buildCube(2, [2, 0, -14]),
  ...buildCube(2, [2, -2, -14]),

  ...buildCube(2, [6, 0, -14]),
  ...buildCube(2, [6, 0, -11]),
];

const Mper = mper(orthViewVolume);
const len = ([x, y, z]) => Math.sqrt(x * x + y * y + z * z);

const renderCubes = (M, face, color) => {
  const [xa, ya, , wa] = multiply(M, face[0]);
  const [xb, yb, , wb] = multiply(M, face[1]);
  const [xc, yc, , wc] = multiply(M, face[2]);
  const [xd, yd, , wd] = multiply(M, face[3]);

  ctx.beginPath();
  ctx.moveTo(xa / wa, ya / wa);
  ctx.lineTo(xb / wb, yb / wb);
  ctx.lineTo(xc / wc, yc / wc);
  ctx.lineTo(xd / wd, yd / wd);
  ctx.fillStyle = color;
  ctx.fill();
}

const render = () => {
  const Mvp = mvp();
  const M = multiply(Mvp, Mper);
  cubes = cubes.sort((a, b) => {
    const ap = cubeCenterPoint(a.face);
    const bp = cubeCenterPoint(b.face);
    return len(ap) > len(bp) ? -1 : 1;
  });
  cubes.forEach(({ face, color }) => { renderCubes(M, face, color) });
};

const transformMatrix = (M) => {
  ctx.clearRect(0, 0, getWidth(), getHeight());

  for (let i = 0; i < cubes.length; i++)
    cubes[i].face = cubes[i].face.map((x) => multiply(M, x));

  requestAnimationFrame(render);
};

window.addEventListener("keydown", (e) => {
  let move = makeMove(e.key.toUpperCase());
  if (move == false) { return }

  transformMatrix(move)
});

render();

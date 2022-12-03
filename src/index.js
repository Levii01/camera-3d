"use strict";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const getHeight = () => window.innerHeight;
const getWidth = () => window.innerWidth;
const getWindowSize = () => [
    getWidth(),
    getHeight()
];

const setCanvasDimensions = () => {
    canvas.width = getWidth();
    canvas.height = getHeight();
};

window.addEventListener("resize", () => {
    setCanvasDimensions();
    render();
});
setCanvasDimensions();

const renderLine = ([xa, ya], [xb, yb]) => {
    ctx.beginPath();
    ctx.moveTo(xa, ya);
    ctx.lineTo(xb, yb);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'white';
    ctx.stroke();
};

const multiply = (A, B) => {
    const [ma, mb, na] = [A.length, B.length, A[0].length];
    if (na !== mb) throw new Error('matrix from mult wrong sizes!');
    const C = new Array(ma);

    if (Array.isArray(B[0])) {
        const nb = B[0].length;
        for (let i=0; i<ma; i++) C[i] = new Array(nb).fill(0);

        for (let i=0; i<ma; i++)
            for (let j=0; j<nb; j++)
                for (let k=0; k<na; k++)
                    C[i][j] += A[i][k]*B[k][j];
    } else {
        C.fill(0);
        for (let i=0; i<ma; i++)
            for (let k=0; k<na; k++)
                C[i] += A[i][k]*B[k];
    }


    return C;
};

// normalize
const cube = [
    [[-3, -1, -10, 1], [-1, -1, -10, 1]],
    [[-3, -1, -10, 1], [-3, 1, -10, 1]],
    [[-3, -1, -10, 1], [-3, -1, -12, 1]],
    [[-1, -1, -10, 1], [-1, -1, -12, 1]],
    [[-1, -1, -10, 1], [-1, 1, -10, 1]], //
    [[-1, -1, -12, 1], [-3, -1, -12, 1]],
    [[-1, -1, -12, 1], [-1, 1, -12, 1]],
    [[-3, 1, -10, 1], [-1, 1, -10, 1]], //
    [[-3, -1, -12, 1], [-3, 1, -12, 1]],
    [[-3, 1, -10, 1], [-3, 1, -12, 1]],
    [[-3, 1, -12, 1], [-1, 1, -12, 1]],
    [[-1, 1, -12, 1], [-1, 1, -10, 1]], //
    [[1, -1, -10, 1], [3, -1, -10, 1]],
    [[1, -1, -10, 1], [1, 1, -10, 1]],
    [[1, -1, -10, 1], [1, -1, -12, 1]],
    [[3, -1, -10, 1], [3, -1, -12, 1]],
    [[3, -1, -10, 1], [3, 1, -10, 1]],
    [[3, -1, -12, 1], [1, -1, -12, 1]],
    [[3, -1, -12, 1], [3, 1, -12, 1]],
    [[1, 1, -10, 1], [3, 1, -10, 1]],
    [[1, -1, -12, 1], [1, 1, -12, 1]],
    [[1, 1, -10, 1], [1, 1, -12, 1]],
    [[1, 1, -12, 1], [3, 1, -12, 1]],
    [[3, 1, -12, 1], [3, 1, -10, 1]], //
    [[-3, -1, -13, 1], [-1, -1, -13, 1]],
    [[-3, -1, -13, 1], [-3, 1, -13, 1]],
    [[-3, -1, -13, 1], [-3, -1, -15, 1]],
    [[-1, -1, -13, 1], [-1, -1, -15, 1]],
    [[-1, -1, -13, 1], [-1, 1, -13, 1]],
    [[-1, -1, -15, 1], [-3, -1, -15, 1]],
    [[-1, -1, -15, 1], [-1, 1, -15, 1]],
    [[-3, 1, -13, 1], [-1, 1, -13, 1]],
    [[-3, -1, -15, 1], [-3, 1, -15, 1]],
    [[-3, 1, -13, 1], [-3, 1, -15, 1]],
    [[-3, 1, -15, 1], [-1, 1, -15, 1]],
    [[-1, 1, -15, 1], [-1, 1, -13, 1]], //
    [[1, -1, -13, 1], [3, -1, -13, 1]],
    [[1, -1, -13, 1], [1, 1, -13, 1]],
    [[1, -1, -13, 1], [1, -1, -15, 1]],
    [[3, -1, -13, 1], [3, -1, -15, 1]],
    [[3, -1, -13, 1], [3, 1, -13, 1]],
    [[3, -1, -15, 1], [1, -1, -15, 1]],
    [[3, -1, -15, 1], [3, 1, -15, 1]],
    [[1, 1, -13, 1], [3, 1, -13, 1]],
    [[1, -1, -15, 1], [1, 1, -15, 1]],
    [[1, 1, -13, 1], [1, 1, -15, 1]],
    [[1, 1, -15, 1], [3, 1, -15, 1]],
    [[3, 1, -15, 1], [3, 1, -13, 1]], //
];

// orthocraphic view volume based on camera coord system
const orthViewVolume = {
    l: -getWidth()/2, // left
    r: getWidth()/2, // right
    b: -getHeight()/2, // bottom
    t: getHeight()/2, // top
    n: -900, // near,
    f: -1000 // far
};

// orthographic to canonical view volume (matrix)
const morth = ({ l, r, b, t, n, f }) => [
    [2/(r-l), 0, 0, (r+l)/(l-r)],
    [0, 2/(t-b), 0, (t+b)/(b-t)],
    [0, 0, 2/(n-f), (n+f)/(f-n)],
    [0, 0, 0, 1]
];

// viewport transformation matrix
const mvp = () => {
    const [nx, ny] = getWindowSize();
    return [
        [nx/2, 0, 0, (nx-1)/2],
        [0, ny/2, 0, (ny-1)/2],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
};

// perspective to cannonical view volume (matrix)
const mper = ({ l, r, b, t, n, f }) => [
    [2*n/(r-l), 0, (l+r)/(l-r), 0],
    [0, 2*n/(t-b), (b+t)/(b-t), 0],
    [0, 0, (f+n)/(n-f), 2*f*n/(f-n)],
    [0, 0, 1, 0]
];

const Morth = morth(orthViewVolume);
const Mper = mper(orthViewVolume);

const render = () => {
    const Mvp = mvp();
    const M = multiply(Mvp, Mper);
    cube.forEach(v => {
        const [xp, yp, zp, wp] = multiply(M, v[0]);
        const [xq, yq, zq, wq] = multiply(M, v[1]);
        renderLine([xp/wp, yp/wp], [xq/wq, yq/wq]);
    })
};

const transform = M => {
    ctx.clearRect(0, 0, getWidth(), getHeight());

    for (let i=0; i<cube.length; i++) {
        cube[i][0] = multiply(M, cube[i][0]);
        cube[i][1] = multiply(M, cube[i][1]);
    }

    requestAnimationFrame(render);
};

const sin = x => Math.sin(x);
const cos = x => Math.cos(x);

const mtrans = (x, y, z) => [
    [1, 0, 0, x],
    [0, 1, 0, y],
    [0, 0, 1, z],
    [0, 0, 0, 1]
];

const mrotateX = x => [
    [1, 0, 0, 0],
    [0, cos(x), sin(x), 0],
    [0, -sin(x), cos(x), 0],
    [0, 0, 0, 1]
];

const mrotateY = x => [
    [cos(x), 0, -sin(x), 0],
    [0, 1, 0, 0],
    [sin(x), 0, cos(x), 0],
    [0, 0, 0, 1]
];

const mrotateZ = x => [
    [cos(x), sin(x), 0, 0],
    [-sin(x), cos(x), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
];

const mzoom = s => [
    [s, 0, 0, 0],
    [0, s, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
];

window.addEventListener("keydown", e => {
    if (e.key.toUpperCase() === "A") transform(mtrans(1, 0, 0));
    else if (e.key.toUpperCase() === "D") transform(mtrans(-1, 0, 0));
    else if (e.key.toUpperCase() === "W") transform(mtrans(0, 1, 0));
    else if (e.key.toUpperCase() === "S") transform(mtrans(0, -1, 0));
    else if (e.key.toUpperCase() === "Q") transform(mzoom(2));
    else if (e.key.toUpperCase() === "E") transform(mzoom(0.5));
    else if (e.key.toUpperCase() === "X") transform(mrotateX(0.01));
    else if (e.key.toUpperCase() === "Y") transform(mrotateY(0.01));
    else if (e.key.toUpperCase() === "Z") transform(mrotateZ(0.01));;
});

render();

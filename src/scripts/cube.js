export const buildCube = (edgeLength, centrePoint) => {
  const [x, y, z] = centrePoint;
  const l = edgeLength / 2;
  return [
    {
      color: "#ffffff",
      face: [
        [x + l, y + l, z + l, 1],
        [x + l, y - l, z + l, 1],
        [x - l, y - l, z + l, 1],
        [x - l, y + l, z + l, 1],
      ],
    },
    {
      color: "#008080",
      face: [
        [x + l, y + l, z + l, 1],
        [x + l, y - l, z + l, 1],
        [x + l, y - l, z - l, 1],
        [x + l, y + l, z - l, 1],
      ],
    },
    {
      color: "#800080",
      face: [
        [x + l, y + l, z + l, 1],
        [x + l, y + l, z - l, 1],
        [x - l, y + l, z - l, 1],
        [x - l, y + l, z + l, 1],
      ],
    },
    {
      color: "#808000",
      face: [
        [x + l, y - l, z + l, 1],
        [x + l, y - l, z - l, 1],
        [x - l, y - l, z - l, 1],
        [x - l, y - l, z + l, 1],
      ],
    },
    {
      color: "#808080",
      face: [
        [x + l, y + l, z - l, 1],
        [x + l, y - l, z - l, 1],
        [x - l, y - l, z - l, 1],
        [x - l, y + l, z - l, 1],
      ],
    },
    {
      color: "#0000FF",
      face: [
        [x - l, y + l, z + l, 1],
        [x - l, y - l, z + l, 1],
        [x - l, y - l, z - l, 1],
        [x - l, y + l, z - l, 1],
      ],
    },
  ];
};

export const cubeCenterPoint = ([a, , c]) => [
  (a[0] + c[0]) / 2,
  (a[1] + c[1]) / 2,
  (a[2] + c[2]) / 2,
];

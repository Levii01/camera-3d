export const multiply = (A, B) => {
  const [ma, mb, na] = [A.length, B.length, A[0].length];
  if (na !== mb) throw new Error("Wrong size of matrix!");
  const C = new Array(ma);

  if (Array.isArray(B[0])) {
    const nb = B[0].length;
    for (let i = 0; i < ma; i++) C[i] = new Array(nb).fill(0);

    for (let i = 0; i < ma; i++)
      for (let j = 0; j < nb; j++)
        for (let k = 0; k < na; k++) C[i][j] += A[i][k] * B[k][j];
  } else {
    C.fill(0);
    for (let i = 0; i < ma; i++)
      for (let k = 0; k < na; k++) C[i] += A[i][k] * B[k];
  }

  return C;
};

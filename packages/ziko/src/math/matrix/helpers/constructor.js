export const matrix_constructor = (Matrix, rows, cols, element) => {
  if (rows instanceof Matrix) {
    arr = rows.arr;
    rows = rows.rows;
    cols = rows.cols;
  } 
  else {
    let arr = [], i, j;
    if (rows instanceof Array) {
        arr = rows;
        rows = arr.length;
        cols = arr[0].length;
    } 
    else {
      for (i = 0; i < rows; i++) {
        arr.push([]);
        arr[i].push(new Array(cols));
        for (j = 0; j < cols; j++) {
          arr[i][j] = element[i * cols + j];
          if (element[i * cols + j] == undefined) arr[i][j] = 0;
        }
      }
    }
    return [
        rows,
        cols,
        arr
    ]
  }
};


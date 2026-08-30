import { add, sub, mul } from "../../functions/arithmetic/index.js";
import { pow } from "../../functions/index.js";
export function matrix_det(M) {
    if (!M.isSquare) return new Error("is not square matrix");
    if (M.rows == 1) return M.arr[0][0];
    function determinat(M) {
        if (M.length == 2) {
            if (M.flat(1).some((n) => n?.isMatrix?.())) {
                console.warn("Tensors are not completely supported yet ...");
                return;
            }
            return sub(mul(M[0][0],M[1][1]),mul(M[0][1],M[1][0]))
        }
        var answer = 0;
        for (var i = 0; i < M.length; i++) {
            //console.log(M[0][i]);
            /*answer = answer.add(
                pow(-1, i)
                    .mul(M[0][i])
                    .mul(determinat(deleteRowAndColumn(M, i)))
            );*/
            //const to_be_added=add(mul(pow(-1, i),mul(M[0][i],determinat(deleteRowAndColumn(M, i)))));
            const to_be_added=add(mul(pow(-1, i),mul(M[0][i],determinat(deleteRowAndColumn(M, i)))));
            answer=add(answer,to_be_added)
        }
        return answer;
    }
    return determinat(M.arr);
}
function deleteRowAndColumn(M, index) {
    var temp = [];
    for (let i = 0; i < M.length; i++) temp.push(M[i].slice(0));
    temp.splice(0, 1);
    for (let i = 0; i < temp.length; i++) temp[i].splice(index, 1);
    return temp;
}
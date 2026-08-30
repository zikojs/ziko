import { Matrix } from "../../math/matrix/index.js"
const csv2arr = (csv, delimiter = ",")=>csv.trim().trimEnd().split("\n").map(n=>n.split(delimiter));
const csv2matrix = (csv, delimiter = ",")=>new Matrix(csv2arr(csv,delimiter));
const csv2object = (csv, delimiter = ",") => {
    const [header, ...rows] = csv2arr(csv,delimiter);
    const result = rows.map(row => {
        const obj = {};
        header.forEach((key, index) => {
            obj[key] = row[index];
        });
        return obj;
    });
    return result;
};
const csv2json = (csv, delimiter = ",") => JSON.stringify(csv2object(csv,delimiter));
const csv2sql=(csv, Table)=>{
    const sanitizeId = s => s.trim().replace(/[^a-zA-Z0-9_]/g, '');
    const escapeVal = s => "'" + s.trim().replace(/'/g, "''") + "'";
    const lines = csv.trim().trimEnd().split('\n').filter(n=>n);
    const columns = lines[0].split(',').map(sanitizeId);
    let sqlQuery = "INSERT INTO " + sanitizeId(Table) + " (" + columns.join(', ') + ") Values ";
    let sqlValues = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(escapeVal);
      sqlValues.push("(" + values.join(', ') + ")")
    }
    return sqlQuery+sqlValues.join(",\n");
  }
export{
    csv2arr,
    csv2matrix,
    csv2object,
    csv2json,
    csv2sql
}
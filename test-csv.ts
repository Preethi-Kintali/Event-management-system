import { exportToCsv } from "./src/lib/export";

console.log("Testing exportToCsv logic:");
try {
  const data = [
    { id: 1, name: "Alice", details: { age: 30 } },
    { id: 2, name: "Bob", details: { age: 40 } }
  ];
  const keys = Array.from(new Set(data.flatMap(Object.keys)));
  const headerRow = keys.map(escapeCsvValue).join(',');
  const rows = data.map(row => {
    return keys.map(key => escapeCsvValue((row as any)[key])).join(',');
  });
  console.log("Headers:", headerRow);
  console.log("Rows:", rows);
} catch (e) {
  console.error("Error:", e);
}

function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) return '';
  let stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
  stringVal = stringVal.replace(/"/g, '""');
  if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
    stringVal = `"${stringVal}"`;
  }
  return stringVal;
}

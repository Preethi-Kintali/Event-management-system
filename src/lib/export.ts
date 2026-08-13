export function exportToCsv<T extends Record<string, any>>(data: T[], filename: string) {
  if (!data || !data.length) return;

  // Collect all unique keys across all objects to form the headers
  const keys = Array.from(new Set(data.flatMap(Object.keys)));
  
  // Format the headers
  const headerRow = keys.map(escapeCsvValue).join(',');
  
  // Format the rows
  const rows = data.map(row => {
    return keys.map(key => escapeCsvValue(row[key])).join(',');
  });

  const csvContent = [headerRow, ...rows].join('\n');
  
  // Create a Blob and trigger a download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) return '';
  
  let stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
  
  // Escape existing double quotes
  stringVal = stringVal.replace(/"/g, '""');
  
  // Wrap in double quotes if it contains a comma, newline, or double quote
  if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
    stringVal = `"${stringVal}"`;
  }
  
  return stringVal;
}

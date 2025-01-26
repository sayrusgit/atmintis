export type EntryJsonFromCsv = {
  Entry: string;
  Description: string;
  Type: string;
};

export function csvToJson<T>(csvString: string): T[] {
  // Helper function to parse a CSV row while respecting quotes
  function parseCsvRow(row) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];

      if (char === '"' && (i === 0 || row[i - 1] !== '\\')) {
        // Toggle quotes state
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        // Add field when not in quotes
        result.push(current.trim());
        current = '';
      } else {
        // Add character to the current field
        current += char;
      }
    }
    // Add the last field
    result.push(current.trim());
    return result;
  }

  // Split the CSV string into rows
  const rows = csvString.split('\n');

  // Extract the headers
  const headers = parseCsvRow(rows[0]);

  // Map the remaining rows to JSON objects
  const json = rows
    .slice(1)
    .filter((row) => row.trim() !== '')
    .map((row) => {
      const values = parseCsvRow(row);
      const jsonObject = {};

      headers.forEach((header, index) => {
        jsonObject[header.trim()] = values[index]?.trim() || null;
      });

      return jsonObject;
    }) as T[];

  return json;
}

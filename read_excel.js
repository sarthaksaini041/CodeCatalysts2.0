import XLSX from 'xlsx';
import fs from 'fs';

try {
    const workbook = XLSX.readFile('./DATA.xlsx');
    const sheet = workbook.Sheets['Sheet1'];
    
    // We need to find cells with hyperlinks
    const data = XLSX.utils.sheet_to_json(sheet);
    
    // Manual mapping to find links
    const range = XLSX.utils.decode_range(sheet['!ref']);
    const headers = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + "1";
        if (sheet[address]) headers[C] = sheet[address].v;
    }

    const rowsWithLinks = [];
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        const row = {};
        let hasData = false;
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ c: C, r: R });
            const cell = sheet[cellAddress];
            if (cell) {
                hasData = true;
                const header = headers[C];
                // If the cell has a link (l), use the Target URL, otherwise use the value (v)
                if (cell.l && cell.l.Target) {
                    row[header] = cell.l.Target;
                } else {
                    row[header] = cell.v;
                }
            }
        }
        if (hasData) rowsWithLinks.push(row);
    }

    const result = { Sheet1: rowsWithLinks };
    fs.writeFileSync('spreadsheet_data.json', JSON.stringify(result, null, 2));
    console.log('SUCCESS: Extracted data with hyperlinks.');
} catch (err) {
    console.error('ERROR reading file:', err);
    process.exit(1);
}

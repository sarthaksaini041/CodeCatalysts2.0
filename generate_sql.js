import fs from 'fs';

const data = JSON.parse(fs.readFileSync('spreadsheet_data.json', 'utf8')).Sheet1;

let sql = "INSERT INTO team_members (name, role, university, bio, linkedin, github, order_index)\nVALUES ";

const values = data.map((m, i) => {
    const escape = (val) => {
        if (val === null || val === undefined || val === 'null') return 'NULL';
        return `'${String(val).replace(/'/g, "''")}'`;
    };
    
    // Default role to 'Member' if missing
    const role = (m.Role && m.Role !== 'null') ? m.Role : 'Member';
    
    return `(${escape(m.Name)}, ${escape(role)}, ${escape(m.College)}, ${escape(m.Skills)}, ${escape(m.Linkedin)}, ${escape(m.Github)}, ${10 + i})`;
}).join(",\n");

sql += values + ";";

fs.writeFileSync('import.sql', sql);
console.log('SQL generated to import.sql');

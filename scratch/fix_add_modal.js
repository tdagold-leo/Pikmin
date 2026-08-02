const fs = require('fs');
const path = require('path');

const mainPath = path.join(__dirname, '../js/main.js');
let content = fs.readFileSync(mainPath, 'utf-8');

content = content.replace(
    /function openAddModal\(\) \{/,
    `function openAddModal() {
        if (typeof editingLandmarkId !== 'undefined') editingLandmarkId = null;
        if (typeof currentEditingId !== 'undefined') currentEditingId = null;`
);

fs.writeFileSync(mainPath, content, 'utf-8');
console.log('Fixed openAddModal resetting editing IDs in main.js');

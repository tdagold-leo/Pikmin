const fs = require('fs');
const path = require('path');

const patchFiles = [
    'patch.js',
    'reorder.js',
    'add_button.js',
    'combine_buttons.js',
    'beautify_buttons.js',
    'patch_invite_link.js',
    'update_logic.js',
    'update_code_btn.js',
    'ui_tweak.js',
    'patch_shared_invites.js',
    'patch_collapse.js',
    'patch_name_input.js',
    'patch_public_checkbox.js',
    'patch_globe_icon.js',
    'patch_split_lists.js'
];

patchFiles.forEach(f => {
    const fullPath = path.join('c:\\Project\\Antigravity\\Pikmin\\TrackerWeb', f);
    if (fs.existsSync(fullPath)) {
        console.log(`==================== ${f} ====================`);
        console.log(fs.readFileSync(fullPath, 'utf-8'));
    }
});

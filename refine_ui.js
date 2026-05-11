const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src', 'app', 'maps');

function replaceInFolder(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            replaceInFolder(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            if (content.includes('border-blue-500')) {
                content = content.replace(/border-blue-500/g, 'border-black');
                modified = true;
            }
            if (content.includes('} reviews')) {
                content = content.replace(/} reviews/g, '} отзывов');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
            }
        }
    }
}

try {
  replaceInFolder(targetDir);
  console.log('UI refinement replaced successfully!');
} catch (e) {
  console.error(e);
}

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Rename files
const renameFiles = () => {
    const files = execSync('find . -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.next/*" -iname "*securemax*"').toString().split('\n').filter(Boolean);
    for (const file of files) {
        if (file.endsWith('.sol') && fs.existsSync(file)) {
            const newFile = file.replace(/securemax/i, 'SecureMax');
            fs.renameSync(file, newFile);
            console.log(`Renamed: ${file} -> ${newFile}`);
        }
    }
};

renameFiles();

// 2. Replace contents
const extensions = ['.ts', '.tsx', '.js', '.json', '.md', '.sol', '.sql', '.mjs', '.env', '.example'];

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const filePath = path.join(dir, file);
        if (filePath.includes('node_modules') || filePath.includes('.next') || filePath.includes('.git') || filePath.includes('artifacts') || filePath.includes('typechain-types') || filePath.includes('cache')) return;
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath));
        } else {
            if (extensions.some(ext => filePath.endsWith(ext)) || path.basename(filePath) === '.env' || path.basename(filePath) === '.env.example') {
                results.push(filePath);
            }
        }
    });
    return results;
};

const files = walk('.');

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    
    // Replace exact cases
    content = content.replace(/SecureMax/g, 'SecureMax');
    content = content.replace(/SECUREMAX/g, 'SECUREMAX');
    content = content.replace(/securemax/g, 'securemax');
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated: ${file}`);
    }
}

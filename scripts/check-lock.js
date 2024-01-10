let fs = require('fs');
let path = require('path');

let lockFile = path.resolve(__dirname, '../pnpm-lock.yaml');
let lockStr = fs.readFileSync(lockFile, 'utf8');
let wrongRegistryMatch = lockStr.match(/tarball: https?:\/\/((?!registry\.npmjs\.org).*?)\//);
if (wrongRegistryMatch) {
    console.error(`\nError: Wrong package resolve path! (Found wrong path: ${wrongRegistryMatch[1]}) Please check your npm registry and install again.\n`);
    throw new Error();
}
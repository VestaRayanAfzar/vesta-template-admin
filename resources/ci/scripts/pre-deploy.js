#!/usr/bin/env node
const fs = require('fs');

const packagePath = `${__dirname}/../../../package.json`;

try {
    const packageContent = JSON.parse(fs.readFileSync(packagePath, {encoding: 'utf8'}).toString());
    const packagesToRemove = [];
    const devPackagesToRemove = [
        "jest-cli",
        "ts-jest"
    ];
    for (let i = packagesToRemove.length; i--;) {
        delete packageContent.dependencies[packagesToRemove[i]];
    }
    for (let i = devPackagesToRemove.length; i--;) {
        delete packageContent.devDependencies[devPackagesToRemove[i]];
    }
    fs.writeFileSync(packagePath, JSON.stringify(packageContent));
} catch (e) {
    console.error(e);
}
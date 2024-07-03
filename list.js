const path = require("path");
const fs = require("fs");

function logDirectoryStructure(dirPath, level = 0) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    if (file !== "node_modules") {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        console.log(`${"  ".repeat(level)}├── ${file}/`);
        logDirectoryStructure(filePath, level + 1);
      } else {
        console.log(`${"  ".repeat(level)}└── ${file}`);
      }
    }
  });
}

const rootDir = path.join(__dirname, "to-do-app");
console.log("Directory structure:");
logDirectoryStructure(rootDir);

import fs from "fs";
import path from "path";

export function getComponentNames() {
  const componentsDir = path.join(process.cwd(), "src/app/components");

  if (!fs.existsSync(componentsDir)) return [];

  // Read immediate children of src/components and keep only directories
  const dirs = fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  // For each directory, check if it contains any .mdx files (e.g. page.mdx)
  const names = dirs
    .map((dirent) => {
      const compDir = path.join(componentsDir, dirent.name);
      const mdxFiles = fs
        .readdirSync(compDir, { withFileTypes: true })
        .filter((f) => f.isFile() && path.extname(f.name) === ".mdx")
        .map((f) => f.name);
      return mdxFiles.length > 0 ? dirent.name : null;
    })
    .filter((n): n is string => n !== null);

  return names;
}

console.log(getComponentNames());

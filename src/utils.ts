import fs from "fs";
import path from "path";

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

export function getComponentNames() {
  return getMDXFiles(path.join(process.cwd(), "src/content")).map((file) =>
    path.basename(file, path.extname(file)),
  );
}

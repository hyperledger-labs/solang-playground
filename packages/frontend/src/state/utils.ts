export function createPath(basePath: string, name: string) {
  return basePath + ".items" + `['${name}']`;
}

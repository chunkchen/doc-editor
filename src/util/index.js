export function getRgbStr(hexColor) {
  hexColor = hexColor.substr(1);
  let str;
  const a = [];
  for (let i = 0; i < 3; i++) {
    str = hexColor.substr(i * 2, 2);
    a[i] = parseInt(str, 16);
  }
  return a.join(',');
}

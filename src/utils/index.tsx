import translationMap from "./translations";
export function translations(key: string | undefined = "") {
  return translationMap[key] || key;
}

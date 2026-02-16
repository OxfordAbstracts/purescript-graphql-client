export function cause(err) {
  return String(err.cause || "");
}

export function log(
  msg: string,
  type: "info" | "error" | "warn" = "info",
  title?: string
) {
  if (type === "info") {
    console.log(msg);
  } else if (type === "error") {
    console.error(msg);
  } else if (type === "warn") {
    console.warn(msg);
  } else {
    console.log(msg);
  }
}

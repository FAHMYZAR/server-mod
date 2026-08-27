export const roleName = (level) =>
  Number(level) === 1 || level === "admin" ? "Admin" : "Reseller";
export const money = (value) =>
  `$${Number(value || 0)
    .toFixed(2)
    .replace(/\.00$/, "")}`;
export const dateTime = (value) =>
  value
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "—";
export const relativeTime = (value) => {
  if (!value) return "—";
  const seconds = Math.round((new Date(value) - Date.now()) / 1000);
  const abs = Math.abs(seconds);
  const [amount, unit] =
    abs < 60
      ? [seconds, "second"]
      : abs < 3600
        ? [Math.round(seconds / 60), "minute"]
        : abs < 86400
          ? [Math.round(seconds / 3600), "hour"]
          : [Math.round(seconds / 86400), "day"];
  return new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(
    amount,
    unit,
  );
};

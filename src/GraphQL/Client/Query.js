const formatError = (err) => {
  if (!err) return "";
  const props = ["message", "code", "syscall", "hostname", "address", "port"]
    .filter((k) => err[k])
    .map((k) => `${k}: ${err[k]}`);
  if (err.cause) props.push(`cause: ${formatError(err.cause)}`);
  return props.join(", ");
};

export const cause = (err) => {
  const c = err.cause;
  if (!c) return "";
  if (c instanceof AggregateError) {
    return [c.message, ...Array.from(c.errors, (e, i) => `[${i}] ${formatError(e)}`)].join("\n");
  }
  return formatError(c);
};

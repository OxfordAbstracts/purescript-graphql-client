// Error codes where the request definitely never reached the server
const noConnectionErrorCodes = new Set([
  "ECONNREFUSED",
  "ENETUNREACH",
]);

// Error codes where the connection may have been established
// before failing, so the server may have received the request
const ambiguousConnectionErrorCodes = new Set([
  "ETIMEDOUT",
  "ECONNRESET",
]);

const getCode = (error) => {
  const code = error?.cause?.code;
  return typeof code === "string" ? code : "";
};

export const isNoConnectionError = (error) =>
  noConnectionErrorCodes.has(getCode(error));

export const isConnectionError = (error) => {
  const code = getCode(error);
  return noConnectionErrorCodes.has(code) || ambiguousConnectionErrorCodes.has(code);
};

exports.handleTestError = (err) => {
  console.err(`Test error`, err);
  if (err.message.length > 2000) {
    console.err('error end', err.message.slice(-2000));
  }
  process.exit(1);
};

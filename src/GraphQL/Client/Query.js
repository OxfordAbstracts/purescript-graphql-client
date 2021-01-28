exports.queryImpl = function (client) {
  return function (op) {
    return function (query) {
      return function (onError, onSuccess) {
        try {
          let res

          if (op === 'query') {
            res = client.query(query)
          } else if (op === 'mutation') {
            res = client.mutation(query)
          }

          res
            .toPromise()
            .then(onSuccess)
            .catch(onError)
        } catch (err) {
          onError(err)
        }
        return function (cancelError, onCancelerError, onCancelerSuccess) {
          onCancelerSuccess()
        }
      }
    }
  }
}

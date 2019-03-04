const toPath = function (obj, path) {
  return path.split('.').reduce((re, it) => {
    if (re && re.hasOwnProperty(it)) {
      return re[it]
    }
    return undefined
  }, obj)
}
export default toPath
module.exports = {
  ifeq: function(a, b, options) {
    if (a == b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  ifexists: function(a, b, options) {
    if(a || b) {
      return options.fn(this)
    }
    return options.inverse(this)
  }

}
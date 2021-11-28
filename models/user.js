const {Schema, model} = require('mongoose')

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: String,
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExp: Date,
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1
        },
        flowerId: {
          type: Schema.Types.ObjectId,
          ref: 'Flower',
          required: true
        }
      }
    ]
  }
})


userSchema.methods.addToCart = function(flower) {
  const items = [...this.cart.items]
  const idx = items.findIndex(c => {
    return c.flowerId.toString() === flower._id.toString()
  })

  if (idx >= 0) {
    items[idx].count = items[idx].count + 1
  } else {
    items.push({
      flowerId: flower._id,
      count: 1
    })
  }

  this.cart = {items}
  return this.save()
}


userSchema.methods.removeFromCart = function(id) {
  let items = [...this.cart.items]
  const idx = items.findIndex(c => c.flowerId.toString() === id.toString())

  if (items[idx].count === 1) {
    items = items.filter(c => c.flowerId.toString() !== id.toString())
  } else {
    items[idx].count--
  }

  this.cart = {items}
  return this.save()
}

userSchema.methods.addQuanity = function(id) {
  let items = [...this.cart.items]
  const idx = items.findIndex(c => c.flowerId.toString() === id.toString())
  items[idx].count ++
  this.cart = {items}
  return this.save()
}

userSchema.methods.clearCart = function() {
  this.cart = {items: []}
  return this.save()
}

module.exports = model('User', userSchema)
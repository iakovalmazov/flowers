const {Schema, model} = require('mongoose')

const orderSchema = new Schema({
  flowers: [
    {
      flower: {
        type: Object,
        required: true
      },
      count: {
        type: Number,
        required: true
      }
    }
  ],
  user: {
    name: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  info: String,
  date: {
    type: Date,
    default: Date.now
  }
})

orderSchema.methods.addInfo = function(info) {

}



module.exports = model('Order', orderSchema)
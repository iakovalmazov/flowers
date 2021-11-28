const {Schema, model} = require('mongoose')

const flowerSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  img: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

flowerSchema.method('toClient', function() {
  const flower = this.toObject()

  flower.id = flower._id
  delete flower._id

  return flower
})

module.exports = model('Flower', flowerSchema)
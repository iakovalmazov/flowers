const {Router} = require('express')
const Flower = require('../models/flower')
const auth = require('../middleware/auth')
const router = Router()


function mapCartItems(cart) {
  return cart.items.map(c => ({
    ...c.flowerId._doc, 
    id: c.flowerId.id,
    count: c.count
  }))
}

function computePrice(flowers) {
  return flowers.reduce((total, flower) => {
    return total += flower.price * flower.count
  }, 0)
}

router.post('/add', auth, async (req, res) => {
  const flower = await Flower.findById(req.body.id)
  await req.user.addToCart(flower)
  res.redirect('/card')
})

router.delete('/remove/:id', auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id)
  const user = await req.user.populate('cart.items.flowerId').execPopulate()
  const flowers = mapCartItems(user.cart)
  const cart = {
    flowers, price: computePrice(flowers)
  }
  res.status(200).json(cart)
})

router.put('/add/:id', auth, async (req, res) => {
  await req.user.addQuanity(req.params.id)
  const user = await req.user.populate('cart.items.flowerId').execPopulate()
  const flowers = mapCartItems(user.cart)
  const cart = {
    flowers, price: computePrice(flowers)
  }
  res.status(200).json(cart)
})

router.get('/', auth, async (req, res) => {
  const user = await req.user
    .populate('cart.items.flowerId')
    .execPopulate()

  const flowers = mapCartItems(user.cart)

  res.render('card', {
    title: 'Корзина',
    isCard: true,
    flowers: flowers,
    keywords: 'цветы, онлайн, заказать, купить цветы',
    description: 'онлайн магазин цветов',
    price: computePrice(flowers),
  })
})

module.exports = router
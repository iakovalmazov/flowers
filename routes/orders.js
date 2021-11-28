const {Router} = require('express')
const Order = require('../models/order')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const router = Router()

router.get('/', admin, auth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user.userId')

    res.render('orders', {
      isOrder: true,
      title: 'Заказы',
      keywords: 'цветы, онлайн, заказать, купить цветы',
      description: 'онлайн магазин цветов',
      orders: orders.map(o => {
        return {
          ...o._doc,
          price: o.flowers.reduce((total, c) => {
            return total += c.count * c.flower.price
          }, 0)
        }
      })
    })
  } catch (e) {
    console.log(e)
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const user = await req.user
      .populate('cart.items.flowerId')
      .execPopulate()

    const flowers = user.cart.items.map(i => ({
      count: i.count,
      flower: {...i.flowerId._doc}
    }))

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user
      },
      flowers: flowers,
      info: req.body.info
    })

    await order.save()
    await req.user.clearCart()

    req.flash('message', 'Заказ принят. Спасибо!')
    res.redirect('/')

  } catch (e) {
    console.log(e)
  }
})

router.post('/remove', async(req, res) => {
  await Order.deleteOne({_id: req.body.id})
  res.redirect('/orders')
})

module.exports = router
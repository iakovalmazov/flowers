const {Router} = require('express')
const {validationResult} = require('express-validator')
const Flower = require('../models/flower')
const auth = require('../middleware/auth')
const {flowerValidators} = require('../utils/validators')
const router = Router()

function isOwner(flower, req) {
  return flower.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
  try {
    const flowers = await Flower.find()
    .populate('userId', 'email name')
    .select('price title img')

    res.render('flowers', {
      title: 'Каталог цветов',
      isFlowers: true,
      keywords: 'цветы, онлайн, заказать, купить цветы',
      description: 'онлайн магазин цветов',
      userId: req.user ? req.user._id.toString() : null,
      flowers
    })
  } catch (e) {
    console.log(e)
  }
})

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }

  try {
    const flower = await Flower.findById(req.params.id)
    if (!isOwner(flower, req)) {
      return res.redirect('/flowers')
    }

    res.render('flower-edit', {
      title: `Редактировать ${flower.title}`,
      flower
    })
  } catch (e) {
    console.log(e)
  }
})

router.post('/edit', auth, flowerValidators, async (req, res) => {
  const errors = validationResult(req)
  const {id} = req.body

  if (!errors.isEmpty()) {
    return res.status(422).redirect(`/flowers/${id}/edit?allow=true`)
  }

  try {
    delete req.body.id
    const flower = await Flower.findById(id)
    if (!isOwner(flower, req)) {
      return res.redirect('/flowers')
    }
    if(!req.file) {
      Object.assign(flower, req.body)
    } else {
      Object.assign(flower, req.body, {img: req.file.path})
    }
    await flower.save()
    res.redirect('/flowers')
  } catch (e) {
    console.log(e)
  }
})

router.post('/remove', auth, async (req, res) => {
  try {
    await Flower.deleteOne({
      _id: req.body.id,
      userId: req.user._id
    })
    res.redirect('/flowers')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
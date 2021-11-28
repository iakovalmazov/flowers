const {Router} = require('express')
const {validationResult} = require('express-validator')
const Flower = require('../models/flower')
const auth = require('../middleware/auth')
const {flowerValidators} = require('../utils/validators')
const router = Router()

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Добавить цветы',
    isAdd: true
  })
})

router.post('/', auth, flowerValidators, async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: 'Добавить цветы',
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        img: req.file.path
      }
    })
  }

  const flower = new Flower({
    title: req.body.title,
    price: req.body.price,
    img: req.file.path,
    userId: req.user
  })

  try {
    await flower.save()
    res.redirect('/flowers')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Главная страница',
    isHome: true,
    keywords: 'цветы, онлайн, заказать, купить цветы',
    description: 'онлайн магазин цветов',
    message: req.flash('message')
  })
})


module.exports = router
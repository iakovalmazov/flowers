const keys = require('../keys')

module.exports = function(email) {
  return {
    from: keys.EMAIL_FROM,
    to: email,
    subject: 'Аккаунт создан',
    html: `
      <h1>Добро пожаловать в наш магазин</h1>
      <p>Вы успешно создали аккаунт c email - ${email}</p>
      <hr />
      <a href="${keys.BASE_URL}">Магазин цветов</a>
    `
  }
}
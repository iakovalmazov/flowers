const toCurrency = price => {
  return new Intl.NumberFormat('ja-JP', {
    currency: 'JPY',
    style: 'currency'
  }).format(price)
}

const toDate = date => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(date))
}

document.querySelectorAll('.price').forEach(node => {
  node.textContent = toCurrency(node.textContent)
})

document.querySelectorAll('.date').forEach(node => {
  node.textContent = toDate(node.textContent)
})

const $card = document.querySelector('#card')
if ($card) {
  $card.addEventListener('click', event => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id
      const csrf = event.target.dataset.csrf
      
      fetch('/card/remove/' + id, {
        method: 'delete',
        headers: {
          'X-XSRF-TOKEN': csrf
        },
      }).then(res => res.json())
        .then(card => {
          if (card.flowers.length) {
            const html = card.flowers.map(c => {
              return `
              <tr>
                <td>${c.title}</td>
                <td>
                  <button class="btn btm-small js-remove" data-id="${c.id}" data-csrf="${csrf}">-</button>
                    ${c.count}
                  <button class="btn btm-small js-add" data-id="${c.id}" data-csrf="${csrf}">+</button>
                </td>
                <td class="currencyPrice">${toCurrency(c.price)}</td>
              </tr>
              `
            }).join('')
            $card.querySelector('tbody').innerHTML = html
            $card.querySelector('.price').textContent = toCurrency(card.price)
          } else {
            $card.innerHTML = '<p>Корзина пуста</p>'
          }
        })
    }

    if (event.target.classList.contains('js-add')) {
      const id = event.target.dataset.id
      const csrf = event.target.dataset.csrf
      
      fetch('/card/add/' + id, {
        method: 'put',
        headers: {
          'X-XSRF-TOKEN': csrf
        },
      }).then(res => res.json())
        .then(card => {
          if (card.flowers.length) {
            const html = card.flowers.map(c => {
              return `
              <tr>
                <td>${c.title}</td>
                <td>
                  <button class="btn btm-small js-remove" data-id="${c.id}" data-csrf="${csrf}">-</button>
                    ${c.count}
                  <button class="btn btm-small js-add" data-id="${c.id}" data-csrf="${csrf}">+</button>
                </td>
                <td class="currencyPrice">${toCurrency(c.price)}</td>
              </tr>
              `
            }).join('')
            $card.querySelector('tbody').innerHTML = html
            $card.querySelector('.price').textContent = toCurrency(card.price)
          } else {
            $card.innerHTML = '<p>Корзина пуста</p>'
          }
        })
    }
    
  })
} 



M.Tabs.init(document.querySelectorAll('.tabs'))
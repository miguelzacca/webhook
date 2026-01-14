fetch('http://localhost:3000/api/webhook', {
  method: 'post',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'Teste'
  })
}).then((res) => res.json()).then((data) => {
  console.log('Local Response:', data)
}).catch((err) => {
  console.log('Local Error:', err)
})

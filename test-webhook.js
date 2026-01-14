fetch('https://datarecv.vercel.app/api/webhook', {
  method: 'post',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'Teste webhook 2'
  })
}).then((res) => res.json()).then((data) => {
  console.log(data)
}).catch((err) => {
  console.log(err)
})
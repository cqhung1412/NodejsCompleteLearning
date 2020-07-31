const fetchData = () => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      // reject('Error')
      resolve('Done!')
    }, 1500)
  })
  return promise
}


setTimeout(() => {
  console.log('Timer is done!')
  fetchData()
    .then(text => {
      console.log(text)
      // return fetchData()
    })
    .then(text2 => {
      console.log(text2)
    })
    .catch(err => console.log(err))
}, 2000)

console.log('Hello!')
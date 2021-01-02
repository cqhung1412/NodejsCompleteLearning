const getButton = document.getElementById('get-button');
const postButton = document.getElementById('post-button');

getButton.addEventListener('click', () => {
  fetch('http://localhost:8080/feed/posts')
    .then(res => res.json())
    .then(resData => console.log(resData))
    .catch(console.error);
});
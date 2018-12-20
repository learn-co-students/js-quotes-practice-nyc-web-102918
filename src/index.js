// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener('DOMContentLoaded', () => {

    const quoteList = document.querySelector('#quote-list')
    const form = document.querySelector('#new-quote-form')
    const quoteInput = document.querySelector('#new-quote')
    const authorInput = document.querySelector('#author')

    fetch('http://localhost:3000/quotes')
    .then(res => res.json())
    .then(res => addQuoteToPage(res))

    function addQuoteToPage(array) {
      array.forEach(function (quote) {
        quoteList.innerHTML += `<li id="quote-${quote.id}" class='quote-card'>
  <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button id="like-${quote.id}" class='btn-success'>Likes: <span>${quote.likes}</span></button>
    <button id="del-${quote.id}" class='btn-danger'>Delete</button>
  </blockquote>
</li>`
      })
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      console.log(authorInput.value);

      fetch('http://localhost:3000/quotes', {
        method:'POST',
        headers:{"Content-Type": "application/json",
        "Accept": "application/json"},
        body: JSON.stringify({
          author: authorInput.value,
          quote: quoteInput.value,
          likes: 0
        })
      }).then(res => res.json())
      .then(res => addQuoteToPage([res]))///END FETCH




    })

    quoteList.addEventListener('click', function (event) {
        if(event.target.className==="btn-success"){
          let specificId = event.target.id.split('-')[1]
          console.log(specificId);
          let likeCount = document.querySelector(`#like-${specificId}`).children[0].innerText
          let counter = likeCount
          fetch(`http://localhost:3000/quotes/${specificId}`, {
              method: 'PATCH',
              headers: {"Content-Type": "application/json",
                        "Accept": "application/json"},
              body: JSON.stringify({
                likes: parseInt(likeCount) + 1
              })

          }).then(res => res.json()).then(res => console.log(res))

          document.querySelector(`#like-${specificId}`).children[0].innerText = parseInt(likeCount) +1

        }
    })

    quoteList.addEventListener('click', function (event) {
        if(event.target.className==="btn-danger"){

          let specificId = event.target.id.split('-')[1]

          fetch(`http://localhost:3000/quotes/${specificId}`, {
            method: 'DELETE',
            headers: {"Content-Type": "application/json",
                      "Accept": "application/json"}
          })////END FETCH
          let deleteDiv = document.querySelector(`#quote-${specificId}`)
          deleteDiv.remove();
        }
    })




})/////END DOM COntent

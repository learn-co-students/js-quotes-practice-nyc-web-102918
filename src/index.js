// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener('DOMContentLoaded', function(){

const quoteUrl = "http://localhost:3000/quotes"
const quoteList = document.querySelector("#quote-list")
const form = document.querySelector('#new-quote-form')
// let allQuotes = ''

//get all quotes and populate the page with the provided html structure
    fetch(quoteUrl)
      .then(function(response){
        return response.json()
      })
      .then(function(data){
        // allQuotes = data
        data.forEach(function(quote){
          quoteList.innerHTML += `<li class='quote-card' id="quote-${quote.id}">
                                    <blockquote class="blockquote">
                                      <p class="mb-0">${quote.quote}</p>
                                      <footer class="blockquote-footer">${quote.author}</footer>
                                      <br>
                                      <button class='btn-success' data-action='like-quote' data-id='${quote.id}'>Likes:  <span id='likey-${quote.id}'>${quote.likes}</span></button>
                                      <button class='btn-danger' data-action='delete-quote' data-id='${quote.id}'>Delete</button>
                                      <button class='btn-edit' data-action='open-form' data-id='${quote.id}'>Edit</button>
                                    </blockquote>
                                    <div id="edit-${quote.id}" style="display: none;">
                                      <div class="form-group">
                                        <label for="new-quote">New Quote</label>
                                        <input type="text" class="form-control" id="edit-quote-${quote.id}" value="${quote.quote}">
                                      </div>
                                      <div class="form-group">
                                        <label for="Author">Author</label>
                                        <input type="text" class="form-control" id="edit-author-${quote.id}" value="${quote.author}">
                                      </div>
                                      <button data-action="edit-quote" data-id="${quote.id}" type="submit" class="btn btn-primary">Submit</button>
                                    </div>
                                  </li>`
        })
      })


  //Delete Quotes and Like Quotes
  document.addEventListener('click', (event) => {
    // console.log(event.target)
    if (event.target.dataset.action === "delete-quote") {
      const quoteId = event.target.dataset.id
      //front-end
      const quoteDiv = document.getElementById(`${quoteId}`)
      quoteDiv.remove()
      //back-end
      fetch(`${quoteUrl}/${quoteId}`, { method: 'DELETE' })
    }

 //Edit exisiting quotes- incomplete
    else if (event.target.dataset.action === "open-form") {
      const id = event.target.dataset.id

      const quoteForm = document.querySelector(`#edit-${id}`)

      if (quoteForm.style.display === "none"){
        quoteForm.style.display = ""
      } else {
        quoteForm.style.display = "none"
      }
    }

    else if (event.target.dataset.action === "like-quote"){
      let id = event.target.dataset.id
      const span = document.querySelector(`#likey-${id}`)
      let number = parseInt(span.innerText)
      span.innerText = number + 1
      // console.log(span.innerText)

      fetch(`${quoteUrl}/${id}`,
        { method: 'PATCH',
          headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'},
             body: JSON.stringify({
               likes:number+1
              })
        })
        .then(function(response){
          return response.json()
        })
        .then(function(data){
          console.log(data)
        })
    } else if (event.target.dataset.action === "edit-quote"){
      const id = event.target.dataset.id

      const quoteInput = document.querySelector(`#edit-quote-${id}`)
      const authorInput = document.querySelector(`#edit-author-${id}`)

      fetch(`${quoteUrl}/${id}`,
        {
          method:"PATCH",
          headers: {
            "Content-Type": "application/json",
            "Accepts": "application/json"
          },
          body: JSON.stringify({
            quote: quoteInput.value,
            author: authorInput.value
          })
        })
      .then(function(response){
        return response.json()
      })
      .then(function(data){
        console.log(data)
        const quoteLI = document.querySelector(`#quote-${data.id}`)

        const p = quoteLI.children[0].children[0]
        const footer = quoteLI.children[0].children[1]

        p.innerText = data.quote
        footer.innerText = data.author
      })
    }
  })

//Use form to submit new quotes and persist the data
form.addEventListener('submit',function(event){
  event.preventDefault()
  let newQuote = event.target['new-quote'].value
  let newAuthor = event.target.author.value

  fetch('http://localhost:3000/quotes', {
    method:'POST',
    headers:{
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    },
    body:JSON.stringify({
    author: newAuthor,
    quote: newQuote,
    likes: 0
    })
  })
  .then(function(response){
    return response.json()
  })
  .then(function(data){
    console.log(data)
    quoteList.innerHTML += `<li class='quote-card' id=${data.id}>
                            <blockquote class="blockquote">
                            <p class="mb-0">${data.quote}</p>
                            <footer class="blockquote-footer">${data.author}</footer>
                            <br>
                            <button class='btn-success' data-action='like-quote' data-id='${data.id}'>Likes:  <span id='likey-${data.id}'>${data.likes}</span></button>
                            <button class='btn-danger' data-action='delete-quote' data-id='${data.id}'>Delete</button>
                            <button class='btn-edit' data-action='edit-quote' data-id='${data.id}'>Edit</button>
                            </blockquote>
                            </li>`
  })


})


})//end of DOM Content Loaded

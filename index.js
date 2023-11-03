const watchlistContainer = document.querySelector(".watchlist-container")
const mainMovieMenu = document.querySelector(".movie-posters");
const movieCard = document.querySelector(".movie-card");
const movieList = document.querySelector(".list")

let clicked = false;
let currentMovie = null

const titleWatchlistButton = document.createElement("button")

const addToWatchList = document.createElement("button");  
addToWatchList.setAttribute("class" , "addtowatchlist")

const watchButton = document.createElement("button");
watchButton.setAttribute("class" , "watchbutton")

const like = document.createElement("button");
like.setAttribute("class" , "like");

  fetch("http://localhost:3000/films")
    .then(response => response.json())
    .then(filmData => renderFilms(filmData));

function renderFilms(filmData) {
    filmData.forEach(film => {
      const poster = document.createElement("img");
      poster.src = film.poster;
      poster.style.width = "125px";
      poster.style.height = "175px";
      mainMovieMenu.append(poster);
      poster.addEventListener("click", () => {
        createMovieCard(film);
        currentMovie = film
        clicked = true;
        setTimeout(resetClicked, 2500); 
      })
      poster.addEventListener("mouseover", e => {
        e.stopPropagation();
        if (!clicked) {
          createMovieCard(film);
        }
      });
    });
}

function createMovieCard(film) {
  movieCard.innerHTML = "";
  const innerPoster = document.createElement("img");
  const title = document.createElement("h2");
  const description = document.createElement("p");
  const rDate = document.createElement("h3");
  const runTime = document.createElement("p");
  

  innerPoster.src = film.poster;
  innerPoster.style.width = "200px";
  innerPoster.style.height = "300px";
  title.textContent = film.title;
  description.textContent = film.description;
  rDate.textContent = film.released_date;
  runTime.textContent = film.runtime;
  if (!film.watched){
    watchButton.textContent = "Watched?";
    } else {
    watchButton.textContent = "Watched!"
    }
    if (!film.liked){
    like.textContent = "Like";
    } else {
    like.textContent = "Liked ❤️ "
  }
  addToWatchList.textContent = "Add to Watchlist";

  movieCard.append(innerPoster, title, rDate, description, runTime, watchButton, like, addToWatchList);
}

function resetClicked() {
  clicked = false;
}



watchButton.addEventListener("click", () => {
  watchButton.textContent = "Watched!"
  const OPTIONS = {
      method: "PATCH",
      headers:{
          "Content-Type": "application/json",
          "Accept": "application/json"
        },

        body: JSON.stringify({watched: true})

      }
      fetch("http://localhost:3000/films/" + currentMovie.id, OPTIONS)
          .then(response => response.json())
          .then(filmData => console.log(filmData));
})

like.addEventListener("click", () => {
  like.textContent = "Liked ❤️ "
      const OPTIONS = {
          method: "PATCH",
          headers:{
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
    
            body: JSON.stringify({liked: true})

          }
          fetch("http://localhost:3000/films/" + currentMovie.id, OPTIONS)
              .then(response => response.json())
              .then(filmData => console.log(filmData));
  })

addToWatchList.addEventListener("click", () => {
  currentMovie.on_watchlist = true;
  const title = document.createElement("button");

  if (!currentMovie.watched) {
      title.textContent = currentMovie.title;
      title.style.color = "black";
      title.setAttribute("class" , "btn-two")
      movieList.append(title);

      addToWatchList.textContent = "Added to Watchlist";
      const OPTIONS = {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
          },
          body: JSON.stringify({ on_watchlist: true })
      };

      fetch("http://localhost:3000/films/" + currentMovie.id, OPTIONS)
          .then(response => response.json())
          .then(filmData => console.log(filmData));
  
      }
      
          title.addEventListener("dblclick", () => {
              movieList.removeChild(title); 
      
              const REMOVE = {
                  method: "PATCH",
                  headers: {
                      "Content-Type": "application/json",
                      "Accept": "application/json"
                  },
                  body: JSON.stringify({ on_watchlist: false })
              };
      
              fetch("http://localhost:3000/films/" + currentMovie.id, REMOVE)
                  .then(response => response.json())
                  .then(filmData => console.log(filmData));
          });
  });

fetch("http://localhost:3000/films")
.then(response => response.json())
.then(film => initialWatchlist(film));

function initialWatchlist(film){
    film.forEach(movie => {
        if (movie.on_watchlist){
            const title = document.createElement("button");
            title.setAttribute("class" , "btn-two")
            title.style.color = "black";
            title.textContent = movie.title
            movieList.append(title)
            title.addEventListener("dblclick", () => {
                movieList.removeChild(title); 
        
                const REMOVE = {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({ on_watchlist: false })
                };
        
                fetch("http://localhost:3000/films/" + movie.id, REMOVE)
                    .then(response => response.json())
                    .then(filmData => console.log(filmData));
            });
        }
    })
}
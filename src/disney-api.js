//display character info

function listParkAttractions(attractionList) {
  let place = "";
  attractionList.forEach((item) => {
    place = place + `<li>${item}</li>`;
  });
  return place;
}

function listMovies(movieList) {
  let movies = "";
  movieList.forEach((item, index) => {
    if (index > 0) {
      movies = movies + `<li>` + item + `</li>`;
    }
  });
  return movies;
}

function showCharacter(character) {
  let result = document.querySelector("#api-result");
  let display = ` 
  <div class="row">
  <h2 class="fancy-font" >${character.name}</h2>
  <div class="d-block d-md-none col-md-6">
  <img class="rounded" src="${character.image}" alt="Image of ${
    character.name
  }"></img>
  </div>
  <div class="col-md-6">
  <p><strong>${character.name}</strong> is
  ${
    character.leadRole
      ? `the main protagonist in the movie <em>"${character.mainTitle}"</em>, accordingly named,`
      : `a character from the movie <em>${character.mainTitle}</em>`
  }
 
  and also appears in</p>
  <ul>
  ${listMovies(character.movies)}
  </ul>
<p>${
    character.name
  } can be found in real life at Disney park attractions including <ul> ${listParkAttractions(
    character.parkAttractions
  )}</ul></p>
<p> To read more about ${character.name}, head over <a href=${
    character.info
  } target=_blank> here</a>, a page with tons of information </p>
  </div>
  <div class="d-none d-md-block col-md-6">
  <img class="rounded" src="${character.image}" alt="Image of ${
    character.name
  }"></img>
  </div>
  </div>`;
  result.classList.remove("hidden");
  result.innerHTML = display;
}

//format character info
function isMainCharacter(name, movie) {
  let splitName = name.split(" ");
  return splitName.some((item) => movie.includes(item));
}

function formatMainTitle(movieTitle) {
  let refinedMovieTitle = movieTitle
    .split(" ")
    .filter((segment) => !segment.includes("(") && !segment.includes(")"));
  let newTitle = "";
  refinedMovieTitle.forEach((word, index) => {
    if (index < refinedMovieTitle.length - 1) {
      newTitle = newTitle + word + " ";
    } else {
      newTitle = newTitle + word;
    }
  });
  return newTitle;
}
function formatCharacter(characterData) {
  let character = {
    name: characterData.name,
    movies: characterData.films,
    mainTitle: formatMainTitle(characterData.films[0]),
    parkAttractions: characterData.parkAttractions,
    image: characterData.imageUrl,
    info: characterData.sourceUrl,
  };

  character.leadRole = isMainCharacter(character.name, character.mainTitle);
  showCharacter(character);
}

/* Disney API */

//API response data
function respond(response) {
  let result = response.data.data;

  if (!Array.isArray(result)) {
    //if only one result
    formatCharacter(result);
  } else {
    result.forEach((item) => {
      if (item.films.length && item.parkAttractions.length) {
        formatCharacter(item);
      }
    });
  }
}

//API call for submitted search term
function search(char) {
  let apiUrl = `https://api.disneyapi.dev/character?name=${char}`;
  axios.get(apiUrl).then(respond);
}

/* Search engine */

// Send search value to API search
function searchChar(event) {
  event.preventDefault();
  let searchItem = event.target[0].value;
  if (searchItem) {
    search(searchItem);
  }
}

//Search form event listener
let charSearchInput = document.querySelector("#char-search-input");
charSearchInput.addEventListener("submit", searchChar);

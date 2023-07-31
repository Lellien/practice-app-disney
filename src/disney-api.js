function isMaincharacter(name, movie) {
  let splitName = name.split(" ");
  return splitName.some((item) => movie.includes(item));
}

function showCharacter(character) {
  let mainMovie = character.movies[0];
  let mainChar = isMaincharacter(character.name, mainMovie);
  let result = document.querySelector("#api-result");
  let display = ` 
  <div class="row mt-4">
  <h2 class="fancy-font" >${character.name}</h2>
    <div class="col-md-6">
    <p><strong>${character.name}</strong> is
     ${
       mainChar
         ? `the main protagonist in the movie accordingly named ${mainMovie}.`
         : `a character from the movie ${mainMovie}`
     }
     </br>
     </br>
     ${character.name} also appears in the following movies:</p>
    <ul>
    ${character.movies.forEach((movie, index) => {
      if (index > 1) {
        console.log(movie);
        return `<li>${movie}</li>`;
      }
    })}
    </ul>
    </div>
    <div class="col-md-6">
   <img class="rounded image-fluid" src="${character.image}" alt="Image of ${
    character.name
  }"></img>
    </div>
  </div>`;
  result.classList.remove("hidden");
  result.innerHTML = display;
}
function formatCharacter(characterData) {
  let character = {
    name: characterData.name,
    movies: characterData.films,
    parkAttractions: characterData.parkAttractions,
    image: characterData.imageUrl,
    info: characterData.sourceUrl,
  };
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

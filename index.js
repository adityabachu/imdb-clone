(function() {
    // Get DOM elements
    const searchInput = document.getElementById("search");
    const suggestionsdisplay = document.getElementById("card-container");
    const favMoviescont = document.getElementById("fav-movies-container");
    const emptySearchTxt = document.getElementById("empty-srch-txt");
    const dispFavourites = document.getElementById("favs-section");
    const emptyFavTxt = document.getElementById("empty-fav-text");
  
    // Initialize favorite movie list and suggestion list
    addToFavDOM(); // Load favorite movies from localStorage
    showEmptyText(); // Show empty text if no favorites
    let suggestionList = []; // Array to store search suggestions
    let favMovieArray = []; // Array to store favorite movies from localStorage
  
    // Prevent form submission on Enter key press
    searchInput.addEventListener("keydown", (event) => {
      if (event.key == "Enter") {
        event.preventDefault();
      }
    });
  
    // Function to toggle display of empty favorites text
    function showEmptyText() {
      if (favMoviescont.innerHTML == "") {
        emptyFavTxt.style.display = "block";
      } else {
        emptyFavTxt.style.display = "none";
      }
    }
  
    // Event listener for search input
    searchInput.addEventListener("keyup", function() {
      let search = searchInput.value;
      if (search === "") {
        // Show empty search text and clear suggestions
        emptySearchTxt.style.display = "block";
        suggestionsdisplay.innerHTML = "";
        suggestionList = [];
      } else {
        emptySearchTxt.style.display = "none";
        // Fetch movies asynchronously and add to suggestion container
        (async () => {
          let data = await fetchMovies(search);
          addToSuggestionContainerDOM(data);
        })();
        suggestionsdisplay.style.display = "grid"; // Display suggestions container
      }
    });
  
    // Function to fetch movie data from API
    async function fetchMovies(search) {
      const url = `https://www.omdbapi.com/?t=${search}&apikey=365ccab6`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
      } catch (err) {
        console.log(err);
      }
    }
  
    // Function to add movie to suggestion container in DOM
    function addToSuggestionContainerDOM(data) {
      document.getElementById("empty-fav-text").style.display = "none";
      let isPresent = false;
  
      // Check if the movie is already in suggestion list
      suggestionList.forEach((movie) => {
        if (movie.Title == data.Title) {
          isPresent = true;
        }
      });
  
      // Add movie to suggestion list if not already present
      if (!isPresent && data.Title != undefined) {
        if (data.Poster == "N/A") {
          data.Poster = ""; // Replace N/A poster with empty string
        }
        suggestionList.push(data); // Add movie to suggestion list
        const movieCard = document.createElement("div");
        movieCard.setAttribute("class", "text-decoration");
  
        // Construct HTML for movie card
        movieCard.innerHTML = `
          <div class="card my-2" data-id="${data.Title}">
            <a href="movie.html">
              <img
                src="${data.Poster}"
                class="card-img-top"
                alt="..."
                data-id="${data.Title}"
              />
              <div class="card-body text-start">
                <h5 class="card-title">
                  <a href="movie.html" data-id="${data.Title}">${data.Title}</a>
                </h5>
                <p class="card-text">
                  <i class="fa-solid fa-star">
                    <span id="rating">&nbsp;${data.imdbRating}</span>
                  </i>
                  <button class="fav-btn">
                    <i class="fa-solid fa-heart add-fav" data-id="${data.Title}"></i>
                  </button>
                </p>
              </div>
            </a>
          </div>
        `;
        suggestionsdisplay.prepend(movieCard); // Add movie card to suggestions container
      }
    }
  
    // Function to handle favorite button click
    async function handleFavBtn(e) {
      const target = e.target;
  
      // Fetch movie details from API using data-id attribute
      let data = await fetchMovies(target.dataset.id);
  
      let favMoviesLocal = localStorage.getItem("favMoviesList");
  
      // Retrieve favorite movies array from localStorage or initialize
      if (favMoviesLocal) {
        favMovieArray = Array.from(JSON.parse(favMoviesLocal));
      } else {
        localStorage.setItem("favMoviesList", JSON.stringify(data));
      }
  
      // Check if movie is already in favorite list
      let isPresent = false;
      favMovieArray.forEach((movie) => {
        if (data.Title == movie.Title) {
          notify("Already added to favorites");
          isPresent = true;
        }
      });
  
      // Add movie to favorite list if not already present
      if (!isPresent) {
        favMovieArray.push(data);
      }
  
      // Update localStorage with updated favorite movies array
      localStorage.setItem("favMoviesList", JSON.stringify(favMovieArray));
      isPresent = !isPresent; // Reset isPresent flag
      addToFavDOM(); // Update favorite movies displayed in DOM
    }
  
    // Function to add favorite movies to DOM
    function addToFavDOM() {
      favMoviescont.innerHTML = ""; // Clear favorite movies container
  
      // Retrieve favorite movies array from localStorage
      let favList = JSON.parse(localStorage.getItem("favMoviesList"));
      if (favList) {
        favList.forEach((movie) => {
          // Create DOM elements for each favorite movie
          const div = document.createElement("div");
          div.classList.add(
            "fav-movie-card",
            "d-flex",
            "justify-content-between",
            "align-content-center",
            "my-2"
          );
          div.innerHTML = `
            <img
              src="${movie.Poster}"
              alt=""
              class="fav-movie-poster"
            />
            <div class="movie-card-details">
              <p class="movie-name mt-3 mb-0">
                <a href="movie.html" class="fav-movie-name" data-id="${movie.Title}">${movie.Title}</a>
              </p>
              <small class="text-muted">${movie.Year}</small>
            </div>
            <div class="delete-btn my-4">
              <i class="fa-solid fa-trash-can" data-id="${movie.Title}"></i>
            </div>
          `;
  
          favMoviescont.prepend(div); // Add favorite movie to container
        });
      }
    }
  
    // Function to display notification
    function notify(text) {
      window.alert(text);
    }
  
    // Function to delete movie from favorite list
    function deleteMovie(name) {
      // Retrieve favorite movies array from localStorage
      let favList = JSON.parse(localStorage.getItem("favMoviesList"));
  
      // Filter out deleted movie from favorite movies array
      let updatedList = Array.from(favList).filter((movie) => {
        return movie.Title != name;
      });
  
      // Update localStorage with updated favorite movies array
      localStorage.setItem("favMoviesList", JSON.stringify(updatedList));
  
      addToFavDOM(); // Update favorite movies displayed in DOM
      showEmptyText(); // Show empty text if no favorites
    }
  
    // Event listener for click events on document
    async function handleClickListner(e) {
      const target = e.target;
  
      // Handle click events based on target element's class
      if (target.classList.contains("add-fav")) {
        e.preventDefault();
        handleFavBtn(e); // Handle click on add to favorites button
      } else if (target.classList.contains("fa-trash-can")) {
        deleteMovie(target.dataset.id); // Handle click on delete favorite button
      } else if (target.classList.contains("fa-bars")) {
        // Toggle display of favorites section
        if (dispFavourites.style.display == "flex") {
          document.getElementById("show-favourites").style.color = "#8b9595";
          dispFavourites.style.display = "none";
        } else {
          dispFavourites.classList.add("");
          document.getElementById("show-favourites").style.color =
            "var(--logo-color)";
          dispFavourites.style.display = "flex";
        }
      }
  
      localStorage.setItem("movieName", target.dataset.id); // Store clicked movie name in localStorage
    }
  
    // Event listener for click events on document
    document.addEventListener("click", handleClickListner);
  
  })();
  
(function() {
    // Get DOM elements
    const title = document.getElementById("title");
    const year = document.getElementById("year");
    const duration = document.getElementById("runtime");
    const rating = document.getElementById("rating");
    const poster = document.getElementById("poster");
    const plot = document.getElementById("plot");
    const directorName = document.getElementById("director-names");
    const castName = document.getElementById("cast-names");
    const genre = document.getElementById("genre");
  
    // Set movie title from localStorage
    title.innerHTML = localStorage.getItem("movieName");
  
    // Fetch movie data from API
    fetchMovies(title.innerHTML);
  
    async function fetchMovies(search) {
      // Construct API URL with movie title and API key
      const url = `https://www.omdbapi.com/?t=${search}&type=movie&apikey=365ccab6`;
  
      try {
        // Fetch data from API
        const response = await fetch(url);
        const data = await response.json();
  
        // Update DOM elements with fetched data
        year.innerHTML = data.Year;
        duration.innerHTML = data.Runtime;
        rating.innerHTML = `${data.imdbRating}/10`;
        poster.setAttribute("src", `${data.Poster}`);
        plot.innerHTML = data.Plot;
        directorName.innerHTML = data.Director;
        castName.innerHTML = data.Actors;
        genre.innerHTML = data.Genre;
      } catch (err) {
        console.log(err); // Log any errors that occur during fetching
      }
    }
  })();
  
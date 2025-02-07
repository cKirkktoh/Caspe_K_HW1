(() => {
    const loadingIcon = document.querySelector('#loading-icon');
    const characterBox = document.querySelector('#character-box');
    const movieBox = document.querySelector('#movie-box');
    const movieCon = document.querySelector('#movie-con');
    const movieTemplate = document.querySelector('#movie-template');
    const baseUrl = `https://swapi.dev/api/`;

    // Adding GreenSock SplitText
    gsap.registerPlugin(SplitText);
    const split = new SplitText('.split', { type: 'chars' });

    gsap.timeline()
        .from(split.chars, {
            duration: 0.1,
            autoAlpha: 0,
            stagger: {
                each: 0.1
            }
        });

    // Fetch Star Wars characters
    function getCharacters() {
        fetch(`${baseUrl}/people`)
            .then(response => response.json())
            .then(function (response) {
                loadingIcon.style.display = 'none';

                const characters = response.results;
                const ul = document.createElement('ul');

                characters.forEach((character, index) => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    
                    a.textContent = character.name;
                    a.dataset.link = character.films[0];
                    a.dataset.characterImg = `images/${character.name.replace(/ /g, '_')}.jpeg`; // Character image
                    a.dataset.moviePoster = `images/${index + 1}.jpeg`; // Movie poster (1-10)

                    li.appendChild(a);
                    ul.appendChild(li);
                });

                characterBox.appendChild(ul);
            })
            .then(function () {
                const links = document.querySelectorAll('#character-box li a');
                links.forEach(link => {
                    link.addEventListener('click', getInfo);
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    function getInfo(e) {
        const bg = document.querySelector('#content');
        bg.classList.add('bg');

        const movieUrl = this.dataset.link;
        const characterImageSrc = this.dataset.characterImg;
        const moviePosterSrc = this.dataset.moviePoster;

        movieBox.style.display = 'block';

        fetch(movieUrl)
            .then(response => response.json())
            .then(function (response) {
                movieCon.innerHTML = '';

                const template = document.importNode(movieTemplate.content, true);
                const movieTitle = template.querySelector('.movie-title');
                const movieOpening = template.querySelector('.movie-opening');
                const characterImg = template.querySelector('.character-img');
                const moviePoster = template.querySelector('.movie-poster');

                movieTitle.textContent = response.title;
                movieOpening.textContent = response.opening_crawl;
                characterImg.src = characterImageSrc;
                moviePoster.src = moviePosterSrc;

                // Handle missing images with a default placeholder
                characterImg.onerror = function () {
                    characterImg.src = "images/default_character.jpeg";
                };
                moviePoster.onerror = function () {
                    moviePoster.src = "images/default_movie_poster.jpeg";
                };

                movieCon.appendChild(template);
            })
            .catch(err => {
                console.log(err);
            });
    }

    // Call function to load character list
    getCharacters();
})();

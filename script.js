// Функция для создания HTML-разметки с данными о фильме и постером
function createMovieDetails(movieData) {
  const movieDetailsElement = document.getElementById('movie-details');
  const posterContainerElement = document.getElementById('poster-container');
  movieDetailsElement.innerHTML = '';
  posterContainerElement.innerHTML = '';

  const titleElement = document.createElement('h2');
  titleElement.textContent = movieData.Title;
  movieDetailsElement.appendChild(titleElement);

  const yearElement = document.createElement('p');
  yearElement.textContent = `Год выпуска: ${movieData.Year}`;
  movieDetailsElement.appendChild(yearElement);

  const directorElement = document.createElement('p');
  directorElement.textContent = `Режиссер: ${movieData.Director}`;
  movieDetailsElement.appendChild(directorElement);

  const actorsElement = document.createElement('p');
  actorsElement.textContent = `Актеры: ${movieData.Actors}`;
  movieDetailsElement.appendChild(actorsElement);

  const ratingElement = document.createElement('p');
  ratingElement.textContent = `Рейтинг: ${movieData.imdbRating}`;
  movieDetailsElement.appendChild(ratingElement);

  const plotElement = document.createElement('p');
  plotElement.textContent = `Описание: ${movieData.Plot}`;
  movieDetailsElement.appendChild(plotElement);

  const posterElement = document.createElement('img');
  posterElement.src = movieData.Poster;
  posterElement.alt = 'Постер фильма';
  posterElement.classList.add('poster-tooltip');
  posterElement.setAttribute('data-tooltip', movieData.Title);
  posterContainerElement.appendChild(posterElement);
}

// Функция для добавления фильма в избранное
function addToFavorites(movieData) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites.push(movieData);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  displayFavorites();
}

// Функция для очистки списка избранного
function clearFavorites() {
  localStorage.removeItem('favorites');
  displayFavorites();
}

// Функция для отображения списка избранных фильмов с постерами
function displayFavorites() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const favoritesContainer = document.getElementById('favorites-container');
  favoritesContainer.innerHTML = '';

  favorites.forEach(movieData => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('favorite-movie');

    const posterElement = document.createElement('img');
    posterElement.src = movieData.Poster;
    posterElement.alt = 'Постер фильма';
    posterElement.setAttribute('data-movie', JSON.stringify(movieData));
    posterElement.classList.add('poster-tooltip');
    movieCard.appendChild(posterElement);

    favoritesContainer.appendChild(movieCard);
  });

  addTooltipListeners();
}

// Добавляем обработчик события для отображения всплывающей подсказки при наведении на постер
function addTooltipListeners() {
  const favoritePosterElements = document.querySelectorAll('.favorite-movie img');
  favoritePosterElements.forEach(element => {
    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
  });

  const posterTooltipElements = document.querySelectorAll('.poster-tooltip');
  posterTooltipElements.forEach(element => {
    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
  });
}

// Функция для создания всплывающей подсказки
function createTooltip(movieData) {
  const tooltip = document.createElement('div');
  tooltip.classList.add('movie-tooltip');

  const titleElement = document.createElement('h3');
  titleElement.textContent = movieData.Title;
  tooltip.appendChild(titleElement);

  const yearElement = document.createElement('p');
  yearElement.textContent = `Год выпуска: ${movieData.Year}`;
  tooltip.appendChild(yearElement);

  const ratingElement = document.createElement('p');
  ratingElement.textContent = `Рейтинг: ${movieData.imdbRating}`;
  tooltip.appendChild(ratingElement);

  const plotElement = document.createElement('p');
  plotElement.textContent = `Описание: ${movieData.Plot}`;
  tooltip.appendChild(plotElement);

  return tooltip;
}

// Функция для показа всплывающей подсказки
function showTooltip(event) {
  const movieData = JSON.parse(event.target.getAttribute('data-movie'));
  const tooltip = createTooltip(movieData);
  document.body.appendChild(tooltip);

  const { top, left, width } = event.target.getBoundingClientRect();
  const tooltipTop = top - tooltip.offsetHeight - 10;
  const tooltipLeft = left + width / 2 - tooltip.offsetWidth / 2;

  tooltip.style.position = 'absolute';
  tooltip.style.top = `${event.clientY}px`;
  tooltip.style.left = `${event.clientX}px`;

  document.body.appendChild(tooltip);


  // Добавьте проверку текущей темы и примените стиль для всплывающей подсказки
  if (document.body.classList.contains('dark-theme')) {
    tooltip.classList.add('dark-theme');
  }

  document.body.appendChild(tooltip);
}

// Функция для скрытия всплывающей подсказки
function hideTooltip(event) {
  const tooltips = document.querySelectorAll('.movie-tooltip');
  tooltips.forEach(tooltip => {
    tooltip.parentNode.removeChild(tooltip);
  });
}

// Функция для отправки запроса к OMDb API
function getMovieData(title) {
  const apiKey = '73a36f55'; // Ваш API-ключ OMDb
  const apiUrl = `http://www.omdbapi.com/?apikey=${apiKey}&t=${title}`;

  return fetch(apiUrl)
    .then(response => response.json())
    .then(data => data);
}

// Обработчик кнопки "Поиск"
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', () => {
  const movieTitle = document.getElementById('movie-title').value;
  getMovieData(movieTitle)
    .then(movieData => {
      createMovieDetails(movieData);
    })
    .catch(error => {
      console.log('Произошла ошибка:', error);
    });
});

// Обработчик кнопки "Добавить в избранное"
const addToFavoritesBtn = document.getElementById('add-to-favorites');
addToFavoritesBtn.addEventListener('click', () => {
  const movieTitle = document.getElementById('movie-title').value;
  getMovieData(movieTitle)
    .then(movieData => {
      addToFavorites(movieData);
    })
    .catch(error => {
      console.log('Произошла ошибка:', error);
    });
});

// Обработчик кнопки "Очистить избранное"
const clearFavoritesBtn = document.getElementById('clear-favorites');
clearFavoritesBtn.addEventListener('click', () => {
  clearFavorites();
});

// Отображение списка избранных фильмов при загрузке страницы
displayFavorites();

// Обработчик кнопки "Light Theme"
const lightThemeBtn = document.getElementById('light-theme-btn');
lightThemeBtn.addEventListener('click', switchToLightTheme);

// Обработчик кнопки "Dark Theme"
const darkThemeBtn = document.getElementById('dark-theme-btn');
darkThemeBtn.addEventListener('click', switchToDarkTheme);

// Обработчик изменения цвета через colorpicker
const colorPicker = document.getElementById('color-picker');
colorPicker.addEventListener('change', (event) => {
  const selectedColor = event.target.value;
  document.body.style.backgroundColor = selectedColor;
});

// Функция для переключения на светлую тему
function switchToLightTheme() {
  document.body.classList.remove('dark-theme');
  document.body.classList.add('light-theme');
}

// Функция для переключения на темную тему
function switchToDarkTheme() {
  document.body.classList.remove('light-theme');
  document.body.classList.add('dark-theme');
}


// DOM узлы
const placesList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');

// Функция удаления карточки
function handleDeleteCard(cardElement) {
  cardElement.remove();
}

// Функция создания карточки
function createCard(cardData, onDelete) {
  const cardElement = cardTemplate.cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener('click', () => onDelete(cardElement));

  return cardElement;
}

// Вывод карточки на страницу
initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData, handleDeleteCard);
  placesList.append(cardElement);
});

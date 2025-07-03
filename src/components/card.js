const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');

function getCardTemplate() {
  return cardTemplate.cloneNode(true);
}

export function createCard(cardData, { onDelete, onLike, onImageClick }) {
  const cardElement = getCardTemplate();

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener('click', () => onDelete(cardElement));
  likeButton.addEventListener('click', () => onLike(likeButton));
  cardImage.addEventListener('click', () => onImageClick(cardData));

  return cardElement;
}

export function handleDeleteCard(cardElement) {
  cardElement.remove();
}

export function handleLikeCard(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}
 
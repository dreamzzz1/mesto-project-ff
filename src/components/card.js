import { deleteCard, likeCard, unlikeCard } from './api.js';

const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');

function getCardTemplate() {
  return cardTemplate.cloneNode(true);
}

export function createCard(cardData, { userId, onImageClick }) {
  const cardElement = getCardTemplate();

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  const likeCounter = document.createElement('span');
  likeCounter.classList.add('card__like-count');
  likeCounter.textContent = cardData.likes.length;
  likeButton.after(likeCounter);

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  if (cardData.owner._id === userId) {
    deleteButton.addEventListener('click', () => {
      deleteCard(cardData._id)
        .then(() => cardElement.remove())
        .catch((err) => console.error('Ошибка при удалении карточки:', err));
    });
  } else {
    deleteButton.remove();
  }

  const isLikedByUser = cardData.likes.some((user) => user._id === userId);
  if (isLikedByUser) {
    likeButton.classList.add('card__like-button_active');
  }

  likeButton.addEventListener('click', () => {
    const isLiked = likeButton.classList.contains('card__like-button_active');
    const likeAction = isLiked ? unlikeCard : likeCard;

    likeAction(cardData._id)
      .then((updatedCard) => {
        likeCounter.textContent = updatedCard.likes.length;
        likeButton.classList.toggle('card__like-button_active');
      })
      .catch((err) => console.error('Ошибка при постановке/снятии лайка:', err));
  });

  cardImage.addEventListener('click', () => onImageClick(cardData));

  return cardElement;
}

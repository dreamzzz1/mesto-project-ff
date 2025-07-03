import { createCard, handleDeleteCard, handleLikeCard } from './components/card.js';
import { openModal, closeModal, setOverlayClickHandler } from './components/modal.js';
import { initialCards } from './cards.js';
import './pages/index.css';
import { enableValidation, clearValidation } from './components/validation.js';
import { getUserInfo, getInitialCards, updateUserInfo, addNewCard, deleteCard, likeCard, unlikeCard, updateUserAvatar } from './components/api.js';

const profileEditPopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

const profileEditOpenBtn = document.querySelector('.profile__edit-button');
const addCardOpenBtn = document.querySelector('.profile__add-button');

const placesList = document.querySelector('.places__list');

const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__avatar');

const profileEditForm = profileEditPopup.querySelector('form[name="edit-profile"]');
const addCardForm = addCardPopup.querySelector('form[name="new-place"]');

const nameInput = profileEditForm.querySelector('.popup__input_type_name');
const descriptionInput = profileEditForm.querySelector('.popup__input_type_description');

const cardNameInput = addCardForm.querySelector('.popup__input_type_card-name'); 
const cardLinkInput = addCardForm.querySelector('.popup__input_type_url');

const imagePopupImg = imagePopup.querySelector('.popup__image');
const imagePopupCaption = imagePopup.querySelector('.popup__caption');

let userId = null;

setOverlayClickHandler();

profileEditOpenBtn.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  clearValidation(profileEditForm, validationConfig);
  openModal(profileEditPopup);
});

profileEditForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const saveButton = profileEditForm.querySelector('.popup__button');
  saveButton.textContent = 'Сохранение...';

  updateUserInfo(nameInput.value, descriptionInput.value)
    .then((userData) => {
      profileName.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(profileEditPopup);
    })
    .catch((err) => console.error(err))
    .finally(() => {
      saveButton.textContent = 'Сохранить';
    });
});

addCardOpenBtn.addEventListener('click', () => {
  addCardForm.reset();
  clearValidation(addCardForm, validationConfig);
  openModal(addCardPopup);
});

addCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const saveButton = addCardForm.querySelector('.popup__button');
  saveButton.textContent = 'Сохранение...';

  addNewCard(cardNameInput.value, cardLinkInput.value)
    .then((cardData) => {
      const newCard = createCard(cardData, {
        userId,
        onDelete: handleDeleteCard,
        onLike: handleLikeCard,
        onImageClick: openImagePopup,
      });
      placesList.prepend(newCard);
      closeModal(addCardPopup);
    })
    .catch((err) => console.error(err))
    .finally(() => {
      saveButton.textContent = 'Создать';
    });
});

function openImagePopup(cardData) {
  imagePopupImg.src = cardData.link;
  imagePopupImg.alt = cardData.name;
  imagePopupCaption.textContent = cardData.name;
  openModal(imagePopup);
}

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

enableValidation(validationConfig);

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    userId = userData._id; 

    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    if (userData.avatar) {
      profileAvatar.src = userData.avatar;
      profileAvatar.alt = userData.name;
    }

    cards.reverse().forEach((cardData) => {
      const cardElement = createCard(cardData, {
        userId,
        onDelete: handleDeleteCard,
        onLike: handleLikeCard,
        onImageClick: openImagePopup,
      });
      placesList.append(cardElement);
    });
  })
  .catch((err) => console.error('Ошибка:', err));

import { createCard } from './components/card.js';
import { openModal, closeModal, setOverlayClickHandler } from './components/modal.js';
import './pages/index.css';
import { enableValidation, clearValidation } from './components/validation.js';
import {
  getUserInfo,
  getInitialCards,
  updateUserInfo,
  addNewCard,
  deleteCard,
  likeCard,
  unlikeCard,
  updateUserAvatar
} from './components/api.js';

const profileEditPopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const editAvatarPopup = document.querySelector('.popup_type_edit-avatar');

const profileEditOpenBtn = document.querySelector('.profile__edit-button');
const addCardOpenBtn = document.querySelector('.profile__add-button');
const profileAvatar = document.querySelector('.profile__avatar');
const profileAvatarEditBtn = document.querySelector('.profile__avatar-edit-button');

const placesList = document.querySelector('.places__list');

const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const profileEditForm = profileEditPopup.querySelector('form[name="edit-profile"]');
const addCardForm = addCardPopup.querySelector('form[name="new-place"]');
const editAvatarForm = editAvatarPopup.querySelector('form[name="edit-avatar"]');

const nameInput = profileEditForm.querySelector('.popup__input_type_name');
const descriptionInput = profileEditForm.querySelector('.popup__input_type_description');
const cardNameInput = addCardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = addCardForm.querySelector('.popup__input_type_url');
const avatarUrlInput = editAvatarForm.querySelector('.popup__input_type_avatar-url');
const avatarSaveButton = editAvatarForm.querySelector('.popup__button');

const imagePopupImg = imagePopup.querySelector('.popup__image');
const imagePopupCaption = imagePopup.querySelector('.popup__caption');

let userId = null;

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

function openImagePopup(cardData) {
  imagePopupImg.src = cardData.link;
  imagePopupImg.alt = cardData.name;
  imagePopupCaption.textContent = cardData.name;
  openModal(imagePopup);
}

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
        onDelete: (cardId, cardElement) => {
          deleteCard(cardId)
            .then(() => cardElement.remove())
            .catch((err) => console.error('Ошибка при удалении карточки:', err));
        },
        onLike: (cardId, isLiked, updateLikeView) => {
          const likeAction = isLiked ? unlikeCard : likeCard;
          likeAction(cardId)
            .then((updatedCard) => updateLikeView(updatedCard.likes))
            .catch((err) => console.error('Ошибка при постановке/снятии лайка:', err));
        },
        onImageClick: openImagePopup
      });

      placesList.prepend(newCard);
      closeModal(addCardPopup);
    })
    .catch((err) => console.error(err))
    .finally(() => {
      saveButton.textContent = 'Создать';
    });
});

profileAvatarEditBtn.addEventListener('click', () => {
  editAvatarForm.reset();
  clearValidation(editAvatarForm, validationConfig);
  openModal(editAvatarPopup);
});

editAvatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  avatarSaveButton.textContent = 'Сохранение...';

  updateUserAvatar(avatarUrlInput.value)
    .then((userData) => {
      profileAvatar.src = userData.avatar;
      profileAvatar.alt = userData.name;
      closeModal(editAvatarPopup);
    })
    .catch((err) => console.error('Ошибка при обновлении аватара:', err))
    .finally(() => {
      avatarSaveButton.textContent = 'Сохранить';
    });
});

enableValidation(validationConfig);
setOverlayClickHandler();

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    userId = userData._id;
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.src = userData.avatar;
    profileAvatar.alt = userData.name;

    cards.reverse().forEach((cardData) => {
      const cardElement = createCard(cardData, {
        userId,
        onDelete: (cardId, cardElement) => {
          deleteCard(cardId)
            .then(() => cardElement.remove())
            .catch((err) => console.error('Ошибка при удалении карточки:', err));
        },
        onLike: (cardId, isLiked, updateLikeView) => {
          const likeAction = isLiked ? unlikeCard : likeCard;
          likeAction(cardId)
            .then((updatedCard) => updateLikeView(updatedCard.likes))
            .catch((err) => console.error('Ошибка при постановке/снятии лайка:', err));
        },
        onImageClick: openImagePopup
      });

      placesList.append(cardElement);
    });
  })
  .catch((err) => console.error('Ошибка загрузки:', err));

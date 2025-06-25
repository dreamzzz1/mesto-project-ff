import { createCard, handleDeleteCard, handleLikeCard } from './components/card.js';
import { openModal, closeModal, setOverlayClickHandler } from './components/modal.js';
import { initialCards } from './cards.js';
import './pages/index.css';


import logo from './images/logo.svg';
import avatar from './images/avatar.jpg';

document.querySelector('.logo').src = logo;
document.querySelector('.profile__image').style.backgroundImage = `url(${avatar})`;

const profileEditPopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

const profileEditOpenBtn = document.querySelector('.profile__edit-button');
const addCardOpenBtn = document.querySelector('.profile__add-button');

const placesList = document.querySelector('.places__list');

const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const profileEditForm = profileEditPopup.querySelector('form[name="edit-profile"]');
const addCardForm = addCardPopup.querySelector('form[name="new-place"]');

const nameInput = profileEditForm.querySelector('.popup__input_type_name');
const descriptionInput = profileEditForm.querySelector('.popup__input_type_description');

const imagePopupImg = imagePopup.querySelector('.popup__image');
const imagePopupCaption = imagePopup.querySelector('.popup__caption');

setOverlayClickHandler();

profileEditOpenBtn.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  openModal(profileEditPopup);
});

profileEditForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;
  closeModal(profileEditPopup);
});

addCardOpenBtn.addEventListener('click', () => {
  addCardForm.reset();
  openModal(addCardPopup);
});

addCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const cardName = addCardForm.querySelector('.popup__input_type_card-name').value;
  const cardLink = addCardForm.querySelector('.popup__input_type_url').value;

  const newCard = createCard({ name: cardName, link: cardLink }, {
    onDelete: handleDeleteCard,
    onLike: handleLikeCard,
    onImageClick: openImagePopup,
  });

  placesList.prepend(newCard);
  closeModal(addCardPopup);
});

function openImagePopup(cardData) {
  imagePopupImg.src = cardData.link;
  imagePopupImg.alt = cardData.name;
  imagePopupCaption.textContent = cardData.name;
  openModal(imagePopup);
}



const fragment = document.createDocumentFragment();
initialCards.forEach(cardData => {
  const cardElement = createCard(cardData, {
    onDelete: handleDeleteCard,
    onLike: handleLikeCard,
    onImageClick: openImagePopup,
  });
  fragment.append(cardElement);
});
placesList.append(fragment);
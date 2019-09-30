import * as ValidationMessages from '../constants/ValidationMessages';
import { store } from 'react-notifications-component';

export let hasForbiddenCharacters = (filename) => {
  let HasForbiddenCharacters = filename.match(/^([0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ])+$/);
  if (!HasForbiddenCharacters) {
    store.addNotification({
      title: "Error",
      message: ValidationMessages.filename.hasForbiddenCharacters,
      type: "danger",
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "flipInX"],
      animationOut: ["animated", "flipOutX"],
      dismiss: {
        duration: 5000,
        onScreen: true
      }
    });
  }

  let startsWithDot = filename.match(/^\./);
  if (startsWithDot) {
    throw new Error(ValidationMessages.filename.startsWithDot);
  }

  let equalsForbiddenFilenames = filename.match(/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i);
  if (equalsForbiddenFilenames) {
    throw new Error(ValidationMessages.filename.forbidden);
  }

  return true;
}

export let hasValidExtension = (filename) => {
  let extension = filename.match(/\.[A-Za-z]{2,}$/);
  if (!extension) {
    throw new Error(ValidationMessages.filename.invalidExtension);
  }

  return true;
}

export let validateName = (filename) => {
  let isValid = false;

  isValid = hasForbiddenCharacters(filename);
  isValid = hasValidExtension(filename);

  return isValid;
}
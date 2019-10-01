import * as ValidationMessages from '../constants/ValidationMessages';
import * as ReactNotificationConstants from '../constants/ReactNotifications';
import * as ReactNotificationsHelper from '../helpers/ReactNotificationsHelper';

export let hasForbiddenCharacters = (newName, itemType = 'File name') => {
  let HasForbiddenCharacters = newName.match(/^([0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ])+$/);
  if (!HasForbiddenCharacters) {
    ReactNotificationsHelper.addNewNotification(
      ReactNotificationConstants.type.error,
      `${itemType} ${ValidationMessages.name.hasForbiddenCharacters}`
    );

    return true;
  }

  let startsWithDot = newName.match(/^\./);
  if (startsWithDot) {
    ReactNotificationsHelper.addNewNotification(
      ReactNotificationConstants.type.error,
      `${itemType} ${ValidationMessages.name.startsWithDot}`
    );

    return true;
  }

  let equalsForbiddennewNames = newName.match(/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i);
  if (equalsForbiddennewNames) {
    ReactNotificationsHelper.addNewNotification(
      ReactNotificationConstants.type.error,
      `${itemType} ${ValidationMessages.name.forbidden}`
    );

    return true;
  }

  return false;
}

export let hasInvalidExtension = (filename) => {
  let extension = filename.match(/\.[a-zA-Z]{2,}$/);
  if (!extension) {
    ReactNotificationsHelper.addNewNotification(
      ReactNotificationConstants.type.error,
      ValidationMessages.filename.invalidExtension
    );

    return true;
  }

  return false;
}
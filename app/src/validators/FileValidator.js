import * as ValidationMessages from '../constants/ValidationMessages';
import * as ReactNotificationConstants from '../constants/ReactNotifications';
import * as ReactNotificationsHelper from '../helpers/ReactNotificationsHelper';

export let hasForbiddenCharacters = (filename) => {
  let HasForbiddenCharacters = filename.match(/^([0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ])+$/);
  if (!HasForbiddenCharacters) {
    ReactNotificationsHelper.addNewNotification(
      ReactNotificationConstants.type.error,
      ValidationMessages.filename.hasForbiddenCharacters
    );

    return true;
  }

  let startsWithDot = filename.match(/^\./);
  if (startsWithDot) {
    ReactNotificationsHelper.addNewNotification(
      ReactNotificationConstants.type.error,
      ValidationMessages.filename.startsWithDot
    );

    return true;
  }

  let equalsForbiddenFilenames = filename.match(/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i);
  if (equalsForbiddenFilenames) {
    ReactNotificationsHelper.addNewNotification(
      ReactNotificationConstants.type.error,
      ValidationMessages.filename.forbidden
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
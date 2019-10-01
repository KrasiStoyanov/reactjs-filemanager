import * as ValidationMessages from '../constants/ValidationMessages';
import * as ReactNotificationConstants from '../constants/ReactNotifications';
import * as ReactNotificationsHelper from '../helpers/ReactNotificationsHelper';

export let isNullOrEmpty = (string, itemType) => {
  if (string === null || string === undefined || string.length <= 0) {
    ReactNotificationsHelper.addNewNotification(
      ReactNotificationConstants.type.error,
      `${itemType} ${ValidationMessages.nullOrEmpty}`
    );

    return true;
  }

  return false;
};
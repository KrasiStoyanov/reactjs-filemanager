import { store } from 'react-notifications-component';

import * as ReactNotificationConstants from '../constants/ReactNotifications';

let _id = 0;
let generateNewId = () => {
  let idCopy = _id;
  _id++;

  return idCopy;
}

export let addNewNotification = (type, message) => {
  let notificationSettings = Object.assign({}, ReactNotificationConstants.defaultSettings);

  notificationSettings.id = generateNewId();
  notificationSettings.message = message;
  notificationSettings.type = type;

  switch (type) {
    case ReactNotificationConstants.type.success:
      notificationSettings.title = "Success";
      notificationSettings.dismiss.duration = ReactNotificationConstants.durationBasedOnType.success;

      break;
    case ReactNotificationConstants.type.error:
      notificationSettings.title = "Error";
      notificationSettings.dismiss.duration = ReactNotificationConstants.durationBasedOnType.error;

      break;
    case ReactNotificationConstants.type.info:
      notificationSettings.title = "Important";
      notificationSettings.dismiss.duration = ReactNotificationConstants.durationBasedOnType.info;

      break;
    case ReactNotificationConstants.type.default:
      notificationSettings.title = "Attention";
      notificationSettings.dismiss.duration = ReactNotificationConstants.durationBasedOnType.default;

      break;
    case ReactNotificationConstants.type.warning:
      notificationSettings.title = "Warning";
      notificationSettings.dismiss.duration = ReactNotificationConstants.durationBasedOnType.warning;

      break;
    default:
      console.log('fucked smth up');

      break;
  }

  store.addNotification(notificationSettings);
}
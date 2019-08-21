import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';

const checkPermission = async () => {
  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
    getToken();
  } else {
    requestPermission();
  }
};

const getToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {
    fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      await AsyncStorage.setItem('fcmToken', fcmToken);
    }
  }
};

const requestPermission = async () => {
  try {
    await firebase.messaging().requestPermission();
    getToken();
  } catch (error) {
    console.log('permission rejected');
  }
};

const createNotificationListeners = async () => {
  /**
   * Triggered when a particular notification has been received in foreground
   */
  firebase.notifications().onNotification(notification => {
    notification.android
      .setChannelId('fcm_default_channel')
      .setSound('default');
    firebase.notifications().displayNotification(notification);
    console.log('onNotification: ', notification);
  });

  /**
   * If your app is in foreground or background, you can listen for when a notification is clicked / tapped / opened as follows:
   */
  firebase.notifications().onNotificationOpened(notificationOpen => {
    console.log('onNotificationOpened: ', notificationOpen);
  });

  /*
   * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
   * */
  const notificationOpen = await firebase
    .notifications()
    .getInitialNotification();
  if (notificationOpen) {
    console.log('getInitialNotification: ', notificationOpen);
  }

  /*
   * Triggered for data only payload in foreground
   * */
  firebase.messaging().onMessage(message => {
    console.log('onMessage: ', JSON.stringify(message));
  });
};

export default {
  checkPermission,
  createNotificationListeners,
};

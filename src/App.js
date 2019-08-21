import React, { useEffect } from 'react';

import { View, Text } from 'react-native';
import { notification } from '../src/services';

const App = () => {
  useEffect(() => {
    notification.checkPermission();
    notification.createNotificationListeners();

    return () => {
      //notification.notificationListener();
      //notification.notificationOpenedListener();
      //notification.messageListener();
    };
  });
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Notificações</Text>
    </View>
  );
};

export default App;

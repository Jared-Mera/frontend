import React from 'react';
import Alert from './Alert';
import { useApp } from '../../context/AppContext';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useApp();

  if (!notifications.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      {notifications.map(notification => (
        <Alert
          key={notification.id}
          variant={notification.type}
          onClose={() => removeNotification(notification.id)}
          className="animate-fadeIn"
        >
          {notification.message}
        </Alert>
      ))}
    </div>
  );
};

export default NotificationContainer;
import { Expo } from 'expo-server-sdk';

// Initialize the Expo SDK
const expo = new Expo();

/**
 * Send a notification to all users subscribed to the 'all_users' topic
 */
export const sendNotificationToAllUsers = async (title: string, body: string) => {
  // Create the message
  const message = {
    to: 'topic:all_users',
    sound: 'default',
    title,
    body,
    data: { withSome: 'data' },
  };

  // Send the message
  await expo.sendPushNotificationsAsync([message]);
}; 
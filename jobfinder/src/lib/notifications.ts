import PushToken from '@/models/PushToken';

interface NotificationMessage {
  title: string;
  body: string;
  data?: Record<string, any>;
}

/**
 * Send push notifications to all registered devices
 * @param message The notification message to send
 * @param tokens Optional array of specific tokens to send to (if not provided, sends to all active tokens)
 * @returns Object containing success status and results
 */
export async function sendPushNotifications(
  message: NotificationMessage,
  tokens?: string[]
) {
  try {
    // If specific tokens were provided, use those
    // Otherwise, fetch all active tokens from the database
    let pushTokens: string[] = tokens || [];
    
    if (!tokens || tokens.length === 0) {
      const tokenDocs = await PushToken.find({ active: true });
      pushTokens = tokenDocs.map(doc => doc.token);
    }
    
    if (pushTokens.length === 0) {
      return {
        success: true,
        message: 'No active push tokens found',
        sent: 0
      };
    }
    
    // Prepare the messages for the Expo push notification service
    const messages = pushTokens.map(token => ({
      to: token,
      sound: 'default',
      title: message.title,
      body: message.body,
      data: message.data || {},
    }));
    
    // Send the notifications in batches (Expo has a limit of 100 per request)
    const batchSize = 100;
    const results = [];
    
    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize);
      
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batch),
      });
      
      const result = await response.json();
      results.push(result);
    }
    
    return {
      success: true,
      message: `Successfully sent ${pushTokens.length} notifications`,
      sent: pushTokens.length,
      results
    };
  } catch (error) {
    console.error('Error sending push notifications:', error);
    return {
      success: false,
      message: 'Failed to send push notifications',
      error: error instanceof Error ? error.message : String(error)
    };
  }
} 
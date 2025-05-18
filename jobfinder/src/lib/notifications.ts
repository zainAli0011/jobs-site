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
  console.log('📱 [NOTIFICATIONS] Starting push notification process');
  console.log('📱 [NOTIFICATIONS] Message:', { title: message.title, body: message.body, dataKeys: Object.keys(message.data || {}) });
  
  try {
    // If specific tokens were provided, use those
    // Otherwise, fetch all active tokens from the database
    let pushTokens: string[] = tokens || [];
    
    if (!tokens || tokens.length === 0) {
      console.log('🔍 [NOTIFICATIONS] No specific tokens provided, fetching active tokens from database');
      const startTime = Date.now();
      const tokenDocs = await PushToken.find({ active: true });
      const endTime = Date.now();
      
      console.log(`⏱️ [NOTIFICATIONS] Database query took ${endTime - startTime}ms`);
      console.log(`📋 [NOTIFICATIONS] Found ${tokenDocs.length} active tokens in database`);
      
      // Log a sample of token IDs if any exist (for debugging)
      if (tokenDocs.length > 0) {
        const sampleTokens = tokenDocs.slice(0, Math.min(3, tokenDocs.length));
        console.log('🔑 [NOTIFICATIONS] Sample token IDs:', sampleTokens.map(doc => doc._id));
      }
      
      pushTokens = tokenDocs.map(doc => doc.token);
    } else {
      console.log(`📋 [NOTIFICATIONS] Using ${pushTokens.length} provided tokens`);
    }
    
    if (pushTokens.length === 0) {
      console.log('⚠️ [NOTIFICATIONS] No active push tokens found, aborting');
      return {
        success: true,
        message: 'No active push tokens found',
        sent: 0
      };
    }
    
    console.log(`🔢 [NOTIFICATIONS] Preparing to send to ${pushTokens.length} devices`);
    
    // Prepare the messages for the Expo push notification service
    const messages = pushTokens.map(token => ({
      to: token,
      sound: 'default',
      title: message.title,
      body: message.body,
      data: message.data || {},
    }));
    
    console.log(`📦 [NOTIFICATIONS] Created ${messages.length} message objects`);
    
    // Send the notifications in batches (Expo has a limit of 100 per request)
    const batchSize = 100;
    const results = [];
    const batchCount = Math.ceil(messages.length / batchSize);
    
    console.log(`🔄 [NOTIFICATIONS] Will send in ${batchCount} batches (max ${batchSize} per batch)`);
    
    for (let i = 0; i < messages.length; i += batchSize) {
      const batchNumber = Math.floor(i / batchSize) + 1;
      const batch = messages.slice(i, i + batchSize);
      
      console.log(`📤 [NOTIFICATIONS] Sending batch ${batchNumber}/${batchCount} with ${batch.length} messages`);
      
      const startTime = Date.now();
      
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batch),
      });
      
      const endTime = Date.now();
      console.log(`⏱️ [NOTIFICATIONS] Batch ${batchNumber} API call took ${endTime - startTime}ms`);
      
      const result = await response.json();
      console.log(`✅ [NOTIFICATIONS] Batch ${batchNumber} response:`, result);
      
      results.push(result);
    }
    
    console.log(`🎉 [NOTIFICATIONS] All batches sent successfully to ${pushTokens.length} devices`);
    
    return {
      success: true,
      message: `Successfully sent ${pushTokens.length} notifications`,
      sent: pushTokens.length,
      results
    };
  } catch (error) {
    console.error('❌ [NOTIFICATIONS] Error sending push notifications:', error);
    if (error instanceof Error) {
      console.error('❌ [NOTIFICATIONS] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return {
      success: false,
      message: 'Failed to send push notifications',
      error: error instanceof Error ? error.message : String(error)
    };
  }
} 
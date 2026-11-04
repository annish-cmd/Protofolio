/**
 * ============================================================================
 * UNIVERSAL WHATSAPP HANDLER
 * ============================================================================
 * Cross-platform WhatsApp integration that works on:
 * - Android mobile app & browser
 * - iOS mobile app & browser
 * - Windows/Mac desktop apps & browsers
 * - WhatsApp Web/Desktop
 * - Flutter WebView (external launch)
 * ============================================================================
 */

const WHATSAPP_CONFIG = {
  // Business WhatsApp number for orders (international format without +)
  BUSINESS_NUMBER: '9779763690362',

  // WhatsApp group invite link for general chat
  GROUP_URL: 'https://chat.whatsapp.com/BgjdHugKar5CXt8mFNxq2h',

  // Flutter WebView detection
  isFlutterWebView: () => {
    return window.flutter_inappwebview !== undefined ||
           window.flutter !== undefined ||
           navigator.userAgent.includes('Flutter');
  },

  // Platform detection
  getPlatform: () => {
    const ua = navigator.userAgent.toLowerCase();
    return {
      isAndroid: /android/i.test(ua),
      isIOS: /iphone|ipad|ipod/i.test(ua),
      isMobile: /android|iphone|ipad|ipod|mobile/i.test(ua),
      isTablet: /ipad|android(?!.*mobile)/i.test(ua),
      isDesktop: !(/android|iphone|ipad|ipod|mobile/i.test(ua)),
      isWindows: /windows/i.test(ua),
      isMac: /macintosh|mac os x/i.test(ua)
    };
  }
};

/**
 * Send order message to WhatsApp
 * @param {string} message - Pre-formatted order message
 * @param {boolean} directClick - Whether triggered by direct user click (for popup blocker)
 */
function sendWhatsAppOrder(message, directClick = true) {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_CONFIG.BUSINESS_NUMBER}?text=${encodedMessage}`;

  openWhatsAppLink(whatsappUrl, directClick);
}

/**
 * Open WhatsApp group chat
 * @param {Event} event - Click event (if called from onclick)
 */
function openWhatsAppGroup(event) {
  if (event) event.preventDefault();
  openWhatsAppLink(WHATSAPP_CONFIG.GROUP_URL, true);
}

/**
 * Universal WhatsApp link opener - handles all platforms correctly
 * @param {string} whatsappUrl - Full WhatsApp URL (wa.me or chat.whatsapp.com)
 * @param {boolean} directClick - Whether this is from a direct user click
 */
function openWhatsAppLink(whatsappUrl, directClick = true) {
  const platform = WHATSAPP_CONFIG.getPlatform();
  const isFlutter = WHATSAPP_CONFIG.isFlutterWebView();

  console.log('[WhatsApp] Opening link:', { platform, isFlutter, url: whatsappUrl });

  // FLUTTER WEBVIEW: Post message to Flutter app to launch externally
  if (isFlutter) {
    try {
      // Try Flutter InAppWebView postMessage
      if (window.flutter_inappwebview?.callHandler) {
        window.flutter_inappwebview.callHandler('openWhatsApp', whatsappUrl);
        return;
      }

      // Try Flutter web channel
      if (window.flutter?.postMessage) {
        window.flutter.postMessage(JSON.stringify({
          action: 'openWhatsApp',
          url: whatsappUrl
        }));
        return;
      }

      // Fallback: Try postMessage to parent
      window.parent.postMessage({
        type: 'OPEN_WHATSAPP',
        url: whatsappUrl
      }, '*');

      // Also attempt direct navigation as fallback
      setTimeout(() => {
        window.location.href = whatsappUrl;
      }, 500);

    } catch (error) {
      console.error('[WhatsApp] Flutter handler error:', error);
      // Fallback to direct navigation
      window.location.href = whatsappUrl;
    }
    return;
  }

  // ANDROID: Use intent URI for reliable app opening
  if (platform.isAndroid) {
    try {
      // Extract the path from the URL for intent
      let intentPath = '';

      if (whatsappUrl.includes('wa.me/')) {
        // For wa.me links, extract phone and text
        const urlObj = new URL(whatsappUrl);
        const phone = urlObj.pathname.replace(/^\//, '');
        const text = urlObj.searchParams.get('text') || '';
        intentPath = `send?phone=${phone}&text=${encodeURIComponent(text)}`;
      } else if (whatsappUrl.includes('chat.whatsapp.com/')) {
        // For group links, extract the invite code
        const inviteCode = whatsappUrl.split('chat.whatsapp.com/')[1].split('?')[0];
        intentPath = `accept?code=${inviteCode}`;
      }

      // Build Android intent URI with web fallback
      const intentUri =
        `intent://send/${intentPath}#Intent;` +
        `scheme=https;` +
        `package=com.whatsapp;` +
        `S.browser_fallback_url=${encodeURIComponent(whatsappUrl)};` +
        `end`;

      window.location.href = intentUri;

    } catch (error) {
      console.error('[WhatsApp] Android intent error:', error);
      // Fallback to direct URL
      window.location.href = whatsappUrl;
    }
    return;
  }

  // iOS: Use universal link (opens app if installed, web otherwise)
  if (platform.isIOS) {
    // iOS handles universal links automatically
    window.location.href = whatsappUrl;
    return;
  }

  // DESKTOP: Open in new tab/window
  if (platform.isDesktop) {
    // Use window.open for desktop to open WhatsApp Web/Desktop
    if (directClick) {
      // Direct user click - won't be blocked
      const whatsappWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Check if popup was blocked
      if (!whatsappWindow || whatsappWindow.closed || typeof whatsappWindow.closed === 'undefined') {
        console.warn('[WhatsApp] Popup blocked, using location.href');
        window.location.href = whatsappUrl;
      }
    } else {
      // Not a direct click - use location to avoid popup blocker
      window.location.href = whatsappUrl;
    }
    return;
  }

  // FALLBACK: Direct navigation for any other case
  window.location.href = whatsappUrl;
}

/**
 * Build formatted order message from cart
 * @param {Array} cart - Shopping cart items
 * @returns {string} Formatted WhatsApp message
 */
function buildOrderMessage(cart) {
  if (!cart || cart.length === 0) {
    return '';
  }

  let message = "Hello! I would like to place an order. Here are my requested products:\n\n";
  let grandTotal = 0;

  // Get base URL for product links
  const baseUrl = window.location.origin + window.location.pathname.replace(/html\/.*$/, '');

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    grandTotal += subtotal;

    // Build product URL if image path exists
    const productUrl = item.img ? baseUrl + item.img : 'N/A';

    message += `${index + 1}. *${item.name}*\n`;
    message += `   Price: Rs. ${item.price.toLocaleString()}\n`;
    message += `   Quantity: ${item.quantity}\n`;
    message += `   Subtotal: Rs. ${subtotal.toLocaleString()}\n`;

    if (productUrl !== 'N/A') {
      message += `   Product Link: ${productUrl}\n`;
    }

    message += '\n';
  });

  message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
  message += `*GRAND TOTAL: Rs. ${grandTotal.toLocaleString()}*\n`;
  message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
  message += "Dear Marketing Team,\n\n";
  message += "Please confirm the availability of these products and let me know about delivery options.\n\n";
  message += "Thank you!\n";

  return message;
}

/**
 * Legacy function name for compatibility with existing onclick handlers
 */
function openWhatsApp(event) {
  openWhatsAppGroup(event);
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sendWhatsAppOrder,
    openWhatsAppGroup,
    openWhatsAppLink,
    buildOrderMessage,
    WHATSAPP_CONFIG
  };
}

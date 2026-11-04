// ============================================================================
// FLUTTER WEBVIEW + WHATSAPP INTEGRATION EXAMPLE
// ============================================================================
// This file shows how to integrate the website's WhatsApp ordering system
// into a Flutter application using flutter_inappwebview and url_launcher.
// ============================================================================

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:url_launcher/url_launcher.dart';

/// Example Flutter page that loads the website in a WebView
/// and handles WhatsApp ordering externally
class WebsiteWebViewPage extends StatefulWidget {
  const WebsiteWebViewPage({Key? key}) : super(key: key);

  @override
  State<WebsiteWebViewPage> createState() => _WebsiteWebViewPageState();
}

class _WebsiteWebViewPageState extends State<WebsiteWebViewPage> {
  InAppWebViewController? _webViewController;
  double _progress = 0;
  bool _isLoading = true;

  // Your website URL
  static const String websiteUrl = 'https://your-website-domain.com';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Recognized IT Solution'),
        actions: [
          if (_isLoading)
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              ),
            ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              _webViewController?.reload();
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Progress indicator
          if (_progress < 1.0)
            LinearProgressIndicator(
              value: _progress,
              backgroundColor: Colors.grey[200],
              valueColor: const AlwaysStoppedAnimation<Color>(Colors.blue),
            ),

          // WebView
          Expanded(
            child: InAppWebView(
              initialUrlRequest: URLRequest(
                url: WebUri(websiteUrl),
              ),
              initialSettings: InAppWebViewSettings(
                javaScriptEnabled: true,
                javaScriptCanOpenWindowsAutomatically: false,
                domStorageEnabled: true,
                databaseEnabled: true,
                useHybridComposition: true,
                allowFileAccessFromFileURLs: false,
                allowUniversalAccessFromFileURLs: false,
                mediaPlaybackRequiresUserGesture: false,
                thirdPartyCookiesEnabled: true,
              ),

              // WebView created callback
              onWebViewCreated: (controller) {
                _webViewController = controller;

                // ========================================================
                // REGISTER WHATSAPP HANDLER
                // ========================================================
                // This handler receives calls from the website's
                // whatsapp-handler.js when the user clicks order button
                controller.addJavaScriptHandler(
                  handlerName: 'openWhatsApp',
                  callback: (args) async {
                    if (args.isNotEmpty) {
                      final String whatsappUrl = args[0].toString();
                      debugPrint('[Flutter] Received WhatsApp URL: $whatsappUrl');
                      await _launchWhatsAppExternal(whatsappUrl);
                    }
                  },
                );

                // Add generic postMessage listener as fallback
                controller.addJavaScriptHandler(
                  handlerName: 'flutterPostMessage',
                  callback: (args) async {
                    if (args.isNotEmpty) {
                      try {
                        final data = jsonDecode(args[0].toString());
                        if (data['action'] == 'openWhatsApp') {
                          await _launchWhatsAppExternal(data['url']);
                        }
                      } catch (e) {
                        debugPrint('[Flutter] Error parsing message: $e');
                      }
                    }
                  },
                );
              },

              // Page loading progress
              onProgressChanged: (controller, progress) {
                setState(() {
                  _progress = progress / 100;
                  _isLoading = progress < 100;
                });
              },

              // Page load completed
              onLoadStop: (controller, url) {
                setState(() {
                  _isLoading = false;
                });
              },

              // Handle external URL requests
              shouldOverrideUrlLoading: (controller, navigationAction) async {
                final url = navigationAction.request.url.toString();

                // Intercept WhatsApp URLs and open externally
                if (url.startsWith('https://wa.me/') ||
                    url.startsWith('https://api.whatsapp.com/') ||
                    url.startsWith('https://chat.whatsapp.com/') ||
                    url.startsWith('whatsapp://')) {
                  debugPrint('[Flutter] Intercepting WhatsApp URL: $url');
                  await _launchWhatsAppExternal(url);
                  return NavigationActionPolicy.CANCEL;
                }

                // Allow navigation to same-origin URLs
                if (url.startsWith(websiteUrl)) {
                  return NavigationActionPolicy.ALLOW;
                }

                // Open external links in system browser
                if (url.startsWith('http://') || url.startsWith('https://')) {
                  await _launchUrlExternal(url);
                  return NavigationActionPolicy.CANCEL;
                }

                return NavigationActionPolicy.ALLOW;
              },

              // Console message logging (useful for debugging)
              onConsoleMessage: (controller, consoleMessage) {
                debugPrint('[WebView Console] ${consoleMessage.message}');
              },

              // Handle errors
              onLoadError: (controller, url, code, message) {
                debugPrint('[WebView Error] $message');
                _showErrorSnackbar('Failed to load page');
              },
            ),
          ),
        ],
      ),
    );
  }

  /// Launch WhatsApp URL externally using url_launcher
  Future<void> _launchWhatsAppExternal(String whatsappUrl) async {
    try {
      final Uri uri = Uri.parse(whatsappUrl);

      // Try to launch in external application mode
      final bool launched = await launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      );

      if (!launched) {
        debugPrint('[Flutter] Failed to launch WhatsApp');
        _showErrorSnackbar('Could not open WhatsApp');
      } else {
        debugPrint('[Flutter] Successfully launched WhatsApp');
      }
    } catch (e) {
      debugPrint('[Flutter] Error launching WhatsApp: $e');
      _showErrorSnackbar('Error opening WhatsApp: $e');
    }
  }

  /// Launch external URL in system browser
  Future<void> _launchUrlExternal(String url) async {
    try {
      final Uri uri = Uri.parse(url);
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } catch (e) {
      debugPrint('[Flutter] Error launching URL: $e');
    }
  }

  /// Show error snackbar
  void _showErrorSnackbar(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        duration: const Duration(seconds: 3),
      ),
    );
  }
}

// ============================================================================
// PUBSPEC.YAML DEPENDENCIES
// ============================================================================
/*

dependencies:
  flutter:
    sdk: flutter

  # WebView with JavaScript handler support
  flutter_inappwebview: ^6.0.0

  # Launch external URLs and apps
  url_launcher: ^6.2.1

*/

// ============================================================================
// ANDROID MANIFEST CONFIGURATION
// ============================================================================
/*

<!-- android/app/src/main/AndroidManifest.xml -->

<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Internet permission -->
    <uses-permission android:name="android.permission.INTERNET"/>

    <!-- Query for WhatsApp apps -->
    <queries>
        <!-- Regular WhatsApp -->
        <package android:name="com.whatsapp" />

        <!-- WhatsApp Business -->
        <package android:name="com.whatsapp.w4b" />

        <!-- Allow opening any HTTPS URLs -->
        <intent>
            <action android:name="android.intent.action.VIEW" />
            <data android:scheme="https" />
        </intent>
    </queries>

    <application>
        <!-- Your app configuration -->
    </application>
</manifest>

*/

// ============================================================================
// IOS INFO.PLIST CONFIGURATION
// ============================================================================
/*

<!-- ios/Runner/Info.plist -->

<dict>
    <!-- Allow opening WhatsApp -->
    <key>LSApplicationQueriesSchemes</key>
    <array>
        <string>whatsapp</string>
        <string>https</string>
    </array>

    <!-- Other configurations -->
</dict>

*/

// ============================================================================
// USAGE IN YOUR FLUTTER APP
// ============================================================================
/*

import 'flutter_integration_example.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Recognized IT Solution',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const WebsiteWebViewPage(),
    );
  }
}

*/

// ============================================================================
// TESTING CHECKLIST
// ============================================================================
/*

✅ Android Testing:
  - [ ] Website loads in WebView
  - [ ] Can browse all pages
  - [ ] Add products to cart
  - [ ] Click "Order via WhatsApp" button
  - [ ] WhatsApp app opens externally (not in WebView)
  - [ ] Order message is pre-filled correctly
  - [ ] Can return to app after WhatsApp
  - [ ] Cart persists after returning

✅ iOS Testing:
  - [ ] Website loads in WebView
  - [ ] Can browse all pages
  - [ ] Add products to cart
  - [ ] Click "Order via WhatsApp" button
  - [ ] WhatsApp app opens externally
  - [ ] Order message is pre-filled correctly
  - [ ] Can return to app after WhatsApp
  - [ ] Cart persists after returning

✅ Edge Cases:
  - [ ] WhatsApp not installed (should open WhatsApp Web)
  - [ ] Network error handling
  - [ ] Back button navigation
  - [ ] App backgrounding and foregrounding
  - [ ] Deep linking back to app

*/

// ============================================================================
// TROUBLESHOOTING
// ============================================================================
/*

Problem: WhatsApp not opening on Android
Solution:
  - Add WhatsApp package to <queries> in AndroidManifest.xml
  - Ensure url_launcher has latest version
  - Check Android 11+ package visibility requirements

Problem: WhatsApp opens inside WebView instead of externally
Solution:
  - Implement shouldOverrideUrlLoading handler
  - Return NavigationActionPolicy.CANCEL for WhatsApp URLs
  - Launch with LaunchMode.externalApplication

Problem: JavaScript handler not receiving calls
Solution:
  - Ensure JavaScript is enabled in WebView settings
  - Check handler name matches website code
  - Verify whatsapp-handler.js is loaded in website
  - Check console logs for errors

Problem: Cart doesn't persist after returning from WhatsApp
Solution:
  - WebView uses localStorage which persists automatically
  - Ensure domStorageEnabled: true in settings
  - Don't clear WebView cache on resume

Problem: iOS not opening WhatsApp
Solution:
  - Add 'whatsapp' to LSApplicationQueriesSchemes in Info.plist
  - Use universal link format (https://wa.me/...)
  - Check iOS 9+ URL scheme whitelist

*/

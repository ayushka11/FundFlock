import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import "login_page.dart";

Future<String?> getAuthToken(BuildContext context) async {
  final prefs = await SharedPreferences.getInstance();

  // Try to retrieve the token
  final token = prefs.getString('token');

  // If token is null or empty, navigate to LoginPage
  if (token == null || token.isEmpty) {
    // Navigate to login page and remove all previous routes
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (context) => LoginPage()),
          (route) => false,
    );
    return null;
  }

  // Check if token is expired (optional)
  try {
    bool isExpired = isTokenExpired(token);
    if (isExpired) {
      // Clear the token
      await prefs.remove('token');
      await prefs.remove('username');
      await prefs.remove('email');
      await prefs.remove('user_id');
      // Navigate to login page
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (context) => LoginPage()),
            (route) => false,
      );
      return null;
    }
  } catch (e) {
    // If there's an error parsing the token, consider it invalid
    await prefs.remove('token');
    await prefs.remove('username');
    await prefs.remove('email');
    await prefs.remove('user_id');
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (context) => LoginPage()),
          (route) => false,
    );
    return null;
  }

  // Return the valid token
  return token;
}

// Helper function to check if a JWT token is expired
bool isTokenExpired(String token) {
  try {
    // Split the token to get the payload part
    final parts = token.split('.');
    if (parts.length != 3) {
      return true; // Not a valid JWT token format
    }

    // Decode the payload
    final payload = parts[1];
    final normalized = base64Url.normalize(payload);
    final decoded = utf8.decode(base64Url.decode(normalized));
    final Map<String, dynamic> data = json.decode(decoded);

    // Check the expiration time
    if (data.containsKey('exp')) {
      final exp = data['exp'];
      final expDate = DateTime.fromMillisecondsSinceEpoch(exp * 1000);
      return DateTime.now().isAfter(expDate);
    }
    return false; // No expiration time found
  } catch (e) {
    // If there's an error parsing the token, consider it invalid
    return true;
  }
}

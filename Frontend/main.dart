import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'login_page.dart';
import 'dart:convert';
import 'dart:async';
import 'landing_page.dart';


void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FundFlock App',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: FutureBuilder<bool>(
        future: checkUserLoggedIn(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError || !snapshot.hasData || !snapshot.data!) {
            return LoginPage();
          }

          return FundFlockApp();
        },
      ),
    );
  }

  Future<bool> checkUserLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token != null && token.isNotEmpty) {
      try {
        final parts = token.split('.');
        if (parts.length != 3) {
          return false;
        }

        String payload = parts[1];
        while (payload.length % 4 != 0) {
          payload += '=';
        }
        payload = payload.replaceAll('-', '+').replaceAll('_', '/');
        final decodedPayload = utf8.decode(base64Url.decode(payload));
        final payloadMap = jsonDecode(decodedPayload);
        if (payloadMap['exp'] != null) {
          final expiry = DateTime.fromMillisecondsSinceEpoch(
            payloadMap['exp'] * 1000,
          );
          if (expiry.isBefore(DateTime.now())) {
            await prefs.remove('jwt_token');
            return false;
          }
        }
        return true;
      } catch (e) {
        print('Error parsing JWT token: $e');
        return false;
      }
    }

    return false;
  }
}

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'login_page.dart';
import 'dart:convert';
import 'dart:async';
import 'landing_page.dart';
import 'community_page.dart';
import 'add_transaction_page.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'FundFlock App',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: SplashScreen(),
    );
  }
}

class SplashScreen extends StatefulWidget {
  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Timer(Duration(seconds: 3), () {
      Navigator.of(context).pushReplacement(
        PageRouteBuilder(
          pageBuilder: (context, animation, secondaryAnimation) {
            return FutureBuilder<bool>(
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
            );
          },
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            return FadeTransition(opacity: animation, child: child);
          },
          transitionDuration: Duration(milliseconds: 1000),
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(
        0xFF070F2B,
      ), // Change to your preferred background color
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/logo.jpg', // Replace with your actual logo path
              width: 200,
              height: 200,
            ),
            SizedBox(height: 20),
            Text(
              'FundFlock',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.blue,
              ),
            ),
          ],
        ),
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
            await prefs.remove('token');
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

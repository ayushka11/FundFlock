import 'dart:convert';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'landing_page.dart';
import 'registration_page.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Login Page',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const LoginScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _emailFocusNode = FocusNode();
  final _passwordFocusNode = FocusNode();
  bool _passwordVisible = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _emailFocusNode.dispose();
    _passwordFocusNode.dispose();
    super.dispose();
  }

  Future<void> loginUser() async {
    if (_emailController.text.isNotEmpty &&
        _passwordController.text.isNotEmpty) {
      try {
        var headers = {'Content-Type': 'application/json'};
        var request = http.Request(
          'POST',
          Uri.parse('http://10.0.2.2:3000/auth/login'),
        );
        final requestBody = {
          "email": _emailController.text,
          "password": _passwordController.text,
        };
        request.body = jsonEncode(requestBody);
        request.headers.addAll(headers);
        http.StreamedResponse response = await request.send();
        if (response.statusCode == 200) {
          final responseBody = await response.stream.bytesToString();
          print("Full Response: $jsonDecode(responseBody)");
          final cookies = response.headers['set-cookie'];
          print('Login successful: $responseBody');
          if (cookies != null) {
            final jwtToken = _extractJwtFromCookies(cookies);
            final username = jsonDecode(responseBody)['data']['username'];
            final email = jsonDecode(responseBody)['data']['email'];
            if (jwtToken != null) {
              final prefs = await SharedPreferences.getInstance();
              await prefs.setString('token', jwtToken);
              await prefs.setString('username', username);
              await prefs.setString('email', email);
              await prefs.setString(
                'user_id',
                jsonDecode(responseBody)['data']['_id'],
              );
            }
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Welcome back, $username!'),
                backgroundColor: Colors.green,
              ),
            );

            Navigator.of(context).pushAndRemoveUntil(
              MaterialPageRoute(builder: (context) => FundFlockApp()),
                  (Route<dynamic> route) => false,
            );
          } else {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('JWT token not found in cookies'),
                backgroundColor: Colors.red,
              ),
            );
          }
        } else {
          print('Login failed: ${response.reasonPhrase}');
          final responseBody = await response.stream.bytesToString();
          String errorMessage = 'Login failed';

          try {
            final jsonResponse = jsonDecode(responseBody);
            errorMessage = jsonResponse['message'] ?? 'Invalid credentials';
          } catch (e) {
            errorMessage = 'Login failed: ${response.reasonPhrase}';
          }

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(errorMessage), backgroundColor: Colors.red),
          );
        }
      } catch (e) {
        print('Error during login: $e');

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error during login: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } else {
      setState(() {});

      if (_emailController.text.isEmpty) {
        FocusScope.of(context).requestFocus(_emailFocusNode);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please enter an email address'),
            backgroundColor: Colors.red,
          ),
        );
      } else if (_passwordController.text.isEmpty) {
        FocusScope.of(context).requestFocus(_passwordFocusNode);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please enter a password'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  String? _extractJwtFromCookies(String cookies) {
    final cookieList = cookies.split(';');
    for (var cookie in cookieList) {
      final parts = cookie.split('=');
      if (parts.length == 2 && parts[0].trim() == 'token') {
        return parts[1].trim();
      }
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        FocusScope.of(context).unfocus();
      },
      child: Scaffold(
        backgroundColor: const Color(0xFF070F2B), // Changed to 070F2B
        body: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const SizedBox(height: 60),
                Column(
                  children: [
                    const Text(
                      'Welcome to FundFlock',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white, // Changed black text to white
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Please sign in to continue to your account',
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 16,
                      ), // Kept grey
                    ),
                  ],
                ),
                const SizedBox(height: 40),
                Column(
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Email Address',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                            color: Colors.white, // Changed black text to white
                          ),
                        ),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: _emailController,
                          focusNode: _emailFocusNode,
                          keyboardType: TextInputType.emailAddress,
                          textInputAction: TextInputAction.next,
                          style: const TextStyle(
                            color: Colors.white,
                          ), // Text color white
                          decoration: InputDecoration(
                            hintText: 'Enter your email...',
                            hintStyle: TextStyle(
                              color: Colors.grey[400],
                            ), // Hint text grey
                            filled: true,
                            fillColor: const Color(
                              0xFF1B1A55,
                            ), // Darker background for fields
                            suffixIcon: const Icon(
                              Icons.email,
                              color: Colors.grey,
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: Colors.grey[700]!,
                                width: 1,
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: const Color(0xFF9290C3).withOpacity(0.8),
                                width: 1,
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            errorBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: Colors.red[300]!,
                                width: 1,
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            focusedErrorBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: Colors.red[300]!,
                                width: 1,
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Password',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                            color: Colors.white, // Changed black text to white
                          ),
                        ),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: _passwordController,
                          focusNode: _passwordFocusNode,
                          obscureText: !_passwordVisible,
                          textInputAction: TextInputAction.done,
                          style: const TextStyle(
                            color: Colors.white,
                          ), // Text color white
                          decoration: InputDecoration(
                            hintText: 'Enter your password...',
                            hintStyle: TextStyle(
                              color: Colors.grey[400],
                            ), // Hint text grey
                            filled: true,
                            fillColor: const Color(
                              0xFF1B1A55,
                            ), // Darker background for fields
                            suffixIcon: IconButton(
                              icon: Icon(
                                _passwordVisible
                                    ? Icons.visibility_outlined
                                    : Icons.visibility_off_outlined,
                                color: Colors.grey,
                              ),
                              onPressed: () {
                                setState(() {
                                  _passwordVisible = !_passwordVisible;
                                });
                              },
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: Colors.grey[700]!,
                                width: 1,
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: const Color(0xFF9290C3).withOpacity(0.8),
                                width: 1,
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            errorBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: Colors.red[300]!,
                                width: 1,
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            focusedErrorBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: Colors.red[300]!,
                                width: 1,
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () {},
                        child: const Text(
                          'Forgot Password?',
                          style: TextStyle(
                            color: Color(0xFF9290C3), // Changed to 9290C3
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: () {
                        loginUser();
                        print(
                          'Login attempted with email: ${_emailController.text}',
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        foregroundColor: Colors.white,
                        backgroundColor: const Color(
                          0xFF9290C3,
                        ), // Changed to 9290C3
                        minimumSize: const Size(double.infinity, 50),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(25),
                        ),
                        elevation: 0,
                      ),
                      child: const Text(
                        'Sign In',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          'Don\'t have an account?',
                          style: TextStyle(color: Colors.grey), // Kept grey
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) => RegistrationPage(),
                              ),
                            );
                          },
                          child: const Text(
                            'Sign Up',
                            style: TextStyle(
                              color: Color(0xFF9290C3), // Changed to 9290C3
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

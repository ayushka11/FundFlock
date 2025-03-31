import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import "dart:convert";
import 'login_page.dart';
import 'landing_page.dart';
import 'package:shared_preferences/shared_preferences.dart';

class RegistrationPage extends StatelessWidget {
  const RegistrationPage({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        primaryColor: const Color(0xFF9290C3), // Changed primary color
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF9290C3)),
      ),
      initialRoute: SignUpWidget.routeName,
      routes: {SignUpWidget.routeName: (context) => const SignUpWidget()},
    );
  }
}

class SignUpWidget extends StatefulWidget {
  const SignUpWidget({super.key});

  static String routeName = 'SignUp';
  static String routePath = '/signUp';

  @override
  State<SignUpWidget> createState() => _SignUpWidgetState();
}

class _SignUpWidgetState extends State<SignUpWidget> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  final FocusNode _nameFocusNode = FocusNode();
  final FocusNode _emailFocusNode = FocusNode();
  final FocusNode _passwordFocusNode = FocusNode();

  bool _passwordVisibility = false;
  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _nameFocusNode.dispose();
    _emailFocusNode.dispose();
    _passwordFocusNode.dispose();
    super.dispose();
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

  Future<void> registerUser() async {
    if (_nameController.text.isNotEmpty &&
        _emailController.text.isNotEmpty &&
        _passwordController.text.isNotEmpty) {
      try {
        var headers = {'Content-Type': 'application/json'};
        var request = http.Request(
          'POST',
          Uri.parse('http://10.0.2.2:3000/auth/register'),
        );

        final requestBody = {
          "username": _nameController.text,
          "email": _emailController.text,
          "password": _passwordController.text,
        };

        request.body = jsonEncode(requestBody);
        request.headers.addAll(headers);

        http.StreamedResponse response = await request.send();
        final responseBody = await response.stream.bytesToString();
        final jsonResponse = jsonDecode(responseBody);
        print("Full Response: $jsonResponse");

        if (response.statusCode == 200 &&
            jsonResponse["status"]["success"] == true) {
          print('Registration successful: $responseBody');

          final cookies = response.headers['set-cookie'];

          if (cookies != null) {
            final jwtToken = _extractJwtFromCookies(cookies);
            if (jwtToken != null) {
              final prefs = await SharedPreferences.getInstance();
              await prefs.setString('token', jwtToken);
              await prefs.setString('username', _nameController.text);
              await prefs.setString('email', _emailController.text);
              await prefs.setString(
                'user_id',
                jsonDecode(responseBody)['data']['_id'],
              );
            }
          }

          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Account created successfully!'),
              backgroundColor: Colors.green,
            ),
          );

          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (context) => FundFlockApp()),
            (Route<dynamic> route) => false,
          );
        } else if (jsonResponse["status"]["success"] == false &&
            jsonResponse["status"]["error"] == "user already exists") {
          print('User already exists');
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('User already exists! Please log in.'),
              backgroundColor: Colors.orange,
            ),
          );
        } else {
          print(
            'Registration failed: ${jsonResponse["status"]["error"] ?? response.reasonPhrase}',
          );
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                'Registration failed: ${jsonResponse["status"]["error"] ?? response.reasonPhrase}',
              ),
              backgroundColor: Colors.red,
            ),
          );
        }
      } catch (e) {
        print('Error during registration: $e');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error during registration: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } else {
      if (_nameController.text.isEmpty) {
        _nameFocusNode.requestFocus();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please enter a username'),
            backgroundColor: Colors.red,
          ),
        );
      } else if (_emailController.text.isEmpty) {
        _emailFocusNode.requestFocus();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please enter an email address'),
            backgroundColor: Colors.red,
          ),
        );
      } else if (_passwordController.text.isEmpty) {
        _passwordFocusNode.requestFocus();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please enter a password'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        FocusScope.of(context).unfocus();
        FocusManager.instance.primaryFocus?.unfocus();
      },
      child: Scaffold(
        key: scaffoldKey,
        backgroundColor: const Color(
          0xFF070F2B,
        ), // Changed background to 070F2B
        body: SingleChildScrollView(
          primary: false,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                decoration: const BoxDecoration(color: Colors.transparent),
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24, 24, 24, 24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 60),
                      const SizedBox(height: 12),
                      const Text(
                        'Sign Up',
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Colors.white, // Changed to white
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Container(
                decoration: const BoxDecoration(color: Colors.transparent),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Padding(
                            padding: EdgeInsets.fromLTRB(0, 0, 0, 4),
                            child: Text(
                              ' Username',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.white, // Changed to white
                              ),
                            ),
                          ),
                          TextFormField(
                            controller: _nameController,
                            focusNode: _nameFocusNode,
                            autofocus: false,
                            textCapitalization: TextCapitalization.words,
                            textInputAction: TextInputAction.next,
                            obscureText: false,
                            style: const TextStyle(
                              fontSize: 14,
                              color: Colors.white, // Text color white
                            ),
                            decoration: InputDecoration(
                              hintText: 'Enter your username...',
                              hintStyle: TextStyle(
                                fontSize: 16,
                                color: Colors.grey[400], // Hint text grey
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
                                  color: const Color(
                                    0xFF9290C3,
                                  ).withOpacity(0.8),
                                  width: 1,
                                ),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              errorBorder: OutlineInputBorder(
                                borderSide: const BorderSide(
                                  color: Colors.red,
                                  width: 1,
                                ),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              focusedErrorBorder: OutlineInputBorder(
                                borderSide: const BorderSide(
                                  color: Colors.red,
                                  width: 1,
                                ),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              filled: true,
                              fillColor: const Color(
                                0xFF1B1A55,
                              ), // Darker background
                            ),
                            minLines: 1,
                          ),
                        ],
                      ),
                      const SizedBox(height: 18),
                      Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Padding(
                            padding: EdgeInsets.fromLTRB(4, 0, 4, 4),
                            child: Text(
                              'Email Address',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.white, // Changed to white
                              ),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.fromLTRB(4, 0, 4, 0),
                            child: TextFormField(
                              controller: _emailController,
                              focusNode: _emailFocusNode,
                              autofocus: false,
                              textInputAction: TextInputAction.next,
                              obscureText: false,
                              style: const TextStyle(
                                fontSize: 14,
                                color: Colors.white, // Text color white
                              ),
                              decoration: InputDecoration(
                                hintText: 'Enter your email...',
                                hintStyle: TextStyle(
                                  fontSize: 16,
                                  color: Colors.grey[400], // Hint text grey
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
                                    color: const Color(
                                      0xFF9290C3,
                                    ).withOpacity(0.8),
                                    width: 1,
                                  ),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                errorBorder: OutlineInputBorder(
                                  borderSide: const BorderSide(
                                    color: Colors.red,
                                    width: 1,
                                  ),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                focusedErrorBorder: OutlineInputBorder(
                                  borderSide: const BorderSide(
                                    color: Colors.red,
                                    width: 1,
                                  ),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                filled: true,
                                fillColor: const Color(
                                  0xFF1B1A55,
                                ), // Darker background
                              ),
                              minLines: 1,
                              keyboardType: TextInputType.emailAddress,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 18),
                      Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Padding(
                            padding: EdgeInsets.fromLTRB(0, 0, 0, 4),
                            child: Text(
                              'Password',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.white, // Changed to white
                              ),
                            ),
                          ),
                          TextFormField(
                            controller: _passwordController,
                            focusNode: _passwordFocusNode,
                            autofocus: false,
                            textInputAction: TextInputAction.done,
                            obscureText: !_passwordVisibility,
                            style: const TextStyle(
                              fontSize: 14,
                              color: Colors.white, // Text color white
                            ),
                            decoration: InputDecoration(
                              hintText: 'Enter your password...',
                              hintStyle: TextStyle(
                                fontSize: 16,
                                color: Colors.grey[400], // Hint text grey
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
                                  color: const Color(
                                    0xFF9290C3,
                                  ).withOpacity(0.8),
                                  width: 1,
                                ),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              errorBorder: OutlineInputBorder(
                                borderSide: const BorderSide(
                                  color: Colors.red,
                                  width: 1,
                                ),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              focusedErrorBorder: OutlineInputBorder(
                                borderSide: const BorderSide(
                                  color: Colors.red,
                                  width: 1,
                                ),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              filled: true,
                              fillColor: const Color(
                                0xFF1B1A55,
                              ), // Darker background
                              suffixIcon: InkWell(
                                onTap:
                                    () => setState(
                                      () =>
                                          _passwordVisibility =
                                              !_passwordVisibility,
                                    ),
                                focusNode: FocusNode(skipTraversal: true),
                                child: Icon(
                                  _passwordVisibility
                                      ? Icons.visibility_outlined
                                      : Icons.visibility_off_outlined,
                                  size: 22,
                                  color: Colors.grey, // Icon color grey
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Container(
                decoration: const BoxDecoration(color: Colors.transparent),
              ),
              const SizedBox(height: 24),
              Container(
                decoration: const BoxDecoration(color: Colors.transparent),
                child: ElevatedButton(
                  onPressed: () {
                    registerUser();
                    print('Button pressed ...');
                  },
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 50),
                    padding: const EdgeInsets.all(8),
                    backgroundColor: const Color(
                      0xFF9290C3,
                    ), // Changed to 9290C3
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(25),
                    ),
                  ),
                  child: const Text(
                    'Create Account',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Container(
                decoration: const BoxDecoration(color: Colors.transparent),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      InkWell(
                        splashColor: Colors.transparent,
                        focusColor: Colors.transparent,
                        hoverColor: Colors.transparent,
                        highlightColor: Colors.transparent,
                        onTap: () async {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => LoginPage(),
                            ),
                          );
                        },
                        child: RichText(
                          textScaler: MediaQuery.of(context).textScaler,
                          text: TextSpan(
                            children: [
                              const TextSpan(
                                text: 'Already have an account? ',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey, // Kept grey
                                ),
                              ),
                              TextSpan(
                                text: 'Log in',
                                style: TextStyle(
                                  color: const Color(
                                    0xFF9290C3,
                                  ), // Changed to 9290C3
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

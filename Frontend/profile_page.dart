import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'get_token.dart';
import 'landing_page.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  List<dynamic> transactions = [];
  String? username;
  String? email;
  String? user_id;
  String errorMessage = '';
  bool isLoading = true;
  int currentPage = 1; // Start from page 1
  bool isLastPage = false;

  @override
  void initState() {
    super.initState();
    _loadUserData();
    _fetchTransactions(currentPage);
  }

  Future<void> _loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      username = prefs.getString('username');
      email = prefs.getString("email");
      user_id = prefs.getString("user_id");
    });
  }

  Future<void> _fetchTransactions(int page) async {
    try {
      setState(() {
        isLoading = true;
        errorMessage = '';
      });

      String? token = await getAuthToken(context);
      if (token == null || token.isEmpty) {
        setState(() {
          errorMessage = 'Authentication token is missing';
          isLoading = false;
        });
        return;
      }

      final response = await http.get(
        Uri.parse(
          'http://10.0.2.2:3000/transaction/getAllUserTransactions/$page',
        ),
        headers: {'Authorization': 'Bearer $token', 'Cookie': 'token=$token'},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['status']['success'] == true) {
          setState(() {
            transactions = data['data']['transactions'] ?? [];
            isLastPage = data['data']['isLastPage'] ?? false;
            isLoading = false;
          });
        } else {
          setState(() {
            errorMessage =
                data['status']['message'] ?? 'Failed to load transactions';
            isLoading = false;
          });
        }
      } else {
        setState(() {
          errorMessage = 'Failed to load transactions: ${response.statusCode}';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Error fetching transactions: $e';
        isLoading = false;
      });
    }
  }

  Future<void> _logout() async {
    try {
      String? token = await getAuthToken(context);
      if (token != null) {
        await http.post(
          Uri.parse('http://10.0.2.2:3000/auth/logout'),
          headers: {'Authorization': 'Bearer $token', 'Cookie': 'token=$token'},
        );
      }

      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('token');
      await prefs.remove('username');
      await prefs.remove('email');

      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (context) => FundFlockApp()),
            (Route<dynamic> route) => false,
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error during logout: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF070F2B),
      appBar: AppBar(
        automaticallyImplyLeading: true,
        iconTheme: const IconThemeData(color: Colors.white),
        title: const Text('My Profile', style: TextStyle(color: Colors.white)),
        backgroundColor: const Color(0xFF1B1A55),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Username: ${username ?? 'Not available'}",
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              "Email: ${email ?? 'Not available'}",
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              "Transaction History:",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 10),

            if (isLoading)
              const Center(
                child: CircularProgressIndicator(color: Colors.white),
              )
            else if (errorMessage.isNotEmpty)
              Text(errorMessage, style: const TextStyle(color: Colors.red))
            else if (transactions.isEmpty)
                const Text(
                  "No transactions found",
                  style: TextStyle(color: Colors.white),
                )
              else
                Expanded(
                  child: Column(
                    children: [
                      Container(
                        margin: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey),
                        ),
                        child: Column(
                          children: [
                            // Table Header
                            Container(
                              color: const Color(0xFF1B1A55).withOpacity(0.8),
                              child: const Row(
                                mainAxisAlignment: MainAxisAlignment.spaceAround,
                                children: [
                                  Expanded(
                                    flex: 2,
                                    child: Padding(
                                      padding: EdgeInsets.all(8.0),
                                      child: Text(
                                        "Community",
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white,
                                        ),
                                        textAlign: TextAlign.center,
                                      ),
                                    ),
                                  ),
                                  Expanded(
                                    child: Padding(
                                      padding: EdgeInsets.all(8.0),
                                      child: Text(
                                        "Amount",
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white,
                                        ),
                                        textAlign: TextAlign.center,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),

                            // Transaction Rows
                            ...transactions
                                .map<Widget>(
                                  (transaction) => Container(
                                decoration: BoxDecoration(
                                  border: Border(
                                    top: BorderSide(color: Colors.grey),
                                  ),
                                ),
                                child: Row(
                                  mainAxisAlignment:
                                  MainAxisAlignment.spaceAround,
                                  children: [
                                    Expanded(
                                      flex: 2,
                                      child: Padding(
                                        padding: const EdgeInsets.all(8.0),
                                        child: Text(
                                          transaction["community_name"] ??
                                              "N/A",
                                          style: const TextStyle(
                                            color: Colors.white,
                                          ),
                                          textAlign: TextAlign.center,
                                        ),
                                      ),
                                    ),
                                    Expanded(
                                      child: Padding(
                                        padding: const EdgeInsets.all(8.0),
                                        child: Text(
                                          "₹${transaction["amount"]?.toString() ?? "0"}",
                                          style: const TextStyle(
                                            color: Colors.white,
                                          ),
                                          textAlign: TextAlign.center,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            )
                                .toList(),
                          ],
                        ),
                      ),

                      // Pagination Controls - Only show if not on first page or not last page
                      if (currentPage > 1 || !isLastPage)
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            // Previous button - only show if not on first page
                            if (currentPage > 1)
                              TextButton(
                                onPressed: () {
                                  _fetchTransactions(currentPage - 1);
                                  setState(() {
                                    currentPage--;
                                  });
                                },
                                child: const Text(
                                  "Previous",
                                  style: TextStyle(color: Colors.white),
                                ),
                              )
                            else
                              const SizedBox(
                                width: 80,
                              ), // Placeholder for spacing

                            Text(
                              "Page $currentPage",
                              style: const TextStyle(color: Colors.white),
                            ),

                            // Next button - only show if not on last page
                            if (!isLastPage)
                              TextButton(
                                onPressed: () {
                                  _fetchTransactions(currentPage + 1);
                                  setState(() {
                                    currentPage++;
                                  });
                                },
                                child: const Text(
                                  "Next",
                                  style: TextStyle(color: Colors.white),
                                ),
                              )
                            else
                              const SizedBox(
                                width: 80,
                              ), // Placeholder for spacing
                          ],
                        ),
                    ],
                  ),
                ),

            const SizedBox(height: 20),
            Center(
              child: ElevatedButton(
                onPressed: _logout,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF9290C3),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 40,
                    vertical: 15,
                  ),
                ),
                child: const Text(
                  "Logout",
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

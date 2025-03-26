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
  String errorMessage = '';
  bool isLoading = true;
  int currentPage = 0;
  final int itemsPerPage = 5;

  @override
  void initState() {
    super.initState();
    _loadUserData();
    _fetchTransactions();
  }

  Future<void> _loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      username = prefs.getString('username');
    });
  }

  Future<void> _fetchTransactions() async {
    try {
      String? token = await getAuthToken(context);
      if (token == null || token.isEmpty) {
        setState(() {
          errorMessage = 'Authentication token is missing';
          isLoading = false;
        });
        return;
      }

      final response = await http.get(
        Uri.parse('http://10.0.2.2:3000/transaction/getAllUserTransactions'),
        headers: {'Authorization': 'Bearer $token', 'Cookie': 'token=$token'},
      );
      print(jsonDecode(response.body));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['status']['success'] == true) {
          setState(() {
            transactions = data['data'] ?? [];
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
      appBar: AppBar(
        title: const Text('My Profile'),
        backgroundColor: Colors.lightBlue.shade200,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Username: ${username ?? 'Not available'}",
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            const Text(
              "Transaction History:",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),

            if (isLoading)
              const Center(child: CircularProgressIndicator())
            else if (errorMessage.isNotEmpty)
              Text(errorMessage, style: const TextStyle(color: Colors.red))
            else if (transactions.isEmpty)
                const Text("No transactions found")
              else
                Expanded(
                  child: Column(
                    children: [
                      Container(
                        margin: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.black),
                        ),
                        child: Column(
                          children: [
                            // Table Header
                            Container(
                              color: Colors.grey[200],
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
                                .skip(currentPage * itemsPerPage)
                                .take(itemsPerPage)
                                .map<Widget>(
                                  (transaction) => Container(
                                decoration: BoxDecoration(
                                  border: Border(
                                    top: BorderSide(
                                      color: Colors.grey.shade300,
                                    ),
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
                                          textAlign: TextAlign.center,
                                        ),
                                      ),
                                    ),
                                    Expanded(
                                      child: Padding(
                                        padding: const EdgeInsets.all(8.0),
                                        child: Text(
                                          "₹${transaction["amount"]?.toString() ?? "0"}",
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

                      // Pagination Controls
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          TextButton(
                            onPressed:
                            currentPage > 0
                                ? () {
                              setState(() {
                                currentPage--;
                              });
                            }
                                : null,
                            child: const Text("Previous"),
                          ),
                          Text(
                            "Page ${currentPage + 1} of ${(transactions.length / itemsPerPage).ceil()}",
                          ),
                          TextButton(
                            onPressed:
                            (currentPage + 1) * itemsPerPage <
                                transactions.length
                                ? () {
                              setState(() {
                                currentPage++;
                              });
                            }
                                : null,
                            child: const Text("Next"),
                          ),
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
                  backgroundColor: Colors.red,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 40,
                    vertical: 15,
                  ),
                ),
                child: const Text("Logout"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

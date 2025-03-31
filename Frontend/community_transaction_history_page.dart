import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'get_token.dart';

class CommunityTransactionHistoryPage extends StatefulWidget {
  final String communityId;
  final String communityName;

  const CommunityTransactionHistoryPage({
    super.key,
    required this.communityId,
    required this.communityName,
  });

  @override
  _CommunityTransactionHistoryPageState createState() =>
      _CommunityTransactionHistoryPageState();
}

class _CommunityTransactionHistoryPageState
    extends State<CommunityTransactionHistoryPage> {
  List<dynamic> transactions = [];
  String errorMessage = '';
  bool isLoading = true;
  int currentPage = 1; // Start from page 1 as per API
  bool isLastPage = false;

  @override
  void initState() {
    super.initState();
    _fetchCommunityTransactions();
  }

  Future<void> _fetchCommunityTransactions() async {
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
          'http://10.0.2.2:3000/transaction/getAllCommunityTransactions/${widget.communityId}/$currentPage',
        ),
        headers: {
          'Authorization': 'Bearer $token',
          'Cookie': 'token=$token',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
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

  void _goToNextPage() {
    if (!isLastPage) {
      setState(() {
        currentPage++;
      });
      _fetchCommunityTransactions();
    }
  }

  void _goToPreviousPage() {
    if (currentPage > 1) {
      setState(() {
        currentPage--;
      });
      _fetchCommunityTransactions();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF070F2B),
      appBar: AppBar(
        automaticallyImplyLeading: true,
        iconTheme: const IconThemeData(color: Colors.white),
        title: const Text(
          'Transaction History',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: const Color(0xFF1B1A55),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Community: ${widget.communityName}",
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
                                        "Username",
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
                                          transaction["username"] ?? "N/A",
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

                      // Pagination Controls - Only show if needed
                      if (currentPage > 1 || !isLastPage)
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            // Show Previous button only if not on first page
                            if (currentPage > 1)
                              TextButton(
                                onPressed: _goToPreviousPage,
                                child: const Text(
                                  "Previous",
                                  style: TextStyle(color: Colors.white),
                                ),
                              )
                            else
                              const SizedBox(
                                width: 80,
                              ), // Spacer to maintain layout

                            Text(
                              "Page $currentPage",
                              style: const TextStyle(color: Colors.white),
                            ),

                            // Show Next button only if not on last page
                            if (!isLastPage)
                              TextButton(
                                onPressed: _goToNextPage,
                                child: const Text(
                                  "Next",
                                  style: TextStyle(color: Colors.white),
                                ),
                              )
                            else
                              const SizedBox(
                                width: 80,
                              ), // Spacer to maintain layout
                          ],
                        ),
                    ],
                  ),
                ),
          ],
        ),
      ),
    );
  }
}

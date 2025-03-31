import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'get_token.dart'; // Import the token utility

class AddTransactionPage extends StatefulWidget {
  final String communityId;
  final String communityName;
  final double currentAmount;
  final double totalFundAmount;

  const AddTransactionPage({
    super.key,
    required this.communityId,
    required this.communityName,
    required this.currentAmount,
    required this.totalFundAmount,
  });

  @override
  State<AddTransactionPage> createState() => _AddTransactionPageState();
}

class _AddTransactionPageState extends State<AddTransactionPage> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  bool _amountExceedsTotal = false;
  bool _isLoading = false;
  String _errorMessage = '';

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

  void _validateAmount(String value) {
    final amount = double.tryParse(value) ?? 0;
    final newTotal = widget.currentAmount + amount;

    setState(() {
      _amountExceedsTotal = newTotal > widget.totalFundAmount;
    });
  }

  Future<void> _submitPayment() async {
    if (_amountExceedsTotal) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Amount exceeds total goal of ₹${widget.totalFundAmount}',
          ),
          backgroundColor: Colors.red,
          duration: const Duration(seconds: 2),
        ),
      );
      return;
    }

    if (_formKey.currentState!.validate()) {
      try {
        setState(() {
          _isLoading = true;
          _errorMessage = '';
        });

        // Get the authentication token from get_token.dart
        final String? token = await getAuthToken(context);
        if (token == null) return;

        // Prepare headers with JWT token
        var headers = {
          'Authorization': 'Bearer $token'.trim(),
          'Cookie': 'token=$token'.trim(),
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };

        // Prepare request body
        var request = http.Request(
          'POST',
          Uri.parse('http://10.0.2.2:3000/transaction/create'),
        );

        final requestBody = {
          "community_id": widget.communityId,
          "amount": _amountController.text,
        };

        request.body = jsonEncode(requestBody);
        request.headers.addAll(headers);

        // Send the request
        http.StreamedResponse response = await request.send();

        // Parse the response
        final responseBody = await response.stream.bytesToString();
        final jsonResponse = jsonDecode(responseBody);

        if (response.statusCode == 200 &&
            jsonResponse['status']['success'] == true) {
          // Transaction creation successful
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Contribution added successfully!'),
              backgroundColor: Colors.green,
            ),
          );

          Navigator.pop(context, true); // Pass true to indicate success
        } else {
          // Handle API-specific error messages
          String errorMsg =
              jsonResponse['status']['error'] ?? 'Failed to add contribution';

          setState(() {
            _errorMessage = errorMsg;
          });

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(errorMsg), backgroundColor: Colors.red),
          );
        }
      } catch (e) {
        // Handle network or unexpected errors
        setState(() {
          _errorMessage = 'Error adding contribution: ${e.toString()}';
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error adding contribution: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      } finally {
        // Reset loading state
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF070F2B), // Background color
      appBar: AppBar(
        title: const Text(
          'Add Contribution',
          style: TextStyle(
            fontFamily: 'Poppins',
            color: Colors.white, // White text
          ),
        ),
        backgroundColor: const Color(0xFF1B1A55), // Header color
        iconTheme: const IconThemeData(color: Colors.white), // White icons
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (_errorMessage.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(bottom: 16.0),
                  child: Text(
                    _errorMessage,
                    style: const TextStyle(color: Colors.red),
                  ),
                ),
              const Text(
                "Contributing to:",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white, // White text
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 8.0),
                child: Text(
                  widget.communityName,
                  style: const TextStyle(
                    fontSize: 16,
                    color: Colors.white, // White text
                  ),
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                "Amount (₹):",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white, // White text
                ),
              ),
              TextFormField(
                controller: _amountController,
                style: const TextStyle(color: Colors.white), // White text
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderSide: BorderSide(
                      color: _amountExceedsTotal ? Colors.red : Colors.grey,
                    ),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderSide: BorderSide(
                      color: _amountExceedsTotal ? Colors.red : Colors.grey,
                    ),
                  ),
                  focusedBorder: const OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.white),
                  ),
                  hintText: 'Enter amount',
                  hintStyle: const TextStyle(color: Colors.grey), // Grey hint
                  errorText:
                  _amountExceedsTotal
                      ? 'Exceeds total goal of ₹${widget.totalFundAmount}'
                      : null,
                ),
                keyboardType: TextInputType.numberWithOptions(decimal: true),
                onChanged: _validateAmount,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter an amount';
                  }
                  final amount = double.tryParse(value);
                  if (amount == null || amount <= 0) {
                    return 'Enter a valid positive amount';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 10),
              Text(
                'Current balance: ₹${widget.currentAmount.toStringAsFixed(2)}',
                style: const TextStyle(color: Colors.grey), // Grey text
              ),
              Text(
                'Total goal: ₹${widget.totalFundAmount.toStringAsFixed(2)}',
                style: const TextStyle(color: Colors.grey), // Grey text
              ),
              if (_amountExceedsTotal)
                const Padding(
                  padding: EdgeInsets.only(top: 8.0),
                  child: Text(
                    'Note: The community goal will be fully funded with this payment',
                    style: TextStyle(color: Colors.orange),
                  ),
                ),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _submitPayment,
                  child: Padding(
                    padding: const EdgeInsets.all(12.0),
                    child:
                    _isLoading
                        ? const CircularProgressIndicator(
                      color: Colors.white,
                    )
                        : Text(
                      'CONTRIBUTE ₹${_amountController.text.isNotEmpty ? _amountController.text : "0"}',
                      style: const TextStyle(
                        fontSize: 16,
                        color: Colors.white, // White text
                      ),
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF9290C3), // Button color
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

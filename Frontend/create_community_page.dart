import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'get_token.dart';
import 'login_page.dart';

class CreateCommunityPage extends StatefulWidget {
  @override
  _CreateCommunityPageState createState() => _CreateCommunityPageState();
}

class _CreateCommunityPageState extends State<CreateCommunityPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  final TextEditingController _expiryDateController = TextEditingController();
  final TextEditingController _totalAmountController = TextEditingController();
  DateTime? _expiryDate;
  List<Map<String, int>> milestones = [];
  List<String> members = [];
  bool isLoading = false;
  String errorMessage = '';
  final TextEditingController _memberController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _totalAmountController.text = '0';
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _expiryDateController.dispose();
    _memberController.dispose();
    _totalAmountController.dispose();
    super.dispose();
  }

  Future<void> createCommunity() async {
    // Reset error message
    setState(() {
      errorMessage = '';
    });

    // Validate form and milestones
    if (_formKey.currentState!.validate()) {
      // Check if there are any members
      if (members.isEmpty) {
        setState(() {
          errorMessage = 'Please add at least one member';
        });
        return;
      }

      // Check if milestones are valid
      for (int i = 0; i < milestones.length; i++) {
        if (!_isMilestoneValid(i)) {
          setState(() {
            errorMessage = 'Milestone amounts must be in ascending order';
          });
          return;
        }
      }

      try {
        // Get the authentication token
        final String? token = await getAuthToken(context);
        if (token == null) return;

        // Set loading state
        setState(() {
          isLoading = true;
        });
        print(token);
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
          Uri.parse('http://10.0.2.2:3000/community/create'),
        );

        // Convert milestones to list of integers
        List<int> milestoneAmounts =
            milestones.map((m) => m['amount'] as int).toList();

        final requestBody = {
          "community_name": _nameController.text,
          "description": _descriptionController.text,
          "members_usernames": members,
          "net_fund_amt": int.parse(_totalAmountController.text),
          "expiring_date": "${_expiryDate!.toIso8601String()}Z",
          "milestones": milestoneAmounts,
        };

        request.body = jsonEncode(requestBody);
        request.headers.addAll(headers);

        // Send the request
        http.StreamedResponse response = await request.send();

        // Parse the response
        final responseBody = await response.stream.bytesToString();
        final jsonResponse = jsonDecode(responseBody);
        print(jsonResponse);
        if (response.statusCode == 200 &&
            jsonResponse['status']['success'] == true) {
          // Community creation successful
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Community created successfully!'),
              backgroundColor: Colors.green,
            ),
          );

          // Navigate to the next page or refresh the communities list
          // You might want to replace this with your actual navigation logic
          Navigator.of(context).pop(true);
        } else {
          // Handle API-specific error messages
          String errorMsg =
              jsonResponse['status']['error'] ?? 'Failed to create community';

          if (errorMsg.contains('Cannot read properties of null')) {
            errorMsg =
                'One or more members do not exist. Please check usernames.';
          }

          setState(() {
            errorMessage = errorMsg;
          });

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(errorMsg), backgroundColor: Colors.red),
          );
        }
      } catch (e) {
        // Handle network or unexpected errors
        setState(() {
          errorMessage = 'Error creating community: ${e.toString()}';
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error creating community: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      } finally {
        // Reset loading state
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(Duration(days: 30)),
      firstDate: DateTime.now(),
      lastDate: DateTime(2100),
    );
    if (picked != null && picked != _expiryDate) {
      setState(() {
        _expiryDate = picked;
        _expiryDateController.text = DateFormat('yyyy-MM-dd').format(picked);
      });
    }
  }

  void _addMilestone() {
    setState(() {
      int lastAmount = milestones.isNotEmpty ? milestones.last['amount']! : 0;
      milestones.add({'amount': lastAmount + 1000});
      _updateTotalAmount();
    });
  }

  void _removeMilestone(int index) {
    setState(() {
      milestones.removeAt(index);
      _updateTotalAmount();
    });
  }

  void _updateMilestoneAmount(int index, String value) {
    int newAmount = int.tryParse(value) ?? 0;
    setState(() {
      milestones[index]['amount'] = newAmount;
      _updateTotalAmount();
    });
  }

  void _updateTotalAmount() {
    _totalAmountController.text =
        milestones.isNotEmpty ? milestones.last['amount'].toString() : '0';
  }

  void _addMember() {
    if (_memberController.text.isNotEmpty) {
      setState(() {
        members.add(_memberController.text);
        _memberController.clear();
      });
    }
  }

  void _removeMember(int index) {
    setState(() {
      members.removeAt(index);
    });
  }

  bool _isMilestoneValid(int index) {
    if (index == 0) return true;
    return milestones[index]['amount']! > milestones[index - 1]['amount']!;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF070F2B), // Background color
      appBar: AppBar(
        title: Text(
          'Create New Community',
          style: TextStyle(color: Colors.white), // White text
        ),
        backgroundColor: Color(0xFF1B1A55), // Header color
        iconTheme: IconThemeData(color: Colors.white), // White icons
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextFormField(
                controller: _nameController,
                style: TextStyle(color: Colors.white), // White text
                decoration: InputDecoration(
                  labelText: 'Community Name',
                  labelStyle: TextStyle(color: Colors.grey), // Grey label
                  border: OutlineInputBorder(),
                  enabledBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.grey),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.white),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a community name';
                  }
                  return null;
                },
              ),
              SizedBox(height: 16),
              TextFormField(
                controller: _descriptionController,
                style: TextStyle(color: Colors.white), // White text
                decoration: InputDecoration(
                  labelText: 'Community Description',
                  labelStyle: TextStyle(color: Colors.grey), // Grey label
                  border: OutlineInputBorder(),
                  enabledBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.grey),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.white),
                  ),
                ),
                maxLines: 3,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a description';
                  }
                  return null;
                },
              ),
              SizedBox(height: 16),
              TextFormField(
                controller: _expiryDateController,
                style: TextStyle(color: Colors.white), // White text
                decoration: InputDecoration(
                  labelText: 'Expiry Date',
                  labelStyle: TextStyle(color: Colors.grey), // Grey label
                  border: OutlineInputBorder(),
                  enabledBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.grey),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.white),
                  ),
                  suffixIcon: IconButton(
                    icon: Icon(Icons.calendar_today, color: Colors.white),
                    onPressed: () => _selectDate(context),
                  ),
                ),
                readOnly: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please select an expiry date';
                  }
                  return null;
                },
              ),
              SizedBox(height: 24),

              // Members Section
              Text(
                'Members',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white, // White text
                ),
              ),
              SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _memberController,
                      style: TextStyle(color: Colors.white), // White text
                      decoration: InputDecoration(
                        labelText: 'Username',
                        labelStyle: TextStyle(color: Colors.grey), // Grey label
                        border: OutlineInputBorder(),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.grey),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.white),
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: _addMember,
                    child: Text('Add', style: TextStyle(color: Colors.white)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Color(0xFF9290C3), // Button color
                    ),
                  ),
                ],
              ),
              SizedBox(height: 8),
              if (members.isNotEmpty) ...[
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children:
                      members.asMap().entries.map((entry) {
                        int index = entry.key;
                        String member = entry.value;
                        return Chip(
                          label: Text(
                            member,
                            style: TextStyle(color: Colors.white),
                          ),
                          backgroundColor: Color(0xFF1B1A55),
                          deleteIcon: Icon(
                            Icons.close,
                            size: 18,
                            color: Colors.white,
                          ),
                          onDeleted: () => _removeMember(index),
                        );
                      }).toList(),
                ),
                SizedBox(height: 16),
              ],

              // Milestones Section
              Text(
                'Milestones',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white, // White text
                ),
              ),
              SizedBox(height: 8),
              ...milestones.asMap().entries.map((entry) {
                int index = entry.key;
                var milestone = entry.value;
                bool isValid = _isMilestoneValid(index);

                return Card(
                  color: Color(0xFF1B1A55), // Card background
                  margin: EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(
                    side: BorderSide(
                      color: isValid ? Colors.transparent : Colors.red,
                      width: 2,
                    ),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Padding(
                    padding: EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Milestone ${index + 1}',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Colors.white, // White text
                              ),
                            ),
                            IconButton(
                              icon: Icon(Icons.delete, color: Colors.white),
                              onPressed: () => _removeMilestone(index),
                            ),
                          ],
                        ),
                        SizedBox(height: 8),
                        TextFormField(
                          style: TextStyle(color: Colors.white), // White text
                          controller: TextEditingController(
                              text: milestone['amount'].toString(),
                            )
                            ..selection = TextSelection.collapsed(
                              offset: milestone['amount'].toString().length,
                            ),
                          decoration: InputDecoration(
                            labelText: 'Amount (₹)',
                            labelStyle: TextStyle(
                              color: Colors.grey,
                            ), // Grey label
                            border: OutlineInputBorder(),
                            enabledBorder: OutlineInputBorder(
                              borderSide: BorderSide(color: Colors.grey),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderSide: BorderSide(color: Colors.white),
                            ),
                            errorText:
                                !isValid
                                    ? 'Amount must be greater than previous milestone'
                                    : null,
                          ),
                          keyboardType: TextInputType.number,
                          inputFormatters: [
                            FilteringTextInputFormatter.digitsOnly,
                          ],
                          onChanged: (value) {
                            if (value.isNotEmpty) {
                              _updateMilestoneAmount(index, value);
                            } else {
                              _updateMilestoneAmount(index, '0');
                            }
                          },
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter an amount';
                            }
                            if (int.tryParse(value) == null) {
                              return 'Only whole numbers allowed';
                            }
                            final amount = int.parse(value);
                            if (amount <= 0) {
                              return 'Amount must be positive';
                            }
                            if (index > 0 &&
                                amount <= milestones[index - 1]['amount']!) {
                              return 'Amount must be greater than previous milestone';
                            }
                            return null;
                          },
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
              SizedBox(height: 16),
              ElevatedButton(
                onPressed: _addMilestone,
                child: Text(
                  'Add Milestone',
                  style: TextStyle(color: Colors.white),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFF9290C3), // Button color
                ),
              ),
              SizedBox(height: 24),

              // Total Amount
              TextFormField(
                controller: _totalAmountController,
                style: TextStyle(color: Colors.white), // White text
                decoration: InputDecoration(
                  labelText: 'Total Amount (₹)',
                  labelStyle: TextStyle(color: Colors.grey), // Grey label
                  border: OutlineInputBorder(),
                  enabledBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.grey),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.white),
                  ),
                  filled: true,
                  fillColor: Color(0xFF1B1A55).withOpacity(0.5),
                ),
                readOnly: true,
              ),
              SizedBox(height: 16),

              if (errorMessage.isNotEmpty)
                Padding(
                  padding: EdgeInsets.symmetric(vertical: 8),
                  child: Text(
                    errorMessage,
                    style: TextStyle(color: Colors.red),
                  ),
                ),
              SizedBox(height: 24),
              Center(
                child: ElevatedButton(
                  onPressed: isLoading ? null : createCommunity,
                  child:
                      isLoading
                          ? CircularProgressIndicator(color: Colors.white)
                          : Text(
                            'Create Community',
                            style: TextStyle(color: Colors.white),
                          ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF9290C3), // Button color
                    padding: EdgeInsets.symmetric(horizontal: 32, vertical: 12),
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

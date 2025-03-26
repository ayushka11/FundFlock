import 'package:flutter/material.dart';

class AddTransactionPage extends StatefulWidget {
  final String communityId;
  final String milestoneId;
  final String communityName;
  final double currentAmount;
  final double totalFundAmount;

  const AddTransactionPage({
    super.key,
    required this.communityId,
    required this.milestoneId,
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

  void _submitPayment() {
    if (_amountExceedsTotal) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Amount exceeds total goal of ₹${widget.totalFundAmount}',
          ),
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        ),
      );
      return;
    }

    if (_formKey.currentState!.validate()) {
      // Process payment with:
      // - widget.communityId
      // - widget.milestoneId
      // - double.parse(_amountController.text)
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Add Contribution',
          style: TextStyle(fontFamily: 'Poppins'),
        ),
        backgroundColor: Colors.lightBlue.shade200,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Contributing to:",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 8.0),
                child: Text(
                  widget.communityName,
                  style: TextStyle(fontSize: 16),
                ),
              ),
              SizedBox(height: 20),
              Text(
                "Amount (₹):",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              TextFormField(
                controller: _amountController,
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderSide: BorderSide(
                      color: _amountExceedsTotal ? Colors.red : Colors.grey,
                    ),
                  ),
                  hintText: 'Enter amount',
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
              SizedBox(height: 10),
              Text(
                'Current balance: ₹${widget.currentAmount.toStringAsFixed(2)}',
                style: TextStyle(color: Colors.grey.shade600),
              ),
              Text(
                'Total goal: ₹${widget.totalFundAmount.toStringAsFixed(2)}',
                style: TextStyle(color: Colors.grey.shade600),
              ),
              if (_amountExceedsTotal)
                Padding(
                  padding: const EdgeInsets.only(top: 8.0),
                  child: Text(
                    'Note: The community goal will be fully funded with this payment',
                    style: TextStyle(color: Colors.orange),
                  ),
                ),
              Spacer(),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _submitPayment,
                  child: Padding(
                    padding: const EdgeInsets.all(12.0),
                    child: Text(
                      'CONTRIBUTE ₹${_amountController.text.isNotEmpty ? _amountController.text : "0"}',
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor:
                    _amountExceedsTotal ? Colors.orange : Colors.blue,
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

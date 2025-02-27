# FundFlock
Desis Ascend Educare Final Project
import 'package:flutter/material.dart';

void main() {
  runApp(FundFlockApp());
}

class FundFlockApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        fontFamily: 'Poppins',
      ),
      home: HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(0xFFB5AEE4),
        title: Text(
          "FundFlock",
          style: TextStyle(
            fontFamily: 'Poppins',
            fontWeight: FontWeight.bold,
            fontSize: 22,
            color: Colors.white,
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.person, color: Colors.white),
            onPressed: () {},
          )
        ],
      ),
      body: ListView(
        padding: EdgeInsets.all(16.0),
        children: [
          _buildJourneyCard("EXPIRED", Color(0xFFF7C6C7), context, isExpired: true),
          _buildJourneyCard("Active Journey", Color(0xFFC5E1A5), context),
          _buildJourneyCard("JOURNEY SUCCESSFULLY COMPLETED", Color(0xFFF8E1F4), context),
          _buildJourneyCard("EXPIRING SOON", Color(0xFFFFF9C4), context),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: Color(0xFFAED6F1),
        child: Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  Widget _buildJourneyCard(String title, Color color, BuildContext context, {bool isExpired = false}) {
    return GestureDetector(
      onTap: () {
        if (isExpired) _showAdminPopup(context);
      },
      child: Card(
        color: color,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        elevation: 5,
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                  fontFamily: 'Poppins',
                  color: Colors.black87,
                ),
              ),
              SizedBox(height: 8),
              Text("Journey Name: ____", style: TextStyle(color: Colors.black87, fontFamily: 'Poppins')),
              Text("Total Amount: ____", style: TextStyle(color: Colors.black87, fontFamily: 'Poppins')),
              Text("Amount Collected: ____", style: TextStyle(color: Colors.black87, fontFamily: 'Poppins')),
            ],
          ),
        ),
      ),
    );
  }

  void _showAdminPopup(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Color(0xFFF7C6C7),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        title: Text(
          "Journey Expired!",
          style: TextStyle(
            fontFamily: 'Poppins',
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(backgroundColor: Color(0xFFAED6F1)),
              child: Text("Extend Date", style: TextStyle(color: Colors.white)),
            ),
            SizedBox(height: 10),
            ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(backgroundColor: Color(0xFFAED6F1)),
              child: Text("Ask Manager to Return Funds", style: TextStyle(color: Colors.white)),
            ),
          ],
        ),
      ),
    );
  }
}
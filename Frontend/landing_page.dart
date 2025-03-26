import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'get_token.dart';
import 'create_community_page.dart';
import 'community_page.dart';
import 'profile_page.dart';

void main() {
  runApp(FundFlockApp());
}

class FundFlockApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(fontFamily: 'Poppins'),
      home: HomePage(),
    );
  }
}

class Community {
  final String id;
  final String name;
  final String description;
  final double netFundAmount;
  final double currentAmount;
  final DateTime expiringDate;
  final String status;

  Community({
    required this.id,
    required this.name,
    required this.description,
    required this.netFundAmount,
    required this.currentAmount,
    required this.expiringDate,
    required this.status,
  });

  factory Community.fromJson(Map<String, dynamic> json) {
    return Community(
      id: json['community_id'] ?? '',
      name: json['community_name'] ?? '',
      description: json['description'] ?? '',
      netFundAmount: (json['net_fund_amt'] ?? 0).toDouble(),
      currentAmount: (json['current_amount'] ?? 0).toDouble(),
      expiringDate:
      json['expiring_date'] != null
          ? DateTime.parse(json['expiring_date'])
          : DateTime.now(),
      status: json['status'] ?? '',
    );
  }
}

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<Community> communities = [];
  bool isLoading = true;
  String errorMessage = '';
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    fetchCommunities();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> fetchCommunities() async {
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
        Uri.parse('http://10.0.2.2:3000/community/home'),
        headers: {
          'Authorization': 'Bearer $token'.trim(),
          'Cookie': 'token=$token'.trim(),
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      );
      print(json.decode(response.body));
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        if (data['status']['success'] == true &&
            data['data']['communities'] != null) {
          List<dynamic> communityList = data['data']['communities'];
          setState(() {
            communities =
                communityList.map((item) => Community.fromJson(item)).toList();
            isLoading = false;
          });
        } else {
          setState(() {
            errorMessage = 'Invalid response format';
            isLoading = false;
          });
        }
      } else {
        setState(() {
          errorMessage = 'Failed to fetch communities: ${response.statusCode}';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Error: $e';
        isLoading = false;
      });
    }
  }

  Color _getColorByStatus(String status) {
    final now = DateTime.now();
    final community = communities.firstWhere(
          (c) => c.status == status,
      orElse: () => communities.first,
    );

    // Calculate days remaining
    final difference = community.expiringDate.difference(now).inDays;

    switch (status.toLowerCase()) {
      case 'expired':
        return Color(0xFFF7C6C7); // Light red
      case 'active':
        return Color(0xFFC5E1A5); // Light green
      case 'completed':
        return Color(0xFFF8E1F4); // Light purple
      default:
      // If expiring within 7 days
        if (difference <= 7 && difference >= 0) {
          return Color(0xFFFFF9C4); // Light yellow for "expiring soon"
        }
        return Color(0xFFC5E1A5); // Default to light green
    }
  }

  String _getCardTitle(Community community) {
    final now = DateTime.now();
    final difference = community.expiringDate.difference(now).inDays;

    if (community.status.toLowerCase() == 'expired') {
      return "EXPIRED";
    } else if (community.status.toLowerCase() == 'completed') {
      return "JOURNEY SUCCESSFULLY COMPLETED";
    } else if (difference <= 7 && difference >= 0) {
      return "EXPIRING SOON";
    } else {
      return "Active Journey";
    }
  }

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
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => ProfilePage()),
              );
            },
          ),
        ],
      ),
      body: SafeArea(
        child:
        isLoading
            ? Center(child: CircularProgressIndicator())
            : errorMessage.isNotEmpty
            ? Center(child: Text('Error: $errorMessage'))
            : communities.isEmpty
            ? Center(child: Text('No communities found'))
            : RefreshIndicator(
          onRefresh: fetchCommunities,
          child: Scrollbar(
            controller: _scrollController,
            thumbVisibility: true,
            thickness: 6,
            radius: Radius.circular(10),
            child: ListView.builder(
              controller: _scrollController,
              physics: AlwaysScrollableScrollPhysics(),
              padding: EdgeInsets.all(16.0),
              itemCount: communities.length,
              itemBuilder: (context, index) {
                final community = communities[index];
                final cardTitle = _getCardTitle(community);
                final cardColor = _getColorByStatus(community.status);
                final isExpired =
                    community.status.toLowerCase() == 'expired';

                return _buildJourneyCard(
                  cardTitle,
                  cardColor,
                  context,
                  community: community,
                  isExpired: isExpired,
                );
              },
            ),
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => CreateCommunityPage()),
          );
        },
        backgroundColor: Color(0xFFAED6F1),
        child: Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  Widget _buildJourneyCard(
      String title,
      Color color,
      BuildContext context, {
        required Community community,
        bool isExpired = false,
      }) {
    final currencyFormat = NumberFormat.currency(symbol: '₹');

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder:
                (context) => CommunityPage(
              communityId: community.id,
            ), // Using as-is, without communityId parameter
          ),
        );
      },
      child: Card(
        color: color,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        elevation: 5,
        margin: EdgeInsets.only(bottom: 16.0),
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
              Text(
                "Journey Name: ${community.name}",
                style: TextStyle(color: Colors.black87, fontFamily: 'Poppins'),
              ),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Container(
                  width:
                  MediaQuery.of(context).size.width -
                      64, // Adjust width based on padding
                  child: Text(
                    "Description: ${community.description}",
                    style: TextStyle(
                      color: Colors.black87,
                      fontFamily: 'Poppins',
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ),
              Text(
                "Total Amount: ${currencyFormat.format(community.netFundAmount)}",
                style: TextStyle(color: Colors.black87, fontFamily: 'Poppins'),
              ),
              Text(
                "Amount Collected: ${currencyFormat.format(community.currentAmount)}",
                style: TextStyle(color: Colors.black87, fontFamily: 'Poppins'),
              ),
              Text(
                "Expiry Date: ${DateFormat('dd MMM yyyy').format(community.expiringDate)}",
                style: TextStyle(color: Colors.black87, fontFamily: 'Poppins'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showAdminPopup(BuildContext context) {
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
        backgroundColor: Color(0xFFF7C6C7),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        title: Text(
          "Journey Expired!",
          style: TextStyle(
            fontFamily: 'Poppins',
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFFAED6F1),
                ),
                child: Text(
                  "Extend Date",
                  style: TextStyle(color: Colors.white),
                ),
              ),
              SizedBox(height: 10),
              ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFFAED6F1),
                ),
                child: Text(
                  "Ask Manager to Return Funds",
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'get_token.dart';
import 'create_community_page.dart';
import 'community_page.dart';
import 'profile_page.dart';

class FundFlockApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        fontFamily: 'Poppins',
        scaffoldBackgroundColor: const Color(0xFF070F2B),
      ),
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

class _HomePageState extends State<HomePage>
    with SingleTickerProviderStateMixin {
  List<Community> allCommunities = [];
  List<Community> activeAndExpiringCommunities = [];
  List<Community> completedCommunities = [];
  List<Community> expiredCommunities = [];

  bool isLoading = true;
  String errorMessage = '';
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    fetchCommunities();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _categorizeCommunities() {
    final now = DateTime.now();

    activeAndExpiringCommunities = [];
    completedCommunities = [];
    expiredCommunities = [];

    for (var community in allCommunities) {
      final difference = community.expiringDate.difference(now).inDays;
      final isCompleted = community.netFundAmount == community.currentAmount;

      if (community.status.toLowerCase() == 'expired') {
        expiredCommunities.add(community);
      } else if (isCompleted || community.status.toLowerCase() == 'completed') {
        completedCommunities.add(community);
      } else if (community.expiringDate.isAfter(now) ||
          (difference <= 7 && difference >= 0)) {
        activeAndExpiringCommunities.add(community);
      }
    }

    activeAndExpiringCommunities.sort((a, b) {
      final now = DateTime.now();
      final aDiff = a.expiringDate.difference(now).inDays;
      final bDiff = b.expiringDate.difference(now).inDays;

      if ((aDiff <= 7 && bDiff <= 7) || (aDiff > 7 && bDiff > 7)) {
        return a.expiringDate.compareTo(b.expiringDate);
      }
      return aDiff <= 7 ? -1 : 1;
    });

    completedCommunities.sort(
      (a, b) => b.expiringDate.compareTo(a.expiringDate),
    );
    expiredCommunities.sort((a, b) => b.expiringDate.compareTo(a.expiringDate));
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

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        if (data['status']['success'] == true &&
            data['data']['communities'] != null) {
          List<dynamic> communityList = data['data']['communities'];
          setState(() {
            allCommunities =
                communityList.map((item) => Community.fromJson(item)).toList();
            _categorizeCommunities();
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

  Color _getColorByStatus(Community community) {
    final now = DateTime.now();
    final difference = community.expiringDate.difference(now).inDays;
    final isCompleted = community.netFundAmount == community.currentAmount;

    if (community.status.toLowerCase() == 'expired') {
      return const Color(0xFFFBFBFB);
    } else if (isCompleted || community.status.toLowerCase() == 'completed') {
      return const Color(0xFFC4D9FF);
    } else if (difference <= 7 && difference >= 0) {
      return const Color(0xFFE8F9FF);
    } else {
      return const Color(0xFFC5BAFF);
    }
  }

  String _getCardTitle(Community community) {
    final now = DateTime.now();
    final difference = community.expiringDate.difference(now).inDays;
    final isCompleted = community.netFundAmount == community.currentAmount;

    if (community.status.toLowerCase() == 'expired') {
      return "EXPIRED";
    } else if (isCompleted || community.status.toLowerCase() == 'completed') {
      return "JOURNEY COMPLETED";
    } else if (difference <= 7 && difference >= 0) {
      return "EXPIRING SOON";
    } else {
      return "ACTIVE JOURNEY";
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF1B1A55),
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
          Tooltip(
            message: 'My Profile',
            child: IconButton(
              icon: const Icon(Icons.person, color: Colors.white),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => ProfilePage()),
                );
              },
            ),
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: [
            Tab(text: 'Active (${activeAndExpiringCommunities.length})'),
            Tab(text: 'Completed (${completedCommunities.length})'),
            Tab(text: 'Expired (${expiredCommunities.length})'),
          ],
          labelStyle: TextStyle(fontFamily: 'Poppins'),
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
        ),
      ),
      body:
          isLoading
              ? const Center(
                child: CircularProgressIndicator(color: Colors.white),
              )
              : errorMessage.isNotEmpty
              ? Center(
                child: Text(
                  'Error: $errorMessage',
                  style: const TextStyle(color: Colors.white),
                ),
              )
              : TabBarView(
                controller: _tabController,
                children: [
                  _buildCommunityList(activeAndExpiringCommunities),
                  _buildCommunityList(completedCommunities),
                  _buildCommunityList(expiredCommunities),
                ],
              ),
      floatingActionButton: Tooltip(
        message: 'Create new Community',
        child: FloatingActionButton(
          onPressed: () async {
            final result = await Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => CreateCommunityPage()),
            );
            if (result == true) {
              setState(() {
                isLoading = true;
              });
              await fetchCommunities();
            }
          },
          backgroundColor: const Color(0xFF9290C3),
          child: const Icon(Icons.add, color: Colors.white),
        ),
      ),
    );
  }

  Widget _buildCommunityList(List<Community> communities) {
    if (communities.isEmpty) {
      return Center(
        child: Text(
          'No communities found',
          style: const TextStyle(color: Colors.white),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: fetchCommunities,
      child: ListView.builder(
        padding: const EdgeInsets.all(16.0),
        itemCount: communities.length,
        itemBuilder: (context, index) {
          final community = communities[index];
          final cardTitle = _getCardTitle(community);
          final cardColor = _getColorByStatus(community);
          final isExpired = community.status.toLowerCase() == 'expired';

          return _buildJourneyCard(
            cardTitle,
            cardColor,
            context,
            community: community,
            isExpired: isExpired,
          );
        },
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
      onTap: () async {
        await Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => CommunityPage(communityId: community.id),
          ),
        );

        setState(() {
          isLoading = true;
        });
        await fetchCommunities();
      },
      child: Card(
        color: color,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        elevation: 5,
        margin: const EdgeInsets.only(bottom: 16.0),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                  fontFamily: 'Poppins',
                  color: Colors.black,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                "Journey Name: ${community.name}",
                style: TextStyle(color: Colors.black, fontFamily: 'Poppins'),
              ),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Container(
                  width: MediaQuery.of(context).size.width - 64,
                  child: Text(
                    "Description: ${community.description}",
                    style: TextStyle(
                      color: Colors.black,
                      fontFamily: 'Poppins',
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ),
              Text(
                "Total Amount: ${currencyFormat.format(community.netFundAmount)}",
                style: TextStyle(color: Colors.black, fontFamily: 'Poppins'),
              ),
              Text(
                "Amount Collected: ${currencyFormat.format(community.currentAmount)}",
                style: TextStyle(color: Colors.black, fontFamily: 'Poppins'),
              ),
              Text(
                "Expiry Date: ${DateFormat('dd MMM yyyy').format(community.expiringDate)}",
                style: TextStyle(color: Colors.black, fontFamily: 'Poppins'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

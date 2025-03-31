import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'get_token.dart';
import 'add_transaction_page.dart';
import 'community_transaction_history_page.dart'; // Import the transaction history page
import 'community_chat_screen.dart';

class CommunityPage extends StatefulWidget {
  final String communityId;

  const CommunityPage({super.key, required this.communityId});

  @override
  State<CommunityPage> createState() => _CommunityPageState();
}

class _CommunityPageState extends State<CommunityPage> {
  String? selectedPerson;
  Offset? tooltipPosition;
  bool showTooltip = false;
  bool isRateSufficient = false;
  bool isLoading = true;
  String errorMessage = '';
  bool isManager = false;
  String? username;

  // Community data
  String communityName = '';
  String description = '';
  String adminUsername = '';
  String managerUsername = '';
  double netFundAmount = 0;
  double currentAmount = 0;
  DateTime? expiringDate;
  double currentRateOfInflow = 0;
  double requiredRateOfInflow = 0;
  List<dynamic> milestones = [];
  List<dynamic> membersUsernames = [];
  List<dynamic> memberContributions = [];
  bool isExpired = false;
  bool isCompleted = false;

  @override
  void initState() {
    super.initState();
    fetchCommunityDetails();
    checkIfManager();
  }

  Future<void> extendExpiryDate(DateTime newDate) async {
    try {
      String? token = await getAuthToken(context);
      if (token == null || token.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Authentication token is missing')),
        );
        return;
      }

      // Format the date to include time at 23:59:59
      final formattedDate =
          '${newDate.toIso8601String().split('T')[0]}T23:59:59.000Z';

      final response = await http.post(
        Uri.parse(
          'http://10.0.2.2:3000/community/updateExpiringDate/${widget.communityId}',
        ),
        headers: {
          'Authorization': 'Bearer $token'.trim(),
          'Cookie': 'token=$token'.trim(),
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: json.encode({'expiring_date': formattedDate}),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['status']['success'] == true) {
          // Refresh the community details
          await fetchCommunityDetails();
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Expiry date extended successfully!'),
              ),
            );
          }
        } else {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  data['status']['message'] ?? 'Failed to extend expiry date',
                ),
              ),
            );
          }
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                'Failed to extend expiry date: ${response.statusCode}',
              ),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error extending expiry date: $e')),
        );
      }
    }
  }

  Future<void> _showDatePicker() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 30)),
      firstDate: DateTime.now().add(const Duration(days: 1)),
      lastDate: DateTime(2100),
      builder: (BuildContext context, Widget? child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.dark(
              primary: Color(0xFF9290C3),
              onPrimary: Colors.white,
              surface: Color(0xFF1B1A55),
              onSurface: Colors.white,
            ),
            dialogBackgroundColor: const Color(0xFF070F2B),
            textButtonTheme: TextButtonThemeData(
              style: TextButton.styleFrom(
                foregroundColor: const Color(0xFF9290C3),
              ),
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      await extendExpiryDate(picked);
    }
  }

  Future<void> checkIfManager() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      username = prefs.getString('username');
      isManager = username == managerUsername;
    });
  }

  Future<void> fetchCommunityDetails() async {
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
        Uri.parse(
          'http://10.0.2.2:3000/community/details/${widget.communityId}',
        ),
        headers: {
          'Authorization': 'Bearer $token'.trim(),
          'Cookie': 'token=$token'.trim(),
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['status']['success'] == true) {
          setState(() {
            communityName = data['data']['community_name'] ?? '';
            description = data['data']['description'] ?? '';
            adminUsername = data['data']['admin_username'] ?? '';
            managerUsername = data['data']['manager_username'] ?? '';
            netFundAmount = (data['data']['net_fund_amt'] ?? 0).toDouble();
            currentAmount = (data['data']['current_amount'] ?? 0).toDouble();
            expiringDate =
                data['data']['expiring_date'] != null
                    ? DateTime.parse(data['data']['expiring_date'])
                    : null;
            currentRateOfInflow =
                double.tryParse(
                  data['data']['current_rate_of_inflow'] ?? '0',
                ) ??
                0;
            requiredRateOfInflow =
                double.tryParse(
                  data['data']['required_rate_of_inflow'] ?? '0',
                ) ??
                0;
            milestones = data['data']['milestones'] ?? [];
            membersUsernames = data['data']['members_usernames'] ?? [];
            memberContributions = data['data']['member_contributions'] ?? [];

            // Determine if community is expired or completed
            final now = DateTime.now();
            isExpired =
                expiringDate != null &&
                now.isAfter(expiringDate!) &&
                (netFundAmount != currentAmount);
            isCompleted =
                (netFundAmount == currentAmount) ||
                (data['data']['status']?.toString().toLowerCase() ==
                    'completed');

            isRateSufficient = currentRateOfInflow >= requiredRateOfInflow;
            isLoading = false;
          });
        } else {
          setState(() {
            errorMessage =
                data['status']['message'] ?? 'Failed to load community details';
            isLoading = false;
          });
        }
      } else {
        setState(() {
          errorMessage =
              'Failed to load community details: ${response.statusCode}';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Connection error: $e';
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return Scaffold(
        backgroundColor: const Color(0xFF070F2B),
        appBar: AppBar(
          automaticallyImplyLeading: true,
          iconTheme: const IconThemeData(color: Colors.white),
          title: const Text('Community', style: TextStyle(color: Colors.white)),
          backgroundColor: const Color(0xFF1B1A55),
        ),
        body: const Center(
          child: CircularProgressIndicator(color: Colors.white),
        ),
      );
    }

    if (errorMessage.isNotEmpty) {
      return Scaffold(
        backgroundColor: const Color(0xFF070F2B),
        appBar: AppBar(
          automaticallyImplyLeading: true,
          iconTheme: const IconThemeData(color: Colors.white),
          title: const Text('Community', style: TextStyle(color: Colors.white)),
          backgroundColor: const Color(0xFF1B1A55),
        ),
        body: Center(
          child: Text(
            errorMessage,
            style: const TextStyle(color: Colors.white),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFF070F2B),
      appBar: AppBar(
        automaticallyImplyLeading: true,
        iconTheme: const IconThemeData(color: Colors.white),
        title: Text(
          communityName,
          style: const TextStyle(fontFamily: 'Poppins', color: Colors.white),
        ),
        backgroundColor: const Color(0xFF1B1A55),
        actions: [
          IconButton(
            icon: const Icon(Icons.chat),
            tooltip: 'Community Chat',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder:
                      (context) => CommunityChatScreen(
                        communityId: widget.communityId,
                        communityName: communityName,
                      ),
                ),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.history),
            tooltip: 'Transaction History',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder:
                      (context) => CommunityTransactionHistoryPage(
                        communityId: widget.communityId,
                        communityName: communityName,
                      ),
                ),
              );
            },
          ),
        ],
      ),
      floatingActionButton:
          isExpired || isCompleted
              ? null
              : FloatingActionButton(
                onPressed: () async {
                  final result = await Navigator.push<bool>(
                    context,
                    MaterialPageRoute(
                      builder:
                          (context) => AddTransactionPage(
                            communityId: widget.communityId,
                            communityName: communityName,
                            currentAmount: currentAmount,
                            totalFundAmount: netFundAmount,
                          ),
                    ),
                  );
                  if (result == true) {
                    setState(() {
                      isLoading = true;
                    });
                    await fetchCommunityDetails();
                  }
                },
                backgroundColor: const Color(0xFF9290C3),
                child: const Icon(Icons.add, color: Colors.white),
              ),
      body: GestureDetector(
        onTap: () {
          setState(() {
            showTooltip = false;
          });
        },
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildStatusMessage(),
                const SizedBox(height: 20),
                _buildAmountInfo(),
                const SizedBox(height: 10),
                _buildInflowInfo(),
                const SizedBox(height: 20),
                _buildMembersSection(),
                const SizedBox(height: 20),
                const Text(
                  "Progress:",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 10),
                _buildMilestoneTimeline(),
                const SizedBox(height: 20),
                const Text(
                  "Contribution:",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 10),
                Stack(
                  children: [
                    _buildPieChart(),
                    if (showTooltip && tooltipPosition != null)
                      Positioned(
                        left: tooltipPosition!.dx - 50,
                        top: tooltipPosition!.dy - 80,
                        child: _buildTooltip(),
                      ),
                  ],
                ),
                if (isExpired &&
                    (username == adminUsername || username == managerUsername))
                  Padding(
                    padding: const EdgeInsets.only(top: 20),
                    child: ElevatedButton(
                      onPressed: _showDatePicker,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF9290C3),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 24,
                          vertical: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        'Extend Expiry Date',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildChatPreview() {
    // Sample data - replace with actual data from your backend
    final unreadCount = 3;
    final latestMessage = "user1: Let's discuss the next milestone";

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Community Chat:",
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        GestureDetector(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder:
                    (context) => CommunityChatScreen(
                      communityId: widget.communityId,
                      communityName: communityName,
                    ),
              ),
            );
          },
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF1B1A55),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: const Color(0xFF9290C3).withOpacity(0.3),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.chat, color: Color(0xFF9290C3)),
                    const SizedBox(width: 12),
                    const Text(
                      "Community Chat",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Spacer(),
                    if (unreadCount > 0)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFF9290C3),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          unreadCount.toString(),
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    const SizedBox(width: 8),
                    const Icon(Icons.chevron_right, color: Color(0xFF9290C3)),
                  ],
                ),
                if (latestMessage.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(top: 8, left: 36),
                    child: Text(
                      latestMessage,
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.8),
                        overflow: TextOverflow.ellipsis,
                      ),
                      maxLines: 1,
                    ),
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildStatusMessage() {
    if (isExpired) {
      String message = "This community's goals could not be achieved in time.";
      if (username == adminUsername && username == managerUsername) {
        message +=
            " As the admin/manager, please return the funds to the respective members.";
      } else if (username == adminUsername) {
        message +=
            " As the admin, please coordinate with the manager to return funds to members.";
      } else if (username == managerUsername) {
        message +=
            " As the manager, please return the funds to the respective members.";
      }
      return _buildMarqueeMessage(message, Colors.red);
    } else if (isCompleted) {
      return _buildMarqueeMessage(
        "Congratulations! This community's goals were successfully achieved!",
        Colors.green,
      );
    } else {
      return _buildRateInfo();
    }
  }

  Widget _buildInflowInfo() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Expected Inflow:",
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            Text(
              "₹${requiredRateOfInflow.toStringAsFixed(2)}/day",
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ],
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            const Text(
              "Current Inflow:",
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            Text(
              "₹${currentRateOfInflow.toStringAsFixed(2)}/day",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: isRateSufficient ? Colors.green : Colors.red,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildMarqueeMessage(String message, Color color) {
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 500),
      child: Container(
        key: ValueKey<String>(message),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.2),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: color.withOpacity(0.5)),
        ),
        child: Marquee(
          child: Text(
            message,
            style: TextStyle(color: color, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }

  Widget _buildMembersSection() {
    bool isAdminManagerSame = adminUsername == managerUsername;
    List<Map<String, dynamic>> members = [];

    // Add admin/manager first
    if (isAdminManagerSame) {
      members.add({
        'username': adminUsername,
        'role': 'Admin/Manager',
        'icon': Icons.star,
      });
    } else {
      members.add({
        'username': adminUsername,
        'role': 'Admin',
        'icon': Icons.star,
      });
      members.add({
        'username': managerUsername,
        'role': 'Manager',
        'icon': Icons.star,
      });
    }

    // Add other members
    for (var username in membersUsernames) {
      if (username != adminUsername && username != managerUsername) {
        members.add({
          'username': username,
          'role': 'Member',
          'icon': Icons.person,
        });
      }
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Members:",
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 10),
        Container(
          height: 200,
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Scrollbar(
            child: ListView(
              children:
                  members
                      .map(
                        (member) => _buildMemberTile(
                          member['username'],
                          member['role'],
                          member['icon'],
                        ),
                      )
                      .toList(),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildMemberTile(String name, String role, IconData icon) {
    return ListTile(
      leading: Icon(icon, color: const Color(0xFF9290C3)),
      title: Text(
        name,
        style: const TextStyle(
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
      subtitle: Text(role, style: const TextStyle(color: Colors.grey)),
    );
  }

  Widget _buildAmountInfo() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Total Amount:",
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            Text(
              "₹${netFundAmount.toStringAsFixed(2)}",
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ],
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            const Text(
              "Contributed:",
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            Text(
              "₹${currentAmount.toStringAsFixed(2)}",
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildMilestoneTimeline() {
    if (milestones.isEmpty) {
      return Column(
        children: [
          SizedBox(
            height: 30,
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                Positioned(
                  left: 0,
                  child: _buildMilestonePoint(
                    amount: 0,
                    isReached: true,
                    isLast: false,
                  ),
                ),
                Positioned(
                  right: 0,
                  child: _buildMilestonePoint(
                    amount: netFundAmount,
                    isReached: currentAmount >= netFundAmount,
                    isLast: true,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 5),
          LinearProgressIndicator(
            value: currentAmount / netFundAmount,
            backgroundColor: Colors.grey.withOpacity(0.3),
            color: const Color(0xFF9290C3),
            minHeight: 5,
          ),
        ],
      );
    }

    List<double> milestoneAmounts = [0];
    for (var milestone in milestones) {
      double amount = (milestone['target_amount'] ?? 0).toDouble();
      if (amount < netFundAmount) {
        milestoneAmounts.add(amount);
      }
    }

    double progress = currentAmount / netFundAmount;

    return Column(
      children: [
        SizedBox(
          height: 30,
          child: LayoutBuilder(
            builder: (context, constraints) {
              final availableWidth = constraints.maxWidth;
              return Stack(
                clipBehavior: Clip.none,
                children: [
                  for (var amount in milestoneAmounts)
                    Positioned(
                      left: (amount / netFundAmount) * (availableWidth - 48),
                      child: _buildMilestonePoint(
                        amount: amount,
                        isReached: amount <= currentAmount,
                        isLast: false,
                      ),
                    ),
                  Positioned(
                    right: 0,
                    child: _buildMilestonePoint(
                      amount: netFundAmount,
                      isReached: currentAmount >= netFundAmount,
                      isLast: true,
                    ),
                  ),
                ],
              );
            },
          ),
        ),
        const SizedBox(height: 5),
        LinearProgressIndicator(
          value: progress,
          backgroundColor: Colors.grey.withOpacity(0.3),
          color: const Color(0xFF9290C3),
          minHeight: 5,
        ),
      ],
    );
  }

  Widget _buildMilestonePoint({
    required double amount,
    required bool isReached,
    required bool isLast,
  }) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment:
          isLast ? CrossAxisAlignment.end : CrossAxisAlignment.center,
      children: [
        Text(
          "₹${amount.toStringAsFixed(0)}",
          style: TextStyle(
            fontSize: 12,
            fontWeight: isLast ? FontWeight.bold : FontWeight.normal,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 4),
        Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: isReached ? const Color(0xFF9290C3) : Colors.grey,
            border:
                isLast
                    ? Border.all(color: const Color(0xFF9290C3), width: 2)
                    : null,
          ),
        ),
      ],
    );
  }

  Widget _buildPieChart() {
    if (memberContributions.isEmpty || currentAmount == 0) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Text(
            "No contribution data available",
            style: TextStyle(color: Colors.grey),
          ),
        ),
      );
    }

    return SizedBox(
      height: 220,
      child: PieChart(
        PieChartData(
          sections:
              memberContributions.map((contribution) {
                final username = contribution['username'] ?? 'Unknown';
                final value =
                    (contribution['total_contribution'] ?? 0).toDouble();
                return PieChartSectionData(
                  value: value,
                  color: _getColorForPerson(username),
                  title: "${(value / currentAmount * 100).toStringAsFixed(1)}%",
                  radius: selectedPerson == username ? 70 : 50,
                  titleStyle: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                  badgeWidget:
                      selectedPerson == username
                          ? const Icon(
                            Icons.check_circle,
                            color: Colors.white,
                            size: 16,
                          )
                          : null,
                  badgePositionPercentageOffset: 1.2,
                  showTitle: true,
                );
              }).toList(),
          sectionsSpace: 2,
          centerSpaceRadius: 40,
          pieTouchData: PieTouchData(
            touchCallback: (FlTouchEvent event, pieTouchResponse) {
              if (pieTouchResponse?.touchedSection == null) {
                setState(() {
                  showTooltip = false;
                });
                return;
              }
              final touchedIndex =
                  pieTouchResponse!.touchedSection!.touchedSectionIndex;
              final selectedName =
                  memberContributions[touchedIndex]['username'];
              setState(() {
                selectedPerson = selectedName;
                tooltipPosition =
                    event is FlTapDownEvent
                        ? event.localPosition
                        : tooltipPosition;
                showTooltip = true;
              });
            },
          ),
        ),
      ),
    );
  }

  Widget _buildTooltip() {
    if (selectedPerson == null) return const SizedBox();

    var contribution = memberContributions.firstWhere(
      (c) => c['username'] == selectedPerson,
      orElse: () => {'username': 'Unknown', 'total_contribution': 0},
    );

    double amount = (contribution['total_contribution'] ?? 0).toDouble();
    double percentage = (amount / currentAmount) * 100;

    return Material(
      color: Colors.transparent,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: const Color(0xFF1B1A55),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: const Color(0xFF9290C3)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Contributor: ${selectedPerson!}',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              "Amount: ₹${amount.toStringAsFixed(2)}",
              style: const TextStyle(color: Colors.white, fontSize: 12),
            ),
            Text(
              "Contribution: ${percentage.toStringAsFixed(1)}%",
              style: const TextStyle(color: Colors.white, fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRateInfo() {
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 500),
      child: Container(
        key: ValueKey<bool>(isRateSufficient),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color:
              isRateSufficient
                  ? Colors.green.withOpacity(0.2)
                  : Colors.red.withOpacity(0.2),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color:
                isRateSufficient
                    ? Colors.green.withOpacity(0.5)
                    : Colors.red.withOpacity(0.5),
          ),
        ),
        child: Marquee(
          child: Text(
            isRateSufficient
                ? "Great progress! Current contribution rate is sufficient to reach the goal. Keep up the good work!"
                : "Attention needed! Current contribution rate may not be enough to reach the goal. Please consider increasing contributions.",
            style: TextStyle(
              color: isRateSufficient ? Colors.green : Colors.red,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }

  Color _getColorForPerson(String person) {
    int hash = person.hashCode;
    return Color.fromARGB(
      255,
      (hash & 0xFF0000) >> 16,
      (hash & 0x00FF00) >> 8,
      hash & 0x0000FF,
    ).withOpacity(0.7);
  }
}

class Marquee extends StatefulWidget {
  final Widget child;
  final Axis direction;
  final Duration animationDuration;
  final Duration backDuration;
  final Duration pauseDuration;

  const Marquee({
    Key? key,
    required this.child,
    this.direction = Axis.horizontal,
    this.animationDuration = const Duration(milliseconds: 3000),
    this.backDuration = const Duration(milliseconds: 800),
    this.pauseDuration = const Duration(milliseconds: 800),
  }) : super(key: key);

  @override
  _MarqueeState createState() => _MarqueeState();
}

class _MarqueeState extends State<Marquee> {
  late ScrollController scrollController;

  @override
  void initState() {
    scrollController = ScrollController();
    WidgetsBinding.instance.addPostFrameCallback(scroll);
    super.initState();
  }

  @override
  void dispose() {
    scrollController.dispose();
    super.dispose();
  }

  void scroll(_) async {
    while (scrollController.hasClients) {
      await Future.delayed(widget.pauseDuration);
      if (scrollController.hasClients) {
        await scrollController.animateTo(
          scrollController.position.maxScrollExtent,
          duration: widget.animationDuration,
          curve: Curves.linear,
        );
      }
      await Future.delayed(widget.pauseDuration);
      if (scrollController.hasClients) {
        await scrollController.animateTo(
          0.0,
          duration: widget.backDuration,
          curve: Curves.easeOut,
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: widget.direction,
      controller: scrollController,
      child: widget.child,
    );
  }
}

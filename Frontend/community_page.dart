import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'get_token.dart';
import 'add_transaction_page.dart';

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

  @override
  void initState() {
    super.initState();
    fetchCommunityDetails();
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

      print(json.decode(response.body));

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
        appBar: AppBar(
          title: const Text('Community', style: TextStyle(color: Colors.white)),
          backgroundColor: Colors.blueAccent,
        ),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (errorMessage.isNotEmpty) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Community', style: TextStyle(color: Colors.white)),
          backgroundColor: Colors.blueAccent,
        ),
        body: Center(child: Text(errorMessage)),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(
          communityName,
          style: const TextStyle(fontFamily: 'Poppins', color: Colors.white),
        ),
        backgroundColor: Colors.blueAccent,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Check if all milestones are completed
          bool allMilestonesComplete =
              milestones.isNotEmpty &&
                  milestones.every(
                        (m) => (m['achieved_amount'] ?? 0) >= (m['target_amount'] ?? 0),
                  );

          if (allMilestonesComplete) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  'All goals completed! No further contributions needed.',
                ),
                backgroundColor: Colors.green,
                duration: Duration(seconds: 2),
              ),
            );
            return;
          }

          // Determine current milestone ID and target amount
          String currentMilestoneId = '';
          double currentMilestoneTarget =
              netFundAmount; // Default to total fund amount
          if (milestones.isNotEmpty) {
            for (var milestone in milestones) {
              if ((milestone['achieved_amount'] ?? 0) <
                  (milestone['target_amount'] ?? 0)) {
                currentMilestoneId = milestone['_id'] ?? '';
                currentMilestoneTarget =
                    (milestone['target_amount'] ?? 0).toDouble();
                break;
              }
            }
          }

          Navigator.push(
            context,
            MaterialPageRoute(
              builder:
                  (context) => AddTransactionPage(
                communityId: widget.communityId,
                milestoneId: currentMilestoneId,
                communityName: communityName,
                currentAmount: currentAmount,
                totalFundAmount: netFundAmount,
              ),
            ),
          );
        },
        backgroundColor: Colors.blueAccent,
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
                _buildAmountInfo(),
                const SizedBox(height: 20),
                _buildMembersSection(),
                const SizedBox(height: 20),
                const Text(
                  "Progress:",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 10),
                _buildMilestoneTimeline(),
                const SizedBox(height: 20),
                const Text(
                  "Contribution:",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
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
                const SizedBox(height: 20),
                _buildRateInfo(),
              ],
            ),
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
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 10),
        Container(
          height: 200,
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey.shade300),
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
      leading: Icon(icon, color: Colors.blueAccent),
      title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
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
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
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
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildMilestoneTimeline() {
    if (milestones.isEmpty) return const SizedBox();

    // Add 0 as the first milestone
    List<double> milestoneAmounts = [0];
    milestoneAmounts.addAll(
      milestones.map((m) => (m['target_amount'] ?? 0).toDouble()),
    );

    double progress = currentAmount / netFundAmount;

    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children:
          milestoneAmounts
              .map(
                (amount) => Text(
              "₹${amount.toStringAsFixed(0)}",
              style: const TextStyle(fontSize: 12),
            ),
          )
              .toList(),
        ),
        const SizedBox(height: 5),
        Stack(
          children: [
            Container(
              height: 5,
              width: double.infinity,
              color: Colors.grey[300],
            ),
            Container(
              height: 5,
              width: MediaQuery.of(context).size.width * progress,
              color: Colors.blue,
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: List.generate(
                milestoneAmounts.length,
                    (index) => Container(
                  width: 10,
                  height: 10,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color:
                    index <= (progress * (milestoneAmounts.length - 1))
                        ? Colors.blue
                        : Colors.grey,
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildPieChart() {
    if (memberContributions.isEmpty || currentAmount == 0) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(20.0),
          child: Text("No contribution data available"),
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
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.black87,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              selectedPerson!,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              "Amount: ₹${amount.toStringAsFixed(2)}",
              style: const TextStyle(color: Colors.white),
            ),
            Text(
              "Contribution: ${percentage.toStringAsFixed(1)}%",
              style: const TextStyle(color: Colors.white),
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
          color: isRateSufficient ? Colors.green.shade100 : Colors.red.shade100,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Marquee(
          child: Text(
            isRateSufficient
                ? "Great progress! Current contribution rate is sufficient to reach the goal. Keep up the good work!"
                : "Attention needed! Current contribution rate may not be enough to reach the goal. Please consider increasing contributions.",
            style: TextStyle(
              color:
              isRateSufficient
                  ? Colors.green.shade800
                  : Colors.red.shade800,
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

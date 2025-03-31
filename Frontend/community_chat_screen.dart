import 'package:flutter/material.dart';

class CommunityChatScreen extends StatefulWidget {
  final String communityId;
  final String communityName;

  const CommunityChatScreen({
    Key? key,
    required this.communityId,
    required this.communityName,
  }) : super(key: key);

  @override
  _CommunityChatScreenState createState() => _CommunityChatScreenState();
}

class _CommunityChatScreenState extends State<CommunityChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  // Sample chat data - replace with your actual data from Node.js backend
  final List<Map<String, dynamic>> _messages = [
    {
      'id': '1',
      'sender': 'user1',
      'text': 'Hey everyone! Welcome to our community!',
      'timestamp': DateTime.now().subtract(Duration(days: 2)),
      'isMe': false,
      'read': true,
    },
    {
      'id': '2',
      'sender': 'user2',
      'text': 'Thanks for creating this group!',
      'timestamp': DateTime.now().subtract(Duration(days: 2)),
      'isMe': false,
      'read': true,
    },
    {
      'id': '3',
      'sender': 'You',
      'text': "Let's discuss our first milestone",
      'timestamp': DateTime.now().subtract(Duration(days: 1)),
      'isMe': true,
      'read': true,
    },
    {
      'id': '4',
      'sender': 'user3',
      'text': 'I think we should aim for ₹5000 first',
      'timestamp': DateTime.now().subtract(Duration(hours: 12)),
      'isMe': false,
      'read': true,
    },
    {
      'id': '5',
      'sender': 'user1',
      'text': 'Sounds good to me!',
      'timestamp': DateTime.now().subtract(Duration(hours: 10)),
      'isMe': false,
      'read': true,
    },
    {
      'id': '6',
      'sender': 'user4',
      'text': 'I just contributed ₹1000',
      'timestamp': DateTime.now().subtract(Duration(hours: 2)),
      'isMe': false,
      'read': false, // Unread message
    },
    {
      'id': '7',
      'sender': 'user2',
      'text': 'Great progress everyone!',
      'timestamp': DateTime.now().subtract(Duration(hours: 1)),
      'isMe': false,
      'read': false, // Unread message
    },
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scrollController.jumpTo(_scrollController.position.maxScrollExtent);
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  void _sendMessage() {
    if (_messageController.text.trim().isEmpty) return;

    setState(() {
      _messages.add({
        'id': DateTime.now().millisecondsSinceEpoch.toString(),
        'sender': 'You',
        'text': _messageController.text,
        'timestamp': DateTime.now(),
        'isMe': true,
        'read': true,
      });
      _messageController.clear();
    });

    _scrollController.animateTo(
      _scrollController.position.maxScrollExtent,
      duration: Duration(milliseconds: 300),
      curve: Curves.easeOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF070F2B),
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.communityName,
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Text(
              '${_messages.where((msg) => !msg['isMe'] && !msg['read']).length} unread',
              style: TextStyle(fontSize: 12),
            ),
          ],
        ),
        backgroundColor: const Color(0xFF1B1A55),
        iconTheme: const IconThemeData(color: Colors.white),
        actions: [
          IconButton(
            icon: Icon(Icons.more_vert),
            onPressed: () {
              // Handle more options
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: EdgeInsets.only(top: 8),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final message = _messages[index];
                final isMe = message['isMe'];
                final isUnread = !isMe && !message['read'];
                final showUnreadHeader =
                    isUnread &&
                        (index == 0 ||
                            _messages[index - 1]['read'] ||
                            _messages[index - 1]['isMe']);

                return Column(
                  children: [
                    if (showUnreadHeader)
                      Container(
                        padding: EdgeInsets.symmetric(
                          vertical: 8,
                          horizontal: 16,
                        ),
                        margin: EdgeInsets.symmetric(vertical: 8),
                        decoration: BoxDecoration(
                          color: Color(0xFF1B1A55).withOpacity(0.7),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          'UNREAD MESSAGES',
                          style: TextStyle(
                            color: Color(0xFF9290C3),
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    Container(
                      margin: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      child: Align(
                        alignment:
                        isMe ? Alignment.centerRight : Alignment.centerLeft,
                        child: ConstrainedBox(
                          constraints: BoxConstraints(
                            maxWidth: MediaQuery.of(context).size.width * 0.75,
                          ),
                          child: Column(
                            crossAxisAlignment:
                            isMe
                                ? CrossAxisAlignment.end
                                : CrossAxisAlignment.start,
                            children: [
                              if (!isMe)
                                Padding(
                                  padding: EdgeInsets.only(bottom: 4),
                                  child: Text(
                                    message['sender'],
                                    style: TextStyle(
                                      color: Color(0xFF9290C3),
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              Container(
                                padding: EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 8,
                                ),
                                decoration: BoxDecoration(
                                  color:
                                  isMe
                                      ? Color(0xFF9290C3)
                                      : Color(0xFF1B1A55),
                                  borderRadius: BorderRadius.only(
                                    topLeft: Radius.circular(isMe ? 12 : 0),
                                    topRight: Radius.circular(isMe ? 0 : 12),
                                    bottomLeft: Radius.circular(12),
                                    bottomRight: Radius.circular(12),
                                  ),
                                ),
                                child: Text(
                                  message['text'],
                                  style: TextStyle(color: Colors.white),
                                ),
                              ),
                              Padding(
                                padding: EdgeInsets.only(top: 4),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  mainAxisAlignment:
                                  isMe
                                      ? MainAxisAlignment.end
                                      : MainAxisAlignment.start,
                                  children: [
                                    Text(
                                      _formatTime(message['timestamp']),
                                      style: TextStyle(
                                        color: Colors.white54,
                                        fontSize: 10,
                                      ),
                                    ),
                                    if (isMe)
                                      Padding(
                                        padding: EdgeInsets.only(left: 4),
                                        child: Icon(
                                          message['read']
                                              ? Icons.done_all
                                              : Icons.done,
                                          size: 12,
                                          color:
                                          message['read']
                                              ? Color(0xFF9290C3)
                                              : Colors.white54,
                                        ),
                                      ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            color: Color(0xFF1B1A55),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    style: TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'Type a message...',
                      hintStyle: TextStyle(color: Colors.white54),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20),
                        borderSide: BorderSide.none,
                      ),
                      filled: true,
                      fillColor: Color(0xFF070F2B),
                      contentPadding: EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                      suffixIcon: IconButton(
                        icon: Icon(
                          Icons.emoji_emotions,
                          color: Color(0xFF9290C3),
                        ),
                        onPressed: () {
                          // Open emoji picker
                        },
                      ),
                    ),
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: Color(0xFF9290C3),
                  child: IconButton(
                    icon: Icon(Icons.send, color: Colors.white),
                    onPressed: _sendMessage,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatTime(DateTime timestamp) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(Duration(days: 1));

    if (timestamp.isAfter(today)) {
      return '${timestamp.hour}:${timestamp.minute.toString().padLeft(2, '0')}';
    } else if (timestamp.isAfter(yesterday)) {
      return 'Yesterday';
    } else {
      return '${timestamp.day}/${timestamp.month}/${timestamp.year}';
    }
  }
}

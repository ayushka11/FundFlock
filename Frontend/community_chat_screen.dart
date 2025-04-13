import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import 'package:shared_preferences/shared_preferences.dart';
import 'get_token.dart';

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
  List<Map<String, dynamic>> _messages = [];
  String? _username;
  String? _lastReadMessageId;
  bool _isLoading = true;
  bool _isLastPage = false;
  int _currentPage = 1;
  Timer? _pollingTimer;
  bool _isSending = false;
  bool _hasMoreMessages = true;
  bool _isInitialLoad = true;
  bool _isViewingLatestMessages = true;
  bool _isFirstPage = true;

  @override
  void initState() {
    super.initState();
    _loadUsername();
    _loadLastReadMessageId().then((_) {
      _fetchMessages();
    });
    _setupScrollListener();
    _startPolling();
    _messageController.addListener(_handleTextChange);
  }

  @override
  void dispose() {
    if (_messages.isNotEmpty) {
      _updateLastReadMessage(_messages.last['id']);
    }
    _pollingTimer?.cancel();
    _scrollController.dispose();
    _messageController.removeListener(_handleTextChange);
    _messageController.dispose();
    super.dispose();
  }

  Future<void> _loadLastReadMessageId() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _lastReadMessageId = prefs.getString('last_read_${widget.communityId}');
    });
  }

  Future<void> _saveLastReadMessageId(String messageId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('last_read_${widget.communityId}', messageId);
  }

  void _handleTextChange() {
    if (mounted) setState(() {});
  }

  Future<void> _loadUsername() async {
    final prefs = await SharedPreferences.getInstance();
    if (mounted) {
      setState(() {
        _username = prefs.getString('username');
      });
    }
  }

  void _setupScrollListener() {
    _scrollController.addListener(() {
      final isNearBottom =
          _scrollController.position.pixels >=
              _scrollController.position.maxScrollExtent - 200;

      if (mounted) {
        setState(() {
          _isViewingLatestMessages = isNearBottom;
          if (isNearBottom && !_isFirstPage) {
            _isFirstPage = true;
          }
        });
      }

      if (isNearBottom && _messages.isNotEmpty && _isFirstPage) {
        _updateLastReadMessage(_messages.last['id']);
      }

      if (_scrollController.position.pixels ==
          _scrollController.position.minScrollExtent &&
          _hasMoreMessages &&
          !_isLoading) {
        _loadMoreMessages();
      }
    });
  }

  void _startPolling() {
    _pollingTimer = Timer.periodic(Duration(seconds: 3), (timer) {
      if (!_isLoading && _isFirstPage && mounted) {
        _fetchNewMessages();
      }
    });
  }

  Future<void> _fetchMessages() async {
    try {
      if (mounted) {
        setState(() {
          _isLoading = true;
          _isViewingLatestMessages = true;
          _isFirstPage = true;
        });
      }

      final String? token = await getAuthToken(context);
      if (token == null || token.isEmpty) {
        throw Exception('Authentication token is missing');
      }

      final response = await http.get(
        Uri.parse(
          'http://192.168.14.49:3000/chat/getChats/${widget.communityId}/1',
        ),
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
            data['data']['messages'] != null) {
          List<dynamic> messageList = data['data']['messages'];
          final originalLastReadId = data['data']['last_read_message_id'];

          if (_lastReadMessageId == null && originalLastReadId != null) {
            await _saveLastReadMessageId(originalLastReadId);
          }

          if (mounted) {
            setState(() {
              _messages =
                  messageList.reversed
                      .map((item) => _convertMessage(item))
                      .toList();
              _isLastPage = data['data']['isLastPage'] ?? false;
              _lastReadMessageId = _lastReadMessageId ?? originalLastReadId;
              _currentPage = 1;
              _isInitialLoad = false;
            });
          }

          WidgetsBinding.instance.addPostFrameCallback((_) {
            _scrollToBottom();
          });
        } else {
          throw Exception('Invalid response format');
        }
      } else {
        throw Exception('Failed to fetch messages: ${response.statusCode}');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error fetching messages: $e')));
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _fetchNewMessages() async {
    try {
      if (!_isFirstPage) return;

      final String? token = await getAuthToken(context);
      if (token == null || token.isEmpty) return;

      final response = await http.get(
        Uri.parse(
          'http://192.168.14.49:3000/chat/getChats/${widget.communityId}/1',
        ),
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
            data['data']['messages'] != null) {
          List<dynamic> newMessages = data['data']['messages'];
          final originalLastReadId = data['data']['last_read_message_id'];

          List<Map<String, dynamic>> convertedMessages =
          newMessages.map((item) => _convertMessage(item)).toList();

          if (convertedMessages.isNotEmpty) {
            List<Map<String, dynamic>> newMessagesToAdd =
            convertedMessages
                .where(
                  (newMsg) =>
              !_messages.any((msg) => msg['id'] == newMsg['id']),
            )
                .toList()
                .reversed
                .toList();

            if (newMessagesToAdd.isNotEmpty) {
              if (mounted) {
                setState(() {
                  _messages.addAll(newMessagesToAdd);
                  _isLastPage = data['data']['isLastPage'] ?? false;
                  _lastReadMessageId = originalLastReadId;
                });
              }

              if (_isViewingLatestMessages) {
                WidgetsBinding.instance.addPostFrameCallback((_) {
                  _scrollToBottom();
                });
              }
            }
          }
        }
      }
    } catch (e) {
      print('Error fetching new messages: $e');
    }
  }

  Future<void> _loadMoreMessages() async {
    if (_isLoading || _isLastPage) return;

    try {
      if (mounted) {
        setState(() {
          _isLoading = true;
          _isViewingLatestMessages = false;
          _isFirstPage = false;
        });
      }

      final String? token = await getAuthToken(context);
      if (token == null || token.isEmpty) {
        throw Exception('Authentication token is missing');
      }

      final response = await http.get(
        Uri.parse(
          'http://192.168.14.49:3000/chat/getChats/${widget.communityId}/${_currentPage + 1}',
        ),
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
            data['data']['messages'] != null) {
          List<dynamic> messageList = data['data']['messages'];
          if (mounted) {
            setState(() {
              _messages.insertAll(
                0,
                messageList.reversed.map((item) => _convertMessage(item)),
              );
              _isLastPage = data['data']['isLastPage'] ?? false;
              _currentPage++;
            });
          }
        } else {
          throw Exception('Invalid response format');
        }
      } else {
        throw Exception(
          'Failed to fetch more messages: ${response.statusCode}',
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error loading more messages: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Map<String, dynamic> _convertMessage(dynamic message) {
    final isMe = message['sender'] == _username;
    bool isRead = isMe; // Messages I sent are always "read"

    if (!isMe && _lastReadMessageId != null) {
      isRead = _isMessageRead({
        'id': message['_id'],
        'timestamp': DateTime.parse(message['timestamp']),
        'isMe': isMe,
      });
    }

    return {
      'id': message['_id'],
      'sender': message['sender'],
      'text': message['content'],
      'timestamp': DateTime.parse(message['timestamp']),
      'isMe': isMe,
      'read': isRead,
    };
  }

  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    }
  }

  Future<void> _updateLastReadMessage(String messageId) async {
    try {
      final String? token = await getAuthToken(context);
      if (token == null || token.isEmpty) return;

      final response = await http.post(
        Uri.parse('http://192.168.14.49:3000/chat/updateLastRead'),
        headers: {
          'Authorization': 'Bearer $token'.trim(),
          'Cookie': 'token=$token'.trim(),
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: json.encode({
          'community_id': widget.communityId,
          'message_id': messageId,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['status']['success'] == true) {
          await _saveLastReadMessageId(messageId);
          if (mounted) {
            setState(() {
              _lastReadMessageId = messageId;
              for (var msg in _messages) {
                if (!msg['isMe'] && !msg['read']) {
                  msg['read'] = _isMessageRead(msg);
                }
              }
            });
          }
        }
      }
    } catch (e) {
      print('Error updating last read message: $e');
    }
  }

  bool _isMessageRead(Map<String, dynamic> message) {
    if (message['isMe']) return true;
    if (_lastReadMessageId == null) return false;

    final messageTime = message['timestamp'] as DateTime;
    final lastReadMsg = _messages.firstWhere(
          (m) => m['id'] == _lastReadMessageId,
      orElse: () => {'timestamp': DateTime(0)},
    );
    final lastReadTime = lastReadMsg['timestamp'] as DateTime;

    return messageTime.isBefore(lastReadTime) ||
        message['id'] == _lastReadMessageId;
  }

  Future<bool> markAllMessagesAsRead() async {
    if (_messages.isEmpty) return true;
    final lastMessageId = _messages.last['id'];
    await _updateLastReadMessage(lastMessageId);
    return true;
  }

  Future<void> _sendMessage() async {
    if (_messageController.text.trim().isEmpty || _isSending) return;

    if (mounted) {
      setState(() {
        _isSending = true;
      });
    }

    try {
      final String? token = await getAuthToken(context);
      if (token == null || token.isEmpty) {
        throw Exception('Authentication token is missing');
      }

      final response = await http.post(
        Uri.parse('http://192.168.14.49:3000/chat/send'),
        headers: {
          'Authorization': 'Bearer $token'.trim(),
          'Cookie': 'token=$token'.trim(),
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: json.encode({
          'message': _messageController.text,
          'community_id': widget.communityId,
        }),
      );

      if (response.statusCode == 200) {
        _messageController.clear();
        await _fetchMessages();
        _scrollToBottom();
      } else {
        throw Exception('Failed to send message: ${response.statusCode}');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error sending message: $e')));
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSending = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: markAllMessagesAsRead,
      child: Scaffold(
        backgroundColor: const Color(0xFF070F2B),
        appBar: AppBar(
          title: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                widget.communityName,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          backgroundColor: const Color(0xFF1B1A55),
          iconTheme: const IconThemeData(color: Colors.white),
          actions: [
            IconButton(
              icon: Icon(Icons.more_vert),
              onPressed: () {
                // Show options menu
              },
            ),
          ],
        ),
        body: Column(
          children: [
            Expanded(
              child:
              _isInitialLoad
                  ? Center(child: CircularProgressIndicator())
                  : GestureDetector(
                onTap: () => FocusScope.of(context).unfocus(),
                child: ListView.builder(
                  controller: _scrollController,
                  reverse: false,
                  padding: EdgeInsets.only(top: 8, bottom: 8),
                  itemCount: _messages.length + (_isLoading ? 1 : 0),
                  itemBuilder: (context, index) {
                    if (index >= _messages.length) {
                      return Center(child: CircularProgressIndicator());
                    }

                    final message = _messages[index];
                    final isMe = message['isMe'];

                    return Container(
                      margin: EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      child: Align(
                        alignment:
                        isMe
                            ? Alignment.centerRight
                            : Alignment.centerLeft,
                        child: ConstrainedBox(
                          constraints: BoxConstraints(
                            maxWidth:
                            MediaQuery.of(context).size.width *
                                0.75,
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
                                    topLeft: Radius.circular(12),
                                    topRight: Radius.circular(12),
                                    bottomLeft: Radius.circular(
                                      isMe ? 12 : 0,
                                    ),
                                    bottomRight: Radius.circular(
                                      isMe ? 0 : 12,
                                    ),
                                  ),
                                ),
                                child: Text(
                                  message['text'],
                                  style: TextStyle(color: Colors.white),
                                ),
                              ),
                              Padding(
                                padding: EdgeInsets.only(top: 4),
                                child: Text(
                                  _formatTime(message['timestamp']),
                                  style: TextStyle(
                                    color: Colors.white54,
                                    fontSize: 10,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
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
                      ),
                      onSubmitted: (_) => _sendMessage(),
                    ),
                  ),
                  SizedBox(width: 8),
                  CircleAvatar(
                    backgroundColor:
                    _messageController.text.trim().isEmpty
                        ? Color(0xFF9290C3).withOpacity(0.5)
                        : Color(0xFF9290C3),
                    child: IconButton(
                      icon:
                      _isSending
                          ? SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          valueColor: AlwaysStoppedAnimation<Color>(
                            Colors.white,
                          ),
                          strokeWidth: 2,
                        ),
                      )
                          : Icon(Icons.send, color: Colors.white),
                      onPressed:
                      _messageController.text.trim().isEmpty || _isSending
                          ? null
                          : _sendMessage,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
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

import 'package:flutter/material.dart';

class NotificationDialog extends StatefulWidget {
  final String title;
  final String body;
  NotificationDialog({
    required this.title,
    required this.body,
  });

  @override
  State<NotificationDialog> createState() => _NewRequestDialogState();
}

class _NewRequestDialogState extends State<NotificationDialog> {
  @override
  void initState() {
    super.initState();

    // _startAlarm();
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
      //insetPadding: EdgeInsets.all(Dimensions.PADDING_SIZE_LARGE),
      child: Container(
        width: 500,
        padding: EdgeInsets.all(25),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Icon(Icons.notifications_active, size: 60, color: Color(0xFF21899C)),
          SizedBox(height: 20),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: Text(
              widget.title,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14),
            ),
          ),
          SizedBox(height: 10),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: Text(
              widget.body,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14),
            ),
          ),
          SizedBox(height: 20),
          Row(mainAxisAlignment: MainAxisAlignment.center, children: [
            Flexible(
              child: SizedBox(
                  width: 120,
                  height: 40,
                  child: TextButton(
                    onPressed: () => Navigator.of(context).pop(),
                    style: TextButton.styleFrom(
                      backgroundColor: Color(0xFF21899C),
                      padding: EdgeInsets.zero,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(5)),
                    ),
                    child: Text(
                      'OK',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 20, color: Colors.white),
                    ),
                  )),
            ),
            SizedBox(width: 20),
          ]),
        ]),
      ),
    );
  }
}

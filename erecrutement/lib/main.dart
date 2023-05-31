import 'package:erecrutement/firebase_options.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:erecrutement/screens/jobs.dart';
import 'package:erecrutement/screens/login.dart';
import 'package:erecrutement/screens/registre.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  FirebaseMessaging messaging = FirebaseMessaging.instance;
  NotificationSettings settings = await messaging.requestPermission(
    alert: true,
    announcement: false,
    badge: false,
    criticalAlert: false,
    provisional: false,
    sound: true,
  );
  print('user granted permission :${settings.authorizationStatus}');
  FirebaseMessaging.onMessage.listen((RemoteMessage message) {
    print("got a message whilst in the fore:");
    var message;
    print("Message data:${message.data}");

    if (message.notification != null) {
      print('Message also contained a notification:${message.notification}');
    }
  });

  final tokenFCM = await messaging.getToken();
  print(tokenFCM);

  final token = await getToken();

  runApp(MyApp(
    token: token!,
  ));
}

Future<String?> getToken() async {
  final prefs = await SharedPreferences.getInstance();
  var token = prefs.getString('token') ?? "";
  print("token" + token);
  return token;
}

class MyApp extends StatelessWidget {
  final String token;

  const MyApp({super.key, required this.token});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'E-recrutement',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      initialRoute: token != "" ? '/job_list' : '/',
      routes: {
        '/': (context) => LoginScreen(),
        '/signup': (context) => SignUpScreen(),
        '/job_list': (context) => JobsList(),
      },
    );
  }
}

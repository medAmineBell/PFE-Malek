import 'package:erecrutement/constants.dart';
import 'package:erecrutement/widgets/notification_dialog.dart';
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:erecrutement/screens/apply.dart';
import 'package:erecrutement/screens/job_details.dart';
import 'package:erecrutement/models/jobs_model.dart';
import 'package:erecrutement/models/user_model.dart';
import 'package:shared_preferences/shared_preferences.dart';

class JobsList extends StatefulWidget {
  @override
  _JobsListState createState() => _JobsListState();
}

class _JobsListState extends State<JobsList> {
  List<Job> jobs = [];
  List<User> users = [];
  bool isLoading = false;
  late String user;

  @override
  void initState() {
    super.initState();
    fetchData();
    getLoggedInUserId();
  }

  Future<void> fetchData() async {
    try {
      setState(() {
        isLoading = true;
      });

      final response = await Dio().get(Constants.apiUrl + '/api/jobs');

      if (response.statusCode == 200) {
        final List<dynamic> jsonList = response.data;
        setState(() {
          jobs = jsonList.map((json) => Job.fromJson(json)).toList();
        });
      } else {
        throw Exception('Failed to fetch data');
      }
    } catch (e) {
      throw Exception('Failed to fetch data: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> getLoggedInUserId() async {
    final prefs = await SharedPreferences.getInstance();
    final userId = prefs.getString('user');
    setState(() {
      user = userId ?? '';
    });
  }

  Future<void> signOut() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token'); //delete token for this session
    await prefs.remove('user');
    Navigator.pushNamedAndRemoveUntil(context, '/', (_) => false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Jobs List'),
        backgroundColor: const Color(0xFF21899C),
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            //onPressed: isLoading ? null : signOut,
            onPressed: () async {
              await showDialog(
                context: this.context,
                builder: (BuildContext context) => NotificationDialog(
                    title: "Kaizen-Bridge Team",
                    body:
                        "Votre entretien d'embauche pour le poste de [Poste] a été fixé pour demain"),
              );
            },
          ),
        ],
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : GridView.builder(
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 10.0,
                mainAxisSpacing: 10.0,
              ),
              itemCount: jobs.length,
              itemBuilder: (context, index) {
                final job = jobs[index];
                return GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => JobDetailsPage(job),
                      ),
                    );
                  },
                  child: Card(
                    elevation: 4.0,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: job.image.toLowerCase().endsWith('.svg')
                              ? SvgPicture.network(
                                  job.image,
                                  fit: BoxFit.cover,
                                )
                              : Image.network(
                                  job.image,
                                  fit: BoxFit.cover,
                                ),
                        ),
                        Padding(
                          padding: EdgeInsets.all(8.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                job.title,
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16.0,
                                ),
                              ),
                              SizedBox(height: 4.0),
                              Text(
                                job.companyName,
                                style: TextStyle(fontSize: 14.0),
                              ),
                              SizedBox(height: 4.0),
                              Text(
                                job.location,
                                style: TextStyle(fontSize: 14.0),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}

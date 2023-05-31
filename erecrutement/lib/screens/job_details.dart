import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:erecrutement/screens/apply.dart';
import 'package:erecrutement/models/jobs_model.dart';

class JobDetailsPage extends StatelessWidget {
  final Job job;

  JobDetailsPage(
    this.job,
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Job: ${job.title}'),
        backgroundColor: const Color(0xFF21899C),
      ),
      body: SingleChildScrollView(
        //widget for scroll
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  child: job.image.toLowerCase().endsWith('.svg')
                      ? SvgPicture.network(
                          job.image,
                          height: 200,
                          fit: BoxFit.cover,
                        )
                      : Image.network(
                          job.image,
                          height: 200,
                          fit: BoxFit.cover,
                        ),
                ),
              ),
              SizedBox(height: 16.0),
              Text(
                'Title: ${job.title}',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18.0),
              ),
              SizedBox(height: 8.0),
              Text('Company: ${job.companyName}',
                  style: TextStyle(fontSize: 16.0)),
              SizedBox(height: 8.0),
              Text('Location: ${job.location}',
                  style: TextStyle(fontSize: 16.0)),
              SizedBox(height: 16.0),
              Text('Description:',
                  style:
                      TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold)),
              SizedBox(height: 8.0),
              Text(job.description, style: TextStyle(fontSize: 16.0)),
              SizedBox(height: 16.0),
              Center(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF21899C),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                  ),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => ApplyPage(
                          jobId: job.id,
                          context: context,
                        ),
                      ),
                    );
                  },
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(20, 10, 20, 10),
                    child: Text('Apply Now'),
                  ),
                ),
              ),
              SizedBox(height: 16.0),
            ],
          ),
        ),
      ),
    );
  }
}

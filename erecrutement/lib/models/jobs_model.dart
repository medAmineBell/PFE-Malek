
class Job {
  final String id;
  final String title;
  final String image;
  final String email;
  final String companyName;
  final String website;
  final String category;
  final String salary;
  final String location;
  final String jobNature;
  final String applicationDate;
  final List<String> requiredKnowledge;
  final List<String> experience;
  final String description;
  final bool isActive;

  Job({
    required this.id,
    required this.title,
    required this.image,
    required this.email,
    required this.companyName,
    required this.website,
    required this.category,
    required this.salary,
    required this.location,
    required this.jobNature,
    required this.applicationDate,
    required this.requiredKnowledge,
    required this.experience,
    required this.description,
    required this.isActive,
  });

  factory Job.fromJson(Map<String, dynamic> json) {
    return Job(
      id: json['id'],
      title: json['title'],
      image: json['image'],
      email: json['email'],
      companyName: json['companyName'],
      website: json['website'],
      category: json['category'],
      salary: json['salary'],
      location: json['location'],
      jobNature: json['jobNature'],
      applicationDate: json['applicationDate'],
      requiredKnowledge: List<String>.from(json['requiredKnowledge']),
      experience: List<String>.from(json['experience']),
      description: json['description'],
      isActive: json['isActive'],
    );
  }
}

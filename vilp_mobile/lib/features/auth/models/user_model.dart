class UserModel {
  final String id;
  final String email;
  final String role;
  final bool emailVerified;
  final String? fullName;
  final String? studentNumber;
  final String? departmentName;
  final double? cgpa;

  UserModel({
    required this.id,
    required this.email,
    required this.role,
    required this.emailVerified,
    this.fullName,
    this.studentNumber,
    this.departmentName,
    this.cgpa,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      role: json['role']?.toString() ?? 'STUDENT',
      emailVerified: json['emailVerified'] ?? true,
      fullName: json['fullName'],
      studentNumber: json['studentNumber'],
      departmentName: json['departmentName'] ?? json['department']?['name'],
      cgpa: json['cgpa'] != null ? (json['cgpa'] as num).toDouble() : null,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'email': email,
    'role': role,
    'emailVerified': emailVerified,
    'fullName': fullName,
    'studentNumber': studentNumber,
    'departmentName': departmentName,
    'cgpa': cgpa,
  };
}

class AuthTokenResponse {
  final String accessToken;
  final String refreshToken;
  final String tokenType;
  final int expiresIn;
  final UserModel user;

  AuthTokenResponse({
    required this.accessToken,
    required this.refreshToken,
    required this.tokenType,
    required this.expiresIn,
    required this.user,
  });

  factory AuthTokenResponse.fromJson(Map<String, dynamic> json) {
    return AuthTokenResponse(
      accessToken: json['accessToken'] ?? '',
      refreshToken: json['refreshToken'] ?? '',
      tokenType: json['tokenType'] ?? 'Bearer',
      expiresIn: json['expiresIn'] ?? 1800,
      user: UserModel.fromJson(json['user'] ?? {}),
    );
  }
}

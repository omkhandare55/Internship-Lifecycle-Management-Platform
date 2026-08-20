# VILP Mobile Application (Flutter)

Official cross-platform mobile application for the **Verified Internship Lifecycle Platform (VILP)**, built with **Flutter 3.x**, **Dart 3**, and the **Swiss Editorial Design System**.

---

## 🎨 Swiss Editorial Design Tokens
- **Whisper (60%)**: `#F4EEF7`
- **Off Yellow (30%)**: `#FEF8E7`
- **Purple Heart (8%)**: `#723ECF`
- **French Rose (2%)**: `#ED4B86`
- **Obsidian Telemetry**: `#171024`
- **Shape Language**: Sharp `0px-4px` radius, crisp border precision

---

## 📱 Features Included
1. **Multi-Persona Authentication**:
   - 1-Click Role Matrix Switcher (Student, Recruiter, Mentor, T&P Officer).
   - Direct connection to Spring Boot Argon2 authentication (`/api/auth/login`).
   - Secure Keychain / Encrypted Shared Preferences token storage.
2. **Student Command Portal**:
   - **Overview**: 240-Hour Degree Credit Accumulator gauge & academic vitals.
   - **Discover**: Real-time opportunity search with AI ATS match percentage & filter chips.
   - **AI Radar**: 91/100 ATS ranking meter & skill gap accelerator matrix.
   - **Offers & NOC**: 48-hour decision window, single-active mutex lock & stamped AICTE NOC modal with SHA-256 seal & QR code.
   - **Logbook**: Weekly contact hour submission & 5-star faculty mentor rating reviews.
3. **Faculty Mentorship Portal**:
   - Assigned mentee roster with 5-Dimension Evaluation rubric sliders and 1-click PPO endorsements.
4. **Corporate Recruitment Console**:
   - Candidate applicant roster ranked by AI match percentage & 1-click offer dispatch.
5. **T&P Institutional Command**:
   - 95.2% Placement Rate benchmark, ₹9.85 LPA average CTC, and 4-tier verification queue.

---

## 🚀 How to Run

### Prerequisites
- [Flutter SDK (3.19+)](https://docs.flutter.dev/get-started/install)
- Android Studio / Xcode / VS Code with Flutter Extension
- VILP Spring Boot Backend running on `localhost:8080`

### 1. Install Dependencies
```bash
cd vilp_mobile
flutter pub get
```

### 2. Run on Android / iOS / Web
```bash
# Android Emulator (auto-maps to 10.0.2.2:8080 for backend)
flutter run -d emulator

# iOS Simulator (maps to localhost:8080 for backend)
flutter run -d iphone

# Chrome Web
flutter run -d chrome
```

---

## ⚙️ Project Architecture
```
vilp_mobile/
├── pubspec.yaml
├── lib/
│   ├── main.dart
│   ├── core/
│   │   ├── constants/ (app_colors.dart, api_endpoints.dart)
│   │   ├── theme/     (app_theme.dart)
│   │   ├── storage/   (secure_storage_service.dart)
│   │   ├── network/   (api_client.dart)
│   │   └── routes/    (app_routes.dart)
│   ├── shared/
│   │   └── widgets/   (editorial_card, editorial_button, status_badge, noc_dialog)
│   └── features/
│       ├── auth/      (models, services, providers, login_screen)
│       ├── student/   (dashboard, discovery, detail, ai_advisor, offers_noc, logbook)
│       ├── mentor/    (mentor_dashboard)
│       ├── company/   (company_dashboard)
│       └── tnp/       (tnp_dashboard)
```

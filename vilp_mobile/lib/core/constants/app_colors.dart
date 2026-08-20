import 'package:flutter/material.dart';

/// Swiss Editorial Design System Color Tokens for VILP
/// Strictly follows the 60-30-8-2 distribution rule:
/// - 60% Whisper (#F4EEF7)
/// - 30% Off Yellow (#FEF8E7)
/// - 8% Purple Heart (#723ECF)
/// - 2% French Rose (#ED4B86)
class AppColors {
  // Brand Foundation
  static const Color primaryPurple = Color(0xFF723ECF); // Purple Heart (8%)
  static const Color primaryDark = Color(0xFF5B2DB3);
  static const Color primaryLight = Color(0xFF8F5FE6);

  static const Color accentRose = Color(0xFFED4B86); // French Rose (2%)
  static const Color accentRoseDark = Color(0xFFC72864);
  static const Color accentRoseLight = Color(0xFFFA6A9F);

  // Surfaces & Backgrounds
  static const Color surfaceWhisper = Color(0xFFF4EEF7); // Whisper (60%)
  static const Color surfaceOffYellow = Color(0xFFFEF8E7); // Off Yellow (30%)
  static const Color surfaceWhite = Color(0xFFFFFFFF);
  static const Color surfaceObsidian = Color(0xFF171024); // High-contrast telemetry

  // Neutral Editorial Tones
  static const Color textObsidian = Color(0xFF171024);
  static const Color textMuted = Color(0xFF5D4A75);
  static const Color textSubtle = Color(0xFF8C7B9E);
  static const Color textWhite = Color(0xFFFFFFFF);

  // Structural Borders
  static const Color borderEditorial = Color(0xFFE0D3E8);
  static const Color borderDark = Color(0xFF2D243D);
  static const Color borderOffYellow = Color(0xFFEADBBE);

  // Semantic Status Tones
  static const Color success = Color(0xFF059669);
  static const Color successBg = Color(0xFFECFDF5);
  static const Color warning = Color(0xFFD97706);
  static const Color warningBg = Color(0xFFFFFBEB);
  static const Color error = Color(0xFFDC2626);
  static const Color errorBg = Color(0xFFFEF2F2);
  static const Color info = Color(0xFF2563EB);
  static const Color infoBg = Color(0xFFEFF6FF);
}

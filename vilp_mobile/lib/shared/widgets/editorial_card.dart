import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

class EditorialCard extends StatelessWidget {
  final Widget child;
  final String? tag;
  final Color? tagColor;
  final Color? backgroundColor;
  final EdgeInsetsGeometry? padding;
  final VoidCallback? onTap;
  final BorderSide? border;

  const EditorialCard({
    super.key,
    required this.child,
    this.tag,
    this.tagColor,
    this.backgroundColor,
    this.padding,
    this.onTap,
    this.border,
  });

  @override
  Widget build(BuildContext context) {
    Widget cardContent = Container(
      padding: padding ?? const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: backgroundColor ?? AppColors.surfaceWhite,
        borderRadius: BorderRadius.circular(4),
        border: Border.fromBorderSide(
          border ?? const BorderSide(color: AppColors.borderEditorial, width: 1),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (tag != null) ...[
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: (tagColor ?? AppColors.primaryPurple).withOpacity(0.12),
                borderRadius: BorderRadius.circular(2),
                border: Border.all(
                  color: (tagColor ?? AppColors.primaryPurple).withOpacity(0.3),
                  width: 1,
                ),
              ),
              child: Text(
                tag!.toUpperCase(),
                style: TextStyle(
                  color: tagColor ?? AppColors.primaryPurple,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.8,
                ),
              ),
            ),
            const SizedBox(height: 12),
          ],
          child,
        ],
      ),
    );

    if (onTap != null) {
      return InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(4),
        child: cardContent,
      );
    }

    return cardContent;
  }
}

package com.vilp.common.util;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

/**
 * Input sanitization utility — strips HTML/script tags from user-submitted text
 * to prevent stored XSS attacks.
 *
 * Uses JSoup's Safelist.none() which strips ALL HTML tags, keeping only plain text.
 * This is appropriate for fields like descriptions, comments, feedback, and about sections.
 *
 * Usage:
 *   String safe = InputSanitizer.sanitize(userInput);
 *   String safeTrimmed = InputSanitizer.sanitizeAndTrim(userInput, 500);
 */
public final class InputSanitizer {

    private InputSanitizer() {
        // Utility class — no instantiation
    }

    /**
     * Strip all HTML tags from the input, returning only plain text.
     * Returns null if input is null.
     */
    public static String sanitize(String input) {
        if (input == null) return null;
        // Jsoup.clean strips all tags not in the safelist (none = strip everything)
        return Jsoup.clean(input, Safelist.none()).trim();
    }

    /**
     * Sanitize input and enforce a maximum character length.
     * Truncates at maxLength if the cleaned result is longer.
     */
    public static String sanitizeAndTrim(String input, int maxLength) {
        String cleaned = sanitize(input);
        if (cleaned == null) return null;
        return cleaned.length() > maxLength ? cleaned.substring(0, maxLength) : cleaned;
    }

    /**
     * Sanitize input but allow basic formatting (bold, italic, links, lists).
     * Suitable for rich-text fields like internship descriptions.
     */
    public static String sanitizeRichText(String input) {
        if (input == null) return null;
        // Allow basic safe formatting tags only
        Safelist safelist = Safelist.basicWithImages()
                .removeTags("img")       // No images — those go through document upload
                .addAttributes("a", "href", "title")
                .removeProtocols("a", "href", "javascript");
        return Jsoup.clean(input, safelist).trim();
    }
}

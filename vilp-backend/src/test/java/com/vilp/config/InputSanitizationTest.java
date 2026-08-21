package com.vilp.config;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

class InputSanitizationTest {

    @Test
    @DisplayName("Should strip dangerous script tags from user input")
    void testXssScriptTagSanitization() {
        String dirtyInput = "Hello <script>alert('XSS Attack!')</script> World";
        String clean = Jsoup.clean(dirtyInput, Safelist.none());

        assertEquals("Hello  World", clean);
        assertFalse(clean.contains("<script>"));
    }

    @Test
    @DisplayName("Should strip javascript pseudo-protocol from HTML links")
    void testXssJavascriptProtocolSanitization() {
        String dirtyInput = "<a href=\"javascript:evil()\">Click Me</a>";
        String clean = Jsoup.clean(dirtyInput, Safelist.basic());

        assertFalse(clean.contains("javascript:"));
    }

    @Test
    @DisplayName("Should strip malicious onerror image vectors")
    void testXssImageOnErrorSanitization() {
        String dirtyInput = "<img src=\"invalid.jpg\" onerror=\"alert('pwned')\" />";
        String clean = Jsoup.clean(dirtyInput, Safelist.none());

        assertFalse(clean.contains("onerror"));
        assertFalse(clean.contains("alert"));
    }
}

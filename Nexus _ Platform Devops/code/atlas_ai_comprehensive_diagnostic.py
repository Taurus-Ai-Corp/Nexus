#!/usr/bin/env python3
"""
Atlas AI Website Comprehensive Diagnostic Analysis
Analyzes 9 critical areas: Content Quality, UX, Performance, Security, SEO, Analytics, Accessibility, AI Integration, Feedback
"""

import json
import re
import socket
import ssl
import time
import urllib.parse
import warnings
from datetime import datetime

import requests

warnings.filterwarnings('ignore')

class AtlasAIDiagnostic:
    def __init__(self, base_url="https://e4hilu5riu.space.minimax.io"):
        self.base_url = base_url
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "website_url": base_url,
            "areas": {}
        }
        self.data_files = {
            "homepage": "/workspace/data/atlas_ai_homepage_content.json",
            "features": "/workspace/data/atlas_ai_features_content.json",
            "pricing": "/workspace/data/atlas_ai_pricing_content.json",
            "contact": "/workspace/data/atlas_ai_contact_content.json",
            "insights": "/workspace/data/atlas_ai_insights_content.json"
        }
        self.load_extracted_data()

    def load_extracted_data(self):
        """Load previously extracted website data"""
        self.extracted_data = {}
        for page, file_path in self.data_files.items():
            try:
                with open(file_path) as f:
                    self.extracted_data[page] = json.load(f)
                print(f"✓ Loaded {page} data")
            except Exception as e:
                print(f"⚠ Could not load {page} data: {e}")
                self.extracted_data[page] = {}

    def analyze_content_quality_relevance(self):
        """1. CONTENT QUALITY & RELEVANCE Analysis"""
        print("\n=== 1. CONTENT QUALITY & RELEVANCE ANALYSIS ===")

        analysis = {
            "score": 0,
            "max_score": 100,
            "findings": [],
            "recommendations": [],
            "priority_level": "medium"
        }

        homepage_content = self.extracted_data.get("homepage", {}).get("content", {})
        features_content = self.extracted_data.get("features", {}).get("content", {})

        # Content engagement analysis
        if homepage_content:
            engagement_score = 0

            # Check for compelling headlines and calls-to-action
            if "Start Free Trial" in str(homepage_content):
                engagement_score += 15
                analysis["findings"].append("✓ Strong CTAs present (Start Free Trial)")

            # Check for social proof (testimonials)
            testimonials = homepage_content.get("references", [])
            if testimonials:
                engagement_score += 20
                analysis["findings"].append(f"✓ Strong social proof with {len(testimonials)} testimonials")

            # Check for specific metrics and data
            stats = homepage_content.get("statistics", {})
            if stats:
                engagement_score += 15
                analysis["findings"].append("✓ Data-driven content with specific metrics")

            # Check for clear value proposition
            if "AI-powered" in str(homepage_content) and "automation" in str(homepage_content):
                engagement_score += 20
                analysis["findings"].append("✓ Clear AI automation value proposition")

            # Content informativeness
            feature_count = len(features_content.get("content", {}).get("features", []))
            if feature_count > 5:
                engagement_score += 15
                analysis["findings"].append(f"✓ Comprehensive feature documentation ({feature_count} features)")

            # Target audience relevance
            if "marketing" in str(homepage_content).lower():
                engagement_score += 15
                analysis["findings"].append("✓ Clear target audience focus (marketing teams)")

            analysis["score"] = engagement_score

        # Content gaps analysis
        content_gaps = []
        if not homepage_content.get("pricing", {}).get("details"):
            content_gaps.append("Pricing transparency on homepage")
        if "case studies" not in str(homepage_content).lower():
            content_gaps.append("Case studies or success stories")
        if "security" not in str(homepage_content).lower():
            content_gaps.append("Security and compliance messaging")

        if content_gaps:
            analysis["findings"].extend([f"⚠ Missing: {gap}" for gap in content_gaps])
            analysis["recommendations"].extend([f"Add {gap} to improve trust" for gap in content_gaps])

        # Messaging clarity assessment
        if analysis["score"] < 60:
            analysis["priority_level"] = "high"
            analysis["recommendations"].append("Urgent: Improve content engagement and clarity")
        elif analysis["score"] < 80:
            analysis["priority_level"] = "medium"
            analysis["recommendations"].append("Enhance content with more social proof and specifics")
        else:
            analysis["recommendations"].append("Maintain high content quality standards")

        self.results["areas"]["content_quality"] = analysis
        return analysis

    def analyze_user_experience(self):
        """2. USER EXPERIENCE (UX) Analysis"""
        print("\n=== 2. USER EXPERIENCE (UX) ANALYSIS ===")

        analysis = {
            "score": 0,
            "max_score": 100,
            "findings": [],
            "recommendations": [],
            "priority_level": "medium"
        }

        homepage_content = self.extracted_data.get("homepage", {}).get("content", {})

        # Navigation structure assessment
        navigation = homepage_content.get("navigation", {})
        if navigation:
            nav_score = 0

            # Top navigation
            top_nav = navigation.get("top", [])
            if len(top_nav) >= 5 and len(top_nav) <= 8:
                nav_score += 20
                analysis["findings"].append(f"✓ Good navigation structure ({len(top_nav)} main items)")
            else:
                analysis["findings"].append(f"⚠ Navigation may be too complex/simple ({len(top_nav)} items)")

            # Footer navigation
            footer_nav = navigation.get("footer", {})
            if footer_nav:
                nav_score += 15
                analysis["findings"].append("✓ Comprehensive footer navigation present")

            # Key pages accessibility
            key_pages = ["features", "pricing", "contact"]
            present_pages = [item["text"].lower() for item in top_nav if item.get("text")]
            missing_pages = [page for page in key_pages if page not in present_pages]

            if not missing_pages:
                nav_score += 15
                analysis["findings"].append("✓ All essential pages accessible from main navigation")
            else:
                analysis["findings"].append(f"⚠ Missing key pages in navigation: {missing_pages}")

            analysis["score"] += nav_score

        # Check for accessibility features
        links = homepage_content.get("links", [])
        skip_link = any("skip to main content" in link.get("text", "").lower() for link in links)
        if skip_link:
            analysis["score"] += 10
            analysis["findings"].append("✓ Skip to main content link present")
        else:
            analysis["findings"].append("⚠ Missing skip to main content link")
            analysis["recommendations"].append("Add skip navigation link for accessibility")

        # Mobile responsiveness indicators
        tech_elements = homepage_content.get("technical_elements", {})
        if "mobile" in str(tech_elements).lower() or "Mobile app access" in str(self.extracted_data):
            analysis["score"] += 15
            analysis["findings"].append("✓ Mobile optimization mentioned")

        # User flow efficiency
        cta_buttons = [link for link in links if "Start Free Trial" in link.get("text", "")]
        if len(cta_buttons) >= 2:
            analysis["score"] += 20
            analysis["findings"].append("✓ Multiple conversion opportunities throughout page")

        # Visual hierarchy (based on content structure)
        if homepage_content.get("features") and homepage_content.get("statistics"):
            analysis["score"] += 10
            analysis["findings"].append("✓ Good content hierarchy with stats and features")

        # Determine priority level
        if analysis["score"] < 50:
            analysis["priority_level"] = "high"
            analysis["recommendations"].append("Critical: Redesign navigation and user flow")
        elif analysis["score"] < 75:
            analysis["priority_level"] = "medium"
            analysis["recommendations"].append("Improve navigation clarity and mobile optimization")
        else:
            analysis["recommendations"].append("Fine-tune user experience details")

        self.results["areas"]["user_experience"] = analysis
        return analysis

    def analyze_performance_speed(self):
        """3. PERFORMANCE & SPEED Analysis"""
        print("\n=== 3. PERFORMANCE & SPEED ANALYSIS ===")

        analysis = {
            "score": 0,
            "max_score": 100,
            "findings": [],
            "recommendations": [],
            "priority_level": "medium",
            "metrics": {}
        }

        # Basic performance test
        try:
            start_time = time.time()
            response = requests.get(self.base_url, timeout=10)
            load_time = time.time() - start_time

            analysis["metrics"]["response_time"] = round(load_time, 2)
            analysis["metrics"]["status_code"] = response.status_code
            analysis["metrics"]["content_size"] = len(response.content)

            # Score based on response time
            if load_time < 1.0:
                analysis["score"] += 40
                analysis["findings"].append(f"✓ Excellent response time: {load_time:.2f}s")
            elif load_time < 2.0:
                analysis["score"] += 30
                analysis["findings"].append(f"✓ Good response time: {load_time:.2f}s")
            elif load_time < 3.0:
                analysis["score"] += 20
                analysis["findings"].append(f"⚠ Acceptable response time: {load_time:.2f}s")
            else:
                analysis["score"] += 10
                analysis["findings"].append(f"⚠ Slow response time: {load_time:.2f}s")
                analysis["recommendations"].append("Optimize server response time")

            # Check response headers for optimization indicators
            headers = response.headers

            # Compression
            if headers.get('content-encoding') in ['gzip', 'br', 'deflate']:
                analysis["score"] += 15
                analysis["findings"].append(f"✓ Content compression enabled: {headers.get('content-encoding')}")
            else:
                analysis["findings"].append("⚠ No content compression detected")
                analysis["recommendations"].append("Enable gzip/brotli compression")

            # Caching headers
            cache_headers = ['cache-control', 'expires', 'etag', 'last-modified']
            cache_present = any(header in headers for header in cache_headers)
            if cache_present:
                analysis["score"] += 15
                analysis["findings"].append("✓ Caching headers present")
            else:
                analysis["findings"].append("⚠ Missing caching headers")
                analysis["recommendations"].append("Implement proper caching headers")

            # CDN detection
            cdn_headers = ['cf-ray', 'x-cache', 'x-served-by', 'server']
            cdn_detected = any(
                any(cdn in headers.get(header, '').lower() for cdn in ['cloudflare', 'cloudfront', 'fastly', 'cdn'])
                for header in cdn_headers
            )
            if cdn_detected:
                analysis["score"] += 10
                analysis["findings"].append("✓ CDN usage detected")
            else:
                analysis["findings"].append("⚠ No CDN detected")
                analysis["recommendations"].append("Consider implementing CDN for global performance")

            # Content size analysis
            content_size_mb = len(response.content) / (1024 * 1024)
            if content_size_mb < 1.0:
                analysis["score"] += 10
                analysis["findings"].append(f"✓ Optimized page size: {content_size_mb:.2f}MB")
            elif content_size_mb < 2.0:
                analysis["score"] += 5
                analysis["findings"].append(f"⚠ Moderate page size: {content_size_mb:.2f}MB")
            else:
                analysis["findings"].append(f"⚠ Large page size: {content_size_mb:.2f}MB")
                analysis["recommendations"].append("Optimize images and reduce page size")

        except Exception as e:
            analysis["findings"].append(f"⚠ Performance test failed: {str(e)}")
            analysis["recommendations"].append("Fix connectivity or server issues")

        # Check for performance-related features in content
        homepage_content = self.extracted_data.get("homepage", {}).get("content", {})
        if "99.9%" in str(homepage_content):
            analysis["score"] += 10
            analysis["findings"].append("✓ High uptime SLA advertised (99.9%)")

        # Determine priority level
        if analysis["score"] < 50:
            analysis["priority_level"] = "high"
            analysis["recommendations"].append("Critical: Address performance bottlenecks immediately")
        elif analysis["score"] < 75:
            analysis["priority_level"] = "medium"
            analysis["recommendations"].append("Implement performance optimizations")
        else:
            analysis["recommendations"].append("Monitor and maintain performance standards")

        self.results["areas"]["performance"] = analysis
        return analysis

    def analyze_security(self):
        """4. SECURITY Analysis"""
        print("\n=== 4. SECURITY ANALYSIS ===")

        analysis = {
            "score": 0,
            "max_score": 100,
            "findings": [],
            "recommendations": [],
            "priority_level": "high",
            "security_headers": {},
            "ssl_info": {}
        }

        # SSL Certificate Analysis
        try:
            hostname = urllib.parse.urlparse(self.base_url).netloc
            context = ssl.create_default_context()

            with socket.create_connection((hostname, 443), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()

                    analysis["ssl_info"]["subject"] = dict(x[0] for x in cert['subject'])
                    analysis["ssl_info"]["issuer"] = dict(x[0] for x in cert['issuer'])
                    analysis["ssl_info"]["version"] = ssock.version()
                    analysis["ssl_info"]["expires"] = cert['notAfter']

                    analysis["score"] += 20
                    analysis["findings"].append("✓ Valid SSL certificate present")
                    analysis["findings"].append(f"✓ SSL Version: {ssock.version()}")
                    analysis["findings"].append(f"✓ Certificate expires: {cert['notAfter']}")

        except Exception as e:
            analysis["findings"].append(f"⚠ SSL analysis failed: {str(e)}")
            analysis["recommendations"].append("Fix SSL certificate issues")

        # Security Headers Analysis
        try:
            response = requests.get(self.base_url, timeout=10)
            headers = response.headers

            security_headers_check = {
                'strict-transport-security': 'HSTS (HTTP Strict Transport Security)',
                'content-security-policy': 'CSP (Content Security Policy)',
                'x-frame-options': 'X-Frame-Options (Clickjacking protection)',
                'x-content-type-options': 'X-Content-Type-Options (MIME sniffing protection)',
                'x-xss-protection': 'X-XSS-Protection (XSS filtering)',
                'referrer-policy': 'Referrer Policy',
                'permissions-policy': 'Permissions Policy'
            }

            for header, description in security_headers_check.items():
                if header in headers:
                    analysis["score"] += 10
                    analysis["findings"].append(f"✓ {description} present")
                    analysis["security_headers"][header] = headers[header]
                else:
                    analysis["findings"].append(f"⚠ Missing {description}")
                    analysis["recommendations"].append(f"Implement {description}")

            # Check for secure cookies
            set_cookie_headers = headers.get('set-cookie', '')
            if 'secure' in set_cookie_headers.lower() and 'httponly' in set_cookie_headers.lower():
                analysis["score"] += 10
                analysis["findings"].append("✓ Secure cookie flags present")
            else:
                analysis["findings"].append("⚠ Missing secure cookie flags")
                analysis["recommendations"].append("Implement Secure and HttpOnly cookie flags")

        except Exception as e:
            analysis["findings"].append(f"⚠ Security headers analysis failed: {str(e)}")

        # Check for security-related content
        homepage_content = self.extracted_data.get("homepage", {}).get("content", {})
        features_content = self.extracted_data.get("features", {}).get("content", {})

        # Check for compliance mentions
        if "compliance" in str(features_content).lower() or "soc 2" in str(features_content).lower():
            analysis["score"] += 5
            analysis["findings"].append("✓ Security compliance mentioned (SOC 2)")

        # Data protection page check
        footer_links = homepage_content.get("navigation", {}).get("footer", {}).get("legal", [])
        data_protection_present = any("data protection" in link.get("text", "").lower() for link in footer_links)
        if data_protection_present:
            analysis["score"] += 5
            analysis["findings"].append("✓ Data protection page linked")
        else:
            analysis["recommendations"].append("Add data protection page")

        # Privacy policy check
        privacy_present = any("privacy" in link.get("text", "").lower() for link in footer_links)
        if privacy_present:
            analysis["score"] += 5
            analysis["findings"].append("✓ Privacy policy linked")
        else:
            analysis["recommendations"].append("Add privacy policy")

        # Determine priority level
        if analysis["score"] < 40:
            analysis["priority_level"] = "critical"
            analysis["recommendations"].append("URGENT: Implement basic security headers immediately")
        elif analysis["score"] < 70:
            analysis["priority_level"] = "high"
            analysis["recommendations"].append("High priority: Strengthen security posture")
        else:
            analysis["priority_level"] = "medium"
            analysis["recommendations"].append("Maintain and monitor security standards")

        self.results["areas"]["security"] = analysis
        return analysis

    def analyze_seo_visibility(self):
        """5. SEO & VISIBILITY Analysis"""
        print("\n=== 5. SEO & VISIBILITY ANALYSIS ===")

        analysis = {
            "score": 0,
            "max_score": 100,
            "findings": [],
            "recommendations": [],
            "priority_level": "medium",
            "meta_tags": {},
            "structure": {}
        }

        try:
            response = requests.get(self.base_url, timeout=10)
            html_content = response.text

            # Title tag analysis
            title_match = re.search(r'<title[^>]*>([^<]+)</title>', html_content, re.IGNORECASE)
            if title_match:
                title = title_match.group(1).strip()
                analysis["meta_tags"]["title"] = title

                if 30 <= len(title) <= 60:
                    analysis["score"] += 15
                    analysis["findings"].append(f"✓ Good title length ({len(title)} chars): {title[:50]}...")
                else:
                    analysis["findings"].append(f"⚠ Title length suboptimal ({len(title)} chars)")
                    analysis["recommendations"].append("Optimize title tag length (30-60 characters)")

                # Check for keywords
                if "ai" in title.lower() and "marketing" in title.lower():
                    analysis["score"] += 10
                    analysis["findings"].append("✓ Key terms present in title")
            else:
                analysis["findings"].append("⚠ Missing title tag")
                analysis["recommendations"].append("Add title tag")

            # Meta description
            desc_match = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']', html_content, re.IGNORECASE)
            if desc_match:
                description = desc_match.group(1).strip()
                analysis["meta_tags"]["description"] = description

                if 120 <= len(description) <= 160:
                    analysis["score"] += 15
                    analysis["findings"].append(f"✓ Good meta description length ({len(description)} chars)")
                else:
                    analysis["findings"].append(f"⚠ Meta description length suboptimal ({len(description)} chars)")
                    analysis["recommendations"].append("Optimize meta description (120-160 characters)")
            else:
                analysis["findings"].append("⚠ Missing meta description")
                analysis["recommendations"].append("Add meta description")

            # Viewport meta tag
            if 'name="viewport"' in html_content:
                analysis["score"] += 10
                analysis["findings"].append("✓ Viewport meta tag present (mobile-friendly)")
            else:
                analysis["findings"].append("⚠ Missing viewport meta tag")
                analysis["recommendations"].append("Add viewport meta tag for mobile optimization")

            # Open Graph tags
            og_tags = re.findall(r'<meta[^>]+property=["\']og:([^"\']+)["\'][^>]+content=["\']([^"\']+)["\']', html_content, re.IGNORECASE)
            if og_tags:
                analysis["score"] += 10
                analysis["findings"].append(f"✓ Open Graph tags present ({len(og_tags)} tags)")
                analysis["meta_tags"]["open_graph"] = dict(og_tags)
            else:
                analysis["findings"].append("⚠ Missing Open Graph tags")
                analysis["recommendations"].append("Add Open Graph tags for social sharing")

            # Header structure analysis
            headers = {}
            for i in range(1, 7):
                h_pattern = f'<h{i}[^>]*>([^<]+)</h{i}>'
                h_matches = re.findall(h_pattern, html_content, re.IGNORECASE)
                if h_matches:
                    headers[f'h{i}'] = len(h_matches)

            analysis["structure"]["headers"] = headers

            if headers.get('h1', 0) == 1:
                analysis["score"] += 10
                analysis["findings"].append("✓ Single H1 tag present")
            elif headers.get('h1', 0) > 1:
                analysis["findings"].append("⚠ Multiple H1 tags detected")
                analysis["recommendations"].append("Use only one H1 tag per page")
            else:
                analysis["findings"].append("⚠ No H1 tag found")
                analysis["recommendations"].append("Add H1 tag")

            if sum(headers.values()) > 3:
                analysis["score"] += 5
                analysis["findings"].append("✓ Good header structure with multiple levels")

            # Canonical URL
            if 'rel="canonical"' in html_content:
                analysis["score"] += 5
                analysis["findings"].append("✓ Canonical URL present")
            else:
                analysis["findings"].append("⚠ Missing canonical URL")
                analysis["recommendations"].append("Add canonical URL")

            # Alt text check (basic)
            img_tags = re.findall(r'<img[^>]+>', html_content, re.IGNORECASE)
            img_with_alt = re.findall(r'<img[^>]+alt=["\'][^"\']+["\'][^>]*>', html_content, re.IGNORECASE)

            if img_tags:
                alt_ratio = len(img_with_alt) / len(img_tags)
                if alt_ratio > 0.8:
                    analysis["score"] += 10
                    analysis["findings"].append(f"✓ Good alt text coverage ({alt_ratio:.1%})")
                else:
                    analysis["findings"].append(f"⚠ Poor alt text coverage ({alt_ratio:.1%})")
                    analysis["recommendations"].append("Add alt text to all images")

            # Schema markup
            if 'application/ld+json' in html_content:
                analysis["score"] += 10
                analysis["findings"].append("✓ Structured data (JSON-LD) present")
            else:
                analysis["findings"].append("⚠ No structured data detected")
                analysis["recommendations"].append("Implement schema markup for better search visibility")

        except Exception as e:
            analysis["findings"].append(f"⚠ SEO analysis failed: {str(e)}")

        # Check content for SEO indicators
        homepage_content = self.extracted_data.get("homepage", {}).get("content", {})
        if homepage_content.get("technical_elements", {}).get("integrations_mentioned"):
            analysis["score"] += 5
            analysis["findings"].append("✓ Good keyword diversity with integration mentions")

        # Determine priority level
        if analysis["score"] < 50:
            analysis["priority_level"] = "high"
            analysis["recommendations"].append("Critical: Implement basic SEO fundamentals")
        elif analysis["score"] < 75:
            analysis["priority_level"] = "medium"
            analysis["recommendations"].append("Improve SEO optimization and structure")
        else:
            analysis["recommendations"].append("Fine-tune advanced SEO strategies")

        self.results["areas"]["seo"] = analysis
        return analysis

    def analyze_analytics_tracking(self):
        """6. ANALYTICS & TRACKING Analysis"""
        print("\n=== 6. ANALYTICS & TRACKING ANALYSIS ===")

        analysis = {
            "score": 0,
            "max_score": 100,
            "findings": [],
            "recommendations": [],
            "priority_level": "medium",
            "detected_scripts": []
        }

        try:
            response = requests.get(self.base_url, timeout=10)
            html_content = response.text

            # Google Analytics detection
            ga_patterns = [
                r'googletagmanager\.com/gtag',
                r'google-analytics\.com/analytics\.js',
                r'googletagmanager\.com/gtm\.js',
                r'gtag\(',
                r'ga\('
            ]

            ga_detected = any(re.search(pattern, html_content, re.IGNORECASE) for pattern in ga_patterns)
            if ga_detected:
                analysis["score"] += 25
                analysis["findings"].append("✓ Google Analytics/GTM detected")
                analysis["detected_scripts"].append("Google Analytics")
            else:
                analysis["findings"].append("⚠ No Google Analytics detected")
                analysis["recommendations"].append("Implement Google Analytics for traffic tracking")

            # Facebook Pixel detection
            fb_patterns = [r'facebook\.net/en_US/fbevents\.js', r'fbq\(']
            fb_detected = any(re.search(pattern, html_content, re.IGNORECASE) for pattern in fb_patterns)
            if fb_detected:
                analysis["score"] += 15
                analysis["findings"].append("✓ Facebook Pixel detected")
                analysis["detected_scripts"].append("Facebook Pixel")
            else:
                analysis["findings"].append("⚠ No Facebook Pixel detected")
                analysis["recommendations"].append("Consider Facebook Pixel for conversion tracking")

            # Event tracking indicators
            event_patterns = [r'event', r'track', r'conversion']
            event_indicators = sum(len(re.findall(pattern, html_content, re.IGNORECASE)) for pattern in event_patterns)
            if event_indicators > 5:
                analysis["score"] += 15
                analysis["findings"].append("✓ Event tracking implementation likely")
            else:
                analysis["findings"].append("⚠ Limited event tracking detected")
                analysis["recommendations"].append("Implement comprehensive event tracking")

            # Conversion tracking setup
            conversion_patterns = [r'conversion', r'purchase', r'signup', r'lead']
            conversion_tracking = any(re.search(pattern, html_content, re.IGNORECASE) for pattern in conversion_patterns)
            if conversion_tracking:
                analysis["score"] += 10
                analysis["findings"].append("✓ Conversion tracking indicators present")
            else:
                analysis["recommendations"].append("Set up conversion tracking for key actions")

            # Cookie consent (indicates privacy-compliant tracking)
            cookie_patterns = [r'cookie.*consent', r'gdpr', r'privacy.*policy']
            cookie_consent = any(re.search(pattern, html_content, re.IGNORECASE) for pattern in cookie_patterns)
            if cookie_consent:
                analysis["score"] += 10
                analysis["findings"].append("✓ Cookie consent implementation detected")
            else:
                analysis["findings"].append("⚠ No cookie consent detected")
                analysis["recommendations"].append("Implement GDPR-compliant cookie consent")

        except Exception as e:
            analysis["findings"].append(f"⚠ Analytics detection failed: {str(e)}")

        # Check for analytics features in content
        homepage_content = self.extracted_data.get("homepage", {}).get("content", {})
        insights_content = self.extracted_data.get("insights", {}).get("content", {})
        features_content = self.extracted_data.get("features", {}).get("content", {})

        # Built-in analytics capabilities
        if "analytics" in str(features_content).lower():
            analysis["score"] += 15
            analysis["findings"].append("✓ Built-in analytics features advertised")

        if insights_content:
            analysis["score"] += 10
            analysis["findings"].append("✓ Dedicated insights/analytics page present")

        # Real-time analytics mentions
        if "real-time" in str(homepage_content).lower():
            analysis["score"] += 5
            analysis["findings"].append("✓ Real-time analytics capabilities mentioned")

        # Check for dashboard metrics
        if homepage_content.get("statistics", {}).get("dashboard_metrics"):
            analysis["score"] += 10
            analysis["findings"].append("✓ Live dashboard with metrics displayed")

        # Determine priority level
        if analysis["score"] < 40:
            analysis["priority_level"] = "high"
            analysis["recommendations"].append("Critical: Implement basic analytics tracking immediately")
        elif analysis["score"] < 70:
            analysis["priority_level"] = "medium"
            analysis["recommendations"].append("Enhance analytics setup and tracking coverage")
        else:
            analysis["recommendations"].append("Optimize advanced analytics and attribution")

        self.results["areas"]["analytics"] = analysis
        return analysis

    def analyze_accessibility(self):
        """7. ACCESSIBILITY Analysis"""
        print("\n=== 7. ACCESSIBILITY ANALYSIS ===")

        analysis = {
            "score": 0,
            "max_score": 100,
            "findings": [],
            "recommendations": [],
            "priority_level": "high",
            "wcag_compliance": {}
        }

        try:
            response = requests.get(self.base_url, timeout=10)
            html_content = response.text

            # Skip to content link
            homepage_content = self.extracted_data.get("homepage", {}).get("content", {})
            links = homepage_content.get("links", [])
            skip_link = any("skip to main content" in link.get("text", "").lower() for link in links)
            if skip_link:
                analysis["score"] += 15
                analysis["findings"].append("✓ Skip to main content link present")
            else:
                analysis["findings"].append("⚠ Missing skip to main content link")
                analysis["recommendations"].append("Add skip navigation link")

            # Alt text analysis
            img_tags = re.findall(r'<img[^>]+>', html_content, re.IGNORECASE)
            img_with_alt = re.findall(r'<img[^>]+alt=["\'][^"\']*["\'][^>]*>', html_content, re.IGNORECASE)

            if img_tags:
                alt_ratio = len(img_with_alt) / len(img_tags)
                if alt_ratio >= 0.9:
                    analysis["score"] += 20
                    analysis["findings"].append(f"✓ Excellent alt text coverage ({alt_ratio:.1%})")
                elif alt_ratio >= 0.7:
                    analysis["score"] += 15
                    analysis["findings"].append(f"✓ Good alt text coverage ({alt_ratio:.1%})")
                else:
                    analysis["score"] += 5
                    analysis["findings"].append(f"⚠ Poor alt text coverage ({alt_ratio:.1%})")
                    analysis["recommendations"].append("Improve alt text for all images")

            # Form labels
            form_inputs = re.findall(r'<input[^>]+>', html_content, re.IGNORECASE)
            labeled_inputs = len(re.findall(r'<label[^>]*>.*?</label>', html_content, re.IGNORECASE | re.DOTALL))

            if form_inputs:
                if labeled_inputs >= len(form_inputs) * 0.8:
                    analysis["score"] += 15
                    analysis["findings"].append("✓ Good form labeling")
                else:
                    analysis["findings"].append("⚠ Insufficient form labels")
                    analysis["recommendations"].append("Add proper labels to all form inputs")

            # Semantic HTML
            semantic_tags = ['main', 'header', 'footer', 'nav', 'section', 'article', 'aside']
            semantic_count = sum(len(re.findall(f'<{tag}[^>]*>', html_content, re.IGNORECASE)) for tag in semantic_tags)

            if semantic_count >= 4:
                analysis["score"] += 15
                analysis["findings"].append(f"✓ Good semantic HTML structure ({semantic_count} semantic elements)")
            else:
                analysis["findings"].append(f"⚠ Limited semantic HTML ({semantic_count} elements)")
                analysis["recommendations"].append("Use more semantic HTML5 elements")

            # ARIA landmarks and labels
            aria_labels = len(re.findall(r'aria-label=["\'][^"\']+["\']', html_content, re.IGNORECASE))
            aria_landmarks = len(re.findall(r'role=["\'][^"\']+["\']', html_content, re.IGNORECASE))

            if aria_labels + aria_landmarks > 3:
                analysis["score"] += 10
                analysis["findings"].append("✓ ARIA attributes present")
            else:
                analysis["findings"].append("⚠ Limited ARIA implementation")
                analysis["recommendations"].append("Implement ARIA labels and landmarks")

            # Focus indicators (basic check)
            focus_styles = re.findall(r':focus[^{]*{[^}]*}', html_content, re.IGNORECASE)
            if focus_styles:
                analysis["score"] += 10
                analysis["findings"].append("✓ Focus styles detected")
            else:
                analysis["findings"].append("⚠ No focus styles detected")
                analysis["recommendations"].append("Add visible focus indicators")

            # Color contrast (basic check for common issues)
            style_content = re.findall(r'<style[^>]*>(.*?)</style>', html_content, re.IGNORECASE | re.DOTALL)
            if style_content:
                # Basic check for potential contrast issues
                potential_issues = re.findall(r'color:\s*#[0-9a-f]{3,6}[^;]*background[^;]*#[0-9a-f]{3,6}',
                                            ''.join(style_content), re.IGNORECASE)
                if not potential_issues:
                    analysis["score"] += 5
                    analysis["findings"].append("✓ No obvious color contrast issues detected")
                else:
                    analysis["findings"].append("⚠ Potential color contrast issues")
                    analysis["recommendations"].append("Verify color contrast ratios meet WCAG standards")

            # Keyboard navigation support
            tabindex_count = len(re.findall(r'tabindex=["\'][^"\']+["\']', html_content, re.IGNORECASE))
            if tabindex_count > 0:
                analysis["score"] += 5
                analysis["findings"].append("✓ Tabindex attributes present")
            else:
                analysis["findings"].append("⚠ No explicit tab order defined")
                analysis["recommendations"].append("Define logical tab order for keyboard navigation")

        except Exception as e:
            analysis["findings"].append(f"⚠ Accessibility analysis failed: {str(e)}")

        # Check for accessibility statements
        footer_links = homepage_content.get("navigation", {}).get("footer", {}).get("legal", [])
        accessibility_statement = any("accessibility" in link.get("text", "").lower() for link in footer_links)
        if accessibility_statement:
            analysis["score"] += 5
            analysis["findings"].append("✓ Accessibility statement linked")
        else:
            analysis["recommendations"].append("Add accessibility statement")

        # WCAG compliance assessment
        wcag_score = analysis["score"]
        if wcag_score >= 80:
            analysis["wcag_compliance"]["level"] = "AA (likely)"
            analysis["wcag_compliance"]["confidence"] = "High"
        elif wcag_score >= 60:
            analysis["wcag_compliance"]["level"] = "AA (partial)"
            analysis["wcag_compliance"]["confidence"] = "Medium"
        else:
            analysis["wcag_compliance"]["level"] = "Below AA"
            analysis["wcag_compliance"]["confidence"] = "Low"

        # Determine priority level
        if analysis["score"] < 50:
            analysis["priority_level"] = "critical"
            analysis["recommendations"].append("URGENT: Address accessibility barriers immediately")
        elif analysis["score"] < 75:
            analysis["priority_level"] = "high"
            analysis["recommendations"].append("High priority: Improve accessibility compliance")
        else:
            analysis["priority_level"] = "medium"
            analysis["recommendations"].append("Maintain and enhance accessibility standards")

        self.results["areas"]["accessibility"] = analysis
        return analysis

    def analyze_ai_tools_integration(self):
        """8. AI TOOLS INTEGRATION Analysis"""
        print("\n=== 8. AI TOOLS INTEGRATION ANALYSIS ===")

        analysis = {
            "score": 0,
            "max_score": 100,
            "findings": [],
            "recommendations": [],
            "priority_level": "medium",
            "ai_features": {},
            "integration_opportunities": []
        }

        homepage_content = self.extracted_data.get("homepage", {}).get("content", {})
        features_content = self.extracted_data.get("features", {}).get("content", {})

        # Current AI features assessment
        ai_mentions = 0

        # Check for AI-powered features
        if "ai-powered" in str(homepage_content).lower():
            ai_mentions += 20
            analysis["findings"].append("✓ AI-powered capabilities prominently featured")

        # Check statistics for AI metrics
        stats = homepage_content.get("statistics", {})
        if stats:
            ai_stats = {}
            for key, value in stats.items():
                if "ai" in str(key).lower() or "agents" in str(key).lower():
                    ai_stats[key] = value
                    ai_mentions += 5

            if ai_stats:
                analysis["ai_features"]["statistics"] = ai_stats
                analysis["findings"].append("✓ AI performance metrics displayed")

        # Check for AI automation templates
        tech_elements = homepage_content.get("technical_elements", {})
        if tech_elements.get("templates_status") == "Ready":
            ai_mentions += 15
            analysis["findings"].append("✓ AI automation templates available")

        # Advanced AI features from features page
        if features_content:
            ai_features = features_content.get("content", {}).get("features", [])
            advanced_ai_features = []

            for feature in ai_features:
                if isinstance(feature, dict):
                    feature_name = feature.get("name", "")
                    feature_desc = str(feature.get("description", "")) + str(feature.get("details", ""))

                    if "ai" in feature_name.lower() or "ai" in feature_desc.lower():
                        advanced_ai_features.append(feature_name)
                        ai_mentions += 10

            if advanced_ai_features:
                analysis["ai_features"]["advanced_features"] = advanced_ai_features
                analysis["findings"].append(f"✓ {len(advanced_ai_features)} advanced AI features documented")

        # Check for chatbot/customer support AI
        links = homepage_content.get("links", [])
        support_features = [link for link in links if any(term in link.get("text", "").lower()
                           for term in ["chat", "support", "help", "assistant"])]

        if support_features or "chatbot" in str(features_content).lower():
            ai_mentions += 15
            analysis["findings"].append("✓ AI customer support capabilities present")
        else:
            analysis["integration_opportunities"].append("AI chatbot for customer support")
            analysis["recommendations"].append("Implement AI chatbot for instant customer support")

        # Content generation capabilities
        if "content" in str(features_content).lower() and "generation" in str(features_content).lower():
            ai_mentions += 15
            analysis["findings"].append("✓ AI content generation capabilities")
        else:
            analysis["integration_opportunities"].append("AI content generation tools")
            analysis["recommendations"].append("Add AI content generation features")

        # Predictive analytics
        if "predictive" in str(features_content).lower() or "forecasting" in str(features_content).lower():
            ai_mentions += 15
            analysis["findings"].append("✓ Predictive analytics with AI")
        else:
            analysis["integration_opportunities"].append("Predictive analytics enhancement")
            analysis["recommendations"].append("Enhance predictive capabilities")

        # Real-time AI optimization
        if "real-time" in str(homepage_content).lower() and tech_elements.get("ai_optimization_status") == "OPTIMIZING":
            ai_mentions += 10
            analysis["findings"].append("✓ Real-time AI optimization active")

        # Check for AI model training mentions
        if "model training" in str(features_content).lower() or "custom ai" in str(features_content).lower():
            ai_mentions += 15
            analysis["findings"].append("✓ Custom AI model training available")
        else:
            analysis["integration_opportunities"].append("Custom AI model training")
            analysis["recommendations"].append("Offer custom AI model training for enterprise clients")

        # Integration with AI platforms
        integrations = tech_elements.get("integrations_mentioned", [])
        ai_platforms = ["OpenAI", "ChatGPT", "GPT", "Claude", "Anthropic"]
        ai_integrations = [platform for platform in integrations if any(ai_platform in platform for ai_platform in ai_platforms)]

        if ai_integrations:
            ai_mentions += 10
            analysis["findings"].append(f"✓ AI platform integrations: {', '.join(ai_integrations)}")
        else:
            analysis["integration_opportunities"].append("Major AI platform integrations")
            analysis["recommendations"].append("Integrate with OpenAI, Anthropic, and other AI providers")

        analysis["score"] = min(ai_mentions, 100)

        # Additional integration opportunities
        potential_integrations = [
            "Voice AI for accessibility",
            "Computer vision for image analysis",
            "Natural language processing for sentiment analysis",
            "AI-powered A/B testing",
            "Intelligent recommendation engine",
            "AI fraud detection",
            "Automated compliance checking"
        ]

        analysis["integration_opportunities"].extend(potential_integrations[:3])  # Add top 3

        # Determine priority level
        if analysis["score"] < 40:
            analysis["priority_level"] = "high"
            analysis["recommendations"].append("Critical: Enhance AI capabilities to match positioning")
        elif analysis["score"] < 70:
            analysis["priority_level"] = "medium"
            analysis["recommendations"].append("Expand AI feature set and integrations")
        else:
            analysis["priority_level"] = "low"
            analysis["recommendations"].append("Continue AI innovation and stay competitive")

        self.results["areas"]["ai_integration"] = analysis
        return analysis

    def analyze_feedback_testing(self):
        """9. FEEDBACK & TESTING Analysis"""
        print("\n=== 9. FEEDBACK & TESTING ANALYSIS ===")

        analysis = {
            "score": 0,
            "max_score": 100,
            "findings": [],
            "recommendations": [],
            "priority_level": "medium",
            "feedback_mechanisms": [],
            "testing_opportunities": []
        }

        homepage_content = self.extracted_data.get("homepage", {}).get("content", {})
        contact_content = self.extracted_data.get("contact", {}).get("content", {})

        # Contact form analysis
        if contact_content:
            contact_form = contact_content.get("contact_form", {})
            if contact_form:
                analysis["score"] += 20
                analysis["feedback_mechanisms"].append("Contact form")
                analysis["findings"].append("✓ Comprehensive contact form available")

                # Check form fields quality
                fields = contact_form.get("fields", [])
                if len(fields) >= 5:
                    analysis["score"] += 10
                    analysis["findings"].append(f"✓ Detailed contact form ({len(fields)} fields)")

                # Check for feedback categories
                interested_options = next((field.get("options", []) for field in fields
                                         if field.get("name") == "I'm interested in"), [])
                if len(interested_options) >= 5:
                    analysis["score"] += 10
                    analysis["findings"].append("✓ Multiple feedback categories available")

            # Quick actions for feedback
            quick_actions = contact_content.get("quick_actions", [])
            if quick_actions:
                analysis["score"] += 15
                analysis["feedback_mechanisms"].extend(quick_actions)
                analysis["findings"].append(f"✓ Quick feedback actions: {', '.join(quick_actions)}")

        # Check for feedback widget
        links = homepage_content.get("links", [])
        feedback_links = [link for link in links if "feedback" in link.get("text", "").lower()]
        if feedback_links:
            analysis["score"] += 15
            analysis["feedback_mechanisms"].append("Feedback widget")
            analysis["findings"].append("✓ Direct feedback mechanism available")
        else:
            analysis["recommendations"].append("Add feedback widget for continuous user input")

        # Live chat support
        if "live chat" in str(contact_content).lower() or any("chat" in action.lower() for action in contact_content.get("quick_actions", [])):
            analysis["score"] += 15
            analysis["feedback_mechanisms"].append("Live chat")
            analysis["findings"].append("✓ Live chat support available")
        else:
            analysis["recommendations"].append("Implement live chat for immediate feedback")

        # Demo/trial opportunities (testing mechanisms)
        trial_links = [link for link in links if any(term in link.get("text", "").lower()
                      for term in ["trial", "demo", "test"])]
        if trial_links:
            analysis["score"] += 15
            analysis["testing_opportunities"].append("Free trial")
            analysis["findings"].append("✓ Free trial/demo available for testing")

        # User testing indicators
        if "14-day" in str(self.extracted_data.get("pricing", {})):
            analysis["score"] += 10
            analysis["testing_opportunities"].append("Extended trial period")
            analysis["findings"].append("✓ Generous trial period for thorough testing")

        # A/B testing capabilities
        features_content = self.extracted_data.get("features", {}).get("content", {})
        if "a/b testing" in str(features_content).lower():
            analysis["score"] += 10
            analysis["testing_opportunities"].append("Built-in A/B testing")
            analysis["findings"].append("✓ A/B testing capabilities for users")
        else:
            analysis["recommendations"].append("Add A/B testing tools for user optimization")

        # Analytics for feedback analysis
        if "analytics" in str(features_content).lower():
            analysis["score"] += 5
            analysis["findings"].append("✓ Analytics available for feedback analysis")

        # Social proof as feedback mechanism
        testimonials = homepage_content.get("references", [])
        if testimonials:
            analysis["score"] += 10
            analysis["feedback_mechanisms"].append("Customer testimonials")
            analysis["findings"].append(f"✓ {len(testimonials)} customer testimonials displayed")

        # Missing feedback mechanisms
        missing_mechanisms = []
        if "survey" not in str(contact_content).lower():
            missing_mechanisms.append("User surveys")
        if "rating" not in str(homepage_content).lower():
            missing_mechanisms.append("Rating system")
        if "review" not in str(homepage_content).lower():
            missing_mechanisms.append("Review collection")
        if "nps" not in str(features_content).lower():
            missing_mechanisms.append("Net Promoter Score")

        if missing_mechanisms:
            analysis["recommendations"].extend([f"Implement {mechanism}" for mechanism in missing_mechanisms[:2]])

        # Testing opportunities assessment
        conversion_testing = []
        if not any("conversion" in link.get("text", "").lower() for link in links):
            conversion_testing.append("Conversion rate optimization testing")
        if "usability" not in str(features_content).lower():
            conversion_testing.append("Usability testing program")
        if "user experience" not in str(features_content).lower():
            conversion_testing.append("User experience testing")

        analysis["testing_opportunities"].extend(conversion_testing[:2])
        analysis["recommendations"].extend([f"Implement {test}" for test in conversion_testing[:2]])

        # Determine priority level
        if analysis["score"] < 40:
            analysis["priority_level"] = "high"
            analysis["recommendations"].append("Critical: Establish basic feedback collection systems")
        elif analysis["score"] < 70:
            analysis["priority_level"] = "medium"
            analysis["recommendations"].append("Enhance feedback mechanisms and testing capabilities")
        else:
            analysis["priority_level"] = "low"
            analysis["recommendations"].append("Optimize feedback analysis and advanced testing")

        self.results["areas"]["feedback_testing"] = analysis
        return analysis

    def generate_priority_matrix(self):
        """Generate priority-ranked recommendations with impact scores"""
        print("\n=== GENERATING PRIORITY MATRIX ===")

        all_recommendations = []

        for area_name, area_data in self.results["areas"].items():
            priority = area_data.get("priority_level", "medium")
            score = area_data.get("score", 0)
            max_score = area_data.get("max_score", 100)

            # Calculate impact score (inverse of current score)
            impact_score = max_score - score

            # Priority multipliers
            priority_multipliers = {
                "critical": 4.0,
                "high": 3.0,
                "medium": 2.0,
                "low": 1.0
            }

            multiplier = priority_multipliers.get(priority, 2.0)
            final_impact = impact_score * multiplier

            for recommendation in area_data.get("recommendations", []):
                all_recommendations.append({
                    "area": area_name.replace("_", " ").title(),
                    "recommendation": recommendation,
                    "priority_level": priority,
                    "impact_score": round(final_impact, 1),
                    "current_score": f"{score}/{max_score}",
                    "implementation_complexity": self.estimate_complexity(recommendation)
                })

        # Sort by impact score (descending)
        all_recommendations.sort(key=lambda x: x["impact_score"], reverse=True)

        self.results["priority_matrix"] = all_recommendations[:15]  # Top 15 recommendations
        return all_recommendations[:15]

    def estimate_complexity(self, recommendation):
        """Estimate implementation complexity"""
        high_complexity_keywords = ["redesign", "rebuild", "comprehensive", "advanced", "custom", "enterprise"]
        medium_complexity_keywords = ["implement", "enhance", "optimize", "improve", "integrate"]
        low_complexity_keywords = ["add", "fix", "update", "enable", "configure"]

        rec_lower = recommendation.lower()

        if any(keyword in rec_lower for keyword in high_complexity_keywords):
            return "High"
        elif any(keyword in rec_lower for keyword in medium_complexity_keywords):
            return "Medium"
        elif any(keyword in rec_lower for keyword in low_complexity_keywords):
            return "Low"
        else:
            return "Medium"

    def generate_implementation_timeline(self):
        """Generate implementation timeline and resource requirements"""
        print("\n=== GENERATING IMPLEMENTATION TIMELINE ===")

        timeline = {
            "immediate_actions": [],  # 1-2 weeks
            "short_term": [],         # 1-3 months
            "medium_term": [],        # 3-6 months
            "long_term": []           # 6+ months
        }

        for rec in self.results.get("priority_matrix", []):
            complexity = rec["implementation_complexity"]
            priority = rec["priority_level"]

            # Categorize by urgency and complexity
            if priority in ["critical", "high"] and complexity == "Low":
                timeline["immediate_actions"].append(rec)
            elif priority in ["critical", "high"] and complexity == "Medium":
                timeline["short_term"].append(rec)
            elif priority == "high" and complexity == "High":
                timeline["medium_term"].append(rec)
            elif priority == "medium":
                if complexity == "Low":
                    timeline["short_term"].append(rec)
                else:
                    timeline["medium_term"].append(rec)
            else:
                timeline["long_term"].append(rec)

        # Limit each category
        for category in timeline:
            timeline[category] = timeline[category][:5]

        self.results["implementation_timeline"] = timeline
        return timeline

    def run_comprehensive_analysis(self):
        """Run all 9 analysis areas"""
        print("🚀 Starting Atlas AI Comprehensive Diagnostic Analysis...")
        print(f"Website: {self.base_url}")
        print(f"Timestamp: {self.results['timestamp']}")

        # Run all 9 analyses
        self.analyze_content_quality_relevance()
        self.analyze_user_experience()
        self.analyze_performance_speed()
        self.analyze_security()
        self.analyze_seo_visibility()
        self.analyze_analytics_tracking()
        self.analyze_accessibility()
        self.analyze_ai_tools_integration()
        self.analyze_feedback_testing()

        # Generate summary insights
        self.generate_priority_matrix()
        self.generate_implementation_timeline()

        # Calculate overall score
        total_score = sum(area.get("score", 0) for area in self.results["areas"].values())
        max_total = sum(area.get("max_score", 100) for area in self.results["areas"].values())
        overall_percentage = round((total_score / max_total) * 100, 1)

        self.results["overall_score"] = {
            "percentage": overall_percentage,
            "total_points": f"{total_score}/{max_total}",
            "grade": self.get_grade(overall_percentage),
            "status": self.get_status(overall_percentage)
        }

        print("\n🎯 ANALYSIS COMPLETE!")
        print(f"Overall Score: {overall_percentage}% ({self.get_grade(overall_percentage)})")
        print(f"Status: {self.get_status(overall_percentage)}")

        return self.results

    def get_grade(self, percentage):
        """Convert percentage to letter grade"""
        if percentage >= 90:
            return "A"
        elif percentage >= 80:
            return "B"
        elif percentage >= 70:
            return "C"
        elif percentage >= 60:
            return "D"
        else:
            return "F"

    def get_status(self, percentage):
        """Get status description"""
        if percentage >= 85:
            return "Excellent - Minor optimizations needed"
        elif percentage >= 70:
            return "Good - Some improvements recommended"
        elif percentage >= 55:
            return "Fair - Significant improvements needed"
        else:
            return "Poor - Major overhaul required"

    def save_results(self, filename="/workspace/data/atlas_ai_comprehensive_diagnostic_results.json"):
        """Save analysis results to file"""
        with open(filename, 'w') as f:
            json.dump(self.results, f, indent=2, default=str)
        print(f"✅ Results saved to {filename}")
        return filename

if __name__ == "__main__":
    # Run the comprehensive analysis
    diagnostic = AtlasAIDiagnostic()
    results = diagnostic.run_comprehensive_analysis()
    diagnostic.save_results()

#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TAURUS AI Corporate content configuration
const TAURUS_CONTENT = {
  company_info: {
    name: "TAURUS AI Corp",
    tagline: "Innovation at Our Core: The TAURUS AI Approach", 
    description: "A global leader in artificial intelligence solutions, transforming businesses across UAE, India, and Canada with cutting-edge AI technology and intelligent automation",
    focus_area: "Artificial Intelligence, Global Business Solutions, Multi-Platform Ecosystems",
    vision: "A future where AI seamlessly integrates into global business operations, empowering organizations across continents to achieve unprecedented growth"
  },
  hero: {
    heading: "Innovation at Our Core: The TAURUS AI Approach",
    subheading: "Shaping Tomorrow's Business Landscape with Purpose-Driven Intelligence",
    description: "Leading the AI revolution across UAE, India, and Canada with our comprehensive ecosystem of intelligent business solutions"
  },
  who_we_are: {
    heading: "Who We Are",
    content: "TAURUS AI Corp is a global leader in artificial intelligence solutions, with strategic operations spanning the UAE, India, and Canada. Our team of forward-thinking engineers, data scientists, and AI visionaries are committed to pushing the boundaries of what's possible in business automation and intelligent decision-making.\n\nWe specialize in developing comprehensive AI ecosystems that solve real-world business challenges. From our flagship BizFlow platform targeting $17.8M ARR to our creative NeoVibe studio targeting $20.7M ARR, we deliver measurable results that transform entire industries."
  },
  vision: {
    heading: "Our Vision",
    content: "TAURUS AI Corp envisions a future where artificial intelligence seamlessly integrates into global business operations, empowering organizations across continents to achieve unprecedented growth and efficiency.\n\nWe are dedicated to being at the forefront of the AI revolution, ensuring that our solutions remain ethical, inclusive, and globally impactful. Our multi-platform ecosystem serves diverse markets while maintaining the highest standards of innovation and business excellence."
  },
  statistics: [
    {
      name: "Global Projects Delivered",
      value: "500+",
      description: "Successful AI implementations across UAE, India, and Canada"
    },
    {
      name: "Client Satisfaction Rate",
      value: "98.7%",
      description: "Consistently exceeding expectations in AI solution delivery"
    },
    {
      name: "AI Specialists",
      value: "150+",
      description: "Expert team members across three continental markets"
    },
    {
      name: "Combined ARR Target",
      value: "$38.5M",
      description: "Revenue potential across our platform ecosystem"
    }
  ],
  why_choose_us: [
    {
      title: "Global AI Expertise with Local Market Knowledge",
      description: "Deep technical knowledge combined with understanding of UAE, India, and Canada business environments"
    },
    {
      title: "Proven Multi-Platform Ecosystem",
      description: "BizFlow, NeoVibe, and TaurusAI.io working together to deliver comprehensive business solutions"
    },
    {
      title: "Measurable ROI and Business Impact",
      description: "Our solutions deliver tangible results with clear metrics and rapid return on investment"
    },
    {
      title: "Enterprise-Grade Security & Compliance",
      description: "SOC 2 compliant solutions meeting international standards across all operational territories"
    }
  ],
  platforms: [
    {
      name: "BizFlow",
      description: "Intelligent Business Orchestration Platform with 11 specialized AI agents",
      target_arr: "$17.8M",
      url: "bizflow.taurusai.io",
      key_features: ["11 AI Agents", "Workflow Automation", "Predictive Analytics", "Enterprise Security"]
    },
    {
      name: "NeoVibe",
      description: "Creative Marketing Studio powered by AI-driven content generation",
      target_arr: "$20.7M", 
      url: "neovibe.taurusai.io",
      key_features: ["AI Content Creation", "Brand Intelligence", "Creative Automation", "Multi-Channel Marketing"]
    },
    {
      name: "TaurusAI.io",
      description: "Corporate Authority Hub showcasing our AI leadership and solutions",
      target_arr: "Lead Generation",
      url: "taurusai.io",
      key_features: ["Thought Leadership", "Solution Showcase", "Global Presence", "Client Portal"]
    }
  ]
};

// HTML template generation for TaurusAI.io
function generateTaurusHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${TAURUS_CONTENT.company_info.name} - ${TAURUS_CONTENT.company_info.tagline}</title>
    <meta name="description" content="${TAURUS_CONTENT.company_info.description}">
    <meta name="keywords" content="AI solutions, business automation, UAE AI, India AI, Canada AI, artificial intelligence">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    
    <!-- Custom Styles -->
    <style>
        :root {
            --primary-color: #1a365d;
            --secondary-color: #2d5aa0;
            --accent-color: #4299e1;
            --gold-accent: #d4af37;
            --text-dark: #1a202c;
            --text-light: #4a5568;
            --bg-gradient: linear-gradient(135deg, #1a365d 0%, #2d5aa0 50%, #4299e1 100%);
            --section-padding: 80px 0;
        }
        
        .hero-section {
            background: var(--bg-gradient);
            color: white;
            padding: 120px 0;
            position: relative;
            overflow: hidden;
        }
        
        .hero-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.2);
            z-index: 1;
        }
        
        .hero-content {
            position: relative;
            z-index: 2;
        }
        
        .section-padding {
            padding: var(--section-padding);
        }
        
        .navbar-brand {
            font-weight: 700;
            font-size: 1.8rem;
            color: var(--primary-color) !important;
        }
        
        .navbar-nav .nav-link:hover {
            color: var(--accent-color) !important;
        }
        
        .section-title {
            font-size: 2.75rem;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 20px;
            position: relative;
        }
        
        .section-title::after {
            content: '';
            display: block;
            width: 60px;
            height: 4px;
            background: var(--gold-accent);
            margin: 20px auto;
        }
        
        .section-subtitle {
            font-size: 1.3rem;
            color: var(--text-light);
            margin-bottom: 50px;
            line-height: 1.6;
        }
        
        .stat-card {
            background: white;
            border-radius: 20px;
            padding: 40px 20px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid #e2e8f0;
            height: 100%;
        }
        
        .stat-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }
        
        .stat-number {
            font-size: 3.5rem;
            font-weight: 800;
            color: var(--primary-color);
            display: block;
            margin-bottom: 15px;
        }
        
        .stat-label {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 10px;
        }
        
        .stat-description {
            font-size: 0.95rem;
            color: var(--text-light);
        }
        
        .benefit-card {
            background: white;
            border-radius: 15px;
            padding: 40px 30px;
            border-left: 5px solid var(--accent-color);
            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
            height: 100%;
        }
        
        .benefit-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.12);
            border-left-color: var(--gold-accent);
        }
        
        .benefit-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 15px;
        }
        
        .benefit-description {
            color: var(--text-light);
            line-height: 1.6;
        }
        
        .platform-card {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            height: 100%;
            position: relative;
            overflow: hidden;
        }
        
        .platform-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: var(--bg-gradient);
        }
        
        .platform-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }
        
        .platform-name {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 15px;
        }
        
        .platform-arr {
            display: inline-block;
            background: var(--gold-accent);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 15px;
        }
        
        .platform-description {
            color: var(--text-light);
            margin-bottom: 25px;
            line-height: 1.6;
        }
        
        .platform-features {
            list-style: none;
            padding: 0;
        }
        
        .platform-features li {
            padding: 8px 0;
            color: var(--text-dark);
            position: relative;
        }
        
        .platform-features li::before {
            content: '✓';
            color: var(--accent-color);
            font-weight: bold;
            margin-right: 10px;
        }
        
        .btn-primary-custom {
            background: var(--primary-color);
            border: none;
            border-radius: 50px;
            padding: 15px 35px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .btn-primary-custom:hover {
            background: var(--secondary-color);
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(26, 54, 93, 0.3);
        }
        
        .btn-outline-custom {
            border: 2px solid var(--primary-color);
            color: var(--primary-color);
            border-radius: 50px;
            padding: 15px 35px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s ease;
        }
        
        .btn-outline-custom:hover {
            background: var(--primary-color);
            color: white;
            transform: translateY(-3px);
        }
        
        .cta-section {
            background: var(--bg-gradient);
            color: white;
            padding: 100px 0;
            text-align: center;
            position: relative;
        }
        
        .cta-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.2);
        }
        
        .cta-content {
            position: relative;
            z-index: 2;
        }
        
        .footer {
            background: var(--text-dark);
            color: white;
            padding: 60px 0 30px;
        }
        
        .footer h6 {
            color: var(--gold-accent);
            font-weight: 700;
            margin-bottom: 20px;
        }
        
        .footer a {
            color: #a0aec0;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .footer a:hover {
            color: var(--accent-color);
        }
        
        .global-presence {
            background: #f7fafc;
            padding: var(--section-padding);
        }
        
        .country-flag {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        
        .country-card {
            text-align: center;
            padding: 30px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            transition: transform 0.3s ease;
        }
        
        .country-card:hover {
            transform: translateY(-5px);
        }
        
        .scroll-animation {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease;
        }
        
        .scroll-animation.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        @media (max-width: 768px) {
            .section-title {
                font-size: 2.2rem;
            }
            
            .hero-section {
                padding: 80px 0;
            }
            
            .platform-card, .stat-card, .benefit-card {
                margin-bottom: 30px;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div class="container">
            <a class="navbar-brand" href="#">TAURUS AI</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
                    <li class="nav-item"><a class="nav-link" href="#platforms">Platforms</a></li>
                    <li class="nav-item"><a class="nav-link" href="#global">Global Presence</a></li>
                    <li class="nav-item"><a class="nav-link" href="#why-us">Why Choose Us</a></li>
                    <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
                    <li class="nav-item"><a class="btn btn-primary-custom ms-2" href="#platforms">Explore Platforms</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section" id="hero">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-8 hero-content">
                    <h1 class="display-3 fw-bold mb-4">${TAURUS_CONTENT.hero.heading}</h1>
                    <p class="lead mb-4 fs-4">${TAURUS_CONTENT.hero.subheading}</p>
                    <p class="mb-5">${TAURUS_CONTENT.hero.description}</p>
                    <div class="d-flex flex-wrap gap-3">
                        <a href="#platforms" class="btn btn-light btn-lg px-4">Explore Our Platforms</a>
                        <a href="#contact" class="btn btn-outline-light btn-lg px-4">Schedule Consultation</a>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="text-center">
                        <div class="d-inline-block p-4 bg-white rounded-circle shadow-lg">
                            <i class="bi bi-robot" style="font-size: 4rem; color: var(--primary-color);"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Statistics Section -->
    <section class="section-padding bg-light" id="stats">
        <div class="container">
            <div class="row g-4">
                ${TAURUS_CONTENT.statistics.map(stat => `
                <div class="col-lg-3 col-md-6">
                    <div class="stat-card scroll-animation">
                        <span class="stat-number">${stat.value}</span>
                        <div class="stat-label">${stat.name}</div>
                        <div class="stat-description">${stat.description}</div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="section-padding" id="about">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 scroll-animation">
                    <h2 class="section-title text-start">${TAURUS_CONTENT.who_we_are.heading}</h2>
                    <div class="section-subtitle text-start">
                        ${TAURUS_CONTENT.who_we_are.content.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
                    </div>
                </div>
                <div class="col-lg-6 scroll-animation">
                    <h2 class="section-title text-start">${TAURUS_CONTENT.vision.heading}</h2>
                    <div class="section-subtitle text-start">
                        ${TAURUS_CONTENT.vision.content.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Platforms Section -->
    <section class="section-padding bg-light" id="platforms">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">Our AI Platform Ecosystem</h2>
                <p class="section-subtitle">Comprehensive solutions designed for global business transformation</p>
            </div>
            <div class="row g-4">
                ${TAURUS_CONTENT.platforms.map(platform => `
                <div class="col-lg-4">
                    <div class="platform-card scroll-animation">
                        <h3 class="platform-name">${platform.name}</h3>
                        <div class="platform-arr">${platform.target_arr}</div>
                        <p class="platform-description">${platform.description}</p>
                        <ul class="platform-features">
                            ${platform.key_features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                        <div class="mt-4">
                            <a href="https://${platform.url}" class="btn btn-primary-custom" target="_blank">Visit ${platform.name} <i class="bi bi-arrow-right ms-2"></i></a>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Global Presence Section -->
    <section class="global-presence" id="global">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">Global Operations</h2>
                <p class="section-subtitle">Serving three major markets with localized AI solutions</p>
            </div>
            <div class="row g-4">
                <div class="col-lg-4">
                    <div class="country-card scroll-animation">
                        <div class="country-flag">🇦🇪</div>
                        <h4>United Arab Emirates</h4>
                        <p class="text-muted">Strategic hub for Middle East operations, focusing on enterprise AI solutions and smart city initiatives</p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="country-card scroll-animation">
                        <div class="country-flag">🇮🇳</div>
                        <h4>India</h4>
                        <p class="text-muted">Center of innovation and development, leveraging top-tier talent for cutting-edge AI research and implementation</p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="country-card scroll-animation">
                        <div class="country-flag">🇨🇦</div>
                        <h4>Canada</h4>
                        <p class="text-muted">North American headquarters focusing on advanced AI ethics, compliance, and enterprise partnerships</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="section-padding" id="why-us">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">Why Choose TAURUS AI</h2>
                <p class="section-subtitle">Your Success, Our Intelligence</p>
            </div>
            <div class="row g-4">
                ${TAURUS_CONTENT.why_choose_us.map(benefit => `
                <div class="col-lg-6">
                    <div class="benefit-card scroll-animation">
                        <h4 class="benefit-title">${benefit.title}</h4>
                        <p class="benefit-description">${benefit.description}</p>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section" id="contact">
        <div class="container">
            <div class="cta-content">
                <div class="row justify-content-center">
                    <div class="col-lg-8 text-center">
                        <h2 class="display-4 fw-bold mb-4">Ready to Transform Your Business with AI?</h2>
                        <p class="lead mb-5">Join industry leaders who trust TAURUS AI to drive their digital transformation across global markets</p>
                        <div class="d-flex flex-wrap justify-content-center gap-3">
                            <a href="https://bizflow.taurusai.io" class="btn btn-light btn-lg px-4" target="_blank">
                                Explore BizFlow Platform <i class="bi bi-arrow-right ms-2"></i>
                            </a>
                            <a href="https://neovibe.taurusai.io" class="btn btn-outline-light btn-lg px-4" target="_blank">
                                Visit NeoVibe Studio <i class="bi bi-arrow-right ms-2"></i>
                            </a>
                        </div>
                        <div class="mt-5">
                            <h5 class="mb-3">Get in Touch</h5>
                            <div class="d-flex flex-wrap justify-content-center gap-4">
                                <span><i class="bi bi-envelope me-2"></i>info@taurusai.io</span>
                                <span><i class="bi bi-telephone me-2"></i>+1-555-TAURUS-AI</span>
                                <span><i class="bi bi-globe me-2"></i>Global Presence</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="row g-4">
                <div class="col-lg-4">
                    <h5 class="fw-bold mb-3">TAURUS AI Corp</h5>
                    <p class="mb-3">${TAURUS_CONTENT.company_info.description}</p>
                    <div class="d-flex gap-3">
                        <a href="#" class="text-decoration-none"><i class="bi bi-linkedin fs-5"></i></a>
                        <a href="#" class="text-decoration-none"><i class="bi bi-twitter fs-5"></i></a>
                        <a href="#" class="text-decoration-none"><i class="bi bi-youtube fs-5"></i></a>
                        <a href="#" class="text-decoration-none"><i class="bi bi-github fs-5"></i></a>
                    </div>
                </div>
                <div class="col-lg-2">
                    <h6>Platforms</h6>
                    <ul class="list-unstyled">
                        <li><a href="https://bizflow.taurusai.io">BizFlow</a></li>
                        <li><a href="https://neovibe.taurusai.io">NeoVibe</a></li>
                        <li><a href="#">Enterprise</a></li>
                        <li><a href="#">API Access</a></li>
                    </ul>
                </div>
                <div class="col-lg-2">
                    <h6>Company</h6>
                    <ul class="list-unstyled">
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">News</a></li>
                        <li><a href="#">Investors</a></li>
                    </ul>
                </div>
                <div class="col-lg-2">
                    <h6>Resources</h6>
                    <ul class="list-unstyled">
                        <li><a href="#">Documentation</a></li>
                        <li><a href="#">Case Studies</a></li>
                        <li><a href="#">White Papers</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>
                <div class="col-lg-2">
                    <h6>Support</h6>
                    <ul class="list-unstyled">
                        <li><a href="#">Contact</a></li>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Privacy</a></li>
                        <li><a href="#">Terms</a></li>
                    </ul>
                </div>
            </div>
            <hr class="my-4">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <p class="mb-0">&copy; 2025 TAURUS AI Corp. All rights reserved.</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p class="mb-0">Transforming Business Across UAE 🇦🇪 India 🇮🇳 Canada 🇨🇦</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Custom JS -->
    <script>
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-animation').forEach(el => {
            observer.observe(el);
        });

        // Navbar background on scroll
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('bg-white', 'shadow');
            } else {
                navbar.classList.remove('shadow');
            }
        });

        // Platform cards hover effect enhancement
        document.querySelectorAll('.platform-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-15px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Counter animation for statistics
        function animateCounters() {
            const counters = document.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = counter.innerText;
                const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
                
                if (numericTarget && !counter.classList.contains('animated')) {
                    counter.classList.add('animated');
                    let current = 0;
                    const increment = numericTarget / 50;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= numericTarget) {
                            counter.innerText = target;
                            clearInterval(timer);
                        } else {
                            const suffix = target.replace(/[0-9]/g, '');
                            counter.innerText = Math.floor(current) + suffix;
                        }
                    }, 30);
                }
            });
        }

        // Trigger counter animation when stats section is visible
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        });

        const statsSection = document.querySelector('#stats');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    </script>
</body>
</html>`;
}

// Deploy TaurusAI.io platform
async function deployTaurusAI() {
    const outputDir = path.join(__dirname, 'deployments', 'taurusai');
    await fs.ensureDir(outputDir);
    
    // Generate HTML
    const html = generateTaurusHTML();
    await fs.writeFile(path.join(outputDir, 'index.html'), html);
    
    // Create deployment package.json
    const packageJson = {
        name: "taurusai-corporate-hub",
        version: "1.0.0",
        description: "TaurusAI.io - Corporate Authority Hub and Global AI Leadership Platform",
        main: "index.html",
        scripts: {
            "start": "http-server . -p 3001 -o",
            "build": "echo 'Static build ready'",
            "deploy": "echo 'Ready for production deployment'"
        },
        dependencies: {
            "http-server": "^14.1.1"
        }
    };
    
    await fs.writeJSON(path.join(outputDir, 'package.json'), packageJson, { spaces: 2 });
    
    // Create deployment README
    const readme = `# TaurusAI.io Corporate Platform Deployment

## Overview
This is the production-ready deployment package for TaurusAI.io - TAURUS AI Corp's Corporate Authority Hub showcasing global AI leadership and solutions.

## Features
- Global AI Leadership Showcase
- Multi-Platform Ecosystem Integration
- International Presence (UAE, India, Canada)
- Enterprise Authority and Credibility
- Lead Generation and Client Portal

## Target Metrics
- **Purpose**: Corporate Authority & Lead Generation
- **Conversion Rate**: 94% (Axiona template)
- **Global Market Reach**: UAE, India, Canada

## Platform Ecosystem
- **BizFlow**: $17.8M ARR Target
- **NeoVibe**: $20.7M ARR Target  
- **TaurusAI.io**: Authority Hub & Lead Gen

## Deployment
1. \`npm install\`
2. \`npm start\` (development server)
3. Deploy to TaurusAI.io for production

## Contact
- Email: info@taurusai.io
- Global: +1-555-TAURUS-AI
- Website: taurusai.io

Generated by TAURUS AI Template Replication Engine
© 2025 TAURUS AI Corp. All rights reserved.
`;
    
    await fs.writeFile(path.join(outputDir, 'README.md'), readme);
    
    console.log('✅ TaurusAI.io platform deployed successfully!');
    console.log(`📁 Output directory: ${outputDir}`);
    console.log('🚀 Ready for production deployment to TaurusAI.io');
    
    return outputDir;
}

// Execute deployment
if (import.meta.url === `file://${process.argv[1]}`) {
    deployTaurusAI().catch(console.error);
}

export { deployTaurusAI, TAURUS_CONTENT };
#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// NeoVibe Creative Marketing Studio content configuration
const NEOVIBE_CONTENT = {
  company_info: {
    name: "NeoVibe",
    tagline: "We Don't Just Create for the Present — We Craft Experiences for the Future",
    description: "Revolutionary creative marketing studio powered by AI-driven content generation, transforming brand experiences across digital platforms",
    focus_area: "AI-Powered Creative Design, Future-Forward Marketing, Brand Experience Innovation"
  },
  hero: {
    heading: "NEOVIBE® STUDIO",
    subheading: "From Concept to Creation — AI-powered creativity has the power to captivate global audiences",
    description: "Transform your brand's visual identity with cutting-edge AI creativity and data-driven design intelligence"
  },
  about: {
    heading: "We Don't Just Create for the Present — We Craft Experiences for the Future",
    content: "Specializing in AI-powered creative solutions that leave lasting impressions by transforming your brand ideas into stunning visual narratives. Crafting unique and immersive brand experiences that captivate audiences across digital platforms with intelligent automation and creative excellence."
  },
  services: [
    {
      name: "AI-Powered Design",
      description: "We create user-focused designs enhanced by artificial intelligence that bring your brand's vision to life with unprecedented creativity and precision",
      icon: "🎨",
      link: "/services/ai-design"
    },
    {
      name: "Intelligent Marketing",
      description: "Our AI-driven marketing solutions analyze market trends and customer behavior to drive exponential growth and elevate your brand's digital presence",
      icon: "📊",
      link: "/services/intelligent-marketing"
    },
    {
      name: "Creative Concept Development", 
      description: "We develop innovative ideas powered by machine learning insights that form the foundation of standout creative projects and brand experiences",
      icon: "💡",
      link: "/services/concept-development"
    },
    {
      name: "Future-Forward Branding",
      description: "Our branding expertise combines AI analytics with creative intuition to transform concepts into memorable identities that resonate across generations",
      icon: "🚀",
      link: "/services/future-branding"
    }
  ],
  work_categories: [
    {
      name: "AI-Generated Visuals",
      description: "Cutting-edge AI artwork and visual content",
      cta: "Explore Gallery"
    },
    {
      name: "Interactive Experiences",
      description: "Immersive digital brand experiences",
      cta: "View Projects"
    },
    {
      name: "Future-Tech Branding",
      description: "Next-generation brand identity systems",
      cta: "See Innovation"
    }
  ],
  statistics: [
    {
      name: "AI-Generated Assets",
      value: "50K+",
      description: "Creative assets generated through AI automation"
    },
    {
      name: "Brand Transformations",
      value: "500+",
      description: "Complete brand overhauls using AI-driven insights"
    },
    {
      name: "Creative Specialists",
      value: "75+",
      description: "AI-augmented creative professionals"
    },
    {
      name: "Target ARR",
      value: "$20.7M",
      description: "Revenue potential from creative automation platform"
    }
  ],
  testimonials: [
    {
      quote: "NeoVibe's AI-powered creative process transformed our brand identity in ways we never imagined possible, increasing our market recognition by 340%",
      author: "Elena Vasquez",
      position: "Creative Director at FutureBrand Global"
    },
    {
      quote: "The intelligent marketing solutions from NeoVibe helped us achieve 285% growth in engagement across all digital platforms using AI-driven content",
      author: "James Patterson",
      position: "CMO of TechVision Industries"
    },
    {
      quote: "Working with NeoVibe feels like having a crystal ball for creative trends. Their AI predictions helped us stay ahead of the curve by 18 months",
      author: "Sophia Chen",
      position: "Brand Strategy Lead at InnovateNow"
    }
  ],
  pricing: {
    monthly: [
      {
        name: "Creative Starter",
        price: "$697",
        description: "Perfect for startups and growing brands seeking AI-enhanced creative solutions and intelligent design automation",
        features: [
          "AI-powered design generation (100 assets/month)",
          "Intelligent brand analysis and optimization",
          "Creative trend prediction and insights",
          "Basic marketing automation integration"
        ],
        cta: "Start Creating",
        highlight: false
      },
      {
        name: "Studio Professional",
        price: "$1,497",
        description: "Comprehensive creative solution for established brands requiring advanced AI creativity and full marketing automation",
        features: [
          "Unlimited AI creative asset generation",
          "Advanced brand intelligence and market analysis",
          "Interactive experience design and development",
          "Multi-platform content optimization",
          "Dedicated creative strategist and AI training"
        ],
        cta: "Unlock Full Creative Power",
        highlight: true
      },
      {
        name: "Enterprise Creative",
        price: "$3,997",
        description: "Full-scale creative transformation for large organizations requiring custom AI models and enterprise creative solutions",
        features: [
          "Custom AI model training for brand-specific creativity",
          "Enterprise creative automation and workflow integration",
          "Global campaign management and localization",
          "Advanced analytics and creative performance tracking",
          "24/7 creative support and dedicated account team"
        ],
        cta: "Transform Your Brand",
        highlight: false
      }
    ]
  },
  faqs: [
    {
      question: "How does NeoVibe's AI-powered creativity work?",
      answer: "NeoVibe combines advanced machine learning algorithms with creative intelligence to generate, analyze, and optimize creative content. Our AI learns from millions of successful campaigns and brand interactions to create unique, data-driven creative solutions."
    },
    {
      question: "Can NeoVibe integrate with our existing marketing and design workflows?",
      answer: "Yes, NeoVibe seamlessly integrates with 200+ marketing platforms, design tools, and content management systems. Our API-first approach ensures smooth integration with your existing creative and marketing technology stack."
    },
    {
      question: "What makes NeoVibe different from traditional creative agencies?",
      answer: "NeoVibe leverages artificial intelligence to predict creative trends, automate design processes, and optimize content performance in real-time. This allows us to deliver results 10x faster while maintaining creative excellence and reducing costs by up to 60%."
    },
    {
      question: "How quickly can we see results from NeoVibe's creative solutions?",
      answer: "Most clients see measurable improvements in creative performance within 2-3 weeks. Our AI-driven approach allows for rapid iteration, A/B testing, and optimization, leading to faster results compared to traditional creative processes."
    }
  ]
};

// HTML template generation for NeoVibe.taurusai.io
function generateNeoVibeHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${NEOVIBE_CONTENT.company_info.name} - ${NEOVIBE_CONTENT.company_info.tagline}</title>
    <meta name="description" content="${NEOVIBE_CONTENT.company_info.description}">
    <meta name="keywords" content="AI creativity, future design, creative automation, brand intelligence, marketing innovation">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    
    <!-- Custom Styles -->
    <style>
        :root {
            --primary-color: #ff6b35;
            --secondary-color: #004e98;
            --accent-color: #f7931e;
            --neon-purple: #9d4edd;
            --neon-cyan: #06ffa5;
            --text-dark: #1a1a2e;
            --text-light: #16213e;
            --bg-dark: #0f0f0f;
            --bg-gradient: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #004e98 100%);
            --neon-glow: 0 0 20px rgba(157, 78, 221, 0.6);
            --section-padding: 100px 0;
        }
        
        body {
            background: var(--bg-dark);
            color: white;
            overflow-x: hidden;
        }
        
        .hero-section {
            background: var(--bg-gradient);
            min-height: 100vh;
            position: relative;
            display: flex;
            align-items: center;
            overflow: hidden;
        }
        
        .hero-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 30% 70%, rgba(157, 78, 221, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 70% 30%, rgba(6, 255, 165, 0.2) 0%, transparent 50%);
            z-index: 1;
        }
        
        .hero-content {
            position: relative;
            z-index: 2;
        }
        
        .navbar {
            background: rgba(15, 15, 15, 0.95) !important;
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(157, 78, 221, 0.3);
        }
        
        .navbar-brand {
            font-weight: 800;
            font-size: 2rem;
            background: var(--bg-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .nav-link {
            color: white !important;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .nav-link:hover {
            color: var(--neon-cyan) !important;
            text-shadow: var(--neon-glow);
        }
        
        .section-title {
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 30px;
            position: relative;
            background: linear-gradient(45deg, var(--neon-purple), var(--neon-cyan));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .section-subtitle {
            font-size: 1.4rem;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 60px;
            line-height: 1.6;
        }
        
        .hero-title {
            font-size: 5rem;
            font-weight: 900;
            margin-bottom: 30px;
            text-shadow: 0 0 30px rgba(255, 107, 53, 0.5);
            letter-spacing: -2px;
        }
        
        .hero-subtitle {
            font-size: 1.5rem;
            margin-bottom: 40px;
            color: rgba(255, 255, 255, 0.9);
        }
        
        .btn-neon {
            background: linear-gradient(45deg, var(--neon-purple), var(--neon-cyan));
            border: none;
            border-radius: 50px;
            padding: 15px 40px;
            font-weight: 700;
            color: white;
            text-decoration: none;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .btn-neon:hover {
            transform: translateY(-3px);
            box-shadow: var(--neon-glow), 0 10px 30px rgba(0, 0, 0, 0.3);
            color: white;
        }
        
        .btn-outline-neon {
            border: 2px solid var(--neon-cyan);
            color: var(--neon-cyan);
            background: transparent;
            border-radius: 50px;
            padding: 15px 40px;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .btn-outline-neon:hover {
            background: var(--neon-cyan);
            color: var(--bg-dark);
            box-shadow: 0 0 20px var(--neon-cyan);
            transform: translateY(-3px);
        }
        
        .service-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(157, 78, 221, 0.2);
            border-radius: 20px;
            padding: 40px;
            transition: all 0.4s ease;
            height: 100%;
            position: relative;
            overflow: hidden;
        }
        
        .service-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(157, 78, 221, 0.1) 0%, rgba(6, 255, 165, 0.1) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .service-card:hover {
            transform: translateY(-15px);
            border-color: var(--neon-cyan);
            box-shadow: var(--neon-glow), 0 20px 50px rgba(0, 0, 0, 0.3);
        }
        
        .service-card:hover::before {
            opacity: 1;
        }
        
        .service-icon {
            font-size: 4rem;
            margin-bottom: 25px;
            display: block;
        }
        
        .service-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 20px;
            color: var(--neon-cyan);
        }
        
        .service-description {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
        }
        
        .stats-section {
            background: rgba(15, 15, 15, 0.9);
            padding: var(--section-padding);
            position: relative;
        }
        
        .stat-card {
            text-align: center;
            padding: 40px 20px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            border: 1px solid rgba(157, 78, 221, 0.2);
            transition: all 0.3s ease;
            height: 100%;
        }
        
        .stat-card:hover {
            transform: translateY(-10px);
            border-color: var(--neon-cyan);
            box-shadow: var(--neon-glow);
        }
        
        .stat-number {
            font-size: 3.5rem;
            font-weight: 900;
            background: var(--bg-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            display: block;
            margin-bottom: 15px;
        }
        
        .stat-label {
            font-size: 1.2rem;
            font-weight: 600;
            color: white;
            margin-bottom: 10px;
        }
        
        .stat-description {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.95rem;
        }
        
        .testimonial-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(157, 78, 221, 0.2);
            border-radius: 20px;
            padding: 40px;
            margin-bottom: 30px;
            position: relative;
            overflow: hidden;
        }
        
        .testimonial-card::before {
            content: '"';
            position: absolute;
            top: 20px;
            left: 30px;
            font-size: 6rem;
            color: var(--neon-purple);
            opacity: 0.3;
            font-family: serif;
        }
        
        .testimonial-quote {
            font-size: 1.1rem;
            line-height: 1.7;
            margin-bottom: 25px;
            color: rgba(255, 255, 255, 0.9);
            position: relative;
            z-index: 2;
        }
        
        .testimonial-author {
            font-weight: 700;
            color: var(--neon-cyan);
            margin-bottom: 5px;
        }
        
        .testimonial-position {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.95rem;
        }
        
        .pricing-card {
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(157, 78, 221, 0.2);
            border-radius: 25px;
            padding: 50px 40px;
            text-align: center;
            transition: all 0.4s ease;
            height: 100%;
            position: relative;
            overflow: hidden;
        }
        
        .pricing-card.highlight {
            border-color: var(--neon-cyan);
            transform: scale(1.05);
            background: rgba(6, 255, 165, 0.1);
        }
        
        .pricing-card.highlight::before {
            content: 'Most Popular';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            background: var(--bg-gradient);
            color: white;
            padding: 15px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .pricing-card:hover {
            transform: translateY(-10px);
            border-color: var(--neon-cyan);
            box-shadow: var(--neon-glow), 0 25px 60px rgba(0, 0, 0, 0.3);
        }
        
        .pricing-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: white;
            margin-bottom: 20px;
        }
        
        .pricing-amount {
            font-size: 4rem;
            font-weight: 900;
            background: var(--bg-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 20px;
        }
        
        .pricing-description {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 30px;
            line-height: 1.5;
        }
        
        .pricing-features {
            list-style: none;
            padding: 0;
            margin-bottom: 40px;
        }
        
        .pricing-features li {
            padding: 10px 0;
            color: rgba(255, 255, 255, 0.9);
            position: relative;
        }
        
        .pricing-features li::before {
            content: '✓';
            color: var(--neon-cyan);
            font-weight: bold;
            margin-right: 15px;
            text-shadow: 0 0 10px var(--neon-cyan);
        }
        
        .work-category-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(157, 78, 221, 0.2);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            transition: all 0.3s ease;
            height: 100%;
        }
        
        .work-category-card:hover {
            transform: translateY(-10px);
            border-color: var(--neon-cyan);
            background: rgba(6, 255, 165, 0.1);
        }
        
        .category-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--neon-cyan);
            margin-bottom: 15px;
        }
        
        .category-description {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 25px;
        }
        
        .faq-section {
            background: rgba(15, 15, 15, 0.9);
            padding: var(--section-padding);
        }
        
        .faq-item {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            margin-bottom: 20px;
            overflow: hidden;
            border: 1px solid rgba(157, 78, 221, 0.2);
        }
        
        .faq-question {
            padding: 25px 30px;
            cursor: pointer;
            font-weight: 600;
            color: white;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .faq-question:hover {
            background: rgba(157, 78, 221, 0.1);
            color: var(--neon-cyan);
        }
        
        .faq-question::after {
            content: '+';
            position: absolute;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.5rem;
            transition: transform 0.3s ease;
        }
        
        .faq-question.active::after {
            transform: translateY(-50%) rotate(45deg);
        }
        
        .faq-answer {
            padding: 0 30px 25px;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
            display: none;
        }
        
        .cta-section {
            background: var(--bg-gradient);
            padding: 120px 0;
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
            background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
        }
        
        .footer {
            background: var(--bg-dark);
            padding: 80px 0 40px;
            border-top: 1px solid rgba(157, 78, 221, 0.2);
        }
        
        .footer h6 {
            color: var(--neon-cyan);
            font-weight: 700;
            margin-bottom: 25px;
        }
        
        .footer a {
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .footer a:hover {
            color: var(--neon-cyan);
            text-shadow: 0 0 10px var(--neon-cyan);
        }
        
        .floating-elements {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            z-index: 1;
        }
        
        .floating-element {
            position: absolute;
            border-radius: 50%;
            opacity: 0.1;
            animation: float 20s infinite ease-in-out;
        }
        
        .floating-element:nth-child(1) {
            width: 100px;
            height: 100px;
            background: var(--neon-purple);
            top: 20%;
            left: 10%;
            animation-delay: 0s;
        }
        
        .floating-element:nth-child(2) {
            width: 150px;
            height: 150px;
            background: var(--neon-cyan);
            top: 60%;
            right: 15%;
            animation-delay: 7s;
        }
        
        .floating-element:nth-child(3) {
            width: 80px;
            height: 80px;
            background: var(--accent-color);
            bottom: 30%;
            left: 20%;
            animation-delay: 14s;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(120deg); }
            66% { transform: translateY(20px) rotate(240deg); }
        }
        
        .scroll-animation {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s ease;
        }
        
        .scroll-animation.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        @media (max-width: 768px) {
            .hero-title {
                font-size: 3rem;
            }
            
            .section-title {
                font-size: 2.5rem;
            }
            
            .hero-section {
                padding: 80px 0;
            }
            
            .pricing-card.highlight {
                transform: none;
                margin-bottom: 30px;
            }
        }
    </style>
</head>
<body>
    <!-- Floating Elements -->
    <div class="floating-elements">
        <div class="floating-element"></div>
        <div class="floating-element"></div>
        <div class="floating-element"></div>
    </div>

    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg fixed-top">
        <div class="container">
            <a class="navbar-brand" href="#">${NEOVIBE_CONTENT.company_info.name}</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
                    <li class="nav-item"><a class="nav-link" href="#services">Services</a></li>
                    <li class="nav-item"><a class="nav-link" href="#work">Work</a></li>
                    <li class="nav-item"><a class="nav-link" href="#pricing">Pricing</a></li>
                    <li class="nav-item"><a class="nav-link" href="#testimonials">Success Stories</a></li>
                    <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
                    <li class="nav-item"><a class="btn btn-neon ms-2" href="#pricing">Start Creating</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section" id="hero">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-8 hero-content">
                    <h1 class="hero-title">${NEOVIBE_CONTENT.hero.heading}</h1>
                    <p class="hero-subtitle">${NEOVIBE_CONTENT.hero.subheading}</p>
                    <p class="mb-5">${NEOVIBE_CONTENT.hero.description}</p>
                    <div class="d-flex flex-wrap gap-4">
                        <a href="#services" class="btn btn-neon">Explore AI Creativity</a>
                        <a href="#pricing" class="btn btn-outline-neon">View Pricing</a>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="text-center">
                        <div class="position-relative">
                            <div style="width: 300px; height: 300px; border-radius: 50%; background: var(--bg-gradient); margin: 0 auto; display: flex; align-items: center; justify-content: center; box-shadow: var(--neon-glow);">
                                <i class="bi bi-palette2" style="font-size: 6rem; color: white;"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Statistics Section -->
    <section class="stats-section" id="stats">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">Creative Intelligence by the Numbers</h2>
                <p class="section-subtitle">Transforming brands through AI-powered creativity and data-driven design</p>
            </div>
            <div class="row g-4">
                ${NEOVIBE_CONTENT.statistics.map(stat => `
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
            <div class="row justify-content-center">
                <div class="col-lg-10 text-center scroll-animation">
                    <h2 class="section-title">${NEOVIBE_CONTENT.about.heading}</h2>
                    <p class="section-subtitle">${NEOVIBE_CONTENT.about.content}</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section class="section-padding" id="services">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">AI-Powered Creative Services</h2>
                <p class="section-subtitle">Revolutionizing creativity with artificial intelligence and future-forward design thinking</p>
            </div>
            <div class="row g-4">
                ${NEOVIBE_CONTENT.services.map(service => `
                <div class="col-lg-6">
                    <div class="service-card scroll-animation">
                        <span class="service-icon">${service.icon}</span>
                        <h4 class="service-title">${service.name}</h4>
                        <p class="service-description">${service.description}</p>
                        <a href="${service.link}" class="btn btn-outline-neon mt-3">Learn More</a>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Work Categories Section -->
    <section class="section-padding" id="work">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">Creative Portfolio</h2>
                <p class="section-subtitle">Showcasing the future of AI-enhanced creative work</p>
            </div>
            <div class="row g-4">
                ${NEOVIBE_CONTENT.work_categories.map(category => `
                <div class="col-lg-4">
                    <div class="work-category-card scroll-animation">
                        <h4 class="category-title">${category.name}</h4>
                        <p class="category-description">${category.description}</p>
                        <a href="#" class="btn btn-neon">${category.cta}</a>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section class="section-padding" id="testimonials">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">Creative Success Stories</h2>
                <p class="section-subtitle">Real results from brands transformed by AI-powered creativity</p>
            </div>
            <div class="row">
                ${NEOVIBE_CONTENT.testimonials.map(testimonial => `
                <div class="col-lg-4">
                    <div class="testimonial-card scroll-animation">
                        <p class="testimonial-quote">${testimonial.quote}</p>
                        <div class="testimonial-author">${testimonial.author}</div>
                        <div class="testimonial-position">${testimonial.position}</div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section class="section-padding" id="pricing">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">Choose Your Creative Power Level</h2>
                <p class="section-subtitle">Flexible pricing for AI-powered creative solutions</p>
            </div>
            <div class="row g-4 justify-content-center">
                ${NEOVIBE_CONTENT.pricing.monthly.map(plan => `
                <div class="col-lg-4">
                    <div class="pricing-card ${plan.highlight ? 'highlight' : ''} scroll-animation">
                        ${plan.highlight ? '<div style="margin-top: 50px;"></div>' : ''}
                        <h3 class="pricing-title">${plan.name}</h3>
                        <div class="pricing-amount">${plan.price}<small style="font-size: 1rem; color: rgba(255,255,255,0.7);">/month</small></div>
                        <p class="pricing-description">${plan.description}</p>
                        <ul class="pricing-features">
                            ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                        <a href="#contact" class="btn ${plan.highlight ? 'btn-neon' : 'btn-outline-neon'}">${plan.cta}</a>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section" id="faq">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">Frequently Asked Questions</h2>
                <p class="section-subtitle">Everything you need to know about AI-powered creativity</p>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    ${NEOVIBE_CONTENT.faqs.map((faq, index) => `
                    <div class="faq-item scroll-animation">
                        <div class="faq-question" onclick="toggleFAQ(${index})">${faq.question}</div>
                        <div class="faq-answer" id="faq-${index}">${faq.answer}</div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section" id="contact">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8 text-center">
                    <h2 class="display-4 fw-bold mb-4">Ready to Unleash AI-Powered Creativity?</h2>
                    <p class="lead mb-5">Join the creative revolution and transform your brand with intelligence-driven design solutions</p>
                    <div class="d-flex flex-wrap justify-content-center gap-4">
                        <a href="mailto:create@neovibe.taurusai.io" class="btn btn-light btn-lg px-4">
                            Start Creating Today <i class="bi bi-arrow-right ms-2"></i>
                        </a>
                        <a href="https://taurusai.io" class="btn btn-outline-light btn-lg px-4" target="_blank">
                            Learn About TAURUS AI <i class="bi bi-arrow-right ms-2"></i>
                        </a>
                    </div>
                    <div class="mt-5">
                        <h5 class="mb-3">Connect with NeoVibe</h5>
                        <div class="d-flex flex-wrap justify-content-center gap-4">
                            <span><i class="bi bi-envelope me-2"></i>create@neovibe.taurusai.io</span>
                            <span><i class="bi bi-telephone me-2"></i>+1-555-NEOVIBE</span>
                            <span><i class="bi bi-globe me-2"></i>Part of TAURUS AI Ecosystem</span>
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
                    <h5 class="fw-bold mb-3">${NEOVIBE_CONTENT.company_info.name} Studio</h5>
                    <p class="mb-3">${NEOVIBE_CONTENT.company_info.description}</p>
                    <div class="d-flex gap-3">
                        <a href="#" class="text-decoration-none"><i class="bi bi-instagram fs-5"></i></a>
                        <a href="#" class="text-decoration-none"><i class="bi bi-dribbble fs-5"></i></a>
                        <a href="#" class="text-decoration-none"><i class="bi bi-behance fs-5"></i></a>
                        <a href="#" class="text-decoration-none"><i class="bi bi-linkedin fs-5"></i></a>
                    </div>
                </div>
                <div class="col-lg-2">
                    <h6>Services</h6>
                    <ul class="list-unstyled">
                        <li><a href="#services">AI Design</a></li>
                        <li><a href="#services">Creative Marketing</a></li>
                        <li><a href="#services">Concept Development</a></li>
                        <li><a href="#services">Future Branding</a></li>
                    </ul>
                </div>
                <div class="col-lg-2">
                    <h6>Company</h6>
                    <ul class="list-unstyled">
                        <li><a href="#about">About</a></li>
                        <li><a href="#work">Portfolio</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>
                <div class="col-lg-2">
                    <h6>Resources</h6>
                    <ul class="list-unstyled">
                        <li><a href="#">Creative Guides</a></li>
                        <li><a href="#">AI Tools</a></li>
                        <li><a href="#">Case Studies</a></li>
                        <li><a href="#">Templates</a></li>
                    </ul>
                </div>
                <div class="col-lg-2">
                    <h6>TAURUS AI</h6>
                    <ul class="list-unstyled">
                        <li><a href="https://taurusai.io">Corporate</a></li>
                        <li><a href="https://bizflow.taurusai.io">BizFlow</a></li>
                        <li><a href="#contact">Contact</a></li>
                        <li><a href="#">Support</a></li>
                    </ul>
                </div>
            </div>
            <hr class="my-4">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <p class="mb-0">&copy; 2025 NeoVibe Studio - TAURUS AI Corp. All rights reserved.</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p class="mb-0">Powered by AI Creativity • Target ARR: $20.7M</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Custom JS -->
    <script>
        // FAQ Toggle Function
        function toggleFAQ(index) {
            const answer = document.getElementById(\`faq-\${index}\`);
            const question = answer.previousElementSibling;
            
            // Close all other FAQs
            document.querySelectorAll('.faq-answer').forEach(faq => {
                if (faq !== answer) {
                    faq.style.display = 'none';
                    faq.previousElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current FAQ
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                question.classList.remove('active');
            } else {
                answer.style.display = 'block';
                question.classList.add('active');
            }
        }

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

        // Navbar background on scroll
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(15, 15, 15, 0.95)';
            } else {
                navbar.style.background = 'rgba(15, 15, 15, 0.8)';
            }
        });

        // Enhanced hover effects for service cards
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-20px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Pricing card interactions
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (!this.classList.contains('highlight')) {
                    this.style.transform = 'translateY(-15px) scale(1.02)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                if (!this.classList.contains('highlight')) {
                    this.style.transform = 'translateY(0) scale(1)';
                }
            });
        });
    </script>
</body>
</html>`;
}

// Deploy NeoVibe platform
async function deployNeoVibe() {
    const outputDir = path.join(__dirname, 'deployments', 'neovibe');
    await fs.ensureDir(outputDir);
    
    // Generate HTML
    const html = generateNeoVibeHTML();
    await fs.writeFile(path.join(outputDir, 'index.html'), html);
    
    // Create deployment package.json
    const packageJson = {
        name: "neovibe-creative-studio",
        version: "1.0.0",
        description: "NeoVibe - AI-Powered Creative Marketing Studio",
        main: "index.html",
        scripts: {
            "start": "http-server . -p 3002 -o",
            "build": "echo 'Static build ready'",
            "deploy": "echo 'Ready for production deployment'"
        },
        dependencies: {
            "http-server": "^14.1.1"
        }
    };
    
    await fs.writeJSON(path.join(outputDir, 'package.json'), packageJson, { spaces: 2 });
    
    // Create deployment README
    const readme = `# NeoVibe Creative Studio Deployment

## Overview
This is the production-ready deployment package for NeoVibe - TAURUS AI's revolutionary creative marketing studio powered by AI-driven content generation.

## Features
- AI-Powered Creative Design
- Intelligent Marketing Solutions
- Future-Forward Branding
- Creative Automation Platform
- Interactive Brand Experiences

## Target Metrics
- **ARR Potential**: $20.7M
- **Conversion Rate**: 96% (WARP template)
- **Creative Assets**: 50K+ AI-generated
- **Brand Transformations**: 500+

## Platform Position
Part of the TAURUS AI ecosystem alongside:
- **TaurusAI.io**: Corporate Authority Hub
- **BizFlow.taurusai.io**: Business Orchestration Platform

## Deployment
1. \`npm install\`
2. \`npm start\` (development server)
3. Deploy to NeoVibe.taurusai.io for production

## Contact
- Email: create@neovibe.taurusai.io
- Phone: +1-555-NEOVIBE
- Website: neovibe.taurusai.io

Generated by TAURUS AI Template Replication Engine
© 2025 TAURUS AI Corp. All rights reserved.
`;
    
    await fs.writeFile(path.join(outputDir, 'README.md'), readme);
    
    console.log('✅ NeoVibe Studio platform deployed successfully!');
    console.log(`📁 Output directory: ${outputDir}`);
    console.log('🚀 Ready for production deployment to NeoVibe.taurusai.io');
    
    return outputDir;
}

// Execute deployment
if (import.meta.url === `file://${process.argv[1]}`) {
    deployNeoVibe().catch(console.error);
}

export { deployNeoVibe, NEOVIBE_CONTENT };
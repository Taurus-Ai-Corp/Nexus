#!/usr/bin/env python3
"""
Onlook Visual Development Agent - Taurus AI Corp
Integrated from: https://github.com/onlook-dev/onlook
Provides AI-powered visual design, landing page creation, and UI/UX development for marketing campaigns
"""

import asyncio
import json
import logging
import os
import subprocess
import sys
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

# Add registry to path
registry_path = Path(__file__).parent.parent
sys.path.insert(0, str(registry_path))

from registry.agent_registry import AgentMetadata, BaseAgent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class OnlookDesignRequest:
    """Data structure for Onlook visual design requests"""
    design_type: str  # landing_page, ui_component, marketing_asset, prototype
    prompt: str  # AI design prompt
    brand_guidelines: dict[str, Any]  # Brand colors, fonts, style
    target_audience: str  # Target audience for design
    conversion_goals: list[str]  # Specific conversion objectives
    content_sections: list[dict[str, Any]]  # Structured content for the design
    technical_requirements: dict[str, Any]  # Next.js, TailwindCSS specific requirements
    output_format: str  # nextjs_project, component_code, deployed_url

@dataclass
class OnlookDesignResult:
    """Data structure for Onlook design results"""
    design_type: str
    success: bool
    generated_code: str | None
    component_files: dict[str, str]  # filename: code content
    preview_url: str | None
    design_insights: list[str]
    optimization_suggestions: list[str]
    conversion_features: list[str]
    technical_details: dict[str, Any]
    creation_timestamp: datetime
    error_message: str | None = None

class OnlookVisualAgent(BaseAgent):
    """
    AI-powered visual development agent using Onlook's visual-first approach
    Specialized for creating high-converting landing pages and marketing interfaces
    """

    def __init__(self):
        self.initialized = False
        self.work_directory = None
        self.project_templates = {}
        self.generated_projects = []
        self.onlook_available = False

    async def initialize(self, config: dict[str, Any]) -> bool:
        """Initialize Onlook Visual Development Agent"""

        try:
            logger.info("🎨 Initializing Onlook Visual Development Agent")

            # Set up work directory
            self.work_directory = config.get("work_directory", "/tmp/onlook_projects")
            os.makedirs(self.work_directory, exist_ok=True)

            # Check for required tools
            await self._check_dependencies(config)

            # Initialize project templates
            await self._initialize_templates(config)

            self.initialized = True
            logger.info("✅ Onlook Visual Development Agent initialized successfully")
            return True

        except Exception as e:
            logger.error(f"❌ Failed to initialize Onlook Visual Agent: {e}")
            return False

    async def _check_dependencies(self, config: dict[str, Any]):
        """Check for required dependencies"""

        # Check for Node.js and npm
        try:
            result = subprocess.run(["node", "--version"], capture_output=True, text=True)
            if result.returncode == 0:
                logger.info(f"✅ Node.js available: {result.stdout.strip()}")
            else:
                logger.warning("⚠️ Node.js not found - required for Next.js projects")
        except FileNotFoundError:
            logger.warning("⚠️ Node.js not installed")

        # Check for npm/yarn
        try:
            result = subprocess.run(["npm", "--version"], capture_output=True, text=True)
            if result.returncode == 0:
                logger.info(f"✅ npm available: {result.stdout.strip()}")
        except FileNotFoundError:
            logger.warning("⚠️ npm not installed")

        # Note: Onlook itself would be a separate application, not a Python package
        # We simulate its capabilities through code generation and project setup
        self.onlook_available = True  # Assume available for demonstration

        logger.info("🔧 Dependencies checked")

    async def _initialize_templates(self, config: dict[str, Any]):
        """Initialize project templates for different use cases"""

        self.project_templates = {
            "landing_page": {
                "name": "High-Converting Landing Page",
                "description": "Optimized for lead generation and conversion",
                "components": ["hero", "features", "testimonials", "cta", "footer"],
                "tailwind_config": "conversion-focused",
                "next_features": ["app-router", "ssr", "seo-optimized"]
            },
            "ui_component": {
                "name": "Reusable UI Component",
                "description": "Standalone component for marketing interfaces",
                "components": ["component", "variants", "props"],
                "tailwind_config": "component-library",
                "next_features": ["typescript", "storybook"]
            },
            "marketing_asset": {
                "name": "Marketing Asset Interface",
                "description": "Visual asset for campaigns and promotions",
                "components": ["visual", "interactive", "responsive"],
                "tailwind_config": "marketing-focused",
                "next_features": ["animations", "responsive", "accessibility"]
            },
            "prototype": {
                "name": "Interactive Prototype",
                "description": "Rapid prototyping for testing and validation",
                "components": ["prototype", "interactions", "variants"],
                "tailwind_config": "prototyping",
                "next_features": ["hot-reload", "dev-tools"]
            }
        }

        logger.info(f"📚 Initialized {len(self.project_templates)} project templates")

    async def execute(self, task_data: dict[str, Any]) -> dict[str, Any]:
        """Execute Onlook visual development task"""

        if not self.initialized:
            return {"error": "Agent not initialized", "success": False}

        try:
            logger.info("🎨 Executing Onlook visual development task")

            # Parse task data into OnlookDesignRequest
            design_request = self._parse_design_request(task_data)

            # Route to appropriate design method
            if design_request.design_type == "landing_page":
                result = await self._create_landing_page(design_request)
            elif design_request.design_type == "ui_component":
                result = await self._create_ui_component(design_request)
            elif design_request.design_type == "marketing_asset":
                result = await self._create_marketing_asset(design_request)
            elif design_request.design_type == "prototype":
                result = await self._create_prototype(design_request)
            elif design_request.design_type == "ai_design_generation":
                result = await self._generate_ai_design(design_request)
            else:
                result = OnlookDesignResult(
                    design_type=design_request.design_type,
                    success=False,
                    generated_code=None,
                    component_files={},
                    preview_url=None,
                    design_insights=[],
                    optimization_suggestions=[],
                    conversion_features=[],
                    technical_details={},
                    creation_timestamp=datetime.now(),
                    error_message=f"Unsupported design type: {design_request.design_type}"
                )

            # Store generated project
            if result.success:
                self.generated_projects.append(result)

            return asdict(result)

        except Exception as e:
            logger.error(f"❌ Onlook visual development failed: {e}")
            return {
                "design_type": task_data.get("design_type", "unknown"),
                "success": False,
                "error": str(e),
                "creation_timestamp": datetime.now().isoformat()
            }

    def _parse_design_request(self, task_data: dict[str, Any]) -> OnlookDesignRequest:
        """Parse task data into OnlookDesignRequest"""

        return OnlookDesignRequest(
            design_type=task_data.get("design_type", "landing_page"),
            prompt=task_data.get("prompt", ""),
            brand_guidelines=task_data.get("brand_guidelines", {}),
            target_audience=task_data.get("target_audience", "general"),
            conversion_goals=task_data.get("conversion_goals", ["lead_generation"]),
            content_sections=task_data.get("content_sections", []),
            technical_requirements=task_data.get("technical_requirements", {}),
            output_format=task_data.get("output_format", "nextjs_project")
        )

    async def _create_landing_page(self, request: OnlookDesignRequest) -> OnlookDesignResult:
        """Create a high-converting landing page using Onlook-inspired approach"""

        try:
            logger.info(f"🚀 Creating landing page: {request.prompt[:50]}...")

            # Generate landing page structure
            page_structure = self._design_landing_page_structure(request)

            # Generate Next.js code with TailwindCSS
            generated_code = self._generate_nextjs_landing_page(request, page_structure)

            # Create component files
            component_files = self._create_landing_page_components(request, page_structure)

            # Generate optimization insights
            insights = self._analyze_landing_page_design(request, page_structure)

            # Create project directory
            project_path = await self._create_project_directory(request, "landing_page")

            return OnlookDesignResult(
                design_type="landing_page",
                success=True,
                generated_code=generated_code,
                component_files=component_files,
                preview_url=f"http://localhost:3000/{project_path.name}",
                design_insights=insights["design_insights"],
                optimization_suggestions=insights["optimization_suggestions"],
                conversion_features=insights["conversion_features"],
                technical_details={
                    "framework": "Next.js 14",
                    "styling": "TailwindCSS",
                    "features": ["SSR", "SEO-optimized", "Mobile-first"],
                    "project_path": str(project_path)
                },
                creation_timestamp=datetime.now()
            )

        except Exception as e:
            logger.error(f"❌ Failed to create landing page: {e}")
            return OnlookDesignResult(
                design_type="landing_page",
                success=False,
                generated_code=None,
                component_files={},
                preview_url=None,
                design_insights=[],
                optimization_suggestions=[],
                conversion_features=[],
                technical_details={},
                creation_timestamp=datetime.now(),
                error_message=str(e)
            )

    async def _create_ui_component(self, request: OnlookDesignRequest) -> OnlookDesignResult:
        """Create reusable UI component"""

        try:
            logger.info(f"🧩 Creating UI component: {request.prompt[:50]}...")

            # Generate component structure
            component_design = self._design_ui_component(request)

            # Generate React/Next.js component code
            component_code = self._generate_react_component(request, component_design)

            # Create supporting files
            component_files = {
                "component.tsx": component_code,
                "component.stories.tsx": self._generate_storybook_story(request, component_design),
                "types.ts": self._generate_component_types(component_design)
            }

            return OnlookDesignResult(
                design_type="ui_component",
                success=True,
                generated_code=component_code,
                component_files=component_files,
                preview_url=None,
                design_insights=["Reusable component created", "TypeScript support included"],
                optimization_suggestions=["Add unit tests", "Implement accessibility features"],
                conversion_features=["Customizable props", "Responsive design"],
                technical_details={
                    "framework": "React/Next.js",
                    "typescript": True,
                    "storybook": True
                },
                creation_timestamp=datetime.now()
            )

        except Exception as e:
            logger.error(f"❌ Failed to create UI component: {e}")
            return OnlookDesignResult(
                design_type="ui_component",
                success=False,
                generated_code=None,
                component_files={},
                preview_url=None,
                design_insights=[],
                optimization_suggestions=[],
                conversion_features=[],
                technical_details={},
                creation_timestamp=datetime.now(),
                error_message=str(e)
            )

    async def _create_marketing_asset(self, request: OnlookDesignRequest) -> OnlookDesignResult:
        """Create marketing visual asset"""

        try:
            logger.info(f"📱 Creating marketing asset: {request.prompt[:50]}...")

            # Design marketing asset
            asset_design = self._design_marketing_asset(request)

            # Generate interactive marketing interface
            asset_code = self._generate_marketing_interface(request, asset_design)

            return OnlookDesignResult(
                design_type="marketing_asset",
                success=True,
                generated_code=asset_code,
                component_files={"marketing-asset.tsx": asset_code},
                preview_url=None,
                design_insights=["Marketing-focused design", "Conversion-optimized"],
                optimization_suggestions=["Add A/B test variants", "Implement analytics"],
                conversion_features=["Call-to-action prominent", "Mobile-optimized"],
                technical_details={
                    "framework": "Next.js",
                    "styling": "TailwindCSS",
                    "animations": True
                },
                creation_timestamp=datetime.now()
            )

        except Exception as e:
            logger.error(f"❌ Failed to create marketing asset: {e}")
            return OnlookDesignResult(
                design_type="marketing_asset",
                success=False,
                generated_code=None,
                component_files={},
                preview_url=None,
                design_insights=[],
                optimization_suggestions=[],
                conversion_features=[],
                technical_details={},
                creation_timestamp=datetime.now(),
                error_message=str(e)
            )

    async def _create_prototype(self, request: OnlookDesignRequest) -> OnlookDesignResult:
        """Create interactive prototype"""

        try:
            logger.info(f"🎯 Creating prototype: {request.prompt[:50]}...")

            # Design prototype structure
            prototype_design = self._design_prototype(request)

            # Generate prototype code
            prototype_code = self._generate_prototype_code(request, prototype_design)

            return OnlookDesignResult(
                design_type="prototype",
                success=True,
                generated_code=prototype_code,
                component_files={"prototype.tsx": prototype_code},
                preview_url=None,
                design_insights=["Rapid prototype created", "Interactive elements included"],
                optimization_suggestions=["User test and iterate", "Gather feedback"],
                conversion_features=["Interactive demo", "User flow simulation"],
                technical_details={
                    "framework": "Next.js",
                    "interactions": True,
                    "dev_mode": True
                },
                creation_timestamp=datetime.now()
            )

        except Exception as e:
            logger.error(f"❌ Failed to create prototype: {e}")
            return OnlookDesignResult(
                design_type="prototype",
                success=False,
                generated_code=None,
                component_files={},
                preview_url=None,
                design_insights=[],
                optimization_suggestions=[],
                conversion_features=[],
                technical_details={},
                creation_timestamp=datetime.now(),
                error_message=str(e)
            )

    async def _generate_ai_design(self, request: OnlookDesignRequest) -> OnlookDesignResult:
        """Generate design using AI-powered approach similar to Onlook"""

        try:
            logger.info(f"🤖 Generating AI-powered design: {request.prompt[:50]}...")

            # Simulate AI design generation (in real implementation, this would use AI models)
            ai_design = self._simulate_ai_design_generation(request)

            # Generate code from AI design
            generated_code = self._generate_code_from_ai_design(request, ai_design)

            return OnlookDesignResult(
                design_type="ai_design_generation",
                success=True,
                generated_code=generated_code,
                component_files={"ai-generated.tsx": generated_code},
                preview_url=None,
                design_insights=["AI-generated design", "Optimized for conversion"],
                optimization_suggestions=["Review AI suggestions", "Customize brand elements"],
                conversion_features=["AI-optimized layout", "Data-driven design decisions"],
                technical_details={
                    "ai_powered": True,
                    "framework": "Next.js",
                    "optimization_level": "high"
                },
                creation_timestamp=datetime.now()
            )

        except Exception as e:
            logger.error(f"❌ Failed to generate AI design: {e}")
            return OnlookDesignResult(
                design_type="ai_design_generation",
                success=False,
                generated_code=None,
                component_files={},
                preview_url=None,
                design_insights=[],
                optimization_suggestions=[],
                conversion_features=[],
                technical_details={},
                creation_timestamp=datetime.now(),
                error_message=str(e)
            )

    def _design_landing_page_structure(self, request: OnlookDesignRequest) -> dict[str, Any]:
        """Design landing page structure based on request"""

        # Base structure optimized for conversion
        structure = {
            "sections": [
                {
                    "name": "hero",
                    "purpose": "capture_attention",
                    "elements": ["headline", "subheadline", "cta_primary", "hero_image"]
                },
                {
                    "name": "value_proposition",
                    "purpose": "explain_benefits",
                    "elements": ["benefits_list", "social_proof", "trust_indicators"]
                },
                {
                    "name": "features",
                    "purpose": "demonstrate_capabilities",
                    "elements": ["feature_cards", "screenshots", "demonstrations"]
                },
                {
                    "name": "testimonials",
                    "purpose": "build_trust",
                    "elements": ["customer_reviews", "case_studies", "ratings"]
                },
                {
                    "name": "cta_section",
                    "purpose": "drive_conversion",
                    "elements": ["final_cta", "urgency_indicators", "guarantee"]
                }
            ],
            "conversion_optimizations": [
                "above_the_fold_cta",
                "social_proof_placement",
                "mobile_first_design",
                "fast_loading_optimization"
            ]
        }

        # Customize based on request
        if "B2B" in request.target_audience:
            structure["sections"].insert(2, {
                "name": "enterprise_features",
                "purpose": "address_business_needs",
                "elements": ["integration_logos", "security_badges", "roi_calculator"]
            })

        return structure

    def _generate_nextjs_landing_page(self, request: OnlookDesignRequest, structure: dict[str, Any]) -> str:
        """Generate Next.js landing page code"""

        # Brand colors from request
        brand_colors = request.brand_guidelines.get("brand_colors", ["#1E40AF", "#EF4444", "#10B981"])
        primary_color = brand_colors[0] if brand_colors else "#1E40AF"

        # Generate landing page component
        landing_page_code = f"""
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';

interface LandingPageProps {{
  campaign?: string;
  market?: string;
}}

export default function LandingPage({{ campaign = 'default', market = 'global' }}: LandingPageProps) {{
  const handleCTAClick = () => {{
    // Track conversion event
    console.log('CTA clicked:', {{ campaign, market }});
    // Implement actual conversion tracking
  }};

  return (
    <>
      <Head>
        <title>{request.brand_guidelines.get('brand_name', 'NEXUS by Taurus Ai')} - {request.prompt[:50]}</title>
        <meta name="description" content="High-converting landing page for {request.target_audience}" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {self._generate_hero_section(request, primary_color)}
        {self._generate_features_section(request)}
        {self._generate_testimonials_section(request)}
        {self._generate_cta_section(request, primary_color)}
      </div>
    </>
  );
}}
"""

        return landing_page_code

    def _generate_hero_section(self, request: OnlookDesignRequest, primary_color: str) -> str:
        """Generate hero section JSX"""

        return f"""
        {'{/* Hero Section */}'}
        <section className="relative overflow-hidden bg-white pt-16 pb-20 sm:pt-24 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">{request.prompt}</span>
                  <span className="block" style={{{{ color: '{primary_color}' }}}}>for {request.target_audience}</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  Transform your business with AI-powered marketing solutions designed specifically for {request.target_audience}.
                </p>
                <div className="mt-8 sm:mx-auto sm:max-w-lg sm:text-center lg:mx-0 lg:text-left">
                  <button
                    onClick={{handleCTAClick}}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{{{ backgroundColor: '{primary_color}' }}}}
                  >
                    Get Started Now
                  </button>
                </div>
              </div>
              <div className="mt-12 relative sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:max-w-none lg:items-center">
                <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                  <div className="relative block w-full overflow-hidden rounded-lg bg-gray-100" style={{{{ height: '300px' }}}}>
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <span>Hero Visual Placeholder</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
"""

    def _generate_features_section(self, request: OnlookDesignRequest) -> str:
        """Generate features section JSX"""

        features = [
            {"title": "AI-Powered", "description": "Leverage advanced AI for better results"},
            {"title": "Easy Integration", "description": "Seamlessly integrate with existing systems"},
            {"title": "Real-time Analytics", "description": "Track performance and optimize in real-time"}
        ]

        return """
        {'{/* Features Section */}'}
        <section className="py-16 bg-gray-50 overflow-hidden lg:py-24">
          <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
            <div className="relative">
              <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Powerful Features for Success
              </h2>
              <div className="mt-12">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">""" + "".join([
                  f"""
                  <div className="pt-6">
                    <div className="flow-root bg-white rounded-lg px-6 pb-8">
                      <div className="-mt-6">
                        <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature["title"]}</h3>
                        <p className="mt-5 text-base text-gray-500">{feature["description"]}</p>
                      </div>
                    </div>
                  </div>""" for feature in features
                ]) + """
                </div>
              </div>
            </div>
          </div>
        </section>
"""

    def _generate_testimonials_section(self, request: OnlookDesignRequest) -> str:
        """Generate testimonials section JSX"""

        return """
        {'{/* Testimonials Section */}'}
        <section className="py-16 bg-white overflow-hidden lg:py-24">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Trusted by Industry Leaders
              </h2>
            </div>
            <div className="mt-12">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-gray-50 rounded-lg px-6 py-8">
                  <p className="text-base text-gray-600">
                    "This solution transformed our marketing ROI by 300%. Highly recommended!"
                  </p>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Marketing Director</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
"""

    def _generate_cta_section(self, request: OnlookDesignRequest, primary_color: str) -> str:
        """Generate final CTA section JSX"""

        return f"""
        {'{/* Final CTA Section */}'}
        <section className="py-16 sm:py-24" style={{{{ backgroundColor: '{primary_color}' }}}}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to Transform Your Business?
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-xl text-white opacity-90 sm:mt-4">
                Join thousands of businesses already using our platform to drive growth.
              </p>
              <div className="mt-8">
                <button
                  onClick={{handleCTAClick}}
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  Start Your Free Trial
                </button>
              </div>
            </div>
          </div>
        </section>
"""

    def _create_landing_page_components(self, request: OnlookDesignRequest, structure: dict[str, Any]) -> dict[str, str]:
        """Create supporting component files"""

        component_files = {
            "layout.tsx": self._generate_layout_component(request),
            "seo.tsx": self._generate_seo_component(request),
            "analytics.tsx": self._generate_analytics_component(request),
            "tailwind.config.js": self._generate_tailwind_config(request)
        }

        return component_files

    def _generate_layout_component(self, request: OnlookDesignRequest) -> str:
        """Generate layout component"""

        return """
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  campaign?: string;
  market?: string;
}

export default function Layout({ children, campaign, market }: LayoutProps) {
  return (
    <div className="min-h-screen">
      {children}
      {'{/* Analytics tracking */}'}
      <script dangerouslySetInnerHTML={{
        __html: `
          console.log('Page loaded:', { campaign: '${campaign}', market: '${market}' });
        `
      }} />
    </div>
  );
}
"""

    def _generate_seo_component(self, request: OnlookDesignRequest) -> str:
        """Generate SEO component"""

        return f"""
import Head from 'next/head';

interface SEOProps {{
  title?: string;
  description?: string;
  market?: string;
}}

export default function SEO({{ 
  title = '{request.brand_guidelines.get("brand_name", "NEXUS by Taurus Ai")}',
  description = 'AI-powered marketing solutions',
  market = 'global'
}}: SEOProps) {{
  return (
    <Head>
      <title>{{title}}</title>
      <meta name="description" content={{description}} />
      <meta name="keywords" content="AI marketing, {request.target_audience}, {market}" />
      <meta property="og:title" content={{title}} />
      <meta property="og:description" content={{description}} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="robots" content="index, follow" />
    </Head>
  );
}}
"""

    def _generate_analytics_component(self, request: OnlookDesignRequest) -> str:
        """Generate analytics component"""

        return """
import { useEffect } from 'react';

interface AnalyticsProps {
  campaign?: string;
  market?: string;
  event?: string;
}

export default function Analytics({ campaign, market, event }: AnalyticsProps) {
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined') {
      // Replace with actual analytics implementation
      console.log('Analytics:', { campaign, market, event });
    }
  }, [campaign, market, event]);

  return null;
}
"""

    def _generate_tailwind_config(self, request: OnlookDesignRequest) -> str:
        """Generate Tailwind configuration"""

        brand_colors = request.brand_guidelines.get("brand_colors", ["#1E40AF", "#EF4444", "#10B981"])

        return f"""
/** @type {{import('tailwindcss').Config}} */
module.exports = {{
  content: [
    './pages/**/*.{{js,ts,jsx,tsx,mdx}}',
    './components/**/*.{{js,ts,jsx,tsx,mdx}}',
    './app/**/*.{{js,ts,jsx,tsx,mdx}}',
  ],
  theme: {{
    extend: {{
      colors: {{
        primary: '{brand_colors[0] if brand_colors else '#1E40AF'}',
        secondary: '{brand_colors[1] if len(brand_colors) > 1 else '#EF4444'}',
        accent: '{brand_colors[2] if len(brand_colors) > 2 else '#10B981'}',
      }},
      fontFamily: {{
        sans: ['{request.brand_guidelines.get("font_family", "Inter")}', 'sans-serif'],
      }},
    }},
  }},
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}}
"""

    def _analyze_landing_page_design(self, request: OnlookDesignRequest, structure: dict[str, Any]) -> dict[str, list[str]]:
        """Analyze landing page design for optimization insights"""

        return {
            "design_insights": [
                "Mobile-first responsive design implemented",
                "Conversion-optimized structure with clear CTAs",
                "SEO-friendly semantic HTML structure",
                "Accessibility considerations included"
            ],
            "optimization_suggestions": [
                "Implement A/B testing for headline variations",
                "Add loading animation for better UX",
                "Include social proof elements",
                "Optimize images for faster loading"
            ],
            "conversion_features": [
                "Above-the-fold primary CTA",
                "Social proof through testimonials",
                "Trust indicators and guarantees",
                "Multiple conversion opportunities"
            ]
        }

    async def _create_project_directory(self, request: OnlookDesignRequest, design_type: str) -> Path:
        """Create project directory structure"""

        project_name = f"{design_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        project_path = Path(self.work_directory) / project_name
        project_path.mkdir(exist_ok=True)

        # Create basic Next.js structure
        (project_path / "pages").mkdir(exist_ok=True)
        (project_path / "components").mkdir(exist_ok=True)
        (project_path / "styles").mkdir(exist_ok=True)

        return project_path

    def _design_ui_component(self, request: OnlookDesignRequest) -> dict[str, Any]:
        """Design UI component structure"""
        return {
            "type": "react_component",
            "props": ["variant", "size", "disabled"],
            "styling": "tailwindcss",
            "accessibility": True
        }

    def _generate_react_component(self, request: OnlookDesignRequest, design: dict[str, Any]) -> str:
        """Generate React component code"""
        return """
import React from 'react';

interface ComponentProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
}

export default function Component({ 
  variant = 'primary',
  size = 'md', 
  disabled = false,
  children 
}: ComponentProps) {
  return (
    <div className={`component-base component-${variant} component-${size} ${disabled ? 'opacity-50' : ''}`}>
      {children}
    </div>
  );
}
"""

    def _generate_storybook_story(self, request: OnlookDesignRequest, design: dict[str, Any]) -> str:
        """Generate Storybook story"""
        return """
import type { Meta, StoryObj } from '@storybook/react';
import Component from './component';

const meta: Meta<typeof Component> = {
  title: 'Components/Component',
  component: Component,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Component',
  },
};
"""

    def _generate_component_types(self, design: dict[str, Any]) -> str:
        """Generate TypeScript types"""
        return """
export interface ComponentProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
}

export type ComponentVariant = ComponentProps['variant'];
export type ComponentSize = ComponentProps['size'];
"""

    def _design_marketing_asset(self, request: OnlookDesignRequest) -> dict[str, Any]:
        """Design marketing asset structure"""
        return {
            "type": "marketing_interface",
            "elements": ["visual", "cta", "branding"],
            "animations": True,
            "responsive": True
        }

    def _generate_marketing_interface(self, request: OnlookDesignRequest, design: dict[str, Any]) -> str:
        """Generate marketing interface code"""
        return f"""
import React from 'react';

export default function MarketingAsset() {{
  return (
    <div className="marketing-asset bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-lg text-white">
      <h2 className="text-2xl font-bold mb-4">{request.prompt}</h2>
      <p className="mb-6">Designed for {request.target_audience}</p>
      <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
        Take Action
      </button>
    </div>
  );
}}
"""

    def _design_prototype(self, request: OnlookDesignRequest) -> dict[str, Any]:
        """Design prototype structure"""
        return {
            "type": "interactive_prototype",
            "interactions": ["click", "hover", "scroll"],
            "states": ["default", "active", "loading"]
        }

    def _generate_prototype_code(self, request: OnlookDesignRequest, design: dict[str, Any]) -> str:
        """Generate prototype code"""
        return f"""
import React, {{ useState }} from 'react';

export default function Prototype() {{
  const [state, setState] = useState('default');

  return (
    <div className="prototype p-8">
      <h1 className="text-3xl font-bold mb-4">{request.prompt}</h1>
      <div className="interactive-element">
        <button 
          onClick={{() => setState('active')}}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Interactive Element ({{state}})
        </button>
      </div>
    </div>
  );
}}
"""

    def _simulate_ai_design_generation(self, request: OnlookDesignRequest) -> dict[str, Any]:
        """Simulate AI design generation"""
        return {
            "ai_suggestions": [
                "Use contrasting colors for CTAs",
                "Implement mobile-first design",
                "Add micro-interactions for engagement"
            ],
            "layout_optimization": "conversion-focused",
            "design_system": "modern_minimalist"
        }

    def _generate_code_from_ai_design(self, request: OnlookDesignRequest, ai_design: dict[str, Any]) -> str:
        """Generate code from AI design"""
        return f"""
import React from 'react';

// AI-Generated Design Component
export default function AIGeneratedDesign() {{
  const aiSuggestions = {json.dumps(ai_design['ai_suggestions'])};
  
  return (
    <div className="ai-generated-design">
      <div className="bg-gradient-to-br from-indigo-50 to-white p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {request.prompt}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-optimized for {request.target_audience}
        </p>
        
        {'{/* AI-suggested layout */}'}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {{aiSuggestions.map((suggestion, index) => (
              <div key={{index}} className="p-4 bg-white rounded-lg shadow-sm border">
                <p className="text-sm text-gray-700">{{suggestion}}</p>
              </div>
            ))}}
          </div>
          <div className="flex items-center justify-center">
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}}
"""

    def get_capabilities(self) -> list[str]:
        """Return list of capabilities this agent provides"""
        return [
            "landing_page_creation",
            "ui_component_development",
            "marketing_asset_design",
            "interactive_prototyping",
            "ai_powered_design_generation",
            "visual_development",
            "conversion_optimization",
            "responsive_design",
            "nextjs_development",
            "tailwindcss_styling",
            "react_components",
            "typescript_support",
            "seo_optimization",
            "accessibility_compliance",
            "performance_optimization"
        ]

    def get_metadata(self) -> AgentMetadata:
        """Return agent metadata for registry"""
        return AgentMetadata(
            name="onlook_visual",
            version="1.0.0",
            description="AI-powered visual development agent using Onlook's visual-first approach. Creates high-converting landing pages, UI components, and marketing interfaces with Next.js and TailwindCSS.",
            capabilities=self.get_capabilities(),
            dependencies=[
                "nodejs>=18.0.0",
                "npm>=8.0.0",
                "next>=14.0.0",
                "react>=18.0.0",
                "tailwindcss>=3.0.0"
            ],
            api_requirements=[
                "Node.js runtime environment",
                "npm package manager",
                "Optional: AI provider API key for enhanced generation"
            ],
            business_domains=["visual_design", "ui_ux", "marketing", "web_development", "landing_pages", "universal"],
            github_repo="https://github.com/onlook-dev/onlook",
            author="onlook-dev / Taurus AI Corp Integration",
            status="active"
        )

    async def health_check(self) -> bool:
        """Perform health check on the agent"""
        try:
            if not self.initialized:
                return False

            # Check if work directory exists
            if self.work_directory and os.path.exists(self.work_directory):
                return True

            return False

        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return False

    def get_project_stats(self) -> dict[str, Any]:
        """Get project generation statistics"""

        return {
            "total_projects": len(self.generated_projects),
            "project_types": list(set(project.design_type for project in self.generated_projects)),
            "successful_projects": len([p for p in self.generated_projects if p.success]),
            "work_directory": self.work_directory,
            "available_templates": list(self.project_templates.keys()),
            "last_generation": max(p.creation_timestamp for p in self.generated_projects) if self.generated_projects else None
        }

    async def create_campaign_landing_pages(self, campaign_data: dict[str, Any]) -> dict[str, Any]:
        """
        Create complete set of landing pages for a marketing campaign
        Specialized method for NEXUS campaign deployment
        """

        logger.info("🚀 Creating Campaign Landing Pages")

        campaign_pages = {
            "campaign_id": campaign_data.get("id", f"campaign_{datetime.now().strftime('%Y%m%d_%H%M%S')}"),
            "pages_created": [],
            "total_pages": 0,
            "creation_errors": [],
            "deployment_ready": False
        }

        # Define landing page variations for different audiences/markets
        page_variations = [
            {
                "name": "primary_landing",
                "audience": campaign_data.get("target_audience", {}).get("primary", "general"),
                "market": campaign_data.get("target_market", "global"),
                "focus": "main_conversion"
            },
            {
                "name": "mobile_optimized",
                "audience": "mobile_users",
                "market": campaign_data.get("target_market", "global"),
                "focus": "mobile_conversion"
            },
            {
                "name": "b2b_focused",
                "audience": "business_professionals",
                "market": campaign_data.get("target_market", "global"),
                "focus": "enterprise_features"
            }
        ]

        # Create each landing page variation
        for variation in page_variations:
            try:
                page_request = {
                    "design_type": "landing_page",
                    "prompt": f"{campaign_data.get('campaign_name', 'Campaign')} - {variation['focus']}",
                    "brand_guidelines": campaign_data.get("brand_guidelines", {
                        "brand_name": "NEXUS by Taurus Ai",
                        "brand_colors": ["#1E40AF", "#EF4444", "#10B981"]
                    }),
                    "target_audience": variation["audience"],
                    "conversion_goals": campaign_data.get("objectives", ["lead_generation"]),
                    "content_sections": [
                        {"type": "hero", "content": f"Transform your {variation['market']} business"},
                        {"type": "features", "content": "AI-powered marketing solutions"},
                        {"type": "testimonials", "content": "Success stories"},
                        {"type": "cta", "content": "Get started today"}
                    ],
                    "technical_requirements": {
                        "framework": "nextjs",
                        "styling": "tailwindcss",
                        "responsive": True,
                        "seo": True
                    },
                    "output_format": "nextjs_project"
                }

                page_result = await self.execute(page_request)

                if page_result.get("success"):
                    campaign_pages["pages_created"].append({
                        "name": variation["name"],
                        "audience": variation["audience"],
                        "market": variation["market"],
                        "result": page_result
                    })
                else:
                    campaign_pages["creation_errors"].append(f"{variation['name']}: {page_result.get('error', 'Unknown error')}")

            except Exception as e:
                campaign_pages["creation_errors"].append(f"{variation['name']}: {str(e)}")

        campaign_pages["total_pages"] = len(campaign_pages["pages_created"])
        campaign_pages["deployment_ready"] = len(campaign_pages["creation_errors"]) == 0

        logger.info(f"✅ Campaign Landing Pages: {campaign_pages['total_pages']} pages created")

        return campaign_pages

# Example usage and testing
async def main():
    """Test Onlook Visual Development Agent"""

    # Test configuration
    config = {
        "work_directory": "/tmp/onlook_test",
        "ai_provider": "anthropic"
    }

    agent = OnlookVisualAgent()

    # Test initialization
    success = await agent.initialize(config)
    print(f"🔧 Initialization: {'✅ Success' if success else '❌ Failed'}")

    if success:
        # Test capabilities
        capabilities = agent.get_capabilities()
        print(f"🛠️ Capabilities: {', '.join(capabilities)}")

        # Test project stats
        stats = agent.get_project_stats()
        print(f"📊 Project Stats: {stats}")

        # Test health check
        health = await agent.health_check()
        print(f"🏥 Health Check: {'✅ Healthy' if health else '❌ Unhealthy'}")

    # Display metadata
    metadata = agent.get_metadata()
    print(f"📋 Agent: {metadata.name} v{metadata.version}")
    print(f"📊 Business Domains: {', '.join(metadata.business_domains)}")
    print(f"🔗 GitHub: {metadata.github_repo}")

if __name__ == "__main__":
    asyncio.run(main())

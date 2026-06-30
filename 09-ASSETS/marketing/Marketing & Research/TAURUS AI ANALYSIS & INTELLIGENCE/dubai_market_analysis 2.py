#!/usr/bin/env python3
"""
Dubai Digital Marketing Landscape 2025 - Data Analysis & Visualization
Comprehensive market intelligence analysis with charts and insights
"""

import warnings
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns


def setup_matplotlib_for_plotting():
    """
    Setup matplotlib and seaborn for plotting with proper configuration.
    Call this function before creating any plots to ensure proper rendering.
    """
    warnings.filterwarnings('default')  # Show all warnings

    # Configure matplotlib for non-interactive mode
    plt.switch_backend("Agg")

    # Set chart style
    plt.style.use("seaborn-v0_8")
    sns.set_palette("husl")

    # Configure platform-appropriate fonts for cross-platform compatibility
    plt.rcParams["font.sans-serif"] = ["Noto Sans CJK SC", "WenQuanYi Zen Hei", "PingFang SC", "Arial Unicode MS", "Hiragino Sans GB"]
    plt.rcParams["axes.unicode_minus"] = False

def create_market_size_analysis():
    """Create market size and growth projection visualizations"""
    setup_matplotlib_for_plotting()

    # UAE Advertising Market Growth Data
    years = [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033]
    market_size_usd = [3.38, 3.56, 3.76, 3.96, 4.18, 4.41, 4.65, 4.90, 5.17, 5.74]  # Calculated from CAGR

    # E-commerce specific growth
    ecommerce_years = [2023, 2024, 2025]
    ecommerce_size_usd = [10, 12, 15]  # Billion USD

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))

    # Overall UAE Advertising Market
    ax1.plot(years, market_size_usd, marker='o', linewidth=3, markersize=8, color='#2E8B57')
    ax1.fill_between(years, market_size_usd, alpha=0.3, color='#2E8B57')
    ax1.set_title('UAE Advertising Market Size Projection\n2024-2033', fontsize=14, fontweight='bold')
    ax1.set_xlabel('Year', fontsize=12)
    ax1.set_ylabel('Market Size (USD Billion)', fontsize=12)
    ax1.grid(True, alpha=0.3)
    ax1.set_ylim(3, 6)

    # Add CAGR annotation
    ax1.annotate('CAGR: 5.42%', xy=(2030, 4.65), xytext=(2028, 5.2),
                arrowprops=dict(arrowstyle='->', color='red', alpha=0.7),
                fontsize=11, fontweight='bold', color='red')

    # E-commerce Growth
    ax2.bar(ecommerce_years, ecommerce_size_usd, color=['#FF6B6B', '#4ECDC4', '#45B7D1'], alpha=0.8)
    ax2.set_title('UAE E-commerce Market Growth\n2023-2025', fontsize=14, fontweight='bold')
    ax2.set_xlabel('Year', fontsize=12)
    ax2.set_ylabel('Market Size (USD Billion)', fontsize=12)
    ax2.set_ylim(0, 18)

    # Add value labels on bars
    for i, v in enumerate(ecommerce_size_usd):
        ax2.text(ecommerce_years[i], v + 0.3, f'${v}B', ha='center', fontweight='bold')

    plt.tight_layout()
    plt.savefig('/workspace/charts/dubai_market_size_projections.png', dpi=300, bbox_inches='tight')
    plt.close()

    print("✅ Market size analysis chart created successfully")

def create_pricing_analysis():
    """Create pricing structure analysis for Dubai digital marketing services"""
    setup_matplotlib_for_plotting()

    # Dubai Agency Service Pricing (AED per month)
    services = ['Social Media\nManagement', 'SEO', 'PPC\nCampaigns', 'Content\nMarketing', 'Full-Service\nPackages']
    min_prices = [3300, 5500, 1300, 18400, 15000]
    max_prices = [73500, 18400, 18400, 36700, 73500]

    # Social Media Platform CPC costs (AED)
    platforms = ['Facebook/Instagram', 'LinkedIn', 'TikTok']
    cpc_min = [1, 8, 0.5]
    cpc_max = [3, 25, 2]

    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10))

    # Service Pricing Range
    width = 0.6
    x_pos = np.arange(len(services))

    bars1 = ax1.bar(x_pos, max_prices, width, label='Maximum Price', color='#FF6B6B', alpha=0.8)
    bars2 = ax1.bar(x_pos, min_prices, width, label='Minimum Price', color='#4ECDC4', alpha=0.9)

    ax1.set_title('Dubai Digital Marketing Services Pricing Range 2025\n(AED per month)', fontsize=14, fontweight='bold')
    ax1.set_xlabel('Service Type', fontsize=12)
    ax1.set_ylabel('Price (AED/month)', fontsize=12)
    ax1.set_xticks(x_pos)
    ax1.set_xticklabels(services)
    ax1.legend()
    ax1.grid(True, alpha=0.3, axis='y')

    # Add value labels
    for i, (min_val, max_val) in enumerate(zip(min_prices, max_prices, strict=False)):
        ax1.text(i, max_val + 2000, f'{max_val:,}', ha='center', fontweight='bold', fontsize=10)
        ax1.text(i, min_val/2, f'{min_val:,}', ha='center', fontweight='bold', fontsize=10, color='white')

    # Social Media CPC Analysis
    x_pos2 = np.arange(len(platforms))

    # Create range bars using error bars
    avg_cpc = [(min_val + max_val) / 2 for min_val, max_val in zip(cpc_min, cpc_max, strict=False)]
    errors = [[(avg - min_val, max_val - avg)] for avg, min_val, max_val in zip(avg_cpc, cpc_min, cpc_max, strict=False)]
    errors = [[err[0][0] for err in errors], [err[0][1] for err in errors]]

    bars3 = ax2.bar(x_pos2, avg_cpc, width, yerr=errors, capsize=10,
                   color=['#45B7D1', '#96CEB4', '#FFEAA7'], alpha=0.8)

    ax2.set_title('UAE Social Media Advertising Cost per Click (CPC) 2025\n(AED per click)', fontsize=14, fontweight='bold')
    ax2.set_xlabel('Platform', fontsize=12)
    ax2.set_ylabel('CPC Range (AED)', fontsize=12)
    ax2.set_xticks(x_pos2)
    ax2.set_xticklabels(platforms)
    ax2.grid(True, alpha=0.3, axis='y')
    ax2.set_ylim(0, 30)

    # Add range labels
    for i, (min_val, max_val, avg_val) in enumerate(zip(cpc_min, cpc_max, avg_cpc, strict=False)):
        ax2.text(i, max_val + 1, f'{min_val}-{max_val}', ha='center', fontweight='bold', fontsize=11)

    plt.tight_layout()
    plt.savefig('/workspace/charts/dubai_pricing_analysis.png', dpi=300, bbox_inches='tight')
    plt.close()

    print("✅ Pricing analysis chart created successfully")

def create_roi_automation_analysis():
    """Create ROI and automation impact analysis"""
    setup_matplotlib_for_plotting()

    # Marketing Automation ROI Case Studies
    companies = ['Namshi\n(E-commerce)', 'Property Finder\n(Real Estate)', 'Jumeirah Group\n(Hospitality)', 'Emirates NBD\n(Financial)']
    roi_metrics = [30, 40, 25, 35]  # % improvement
    metric_types = ['Sales Growth', 'Qualified Leads', 'Loyalty Sign-ups', 'Cross-selling']

    # AI Automation Investment Impact
    investment_levels = ['No AI', 'Basic AI\n(AED 2K/mo)', 'Advanced AI\n(AED 5K/mo)']
    roi_multipliers = [1.0, 1.25, 1.4]  # Based on 40%+ ROI boost data
    monthly_costs = [0, 2000, 5000]

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))

    # UAE Marketing Automation Success Cases
    colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
    bars1 = ax1.bar(companies, roi_metrics, color=colors, alpha=0.8)

    ax1.set_title('Marketing Automation ROI in UAE\nMajor Case Studies 2025', fontsize=14, fontweight='bold')
    ax1.set_ylabel('Performance Improvement (%)', fontsize=12)
    ax1.set_ylim(0, 50)
    ax1.grid(True, alpha=0.3, axis='y')

    # Add value labels and metric types
    for i, (bar, value, metric) in enumerate(zip(bars1, roi_metrics, metric_types, strict=False)):
        height = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2., height + 1,
                f'{value}%\n({metric})', ha='center', fontweight='bold', fontsize=10)

    # AI Investment ROI Analysis
    ax2.scatter(monthly_costs, roi_multipliers, s=[200, 400, 600],
               c=['#FF6B6B', '#4ECDC4', '#45B7D1'], alpha=0.7)

    # Add trend line
    z = np.polyfit(monthly_costs, roi_multipliers, 1)
    p = np.poly1d(z)
    ax2.plot(monthly_costs, p(monthly_costs), "--", color='red', alpha=0.7, linewidth=2)

    ax2.set_title('AI Marketing Investment vs ROI Impact\nDubai Market 2025', fontsize=14, fontweight='bold')
    ax2.set_xlabel('Monthly AI Investment (AED)', fontsize=12)
    ax2.set_ylabel('ROI Multiplier', fontsize=12)
    ax2.grid(True, alpha=0.3)
    ax2.set_ylim(0.9, 1.5)

    # Add labels for each point
    for i, (cost, roi, level) in enumerate(zip(monthly_costs, roi_multipliers, investment_levels, strict=False)):
        ax2.annotate(f'{level}\n{roi:.1f}x ROI',
                    xy=(cost, roi), xytext=(10, 10),
                    textcoords='offset points', fontsize=10,
                    bbox=dict(boxstyle='round,pad=0.3', fc='white', alpha=0.8))

    plt.tight_layout()
    plt.savefig('/workspace/charts/dubai_roi_automation_analysis.png', dpi=300, bbox_inches='tight')
    plt.close()

    print("✅ ROI and automation analysis chart created successfully")

def create_demographic_analysis():
    """Create UAE demographic and cultural marketing analysis"""
    setup_matplotlib_for_plotting()

    # UAE Population Demographics 2025
    nationalities = ['Indian', 'Pakistani', 'Bangladeshi', 'Filipino', 'Iranian', 'Egyptian', 'Emirati', 'Others']
    population_millions = [4.36, 1.90, 0.84, 0.78, 0.54, 0.48, 1.31, 1.14]
    percentages = [38.45, 16.72, 7.38, 6.89, 4.72, 4.23, 11.50, 10.11]

    # Religious composition for marketing considerations
    religions = ['Islam', 'Christianity', 'Hinduism', 'Buddhism', 'Others']
    religious_percentages = [74.5, 12.9, 6.2, 3.2, 3.2]

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 8))

    # Population by Nationality (Top segments)
    colors1 = plt.cm.Set3(np.linspace(0, 1, len(nationalities)))
    wedges, texts, autotexts = ax1.pie(percentages, labels=nationalities, autopct='%1.1f%%',
                                      colors=colors1, startangle=90)

    ax1.set_title('UAE Population by Nationality 2025\n(Total: 11.35 Million)', fontsize=14, fontweight='bold')

    # Religious Composition for Marketing
    colors2 = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
    wedges2, texts2, autotexts2 = ax2.pie(religious_percentages, labels=religions, autopct='%1.1f%%',
                                         colors=colors2, startangle=90)

    ax2.set_title('UAE Religious Composition 2025\nCultural Marketing Considerations', fontsize=14, fontweight='bold')

    plt.tight_layout()
    plt.savefig('/workspace/charts/dubai_demographic_analysis.png', dpi=300, bbox_inches='tight')
    plt.close()

    print("✅ Demographic analysis chart created successfully")

def create_keyword_seo_analysis():
    """Create SEO keyword and trends analysis"""
    setup_matplotlib_for_plotting()

    # Top performing keywords from research (search volume)
    keywords = ['marketing automation UAE', 'digital marketing agency Dubai', 'AI marketing services', 'social media management', 'content marketing Dubai']
    search_volumes = [1500, 1300, 1500, 1000, 1300]
    cpcs = [2.91, 2.17, 4.32, 1.46, 2.84]
    difficulties = [29, 30, 89, 50, 70]

    # Arabic vs English search trends
    languages = ['English Searches', 'Arabic Searches', 'Bilingual Searches']
    search_distribution = [55, 28, 17]  # Estimated distribution

    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(16, 12))

    # Keyword Performance Analysis
    x_pos = np.arange(len(keywords))
    bars1 = ax1.bar(x_pos, search_volumes, color='#4ECDC4', alpha=0.8)
    ax1_twin = ax1.twinx()
    line1 = ax1_twin.plot(x_pos, cpcs, 'ro-', linewidth=2, markersize=8, label='CPC (AED)')

    ax1.set_title('Top UAE Digital Marketing Keywords 2025\nSearch Volume & CPC', fontsize=13, fontweight='bold')
    ax1.set_xlabel('Keywords', fontsize=11)
    ax1.set_ylabel('Monthly Search Volume', fontsize=11, color='#4ECDC4')
    ax1_twin.set_ylabel('CPC (AED)', fontsize=11, color='red')
    ax1.set_xticks(x_pos)
    ax1.set_xticklabels([k.replace(' ', '\n') for k in keywords], fontsize=10)
    ax1.grid(True, alpha=0.3, axis='y')

    # Add search volume labels
    for i, v in enumerate(search_volumes):
        ax1.text(i, v + 50, str(v), ha='center', fontweight='bold', fontsize=10)

    # Language Search Distribution
    colors_lang = ['#45B7D1', '#FF6B6B', '#96CEB4']
    wedges3, texts3, autotexts3 = ax2.pie(search_distribution, labels=languages, autopct='%1.1f%%',
                                         colors=colors_lang, startangle=90)
    ax2.set_title('UAE Search Language Distribution 2025\nSEO Targeting Insights', fontsize=13, fontweight='bold')

    # Keyword Difficulty vs Opportunity Matrix
    # Create scatter plot with size based on search volume
    sizes = [v/5 for v in search_volumes]  # Scale for visibility
    scatter = ax3.scatter(difficulties, cpcs, s=sizes, alpha=0.7, c=range(len(keywords)), cmap='viridis')

    ax3.set_title('SEO Keyword Opportunity Matrix 2025\nDifficulty vs CPC vs Volume', fontsize=13, fontweight='bold')
    ax3.set_xlabel('SEO Difficulty Score', fontsize=11)
    ax3.set_ylabel('CPC (AED)', fontsize=11)
    ax3.grid(True, alpha=0.3)

    # Add keyword labels
    for i, keyword in enumerate(keywords):
        ax3.annotate(keyword.split()[0], (difficulties[i], cpcs[i]),
                    xytext=(5, 5), textcoords='offset points', fontsize=9)

    # Mobile vs Desktop Search Trends
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
    mobile_share = [78, 79, 81, 83, 85, 87, 88, 89, 90]  # Increasing mobile trend
    desktop_share = [100 - m for m in mobile_share]

    ax4.plot(months, mobile_share, 'o-', linewidth=3, markersize=8, label='Mobile Searches', color='#4ECDC4')
    ax4.plot(months, desktop_share, 's--', linewidth=2, markersize=6, label='Desktop Searches', color='#FF6B6B')

    ax4.set_title('UAE Mobile vs Desktop Search Trends 2025\nMonthly Evolution', fontsize=13, fontweight='bold')
    ax4.set_xlabel('Month', fontsize=11)
    ax4.set_ylabel('Search Share (%)', fontsize=11)
    ax4.legend()
    ax4.grid(True, alpha=0.3)
    ax4.set_ylim(0, 100)

    plt.tight_layout()
    plt.savefig('/workspace/charts/dubai_seo_keyword_analysis.png', dpi=300, bbox_inches='tight')
    plt.close()

    print("✅ SEO keyword analysis chart created successfully")

def main():
    """Main function to run all analyses"""

    # Create charts directory
    Path('/workspace/charts').mkdir(exist_ok=True)

    print("🚀 Starting Dubai Digital Marketing Landscape Analysis...")

    # Generate all visualizations
    create_market_size_analysis()
    create_pricing_analysis()
    create_roi_automation_analysis()
    create_demographic_analysis()
    create_keyword_seo_analysis()

    print("\n✨ All visualizations completed successfully!")
    print("Charts saved in /workspace/charts/")
    print("\nGenerated charts:")
    print("- dubai_market_size_projections.png")
    print("- dubai_pricing_analysis.png")
    print("- dubai_roi_automation_analysis.png")
    print("- dubai_demographic_analysis.png")
    print("- dubai_seo_keyword_analysis.png")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Create comprehensive diagnostic visualization charts for Atlas AI analysis
"""

import json
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
from matplotlib.patches import Rectangle
import warnings
warnings.filterwarnings('ignore')

# Set up matplotlib for high-quality output
plt.style.use('default')
plt.rcParams['figure.figsize'] = (12, 8)
plt.rcParams['font.size'] = 10
plt.rcParams['axes.titlesize'] = 14
plt.rcParams['axes.labelsize'] = 12

def load_diagnostic_data():
    """Load the diagnostic analysis results"""
    with open('/workspace/data/atlas_ai_comprehensive_diagnostic_results.json', 'r') as f:
        return json.load(f)

def create_overall_score_dashboard(data):
    """Create overall dashboard with key metrics"""
    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(16, 12))
    fig.suptitle('Atlas AI Website Diagnostic Dashboard', fontsize=20, fontweight='bold')
    
    # Overall Score Gauge
    overall_score = data['overall_score']['percentage']
    colors = ['#ff4444', '#ffaa00', '#ffdd00', '#88dd00', '#00dd00']
    color_idx = min(4, int(overall_score / 20))
    
    ax1.pie([overall_score, 100-overall_score], labels=['Score', ''], 
            colors=[colors[color_idx], '#f0f0f0'], startangle=90, counterclock=False)
    circle = plt.Circle((0,0), 0.7, color='white')
    ax1.add_artist(circle)
    ax1.text(0, 0, f'{overall_score}%\n{data["overall_score"]["grade"]}', 
             ha='center', va='center', fontsize=24, fontweight='bold')
    ax1.set_title('Overall Score', fontsize=16, fontweight='bold')
    
    # Scores by Area
    areas = list(data['areas'].keys())
    scores = [data['areas'][area]['score'] for area in areas]
    max_scores = [data['areas'][area]['max_score'] for area in areas]
    percentages = [s/m*100 for s, m in zip(scores, max_scores)]
    
    area_names = [area.replace('_', ' ').title() for area in areas]
    
    colors_bars = []
    for pct in percentages:
        if pct >= 80:
            colors_bars.append('#00dd00')
        elif pct >= 60:
            colors_bars.append('#88dd00')
        elif pct >= 40:
            colors_bars.append('#ffdd00')
        elif pct >= 20:
            colors_bars.append('#ffaa00')
        else:
            colors_bars.append('#ff4444')
    
    bars = ax2.barh(area_names, percentages, color=colors_bars)
    ax2.set_xlabel('Score (%)')
    ax2.set_title('Scores by Analysis Area', fontweight='bold')
    ax2.set_xlim(0, 100)
    
    # Add score labels on bars
    for i, (bar, pct) in enumerate(zip(bars, percentages)):
        ax2.text(pct + 2, i, f'{pct:.1f}%', va='center', fontweight='bold')
    
    # Priority Distribution
    priority_counts = {}
    for area_data in data['areas'].values():
        priority = area_data.get('priority_level', 'medium')
        priority_counts[priority] = priority_counts.get(priority, 0) + 1
    
    priority_colors = {'critical': '#ff0000', 'high': '#ff6600', 'medium': '#ffaa00', 'low': '#00aa00'}
    wedges, texts, autotexts = ax3.pie(priority_counts.values(), labels=priority_counts.keys(), 
                                      autopct='%1.0f', colors=[priority_colors.get(k, '#cccccc') for k in priority_counts.keys()])
    ax3.set_title('Priority Level Distribution', fontweight='bold')
    
    # Performance Metrics
    perf_data = data['areas']['performance']['metrics']
    metrics = ['Response Time (s)', 'Status Code', 'Content Size (KB)']
    values = [perf_data['response_time'], perf_data['status_code'], perf_data['content_size']/1024]
    
    ax4.bar(metrics, values, color=['#00aa00', '#0088aa', '#6600aa'])
    ax4.set_title('Performance Metrics', fontweight='bold')
    ax4.set_ylabel('Values')
    
    # Rotate x labels
    plt.setp(ax4.get_xticklabels(), rotation=45, ha='right')
    
    plt.tight_layout()
    plt.savefig('/workspace/charts/atlas_ai_diagnostic_dashboard.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print("✅ Overall diagnostic dashboard created")

def create_priority_matrix_chart(data):
    """Create priority matrix visualization"""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(18, 8))
    fig.suptitle('Atlas AI Implementation Priority Matrix', fontsize=16, fontweight='bold')
    
    # Priority vs Impact scatter plot
    priority_matrix = data.get('priority_matrix', [])
    if priority_matrix:
        priorities = [item['priority_level'] for item in priority_matrix]
        impacts = [item['impact_score'] for item in priority_matrix]
        complexities = [item['implementation_complexity'] for item in priority_matrix]
        
        # Map priority to numeric values
        priority_map = {'critical': 4, 'high': 3, 'medium': 2, 'low': 1}
        priority_nums = [priority_map.get(p, 2) for p in priorities]
        
        # Map complexity to colors
        complexity_colors = {'Low': '#00dd00', 'Medium': '#ffaa00', 'High': '#ff4444'}
        colors = [complexity_colors.get(c, '#cccccc') for c in complexities]
        
        scatter = ax1.scatter(priority_nums, impacts, c=colors, s=100, alpha=0.7)
        ax1.set_xlabel('Priority Level')
        ax1.set_ylabel('Impact Score')
        ax1.set_title('Priority vs Impact Analysis')
        ax1.set_xticks([1, 2, 3, 4])
        ax1.set_xticklabels(['Low', 'Medium', 'High', 'Critical'])
        ax1.grid(True, alpha=0.3)
        
        # Add legend for complexity
        for complexity, color in complexity_colors.items():
            ax1.scatter([], [], c=color, s=100, label=f'{complexity} Complexity')
        ax1.legend()
    
    # Implementation Timeline
    timeline = data.get('implementation_timeline', {})
    timeline_labels = ['Immediate\n(1-2 weeks)', 'Short-term\n(1-3 months)', 'Medium-term\n(3-6 months)', 'Long-term\n(6+ months)']
    timeline_counts = [len(timeline.get(key, [])) for key in ['immediate_actions', 'short_term', 'medium_term', 'long_term']]
    
    bars = ax2.bar(timeline_labels, timeline_counts, color=['#ff4444', '#ffaa00', '#88dd00', '#00aa88'])
    ax2.set_ylabel('Number of Actions')
    ax2.set_title('Implementation Timeline Distribution')
    
    # Add count labels on bars
    for bar, count in zip(bars, timeline_counts):
        if count > 0:
            ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1, 
                    str(count), ha='center', va='bottom', fontweight='bold')
    
    plt.tight_layout()
    plt.savefig('/workspace/charts/atlas_ai_priority_matrix.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print("✅ Priority matrix chart created")

def create_detailed_area_analysis(data):
    """Create detailed analysis charts for each area"""
    fig, axes = plt.subplots(3, 3, figsize=(20, 16))
    fig.suptitle('Atlas AI - Detailed Area Analysis', fontsize=18, fontweight='bold')
    
    areas = list(data['areas'].keys())
    area_names = [area.replace('_', ' ').title() for area in areas]
    
    for i, (area, ax) in enumerate(zip(areas, axes.flat)):
        area_data = data['areas'][area]
        score = area_data['score']
        max_score = area_data['max_score']
        percentage = (score / max_score) * 100
        
        # Create progress bar
        ax.barh([0], [percentage], color='#00aa00' if percentage >= 70 else '#ffaa00' if percentage >= 40 else '#ff4444', height=0.5)
        ax.barh([0], [100-percentage], left=[percentage], color='#f0f0f0', height=0.5)
        
        # Add score text
        ax.text(50, 0, f'{percentage:.1f}%\n({score}/{max_score})', ha='center', va='center', 
                fontweight='bold', fontsize=12)
        
        ax.set_xlim(0, 100)
        ax.set_ylim(-0.5, 0.5)
        ax.set_title(area_names[i], fontsize=14, fontweight='bold')
        ax.set_xlabel('Score (%)')
        ax.set_yticks([])
        
        # Add priority indicator
        priority = area_data.get('priority_level', 'medium')
        priority_color = {'critical': '#ff0000', 'high': '#ff6600', 'medium': '#ffaa00', 'low': '#00aa00'}
        ax.text(95, 0.3, priority.upper(), ha='center', va='center', 
                bbox=dict(boxstyle="round,pad=0.3", facecolor=priority_color.get(priority, '#cccccc'), alpha=0.8),
                fontsize=10, fontweight='bold', color='white')
    
    plt.tight_layout()
    plt.savefig('/workspace/charts/atlas_ai_detailed_analysis.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print("✅ Detailed area analysis chart created")

def create_security_analysis_chart(data):
    """Create detailed security analysis visualization"""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 8))
    fig.suptitle('Atlas AI Security Analysis Deep Dive', fontsize=16, fontweight='bold')
    
    security_data = data['areas']['security']
    
    # Security Categories Analysis
    categories = {
        'SSL/TLS': 20,  # Has SSL
        'Security Headers': 0,  # Missing all
        'Cookie Security': 0,   # Missing secure flags
        'Privacy Compliance': 0  # Missing privacy pages
    }
    
    # Create stacked bar chart
    good_scores = [categories[cat] for cat in categories]
    missing_scores = [100 - score for score in good_scores]
    
    x = range(len(categories))
    width = 0.6
    
    bars1 = ax1.bar(x, good_scores, width, label='Implemented', color='#00aa00')
    bars2 = ax1.bar(x, missing_scores, width, bottom=good_scores, label='Missing', color='#ff4444')
    
    ax1.set_ylabel('Implementation %')
    ax1.set_title('Security Implementation Status')
    ax1.set_xticks(x)
    ax1.set_xticklabels(categories.keys(), rotation=45, ha='right')
    ax1.legend()
    ax1.set_ylim(0, 100)
    
    # Security Findings
    findings = security_data.get('findings', [])
    positive_findings = [f for f in findings if '✓' in f]
    negative_findings = [f for f in findings if '⚠' in f]
    
    finding_counts = [len(positive_findings), len(negative_findings)]
    labels = ['Implemented\nFeatures', 'Missing\nFeatures']
    colors = ['#00aa00', '#ff4444']
    
    wedges, texts, autotexts = ax2.pie(finding_counts, labels=labels, autopct='%1.0f', 
                                      colors=colors, startangle=90)
    ax2.set_title('Security Findings Distribution')
    
    plt.tight_layout()
    plt.savefig('/workspace/charts/atlas_ai_security_analysis.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print("✅ Security analysis chart created")

def create_recommendations_summary(data):
    """Create recommendations summary visualization"""
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(16, 12))
    fig.suptitle('Atlas AI Recommendations Summary', fontsize=16, fontweight='bold')
    
    # Count recommendations by area
    area_rec_counts = {}
    for area_name, area_data in data['areas'].items():
        area_name_clean = area_name.replace('_', ' ').title()
        rec_count = len(area_data.get('recommendations', []))
        area_rec_counts[area_name_clean] = rec_count
    
    # Recommendations by area
    areas = list(area_rec_counts.keys())
    counts = list(area_rec_counts.values())
    
    bars = ax1.barh(areas, counts, color='#0066aa')
    ax1.set_xlabel('Number of Recommendations')
    ax1.set_title('Recommendations Count by Area')
    
    # Add count labels
    for i, (bar, count) in enumerate(zip(bars, counts)):
        ax1.text(count + 0.1, i, str(count), va='center', fontweight='bold')
    
    # Implementation complexity distribution
    if 'priority_matrix' in data:
        complexities = [item['implementation_complexity'] for item in data['priority_matrix']]
        complexity_counts = {}
        for complexity in complexities:
            complexity_counts[complexity] = complexity_counts.get(complexity, 0) + 1
        
        complexity_colors = {'Low': '#00dd00', 'Medium': '#ffaa00', 'High': '#ff4444'}
        wedges, texts, autotexts = ax2.pie(complexity_counts.values(), 
                                          labels=complexity_counts.keys(),
                                          autopct='%1.0f',
                                          colors=[complexity_colors.get(k, '#cccccc') for k in complexity_counts.keys()],
                                          startangle=90)
        ax2.set_title('Implementation Complexity Distribution')
    
    plt.tight_layout()
    plt.savefig('/workspace/charts/atlas_ai_recommendations_summary.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print("✅ Recommendations summary chart created")

def main():
    """Generate all diagnostic visualization charts"""
    print("🎨 Creating Atlas AI diagnostic visualizations...")
    
    # Load diagnostic data
    data = load_diagnostic_data()
    
    # Create all charts
    create_overall_score_dashboard(data)
    create_priority_matrix_chart(data)
    create_detailed_area_analysis(data)
    create_security_analysis_chart(data)
    create_recommendations_summary(data)
    
    print("\n🎯 All diagnostic visualizations created successfully!")
    print("📊 Charts saved to /workspace/charts/")
    print("   - atlas_ai_diagnostic_dashboard.png")
    print("   - atlas_ai_priority_matrix.png") 
    print("   - atlas_ai_detailed_analysis.png")
    print("   - atlas_ai_security_analysis.png")
    print("   - atlas_ai_recommendations_summary.png")

if __name__ == "__main__":
    main()

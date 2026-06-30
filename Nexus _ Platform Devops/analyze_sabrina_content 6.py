#!/usr/bin/env python3
import json


def analyze_sabrina_content():
    with open('sabrina_agents_content.json') as f:
        data = json.load(f)

    # Extract key information
    content = json.loads(data['raw_content'])
    features = content['data']['features']

    print(f'Total templates found: {len(features)}')
    print('\nTemplate categories and examples:')

    categories = {}
    for feature in features:
        name = feature['name']
        # Try to categorize based on name patterns
        if any(word in name.lower() for word in ['social', 'linkedin', 'twitter', 'instagram', 'facebook']):
            category = 'Social Media Automation'
        elif any(word in name.lower() for word in ['lead', 'crm', 'sales', 'follow-up']):
            category = 'Lead Generation & CRM'
        elif any(word in name.lower() for word in ['content', 'blog', 'seo', 'article', 'writing']):
            category = 'Content Creation'
        elif any(word in name.lower() for word in ['job', 'recruit', 'hr', 'candidate']):
            category = 'HR & Recruitment'
        elif any(word in name.lower() for word in ['email', 'gmail', 'outreach']):
            category = 'Email Automation'
        elif any(word in name.lower() for word in ['ecommerce', 'woocommerce', 'shop', 'order']):
            category = 'E-commerce'
        elif any(word in name.lower() for word in ['research', 'data', 'analysis', 'scraping']):
            category = 'Research & Analytics'
        elif any(word in name.lower() for word in ['chat', 'bot', 'telegram', 'assistant']):
            category = 'AI Assistants & Bots'
        else:
            category = 'General Automation'

        if category not in categories:
            categories[category] = []
        categories[category].append(name)

    # Print categorized templates
    for category, templates in categories.items():
        print(f'\n{category} ({len(templates)} templates):')
        for template in templates[:5]:  # Show first 5 in each category
            print(f'  - {template}')
        if len(templates) > 5:
            print(f'  ... and {len(templates) - 5} more')

    print(f'\nTotal categories: {len(categories)}')

    # Extract tools/integrations mentioned
    tools = set()
    for feature in features:
        if 'tools' in feature:
            tools.update(feature['tools'])

    print(f'\nKey integrations found ({len(tools)}):')
    print(', '.join(sorted(tools)[:20]))  # Show first 20

    return categories, tools

if __name__ == "__main__":
    analyze_sabrina_content()

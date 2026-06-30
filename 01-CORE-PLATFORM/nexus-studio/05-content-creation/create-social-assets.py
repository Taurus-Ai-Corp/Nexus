#!/usr/bin/env python3
"""
🎨 VIBE MARKETING - Social Media Asset Generator

Creates all visual assets needed for social media profile setup:
- Profile pictures
- Cover images  
- Highlight covers
- Content templates

Usage: python3 create-social-assets.py
"""

import os
from datetime import datetime


def create_asset_specifications():
    """Create detailed specifications for all social media assets"""

    assets = {
        "profile_pictures": {
            "description": "Circular profile pictures for all platforms",
            "specs": {
                "size": "400x400px",
                "format": "PNG with transparency",
                "background": "#8000FF (brand purple)",
                "logo": "Vibe Marketing logo centered",
                "text": "Clean, minimal design"
            },
            "platforms": ["Instagram", "LinkedIn", "Twitter", "YouTube", "TikTok"]
        },

        "cover_images": {
            "linkedin": {
                "size": "1192x220px",
                "text": "Anti-Boring Marketing for Dubai & India",
                "elements": ["Brand colors", "Logo", "Tagline", "Contact info"]
            },
            "twitter": {
                "size": "1500x500px",
                "text": "Making Marketing Exciting in Dubai & India",
                "elements": ["Bold typography", "Brand gradient", "Call to action"]
            },
            "youtube": {
                "size": "2560x1440px",
                "text": "New videos every Tuesday & Friday",
                "elements": ["Upload schedule", "Brand identity", "Value proposition"]
            },
            "facebook": {
                "size": "820x312px",
                "text": "Your Anti-Boring Marketing Agency",
                "elements": ["Professional look", "Contact details", "Services highlight"]
            }
        },

        "instagram_highlights": {
            "covers_needed": [
                {"name": "Tips", "icon": "💡", "color": "#8000FF"},
                {"name": "Services", "icon": "🏢", "color": "#FF0080"},
                {"name": "Team", "icon": "👥", "color": "#00FFFF"},
                {"name": "Dubai", "icon": "🇦🇪", "color": "#8000FF"},
                {"name": "India", "icon": "🇮🇳", "color": "#FF0080"},
                {"name": "Results", "icon": "📊", "color": "#00FFFF"},
                {"name": "BTS", "icon": "🎬", "color": "#8000FF"},
                {"name": "FAQ", "icon": "❓", "color": "#FF0080"}
            ],
            "specs": {
                "size": "1080x1080px",
                "style": "Consistent circular design",
                "background": "Brand gradient",
                "icon_style": "Clean, modern"
            }
        },

        "content_templates": {
            "instagram_post": {
                "size": "1080x1080px",
                "variations": ["Single image", "Carousel (6 slides)", "Quote graphic"],
                "elements": ["Brand colors", "Consistent fonts", "Logo placement"]
            },
            "instagram_story": {
                "size": "1080x1920px",
                "variations": ["Tip card", "Behind-the-scenes", "Question sticker"],
                "elements": ["Interactive elements", "Brand frames", "Call to action"]
            },
            "linkedin_post": {
                "size": "1200x627px",
                "variations": ["Article header", "Tip graphic", "Quote post"],
                "elements": ["Professional look", "Readable text", "Brand consistency"]
            },
            "twitter_card": {
                "size": "1200x675px",
                "variations": ["Thread graphic", "Tip card", "Announcement"],
                "elements": ["Bold headlines", "Twitter-optimized", "Engagement hooks"]
            },
            "youtube_thumbnail": {
                "size": "1280x720px",
                "variations": ["Tutorial", "Case study", "Behind-the-scenes"],
                "elements": ["High contrast", "Readable text", "Compelling imagery"]
            }
        }
    }

    return assets

def generate_figma_design_brief():
    """Generate a comprehensive design brief for Figma"""

    brief = """
🎨 VIBE MARKETING - FIGMA DESIGN BRIEF

## BRAND IDENTITY
- **Colors:** #8000FF (Purple), #FF0080 (Pink), #00FFFF (Cyan), #1A1A1A (Dark), #FFFFFF (White)
- **Fonts:** Montserrat Bold (Headers), Open Sans Regular (Body), Roboto Medium (Accent)
- **Style:** Modern, clean, high-contrast, energetic, professional yet fun

## DESIGN REQUIREMENTS

### 1. PROFILE PICTURES (400x400px)
- Circular Vibe Marketing logo
- Purple gradient background
- Clean, scalable design
- Works at small sizes

### 2. COVER IMAGES
**LinkedIn (1192x220px):**
- Text: "Anti-Boring Marketing for Dubai & India"
- Professional gradient background
- Logo placement (left side)
- Contact info (right side)

**Twitter (1500x500px):**
- Text: "Making Marketing Exciting in Dubai & India"
- Bold, attention-grabbing design
- Brand colors prominently featured
- Call-to-action element

**YouTube (2560x1440px):**
- Text: "New videos every Tuesday & Friday"
- Upload schedule prominently displayed
- Channel branding
- Subscribe call-to-action

### 3. INSTAGRAM HIGHLIGHT COVERS (1080x1080px)
Create 8 circular covers with:
- Consistent gradient backgrounds
- Simple, recognizable icons
- Brand color variations
- Clean, modern aesthetic

Icons needed:
- 💡 Tips (Purple background)
- 🏢 Services (Pink background)  
- 👥 Team (Cyan background)
- 🇦🇪 Dubai (Purple background)
- 🇮🇳 India (Pink background)
- 📊 Results (Cyan background)
- 🎬 BTS (Purple background)
- ❓ FAQ (Pink background)

### 4. CONTENT TEMPLATES

**Instagram Post Template (1080x1080px):**
- Carousel design (6 slides)
- Slide 1: Hook with bold text
- Slides 2-5: Content with consistent layout
- Slide 6: CTA with logo
- Brand colors throughout

**Instagram Story Template (1080x1920px):**
- Tip card format
- Top section: "Vibe Marketing" branding
- Middle: Content area with large text
- Bottom: CTA or swipe up
- Interactive elements space

**LinkedIn Post Template (1200x627px):**
- Professional header design
- Space for article title
- Author byline area
- Brand colors subtly integrated
- Clean, business-appropriate

**Twitter Card Template (1200x675px):**
- Bold headline space
- Thread number indicator
- Brand elements
- High contrast for mobile viewing

**YouTube Thumbnail Template (1280x720px):**
- Large, readable title text
- Face/product placement area
- Brand corner logo
- High contrast colors
- Mobile-optimized text size

## DESIGN PRINCIPLES
1. **Consistency:** All assets should feel cohesive
2. **Scalability:** Designs work at various sizes
3. **Brand Recognition:** Clear Vibe Marketing identity
4. **Cultural Sensitivity:** Appropriate for Dubai & India markets
5. **Mobile-First:** Optimized for mobile viewing
6. **High Contrast:** Readable on all devices
7. **Professional Fun:** Serious business, playful execution

## DELIVERABLES
- All assets in PNG format (high resolution)
- Figma file with organized layers
- Brand guidelines document
- Template variations for different content types

## TIMELINE
- Profile pictures: Priority 1 (needed first)
- Cover images: Priority 2 (for platform setup)
- Highlight covers: Priority 3 (Instagram optimization)
- Content templates: Priority 4 (ongoing content creation)
"""

    return brief

def create_asset_directory_structure():
    """Create organized directory structure for assets"""

    base_dir = "social_media_assets"
    directories = [
        "profile_pictures",
        "cover_images/linkedin",
        "cover_images/twitter",
        "cover_images/youtube",
        "cover_images/facebook",
        "instagram_highlights",
        "content_templates/instagram",
        "content_templates/linkedin",
        "content_templates/twitter",
        "content_templates/youtube",
        "brand_guidelines",
        "figma_exports"
    ]

    for directory in directories:
        full_path = os.path.join(base_dir, directory)
        os.makedirs(full_path, exist_ok=True)

        # Create placeholder files
        readme_content = f"""# {directory.replace('_', ' ').title()}

Assets for {directory.replace('_', ' ')} will be placed here.

Created: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""

        with open(os.path.join(full_path, "README.md"), 'w') as f:
            f.write(readme_content)

    print(f"✅ Created directory structure: {base_dir}/")
    return base_dir

def generate_content_calendar_first_week():
    """Generate ready-to-post content for the first week"""

    content_calendar = {
        "day_1": {
            "platform": "Instagram",
            "type": "Welcome Post",
            "caption": """🎪 Welcome to Vibe Marketing!

We're here to make marketing exciting again in Dubai & India.

🚀 What makes us different?
• No boring corporate speak
• Real results, not vanity metrics  
• Cultural understanding of MENA & South Asian markets
• Data-driven strategies that actually work

Ready to transform your marketing? Let's make some noise! 📢

#VibeMaketing #Dubai #India #MarketingAgency #AntiBoringMarketing""",
            "visual": "Team photo with Vibe Marketing branding",
            "hashtags": ["#VibeMarketing", "#Dubai", "#India", "#MarketingAgency"]
        },

        "day_2": {
            "platform": "LinkedIn",
            "type": "Story Post",
            "caption": """Why We Started Vibe Marketing 🎪

After working with 100+ businesses across Dubai and India, we noticed a pattern:

❌ Generic marketing strategies
❌ One-size-fits-all approaches  
❌ Ignoring cultural nuances
❌ Focusing on vanity metrics

So we decided to do something about it.

Vibe Marketing was born from a simple belief: Marketing should be exciting, culturally relevant, and results-driven.

We're not just another agency. We're your partners in making marketing that actually works.

Ready to join the anti-boring marketing revolution?

#MarketingAgency #Dubai #India #Entrepreneurship""",
            "visual": "Behind-the-scenes agency setup photo"
        },

        "day_3": {
            "platform": "Instagram",
            "type": "Carousel Post",
            "caption": """🇦🇪 Dubai Marketing Insights: What Actually Works

Swipe to see what we've learned from 50+ Dubai campaigns →

💡 Save this post for your next campaign!

#DubaiMarketing #UAEBusiness #MarketingTips #MENA""",
            "slides": [
                "Hook: Dubai Marketing Secrets",
                "Insight 1: Timing matters (Ramadan considerations)",
                "Insight 2: Language mix (English + Arabic phrases)",
                "Insight 3: Luxury positioning works",
                "Insight 4: Mobile-first is crucial",
                "CTA: Follow for more insights"
            ]
        },

        "day_4": {
            "platform": "Twitter",
            "type": "Thread",
            "content": """🧵 Thread: India Marketing vs Dubai Marketing

After running campaigns in both markets, here's what's different:

1/8 👇

2/8 🇮🇳 India: Value-conscious, family-oriented decisions
    🇦🇪 Dubai: Luxury-focused, individual choices

3/8 🇮🇳 India: Hindi/English mix resonates
    🇦🇪 Dubai: English with Arabic phrases

4/8 🇮🇳 India: Festival seasons = peak sales
    🇦🇪 Dubai: Shopping festivals + Ramadan timing

5/8 🇮🇳 India: Cricket sponsorships work well
    🇦🇪 Dubai: F1, golf, luxury events

6/8 🇮🇳 India: WhatsApp for customer service
    🇦🇪 Dubai: Instagram DMs preferred

7/8 🇮🇳 India: Price-focused messaging
    🇦🇪 Dubai: Quality and exclusivity

8/8 The key? Don't copy-paste strategies. Adapt to culture.

Retweet if this helped! 🔄"""
        },

        "day_5": {
            "platform": "LinkedIn",
            "type": "Article",
            "title": "The Anti-Boring Marketing Manifesto",
            "content": """We believe marketing should be:

✅ Exciting, not boring
✅ Results-driven, not vanity-focused
✅ Culturally relevant, not generic
✅ Transparent, not mysterious
✅ Human, not corporate

This is our promise to every client in Dubai and India.

#MarketingManifesto #AntiBoringMarketing"""
        },

        "day_6": {
            "platform": "Instagram Stories",
            "type": "Behind-the-Scenes",
            "content": [
                "Setting up our Dubai office 🏢",
                "Team brainstorming session 🧠",
                "Our favorite marketing tools 🛠️",
                "Coffee break conversations ☕",
                "Planning content for next week 📅"
            ]
        },

        "day_7": {
            "platform": "All Platforms",
            "type": "AMA Series",
            "content": """Sunday AMA: Ask Us Anything About Marketing! 

Drop your marketing questions in the comments/DMs:
• Dubai market strategies
• India campaign insights  
• Tool recommendations
• Budget optimization
• Cultural considerations

We'll answer every single one! 💬

#AMA #MarketingHelp #Dubai #India"""
        }
    }

    return content_calendar

def main():
    print("🎨 VIBE MARKETING - Social Media Asset Generator")
    print("=" * 50)

    # Create directory structure
    asset_dir = create_asset_directory_structure()

    # Generate asset specifications
    assets = create_asset_specifications()

    # Save specifications to file
    specs_file = os.path.join(asset_dir, "asset_specifications.json")
    import json
    with open(specs_file, 'w') as f:
        json.dump(assets, f, indent=2)

    # Generate Figma design brief
    design_brief = generate_figma_design_brief()
    brief_file = os.path.join(asset_dir, "brand_guidelines", "figma_design_brief.md")
    with open(brief_file, 'w') as f:
        f.write(design_brief)

    # Generate first week content calendar
    content_calendar = generate_content_calendar_first_week()
    calendar_file = os.path.join(asset_dir, "first_week_content_calendar.json")
    with open(calendar_file, 'w') as f:
        json.dump(content_calendar, f, indent=2)

    print(f"✅ Asset specifications created: {specs_file}")
    print(f"✅ Figma design brief created: {brief_file}")
    print(f"✅ First week content calendar: {calendar_file}")
    print(f"✅ Directory structure ready: {asset_dir}/")

    print("\n🚀 Next Steps:")
    print("1. Use the Figma design brief to create visual assets")
    print("2. Follow the social profile setup guide")
    print("3. Use the first week content calendar for launch")
    print("4. Run the content automation system for ongoing content")

    print("\n📋 Priority Order:")
    print("1. Create profile pictures (needed for all platforms)")
    print("2. Set up Instagram profile first (primary platform)")
    print("3. Create cover images for other platforms")
    print("4. Design Instagram highlight covers")
    print("5. Build content templates for ongoing use")

if __name__ == "__main__":
    main()

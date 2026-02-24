# LinkedIn Job Posting Templates

This directory contains platform-specific job posting templates for TAURUS AI CORP co-op positions.

## Available Templates

- **bizflow_coop_template.json** - AI Orchestration Co-op (BizFlow Platform)
- **neovibe_coop_template.json** - Creative Marketing Co-op (NeoVibe Platform)
- **assetgrid_coop_template.json** - Blockchain & Crypto Co-op (AssetGrid Platform)
- **oriongrid_coop_template.json** - RWA Blockchain Co-op (OrionGrid Platform)

## Template Structure

Each template contains:
- Platform identification
- Base job description
- Requirements and preferred qualifications
- Benefits and learning opportunities
- Skills, functions, and industries
- Work location type

## Usage

Templates are used by the `CoOpPositionBuilder` class to generate LinkedIn job postings. They can be customized per posting while maintaining consistency across platforms.

## Customization

When creating a job posting:
1. Load the appropriate template
2. Customize fields as needed (title, start date, duration, etc.)
3. Validate against LinkedIn requirements
4. Format for LinkedIn API submission


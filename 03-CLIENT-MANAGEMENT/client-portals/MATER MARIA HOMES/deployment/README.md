# Deployment Folder

## Purpose
This folder contains all deployment-related documentation, scripts, and environment configuration files for deploying the Mater Maria Homes application.

## Contents
- **Deployment Scripts** - Automated scripts for deploying to different environments
- **Environment Configuration** - .env examples, configuration files for dev/staging/prod
- **Domain Management** - DNS settings, SSL certificates, and domain transfer documentation
- **CI/CD Pipelines** - GitHub Actions, Vercel configurations, or other deployment automation
- **Rollback Procedures** - Steps to revert to previous versions if needed
- **Server Configuration** - Web server settings (if applicable), container configurations
- **Monitoring Setup** - Health checks, alerting configurations, and logging setup

## Substructure (if applicable)
```
deployment/
├── scripts/                     # Deployment and automation scripts
├── environments/                # Environment-specific configurations
│   ├── development/
│   ├── staging/
│   └── production/
├── domain/                      # DNS, SSL, and domain management docs
├── ci-cd/                       # Pipeline configurations
└── monitoring/                  # Health checks and alerting configs
```

## Key Deployment Details
- **Primary Platform**: Vercel (for Next.js frontend)
- **Backend**: Supabase (managed PostgreSQL + Auth)
- **Domain**: mater-maria.vercel.app (with custom domain configuration in progress)
- **Environment Variables**: Stored in Vercel dashboard and .env.local (gitignored)
- **Deployment Process**: Automatic on main branch pushes to GitHub
- **SSL**: Automatic via Vercel (Let's Encrypt)

## Related Folders
- **`technical_design/`** - Source code being deployed
- **`devops/`** - Operational handoff and procedures
- **`strategic_documents/`** - Release planning and go-to-market strategy
- **`quality_assurance/`** - Pre-deployment validation checklists
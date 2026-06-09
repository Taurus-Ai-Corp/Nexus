# DevOps Folder

## Purpose
This folder contains DevOps documentation, deployment procedures, infrastructure details, and operational handoff materials for the Mater Maria Homes project.

## Contents
- **Domain Handoff Documentation** - Procedures for transferring domain ownership and DNS configuration
- **Deployment Procedures** - Step-by-step guides for deploying updates to production
- **Infrastructure Diagrams** - Network architecture, server layouts, and service dependencies
- **Backup & Recovery Plans** - Data backup strategies and disaster recovery procedures
- **Monitoring & Alerting** - Setup for application performance monitoring and error tracking
- **Security Procedures** - Access controls, vulnerability scanning, and incident response
- **CI/CD Pipeline Details** - Configuration for automated testing and deployment
- **Environment Setup Guides** - Instructions for setting up development, staging, and production environments

## Key Documents Found
- `2026-05-06-domain-handoff.md` - Detailed domain transfer procedures from previous owner to current team
- `2026-05-08-website-devops-handoff.md` - Comprehensive DevOps handoff for the website infrastructure
- `dns-snapshot-2026-05-06.txt` - DNS records snapshot at time of handoff
- `scripts/post-cutover-verify.sh` - Validation script to run after domain cutover

## Substructure
```
devops/
├── handoffs/                    # Domain, infrastructure, and knowledge transfer documents
├── procedures/                  # Step-by-step operational procedures
├── monitoring/                  # Alerting configurations and dashboard setups
├── security/                    # Security policies, scanning reports, and incident response
├── scripts/                     # Automation and verification scripts
├── diagrams/                    # Architecture and network diagrams
└── environments/                # Environment-specific configurations and setup guides
```

## Related Folders
- **`deployment/`** - Where deployment scripts and release plans are kept (more tactical)
- **`technical_design/`** - Source code and technical architecture being operated
- **`strategic_documents/`** - Operational strategy and service level agreements
- **`quality_assurance/`** - Operational validation and compliance testing
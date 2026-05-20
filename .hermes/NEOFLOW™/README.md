# NEOFLOW™ Workspace

This workspace combines BizFlow and Nexus platforms to create the future product: NEOFLOW™, an enhanced changefinder and all-in-one solution.

## Directory Structure

- `core/` - Core platform components
  - `platform/` - Main platform components (symlink to 01-CORE-PLATFORM)
  - `gemini/` - Gemini workspace resources (symlink to .worktrees/gemini-workspace)
- `creative/` - Creative assets and design resources
  - `assets/` - Nexus creative assets (symlink to taurus-nexus-creative)
- `workflows/` - Workflow definitions and automation
  - `main/` - Main workflows (symlink to 06-WORKFLOWS)
- `api/` - API routes and integration points
  - `routes/` - API route definitions (symlink to 07-API-ROUTES)
- `documentation/` - Project documentation
  - `main/` - Main documentation (symlink to 08-DOCUMENTATION)
- `assets/` - General assets repository
- `config/` - Configuration files
- `testing/` - Testing resources and specifications

## Purpose

This workspace serves as the central hub for the NEOFLOW™ product development, combining the best of BizFlow's operational efficiency with Nexus's creative innovation. All resources are linked rather than duplicated to ensure consistency and reduce maintenance overhead.
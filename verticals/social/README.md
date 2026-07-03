# verticals/social

Social-suite vertical (antd UI). Target source: `social-suite-dashboard/` (top-level, 32 tracked files, not deployed from there).

## Wave 3 status: GATED

The deployed social-suite lives at `Nexus _ Platform Devops/social-suite-dashboard/`
(nested sibling git repo + Vercel project). The top-level `social-suite-dashboard/`
is the source half of a split source/deploy-config layout. Moving either half
without re-pointing the Vercel project's `rootDirectory` (Wave 5) breaks the live
deploy. Do NOT move until the Vercel gate is ready.
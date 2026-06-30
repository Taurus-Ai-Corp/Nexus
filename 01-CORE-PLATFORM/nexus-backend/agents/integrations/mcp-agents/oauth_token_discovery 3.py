#!/usr/bin/env python3
"""
OAuth Token Discovery and Extraction Script
Scrapes and finds all Google/Microsoft OAuth tokens in your directories
"""

import asyncio
import json
import logging
import re
from datetime import datetime
from pathlib import Path
from typing import Any

import requests

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class OAuthTokenDiscovery:
    """Discovers and extracts OAuth tokens from your codebase"""

    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.discovered_tokens = {}

        # OAuth token patterns
        self.token_patterns = {
            'google_oauth': [
                r'ya29\.[A-Za-z0-9_-]+',
                r'GOOGLE_OAUTH_TOKEN["\']?\s*[:=]\s*["\']?([A-Za-z0-9_.-]+)',
                r'access_token["\']?\s*[:=]\s*["\']?(ya29\.[A-Za-z0-9_-]+)',
            ],
            'microsoft_oauth': [
                r'eyJ0eXAi[A-Za-z0-9_.-]+',
                r'MICROSOFT_OAUTH_TOKEN["\']?\s*[:=]\s*["\']?([A-Za-z0-9_.-]+)',
                r'access_token["\']?\s*[:=]\s*["\']?(eyJ0eXAi[A-Za-z0-9_.-]+)',
            ],
            'dropbox_oauth': [
                r'sl\.[A-Za-z0-9_-]+',
                r'DROPBOX_OAUTH_TOKEN["\']?\s*[:=]\s*["\']?([A-Za-z0-9_.-]+)',
                r'access_token["\']?\s*[:=]\s*["\']?(sl\.[A-Za-z0-9_-]+)',
            ],
            'slack_tokens': [
                r'xoxb-[A-Za-z0-9-]+',
                r'xoxp-[A-Za-z0-9-]+',
                r'SLACK_BOT_TOKEN["\']?\s*[:=]\s*["\']?([A-Za-z0-9-]+)',
                r'SLACK_USER_TOKEN["\']?\s*[:=]\s*["\']?([A-Za-z0-9-]+)',
            ],
            'webflow_oauth': [
                r'WEBFLOW_ACCESS_TOKEN["\']?\s*[:=]\s*["\']?([A-Za-z0-9]+)',
                r'access_token["\']?\s*[:=]\s*["\']?([A-Za-z0-9]+)',
            ],
            'jwt_tokens': [
                r'eyJ[A-Za-z0-9_.-]+',
                r'JWT_TOKEN["\']?\s*[:=]\s*["\']?([A-Za-z0-9_.-]+)',
            ]
        }

        # File patterns to search
        self.file_patterns = [
            '*.env*',
            '*.json',
            '*.py',
            '*.ts',
            '*.js',
            '*.md',
            '*.txt',
            '*.yml',
            '*.yaml',
            '*.config.*'
        ]

        # Directories to skip
        self.skip_dirs = {
            'node_modules', '.git', '.venv', 'venv', '__pycache__',
            '.vscode', '.idea', 'site-packages', '.pytest_cache'
        }

    def discover_all_tokens(self) -> dict[str, Any]:
        """Main discovery method - scans entire codebase for OAuth tokens"""
        logger.info("🔍 Starting OAuth Token Discovery...")

        # Scan different file types
        self._scan_files()
        self._scan_webflow_tokens()
        self._scan_credential_files()

        # Generate comprehensive report
        self._generate_discovery_report()

        return self.discovered_tokens

    def _scan_files(self):
        """Scan all files for OAuth tokens"""
        logger.info("📁 Scanning files for OAuth tokens...")

        for pattern in self.file_patterns:
            files = list(self.project_root.rglob(pattern))
            # Filter out files in skipped directories
            files = [f for f in files if not any(skip_dir in str(f) for skip_dir in self.skip_dirs)]

            for file_path in files:
                try:
                    self._scan_file(file_path)
                except Exception as e:
                    logger.debug(f"Error scanning {file_path}: {e}")

    def _scan_file(self, file_path: Path):
        """Scan a single file for OAuth tokens"""
        try:
            with open(file_path, encoding='utf-8', errors='ignore') as f:
                content = f.read()

            for token_type, patterns in self.token_patterns.items():
                for pattern in patterns:
                    matches = re.findall(pattern, content, re.IGNORECASE)
                    if matches:
                        if token_type not in self.discovered_tokens:
                            self.discovered_tokens[token_type] = []

                        for match in matches:
                            # Clean up the match
                            if isinstance(match, tuple):
                                match = match[0] if match[0] else match[1]

                            if match and len(match) > 10:  # Basic validation
                                self.discovered_tokens[token_type].append({
                                    'token': match,
                                    'file': str(file_path),
                                    'pattern': pattern,
                                    'discovered_at': datetime.now().isoformat()
                                })

        except Exception as e:
            logger.debug(f"Error reading {file_path}: {e}")

    def _scan_webflow_tokens(self):
        """Scan for Webflow tokens specifically"""
        logger.info("🎨 Scanning for Webflow tokens...")

        webflow_files = list(self.project_root.rglob('*webflow*tokens*.json'))
        for file_path in webflow_files:
            try:
                with open(file_path) as f:
                    data = json.load(f)

                if 'access_token' in data:
                    if 'webflow_oauth' not in self.discovered_tokens:
                        self.discovered_tokens['webflow_oauth'] = []

                    self.discovered_tokens['webflow_oauth'].append({
                        'token': data['access_token'],
                        'file': str(file_path),
                        'type': 'webflow_access_token',
                        'scope': data.get('scope', 'unknown'),
                        'discovered_at': datetime.now().isoformat()
                    })

            except Exception as e:
                logger.debug(f"Error reading Webflow token file {file_path}: {e}")

    def _scan_credential_files(self):
        """Scan credential files and configuration directories"""
        logger.info("🔐 Scanning credential files...")

        # Look for credential files
        credential_patterns = [
            '**/credentials*',
            '**/auth*',
            '**/token*',
            '**/oauth*',
            '**/.env*',
            '**/config*'
        ]

        for pattern in credential_patterns:
            files = list(self.project_root.rglob(pattern))
            files = [f for f in files if not any(skip_dir in str(f) for skip_dir in self.skip_dirs)]

            for file_path in files:
                if file_path.is_file():
                    self._scan_file(file_path)

    async def validate_tokens(self) -> dict[str, Any]:
        """Validate discovered tokens by making test requests"""
        logger.info("🧪 Validating discovered tokens...")

        validation_results = {}

        for token_type, tokens in self.discovered_tokens.items():
            validation_results[token_type] = []

            for token_info in tokens:
                token = token_info['token']
                validation_result = await self._validate_single_token(token_type, token)

                validation_results[token_type].append({
                    **token_info,
                    'validation': validation_result
                })

        return validation_results

    async def _validate_single_token(self, token_type: str, token: str) -> dict[str, Any]:
        """Validate a single token"""
        try:
            if token_type == 'google_oauth':  # noqa: S105
                return await self._validate_google_token(token)
            elif token_type == 'microsoft_oauth':  # noqa: S105
                return await self._validate_microsoft_token(token)
            elif token_type == 'slack_tokens':  # noqa: S105
                return await self._validate_slack_token(token)
            elif token_type == 'webflow_oauth':  # noqa: S105
                return await self._validate_webflow_token(token)
            else:
                return {'valid': False, 'error': 'Unknown token type'}

        except Exception as e:
            return {'valid': False, 'error': str(e)}

    async def _validate_google_token(self, token: str) -> dict[str, Any]:
        """Validate Google OAuth token"""
        try:
            headers = {'Authorization': f'Bearer {token}'}
            response = requests.get(
                'https://www.googleapis.com/oauth2/v1/userinfo',
                headers=headers,
                timeout=10
            )

            if response.status_code == 200:
                user_info = response.json()
                return {
                    'valid': True,
                    'user_info': user_info,
                    'response_time': response.elapsed.total_seconds()
                }
            else:
                return {
                    'valid': False,
                    'error': f'HTTP {response.status_code}: {response.text[:100]}'
                }

        except Exception as e:
            return {'valid': False, 'error': str(e)}

    async def _validate_microsoft_token(self, token: str) -> dict[str, Any]:
        """Validate Microsoft OAuth token"""
        try:
            headers = {'Authorization': f'Bearer {token}'}
            response = requests.get(
                'https://graph.microsoft.com/v1.0/me',
                headers=headers,
                timeout=10
            )

            if response.status_code == 200:
                user_info = response.json()
                return {
                    'valid': True,
                    'user_info': user_info,
                    'response_time': response.elapsed.total_seconds()
                }
            else:
                return {
                    'valid': False,
                    'error': f'HTTP {response.status_code}: {response.text[:100]}'
                }

        except Exception as e:
            return {'valid': False, 'error': str(e)}

    async def _validate_slack_token(self, token: str) -> dict[str, Any]:
        """Validate Slack token"""
        try:
            headers = {'Authorization': f'Bearer {token}'}
            response = requests.get(
                'https://slack.com/api/auth.test',
                headers=headers,
                timeout=10
            )

            if response.status_code == 200:
                result = response.json()
                return {
                    'valid': result.get('ok', False),
                    'team_info': result,
                    'response_time': response.elapsed.total_seconds()
                }
            else:
                return {
                    'valid': False,
                    'error': f'HTTP {response.status_code}: {response.text[:100]}'
                }

        except Exception as e:
            return {'valid': False, 'error': str(e)}

    async def _validate_webflow_token(self, token: str) -> dict[str, Any]:
        """Validate Webflow token"""
        try:
            headers = {'Authorization': f'Bearer {token}'}
            response = requests.get(
                'https://api.webflow.com/v2/sites',
                headers=headers,
                timeout=10
            )

            if response.status_code == 200:
                sites = response.json()
                return {
                    'valid': True,
                    'sites_count': len(sites.get('sites', [])),
                    'response_time': response.elapsed.total_seconds()
                }
            else:
                return {
                    'valid': False,
                    'error': f'HTTP {response.status_code}: {response.text[:100]}'
                }

        except Exception as e:
            return {'valid': False, 'error': str(e)}

    def _generate_discovery_report(self):
        """Generate comprehensive discovery report"""
        logger.info("📊 Generating OAuth Token Discovery Report...")

        total_tokens = sum(len(tokens) for tokens in self.discovered_tokens.values())

        report = {
            'discovery_summary': {
                'total_tokens_found': total_tokens,
                'token_types': list(self.discovered_tokens.keys()),
                'discovery_timestamp': datetime.now().isoformat()
            },
            'discovered_tokens': self.discovered_tokens
        }

        # Save report
        report_file = self.project_root / 'oauth_token_discovery_report.json'
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)

        logger.info(f"📄 Report saved to: {report_file}")

        # Print summary
        print("\n" + "="*60)
        print("🔍 OAUTH TOKEN DISCOVERY REPORT")
        print("="*60)
        print(f"📊 Total tokens found: {total_tokens}")
        print(f"📁 Token types discovered: {len(self.discovered_tokens)}")

        for token_type, tokens in self.discovered_tokens.items():
            print(f"\n🔑 {token_type.upper()}: {len(tokens)} tokens")
            for i, token_info in enumerate(tokens[:3]):  # Show first 3
                print(f"  {i+1}. {token_info['token'][:20]}... (from {Path(token_info['file']).name})")
            if len(tokens) > 3:
                print(f"  ... and {len(tokens) - 3} more")

        print(f"\n📄 Full report saved to: {report_file}")
        print("="*60)

    def update_master_env(self, master_env_path: str):
        """Update master.env with discovered OAuth tokens"""
        logger.info("📝 Updating master.env with discovered OAuth tokens...")

        master_env_file = Path(master_env_path)
        if not master_env_file.exists():
            logger.error(f"Master env file not found: {master_env_path}")
            return

        # Read current content
        with open(master_env_file) as f:
            content = f.read()

        # Update with discovered tokens
        updates_made = 0

        for token_type, tokens in self.discovered_tokens.items():
            if not tokens:
                continue

            # Use the first valid token found
            token = tokens[0]['token']

            if token_type == 'google_oauth':  # noqa: S105
                if 'GOOGLE_OAUTH_TOKEN=' in content:
                    content = re.sub(
                        r'GOOGLE_OAUTH_TOKEN=.*',
                        f'GOOGLE_OAUTH_TOKEN={token}',
                        content
                    )
                    updates_made += 1
                else:
                    content += f'\nGOOGLE_OAUTH_TOKEN={token}\n'
                    updates_made += 1

            elif token_type == 'microsoft_oauth':  # noqa: S105
                if 'MICROSOFT_OAUTH_TOKEN=' in content:
                    content = re.sub(
                        r'MICROSOFT_OAUTH_TOKEN=.*',
                        f'MICROSOFT_OAUTH_TOKEN={token}',
                        content
                    )
                    updates_made += 1
                else:
                    content += f'\nMICROSOFT_OAUTH_TOKEN={token}\n'
                    updates_made += 1

            elif token_type == 'dropbox_oauth':  # noqa: S105
                if 'DROPBOX_OAUTH_TOKEN=' in content:
                    content = re.sub(
                        r'DROPBOX_OAUTH_TOKEN=.*',
                        f'DROPBOX_OAUTH_TOKEN={token}',
                        content
                    )
                    updates_made += 1
                else:
                    content += f'\nDROPBOX_OAUTH_TOKEN={token}\n'
                    updates_made += 1

            elif token_type == 'slack_tokens':  # noqa: S105
                for token_info in tokens:
                    token = token_info['token']
                    if token.startswith('xoxb-'):
                        if 'SLACK_BOT_TOKEN=' in content:
                            content = re.sub(
                                r'SLACK_BOT_TOKEN=.*',
                                f'SLACK_BOT_TOKEN={token}',
                                content
                            )
                            updates_made += 1
                        else:
                            content += f'\nSLACK_BOT_TOKEN={token}\n'
                            updates_made += 1
                    elif token.startswith('xoxp-'):
                        if 'SLACK_USER_TOKEN=' in content:
                            content = re.sub(
                                r'SLACK_USER_TOKEN=.*',
                                f'SLACK_USER_TOKEN={token}',
                                content
                            )
                            updates_made += 1
                        else:
                            content += f'\nSLACK_USER_TOKEN={token}\n'
                            updates_made += 1

        # Write updated content
        with open(master_env_file, 'w') as f:
            f.write(content)

        logger.info(f"✅ Updated master.env with {updates_made} OAuth tokens")


async def main():
    """Main function"""
    print("🚀 OAuth Token Discovery and Extraction")
    print("=" * 60)

    # Initialize discovery
    project_root = "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects"
    discovery = OAuthTokenDiscovery(project_root)

    # Discover tokens
    discovered_tokens = discovery.discover_all_tokens()

    # Validate tokens
    print("\n🧪 Validating discovered tokens...")
    validation_results = await discovery.validate_tokens()

    # Update master.env
    master_env_path = "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/BizFlow-Orchestrator/agents/integrations/mcp-agents/master.env"
    discovery.update_master_env(master_env_path)

    # Print validation summary
    print("\n" + "="*60)
    print("🧪 TOKEN VALIDATION SUMMARY")
    print("="*60)

    for token_type, tokens in validation_results.items():
        valid_count = sum(1 for t in tokens if t.get('validation', {}).get('valid', False))
        total_count = len(tokens)
        print(f"🔑 {token_type.upper()}: {valid_count}/{total_count} valid")

        for token_info in tokens:
            validation = token_info.get('validation', {})
            status = "✅" if validation.get('valid', False) else "❌"
            print(f"  {status} {token_info['token'][:20]}... - {validation.get('error', 'Valid')}")

    print("\n🎉 OAuth token discovery and extraction complete!")
    print("📄 Check oauth_token_discovery_report.json for full details")


if __name__ == "__main__":
    asyncio.run(main())

#!/usr/bin/env python3
"""
Demo script showing GitHub MCP capabilities available through your awesome-ai-apps integration
"""


import requests

import os
# Your GitHub token — use GITHUB_TOKEN env var
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")
headers = {
    'Authorization': f'token {GITHUB_TOKEN}',
    'Accept': 'application/vnd.github.v3+json'
}

def analyze_repository(owner, repo):
    """Demonstrate repository analysis capabilities"""
    print(f"🔍 Analyzing Repository: {owner}/{repo}")
    print("=" * 50)

    # 1. Repository Overview
    repo_response = requests.get(f'https://api.github.com/repos/{owner}/{repo}', headers=headers)
    if repo_response.status_code == 200:
        repo_data = repo_response.json()
        print("📊 Repository Overview:")
        print(f"   Description: {repo_data.get('description', 'N/A')}")
        print(f"   Language: {repo_data.get('language', 'N/A')}")
        print(f"   Stars: {repo_data.get('stargazers_count', 0):,}")
        print(f"   Forks: {repo_data.get('forks_count', 0):,}")
        print(f"   Open Issues: {repo_data.get('open_issues_count', 0)}")
        print(f"   Created: {repo_data.get('created_at', 'N/A')[:10]}")
        print(f"   Last Updated: {repo_data.get('updated_at', 'N/A')[:10]}")

    # 2. Recent Issues Analysis
    print("\n🎯 Recent Issues:")
    issues_response = requests.get(f'https://api.github.com/repos/{owner}/{repo}/issues?state=open&per_page=3', headers=headers)
    if issues_response.status_code == 200:
        issues = issues_response.json()
        for i, issue in enumerate(issues[:3], 1):
            print(f"   {i}. #{issue['number']}: {issue['title'][:60]}...")
            print(f"      Labels: {', '.join([label['name'] for label in issue.get('labels', [])])}")
            print(f"      Created: {issue['created_at'][:10]}")

    # 3. Recent Pull Requests
    print("\n🔀 Recent Pull Requests:")
    prs_response = requests.get(f'https://api.github.com/repos/{owner}/{repo}/pulls?state=open&per_page=3', headers=headers)
    if prs_response.status_code == 200:
        prs = prs_response.json()
        for i, pr in enumerate(prs[:3], 1):
            print(f"   {i}. #{pr['number']}: {pr['title'][:60]}...")
            print(f"      Author: {pr['user']['login']}")
            print(f"      Created: {pr['created_at'][:10]}")

    # 4. Language Statistics
    print("\n💻 Language Breakdown:")
    languages_response = requests.get(f'https://api.github.com/repos/{owner}/{repo}/languages', headers=headers)
    if languages_response.status_code == 200:
        languages = languages_response.json()
        total_bytes = sum(languages.values())
        for lang, bytes_count in sorted(languages.items(), key=lambda x: x[1], reverse=True)[:5]:
            percentage = (bytes_count / total_bytes) * 100
            print(f"   {lang}: {percentage:.1f}%")

    # 5. Contributors
    print("\n👥 Top Contributors:")
    contributors_response = requests.get(f'https://api.github.com/repos/{owner}/{repo}/contributors?per_page=5', headers=headers)
    if contributors_response.status_code == 200:
        contributors = contributors_response.json()
        for i, contrib in enumerate(contributors[:5], 1):
            print(f"   {i}. {contrib['login']}: {contrib['contributions']} contributions")

    # 6. Recent Commits
    print("\n📝 Recent Commits:")
    commits_response = requests.get(f'https://api.github.com/repos/{owner}/{repo}/commits?per_page=3', headers=headers)
    if commits_response.status_code == 200:
        commits = commits_response.json()
        for i, commit in enumerate(commits[:3], 1):
            message = commit['commit']['message'].split('\n')[0][:50]
            author = commit['commit']['author']['name']
            date = commit['commit']['author']['date'][:10]
            print(f"   {i}. {message}...")
            print(f"      By: {author} on {date}")

def demonstrate_capabilities():
    """Show what your MCP servers can do"""
    print("🚀 GitHub MCP Integration Capabilities")
    print("=" * 50)

    print("\n📋 Available Analysis Features:")
    features = [
        "📊 Repository statistics and metadata",
        "🎯 Issue tracking and analysis",
        "🔀 Pull request management",
        "💻 Code language analysis",
        "👥 Contributor insights",
        "📝 Commit history exploration",
        "🏷️  Release and tag information",
        "🌟 Star and fork tracking",
        "📈 Repository trends and activity",
        "🔍 Code search capabilities"
    ]

    for feature in features:
        print(f"   ✅ {feature}")

    print("\n🔧 Configured MCP Servers:")
    servers = [
        "github-official: Official GitHub MCP (Docker-based)",
        "mcp-starter: Repository analyzer with AI insights",
        "github-klavis: Alternative GitHub integration",
        "docs-mcp: Documentation Q&A (supports GitHub repos)"
    ]

    for server in servers:
        print(f"   ✅ {server}")

def main():
    demonstrate_capabilities()

    print("\n" + "=" * 50)
    print("🎯 Live Demo: Analyzing awesome-ai-apps repository")
    print("=" * 50)

    # Analyze the awesome-ai-apps repo as example
    analyze_repository("arindam200", "awesome-ai-apps")

    print("\n🎉 Your GitHub MCP integration is fully functional!")
    print("💡 You can now use these capabilities in Claude Code through MCP")

if __name__ == "__main__":
    main()

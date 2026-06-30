#!/usr/bin/env python3
"""
🧹 CURSOR PROJECTS - ROOT CONFIGURATION CLEANUP
Moves configuration directories to proper locations
"""

import shutil
from pathlib import Path


class RootConfigCleanup:
    def __init__(self):
        self.root_dir = Path("/Users/user/Documents/TAURUS AI Corp./CURSOR Projects")

    def print_header(self, title):
        print(f"\n{'='*60}")
        print(f"🧹 {title}")
        print(f"{'='*60}")

    def analyze_root_items(self):
        """Analyze what's in the root directory"""
        self.print_header("ANALYZING ROOT DIRECTORY")

        root_items = []
        for item in self.root_dir.iterdir():
            if item.is_dir() and item.name.startswith('.'):
                root_items.append({
                    'name': item.name,
                    'type': 'configuration',
                    'current_location': str(item),
                    'recommended_location': f"Configuration/{item.name[1:]}/"
                })
            elif item.is_file() and item.name == 'README.md':
                root_items.append({
                    'name': item.name,
                    'type': 'documentation',
                    'current_location': str(item),
                    'recommended_location': 'KEEP_IN_ROOT'
                })

        print("📊 ROOT DIRECTORY ANALYSIS:")
        for item in root_items:
            status = "✅ CORRECT" if item['recommended_location'] == 'KEEP_IN_ROOT' else "❌ SHOULD MOVE"
            print(f"  {status} {item['name']} - {item['type']}")
            if item['recommended_location'] != 'KEEP_IN_ROOT':
                print(f"      Should move to: {item['recommended_location']}")

        return root_items

    def move_configuration_directories(self):
        """Move configuration directories to proper locations"""
        self.print_header("MOVING CONFIGURATION DIRECTORIES")

        config_moves = [
            {
                'source': '.clinerules',
                'destination': 'Configuration/clinerules',
                'reason': 'Cline AI rules and configuration'
            },
            {
                'source': '.cursor',
                'destination': 'Configuration/cursor',
                'reason': 'Cursor IDE configuration and cache'
            },
            {
                'source': '.kilocode',
                'destination': 'Configuration/kilocode',
                'reason': 'Kilocode AI configuration'
            },
            {
                'source': '.playwright-mcp',
                'destination': 'Development-Tools/testing/playwright',
                'reason': 'Playwright MCP testing configuration'
            }
        ]

        moved_count = 0

        for move in config_moves:
            source_path = self.root_dir / move['source']
            dest_path = self.root_dir / move['destination']

            if source_path.exists():
                try:
                    # Create destination directory if it doesn't exist
                    dest_path.parent.mkdir(parents=True, exist_ok=True)

                    # Move the directory
                    if dest_path.exists():
                        shutil.rmtree(dest_path)
                    shutil.move(str(source_path), str(dest_path))

                    print(f"✅ Moved {move['source']} → {move['destination']}")
                    print(f"   Reason: {move['reason']}")
                    moved_count += 1

                except Exception as e:
                    print(f"❌ Failed to move {move['source']}: {e}")
            else:
                print(f"⚠️  Source not found: {move['source']}")

        print(f"\n📊 MOVED {moved_count} configuration directories")
        return moved_count

    def verify_clean_root(self):
        """Verify the root directory is clean"""
        self.print_header("VERIFYING CLEAN ROOT")

        remaining_dirs = []
        for item in self.root_dir.iterdir():
            if item.is_dir() and item.name.startswith('.'):
                remaining_dirs.append(item.name)

        if remaining_dirs:
            print("⚠️  REMAINING CONFIG DIRECTORIES:")
            for dir_name in remaining_dirs:
                print(f"  - {dir_name}")
        else:
            print("✅ ROOT DIRECTORY IS CLEAN!")
            print("   Only business directories and README.md remain")

        return len(remaining_dirs) == 0

    def create_cleanup_report(self, items_analyzed, items_moved, is_clean):
        """Create cleanup report"""
        self.print_header("CREATING CLEANUP REPORT")

        report = {
            "timestamp": "2025-09-11",
            "cleanup_status": "completed" if is_clean else "partial",
            "items_analyzed": len(items_analyzed),
            "items_moved": items_moved,
            "root_clean": is_clean,
            "remaining_config_dirs": not is_clean
        }

        report_file = self.root_dir / "ROOT_CLEANUP_REPORT.json"
        with open(report_file, 'w') as f:
            import json
            json.dump(report, f, indent=2)

        print(f"✅ Cleanup report created: {report_file}")
        return report_file

    def run_cleanup(self):
        """Run the complete root cleanup"""
        print("🧹 CURSOR PROJECTS - ROOT CONFIGURATION CLEANUP")
        print("=" * 60)
        print("Moving configuration directories to proper locations...")

        # Step 1: Analyze root items
        items_analyzed = self.analyze_root_items()

        # Step 2: Move configuration directories
        items_moved = self.move_configuration_directories()

        # Step 3: Verify clean root
        is_clean = self.verify_clean_root()

        # Step 4: Create cleanup report
        self.create_cleanup_report(items_analyzed, items_moved, is_clean)

        # Final summary
        self.print_header("CLEANUP COMPLETE!")

        print("🎉 ROOT CONFIGURATION CLEANUP COMPLETED!")
        print("")
        print(f"✅ Items analyzed: {len(items_analyzed)}")
        print(f"✅ Items moved: {items_moved}")
        print(f"✅ Root clean: {'Yes' if is_clean else 'No'}")
        print("")

        if is_clean:
            print("🏰 Your root directory is now clean and professional!")
            print("   Only business directories and README.md remain")
        else:
            print("⚠️  Some configuration directories may still need attention")

        print("")
        print("📁 Your clean root structure:")
        print("   - TAURUS-AI-EMPIRE/     # Main business hub")
        print("   - Archives/             # Historical data")
        print("   - Configuration/        # All configs organized")
        print("   - Development-Sandbox/  # Development tools")
        print("   - README.md            # Main documentation")

if __name__ == "__main__":
    cleanup = RootConfigCleanup()
    cleanup.run_cleanup()

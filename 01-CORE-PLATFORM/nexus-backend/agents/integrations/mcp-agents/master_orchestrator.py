#!/usr/bin/env python3
"""
Master Orchestrator - MCP API Keys Fix System
Coordinates all sub-agents to fix MCP connection issues and API key problems

This is the main entry point for the Master Orchestrator system that:
1. Discovers all required API keys
2. Standardizes environment file locations
3. Generates comprehensive acquisition guides
4. Validates all API keys
5. Updates MCP configurations
6. Deploys integration testing suite
"""

import os
import sys
import json
import asyncio
from pathlib import Path
from typing import Dict, List, Optional
from datetime import datetime

# Add sub-agents to path
sys.path.append(str(Path(__file__).parent / "sub-agents"))

from api_key_discovery_agent import APIKeyDiscoveryAgent
from environment_file_manager import EnvironmentFileManager
from api_key_acquisition_guide import APIKeyAcquisitionGuideGenerator
from api_key_validator import APIKeyValidator
from mcp_configuration_updater import MCPConfigurationUpdater
from integration_testing_suite import IntegrationTestingSuite

class MasterOrchestrator:
    """Master Orchestrator for MCP API Keys Fix System"""
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.start_time = datetime.now()
        self.results = {
            "discovery": None,
            "environment": None,
            "guide": None,
            "validation": None,
            "configuration": None,
            "testing": None
        }
        self.errors = []
        
        print("🚀 MASTER ORCHESTRATOR - MCP API Keys Fix System")
        print("="*80)
        print(f"Project Root: {self.project_root}")
        print(f"Started: {self.start_time.strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*80)
    
    async def execute_full_fix(self) -> Dict:
        """Execute the complete MCP API keys fix process"""
        print("\n🎯 EXECUTING FULL MCP API KEYS FIX PROCESS")
        print("="*80)
        
        try:
            # Phase 1: Discovery and Analysis
            print("\n📋 PHASE 1: DISCOVERY AND ANALYSIS")
            print("-" * 40)
            await self._phase_1_discovery()
            
            # Phase 2: Environment Standardization
            print("\n📁 PHASE 2: ENVIRONMENT STANDARDIZATION")
            print("-" * 40)
            await self._phase_2_environment()
            
            # Phase 3: Guide Generation
            print("\n📚 PHASE 3: GUIDE GENERATION")
            print("-" * 40)
            await self._phase_3_guides()
            
            # Phase 4: API Key Validation
            print("\n🔍 PHASE 4: API KEY VALIDATION")
            print("-" * 40)
            await self._phase_4_validation()
            
            # Phase 5: MCP Configuration Update
            print("\n🔧 PHASE 5: MCP CONFIGURATION UPDATE")
            print("-" * 40)
            await self._phase_5_configuration()
            
            # Phase 6: Integration Testing
            print("\n🧪 PHASE 6: INTEGRATION TESTING")
            print("-" * 40)
            await self._phase_6_testing()
            
            # Generate final report
            self._generate_final_report()
            
            return self.results
            
        except Exception as e:
            error_msg = f"Master Orchestrator execution failed: {str(e)}"
            self.errors.append(error_msg)
            print(f"\n❌ CRITICAL ERROR: {error_msg}")
            return self.results
    
    async def _phase_1_discovery(self):
        """Phase 1: Discover all API key requirements"""
        print("🔍 Running API Key Discovery Agent...")
        
        try:
            discovery_agent = APIKeyDiscoveryAgent(str(self.project_root))
            discovered_keys = discovery_agent.discover_all_keys()
            
            self.results["discovery"] = {
                "status": "completed",
                "keys_found": len(discovered_keys),
                "keys": discovered_keys
            }
            
            print(f"✅ Discovery completed: {len(discovered_keys)} API keys found")
            
        except Exception as e:
            error_msg = f"Discovery phase failed: {str(e)}"
            self.errors.append(error_msg)
            print(f"❌ {error_msg}")
            self.results["discovery"] = {"status": "failed", "error": error_msg}
    
    async def _phase_2_environment(self):
        """Phase 2: Standardize environment files"""
        print("📁 Running Environment File Manager...")
        
        try:
            env_manager = EnvironmentFileManager(str(self.project_root))
            env_results = env_manager.standardize_environment_files()
            
            self.results["environment"] = {
                "status": "completed",
                "created_files": env_results["created_files"],
                "updated_files": env_results["updated_files"],
                "standardized_locations": env_results["standardized_locations"],
                "errors": env_results["errors"]
            }
            
            print(f"✅ Environment standardization completed")
            print(f"   Created: {len(env_results['created_files'])} files")
            print(f"   Updated: {len(env_results['updated_files'])} files")
            
        except Exception as e:
            error_msg = f"Environment phase failed: {str(e)}"
            self.errors.append(error_msg)
            print(f"❌ {error_msg}")
            self.results["environment"] = {"status": "failed", "error": error_msg}
    
    async def _phase_3_guides(self):
        """Phase 3: Generate API key acquisition guides"""
        print("📚 Running API Key Acquisition Guide Generator...")
        
        try:
            guide_generator = APIKeyAcquisitionGuideGenerator(str(self.project_root))
            
            # Generate comprehensive guide
            guide_content = guide_generator.generate_comprehensive_guide()
            guide_file = guide_generator.save_guide(guide_content)
            
            # Generate quick reference
            quick_ref = guide_generator.generate_quick_reference()
            quick_ref_file = self.project_root / "TAURUS AI CORP" / "BizFlow-Orchestrator" / "agents" / "integrations" / "mcp-agents" / "API_KEYS_QUICK_REFERENCE.md"
            
            with open(quick_ref_file, 'w') as f:
                f.write(quick_ref)
            
            self.results["guide"] = {
                "status": "completed",
                "guide_file": str(guide_file),
                "quick_reference_file": str(quick_ref_file)
            }
            
            print(f"✅ Guide generation completed")
            print(f"   Guide: {guide_file}")
            print(f"   Quick Reference: {quick_ref_file}")
            
        except Exception as e:
            error_msg = f"Guide generation phase failed: {str(e)}"
            self.errors.append(error_msg)
            print(f"❌ {error_msg}")
            self.results["guide"] = {"status": "failed", "error": error_msg}
    
    async def _phase_4_validation(self):
        """Phase 4: Validate API keys"""
        print("🔍 Running API Key Validator...")
        
        try:
            validator = APIKeyValidator(str(self.project_root))
            validation_results = await validator.validate_all_keys()
            
            # Count results by status
            valid_count = len([r for r in validation_results if r.status == "valid"])
            total_count = len(validation_results)
            
            self.results["validation"] = {
                "status": "completed",
                "total_tested": total_count,
                "valid_keys": valid_count,
                "results": validation_results
            }
            
            print(f"✅ API key validation completed")
            print(f"   Valid: {valid_count}/{total_count} keys")
            
        except Exception as e:
            error_msg = f"Validation phase failed: {str(e)}"
            self.errors.append(error_msg)
            print(f"❌ {error_msg}")
            self.results["validation"] = {"status": "failed", "error": error_msg}
    
    async def _phase_5_configuration(self):
        """Phase 5: Update MCP configurations"""
        print("🔧 Running MCP Configuration Updater...")
        
        try:
            config_updater = MCPConfigurationUpdater(str(self.project_root))
            config_results = config_updater.update_all_configurations()
            
            self.results["configuration"] = {
                "status": "completed",
                "updated_files": config_results["updated_files"],
                "created_files": config_results["created_files"],
                "errors": config_results["errors"]
            }
            
            print(f"✅ MCP configuration update completed")
            print(f"   Updated: {len(config_results['updated_files'])} files")
            print(f"   Created: {len(config_results['created_files'])} files")
            
        except Exception as e:
            error_msg = f"Configuration phase failed: {str(e)}"
            self.errors.append(error_msg)
            print(f"❌ {error_msg}")
            self.results["configuration"] = {"status": "failed", "error": error_msg}
    
    async def _phase_6_testing(self):
        """Phase 6: Run integration tests"""
        print("🧪 Running Integration Testing Suite...")
        
        try:
            test_suite = IntegrationTestingSuite(str(self.project_root))
            test_results = test_suite.run_all_tests()
            
            # Count results by status
            passed_count = len([r for r in test_results if r.status == "passed"])
            total_count = len(test_results)
            
            self.results["testing"] = {
                "status": "completed",
                "total_tests": total_count,
                "passed_tests": passed_count,
                "results": test_results
            }
            
            print(f"✅ Integration testing completed")
            print(f"   Passed: {passed_count}/{total_count} tests")
            
        except Exception as e:
            error_msg = f"Testing phase failed: {str(e)}"
            self.errors.append(error_msg)
            print(f"❌ {error_msg}")
            self.results["testing"] = {"status": "failed", "error": error_msg}
    
    def _generate_final_report(self):
        """Generate comprehensive final report"""
        end_time = datetime.now()
        duration = end_time - self.start_time
        
        print("\n" + "="*80)
        print("📊 MASTER ORCHESTRATOR - FINAL REPORT")
        print("="*80)
        print(f"Execution Time: {duration}")
        print(f"Started: {self.start_time.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Completed: {end_time.strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Phase summaries
        phases = [
            ("Discovery", self.results.get("discovery", {})),
            ("Environment", self.results.get("environment", {})),
            ("Guide Generation", self.results.get("guide", {})),
            ("Validation", self.results.get("validation", {})),
            ("Configuration", self.results.get("configuration", {})),
            ("Testing", self.results.get("testing", {}))
        ]
        
        print(f"\n📋 PHASE SUMMARIES:")
        for phase_name, phase_result in phases:
            if phase_result and phase_result.get("status") == "completed":
                print(f"   ✅ {phase_name}: COMPLETED")
            elif phase_result and phase_result.get("status") == "failed":
                print(f"   ❌ {phase_name}: FAILED")
            else:
                print(f"   ⏭️  {phase_name}: SKIPPED")
        
        # Error summary
        if self.errors:
            print(f"\n❌ ERRORS ({len(self.errors)}):")
            for i, error in enumerate(self.errors, 1):
                print(f"   {i}. {error}")
        else:
            print(f"\n✅ NO ERRORS")
        
        # Save detailed report
        self._save_final_report(end_time, duration)
        
        # Final status
        if not self.errors:
            print(f"\n🎉 MASTER ORCHESTRATOR COMPLETED SUCCESSFULLY!")
            print(f"   All phases completed without errors")
            print(f"   MCP system is ready for use")
        else:
            print(f"\n⚠️  MASTER ORCHESTRATOR COMPLETED WITH ERRORS")
            print(f"   {len(self.errors)} errors encountered")
            print(f"   Check the detailed report for more information")
    
    def _save_final_report(self, end_time: datetime, duration):
        """Save detailed final report to file"""
        report_data = {
            "execution_summary": {
                "start_time": self.start_time.isoformat(),
                "end_time": end_time.isoformat(),
                "duration_seconds": duration.total_seconds(),
                "project_root": str(self.project_root)
            },
            "phase_results": self.results,
            "errors": self.errors,
            "summary": {
                "total_phases": 6,
                "completed_phases": len([r for r in self.results.values() if r and r.get("status") == "completed"]),
                "failed_phases": len([r for r in self.results.values() if r and r.get("status") == "failed"]),
                "total_errors": len(self.errors)
            }
        }
        
        report_file = self.project_root / "TAURUS AI CORP" / "BizFlow-Orchestrator" / "agents" / "integrations" / "mcp-agents" / "master_orchestrator_report.json"
        
        with open(report_file, 'w') as f:
            json.dump(report_data, f, indent=2)
        
        print(f"\n📄 Detailed report saved to: {report_file}")

async def main():
    """Main execution function"""
    project_root = "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects"
    
    orchestrator = MasterOrchestrator(project_root)
    results = await orchestrator.execute_full_fix()
    
    return results

if __name__ == "__main__":
    # Run the master orchestrator
    asyncio.run(main())

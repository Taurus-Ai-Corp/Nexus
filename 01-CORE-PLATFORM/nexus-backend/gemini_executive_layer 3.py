#!/usr/bin/env python3
"""
🏰 TAURUS AI CORP. - Gemini Executive Layer (GEL)
The "Novel" integration layer connecting BizFlow agents to Gemini CLI & GWS Bridge.
"""

import asyncio
import json
import logging
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Any

logger = logging.getLogger("GeminiExecutiveLayer")
logging.basicConfig(level=logging.INFO)

class GeminiExecutiveLayer:
    """
    The Executive Layer provides high-level symbolic reasoning and 
    global workspace synchronization by wrapping Gemini CLI tools.
    """

    def __init__(self):
        self.gws_enabled = self._check_gws_bridge()

    def _check_gws_bridge(self) -> bool:
        """Check if gws-bridge is available and authenticated."""
        try:
            result = subprocess.run(["gws-bridge", "status"], capture_output=True, text=True)
            return "Authenticated" in result.stdout
        except Exception:
            return False

    async def ask_gemini(self, prompt: str, use_subagent: bool = True) -> str:
        """
        Send a complex reasoning task to the Gemini CLI.
        If use_subagent is True, it leverages the Generalist sub-agent.
        """
        logger.info(f"🧠 Delegating to Gemini CLI: {prompt[:100]}...")

        # In a real integration, this would use the gemini-cli binary directly
        # For this PoC, we simulate the call to the CLI
        cmd = ["gemini", prompt]
        if use_subagent:
            # Note: The CLI handles sub-agent delegation internally if prompted correctly
            prompt = f"[USE GENERALIST AGENT] {prompt}"
            cmd = ["gemini", prompt]

        try:
            # We use subprocess to execute the CLI command
            # Note: This assumes 'gemini' is in the PATH
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()

            if process.returncode != 0:
                logger.error(f"Gemini CLI Error: {stderr.decode()}")
                return f"Error: {stderr.decode()}"

            return stdout.decode().strip()
        except Exception as e:
            logger.error(f"Failed to call Gemini CLI: {e}")
            return f"Exception: {str(e)}"

    async def sync_to_leads_sheet(self, leads: list[dict[str, Any]]):
        """
        Push identified leads to the GWS Bridge CRM.
        """
        if not self.gws_enabled:
            logger.warning("⚠️ GWS Bridge not authenticated. Skipping sync.")
            return

        logger.info(f"📊 Syncing {len(leads)} leads to Google Sheets via GWS Bridge...")

        for lead in leads:
            # Format: gws-bridge sheets append <spreadsheet_id> <range> <values_json>
            # Based on 'gws-bridge status', Leads Sheet ID is: 11vaFtLUFCcMpwMcufS_Mzug59XyAwpzU_OccFgtBT3M
            spreadsheet_id = "11vaFtLUFCcMpwMcufS_Mzug59XyAwpzU_OccFgtBT3M"

            # Simple mapping for the sheet
            values = [
                lead.get("name", "N/A"),
                lead.get("industry", "N/A"),
                lead.get("location", "N/A"),
                lead.get("pain_points", "N/A"),
                lead.get("budget_range", "N/A"),
                datetime.now().strftime("%Y-%m-%d"),
                lead.get("contact_info", "N/A")
            ]

            # Use gws-bridge CLI
            # Note: We'd ideally batch this, but for PoC we do one by one or via a temporary file
            cmd = ["gws-bridge", "pipeline", "leads", json.dumps(lead)]
            subprocess.run(cmd)

    async def create_proposal_doc(self, lead_name: str, analysis_content: str) -> str:
        """
        Create a professional proposal in Google Docs.
        """
        if not self.gws_enabled:
            return "GWS Bridge Disabled"

        logger.info(f"📝 Creating Google Doc proposal for {lead_name}...")

        temp_file = Path(f"/tmp/proposal_{lead_name.replace(' ', '_')}.md")
        with open(temp_file, "w") as f:
            f.write(f"# Proposal for {lead_name}\n\n")
            f.write(analysis_content)

        # gws-bridge docs create "Title" file.md
        cmd = ["gws-bridge", "docs", "create", f"AI Marketing Proposal - {lead_name}", str(temp_file)]
        result = subprocess.run(cmd, capture_output=True, text=True)

        return result.stdout.strip()

if __name__ == "__main__":
    # Test block
    gel = GeminiExecutiveLayer()
    print(f"GWS Status: {gel.gws_enabled}")

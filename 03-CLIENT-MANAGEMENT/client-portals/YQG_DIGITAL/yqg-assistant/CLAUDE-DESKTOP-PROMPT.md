# Paste this into Claude Desktop

Open Claude Desktop (or any agent with terminal/filesystem access on this Mac), start a new conversation, and paste everything below the `---` line.

Claude Desktop will then read the full reference doc from disk, execute the commands, and report back.

---

You are being handed off a deployment task from another Claude session. Full context and reference commands live in this file — read it first:

```
/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/03-CLIENT-MANAGEMENT/client-portals/YQG_DIGITAL/yqg-assistant/HANDOFF-FOR-CLAUDE-DESKTOP.md
```

## Your mission

Make `https://yqg-assistant.vercel.app` actually speak when a user clicks "Talk to your YQG Assistant". Right now the frontend is deployed but the voice-agent worker process is not running anywhere, so clicking Talk results in silence. Fix that.

## Hard constraints

1. **$0 spend until explicit approval.** No paid tiers, no subscriptions, no auto-provisioning of billable resources. If a step would cost money, STOP and ask the operator first. See the pricing table in the reference doc.
2. **Do not ship the demo URL to the end client (Tim Warnholtz at YQG Digital) yourself.** Only the operator sends external communications.
3. **Do not rotate any tokens yet.** The reference doc lists tokens that need rotation — flag them in your final report, do not rotate them for the operator.
4. **Prefer Path A (local worker) over Path B (Fly.io).** Path A is $0 forever. Path B eats a $5 Fly credit in 25–30 days.

## Execution plan

1. **Preflight** — verify the operator's environment:
   - `which python3 fly vercel` — note which are present
   - `ls /Users/taurus_ai/Desktop/NEXUS-LOCAL-VOICE-ASSISTANT/backend` — confirm the backend source is where the reference doc expects it
   - `cat /Users/taurus_ai/Desktop/NEXUS-LOCAL-VOICE-ASSISTANT/backend/.env | grep -c ^LIVEKIT_` — should return 3 (URL, KEY, SECRET)

2. **Attempt Path A first** — run the local worker steps in the reference doc. Install `livekit-agents[silero,groq]`, copy the YQG files from the fork at `/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/03-CLIENT-MANAGEMENT/client-portals/YQG_DIGITAL/yqg-assistant/backend/` into the NEXUS backend, and start the worker.
   - The worker must stay running — start it in a new iTerm window or a `tmux`/`screen` session so it persists.
   - **Stop and ask the operator before closing any open windows or terminating processes they already have running.**

3. **Flip Vercel `AGENT_NAME=yqg-agent`** — do this AFTER confirming the worker registered successfully (look for `registered worker` in the worker logs).

4. **Verify end-to-end** — run the three curl checks from the reference doc. Take a screenshot of the frontend hitting the yqg-assistant.vercel.app URL if you have browser capability. Do NOT actually click Talk and speak into a mic — that's the operator's job.

5. **Report back** with this structure:

   ```
   Status: LIVE | BLOCKED | NEEDS APPROVAL
   Path used: A (local) | B (Fly) | C (HF Space)
   Worker location: <path or fly app name>
   Verification:
     - Token endpoint: PASS/FAIL
     - Worker registered: PASS/FAIL
     - AGENT_NAME env: <value>
   Blockers (if any):
   Next step for operator:
   ```

## Stop and ask the operator if

- Path A fails during `pip install` (dependency conflicts are common in mixed Python environments — ask before forcing with `--break-system-packages`)
- Path B requires `fly auth login` (that's an interactive browser flow — the operator needs to be at the keyboard)
- The reference doc's commands reference a file that doesn't exist on disk
- Any step would send an external communication (email, Slack, webhook, HTTP POST to a third party)
- You encounter a `.env` file with secrets that look fresh/unfamiliar — better to ask than accidentally overwrite

## Success criteria

The voice agent is considered "working" when ALL of these are true:

- `curl -X POST https://yqg-assistant.vercel.app/api/token -d '{"roomName":"t","participantName":"t"}'` returns 200 with a clean `serverUrl` (no trailing `\n`)
- Worker process logs show `Job received — room:` after a browser joins a test room
- The Vercel env var `AGENT_NAME` equals `yqg-agent`
- The worker process is running in a session that will persist past your handoff (tmux, screen, or long-lived iTerm window)

## Do NOT

- Do not modify any file under `/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/03-CLIENT-MANAGEMENT/client-portals/YQG_DIGITAL/yqg-assistant/` without operator approval — those are the canonical fork files
- Do not `git commit`, `git push`, or create any new GitHub/GitLab/Fly remote without asking
- Do not edit anything under `/Users/taurus_ai/Desktop/NEXUS-LOCAL-VOICE-ASSISTANT/backend/src/` that would affect the default `nexus-agent` worker behavior — only ADD the `yqg_worker.py`, `yqg_tools.py`, and `prompts/yqg-persona.txt` files
- Do not change the LiveKit Cloud project (the reference doc mentions creating a new project to fix the `nexus-voice-agent-*` subdomain leak — that's a separate task for the operator, not you)

## Start

Begin with the preflight check. Report back after each of the 5 execution steps — don't batch everything into a final summary. The operator wants visibility into where things fail.

End of handoff prompt.

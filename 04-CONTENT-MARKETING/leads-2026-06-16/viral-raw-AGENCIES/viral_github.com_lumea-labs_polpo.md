Title: GitHub - lumea-labs/polpo: The open source runtime for AI agents

URL Source: https://github.com/lumea-labs/polpo

Markdown Content:
[![Image 1: Polpo](https://camo.githubusercontent.com/a1d124a8218977eb5f51fe82c3f3e1afb70c6f02f3faeb6849a270bde00b7d2c/68747470733a2f2f706f6c706f2e73682f6c6f676f2e737667)](https://camo.githubusercontent.com/a1d124a8218977eb5f51fe82c3f3e1afb70c6f02f3faeb6849a270bde00b7d2c/68747470733a2f2f706f6c706f2e73682f6c6f676f2e737667)

The open backend for AI agents. 

 Define your agent, deploy it, and get a fully working API with memory, tools, sandboxing, completions — out of the box.

[![Image 2: npm](https://camo.githubusercontent.com/b3d070df58cda8873bd23a7cf96672947fa54eb4d46ea15a07363eba05bad1ad/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f706f6c706f2d61692e737667)](https://www.npmjs.com/package/polpo-ai)[![Image 3: CI](https://github.com/lumea-labs/polpo/actions/workflows/ci.yml/badge.svg)](https://github.com/lumea-labs/polpo/actions/workflows/ci.yml)[![Image 4: Apache 2.0](https://camo.githubusercontent.com/b29de0acdfd19013f1f02689b15c933e4a6c145be9efa718288f88ba3280b1c5/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d417061636865253230322e302d626c75652e737667)](https://github.com/lumea-labs/polpo/blob/main/LICENSE)[![Image 5: Discord](https://camo.githubusercontent.com/3a1902542eda0bb191a09b1711fbf93cef5e41e94bdca7016f631ad81afa4e5c/68747470733a2f2f696d672e736869656c64732e696f2f646973636f72642f706c616365686f6c6465723f6c6162656c3d646973636f7264)](https://discord.gg/6JHCYQHr)

[Docs](https://docs.polpo.sh/) · [Website](https://polpo.sh/) · [Discord](https://discord.gg/6JHCYQHr) · [Issues](https://github.com/lumea-labs/polpo/issues)

* * *

## What is Polpo?

[](https://github.com/lumea-labs/polpo#what-is-polpo)
Polpo is an open-source runtime for building, running, and managing AI agents. It provides the infrastructure layer so you can focus on what your agents do, not how they run.

*   **Tasks** -- assign work to agents, track status, retry on failure
*   **Missions** -- multi-step workflows with checkpoints and delays
*   **Tools** -- filesystem, browser, HTTP, email, PDF, Excel, audio, images, vault
*   **Completions** -- OpenAI-compatible `/v1/chat/completions` endpoint
*   **Loops** -- beta project-level deterministic graphs assigned to agents
*   **Real-time** -- SSE event streaming for live agent activity
*   **Storage** -- file (default), SQLite, or PostgreSQL via Drizzle
*   **Assessment** -- built-in quality scoring with LLM review
*   **Skills** -- reusable agent capabilities loaded from YAML playbooks
*   **CLI** -- `polpo create`, `polpo dev`, `polpo deploy`

## Quick start

[](https://github.com/lumea-labs/polpo#quick-start)

npx polpo create

Scaffolds a new Polpo project (cloud + local) with an interactive wizard: pick an org, a project name, and a template. Link an existing project instead:

npx polpo link --project-id <id>

Install globally so `polpo` is on your PATH:

npm i -g @polpo-ai/cli

The local server starts on `http://localhost:3890`. Open the API at `/api/v1/health`.

### Programmatic usage

[](https://github.com/lumea-labs/polpo#programmatic-usage)

import { Orchestrator } from "polpo-ai";

const orchestrator = new Orchestrator("./my-project");
await orchestrator.init();
await orchestrator.run();

## Packages

[](https://github.com/lumea-labs/polpo#packages)
| Package | Description | npm |
| --- | --- | --- |
| [`polpo-ai`](https://github.com/lumea-labs/polpo/blob/main) | Main package -- CLI, server, orchestrator | [![Image 6: npm](https://camo.githubusercontent.com/b3d070df58cda8873bd23a7cf96672947fa54eb4d46ea15a07363eba05bad1ad/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f706f6c706f2d61692e737667)](https://www.npmjs.com/package/polpo-ai) |
| [`@polpo-ai/core`](https://github.com/lumea-labs/polpo/blob/main/packages/core) | Pure business logic, zero Node.js deps | [![Image 7: npm](https://camo.githubusercontent.com/884fc821f66fa3b4c95b19f19844eb0e49d383d8f6c620caf469990416bd0c46/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f40706f6c706f2d61692f636f72652e737667)](https://www.npmjs.com/package/@polpo-ai/core) |
| [`@polpo-ai/drizzle`](https://github.com/lumea-labs/polpo/blob/main/packages/drizzle) | Drizzle ORM stores (SQLite + PostgreSQL) | [![Image 8: npm](https://camo.githubusercontent.com/5c8d4d3aa3819319dabfce8377407b3262f295310f215303984267686c6435a5/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f40706f6c706f2d61692f6472697a7a6c652e737667)](https://www.npmjs.com/package/@polpo-ai/drizzle) |
| [`@polpo-ai/server`](https://github.com/lumea-labs/polpo/blob/main/packages/server) | Hono route factories (shared between OSS and cloud) | [![Image 9: npm](https://camo.githubusercontent.com/e9237418ca63656e91ee4e3be2b1dd36f74d470f49b77b4d19765caaa5044961/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f40706f6c706f2d61692f7365727665722e737667)](https://www.npmjs.com/package/@polpo-ai/server) |
| [`@polpo-ai/sdk`](https://github.com/lumea-labs/polpo/blob/main/packages/client-sdk) | TypeScript client SDK | [![Image 10: npm](https://camo.githubusercontent.com/079c140906f3ac629672edf265da7a65940437d3b03cf323b68aab84a330d262/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f40706f6c706f2d61692f73646b2e737667)](https://www.npmjs.com/package/@polpo-ai/sdk) |
| [`@polpo-ai/react`](https://github.com/lumea-labs/polpo/blob/main/packages/react-sdk) | React hooks (TanStack Query + SSE) | [![Image 11: npm](https://camo.githubusercontent.com/a9388af135858d6b888803d70de2984b78ec3fa1e75a8a9b4765f0c20e18de1b/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f40706f6c706f2d61692f72656163742e737667)](https://www.npmjs.com/package/@polpo-ai/react) |
| [`@polpo-ai/tools`](https://github.com/lumea-labs/polpo/blob/main/packages/tools) | Extended tool definitions | [![Image 12: npm](https://camo.githubusercontent.com/bc93c0b91f0f59100ff631dc1420faf44098d349e3dd78189c62c28c3ffcbdd8/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f40706f6c706f2d61692f746f6f6c732e737667)](https://www.npmjs.com/package/@polpo-ai/tools) |
| [`@polpo-ai/vault-crypto`](https://github.com/lumea-labs/polpo/blob/main/packages/vault-crypto) | Encryption for vault secrets | [![Image 13: npm](https://camo.githubusercontent.com/8c3411cde0ae5caf0fec9536c4211a69206902269711c36c43278246c1226de6/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f40706f6c706f2d61692f7661756c742d63727970746f2e737667)](https://www.npmjs.com/package/@polpo-ai/vault-crypto) |

## Architecture

[](https://github.com/lumea-labs/polpo#architecture)

```
@polpo-ai/core          Pure logic, types, state machine, store interfaces
    |
@polpo-ai/drizzle       SQLite + PostgreSQL store implementations
    |
polpo-ai                Node.js shell: orchestrator, CLI, Hono server, tools
    |
@polpo-ai/server        Shared Hono route factories
@polpo-ai/sdk           Client SDK (fetch + SSE)
@polpo-ai/react         React hooks wrapping the SDK
```

Core contains zero Node.js dependencies. The shell (`polpo-ai`) wires concrete adapters: file stores, Drizzle stores, the LLM engine, and the HTTP server.

## Storage

[](https://github.com/lumea-labs/polpo#storage)
Polpo supports three storage backends:

## Tools

[](https://github.com/lumea-labs/polpo#tools)
Agents get access to tools based on their configuration. Built-in tool groups:

*   **System** -- bash, read, write, edit, glob, grep, memory
*   **Browser** -- Playwright-based web automation
*   **HTTP** -- fetch, download
*   **Email** -- SMTP send, IMAP read/search
*   **PDF** -- read, create, merge
*   **Excel** -- read/write spreadsheets
*   **Docx** -- read Word documents
*   **Audio** -- STT/TTS (Deepgram, OpenAI Whisper, ElevenLabs)
*   **Image** -- generation and analysis
*   **Vault** -- encrypted secret management

## Loops Beta

[](https://github.com/lumea-labs/polpo#loops-beta)
Loops are project-level deterministic graphs stored in `.polpo/loops/*.json` and assigned to agents from `.polpo/agents.json`. This avoids duplicating loop definitions across agents: a loop has `name`, `context`, `start`, and `steps`; an agent has `assignedLoops` and `defaultLoop`.

Use `type: "tool"` for deterministic sandbox/tool actions without an LLM turn, and `toolChoice` on `type: "agent"` when the model should still reason but must use a tool. Secrets stay in Vault; loop JSON should only contain non-secret input, while custom tools resolve credentials with `ctx.vault`.

`.polpo/loops/router-flow.json`:

`.polpo/agents.json`:

Loop guards use Polpo's safe expression evaluator instead of JavaScript `eval` or `new Function`. Step outputs are available in the shared context bag by step id or `saveAs` path, e.g. `classify.route`, `review.approved`, or `timing.start`. `saveAs` writes context data; it does not create shell variables inside later `bash` commands. The OSS surface validates and round-trips the contract through core types, API schemas, SDK types, `polpo deploy`, and `polpo pull`.

Loops also have first-class governance fields:

*   `permissions`: readable allow/deny/approval rules for resources such as `tool`, `step`, `model`, `human`, and `loop`. Use this for least-privilege runtime constraints beyond an agent's broad tool assignment.
*   `policies`: expression-based gates for advanced compliance rules.
*   `hooks`: deterministic tool actions at lifecycle points such as `loop:start`, `tool:before`, `tool:after`, and `loop:end`.
*   `loop_trace`: durable runtime events including `permission.result`, `policy.result`, `approval.required`, tool calls, transitions, and step outcomes.

When a permission or policy requires approval, the runtime stores a checkpoint on the loop run. Approving the gate moves the run to `approval_approved`; `POST /loop-runs/:id/resume` continues from the saved context and remaining steps without replaying completed steps.

You can also keep loops as code and compile them to the same canonical contract:

// .polpo/loops/router-flow.ts
import { defineProjectLoop } from "@polpo-ai/core/loop-code";

export default defineProjectLoop({
  version: "1",
  kind: "graph",
  name: "router-flow",
  context: "shared",
  permissions: [
    {
      id: "router-tool-allowlist",
      resource: "tool",
      action: "call",
      effect: "allow",
      match: { tool: ["read", "write"] }
    }
  ],
  start: "classify",
  steps: {
    classify: {
      type: "agent",
      systemPrompt: "Classify the incoming request.",
      tools: ["read"],
      next: "answer",
    },
    answer: {
      type: "agent",
      systemPrompt: "Answer using the selected route.",
      tools: ["write"],
      next: "end",
    },
  },
});

CLI support:

polpo loops validate
polpo loops compile .polpo/loops/router-flow.ts --out .polpo/loops/router-flow.json
polpo deploy

Agent-direct chat can target a loop explicitly:

{
  "agent": "router",
  "loop": "router-flow",
  "messages": [{ "role": "user", "content": "Route this request" }]
}

At runtime, the selected project loop can narrow the effective prompt, tools, skills, model, reasoning, tool choice, and max turns per agent step. If a step omits `skills`, it inherits the agent-level `skills`. Project loop execution in chat completions uses the shared context graph: deterministic tool steps run first, store outputs in the context bag, and later agent steps receive that context as runtime data in their system prompt. Core keeps a compatibility normalizer for legacy inline `loops` + `pipeline` configs and ships a pure `PipelineExecutor` for sequential, tool, switch, parallel, and human nodes; hosts wire `runLoop`, `runTool`, and `handleHuman` callbacks to their concrete runtime.

Project loops also support governance fields:

Lifecycle hooks are deterministic tool actions run by the host runtime at `loop:start`, `step:before`, `model:before`, `tool:before`, `tool:after`, `step:after`, `loop:transition`, and `loop:end`. Hook `when` guards are evaluated against the shared context plus lifecycle payload such as `step.name`, `step.type`, `tool.name`, `tool.input`, and `transition.from/to`. Hook outputs are saved into the context bag with `saveAs`; `onError: "continue"` turns a failed hook into trace-only telemetry, while the default is fail-closed.

Policies are evaluated before hook actions at the same lifecycle point. `deny` fails the loop with `LoopPolicyDeniedError`, `approval` raises `LoopApprovalRequiredError`, and `allow` policies form an allow-list for that lifecycle point when at least one exists. If an allow-list is present and no allow rule matches, the loop is blocked.

When the host wires `LoopRunStore`, chat completions create durable loop runs, append every `loop_trace` event, and return `loop_run_id`. When the host also wires `ApprovalStore`, approval policies create a pending approval request and mark the loop run as `awaiting_approval` with `approvalRequestId`. The SDK exposes `getLoopRuns()` and `getLoopRun(id)` for audit/history surfaces. Streaming completions still emit each trace incrementally.

## SDK

[](https://github.com/lumea-labs/polpo#sdk)
### Client SDK

[](https://github.com/lumea-labs/polpo#client-sdk)

import { PolpoClient } from "@polpo-ai/sdk";

const client = new PolpoClient({
  baseUrl: "http://localhost:3890",
});

const tasks = await client.getTasks();
const agents = await client.getAgents();

### React SDK

[](https://github.com/lumea-labs/polpo#react-sdk)

import { PolpoProvider, useTasks, useAgents } from "@polpo-ai/react";

function App() {
  return (
    <PolpoProvider baseUrl="http://localhost:3890">
      <TaskList />
    </PolpoProvider>
  );
}

function TaskList() {
  const { tasks, createTask } = useTasks();
  // Real-time updates via SSE
  return <ul>{tasks.map(t => <li key={t.id}>{t.title}</li>)}</ul>;
}

## Development

[](https://github.com/lumea-labs/polpo#development)

git clone https://github.com/lumea-labs/polpo.git
cd polpo
pnpm install
pnpm build
pnpm test

### Project structure

[](https://github.com/lumea-labs/polpo#project-structure)

```
src/                    Main package source
  adapters/             Node.js runtime adapters (engine, filesystem, shell)
  assessment/           Quality scoring and LLM review
  cli/                  Commander CLI commands
  core/                 Orchestrator wiring + re-exports from @polpo-ai/core
  server/               Hono HTTP server + routes
  stores/               File-based store implementations
  tools/                Tool implementations (browser, email, PDF, etc.)
packages/
  core/                 @polpo-ai/core -- pure business logic
  drizzle/              @polpo-ai/drizzle -- SQL store implementations
  server/               @polpo-ai/server -- shared Hono route factories
  client-sdk/           @polpo-ai/sdk -- TypeScript client
  react-sdk/            @polpo-ai/react -- React hooks
  tools/                @polpo-ai/tools -- tool definitions
  vault-crypto/         @polpo-ai/vault-crypto -- encryption
examples/
  chat-app/             React chat app example
```

## Cloud

[](https://github.com/lumea-labs/polpo#cloud)
Polpo Cloud is the managed version at [polpo.sh](https://polpo.sh/). It uses the same open-source core with managed infrastructure: Neon PostgreSQL, sandboxed execution, and a dashboard.

## License

[](https://github.com/lumea-labs/polpo#license)
[Apache 2.0](https://github.com/lumea-labs/polpo/blob/main/LICENSE) -- Lumea Labs

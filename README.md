# Forge CAD Studio

Private Sites application with a full-screen browser CAD workspace, Three.js viewport, JSCAD constructive solid geometry, editable feature history, manual dimensions/transforms/patterns/polygon extrusions, undo/redo, browser-local persistence, JSON project import/export, and STL export.

Cloud AI is invoked by the authenticated Worker route `/api/generate`. A provider picker supports Gemini, Groq, OpenRouter, and OpenAI. The same structured CAD schema, geometry validation, and preview/accept/deny workflow are used for all providers. Gemini is the default; a missing key produces a connection message, not a simulated response or automatic paid fallback. Provider requests run only on the server, with credentials supplied as runtime secrets.

| Provider | Runtime secret | Default model |
| --- | --- | --- |
| Gemini | `GEMINI_API_KEY` | `gemini-3.8-flash` |
| Groq | `GROQ_API_KEY` | `openai/gpt-oss-120b` |
| OpenRouter | `OPENROUTER_API_KEY` | `openrouter/free` |
| OpenAI | `OPENAI_API_KEY` | `gpt-5-mini` |

`CAD_AI_PROVIDER` selects the default provider. Optional `GEMINI_CAD_MODEL`, `GROQ_CAD_MODEL`, `OPENROUTER_CAD_MODEL`, and `OPENAI_CAD_MODEL` override models. OpenRouter overrides must be `openrouter/free` or end in `:free`; no automatic fallback to a paid provider is implemented. Other providers can bill according to their account tier; free usage depends on provider account quotas, model eligibility, and billing settings. Configure a free-tier provider account for no-cost usage.

At implementation time, the alternative-provider keys are not connected. Gemini/Groq/OpenRouter payload and response adapters were tested using simulated provider responses; live inference cannot be validated until a key is configured. The existing OpenAI account returned `credit_balance_exhausted`. Google documents that free-tier inputs can be used to improve its products; review provider terms before submitting confidential CAD data.

Provider documentation: [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing), [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output), [Groq structured output](https://console.groq.com/docs/structured-outputs), [Groq free-plan limits](https://console.groq.com/docs/rate-limits), [OpenRouter free router](https://openrouter.ai/openrouter/free). Model defaults and tiers reflect these references checked October 13, 2026.

## Build and verify

- `npm ci`
- `node scripts/assemble.mjs`
- `node scripts/check.mjs`
- `bash scripts/build.sh`
- `node scripts/validate-artifact.mjs`

The Worker embeds the HTML and bundled client JavaScript; no external frontend CDN is required. User projects live in browser localStorage, not a server database. Export Forge JSON to transfer or back up projects.

## Scope

This is a working first CSG modeling release, not a production BRep CAD system. It supports boxes, cylinders including tapers, spheres, polygon extrusion, union/subtract/intersect, rotations, translations, and linear patterns. It does not implement a constraint-based sketch solver, chamfers/fillets, assemblies, collision constraints, STEP/IGES import/export, engineering validation, collaboration, or server project storage. Cloud LLM generation may produce invalid or approximate designs; inspect geometry and dimensions before use.

## Custom CAD models: next architecture

Keep the feature graph as a provider-neutral output contract. A future authenticated model adapter can replace the OpenAI call with a managed Vertex endpoint or another deployed inference service. Colab can support dataset preparation and training experiments; persistent serving should use a dedicated endpoint. Train on licensed CAD feature histories paired with descriptions, dimensions, edits, and validation outcomes. Split datasets by design family to prevent near-duplicate leakage. Evaluate executable-graph rate, geometric validity, dimensional accuracy, edit consistency, robustness on withheld part families, latency, and inference cost. No custom model has been trained in this release.

For manufacturing CAD, add an OpenCascade-based BRep service (for example via Python/CadQuery), running outside the Worker and communicating over HTTPS. Keep the Worker as the authenticated API gateway; use job queues and object storage for heavy builds, STEP artifacts, and previews. Add a real sketch solver and topology-aware selections before offering production CAD claims. A free/open-weight model still needs compute and hosting.

## Responsive workspace and AI review

Toolbar buttons overflow into More as available width decreases; the same buttons retain their handlers. Hidden explorer and property panels remain available through More. Scrollable regions hide scrollbar chrome while preserving mouse-wheel, touch, and keyboard access.

AI proposals are compiled and validated before review. Preview renders a separate candidate without writing it into the project or undo history. Current/proposed comparison, Accept, and Deny are available in the viewport. Accept requires a preview and rejects a stale proposal if the baseline design changed. Broad English prompts can produce designs with explicit assumptions, conversational explanations, or clarification questions; numeric CAD specifications are not mandatory. HTML/sign-in responses are handled as clear errors instead of JSON parsing failures.

GitHub CI builds the Worker, validates its artifact, and runs geometry, API, and proposal-isolation checks. Browser visual QA remains outstanding because this execution environment has no supported browser-control skill.

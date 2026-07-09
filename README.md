# Claude-Code

## Stitch MCP integration

This project is configured to connect to Google's Stitch MCP server via the
project-scoped `.mcp.json` file. Claude Code (and any other MCP-compatible
client) will pick this up automatically when run from the repo root.

Before use, set the following environment variables so the credentials
aren't checked into source control:

- `STITCH_ACCESS_TOKEN` — an OAuth access token for the Stitch API.
- `STITCH_PROJECT_ID` — your Google Cloud project ID (used for the
  `X-Goog-User-Project` header).

Equivalent manual setup via the CLI (adds the server to your user-level
config instead of the project):

```bash
claude mcp add stitch \
  --transport http https://stitch.googleapis.com/mcp \
  --header "Authorization: Bearer ${STITCH_ACCESS_TOKEN}" \
  --header "X-Goog-User-Project: ${STITCH_PROJECT_ID}" \
  -s user
```

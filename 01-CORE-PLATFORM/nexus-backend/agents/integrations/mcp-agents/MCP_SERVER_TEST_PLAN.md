# MCP Server Test Plan & Verification Guide

## 🔄 **Step 1: Restart Cursor Required**

The MCP servers are not currently loaded. You need to **restart Cursor** to load the new configuration with your Atlassian API token.

### **Restart Process:**
1. **Close Cursor completely**
2. **Reopen Cursor**
3. **Wait for MCP servers to initialize** (may take 30-60 seconds)
4. **Verify servers are loaded** by checking available tools

## 🧪 **Step 2: Atlassian Integration Test**

Once Cursor is restarted, we'll test the Atlassian integration:

### **Test 1: Atlassian Domain Access**
```bash
# Test if taurus.atlassian.net is accessible
curl -I https://taurus.atlassian.net
```

### **Test 2: API Token Validation**
```bash
# Test API token with Atlassian API
curl -H "Authorization: Bearer ATATT3xFfGF02swkEiBKNEe79myUANEL9IgG8eer9ARP4S6ggC5m7Spf7ZHzHVx8fYduyFlBsJVGiEsNOdsMY3o4QKOV2i96VH1sw6jEIhlT8y7k_jJECuL4qdoWYlrqKsR59cuf2lyz1Ww61JrwflKQ452vQ43MwEuDmLa4DlXBD7xX-X6Dq4Y=650A2C39" \
     "https://api.atlassian.com/me"
```

### **Test 3: MCP Server Tools**
After restart, test these MCP tools:
- `mcp_atlassian-mcp-server_atlassian_list_projects`
- `mcp_atlassian-mcp-server_atlassian_get_issue`
- `mcp_stash-mcp-server_list_repositories`

## 🔍 **Step 3: MCP Server Verification**

### **Expected MCP Servers (18 total):**

| Server | Type | Status | Test Command |
|--------|------|--------|--------------|
| playwright | External | ✅ | `mcp_playwright_browser_navigate` |
| google-admin | Local | ✅ | `mcp_google-admin_list_users` |
| figma | Local | ✅ | `mcp_figma_get_file` |
| design-tokens | Local | ✅ | `mcp_design-tokens_get_tokens` |
| tailwind | Local | ✅ | `mcp_tailwind_generate_classes` |
| components | Local | ✅ | `mcp_components_list_components` |
| icons | Local | ✅ | `mcp_icons_search_icons` |
| gmail | Local | ✅ | `mcp_gmail_send_email` |
| google-sheets | Local | ✅ | `mcp_google-sheets_read_sheet` |
| slack | Local | ✅ | `mcp_slack_send_message` |
| notion | Local | ✅ | `mcp_notion_search_pages` |
| github | Local | ✅ | `mcp_github_list_repositories` |
| perplexity | Local | ✅ | `mcp_perplexity_search` |
| firecrawl | Local | ✅ | `mcp_firecrawl_scrape` |
| byterover-mcp | Remote | ✅ | `mcp_byterover-mcp_byterover-retrieve-knowledge` |
| atlassian-mcp-server | Remote | ✅ | `mcp_atlassian-mcp-server_atlassian_list_projects` |
| stash-mcp-server | Local | ✅ | `mcp_stash-mcp-server_list_repositories` |
| **genspark-mcp-server** | **Local** | **✅** | **`mcp_genspark-mcp-server_browse_system`** |

## 🚀 **Step 4: Test Execution Plan**

### **Phase 1: Basic Connectivity**
1. Test Atlassian domain accessibility
2. Verify API token authentication
3. Check MCP server loading

### **Phase 2: Atlassian Integration**
1. List Jira projects
2. Create a test issue
3. Access Confluence pages
4. Test Stash/Bitbucket integration

### **Phase 3: MCP Server Functionality**
1. Test each MCP server individually
2. Verify environment variable loading
3. Check error handling and logging

## 📋 **Step 5: Expected Results**

### **Successful Atlassian Integration:**
- ✅ API token authentication works
- ✅ Can access Jira projects
- ✅ Can create/read issues
- ✅ Can access Confluence content

### **Successful MCP Server Loading:**
- ✅ All 18 servers show as available tools
- ✅ Environment variables loaded correctly
- ✅ No startup errors in logs

## 🔧 **Troubleshooting**

### **If MCP Servers Don't Load:**
1. Check Cursor logs for errors
2. Verify environment variables in master.env
3. Check file paths in mcp.json
4. Restart Cursor again

### **If Atlassian Integration Fails:**
1. Verify API token is correct
2. Check token expiration (expires Sep 24, 2025)
3. Verify domain accessibility
4. Check network connectivity

## 📊 **Current Configuration Status**

### **✅ Completed:**
- Atlassian API token created
- master.env updated with actual credentials
- All 18 MCP servers configured
- Genspark MCP server created and configured

### **⏳ Pending:**
- Cursor restart to load MCP servers
- Atlassian integration testing
- MCP server functionality verification

## 🎯 **Next Steps After Restart**

1. **Verify MCP servers loaded** (check available tools)
2. **Test Atlassian integration** (list projects, create issues)
3. **Test Stash configuration** (list repositories)
4. **Verify all MCP servers** (test each one)
5. **Document results** (create test report)

---
*Test plan created: 2025-01-15*
*Status: Ready for Cursor restart and testing*





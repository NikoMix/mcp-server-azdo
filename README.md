# Azure DevOps MCP Server

MCP Server for the Azure DevOps Services API, enabling file operations, repository management, search functionality, and more.

### Features

- **Automatic Branch Creation**: When creating/updating files or pushing changes, branches are automatically created if they don't exist
- **Comprehensive Error Handling**: Clear error messages for common issues
- **Git History Preservation**: Operations maintain proper Git history without force pushing
- **Batch Operations**: Support for both single-file and multi-file operations
- **Advanced Search**: Support for searching code, work items, pull requests, and users

## Tools

1. `create_or_update_file`
   - Create or update a single file in a repository
   - Inputs:
     - `project` (string): Azure DevOps project name
     - `repo` (string): Repository name
     - `path` (string): Path where to create/update the file
     - `content` (string): Content of the file
     - `message` (string): Commit message
     - `branch` (string): Branch to create/update the file in
     - `sha` (optional string): SHA of file being replaced (for updates)
   - Returns: File content and commit details

2. `push_files`
   - Push multiple files in a single commit
   - Inputs:
     - `project` (string): Azure DevOps project name
     - `repo` (string): Repository name
     - `branch` (string): Branch to push to
     - `files` (array): Files to push, each with `path` and `content`
     - `message` (string): Commit message
   - Returns: Updated branch reference

3. `search_repositories`
   - Search for Azure DevOps repositories
   - Inputs:
     - `query` (string): Search query
     - `page` (optional number): Page number for pagination
     - `perPage` (optional number): Results per page (max 100)
   - Returns: Repository search results

4. `create_repository`
   - Create a new Azure DevOps repository
   - Inputs:
     - `project` (string): Azure DevOps project name
     - `name` (string): Repository name
     - `description` (optional string): Repository description
     - `defaultBranch` (optional string): Default branch name
   - Returns: Created repository details

5. `get_file_contents`
   - Get contents of a file or directory
   - Inputs:
     - `project` (string): Azure DevOps project name
     - `repo` (string): Repository name
     - `path` (string): Path to file/directory
     - `branch` (optional string): Branch to get contents from
   - Returns: File/directory contents

6. `create_work_item`
   - Create a new work item (issue, task, etc.)
   - Inputs:
     - `project` (string): Azure DevOps project name
     - `type` (string): Work item type (e.g., `Bug`, `Task`)
     - `fields` (object): Fields for the work item (e.g., `System.Title`, `System.Description`)
   - Returns: Created work item details

7. `create_pull_request`
   - Create a new pull request
   - Inputs:
     - `project` (string): Azure DevOps project name
     - `repo` (string): Repository name
     - `title` (string): PR title
     - `description` (optional string): PR description
     - `sourceBranch` (string): Branch containing changes
     - `targetBranch` (string): Branch to merge into
     - `reviewers` (optional array): List of reviewers
   - Returns: Created pull request details

8. `list_dashboards`
   - List dashboards in a project
   - Inputs:
     - `project` (string): Azure DevOps project name
   - Returns: Array of dashboard details

9. `list_queries`
   - List queries in a project
   - Inputs:
     - `project` (string): Azure DevOps project name
   - Returns: Array of query details

10. `list_test_cases`
    - List test cases in a project
    - Inputs:
      - `project` (string): Azure DevOps project name
      - `planId` (optional number): Test plan ID to filter test cases
    - Returns: Array of test case details

11. `list_test_plans`
    - List test plans in a project
    - Inputs:
      - `project` (string): Azure DevOps project name
    - Returns: Array of test plan details

12. `list_artifacts`
    - List artifacts in a project
    - Inputs:
      - `project` (string): Azure DevOps project name
    - Returns: Array of artifact details

13. `list_projects`
    - List all projects in the organization
    - Inputs: none
    - Returns: Array of project details

14. `get_project`
    - Get details of a specific project
    - Inputs:
      - `id` (string): Project ID or name
    - Returns: Project details

15. `create_project`
    - Create a new project
    - Inputs:
      - `name` (string): Project name
      - `description` (optional string): Project description
      - `visibility` (string): `private` or `public`
      - `processTemplateId` (string): ID of the process template
    - Returns: Created project details

16. `update_project`
    - Update an existing project
    - Inputs:
      - `id` (string): Project ID
      - `name` (optional string): New name
      - `description` (optional string): New description
      - `visibility` (optional string): `private` or `public`
    - Returns: Updated project details

17. `delete_project`
    - Delete a project
    - Inputs:
      - `id` (string): Project ID
    - Returns: Success status

18. `list_process_templates`
    - List all process templates
    - Inputs: none
    - Returns: Array of process template details

19. `get_process_template`
    - Get details of a process template
    - Inputs:
      - `id` (string): Process template ID
    - Returns: Process template details

20. `list_iterations`
    - List all iterations in a project
    - Inputs:
      - `project` (string): Project name or ID
    - Returns: Array of iteration details

21. `get_iteration`
    - Get details of a specific iteration
    - Inputs:
      - `project` (string): Project name or ID
      - `id` (string): Iteration ID
    - Returns: Iteration details

22. `create_iteration`
    - Create a new iteration in a project
    - Inputs:
      - `project` (string): Project name or ID
      - `name` (string): Iteration name
      - `startDate` (optional string): Start date
      - `finishDate` (optional string): Finish date
      - `path` (optional string): Path for the iteration
    - Returns: Created iteration details

23. `update_iteration`
    - Update an iteration
    - Inputs:
      - `project` (string): Project name or ID
      - `id` (string): Iteration ID
      - `name` (optional string): New name
      - `startDate` (optional string): New start date
      - `finishDate` (optional string): New finish date
    - Returns: Updated iteration details

24. `delete_iteration`
    - Delete an iteration
    - Inputs:
      - `project` (string): Project name or ID
      - `id` (string): Iteration ID
    - Returns: Success status

25. `list_areas`
    - List all areas in a project
    - Inputs:
      - `project` (string): Project name or ID
    - Returns: Array of area details

26. `get_area`
    - Get details of a specific area
    - Inputs:
      - `project` (string): Project name or ID
      - `id` (string): Area ID
    - Returns: Area details

27. `create_area`
    - Create a new area in a project
    - Inputs:
      - `project` (string): Project name or ID
      - `name` (string): Area name
      - `path` (optional string): Path for the area
    - Returns: Created area details

28. `update_area`
    - Update an area
    - Inputs:
      - `project` (string): Project name or ID
      - `id` (string): Area ID
      - `name` (optional string): New name
      - `path` (optional string): New path
    - Returns: Updated area details

29. `delete_area`
    - Delete an area
    - Inputs:
      - `project` (string): Project name or ID
      - `id` (string): Area ID
    - Returns: Success status

## Setup

### Personal Access Token
[Create an Azure DevOps Personal Access Token](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate) with appropriate permissions:
   - Go to [Personal access tokens](https://dev.azure.com/yourorganization/_usersSettings/tokens) (in Azure DevOps Settings > Personal Access Tokens)
   - Select the required scopes (e.g., `Code`, `Work Items`, `Test Management`)
   - Copy the generated token

### Usage with Claude Desktop
To use this with Claude Desktop, add the following to your `claude_desktop_config.json`:

#### Docker
```json
{
  "mcpServers": {
    "azure-devops": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "AZURE_DEVOPS_PERSONAL_ACCESS_TOKEN",
        "mcp/azure-devops"
      ],
      "env": {
        "AZURE_DEVOPS_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

### NPX

```json
{
  "mcpServers": {
    "azure-devops": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-azure-devops"
      ],
      "env": {
        "AZURE_DEVOPS_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

## Build

Docker build:

```bash
docker build -t mcp/azure-devops -f src/azure-devops/Dockerfile .
```

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.

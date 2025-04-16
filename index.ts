#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import * as repository from './operations/repository.js';
import * as files from './operations/files.js';
import * as issues from './operations/workitems.js';
import * as pulls from './operations/pulls.js';
import * as branches from './operations/branches.js';
import * as search from './operations/search.js';
import * as commits from './operations/commits.js';

import { VERSION } from "./common/version.js";

const server = new Server(
  {
    name: "azdo-mcp-server",
    version: VERSION,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

function formatAzdoError(error: any): string {
  // Placeholder for future Azdo-specific error handling
  return `Azure DevOps API Error: ${error.message || error}`;
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Artifacts (placeholder, as artifacts.ts is empty)
      // Branches
      {
        name: "create_azdo_branch",
        description: "Create a new branch in an Azure DevOps repository",
        inputSchema: zodToJsonSchema(branches.CreateAzdoBranchSchema),
      },
      // Commits
      {
        name: "list_azdo_commits",
        description: "List commits in an Azure DevOps repository branch",
        inputSchema: zodToJsonSchema(commits.ListAzdoCommitsSchema),
      },
      // Dashboards
      {
        name: "list_dashboards",
        description: "List dashboards in an Azure DevOps project",
        inputSchema: zodToJsonSchema(require('./operations/dashboards.js').ListDashboardsSchema),
      },
      {
        name: "get_dashboard",
        description: "Get a specific dashboard in an Azure DevOps project",
        inputSchema: zodToJsonSchema(require('./operations/dashboards.js').GetDashboardSchema),
      },
      {
        name: "create_dashboard",
        description: "Create a dashboard in an Azure DevOps project",
        inputSchema: zodToJsonSchema(require('./operations/dashboards.js').CreateDashboardSchema),
      },
      {
        name: "update_dashboard",
        description: "Update a dashboard in an Azure DevOps project",
        inputSchema: zodToJsonSchema(require('./operations/dashboards.js').UpdateDashboardSchema),
      },
      {
        name: "delete_dashboard",
        description: "Delete a dashboard in an Azure DevOps project",
        inputSchema: zodToJsonSchema(require('./operations/dashboards.js').DeleteDashboardSchema),
      },
      // Files
      {
        name: "get_azdo_file_contents",
        description: "Get the contents of a file or directory from an Azure DevOps repository",
        inputSchema: zodToJsonSchema(files.GetAzdoFileContentsSchema),
      },
      {
        name: "create_or_update_azdo_file",
        description: "Create or update a single file in an Azure DevOps repository",
        inputSchema: zodToJsonSchema(files.CreateOrUpdateAzdoFileSchema),
      },
      {
        name: "push_azdo_files",
        description: "Push multiple files to an Azure DevOps repository in a single commit",
        inputSchema: zodToJsonSchema(files.PushAzdoFilesSchema),
      },
      // Projects
      {
        name: "list_projects",
        description: "List Azure DevOps projects",
        inputSchema: zodToJsonSchema(require('./operations/projects.js').ListProjectsSchema),
      },
      {
        name: "get_project",
        description: "Get an Azure DevOps project by ID",
        inputSchema: zodToJsonSchema(require('./operations/projects.js').GetProjectSchema),
      },
      {
        name: "create_project",
        description: "Create a new Azure DevOps project",
        inputSchema: zodToJsonSchema(require('./operations/projects.js').CreateProjectSchema),
      },
      {
        name: "update_project",
        description: "Update an Azure DevOps project",
        inputSchema: zodToJsonSchema(require('./operations/projects.js').UpdateProjectSchema),
      },
      {
        name: "delete_project",
        description: "Delete an Azure DevOps project",
        inputSchema: zodToJsonSchema(require('./operations/projects.js').DeleteProjectSchema),
      },
      // Process templates
      {
        name: "list_process_templates",
        description: "List process templates in Azure DevOps",
        inputSchema: zodToJsonSchema(require('./operations/projects.js').ListProcessTemplatesSchema),
      },
      {
        name: "get_process_template",
        description: "Get a process template by ID in Azure DevOps",
        inputSchema: zodToJsonSchema(require('./operations/projects.js').GetProcessTemplateSchema),
      },
      // Iterations
      {
        name: "list_iterations",
        description: "List iterations in an Azure DevOps project",
        inputSchema: zodToJsonSchema(require('./operations/projects.js').ListIterationsSchema),
      },
      {
        name: "get_iteration",
        description: "Get an iteration by ID in Azure DevOps",
        inputSchema: zodToJsonSchema(require('./operations/projects.js').GetIterationSchema),
      },
      {
        name: "create_iteration",
        description: "Create an iteration in an Azure DevOps project",
        inputSchema: zodToJsonSchema(require('./operations/projects.js').CreateIterationSchema),
      },
      {
        name: "update_iteration",
        description: "Update an iteration in an Azure DevOps project",
        inputSchema: zodToJsonSchema(require('./operations/projects.js').UpdateIterationSchema),
      },
      {
        name: "delete_iteration",
        description: "Delete an iteration in an Azure DevOps project",
        inputSchema: zodToJsonSchema(require('./operations/projects.js').DeleteIterationSchema),
      },
      // Areas
      {
        name: "list_areas",
        description: "List areas in an Azure DevOps project",
        inputSchema: zodToJsonSchema(require('./operations/projects.js').ListAreasSchema),
      },
      {
        name: "get_area",
        description: "Get an area by ID in Azure DevOps",
        inputSchema: zodToJsonSchema(require('./operations/projects.js').GetAreaSchema),
      },
      {
        name: "create_area",
        description: "Create an area in an Azure DevOps project",
        inputSchema: zodToJsonSchema(require('./operations/projects.js').CreateAreaSchema),
      },
      {
        name: "update_area",
        description: "Update an area in an Azure DevOps project",
        inputSchema: zodToJsonSchema(require('./operations/projects.js').UpdateAreaSchema),
      },
      {
        name: "delete_area",
        description: "Delete an area in an Azure DevOps project",
        inputSchema: zodToJsonSchema(require('./operations/projects.js').DeleteAreaSchema),
      },
      // Pull Requests
      {
        name: "create_azdo_pull_request",
        description: "Create a new pull request in an Azure DevOps repository",
        inputSchema: zodToJsonSchema(pulls.CreateAzdoPullRequestSchema),
      },
      {
        name: "get_azdo_pull_request",
        description: "Get details of a specific pull request in Azure DevOps",
        inputSchema: zodToJsonSchema(pulls.GetAzdoPullRequestSchema),
      },
      {
        name: "list_azdo_pull_requests",
        description: "List and filter pull requests in an Azure DevOps repository",
        inputSchema: zodToJsonSchema(pulls.ListAzdoPullRequestsSchema),
      },
      {
        name: "merge_azdo_pull_request",
        description: "Merge (complete/abandon) a pull request in Azure DevOps",
        inputSchema: zodToJsonSchema(pulls.MergeAzdoPullRequestSchema),
      },
      {
        name: "get_azdo_pull_request_files",
        description: "Get the list of files changed in a pull request in Azure DevOps",
        inputSchema: zodToJsonSchema(pulls.GetAzdoPullRequestFilesSchema),
      },
      {
        name: "get_azdo_pull_request_comments",
        description: "Get the review comments on a pull request in Azure DevOps",
        inputSchema: zodToJsonSchema(pulls.GetAzdoPullRequestCommentsSchema),
      },
      // Repositories
      {
        name: "create_azdo_repository",
        description: "Create a new Azure DevOps repository",
        inputSchema: zodToJsonSchema(repository.CreateAzdoRepositoryOptionsSchema),
      },
      {
        name: "search_azdo_repositories",
        description: "Search for Azure DevOps repositories",
        inputSchema: zodToJsonSchema(repository.SearchAzdoRepositoriesSchema),
      },
      // Search (these are still GitHub search endpoints, but included for completeness)
      {
        name: "search_code",
        description: "Search for code (GitHub API)",
        inputSchema: zodToJsonSchema(search.SearchCodeSchema),
      },
      {
        name: "search_issues",
        description: "Search for issues and pull requests (GitHub API)",
        inputSchema: zodToJsonSchema(search.SearchIssuesSchema),
      },
      {
        name: "search_users",
        description: "Search for users (GitHub API)",
        inputSchema: zodToJsonSchema(search.SearchUsersSchema),
      },
      // Work Items (Issues)
      {
        name: "get_work_item",
        description: "Get a work item by ID in Azure DevOps",
        inputSchema: zodToJsonSchema(issues.GetWorkItemSchema),
      },
      {
        name: "create_work_item",
        description: "Create a new work item in Azure DevOps",
        inputSchema: zodToJsonSchema(issues.CreateWorkItemOptionsSchema),
      },
      {
        name: "update_work_item",
        description: "Update a work item in Azure DevOps",
        inputSchema: zodToJsonSchema(issues.UpdateWorkItemOptionsSchema),
      },
      {
        name: "list_work_items",
        description: "List work items in an Azure DevOps project",
        inputSchema: zodToJsonSchema(z.object({ project: z.string() })),
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (!request.params.arguments) {
      throw new Error("Arguments are required");
    }
    switch (request.params.name) {
      // Branches
      case "create_azdo_branch": {
        const args = branches.CreateAzdoBranchSchema.parse(request.params.arguments);
        const result = await branches.createAzdoBranchFromRef(
          args.organization,
          args.project,
          args.repositoryId,
          args.branch,
          args.fromBranch
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      // Commits
      case "list_azdo_commits": {
        const args = commits.ListAzdoCommitsSchema.parse(request.params.arguments);
        const result = await commits.listAzdoCommits(
          args.organization,
          args.project,
          args.repositoryId,
          args.branch,
          args.top,
          args.skip
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      // Dashboards
      case "list_dashboards": {
        const args = require('./operations/dashboards.js').ListDashboardsSchema.parse(request.params.arguments);
        const result = await require('./operations/dashboards.js').listDashboards(args.project);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "get_dashboard": {
        const args = require('./operations/dashboards.js').GetDashboardSchema.parse(request.params.arguments);
        const result = await require('./operations/dashboards.js').getDashboard(args.project, args.dashboardId);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "create_dashboard": {
        const args = require('./operations/dashboards.js').CreateDashboardSchema.parse(request.params.arguments);
        const result = await require('./operations/dashboards.js').createDashboard(args.project, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "update_dashboard": {
        const args = require('./operations/dashboards.js').UpdateDashboardSchema.parse(request.params.arguments);
        const result = await require('./operations/dashboards.js').updateDashboard(args.project, args.dashboardId, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "delete_dashboard": {
        const args = require('./operations/dashboards.js').DeleteDashboardSchema.parse(request.params.arguments);
        const result = await require('./operations/dashboards.js').deleteDashboard(args.project, args.dashboardId);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      // Files
      case "get_azdo_file_contents": {
        const args = files.GetAzdoFileContentsSchema.parse(request.params.arguments);
        const result = await files.getAzdoFileContents(
          args.organization,
          args.project,
          args.repositoryId,
          args.path,
          args.branch
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "create_or_update_azdo_file": {
        const args = files.CreateOrUpdateAzdoFileSchema.parse(request.params.arguments);
        const result = await files.createOrUpdateAzdoFile(
          args.organization,
          args.project,
          args.repositoryId,
          args.path,
          args.content,
          args.message,
          args.branch
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "push_azdo_files": {
        const args = files.PushAzdoFilesSchema.parse(request.params.arguments);
        const result = await files.pushAzdoFiles(
          args.organization,
          args.project,
          args.repositoryId,
          args.branch,
          args.files,
          args.message
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      // Projects
      case "list_projects": {
        await require('./operations/projects.js').ListProjectsSchema.parse(request.params.arguments);
        const result = await require('./operations/projects.js').listProjects();
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "get_project": {
        const args = require('./operations/projects.js').GetProjectSchema.parse(request.params.arguments);
        const result = await require('./operations/projects.js').getProject(args.id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "create_project": {
        const args = require('./operations/projects.js').CreateProjectSchema.parse(request.params.arguments);
        const result = await require('./operations/projects.js').createProject(args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "update_project": {
        const args = require('./operations/projects.js').UpdateProjectSchema.parse(request.params.arguments);
        const result = await require('./operations/projects.js').updateProject(args.id, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "delete_project": {
        const args = require('./operations/projects.js').DeleteProjectSchema.parse(request.params.arguments);
        const result = await require('./operations/projects.js').deleteProject(args.id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      // Process templates
      case "list_process_templates": {
        await require('./operations/projects.js').ListProcessTemplatesSchema.parse(request.params.arguments);
        const result = await require('./operations/projects.js').listProcessTemplates();
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "get_process_template": {
        const args = require('./operations/projects.js').GetProcessTemplateSchema.parse(request.params.arguments);
        const result = await require('./operations/projects.js').getProcessTemplate(args.id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      // Iterations
      case "list_iterations": {
        const args = require('./operations/projects.js').ListIterationsSchema.parse(request.params.arguments);
        const result = await require('./operations/projects.js').listIterations(args.project);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "get_iteration": {
        const args = require('./operations/projects.js').GetIterationSchema.parse(request.params.arguments);
        const result = await require('./operations/projects.js').getIteration(args.project, args.id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "create_iteration": {
        const args = require('./operations/projects.js').CreateIterationSchema.parse(request.params.arguments);
        const result = await require('./operations/projects.js').createIteration(args.project, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "update_iteration": {
        const args = require('./operations/projects.js').UpdateIterationSchema.parse(request.params.arguments);
        const result = await require('./operations/projects.js').updateIteration(args.project, args.id, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "delete_iteration": {
        const args = require('./operations/projects.js').DeleteIterationSchema.parse(request.params.arguments);
        const result = await require('./operations/projects.js').deleteIteration(args.project, args.id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      // Areas
      case "list_areas": {
        const args = require('./operations/projects.js').ListAreasSchema.parse(request.params.arguments);
        const result = await require('./operations/projects.js').listAreas(args.project);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "get_area": {
        const args = require('./operations/projects.js').GetAreaSchema.parse(request.params.arguments);
        const result = await require('./operations/projects.js').getArea(args.project, args.id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "create_area": {
        const args = require('./operations/projects.js').CreateAreaSchema.parse(request.params.arguments);
        const result = await require('./operations/projects.js').createArea(args.project, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "update_area": {
        const args = require('./operations/projects.js').UpdateAreaSchema.parse(request.params.arguments);
        const result = await require('./operations/projects.js').updateArea(args.project, args.id, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "delete_area": {
        const args = require('./operations/projects.js').DeleteAreaSchema.parse(request.params.arguments);
        const result = await require('./operations/projects.js').deleteArea(args.project, args.id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      // Pull Requests
      case "create_azdo_pull_request": {
        const args = pulls.CreateAzdoPullRequestSchema.parse(request.params.arguments);
        const result = await pulls.createAzdoPullRequest(args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "get_azdo_pull_request": {
        const args = pulls.GetAzdoPullRequestSchema.parse(request.params.arguments);
        const result = await pulls.getAzdoPullRequest(
          args.organization,
          args.project,
          args.repositoryId,
          args.pullRequestId
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "list_azdo_pull_requests": {
        const args = pulls.ListAzdoPullRequestsSchema.parse(request.params.arguments);
        const { organization, project, repositoryId, ...options } = args;
        const result = await pulls.listAzdoPullRequests(organization, project, repositoryId, options);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "merge_azdo_pull_request": {
        const args = pulls.MergeAzdoPullRequestSchema.parse(request.params.arguments);
        const { organization, project, repositoryId, pullRequestId, ...options } = args;
        const result = await pulls.mergeAzdoPullRequest(organization, project, repositoryId, pullRequestId, options);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "get_azdo_pull_request_files": {
        const args = pulls.GetAzdoPullRequestFilesSchema.parse(request.params.arguments);
        const result = await pulls.getAzdoPullRequestFiles(
          args.organization,
          args.project,
          args.repositoryId,
          args.pullRequestId
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "get_azdo_pull_request_comments": {
        const args = pulls.GetAzdoPullRequestCommentsSchema.parse(request.params.arguments);
        const result = await pulls.getAzdoPullRequestComments(
          args.organization,
          args.project,
          args.repositoryId,
          args.pullRequestId
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      // Repositories
      case "create_azdo_repository": {
        const args = repository.CreateAzdoRepositoryOptionsSchema.parse(request.params.arguments);
        const result = await repository.createAzdoRepository(args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "search_azdo_repositories": {
        const args = repository.SearchAzdoRepositoriesSchema.parse(request.params.arguments);
        const result = await repository.searchAzdoRepositories(
          args.organization,
          args.project,
          args.query
        );
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      // Search (GitHub API)
      case "search_code": {
        const args = search.SearchCodeSchema.parse(request.params.arguments);
        const result = await search.searchCode(args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "search_issues": {
        const args = search.SearchIssuesSchema.parse(request.params.arguments);
        const result = await search.searchIssues(args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "search_users": {
        const args = search.SearchUsersSchema.parse(request.params.arguments);
        const result = await search.searchUsers(args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      // Work Items
      case "get_work_item": {
        const args = issues.GetWorkItemSchema.parse(request.params.arguments);
        const result = await issues.getWorkItem(args.id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "create_work_item": {
        // Expect project as a separate argument
        const rawArgs = issues.CreateWorkItemOptionsSchema.extend({ project: z.string() }).parse(request.params.arguments);
        const { project, ...options } = rawArgs;
        const result = await issues.createWorkItem(project, options);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "update_work_item": {
        const args = issues.UpdateWorkItemOptionsSchema.parse(request.params.arguments);
        const result = await issues.updateWorkItem(args.id, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "list_work_items": {
        const args = z.object({ project: z.string() }).parse(request.params.arguments);
        const result = await issues.listWorkItems(args.project);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    throw new Error(formatAzdoError(error));
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Azure DevOps MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
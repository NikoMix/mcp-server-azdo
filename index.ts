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
import * as dashboards from './operations/dashboards.js';
import * as projects from './operations/projects.js';
import * as artifacts from './operations/artifacts.js';

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
      // Artifacts
      {
        name: "list_artifact_feeds",
        description: "List Azure DevOps artifact feeds in an organization",
        inputSchema: zodToJsonSchema(artifacts.ListArtifactFeedsSchema),
      },
      {
        name: "get_artifact_feed",
        description: "Get a specific Azure DevOps artifact feed",
        inputSchema: zodToJsonSchema(artifacts.GetArtifactFeedSchema),
      },
      {
        name: "create_artifact_feed",
        description: "Create a new Azure DevOps artifact feed",
        inputSchema: zodToJsonSchema(artifacts.CreateArtifactFeedSchema),
      },
      {
        name: "update_artifact_feed",
        description: "Update an Azure DevOps artifact feed",
        inputSchema: zodToJsonSchema(artifacts.UpdateArtifactFeedSchema),
      },
      {
        name: "delete_artifact_feed",
        description: "Delete an Azure DevOps artifact feed",
        inputSchema: zodToJsonSchema(artifacts.DeleteArtifactFeedSchema),
      },
      {
        name: "list_artifact_packages",
        description: "List packages in an Azure DevOps artifact feed",
        inputSchema: zodToJsonSchema(artifacts.ListArtifactPackagesSchema),
      },
      {
        name: "get_artifact_package",
        description: "Get a specific package in an Azure DevOps artifact feed",
        inputSchema: zodToJsonSchema(artifacts.GetArtifactPackageSchema),
      },
      {
        name: "delete_artifact_package",
        description: "Delete a package from an Azure DevOps artifact feed",
        inputSchema: zodToJsonSchema(artifacts.DeleteArtifactPackageSchema),
      },
      {
        name: "list_artifact_views",
        description: "List views in an Azure DevOps artifact feed",
        inputSchema: zodToJsonSchema(artifacts.ListArtifactViewsSchema),
      },
      {
        name: "get_artifact_view",
        description: "Get a specific view in an Azure DevOps artifact feed",
        inputSchema: zodToJsonSchema(artifacts.GetArtifactViewSchema),
      },
      {
        name: "create_artifact_view",
        description: "Create a new view in an Azure DevOps artifact feed",
        inputSchema: zodToJsonSchema(artifacts.CreateArtifactViewSchema),
      },
      {
        name: "update_artifact_view",
        description: "Update a view in an Azure DevOps artifact feed",
        inputSchema: zodToJsonSchema(artifacts.UpdateArtifactViewSchema),
      },
      {
        name: "delete_artifact_view",
        description: "Delete a view from an Azure DevOps artifact feed",
        inputSchema: zodToJsonSchema(artifacts.DeleteArtifactViewSchema),
      },
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
        inputSchema: zodToJsonSchema(dashboards.ListDashboardsSchema),
      },
      {
        name: "get_dashboard",
        description: "Get a specific dashboard in an Azure DevOps project",
        inputSchema: zodToJsonSchema(dashboards.GetDashboardSchema),
      },
      {
        name: "create_dashboard",
        description: "Create a dashboard in an Azure DevOps project",
        inputSchema: zodToJsonSchema(dashboards.CreateDashboardSchema),
      },
      {
        name: "update_dashboard",
        description: "Update a dashboard in an Azure DevOps project",
        inputSchema: zodToJsonSchema(dashboards.UpdateDashboardSchema),
      },
      {
        name: "delete_dashboard",
        description: "Delete a dashboard in an Azure DevOps project",
        inputSchema: zodToJsonSchema(dashboards.DeleteDashboardSchema),
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
        inputSchema: zodToJsonSchema(projects.ListProjectsSchema),
      },
      {
        name: "get_project",
        description: "Get an Azure DevOps project by ID",
        inputSchema: zodToJsonSchema(projects.GetProjectSchema),
      },
      {
        name: "create_project",
        description: "Create a new Azure DevOps project",
        inputSchema: zodToJsonSchema(projects.CreateProjectSchema),
      },
      {
        name: "update_project",
        description: "Update an Azure DevOps project",
        inputSchema: zodToJsonSchema(projects.UpdateProjectSchema),
      },
      {
        name: "delete_project",
        description: "Delete an Azure DevOps project",
        inputSchema: zodToJsonSchema(projects.DeleteProjectSchema),
      },
      // Process templates
      {
        name: "list_process_templates",
        description: "List process templates in Azure DevOps",
        inputSchema: zodToJsonSchema(projects.ListProcessTemplatesSchema),
      },
      {
        name: "get_process_template",
        description: "Get a process template by ID in Azure DevOps",
        inputSchema: zodToJsonSchema(projects.GetProcessTemplateSchema),
      },
      // Iterations
      {
        name: "list_iterations",
        description: "List iterations in an Azure DevOps project",
        inputSchema: zodToJsonSchema(projects.ListIterationsSchema),
      },
      {
        name: "get_iteration",
        description: "Get an iteration by ID in Azure DevOps",
        inputSchema: zodToJsonSchema(projects.GetIterationSchema),
      },
      {
        name: "create_iteration",
        description: "Create an iteration in an Azure DevOps project",
        inputSchema: zodToJsonSchema(projects.CreateIterationSchema),
      },
      {
        name: "update_iteration",
        description: "Update an iteration in an Azure DevOps project",
        inputSchema: zodToJsonSchema(projects.UpdateIterationSchema),
      },
      {
        name: "delete_iteration",
        description: "Delete an iteration in an Azure DevOps project",
        inputSchema: zodToJsonSchema(projects.DeleteIterationSchema),
      },
      // Areas
      {
        name: "list_areas",
        description: "List areas in an Azure DevOps project",
        inputSchema: zodToJsonSchema(projects.ListAreasSchema),
      },
      {
        name: "get_area",
        description: "Get an area by ID in Azure DevOps",
        inputSchema: zodToJsonSchema(projects.GetAreaSchema),
      },
      {
        name: "create_area",
        description: "Create an area in an Azure DevOps project",
        inputSchema: zodToJsonSchema(projects.CreateAreaSchema),
      },
      {
        name: "update_area",
        description: "Update an area in an Azure DevOps project",
        inputSchema: zodToJsonSchema(projects.UpdateAreaSchema),
      },
      {
        name: "delete_area",
        description: "Delete an area in an Azure DevOps project",
        inputSchema: zodToJsonSchema(projects.DeleteAreaSchema),
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
      // Search (Azure DevOps)
      {
        name: "search_azdo_code",
        description: "Search for code in Azure DevOps repositories",
        inputSchema: zodToJsonSchema(search.AzdoCodeSearchSchema),
      },
      {
        name: "search_azdo_work_items",
        description: "Search for work items in Azure DevOps",
        inputSchema: zodToJsonSchema(search.AzdoWorkItemSearchSchema),
      },
      {
        name: "search_azdo_users",
        description: "Search for users in Azure DevOps",
        inputSchema: zodToJsonSchema(search.AzdoUserSearchSchema),
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
        inputSchema: zodToJsonSchema(issues.CreateWorkItemInputSchema),
      },
      {
        name: "update_work_item",
        description: "Update a work item in Azure DevOps",
        inputSchema: zodToJsonSchema(issues.UpdateWorkItemInputSchema),
      },
      {
        name: "list_work_items",
        description: "List work items in an Azure DevOps project",
        inputSchema: zodToJsonSchema(z.object({ organization: z.string(), project: z.string() })),
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request, _extra) => {
  try {
    if (!request.params.arguments) {
      throw new Error("Arguments are required");
    }
    switch (request.params.name) {
      // Artifacts
      case "list_artifact_feeds": {
        const args = artifacts.ListArtifactFeedsSchema.parse(request.params.arguments);
        const result = await artifacts.listArtifactFeeds(args.organization);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "get_artifact_feed": {
        const args = artifacts.GetArtifactFeedSchema.parse(request.params.arguments);
        const result = await artifacts.getArtifactFeed(args.organization, args.feedId);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "create_artifact_feed": {
        const args = artifacts.CreateArtifactFeedSchema.parse(request.params.arguments);
        const result = await artifacts.createArtifactFeed(args.organization, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "update_artifact_feed": {
        const args = artifacts.UpdateArtifactFeedSchema.parse(request.params.arguments);
        const result = await artifacts.updateArtifactFeed(args.organization, args.feedId, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "delete_artifact_feed": {
        const args = artifacts.DeleteArtifactFeedSchema.parse(request.params.arguments);
        await artifacts.deleteArtifactFeed(args.organization, args.feedId);
        return { content: [{ type: "text", text: JSON.stringify({ success: true }, null, 2) }] };
      }
      case "list_artifact_packages": {
        const args = artifacts.ListArtifactPackagesSchema.parse(request.params.arguments);
        const result = await artifacts.listArtifactPackages(args.organization, args.feedId);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "get_artifact_package": {
        const args = artifacts.GetArtifactPackageSchema.parse(request.params.arguments);
        const result = await artifacts.getArtifactPackage(args.organization, args.feedId, args.packageId);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "delete_artifact_package": {
        const args = artifacts.DeleteArtifactPackageSchema.parse(request.params.arguments);
        await artifacts.deleteArtifactPackage(args.organization, args.feedId, args.packageId);
        return { content: [{ type: "text", text: JSON.stringify({ success: true }, null, 2) }] };
      }
      case "list_artifact_views": {
        const args = artifacts.ListArtifactViewsSchema.parse(request.params.arguments);
        const result = await artifacts.listArtifactViews(args.organization, args.feedId);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "get_artifact_view": {
        const args = artifacts.GetArtifactViewSchema.parse(request.params.arguments);
        const result = await artifacts.getArtifactView(args.organization, args.feedId, args.viewId);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "create_artifact_view": {
        const args = artifacts.CreateArtifactViewSchema.parse(request.params.arguments);
        const result = await artifacts.createArtifactView(args.organization, args.feedId, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "update_artifact_view": {
        const args = artifacts.UpdateArtifactViewSchema.parse(request.params.arguments);
        const result = await artifacts.updateArtifactView(args.organization, args.feedId, args.viewId, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "delete_artifact_view": {
        const args = artifacts.DeleteArtifactViewSchema.parse(request.params.arguments);
        await artifacts.deleteArtifactView(args.organization, args.feedId, args.viewId);
        return { content: [{ type: "text", text: JSON.stringify({ success: true }, null, 2) }] };
      }
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
        const args = dashboards.ListDashboardsSchema.parse(request.params.arguments);
        const result = await dashboards.listDashboards(args.organization, args.project);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "get_dashboard": {
        const args = dashboards.GetDashboardSchema.parse(request.params.arguments);
        const result = await dashboards.getDashboard(args.organization, args.project, args.dashboardId);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "create_dashboard": {
        const args = dashboards.CreateDashboardSchema.parse(request.params.arguments);
        const result = await dashboards.createDashboard(args.organization, args.project, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "update_dashboard": {
        const args = dashboards.UpdateDashboardSchema.parse(request.params.arguments);
        const result = await dashboards.updateDashboard(args.organization, args.project, args.dashboardId, args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "delete_dashboard": {
        const args = dashboards.DeleteDashboardSchema.parse(request.params.arguments);
        const result = await dashboards.deleteDashboard(args.organization, args.project, args.dashboardId);
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
        const args = projects.ListProjectsSchema.parse(request.params.arguments);
        const result = await projects.listProjects(args.organization);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "get_project": {
        const args = projects.GetProjectSchema.parse(request.params.arguments);
        const result = await projects.getProject(args.organization, args.id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "create_project": {
        const args = projects.CreateProjectSchema.extend({ organization: z.string() }).parse(request.params.arguments);
        const { organization, ...rest } = args;
        const result = await projects.createProject(organization, rest);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "update_project": {
        const args = projects.UpdateProjectSchema.extend({ organization: z.string() }).parse(request.params.arguments);
        const { organization, id, ...rest } = args;
        const result = await projects.updateProject(organization, id, { id, ...rest });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "delete_project": {
        const args = projects.DeleteProjectSchema.extend({ organization: z.string() }).parse(request.params.arguments);
        const { organization, id } = args;
        const result = await projects.deleteProject(organization, id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      // Process templates
      case "list_process_templates": {
        const args = projects.ListProcessTemplatesSchema.extend({ organization: z.string() }).parse(request.params.arguments);
        const result = await projects.listProcessTemplates(args.organization);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "get_process_template": {
        const args = projects.GetProcessTemplateSchema.parse(request.params.arguments);
        const result = await projects.getProcessTemplate(args.organization, args.id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      // Iterations
      case "list_iterations": {
        const args = projects.ListIterationsSchema.parse(request.params.arguments);
        const result = await projects.listIterations(args.organization, args.project);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "get_iteration": {
        const args = projects.GetIterationSchema.parse(request.params.arguments);
        const result = await projects.getIteration(args.organization, args.project, args.id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "create_iteration": {
        const args = projects.CreateIterationSchema.extend({ organization: z.string() }).parse(request.params.arguments);
        const { organization, project, ...rest } = args;
        const result = await projects.createIteration(organization, project, { project, ...rest });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "update_iteration": {
        const args = projects.UpdateIterationSchema.extend({ organization: z.string() }).parse(request.params.arguments);
        const { organization, project, id, ...rest } = args;
        const result = await projects.updateIteration(organization, project, id, { project, id, ...rest });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "delete_iteration": {
        const args = projects.DeleteIterationSchema.extend({ organization: z.string() }).parse(request.params.arguments);
        const { organization, project, id } = args;
        const result = await projects.deleteIteration(organization, project, id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      // Areas
      case "list_areas": {
        const args = projects.ListAreasSchema.extend({ organization: z.string() }).parse(request.params.arguments);
        const { organization, project } = args;
        const result = await projects.listAreas(organization, project);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "get_area": {
        const args = projects.GetAreaSchema.extend({ organization: z.string() }).parse(request.params.arguments);
        const { organization, project, id } = args;
        const result = await projects.getArea(organization, project, id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "create_area": {
        const args = projects.CreateAreaSchema.extend({ organization: z.string() }).parse(request.params.arguments);
        const { organization, project, ...rest } = args;
        const result = await projects.createArea(organization, project, { project, ...rest });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "update_area": {
        const args = projects.UpdateAreaSchema.extend({ organization: z.string() }).parse(request.params.arguments);
        const { organization, project, id, ...rest } = args;
        const result = await projects.updateArea(organization, project, id, { project, id, ...rest });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "delete_area": {
        const args = projects.DeleteAreaSchema.extend({ organization: z.string() }).parse(request.params.arguments);
        const { organization, project, id } = args;
        const result = await projects.deleteArea(organization, project, id);
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
      // Search (Azure DevOps)
      case "search_azdo_code": {
        const args = search.AzdoCodeSearchSchema.parse(request.params.arguments);
        const result = await search.searchCode(args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "search_azdo_work_items": {
        const args = search.AzdoWorkItemSearchSchema.parse(request.params.arguments);
        const result = await search.searchWorkItems(args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "search_azdo_users": {
        const args = search.AzdoUserSearchSchema.parse(request.params.arguments);
        const result = await search.searchUsers(args);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      // Work Items
      case "get_work_item": {
        const args = issues.GetWorkItemSchema.parse(request.params.arguments);
        const result = await issues.getWorkItem(args.organization, args.project, args.id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "create_work_item": {
        const args = issues.CreateWorkItemInputSchema.parse(request.params.arguments);
        const { organization, project, ...options } = args;
        const result = await issues.createWorkItem(organization, project, options);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "update_work_item": {
        const args = issues.UpdateWorkItemInputSchema.parse(request.params.arguments);
        const { organization, project, id, ...options } = args;
        const result = await issues.updateWorkItem(organization, project, id, options);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "list_work_items": {
        const args = z.object({ organization: z.string(), project: z.string() }).parse(request.params.arguments);
        const result = await issues.listWorkItems(args.organization, args.project);
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
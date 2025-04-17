import { z } from "zod";

// Base schemas for common types
export const AzdoAuthorSchema = z.object({
  displayName: z.string(),
  id: z.string(),
  uniqueName: z.string(),
  imageUrl: z.string(),
  url: z.string(),
});

export const AzdoOwnerSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  uniqueName: z.string(),
  url: z.string(),
  imageUrl: z.string(),
});

export const AzdoRepositorySchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  project: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
  }),
});

export const AzdoFileContentLinks = z.object({
  self: z.string(),
  Azdo: z.string().nullable(),
  html: z.string().nullable()
});

export const AzdoFileContentSchema = z.object({
  path: z.string(),
  content: z.string().optional(),
  contentMetadata: z.object({
    encoding: z.string(),
    contentType: z.string(),
  }).optional(),
  url: z.string(),
});

export const AzdoDirectoryContentSchema = z.object({
  type: z.string(),
  size: z.number(),
  name: z.string(),
  path: z.string(),
  sha: z.string(),
  url: z.string(),
  Azdo_url: z.string(),
  html_url: z.string(),
  download_url: z.string().nullable(),
});

export const AzdoContentSchema = z.union([
  AzdoFileContentSchema,
  z.array(AzdoDirectoryContentSchema),
]);

export const AzdoTreeEntrySchema = z.object({
  path: z.string(),
  mode: z.string(),
  type: z.string(),
  objectId: z.string(),
  gitObjectType: z.string(),
});

export const AzdoHubTreeSchema = z.object({
  treeId: z.string(),
  url: z.string(),
  entries: z.array(AzdoTreeEntrySchema),
});

export const AzdoHubCommitSchema = z.object({
  commitId: z.string(),
  author: AzdoAuthorSchema,
  committer: AzdoAuthorSchema,
  comment: z.string(),
  url: z.string(),
  changeCounts: z.object({
    Add: z.number(),
    Edit: z.number(),
    Delete: z.number(),
  }).optional(),
});

export const AzdoListCommitsSchema = z.array(z.object({
  sha: z.string(),
  node_id: z.string(),
  commit: z.object({
    author: AzdoAuthorSchema,
    committer: AzdoAuthorSchema,
    message: z.string(),
    tree: z.object({
      sha: z.string(),
      url: z.string()
    }),
    url: z.string(),
    comment_count: z.number(),
  }),
  url: z.string(),
  html_url: z.string(),
  comments_url: z.string()
}));

export const AzdoReferenceSchema = z.object({
  name: z.string(),
  objectId: z.string(),
  creator: AzdoAuthorSchema,
  url: z.string(),
});

// User and assignee schemas
export const AzdoIssueAssigneeSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  uniqueName: z.string(),
  imageUrl: z.string(),
  url: z.string(),
});

// Issue-related schemas
export const AzdoLabelSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().optional(),
  url: z.string(),
});

export const AzdoMilestoneSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  state: z.enum(["active", "completed", "notStarted"]),
  url: z.string(),
});

export const AzdoIssueSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  state: z.enum(["new", "active", "resolved", "closed", "removed"]),
  createdBy: AzdoIssueAssigneeSchema,
  createdDate: z.string(),
  url: z.string(),
});

// Search-related schemas
export const AzdoSearchResponseSchema = z.object({
  total_count: z.number(),
  incomplete_results: z.boolean(),
  items: z.array(AzdoRepositorySchema),
});

export const AzdoCodeSearchResultSchema = z.object({
  fileName: z.string(),
  path: z.string(),
  repository: AzdoRepositorySchema,
  project: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
  }),
  matches: z.array(z.object({
    line: z.number(),
    text: z.string(),
    offset: z.number(),
    length: z.number(),
  })).optional(),
  url: z.string().optional(),
});

export const AzdoCodeSearchResponseSchema = z.object({
  count: z.number(),
  results: z.array(AzdoCodeSearchResultSchema),
});

export const AzdoWorkItemSearchResultSchema = z.object({
  id: z.number(),
  fields: z.record(z.any()),
  url: z.string(),
});

export const AzdoWorkItemSearchResponseSchema = z.object({
  count: z.number(),
  results: z.array(AzdoWorkItemSearchResultSchema),
});

export const AzdoUserSearchResultSchema = z.object({
  principalName: z.string(),
  mailAddress: z.string().optional(),
  displayName: z.string(),
  originDirectory: z.string().optional(),
  originId: z.string().optional(),
  subjectKind: z.string().optional(),
  url: z.string().optional(),
});

export const AzdoUserSearchResponseSchema = z.object({
  count: z.number(),
  results: z.array(AzdoUserSearchResultSchema),
});

// Pull request schemas
export const AzdoPullRequestRefSchema = z.object({
  label: z.string(),
  ref: z.string(),
  sha: z.string(),
  user: AzdoIssueAssigneeSchema,
  repo: AzdoRepositorySchema,
});

export const AzdoPullRequestSchema = z.object({
  pullRequestId: z.number(),
  codeReviewId: z.number(),
  status: z.enum(["active", "completed", "abandoned", "notSet", "all"]),
  createdBy: AzdoIssueAssigneeSchema,
  creationDate: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  sourceRefName: z.string(),
  targetRefName: z.string(),
  mergeStatus: z.enum(["notSet", "queued", "conflicts", "succeeded", "rejected", "notApplicable"]),
  mergeId: z.string(),
  lastMergeSourceCommit: z.object({
    commitId: z.string(),
    url: z.string(),
  }),
  lastMergeTargetCommit: z.object({
    commitId: z.string(),
    url: z.string(),
  }),
  lastMergeCommit: z.object({
    commitId: z.string(),
    url: z.string(),
  }),
  reviewers: z.array(
    z.object({
      reviewerUrl: z.string(),
      vote: z.number(),
      hasDeclined: z.boolean(),
      isRequired: z.boolean(),
      displayName: z.string(),
      uniqueName: z.string(),
      id: z.string(),
      imageUrl: z.string(),
    })
  ),
  url: z.string(),
  supportsIterations: z.boolean(),
});

// Dashboard schemas
export const AzdoDashboardSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  widgets: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
      position: z.object({
        row: z.number(),
        column: z.number(),
      }),
      size: z.object({
        rowSpan: z.number(),
        columnSpan: z.number(),
      }),
    })
  ),
});

// Dashboard input schemas
export const ListDashboardsSchema = z.object({
  organization: z.string(),
  project: z.string(),
});
export const GetDashboardSchema = z.object({
  organization: z.string(),
  project: z.string(),
  dashboardId: z.string(),
});
export const CreateDashboardSchema = z.object({
  organization: z.string(),
  project: z.string(),
  name: z.string(),
  widgets: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      position: z.object({ row: z.number(), column: z.number() }),
      size: z.object({ rowSpan: z.number(), columnSpan: z.number() }),
    })
  ),
});
export const UpdateDashboardSchema = z.object({
  organization: z.string(),
  project: z.string(),
  dashboardId: z.string(),
  name: z.string().optional(),
  widgets: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        type: z.string(),
        position: z.object({ row: z.number(), column: z.number() }),
        size: z.object({ rowSpan: z.number(), columnSpan: z.number() }),
      })
    )
    .optional(),
});
export const DeleteDashboardSchema = z.object({
  organization: z.string(),
  project: z.string(),
  dashboardId: z.string(),
});

// Query schemas
export const AzdoQuerySchema = z.object({
  id: z.string(),
  name: z.string(),
  path: z.string(),
  wiql: z.string().optional(),
  isFolder: z.boolean(),
  url: z.string(),
});

// Test case schemas
export const AzdoTestCaseSchema = z.object({
  id: z.number(),
  name: z.string(),
  priority: z.number().optional(),
  automated: z.boolean(),
  state: z.string(),
  areaPath: z.string(),
  iterationPath: z.string(),
  url: z.string(),
});

// Test plan schemas
export const AzdoTestPlanSchema = z.object({
  id: z.number(),
  name: z.string(),
  areaPath: z.string(),
  iterationPath: z.string(),
  owner: AzdoIssueAssigneeSchema,
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  url: z.string(),
});

// Artifact schemas
export const AzdoArtifactSchema = z.object({
  id: z.string(),
  name: z.string(),
  resource: z.object({
    type: z.string(),
    data: z.string(),
    url: z.string(),
  }),
  createdBy: AzdoAuthorSchema,
  createdDate: z.string(),
  url: z.string(),
});

export const AzdoArtifactFeedSchema = z.object({
  id: z.string(),
  name: z.string(),
  fullyQualifiedName: z.string(),
  url: z.string(),
  description: z.string().optional(),
  badgesEnabled: z.boolean().optional(),
  defaultViewId: z.string().optional(),
  project: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
  }).optional(),
});

export const AzdoArtifactPackageSchema = z.object({
  id: z.string(),
  name: z.string(),
  protocolType: z.string(),
  versions: z.array(z.object({
    id: z.string(),
    version: z.string(),
    isLatest: z.boolean().optional(),
    isListed: z.boolean().optional(),
    views: z.array(z.string()).optional(),
  })).optional(),
  url: z.string(),
  description: z.string().optional(),
});

export const AzdoArtifactViewSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  type: z.string().optional(),
  description: z.string().optional(),
});

// Project schemas
export const AzdoProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  url: z.string(),
  state: z.enum(["wellFormed", "creating", "deleting", "new", "all"]),
  revision: z.number(),
  visibility: z.enum(["private", "public"]),
  lastUpdateTime: z.string(),
});

export const AzdoProcessTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  isDefault: z.boolean(),
  type: z.string(),
  url: z.string(),
});

export const AzdoIterationSchema = z.object({
  id: z.string(),
  name: z.string(),
  path: z.string(),
  attributes: z.object({
    startDate: z.string().optional(),
    finishDate: z.string().optional(),
    timeFrame: z.string().optional(),
  }).optional(),
  url: z.string(),
});

export const AzdoAreaSchema = z.object({
  id: z.string(),
  name: z.string(),
  path: z.string(),
  url: z.string(),
});

// Add or update schemas for work item input
export const GetWorkItemSchema = z.object({
  organization: z.string(),
  project: z.string(),
  id: z.string(),
});

export const CreateWorkItemOptionsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  assignees: z.array(AzdoIssueAssigneeSchema).optional(),
  milestone: AzdoMilestoneSchema.optional(),
  labels: z.array(AzdoLabelSchema).optional(),
});

export const CreateWorkItemInputSchema = z.object({
  organization: z.string(),
  project: z.string(),
}).merge(CreateWorkItemOptionsSchema);

export const UpdateWorkItemOptionsSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  assignees: z.array(AzdoIssueAssigneeSchema).optional(),
  milestone: AzdoMilestoneSchema.optional(),
  labels: z.array(AzdoLabelSchema).optional(),
  state: z.enum(["new", "active", "resolved", "closed", "removed"]).optional(),
});

export const UpdateWorkItemInputSchema = z.object({
  organization: z.string(),
  project: z.string(),
  id: z.string(),
}).merge(UpdateWorkItemOptionsSchema);

// Export types
export type AzdoAuthor = z.infer<typeof AzdoAuthorSchema>;
export type AzdoRepository = z.infer<typeof AzdoRepositorySchema>;
export type AzdoFileContent = z.infer<typeof AzdoFileContentSchema>;
export type AzdoDirectoryContent = z.infer<typeof AzdoDirectoryContentSchema>;
export type AzdoContent = z.infer<typeof AzdoContentSchema>;
export type AzdoTree = z.infer<typeof AzdoHubTreeSchema>;
export type AzdoCommit = z.infer<typeof AzdoHubCommitSchema>;
export type AzdoListCommits = z.infer<typeof AzdoListCommitsSchema>;
export type AzdoReference = z.infer<typeof AzdoReferenceSchema>;
export type AzdoIssueAssignee = z.infer<typeof AzdoIssueAssigneeSchema>;
export type AzdoLabel = z.infer<typeof AzdoLabelSchema>;
export type AzdoMilestone = z.infer<typeof AzdoMilestoneSchema>;
export type AzdoIssue = z.infer<typeof AzdoIssueSchema>;
export type AzdoSearchResponse = z.infer<typeof AzdoSearchResponseSchema>;
export type AzdoPullRequest = z.infer<typeof AzdoPullRequestSchema>;
export type AzdoPullRequestRef = z.infer<typeof AzdoPullRequestRefSchema>;
export type AzdoDashboard = z.infer<typeof AzdoDashboardSchema>;
export type AzdoQuery = z.infer<typeof AzdoQuerySchema>;
export type AzdoTestCase = z.infer<typeof AzdoTestCaseSchema>;
export type AzdoTestPlan = z.infer<typeof AzdoTestPlanSchema>;
export type AzdoArtifact = z.infer<typeof AzdoArtifactSchema>;
export type AzdoArtifactFeed = z.infer<typeof AzdoArtifactFeedSchema>;
export type AzdoArtifactPackage = z.infer<typeof AzdoArtifactPackageSchema>;
export type AzdoArtifactView = z.infer<typeof AzdoArtifactViewSchema>;
export type AzdoProject = z.infer<typeof AzdoProjectSchema>;
export type AzdoProcessTemplate = z.infer<typeof AzdoProcessTemplateSchema>;
export type AzdoIteration = z.infer<typeof AzdoIterationSchema>;
export type AzdoArea = z.infer<typeof AzdoAreaSchema>;
export type AzdoCodeSearchResult = z.infer<typeof AzdoCodeSearchResultSchema>;
export type AzdoCodeSearchResponse = z.infer<typeof AzdoCodeSearchResponseSchema>;
export type AzdoWorkItemSearchResult = z.infer<typeof AzdoWorkItemSearchResultSchema>;
export type AzdoWorkItemSearchResponse = z.infer<typeof AzdoWorkItemSearchResponseSchema>;
export type AzdoUserSearchResult = z.infer<typeof AzdoUserSearchResultSchema>;
export type AzdoUserSearchResponse = z.infer<typeof AzdoUserSearchResponseSchema>;
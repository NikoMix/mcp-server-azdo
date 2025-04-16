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
export type AzdoProject = z.infer<typeof AzdoProjectSchema>;
export type AzdoProcessTemplate = z.infer<typeof AzdoProcessTemplateSchema>;
export type AzdoIteration = z.infer<typeof AzdoIterationSchema>;
export type AzdoArea = z.infer<typeof AzdoAreaSchema>;
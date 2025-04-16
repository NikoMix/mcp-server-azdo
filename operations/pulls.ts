import { z } from "zod";
import { azDoRequest } from "../common/utils.js";
import {
  AzdoPullRequestSchema,
  AzdoIssueAssigneeSchema,
  AzdoRepositorySchema,
} from "../common/types.js";

// Schema definitions
export const AzdoPullRequestFileSchema = z.object({
  path: z.string(),
  changeType: z.string(),
  url: z.string(),
});

export const AzdoPullRequestStatusSchema = z.object({
  state: z.enum(["active", "completed", "abandoned", "notSet", "all"]),
  mergeStatus: z.enum([
    "notSet",
    "queued",
    "conflicts",
    "succeeded",
    "rejected",
    "notApplicable",
  ]),
  lastMergeCommit: z.object({
    commitId: z.string(),
    url: z.string(),
  }),
});

export const AzdoPullRequestCommentSchema = z.object({
  id: z.number(),
  parentCommentId: z.number().optional(),
  author: AzdoIssueAssigneeSchema,
  content: z.string(),
  publishedDate: z.string(),
  lastUpdatedDate: z.string(),
  commentType: z.string(),
  usersLiked: z.array(AzdoIssueAssigneeSchema).optional(),
  url: z.string(),
});

export const AzdoPullRequestReviewerSchema = z.object({
  reviewerUrl: z.string(),
  vote: z.number(),
  hasDeclined: z.boolean(),
  isRequired: z.boolean(),
  displayName: z.string(),
  uniqueName: z.string(),
  id: z.string(),
  imageUrl: z.string(),
});

// Input schemas
export const CreateAzdoPullRequestSchema = z.object({
  organization: z.string().describe("Azure DevOps organization name"),
  project: z.string().describe("Azure DevOps project name"),
  repositoryId: z.string().describe("Repository ID or name"),
  title: z.string().describe("Pull request title"),
  description: z.string().optional().describe("Pull request description"),
  sourceRefName: z.string().describe("Source branch (e.g. refs/heads/feature)"),
  targetRefName: z.string().describe("Target branch (e.g. refs/heads/main)"),
  reviewers: z.array(z.string()).optional().describe("Array of reviewer IDs"),
});

export const GetAzdoPullRequestSchema = z.object({
  organization: z.string(),
  project: z.string(),
  repositoryId: z.string(),
  pullRequestId: z.number(),
});

export const ListAzdoPullRequestsSchema = z.object({
  organization: z.string(),
  project: z.string(),
  repositoryId: z.string(),
  status: z.enum(["active", "completed", "abandoned", "all"]).optional(),
});

export const MergeAzdoPullRequestSchema = z.object({
  organization: z.string(),
  project: z.string(),
  repositoryId: z.string(),
  pullRequestId: z.number(),
  commitId: z.string().optional(),
  status: z.enum(["completed", "abandoned"]).default("completed"),
});

export const GetAzdoPullRequestFilesSchema = z.object({
  organization: z.string(),
  project: z.string(),
  repositoryId: z.string(),
  pullRequestId: z.number(),
});

export const GetAzdoPullRequestCommentsSchema = z.object({
  organization: z.string(),
  project: z.string(),
  repositoryId: z.string(),
  pullRequestId: z.number(),
});

// Function implementations
export async function createAzdoPullRequest(
  params: z.infer<typeof CreateAzdoPullRequestSchema>
): Promise<z.infer<typeof AzdoPullRequestSchema>> {
  const { organization, project, repositoryId, title, description, sourceRefName, targetRefName, reviewers } =
    CreateAzdoPullRequestSchema.parse(params);
  const body: any = {
    title,
    description,
    sourceRefName,
    targetRefName,
    reviewers: reviewers
      ? reviewers.map((id) => ({ id }))
      : [],
  };
  const response = await azDoRequest(
    `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/pullrequests?api-version=7.1-preview.1`,
    {
      method: "POST",
      body,
    }
  );
  return AzdoPullRequestSchema.parse(response);
}

export async function getAzdoPullRequest(
  organization: string,
  project: string,
  repositoryId: string,
  pullRequestId: number
): Promise<z.infer<typeof AzdoPullRequestSchema>> {
  const response = await azDoRequest(
    `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/pullrequests/${pullRequestId}?api-version=7.1-preview.1`
  );
  return AzdoPullRequestSchema.parse(response);
}

export async function listAzdoPullRequests(
  organization: string,
  project: string,
  repositoryId: string,
  options: Omit<z.infer<typeof ListAzdoPullRequestsSchema>, "organization" | "project" | "repositoryId">
): Promise<z.infer<typeof AzdoPullRequestSchema>[]> {
  let url = `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/pullrequests?api-version=7.1-preview.1`;
  if (options.status) {
    url += `&searchCriteria.status=${options.status}`;
  }
  const response = await azDoRequest(url);
  return (response as any).value.map((pr: any) => AzdoPullRequestSchema.parse(pr));
}

export async function mergeAzdoPullRequest(
  organization: string,
  project: string,
  repositoryId: string,
  pullRequestId: number,
  options: Omit<z.infer<typeof MergeAzdoPullRequestSchema>, "organization" | "project" | "repositoryId" | "pullRequestId">
): Promise<any> {
  // Complete (merge) or abandon a PR
  const body: any = {
    status: options.status || "completed",
    ...(options.commitId ? { lastMergeSourceCommit: { commitId: options.commitId } } : {}),
  };
  return azDoRequest(
    `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/pullrequests/${pullRequestId}?api-version=7.1-preview.1`,
    {
      method: "PATCH",
      body,
    }
  );
}

export async function getAzdoPullRequestFiles(
  organization: string,
  project: string,
  repositoryId: string,
  pullRequestId: number
): Promise<z.infer<typeof AzdoPullRequestFileSchema>[]> {
  const response = await azDoRequest(
    `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/pullRequests/${pullRequestId}/iterations/1/changes?api-version=7.1-preview.1`
  );
  // This endpoint returns a list of changes; map to our schema
  return (response as any).changes.map((c: any) => AzdoPullRequestFileSchema.parse({
    path: c.item.path,
    changeType: c.changeType,
    url: c.item.url,
  }));
}

export async function getAzdoPullRequestComments(
  organization: string,
  project: string,
  repositoryId: string,
  pullRequestId: number
): Promise<z.infer<typeof AzdoPullRequestCommentSchema>[]> {
  const response = await azDoRequest(
    `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/pullRequests/${pullRequestId}/threads?api-version=7.1-preview.1`
  );
  // Each thread has comments array
  const comments: any[] = [];
  for (const thread of (response as any).value) {
    for (const comment of thread.comments) {
      comments.push(AzdoPullRequestCommentSchema.parse(comment));
    }
  }
  return comments;
}
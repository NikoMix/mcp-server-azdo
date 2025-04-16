import { z } from "zod";
import { azDoRequest } from "../common/utils.js";
import {
  AzdoFileContentSchema,
  AzdoContentSchema,
  AzdoAuthorSchema,
  AzdoReferenceSchema,
} from "../common/types.js";

// Schema definitions
export const AzdoFileOperationSchema = z.object({
  path: z.string(),
  content: z.string(),
});

export const CreateOrUpdateAzdoFileSchema = z.object({
  organization: z.string().describe("Azure DevOps organization name"),
  project: z.string().describe("Azure DevOps project name"),
  repositoryId: z.string().describe("Repository ID or name"),
  path: z.string().describe("Path where to create/update the file"),
  content: z.string().describe("Content of the file"),
  message: z.string().describe("Commit message"),
  branch: z.string().describe("Branch to create/update the file in"),
});

export const GetAzdoFileContentsSchema = z.object({
  organization: z.string().describe("Azure DevOps organization name"),
  project: z.string().describe("Azure DevOps project name"),
  repositoryId: z.string().describe("Repository ID or name"),
  path: z.string().describe("Path to the file or directory"),
  branch: z.string().optional().describe("Branch to get contents from"),
});

export const PushAzdoFilesSchema = z.object({
  organization: z.string().describe("Azure DevOps organization name"),
  project: z.string().describe("Azure DevOps project name"),
  repositoryId: z.string().describe("Repository ID or name"),
  branch: z.string().describe("Branch to push to (e.g., 'main')"),
  files: z.array(AzdoFileOperationSchema).describe("Array of files to push"),
  message: z.string().describe("Commit message"),
});

// Type exports
export type AzdoFileOperation = z.infer<typeof AzdoFileOperationSchema>;

// Function implementations
export async function getAzdoFileContents(
  organization: string,
  project: string,
  repositoryId: string,
  path: string,
  branch?: string
) {
  let url = `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/items?path=${encodeURIComponent(
    path
  )}&includeContent=true&api-version=7.1-preview.1`;
  if (branch) {
    url += `&versionDescriptor.version=${encodeURIComponent(branch)}`;
  }
  const response = await azDoRequest(url);
  return AzdoFileContentSchema.parse(response);
}

export async function createOrUpdateAzdoFile(
  organization: string,
  project: string,
  repositoryId: string,
  path: string,
  content: string,
  message: string,
  branch: string
) {
  // Use the pushes API to create/update a file
  const changes = [
    {
      changeType: "edit",
      item: { path },
      newContent: {
        content,
        contentType: "raw",
      },
    },
  ];
  const body = {
    refUpdates: [
      {
        name: `refs/heads/${branch}`,
        oldObjectId: "0000000000000000000000000000000000000000", // Will be replaced by server if branch exists
      },
    ],
    commits: [
      {
        comment: message,
        changes,
      },
    ],
  };
  const url = `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/pushes?api-version=7.1-preview.1`;
  const response = await azDoRequest(url, { method: "POST", body });
  return response;
}

export async function pushAzdoFiles(
  organization: string,
  project: string,
  repositoryId: string,
  branch: string,
  files: AzdoFileOperation[],
  message: string
) {
  const changes = files.map((file) => ({
    changeType: "edit",
    item: { path: file.path },
    newContent: {
      content: file.content,
      contentType: "raw",
    },
  }));
  const body = {
    refUpdates: [
      {
        name: `refs/heads/${branch}`,
        oldObjectId: "0000000000000000000000000000000000000000",
      },
    ],
    commits: [
      {
        comment: message,
        changes,
      },
    ],
  };
  const url = `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/pushes?api-version=7.1-preview.1`;
  const response = await azDoRequest(url, { method: "POST", body });
  return response;
}

import { z } from "zod";
import { azDoRequest } from "../common/utils.js";
import { AzdoReferenceSchema } from "../common/types.js";

// Schema definitions
export const CreateAzdoBranchOptionsSchema = z.object({
  name: z.string(), // branch name
  oldObjectId: z.string(), // base commit SHA
  newObjectId: z.string(), // new commit SHA (for updates)
});

export const CreateAzdoBranchSchema = z.object({
  organization: z.string().describe("Azure DevOps organization name"),
  project: z.string().describe("Azure DevOps project name"),
  repositoryId: z.string().describe("Repository ID or name"),
  branch: z.string().describe("Name for the new branch"),
  fromBranch: z.string().optional().describe("Optional: source branch to create from (defaults to the repository's default branch)"),
});

export type CreateAzdoBranchOptions = z.infer<typeof CreateAzdoBranchOptionsSchema>;

// Get the default branch's commit SHA
export async function getDefaultBranchObjectId(
  organization: string,
  project: string,
  repositoryId: string
): Promise<string> {
  const repo = await azDoRequest(
    `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}?api-version=7.1-preview.1`
  ) as { defaultBranch: string };
  const defaultBranch = repo.defaultBranch.replace("refs/heads/", "");
  return getBranchObjectId(organization, project, repositoryId, defaultBranch);
}

// Get a branch's commit SHA (objectId)
export async function getBranchObjectId(
  organization: string,
  project: string,
  repositoryId: string,
  branch: string
): Promise<string> {
  const refs = await azDoRequest(
    `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/refs?filter=heads/${branch}&api-version=7.1-preview.1`
  ) as { value: Array<{ name: string; objectId: string }> };
  const ref = refs.value.find((r) => r.name === `refs/heads/${branch}`);
  if (!ref) throw new Error(`Branch not found: ${branch}`);
  return ref.objectId;
}

// Create a new branch from a commit SHA
export async function createAzdoBranch(
  organization: string,
  project: string,
  repositoryId: string,
  branch: string,
  sha: string
): Promise<any> {
  const body = [
    {
      name: `refs/heads/${branch}`,
      oldObjectId: "0000000000000000000000000000000000000000", // special value for new branch
      newObjectId: sha,
    },
  ];
  const response = await azDoRequest(
    `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/refs?api-version=7.1-preview.1`,
    {
      method: "POST",
      body,
    }
  ) as { value: any[] };
  return response.value ? response.value[0] : response;
}

// Create a branch from another branch (or default branch)
export async function createAzdoBranchFromRef(
  organization: string,
  project: string,
  repositoryId: string,
  newBranch: string,
  fromBranch?: string
): Promise<any> {
  const sha = fromBranch
    ? await getBranchObjectId(organization, project, repositoryId, fromBranch)
    : await getDefaultBranchObjectId(organization, project, repositoryId);
  return createAzdoBranch(organization, project, repositoryId, newBranch, sha);
}

// Update a branch to point to a new commit SHA
export async function updateAzdoBranch(
  organization: string,
  project: string,
  repositoryId: string,
  branch: string,
  sha: string
): Promise<any> {
  const oldSha = await getBranchObjectId(organization, project, repositoryId, branch);
  const body = [
    {
      name: `refs/heads/${branch}`,
      oldObjectId: oldSha,
      newObjectId: sha,
    },
  ];
  const response = await azDoRequest(
    `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/refs?api-version=7.1-preview.1`,
    {
      method: "POST",
      body,
    }
  ) as { value: any[] };
  return response.value ? response.value[0] : response;
}

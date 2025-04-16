import { z } from "zod";
import { azDoRequest } from "../common/utils.js";
import { AzdoRepositorySchema, AzdoSearchResponseSchema } from "../common/types.js";

// Schema definitions
export const CreateAzdoRepositoryOptionsSchema = z.object({
  organization: z.string().describe("Azure DevOps organization name"),
  project: z.string().describe("Azure DevOps project name"),
  name: z.string().describe("Repository name"),
  description: z.string().optional().describe("Repository description"),
  defaultBranch: z.string().optional().describe("Default branch name (e.g. 'main')"),
});

export const SearchAzdoRepositoriesSchema = z.object({
  organization: z.string().describe("Azure DevOps organization name"),
  project: z.string().optional().describe("Azure DevOps project name (optional)"),
  query: z.string().optional().describe("Search query (optional, filters by name)")
});

// Type exports
export type CreateAzdoRepositoryOptions = z.infer<typeof CreateAzdoRepositoryOptionsSchema>;

// Function implementations
export async function createAzdoRepository(options: CreateAzdoRepositoryOptions) {
  const { organization, project, name, description, defaultBranch } = options;
  const body: any = {
    name,
    project: { name: project },
    ...(description ? { description } : {}),
    ...(defaultBranch ? { defaultBranch } : {}),
  };
  const response = await azDoRequest(
    `https://dev.azure.com/${organization}/${project}/_apis/git/repositories?api-version=7.1-preview.1`,
    {
      method: "POST",
      body,
    }
  );
  return AzdoRepositorySchema.parse(response);
}

export async function searchAzdoRepositories(
  organization: string,
  project?: string,
  query?: string
) {
  let url = `https://dev.azure.com/${organization}`;
  if (project) {
    url += `/${project}`;
  }
  url += `/_apis/git/repositories?api-version=7.1-preview.1`;
  const response = await azDoRequest(url);
  // Optionally filter by query (name contains)
  let items = (response as any).value || [];
  if (query) {
    items = items.filter((repo: any) => repo.name.toLowerCase().includes(query.toLowerCase()));
  }
  return {
    total_count: items.length,
    incomplete_results: false,
    items,
  };
}

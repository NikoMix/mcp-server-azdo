import { z } from "zod";
import { azDoRequest } from "../common/utils.js";

export const ListAzdoCommitsSchema = z.object({
  organization: z.string(),
  project: z.string(),
  repositoryId: z.string(),
  branch: z.string().optional(),
  top: z.number().optional(),
  skip: z.number().optional(),
});

/**
 * List commits in an Azure DevOps repository.
 * @param organization Azure DevOps organization name
 * @param project Azure DevOps project name
 * @param repositoryId Repository ID or name
 * @param branch Optional branch name (ref)
 * @param top Optional number of commits to return
 * @param skip Optional number of commits to skip
 */
export async function listAzdoCommits(
  organization: string,
  project: string,
  repositoryId: string,
  branch?: string,
  top?: number,
  skip?: number
) {
  const params = [
    branch ? `searchCriteria.itemVersion.version=${encodeURIComponent(branch)}` : null,
    top ? `\$top=${top}` : null,
    skip ? `\$skip=${skip}` : null,
    "api-version=7.1-preview.1"
  ].filter(Boolean).join("&");
  const url = `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repositoryId}/commits?${params}`;
  return azDoRequest(url);
}
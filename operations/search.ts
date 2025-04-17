import { z } from "zod";
import { azDoRequest } from "../common/utils.js";
import {
  AzdoCodeSearchResponseSchema,
  AzdoWorkItemSearchResponseSchema,
  AzdoUserSearchResponseSchema,
} from "../common/types.js";

export const AzdoCodeSearchSchema = z.object({
  organization: z.string(),
  project: z.string(),
  searchText: z.string(),
  top: z.number().optional(),
});

export const AzdoWorkItemSearchSchema = z.object({
  organization: z.string(),
  project: z.string(),
  searchText: z.string(),
  top: z.number().optional(),
});

export const AzdoUserSearchSchema = z.object({
  organization: z.string(),
  searchText: z.string(),
  top: z.number().optional(),
});

export async function searchCode(params: z.infer<typeof AzdoCodeSearchSchema>) {
  const { organization, project, searchText, top } = params;
  const url = `https://almsearch.dev.azure.com/${organization}/${project}/_apis/search/codesearchresults?api-version=7.1-preview.1`;
  const body = {
    searchText,
    $top: top || 25,
  };
  const response = await azDoRequest(url, { method: "POST", body });
  return AzdoCodeSearchResponseSchema.parse(response);
}

export async function searchWorkItems(params: z.infer<typeof AzdoWorkItemSearchSchema>) {
  const { organization, project, searchText, top } = params;
  const url = `https://almsearch.dev.azure.com/${organization}/${project}/_apis/search/workitemsearchresults?api-version=7.1-preview.1`;
  const body = {
    searchText,
    $top: top || 25,
  };
  const response = await azDoRequest(url, { method: "POST", body });
  return AzdoWorkItemSearchResponseSchema.parse(response);
}

export async function searchUsers(params: z.infer<typeof AzdoUserSearchSchema>) {
  const { organization, searchText, top } = params;
  const url = `https://vssps.dev.azure.com/${organization}/_apis/graph/users?api-version=7.1-preview.1&$top=${top || 25}&filterValue=${encodeURIComponent(searchText)}`;
  const response = await azDoRequest(url);
  const resp: any = response;
  // Azure DevOps returns 'value' array for users
  return AzdoUserSearchResponseSchema.parse({ count: resp.count || (resp.value ? resp.value.length : 0), results: resp.value || [] });
}
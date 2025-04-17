import { z } from "zod";
import { azDoRequest } from "../common/utils.js";
import {
  AzdoArtifactFeedSchema,
  AzdoArtifactPackageSchema,
  AzdoArtifactViewSchema,
} from "../common/types.js";

// Schemas for input validation
export const ListArtifactFeedsSchema = z.object({ organization: z.string() });
export const GetArtifactFeedSchema = z.object({ organization: z.string(), feedId: z.string() });
export const CreateArtifactFeedSchema = z.object({
  organization: z.string(),
  name: z.string(),
  description: z.string().optional(),
  project: z.string().optional(),
});
export const UpdateArtifactFeedSchema = z.object({
  organization: z.string(),
  feedId: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
});
export const DeleteArtifactFeedSchema = z.object({ organization: z.string(), feedId: z.string() });

export const ListArtifactPackagesSchema = z.object({ organization: z.string(), feedId: z.string() });
export const GetArtifactPackageSchema = z.object({ organization: z.string(), feedId: z.string(), packageId: z.string() });
export const DeleteArtifactPackageSchema = z.object({ organization: z.string(), feedId: z.string(), packageId: z.string() });

export const ListArtifactViewsSchema = z.object({ organization: z.string(), feedId: z.string() });
export const GetArtifactViewSchema = z.object({ organization: z.string(), feedId: z.string(), viewId: z.string() });
export const CreateArtifactViewSchema = z.object({
  organization: z.string(),
  feedId: z.string(),
  name: z.string(),
  description: z.string().optional(),
});
export const UpdateArtifactViewSchema = z.object({
  organization: z.string(),
  feedId: z.string(),
  viewId: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
});
export const DeleteArtifactViewSchema = z.object({ organization: z.string(), feedId: z.string(), viewId: z.string() });

// Feed CRUD
export async function listArtifactFeeds(organization: string) {
  return azDoRequest(`https://feeds.dev.azure.com/${organization}/_apis/packaging/feeds?api-version=7.1-preview.1`);
}
export async function getArtifactFeed(organization: string, feedId: string) {
  return azDoRequest(`https://feeds.dev.azure.com/${organization}/_apis/packaging/feeds/${feedId}?api-version=7.1-preview.1`);
}
export async function createArtifactFeed(organization: string, options: z.infer<typeof CreateArtifactFeedSchema>) {
  return azDoRequest(`https://feeds.dev.azure.com/${organization}/_apis/packaging/feeds?api-version=7.1-preview.1`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: options.name,
      description: options.description,
      project: options.project ? { id: options.project } : undefined,
    }),
  });
}
export async function updateArtifactFeed(organization: string, feedId: string, options: z.infer<typeof UpdateArtifactFeedSchema>) {
  return azDoRequest(`https://feeds.dev.azure.com/${organization}/_apis/packaging/feeds/${feedId}?api-version=7.1-preview.1`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...(options.name ? { name: options.name } : {}),
      ...(options.description ? { description: options.description } : {}),
    }),
  });
}
export async function deleteArtifactFeed(organization: string, feedId: string) {
  return azDoRequest(`https://feeds.dev.azure.com/${organization}/_apis/packaging/feeds/${feedId}?api-version=7.1-preview.1`, {
    method: "DELETE",
  });
}

// Package CRUD
export async function listArtifactPackages(organization: string, feedId: string) {
  return azDoRequest(`https://feeds.dev.azure.com/${organization}/_apis/packaging/feeds/${feedId}/packages?api-version=7.1-preview.1`);
}
export async function getArtifactPackage(organization: string, feedId: string, packageId: string) {
  return azDoRequest(`https://feeds.dev.azure.com/${organization}/_apis/packaging/feeds/${feedId}/packages/${packageId}?api-version=7.1-preview.1`);
}
export async function deleteArtifactPackage(organization: string, feedId: string, packageId: string) {
  return azDoRequest(`https://feeds.dev.azure.com/${organization}/_apis/packaging/feeds/${feedId}/packages/${packageId}?api-version=7.1-preview.1`, {
    method: "DELETE",
  });
}

// View CRUD
export async function listArtifactViews(organization: string, feedId: string) {
  return azDoRequest(`https://feeds.dev.azure.com/${organization}/_apis/packaging/feeds/${feedId}/views?api-version=7.1-preview.1`);
}
export async function getArtifactView(organization: string, feedId: string, viewId: string) {
  return azDoRequest(`https://feeds.dev.azure.com/${organization}/_apis/packaging/feeds/${feedId}/views/${viewId}?api-version=7.1-preview.1`);
}
export async function createArtifactView(organization: string, feedId: string, options: z.infer<typeof CreateArtifactViewSchema>) {
  return azDoRequest(`https://feeds.dev.azure.com/${organization}/_apis/packaging/feeds/${feedId}/views?api-version=7.1-preview.1`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: options.name,
      description: options.description,
    }),
  });
}
export async function updateArtifactView(organization: string, feedId: string, viewId: string, options: z.infer<typeof UpdateArtifactViewSchema>) {
  return azDoRequest(`https://feeds.dev.azure.com/${organization}/_apis/packaging/feeds/${feedId}/views/${viewId}?api-version=7.1-preview.1`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...(options.name ? { name: options.name } : {}),
      ...(options.description ? { description: options.description } : {}),
    }),
  });
}
export async function deleteArtifactView(organization: string, feedId: string, viewId: string) {
  return azDoRequest(`https://feeds.dev.azure.com/${organization}/_apis/packaging/feeds/${feedId}/views/${viewId}?api-version=7.1-preview.1`, {
    method: "DELETE",
  });
}

import { z } from "zod";
import { azDoRequest, buildUrl } from "../common/utils.js";
import {
  AzdoIssueSchema,
  AzdoIssueAssigneeSchema,
  AzdoLabelSchema,
  AzdoMilestoneSchema,
} from "../common/types.js";

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

export async function getWorkItem(organization: string, project: string, id: string) {
  return azDoRequest(`https://dev.azure.com/${organization}/${project}/_apis/wit/workitems/${id}?api-version=7.0`);
}

export async function createWorkItem(
  organization: string,
  project: string,
  options: z.infer<typeof CreateWorkItemOptionsSchema>
) {
  return azDoRequest(
    `https://dev.azure.com/${organization}/${project}/_apis/wit/workitems/$task?api-version=7.0`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json-patch+json",
      },
      body: JSON.stringify([
        { op: "add", path: "/fields/System.Title", value: options.title },
        { op: "add", path: "/fields/System.Description", value: options.description },
        // Add other fields as needed
      ]),
    }
  );
}

export async function updateWorkItem(
  organization: string,
  project: string,
  id: string,
  options: z.infer<typeof UpdateWorkItemOptionsSchema>
) {
  return azDoRequest(
    `https://dev.azure.com/${organization}/${project}/_apis/wit/workitems/${id}?api-version=7.0`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json-patch+json",
      },
      body: JSON.stringify([
        { op: "add", path: "/fields/System.Title", value: options.title },
        { op: "add", path: "/fields/System.Description", value: options.description },
        // Add other fields as needed
      ]),
    }
  );
}

export async function listWorkItems(organization: string, project: string) {
  return azDoRequest(
    `https://dev.azure.com/${organization}/${project}/_apis/wit/wiql?api-version=7.0`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "SELECT [System.Id], [System.Title], [System.State] FROM WorkItems WHERE [System.TeamProject] = @project ORDER BY [System.ChangedDate] DESC",
      }),
    }
  );
}
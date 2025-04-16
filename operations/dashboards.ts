import { z } from "zod";
import { azDoRequest } from "../common/utils.js";
import { AzdoDashboardSchema } from "../common/types.js";

// Input schemas
export const ListDashboardsSchema = z.object({
  project: z.string(),
});

export const GetDashboardSchema = z.object({
  project: z.string(),
  dashboardId: z.string(),
});

export const CreateDashboardSchema = z.object({
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
  project: z.string(),
  dashboardId: z.string(),
});

// Actions
export async function listDashboards(project: string) {
  // GET https://dev.azure.com/{organization}/{project}/_apis/dashboard/dashboards?api-version=7.0
  return azDoRequest(
    `https://dev.azure.com/{organization}/${project}/_apis/dashboard/dashboards?api-version=7.0`
  );
}

export async function getDashboard(project: string, dashboardId: string) {
  // GET https://dev.azure.com/{organization}/{project}/_apis/dashboard/dashboards/{dashboardId}?api-version=7.0
  return azDoRequest(
    `https://dev.azure.com/{organization}/${project}/_apis/dashboard/dashboards/${dashboardId}?api-version=7.0`
  );
}

export async function createDashboard(project: string, options: z.infer<typeof CreateDashboardSchema>) {
  // POST https://dev.azure.com/{organization}/{project}/_apis/dashboard/dashboards?api-version=7.0
  return azDoRequest(
    `https://dev.azure.com/{organization}/${project}/_apis/dashboard/dashboards?api-version=7.0`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: options.name,
        widgets: options.widgets,
      }),
    }
  );
}

export async function updateDashboard(
  project: string,
  dashboardId: string,
  options: z.infer<typeof UpdateDashboardSchema>
) {
  // PUT https://dev.azure.com/{organization}/{project}/_apis/dashboard/dashboards/{dashboardId}?api-version=7.0
  return azDoRequest(
    `https://dev.azure.com/{organization}/${project}/_apis/dashboard/dashboards/${dashboardId}?api-version=7.0`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(options.name ? { name: options.name } : {}),
        ...(options.widgets ? { widgets: options.widgets } : {}),
      }),
    }
  );
}

export async function deleteDashboard(project: string, dashboardId: string) {
  // DELETE https://dev.azure.com/{organization}/{project}/_apis/dashboard/dashboards/{dashboardId}?api-version=7.0
  return azDoRequest(
    `https://dev.azure.com/{organization}/${project}/_apis/dashboard/dashboards/${dashboardId}?api-version=7.0`,
    {
      method: "DELETE",
    }
  );
}

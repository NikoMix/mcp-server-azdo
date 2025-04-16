import { z } from "zod";
import { azDoRequest } from "../common/utils.js";
import {
  AzdoProjectSchema,
  AzdoProcessTemplateSchema,
  AzdoIterationSchema,
  AzdoAreaSchema,
} from "../common/types.js";

// Schemas for input validation
export const GetProjectSchema = z.object({ id: z.string() });
export const CreateProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  visibility: z.enum(["private", "public"]).default("private"),
  processTemplateId: z.string(),
});
export const UpdateProjectSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  visibility: z.enum(["private", "public"]).optional(),
});
export const DeleteProjectSchema = z.object({ id: z.string() });

export const ListProjectsSchema = z.object({});

export const ListProcessTemplatesSchema = z.object({});
export const GetProcessTemplateSchema = z.object({ id: z.string() });

export const ListIterationsSchema = z.object({ project: z.string() });
export const GetIterationSchema = z.object({ project: z.string(), id: z.string() });
export const CreateIterationSchema = z.object({
  project: z.string(),
  name: z.string(),
  startDate: z.string().optional(),
  finishDate: z.string().optional(),
  path: z.string().optional(),
});
export const UpdateIterationSchema = z.object({
  project: z.string(),
  id: z.string(),
  name: z.string().optional(),
  startDate: z.string().optional(),
  finishDate: z.string().optional(),
});
export const DeleteIterationSchema = z.object({ project: z.string(), id: z.string() });

export const ListAreasSchema = z.object({ project: z.string() });
export const GetAreaSchema = z.object({ project: z.string(), id: z.string() });
export const CreateAreaSchema = z.object({
  project: z.string(),
  name: z.string(),
  path: z.string().optional(),
});
export const UpdateAreaSchema = z.object({
  project: z.string(),
  id: z.string(),
  name: z.string().optional(),
  path: z.string().optional(),
});
export const DeleteAreaSchema = z.object({ project: z.string(), id: z.string() });

// Project CRUD
export async function listProjects() {
  return azDoRequest(`https://dev.azure.com/{organization}/_apis/projects?api-version=7.0`);
}
export async function getProject(id: string) {
  return azDoRequest(`https://dev.azure.com/{organization}/_apis/projects/${id}?api-version=7.0`);
}
export async function createProject(options: z.infer<typeof CreateProjectSchema>) {
  return azDoRequest(`https://dev.azure.com/{organization}/_apis/projects?api-version=7.0`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: options.name,
      description: options.description,
      visibility: options.visibility,
      capabilities: {
        versioncontrol: { sourceControlType: "Git" },
        processTemplate: { templateTypeId: options.processTemplateId },
      },
    }),
  });
}
export async function updateProject(id: string, options: z.infer<typeof UpdateProjectSchema>) {
  return azDoRequest(`https://dev.azure.com/{organization}/_apis/projects/${id}?api-version=7.0`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });
}
export async function deleteProject(id: string) {
  return azDoRequest(`https://dev.azure.com/{organization}/_apis/projects/${id}?api-version=7.0`, {
    method: "DELETE",
  });
}

// Process templates
export async function listProcessTemplates() {
  return azDoRequest(`https://dev.azure.com/{organization}/_apis/process/processes?api-version=7.0`);
}
export async function getProcessTemplate(id: string) {
  return azDoRequest(`https://dev.azure.com/{organization}/_apis/process/processes/${id}?api-version=7.0`);
}

// Iterations
export async function listIterations(project: string) {
  return azDoRequest(`https://dev.azure.com/{organization}/${project}/_apis/wit/classificationnodes/iterations?$depth=10&api-version=7.0`);
}
export async function getIteration(project: string, id: string) {
  return azDoRequest(`https://dev.azure.com/{organization}/${project}/_apis/wit/classificationnodes/iterations/${id}?api-version=7.0`);
}
export async function createIteration(project: string, options: z.infer<typeof CreateIterationSchema>) {
  return azDoRequest(`https://dev.azure.com/{organization}/${project}/_apis/wit/classificationnodes/iterations?api-version=7.0`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: options.name,
      attributes: {
        startDate: options.startDate,
        finishDate: options.finishDate,
      },
      path: options.path,
    }),
  });
}
export async function updateIteration(project: string, id: string, options: z.infer<typeof UpdateIterationSchema>) {
  return azDoRequest(`https://dev.azure.com/{organization}/${project}/_apis/wit/classificationnodes/iterations/${id}?api-version=7.0`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });
}
export async function deleteIteration(project: string, id: string) {
  return azDoRequest(`https://dev.azure.com/{organization}/${project}/_apis/wit/classificationnodes/iterations/${id}?api-version=7.0`, {
    method: "DELETE",
  });
}

// Areas
export async function listAreas(project: string) {
  return azDoRequest(`https://dev.azure.com/{organization}/${project}/_apis/wit/classificationnodes/areas?$depth=10&api-version=7.0`);
}
export async function getArea(project: string, id: string) {
  return azDoRequest(`https://dev.azure.com/{organization}/${project}/_apis/wit/classificationnodes/areas/${id}?api-version=7.0`);
}
export async function createArea(project: string, options: z.infer<typeof CreateAreaSchema>) {
  return azDoRequest(`https://dev.azure.com/{organization}/${project}/_apis/wit/classificationnodes/areas?api-version=7.0`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: options.name,
      path: options.path,
    }),
  });
}
export async function updateArea(project: string, id: string, options: z.infer<typeof UpdateAreaSchema>) {
  return azDoRequest(`https://dev.azure.com/{organization}/${project}/_apis/wit/classificationnodes/areas/${id}?api-version=7.0`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });
}
export async function deleteArea(project: string, id: string) {
  return azDoRequest(`https://dev.azure.com/{organization}/${project}/_apis/wit/classificationnodes/areas/${id}?api-version=7.0`, {
    method: "DELETE",
  });
}

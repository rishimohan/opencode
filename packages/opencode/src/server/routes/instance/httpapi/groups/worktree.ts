import { ProjectV2 } from "@opencode-ai/core/project"
import { Schema } from "effect"
import { HttpApi, HttpApiEndpoint, HttpApiGroup, OpenApi } from "effect/unstable/httpapi"
import { Authorization } from "../middleware/authorization"
import { InstanceContextMiddleware } from "../middleware/instance-context"
import { WorkspaceRoutingMiddleware, WorkspaceRoutingQuery } from "../middleware/workspace-routing"

export const GenerateNamePayload = Schema.Struct({
  context: Schema.optional(Schema.String),
})

export const WorktreeApi = HttpApi.make("worktreeName").add(
  HttpApiGroup.make("worktreeName")
    .add(
      HttpApiEndpoint.post("generateName", "/experimental/project/:projectID/worktree/generate-name", {
        params: { projectID: ProjectV2.ID },
        query: WorkspaceRoutingQuery,
        payload: GenerateNamePayload,
        success: Schema.Struct({ name: Schema.String }),
      }).annotateMerge(
        OpenApi.annotations({
          identifier: "experimental.worktree.generateName",
          summary: "Generate worktree name",
          description: "Generate a short worktree name from task context.",
        }),
      ),
    )
    .annotateMerge(OpenApi.annotations({ title: "worktree", description: "Worktree naming routes." }))
    .middleware(InstanceContextMiddleware)
    .middleware(WorkspaceRoutingMiddleware)
    .middleware(Authorization),
)

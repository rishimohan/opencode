import { Worktree } from "@opencode-ai/core/worktree"
import { Git } from "@opencode-ai/core/git"
import { Effect } from "effect"
import { HttpApiBuilder, HttpApiSchema } from "effect/unstable/httpapi"
import { Api } from "../api"
import { ProjectCopyError } from "@opencode-ai/protocol/groups/project-copy"

export const ProjectCopyHandler = HttpApiBuilder.group(Api, "server.projectCopy", (handlers) =>
  Effect.succeed(
    handlers
      .handle("projectCopy.create", (ctx) =>
        Effect.gen(function* () {
          const worktrees = yield* Worktree.Service
          return yield* badRequest(
            worktrees.create({
              ...ctx.payload,
              projectID: ctx.params.projectID,
            }),
          )
        }),
      )
      .handle("projectCopy.remove", (ctx) =>
        Worktree.Service.use((worktrees) =>
          badRequest(worktrees.remove({ ...ctx.payload, projectID: ctx.params.projectID })).pipe(
            Effect.as(HttpApiSchema.NoContent.make()),
          ),
        ),
      )
      .handle("projectCopy.refresh", (ctx) =>
        Worktree.Service.use((worktrees) =>
          badRequest(worktrees.refresh({ projectID: ctx.params.projectID })).pipe(
            Effect.as(HttpApiSchema.NoContent.make()),
          ),
        ),
      ),
  ),
)

function badRequest<A, R>(effect: Effect.Effect<A, Worktree.Error, R>) {
  return effect.pipe(
    Effect.mapError(
      (error) =>
        new ProjectCopyError({
          name: "ProjectCopyError",
          data: {
            message: message(error),
            forceRequired: error instanceof Git.WorktreeError ? error.forceRequired : undefined,
          },
        }),
    ),
  )
}

function message(error: Worktree.Error) {
  if (error instanceof Worktree.SourceDirectoryNotFoundError)
    return `Project copy source not found for project: ${error.projectID}`
  if (error instanceof Worktree.DestinationExistsError)
    return `Project copy destination already exists: ${error.directory}`
  if (error instanceof Worktree.DirectoryUnavailableError)
    return `Project copy directory unavailable: ${error.directory}`
  if (error instanceof Worktree.InvalidDirectoryError) return `Invalid project copy directory: ${error.directory}`
  if (error instanceof Worktree.StrategyUnavailableError) return `Project copy strategy unavailable: ${error.strategy}`
  return error.message
}

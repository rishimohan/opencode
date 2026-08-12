export * as Worktree from "./worktree"

import { Schema } from "effect"
import { optional } from "./schema"
import { ProjectID } from "./project-id"
import { AbsolutePath } from "./schema"
import { define, inventory } from "./event"

export const StrategyID = Schema.Trim.pipe(Schema.check(Schema.isNonEmpty()), Schema.brand("Worktree.StrategyID"))
export type StrategyID = typeof StrategyID.Type

export const CreateInput = Schema.Struct({
  projectID: ProjectID,
  strategy: StrategyID,
  directory: AbsolutePath,
  name: optional(Schema.String),
}).annotate({ identifier: "Worktree.CreateInput" })
export interface CreateInput extends Schema.Schema.Type<typeof CreateInput> {}

export const RemoveInput = Schema.Struct({
  projectID: ProjectID,
  directory: AbsolutePath,
  force: Schema.Boolean,
}).annotate({ identifier: "Worktree.RemoveInput" })
export interface RemoveInput extends Schema.Schema.Type<typeof RemoveInput> {}

export const Info = Schema.Struct({
  directory: AbsolutePath,
}).annotate({ identifier: "Worktree.Info" })
export interface Info extends Schema.Schema.Type<typeof Info> {}

export const ListInput = Schema.Struct({
  projectID: ProjectID,
}).annotate({ identifier: "Worktree.ListInput" })
export interface ListInput extends Schema.Schema.Type<typeof ListInput> {}

export const ListOutput = Schema.Array(
  Schema.Struct({
    directory: AbsolutePath,
    strategy: optional(Schema.String),
  }),
).annotate({ identifier: "Worktree.List" })
export type ListOutput = typeof ListOutput.Type

const Updated = define({
  type: "worktree.updated",
  schema: { projectID: ProjectID },
})
export const Event = { Updated, Definitions: inventory(Updated) }

export * as WorktreeDirectory from "./directory"

import { Effect, Schema } from "effect"
import { FSUtil } from "../fs-util"
import { AbsolutePath } from "../schema"

export class DirectoryUnavailableError extends Schema.TaggedErrorClass<DirectoryUnavailableError>()(
  "Worktree.DirectoryUnavailableError",
  { directory: AbsolutePath },
) {}

export const canonical = Effect.fnUntraced(function* (fs: FSUtil.Interface, input: AbsolutePath) {
  const resolved = AbsolutePath.make(yield* fs.resolve(input))
  if (!(yield* fs.isDir(resolved))) return yield* new DirectoryUnavailableError({ directory: input })
  return resolved
})

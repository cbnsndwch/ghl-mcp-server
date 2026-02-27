Great! Now let's commit these changes in thematic groups with short messages that follow the repo's semantic conventions.

## Commit Message Convention

Use the format: `type(scope): message`

**Types:**

- `feat`: New feature or component
- `fix`: Bug fix
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `build`: Changes to build system or dependencies (package.json, tsconfig, etc.)
- `chore`: Maintenance tasks (lockfile updates, etc.)
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `perf`: Performance improvements
- `style`: Code style changes (formatting, semicolons, etc.)

**Scope Examples:**

- Core: `server`, `client`, `discovery`
- Tool domains: `contacts`, `calendars`, `conversations`, `workflows`, `campaigns`, `invoices`, `opportunities`, `payments`, `products`, `companies`, `custom-fields`, `emails`, `forms`, `funnels`, `locations`, `users`, etc.
- Tools/config: `tsconfig`, `tsup`, `vitest`, `oxlint`, `deps`, etc.

**Message Guidelines:**

- Use imperative mood ("add" not "added", "migrate" not "migrated")
- Keep under 72 characters
- Be specific but concise
- No period at the end

**Grouping Strategy:**

1. **Feature additions** - New components/files created
2. **Refactors/Updates** - Exports, imports, structural changes
3. **Build changes** - Dependencies, package.json, build config
4. **Lockfile** - Always separate commit for pnpm-lock.yaml
5. **Documentation** - README, migration docs, comments

**Examples:**

```
feat(contacts): add bulk upsert tool
refactor(server): simplify tool registration logic
feat(discovery): add dynamic tool loading
build(deps): upgrade @modelcontextprotocol/sdk
chore(deps): update pnpm lockfile for new dependencies
docs(tools): document calendar tool annotations
test(contacts): add contact search test cases
```

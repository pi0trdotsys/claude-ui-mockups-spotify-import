<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Keep this project a frontend-only TypeScript mockup with in-memory demo state; real Spotify authorization and Python integration belong to a subsequent implementation.
- Define visual tokens and feature styles in src/styles.css and use the shared Button for actions to keep the handoff consistent.

> ⚠️ **Warning**: This project is in active development and may undergo frequent breaking changes. The API, features, and functionality are not yet stable and may change significantly between versions. Please use with caution in production environments.

<div align="center">
    <img src="assets/logo.png" alt="Sailor Logo" height="200">
</div>
<br>

Plain-text markdown editor integrating tasks as a first-class citizen.

## Features
- Notes and Tasks in a single environment
- Include Zettelkasten note context alongside your task list
- Local-first, plain text format: notes in markdown, tasks in json
- Built on proven tooling with robust interfaces
- Cross-platform support
- Tauri is cool
- Svelte is cool
- In Rust We Trust

## Screenshots
<div align="center">
    <img src="assets/screenshots/title_page.png" alt="Title page" height="200" style="margin: 10px;">
    <img src="assets/screenshots/note_with_tasks.png" alt="Create and manage tasks directly within your notes" height="200" style="margin: 10px;">
    <img src="assets/screenshots/tasklist_with_tasks.png" alt="View and organize all your tasks in one place" height="200" style="margin: 10px;">
</div>

## Motivation
I work in a terminal most of the day, and I've enjoyed using tools like vimwiki, taskwarrior, and taskwiki to take notes, plan, brainstorm, and track any related (or unrelated) tasks. I find it especially helpful that I can record any tasks alongside all of my markdown notes, and they will be beautifully synced to my taskwarrior tasklist. Preserving the context is so important! I also like the simplicity and portability of plain text formats where a simple service like SyncThing can seamlessly sync data across multiple devices (for free!). However, when I leave work and want to access my data on mobile, I have no easy way of doing that. I've tried combinations of Obsidian, Acreom, Todoist, and TaskWarrior (mobile)... unfortunately none of them combine notes and tasks quite like taskwiki, and if I want to keep using taskwarrior on terminal, doing integration and sync is at best a complicated effort. I want to satisfy all 3 conditions in a single application:
- Notes and tasks together, where tasks can be created _inside notes_ arbitrarily, and the original context for a task can be easily referenced and linked to.
- Local-first, plain text format, so that I can sync across devices using SyncThing (or optionally some other cloud service)
- Cross-platform

## Architectural Proof
- Build on top of unix philosophy tools:
  - zk for note management
  - taskwarrior for task management (TaskChampion crate, the same backend taskwarrior itself uses)
  - don't reinvent the wheel, just integrate them and provide an interface
  - retain the ability for users to get the same experience on any terminal (ie. features are not baked into some gui/app/website)
- Use Taskwarrior's robust json interface to essentially use json as a plain text backend
- Inspired by taskwiki and Acreom, use a simple text id tag on task items to create and track the note-task association
- Tauri 2.0 to develop cross-platform

## Design goals
- Retain unix philosophy where possible - provide same experience on terminal as in the app
- Not sure how far I want to go yet on rich markdown interactions, there's a lot to cover and I'm not trying to compete with funded projects

## Roadmap
- Proof of concept:
  - [x] editor proof of concept
  - [X] taskwarrior backend proof of concept
  - [ ] zk backend proof of concept
  - [ ] mobile proof of concept
- Editor / UI/UX:
  - [ ] modify initial Lexical editor to preserve markdown syntax where it makes sense
    - we're still editing a plaintext file!
  - [ ] keybinds (vim mode?)
    - really should decide what stays in terminal editor and what this project provides
  - [ ] menu/settings
    - [ ] data dir selection (for using SyncThing folder!)
- Tasks:
  - [ ] **jump to note context**
  - [ ] view task list
  - [ ] create and edit tasks outside of notes
  - [ ] use more of taskwarrior's features
    - [ ] recurring
    - [ ] UDAs
    - [ ] priority
    - [ ] tags
    - [ ] projects
    - [ ] contexts
    - [ ] dependencies
  - [ ] calendar view
  - [ ] reminders
- Fun stuff:
  - [ ] LLM integration for task and note summaries, creation, and editing

## Tech Stack
- [zk](https://github.com/zk-org/zk)
- [taskwarrior](https://taskwarrior.org/)
- [rust](https://www.rust-lang.org/)
- [tauri 2.0](https://tauri.app/)
- [svelte](https://svelte.dev/)
- [typescript](https://www.typescriptlang.org/)
- [SyncThing](https://syncthing.net/)

## Alternatives | Inspiration | Related
Notetaking:
- [Obsidian](https://obsidian.md/)
- [zk.nvim](https://github.com/zk-org/zk.nvim)
- [zk](https://github.com/zk-org/zk)
- [vimwiki](https://github.com/vimwiki/vimwiki)
- [markview.nvim](https://github.com/OXY2DEV/markview.nvim)
- [obsidian.nvim](https://github.com/epwalsh/obsidian.nvim)
- [mkdnflow](https://github.com/jakewvincent/mkdnflow.nvim)

Task Management:
- [Superlist](https://www.superlist.com)
- [Todoist](https://todoist.com/)
- [taskwarrior](https://taskwarrior.org/)
- [taskwarrior-flutter](https://github.com/CCExtractor/taskwarrior-flutter) (mobile)

Task-Note Integration:
- [taskwiki](https://github.com/tools-life/taskwiki)
- [Acreom](https://github.com/acreom/acreom)
- [workflowy](https://www.workflowy.com/)
- [m_taskwarrior_d.nvim](https://github.com/huantrinh1802/m_taskwarrior_d.nvim) - like taskwiki, but without reliance on vimwiki
- org mode
- neorg (no tasks yet)
- AppFlowy
- AnyType
- Notion

## Maybe someday
- convert to Norg editor to compliment neorg  ?

## Contributing

## License
MIT

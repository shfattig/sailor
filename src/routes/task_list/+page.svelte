<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import { onMount } from "svelte";

  interface Task {
    id: string;
    description: string;
    due_date: string | null;
    done: boolean;
  }

  let tasks: Task[] = [];
  let error: string | null = null;

  async function loadTasks() {
    try {
      tasks = await invoke("get_all_tasks");
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to load tasks";
    }
  }

  async function toggleTask(taskId: string) {
    try {
      await invoke("toggle_task", { taskId });
      await loadTasks(); // Reload tasks to get updated state
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to update task";
    }
  }

  onMount(() => {
    loadTasks();
  });
</script>

<main class="container">
  <h1>Task List</h1>
  
  <div class="task-list">
    {#if error}
      <p class="error">{error}</p>
    {:else if tasks.length === 0}
      <p>No tasks found. Create a new task to get started!</p>
    {:else}
      <ul class="tasks">
        {#each tasks as task}
          <li class="task-item">
            <div class="task-content">
              <button
                class="checkmark-button"
                on:click={() => toggleTask(task.id)}
                aria-label={task.done ? "Mark as not done" : "Mark as done"}
              >
                <span class="checkmark" class:visible={task.done}>✓</span>
              </button>
              <span class="task-description" class:done={task.done}>
                {task.description}
              </span>
            </div>
            {#if task.due_date}
              <span class="task-due-date">Due: {new Date(task.due_date).toLocaleDateString()}</span>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </div>

  <div class="row">
    <a href="/" class="nav-link">Back to Home</a>
  </div>
</main>

<style>
  .container {
    margin: 0;
    padding-top: 5vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
  }

  .task-list {
    width: 100%;
    max-width: 600px;
    margin: 2em auto;
    padding: 1em;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .tasks {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .task-item {
    padding: 1em;
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1em;
  }

  .task-item:last-child {
    border-bottom: none;
  }

  .task-item:hover {
    background-color: #f5f5f5;
  }

  .task-content {
    display: flex;
    align-items: center;
    gap: 0.5em;
    min-width: 0;
    flex: 1;
  }

  .checkmark-button {
    background: none;
    border: none;
    padding: 0;
    width: 1.5em;
    height: 1.5em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .checkmark-button:hover {
    background: none;
  }

  .checkmark {
    opacity: 0;
    color: #24c8db;
    font-weight: bold;
    transition: opacity 0.2s;
  }

  .checkmark.visible {
    opacity: 1;
  }

  .task-item:hover .checkmark:not(.visible) {
    opacity: 0.5;
  }

  .task-description {
    flex: 1;
    min-width: 0;
    padding-right: 1em;
  }

  .task-description.done {
    text-decoration: line-through;
    color: #666;
  }

  .task-due-date {
    font-size: 0.9em;
    color: #666;
    white-space: nowrap;
    margin-left: auto;
  }

  .error {
    color: #e53935;
    padding: 1em;
    background-color: #ffebee;
    border-radius: 4px;
    margin: 0;
  }

  .nav-link {
    display: inline-block;
    margin: 1em 0;
    padding: 0.6em 1.2em;
    background-color: #24c8db;
    color: white;
    border-radius: 8px;
    text-decoration: none;
    transition: background-color 0.25s;
  }

  .nav-link:hover {
    background-color: #1fa7b8;
  }

  @media (prefers-color-scheme: dark) {
    .task-list {
      background-color: #1a1a1a;
      color: #f6f6f6;
    }

    .task-item {
      border-bottom-color: #333;
    }

    .task-item:hover {
      background-color: #2a2a2a;
    }

    .task-due-date {
      color: #aaa;
    }

    .error {
      background-color: #421c1c;
      color: #ff8a8a;
    }

    .checkmark-button:hover {
      background-color: rgba(36, 200, 219, 0.2);
    }

    .task-description.done {
      color: #888;
    }
  }
</style> 

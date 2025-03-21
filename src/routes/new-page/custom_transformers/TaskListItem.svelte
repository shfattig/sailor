<script lang="ts">
  // import { useLexicalNodeSelection } from "svelte-lexical";
  import type { TaskListItemNode } from "./taskItemNode";

  export let node: TaskListItemNode;

  // const selection = useLexicalNodeSelection(node);

  function handleDateChange(event: Event) {
    const newDate = (event.target as HTMLInputElement).value;
    node.setDueDate(newDate);
  }
</script>

<div class="task-list-item">
  <div class="task-content">
    <slot />
  </div>
  <input
    type="date"
    value={node.getDueDate() || ''}
    on:change={handleDateChange}
    class="task-date-input"
  />
</div>

<style>
  .task-list-item {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .task-content {
    flex: 1;
  }

  .task-date-input {
    padding: 4px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>

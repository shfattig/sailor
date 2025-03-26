<script lang="ts">
    import type { DateNode } from "./DateNode";
  
    export let node: DateNode;
  
    function handleDateChange(event: Event) {
      const newValue = (event.target as HTMLInputElement).value;
      node.setDate(newValue);
    }
  </script>
  
  <input
    type="date"
    value={node.getDate() || ''}
    on:change={handleDateChange}
    class="date-node"
  />

  <style>
    .date-node {
      padding: 8px 12px;
      border: 2px solid #e2e8f0;
      border-radius: 6px;
      font-size: 14px;
      color: #1a202c;
      background-color: green;
      transition: all 0.2s ease-in-out;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      cursor: pointer;
    }

    .date-node:hover {
      border-color: #cbd5e0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .date-node:focus {
      outline: none;
      border-color: #4299e1;
      box-shadow: 0 0 0 3px rgba(66,153,225,0.5);
    }
  </style>
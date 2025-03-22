<script lang="ts">
  // Task list page logic will go here
</script>

<main class="container">
  <h1>Task List</h1>
  
  <div class="task-list">
    <p>Your tasks will appear here</p>
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
  }
</style> 
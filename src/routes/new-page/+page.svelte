<script lang="ts">
  // Add any page-specific logic here
</script>

<main class="container">
  <h1>New Page</h1>
  <p>Welcome to the new page!</p>
  <div class="row">
    <a href="/">Back to Home</a>
  </div>
</main>

<style>
  .container {
    margin: 0;
    padding-top: 10vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .row {
    display: flex;
    justify-content: center;
    margin-top: 2em;
  }

  a {
    font-weight: 500;
    color: #646cff;
    text-decoration: inherit;
    padding: 0.6em 1.2em;
    border-radius: 8px;
    transition: color 0.25s;
  }

  a:hover {
    color: #535bf2;
  }

  @media (prefers-color-scheme: dark) {
    a:hover {
      color: #24c8db;
    }
  }
</style> 
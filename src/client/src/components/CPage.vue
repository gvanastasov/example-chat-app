<template>
    <main class="content flex-grow-1 bg-white p-4">
      <slot></slot>
    </main>
  </template>
  
  <script>
  export default {
    name: 'CPage',
  };
  </script>
  
  <style scoped>
  .content {
    overflow-y: auto;
    height: 100vh;
  }
  </style>
  
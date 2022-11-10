<template>
  <main class="flex">
    <!-- Sidebar -->
    <aside
      class="w-16 h-screen bg-primary bg-shadow-r flex flex-col items-center pt-6"
    >
      <div
        class="p-4 w-full flex justify-center hover:bg-black hover:bg-opacity-10 transition-colors cursor-pointer"
      >
        <mdicon name="lock-outline" />
      </div>

      <div
        class="p-4 w-full flex justify-center hover:bg-black hover:bg-opacity-10 transition-colors cursor-pointer mb-0 mt-auto"
      >
        <mdicon name="power" />
      </div>
    </aside>
    <article class="p-8">
      <h2 class="text-4xl text-primary">Passwords</h2>
    </article>
  </main>
</template>

<script setup lang="ts"></script>

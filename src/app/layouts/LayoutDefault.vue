<template>
  <div>
    <slot name="top"/>

    <main class="py-10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <slot/>
      </div>
    </main>
  </div>
</template>

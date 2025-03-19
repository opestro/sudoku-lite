<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Add meta tags for better mobile experience
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'theme-color', content: '#ffffff' }
  ],
  link: [
    { rel: 'apple-touch-icon', href: '/icon.png' }
  ]
});
</script>

<style>
</style>

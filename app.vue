<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications>
      <template #description="{ description }">
        <span v-html="description" />
      </template>
    </UNotifications>
  </div>
</template>

<script setup>
useHead({
  meta: [
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
  ],
});
</script>

<style>
body {
  font-family: Montserrat, sans-serif;
}
</style>

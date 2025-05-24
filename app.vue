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

<style>
body {
  font-family: Montserrat, sans-serif;
}
</style>

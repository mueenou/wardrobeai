<template>
  <div class="flex flex-col">
    <header
      class="flex min-h-14 lg:min-h-[55px] items-center gap-4 border-b dark:border-slate-800 px-6 sticky top-0 dark:bg-black z-10"
    >
      <div class="flex items-center w-full justify-end">
        <ClientOnly>
          <UTooltip :text="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
            <UButton
              :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
              color="gray"
              variant="ghost"
              aria-label="Theme"
              @click="isDark = !isDark"
            />
          </UTooltip>
          <template #fallback>
            <div class="w-8 h-8" />
          </template>
        </ClientOnly>
      </div>
    </header>
    <main class="m-8 border dark:border-slate-800 h-full rounded-xl">
      <slot />
    </main>
  </div>
</template>

<script setup>
const route = useRoute();
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});
</script>

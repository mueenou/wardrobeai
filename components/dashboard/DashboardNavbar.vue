<template>
  <div class="flex flex-col">
    <header
      class="flex min-h-14 lg:min-h-20 items-center gap-4 border-b dark:border-slate-800 px-6 sticky top-0 dark:bg-background z-10 bg-background"
    >
      <Icon
        name="lucide:menu"
        class="lg:hidden text-2xl cursor-pointer text-primary dark:text-gray-50"
        @click="uiStore.toggleSideBar"
      />
      <div class="flex items-center w-full justify-end">
        <ClientOnly>
          <UTooltip :text="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
            <Icon
              :name="isDark ? 'lucide:moon' : 'lucide:sun'"
              @click="isDark = !isDark"
              :class="`${
                isDark ? 'text-gray-50' : 'text-primary'
              } text-2xl cursor-pointer drop-shadow-md`"
            />
          </UTooltip>
          <template #fallback>
            <div class="w-8 h-8" />
          </template>
        </ClientOnly>
      </div>
    </header>
    <main class="dark:border-slate-800 h-full rounded-xl">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useUiStore } from "~/stores/ui";
const uiStore = useUiStore();
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

<template>
  <!-- Backdrop for mobile -->
  <div
    v-if="uiStore.showSideBar"
    class="fixed inset-0 bg-black/50 z-20 lg:hidden"
    @click="uiStore.toggleSideBar"
  ></div>
  <div
    class="border-r dark:border-slate-800 h-screen left-0 top-0 fixed lg:sticky lg:block z-30 w-[300px] bg-white dark:bg-background transition-transform duration-300"
    :class="[
      uiStore.showSideBar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <div class="flex h-full max-h-screen flex-col gap-2 sticky left-0">
      <div
        class="flex h-20 items-center justify-between border-b dark:border-slate-800 px-3 w-full dark:bg-background z-10 bg-background"
      >
        <nuxt-link to="/" class="mx-auto">
          <h1 class="font-black text-2xl text-primary dark:text-gray-100 uppercase">
            Wardrobe.AI
          </h1>
        </nuxt-link>
        <!-- Close button for mobile -->

        <Icon
          name="lucide:x"
          class="text-2xl dark:text-gray-100 lg:hidden p-2 hover:bg-primary-100 rounded-lg cursor-pointer text-primary"
          @click="uiStore.toggleSideBar"
        />
      </div>
      <div class="flex-1 overflow-auto py-2">
        <nav
          class="flex flex-col items-start px-4 gap-y-4 text-sm font-medium w-full h-full"
        >
          <nuxt-link
            to="/"
            class="flex items-center gap-x-2 w-full"
            :class="[
              route.path === '/'
                ? 'flex items-center gap-2 rounded-lg bg-primary-100 px-3 py-2 text-primary-900  transition-all hover:text-primary-900 dark:bg-primary-950 dark:text-primary-50 dark:hover:text-primary-50'
                : 'flex items-center gap-2 rounded-lg px-3 py-2 text-primary-500 transition-all hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-50',
            ]"
          >
            <div
              class="grid place-content-center border rounded-lg dark:bg-black dark:border-slate-800 border-slate-400 p-1 bg-white"
            >
              <Icon name="lucide:home" />
            </div>
            Home
          </nuxt-link>
          <nuxt-link
            to="/history"
            class="flex items-center gap-x-2 w-full"
            :class="[
              route.path === '/history'
                ? 'flex items-center gap-2 rounded-lg bg-primary-100 px-3 py-2 text-primary-900  transition-all hover:text-primary-900 dark:bg-primary-950 dark:text-primary-50 dark:hover:text-primary-50'
                : 'flex items-center gap-2 rounded-lg px-3 py-2 text-primary-500 transition-all hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-50',
            ]"
          >
            <div
              class="grid place-content-center border rounded-lg dark:bg-black dark:border-slate-800 border-slate-400 p-1 bg-white"
            >
              <Icon name="lucide:history" />
            </div>
            My Trips
          </nuxt-link>
          <nuxt-link
            to="/profile"
            class="flex items-center gap-x-2 w-full"
            :class="[
              route.path === '/profile'
                ? 'flex items-center gap-2 rounded-lg bg-primary-100 px-3 py-2 text-primary-900  transition-all hover:text-primary-900 dark:bg-primary-950 dark:text-primary-50 dark:hover:text-primary-50'
                : 'flex items-center gap-2 rounded-lg px-3 py-2 text-primary-500 transition-all hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-50',
            ]"
          >
            <div
              class="grid place-content-center border rounded-lg dark:bg-black dark:border-slate-800 border-slate-400 p-1 bg-white"
            >
              <Icon name="lucide:user" />
            </div>
            Profile
          </nuxt-link>
          <UDivider color="black" size="2xs" />
          <div v-if="user" class="flex items-center gap-x-4 my-1 justify-between w-full">
            <UAvatar
              size="md"
              src="https://avatars.githubusercontent.com/u/739984?v=4"
              alt="Avatar"
            />
            <div
              @click="signOut"
              class="flex items-center cursor-pointer gap-2 rounded-lg px-3 py-2 text-primary-500 transition-all hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-50"
            >
              <div
                class="grid place-content-center border rounded-lg dark:bg-black dark:border-slate-800 border-slate-400 p-1 bg-white"
              >
                <Icon name="lucide:log-out" />
              </div>
              Logout
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from "~/stores/ui";
const uiStore = useUiStore();
const user = useSupabaseUser();
const client = useSupabaseClient();
const route = useRoute();

async function signOut() {
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;
    navigateTo("/login");
  } catch (error) {
    throw error;
  }
}
</script>

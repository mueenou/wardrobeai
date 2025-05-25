<template>
  <div
    class="lg:block hidden border-r dark:border-slate-800 h-screen sticky left-0 top-0 z-10"
  >
    <div class="flex h-full max-h-screen flex-col gap-2 sticky left-0">
      <div
        class="flex h-20 items-center justify-between border-b dark:border-slate-800 px-3 w-full dark:bg-primary-950 z-10 bg-primary"
      >
        <nuxt-link
          to="/"
          class="mx-auto font-black text-2xl text-secondary dark:text-gray-100 uppercase"
        >
          <h1>Wardrobe.AI</h1>
        </nuxt-link>
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
          <div class="flex-grow"></div>
          <UDivider color="black" size="2xs" />
          <div v-if="user" class="flex items-center gap-x-4 my-1 justify-between w-full">
            <UAvatar
              size="md"
              src="https://avatars.githubusercontent.com/u/739984?v=4"
              alt="Avatar"
            />
            <UButton
              @click="signOut"
              label="Logout"
              variant="ghost"
              color="primary"
              icon="i-mdi:logout"
            />
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
const user = useSupabaseUser();
const client = useSupabaseClient();
const route = useRoute();

async function signOut() {
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;
    navigateTo("/login");
  } catch (error) {
    console.log(error.message);
  }
}
</script>

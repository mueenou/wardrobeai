<template>
  <div class="lg:block hidden border-r dark:border-slate-800 h-full">
    <div class="flex h-full max-h-screen flex-col gap-2">
      <div
        class="flex h-[55px] items-center justify-between border-b dark:border-slate-800 px-3 w-full sticky top-0 bg-black dark:bg-teal-900 z-10"
      >
        <nuxt-link to="/">
          <h1 class="font-bold">Wardrobe.AI</h1>
        </nuxt-link>
      </div>
      <div class="flex-1 overflow-auto py-2 h-full">
        <nav class="flex flex-col items-start px-4 text-sm font-medium w-full h-full">
          <nuxt-link
            to="/"
            class="flex items-center gap-x-2 w-full"
            :class="[
              route.path === '/'
                ? 'flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-slate-900  transition-all hover:text-slate-900 dark:bg-slate-800 dark:text-slate-50 dark:hover:text-slate-50'
                : 'flex items-center gap-2 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50',
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
                ? 'flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-slate-900  transition-all hover:text-slate-900 dark:bg-slate-800 dark:text-slate-50 dark:hover:text-slate-50'
                : 'flex items-center gap-2 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50',
            ]"
          >
            <div
              class="grid place-content-center border rounded-lg dark:bg-black dark:border-slate-800 border-slate-400 p-1 bg-white"
            >
              <Icon name="lucide:history" />
            </div>
            History
          </nuxt-link>
          <div class="flex-grow"></div>
          <div v-if="user" class="bottom-0">
            <p>{{ user.email }}</p>
            <UButton @click="signOut" label="Logout" variant="outline" color="white" />
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
    route.push("/login");
  } catch (error) {
    console.log(error.message);
  }
}
</script>

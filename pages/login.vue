<template>
  <div class="flex min-h-screen items-center justify-center">
    <!-- this is a register form with email and password and Github, Google provider -->
    <UContainer class="border rounded-lg px-10 py-10 w-[500px]">
      <UForm class="space-y-6" @submit="signIn">
        <h2 class="text-center font-bold">Login</h2>
        <UFormGroup label="Email" name="email">
          <UInput v-model="email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="password" type="password" />
        </UFormGroup>

        <p>{{ errorMsg }}</p>
        <p>{{ successMsg }}</p>

        <UButton type="submit" color="teal" block> Submit </UButton>
        <UButton block color="white" variant="outline" icon="i-mdi:github">
          GitHub
        </UButton>
        <UButton block color="white" variant="outline" icon="i-mdi:google">
          Google
        </UButton>
        <p class="text-center text-sm">
          Don't have an account?
          <span><nuxt-link to="/register" class="underline">Register</nuxt-link></span>
        </p>
      </UForm>
    </UContainer>
  </div>
</template>

<script setup>
const router = useRouter();
const client = useSupabaseClient();
const email = ref("");
const password = ref(null);
const errorMsg = ref(null);
const successMsg = ref(null);

async function signIn() {
  errorMsg.value = null;
  successMsg.value = null;
  try {
    const { error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
    router.push("/");
  } catch (error) {
    errorMsg.value = error.message;
  }
}
</script>

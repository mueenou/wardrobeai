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

        <p class="text-red-500">{{ errorMsg }}</p>

        <UButton type="submit" color="primary" block :loading="isLoading">
          {{ isLoading ? 'Signing in...' : 'Submit' }}
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
const toast = useToast();
const email = ref("");
const password = ref(null);
const errorMsg = ref(null);
const isLoading = ref(false);

async function signIn() {
  errorMsg.value = null;
  isLoading.value = true;
  
  try {
    const { error, data } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;

    toast.add({
      title: "Welcome back!",
      description: "Successfully signed in.",
      timeout: 3000,
      icon: "i-bx-check",
    });

    // Wait a moment for the auth state to update
    await new Promise(resolve => setTimeout(resolve, 100));

    // Redirect to home page - middleware will handle the rest
    router.push("/");
  } catch (error) {
    console.error("Login error:", error);
    errorMsg.value = error.message;
    toast.add({
      title: "Login failed",
      description: error.message,
      timeout: 3000,
      icon: "i-bx-error",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

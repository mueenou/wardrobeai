<template>
  <div class="flex min-h-screen items-center justify-center">
    <!-- this is a register form with email and password and Github, Google provider -->
    <UContainer class="border rounded-lg px-10 py-10 w-[500px]">
      <UForm class="space-y-6" @submit="signUp">
        <h2 class="text-center font-bold">Register</h2>
        <UFormGroup label="Email" name="email">
          <UInput v-model="email" />
        </UFormGroup>
        <UFormGroup label="Password" name="password">
          <UInput v-model="password" type="password" />
        </UFormGroup>

        <p class="text-red-500">{{ errorMsg }}</p>

        <UButton type="submit" color="primary" block :loading="isLoading">
          {{ isLoading ? "Creating account..." : "Submit" }}
        </UButton>
        <p class="text-center text-sm">
          Already have an account?
          <span><nuxt-link to="/login" class="underline">Login</nuxt-link></span>
        </p>
      </UForm>
    </UContainer>
  </div>
</template>

<script setup>
const client = useSupabaseClient();
const router = useRouter();
const toast = useToast();
const email = ref("");
const password = ref(null);
const errorMsg = ref(null);
const isLoading = ref(false);

async function signUp(event) {
  errorMsg.value = null;
  isLoading.value = true;

  try {
    const { error } = await client.auth.signUp({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;

    toast.add({
      title: "Account created successfully!",
      description: "You can now log in with your credentials.",
      timeout: 3000,
      icon: "i-bx-check",
    });

    // Redirect to login page
    router.push("/login");
  } catch (error) {
    errorMsg.value = error.message;
    toast.add({
      title: "Error creating account",
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

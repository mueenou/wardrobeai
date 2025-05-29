<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h2 class="text-2xl font-bold">Welcome to Wardrobe.AI</h2>
          <p class="text-gray-500 dark:text-gray-400 mt-2">
            Let's set up your preferences
          </p>
        </div>
      </template>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <UFormGroup label="Username" name="username">
          <UInput
            v-model="formData.username"
            placeholder="Choose a username"
            :error="errors.username"
          />
        </UFormGroup>

        <UFormGroup label="Gender" name="gender">
          <GenderSelector v-model="formData.gender" />
          <p v-if="errors.gender" class="text-red-500 text-sm mt-1">
            {{ errors.gender }}
          </p>
        </UFormGroup>

        <UFormGroup label="Ethnicity" name="ethnicity">
          <UInputMenu
            v-model="formData.ethnicity"
            :options="ethnicities"
            color="primary"
            :error="errors.ethnicity"
          />
        </UFormGroup>

        <UFormGroup label="Body Type" name="bodyType">
          <BodyLanguageSelector v-model="formData.bodyType" :gender="formData.gender" />
          <p v-if="errors.bodyType" class="text-red-500 text-sm mt-1">
            {{ errors.bodyType }}
          </p>
        </UFormGroup>

        <UButton type="submit" color="primary" block :loading="isSubmitting">
          Complete Setup
        </UButton>
      </form>
    </UCard>
  </div>
</template>

<script setup>
import { ETHNICITIES } from "~/constants/clothing";
import { useOutfitStore } from "~/stores/outfit";

definePageMeta({
  layout: "default",
  middleware: ["onboarding"],
});

const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();
const toast = useToast();
const outfitStore = useOutfitStore();

const formData = ref({
  username: "",
  gender: "",
  ethnicity: "Western European",
  bodyType: "",
});

const errors = ref({});
const isSubmitting = ref(false);

const ethnicities = ETHNICITIES;

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!formData.value.username.trim()) {
    errors.value.username = "Username is required";
    isValid = false;
  }

  if (!formData.value.gender) {
    errors.value.gender = "Please select your gender";
    isValid = false;
  }

  if (!formData.value.ethnicity) {
    errors.value.ethnicity = "Please select your ethnicity";
    isValid = false;
  }

  if (!formData.value.bodyType) {
    errors.value.bodyType = "Please select your body type";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  try {
    // Update user metadata with username
    const { error: updateError } = await client.auth.updateUser({
      data: { username: formData.value.username },
    });

    if (updateError) throw updateError;

    // Save preferences
    const { error: preferencesError } = await client.from("user_preferences").upsert({
      user_id: user.value.id,
      gender: formData.value.gender,
      ethnicity: formData.value.ethnicity,
      body_type: formData.value.bodyType,
    });

    if (preferencesError) throw preferencesError;

    // Update the Pinia outfit store with the new preferences
    outfitStore.updateSexe(formData.value.gender);
    outfitStore.updateEthnicity(formData.value.ethnicity);
    outfitStore.updateBodyType(formData.value.bodyType);

    toast.add({
      severity: "success",
      summary: "Success",
      description: "Your preferences have been saved",
      timeout: 3000,
    });

    // Redirect to home page
    router.push("/");
  } catch (error) {
    console.error("Error saving preferences:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      description: "Failed to save preferences. Please try again.",
      timeout: 5000,
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="w-full h-full p-4">
    <div class="space-y-6">
      <!-- Header Section -->
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold">Profile Settings</h2>
        <UButton
          :color="hasChanges ? 'primary' : 'gray'"
          @click="saveChanges"
          :loading="isSaving"
          :disabled="!hasChanges"
        >
          Save Changes
        </UButton>
      </div>

      <!-- User Info Section -->
      <div class="space-y-4 flex flex-col items-start">
        <h3 class="text-lg font-semibold">Personal Information</h3>
        <div class="flex items-center gap-4">
          <UAvatar
            size="xl"
            src="https://avatars.githubusercontent.com/u/739984?v=4"
            alt="Avatar"
          />
          <div class="space-y-2">
            <UFormGroup label="Username" name="username">
              <UInput v-model="username" placeholder="Enter your username" />
            </UFormGroup>
            <p class="font-medium">{{ user?.email }}</p>
            <p class="text-sm text-gray-500">
              Member since {{ formatDate(user?.created_at) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Preferences Section -->
      <div class="space-y-4 flex flex-col items-start">
        <h3 class="text-lg font-semibold">Preferences</h3>
        <div class="grid gap-4">
          <UFormGroup label="Gender" name="gender">
            <GenderSelector v-model="userPreferences.gender" />
          </UFormGroup>

          <UFormGroup label="Body Type" name="bodyType">
            <BodyLanguageSelector
              v-model="userPreferences.body_type"
              :gender="userPreferences.gender"
            />
          </UFormGroup>

          <UFormGroup label="Ethnicity" name="ethnicity">
            <UInputMenu
              v-model="userPreferences.ethnicity"
              :options="ethnicities"
              color="primary"
            />
          </UFormGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from "date-fns";
import { ETHNICITIES } from "~/constants/clothing";
import { useOutfitStore } from "~/stores/outfit";

definePageMeta({
  layout: "registered-layout",
  middleware: ["auth", "onboarding"],
});

const user = useSupabaseUser();
const client = useSupabaseClient();
const toast = useToast();
const outfitStore = useOutfitStore();

const username = ref("");
const userPreferences = ref({
  gender: "",
  ethnicity: "Western European",
  body_type: "",
});

// Add initial state tracking
const initialUsername = ref("");
const initialPreferences = ref({
  gender: "",
  ethnicity: "Western European",
  body_type: "",
});

const isSaving = ref(false);
const hasChanges = ref(false);

// Watch for changes in preferences and username
watch(
  [userPreferences, username],
  () => {
    // Compare current values with initial values
    const usernameChanged = username.value !== initialUsername.value;
    const preferencesChanged =
      userPreferences.value.gender !== initialPreferences.value.gender ||
      userPreferences.value.ethnicity !== initialPreferences.value.ethnicity ||
      userPreferences.value.body_type !== initialPreferences.value.body_type;

    hasChanges.value = usernameChanged || preferencesChanged;
  },
  { deep: true }
);

// Format date helper
const formatDate = (date) => {
  if (!date) return "";
  return format(new Date(date), "MMMM d, yyyy");
};

// Load user preferences and username
const loadUserPreferences = async () => {
  try {
    // Load preferences
    const { data, error } = await client
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.value.id)
      .single();

    if (error) throw error;

    if (data) {
      const preferences = {
        gender: data.gender || "",
        ethnicity: data.ethnicity || "Western European",
        body_type: data.body_type || "",
      };
      userPreferences.value = { ...preferences };
      initialPreferences.value = { ...preferences };
    }

    // Load username from user metadata
    const {
      data: { user: userData },
    } = await client.auth.getUser();
    const loadedUsername = userData?.user_metadata?.username || "";
    username.value = loadedUsername;
    initialUsername.value = loadedUsername;
  } catch (error) {
    console.error("Error loading user data:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      description: "Failed to load user data",
      timeout: 3000,
    });
  }
};

// Save user preferences and username
const saveChanges = async () => {
  isSaving.value = true;
  try {
    // Update username in user metadata
    if (username.value !== initialUsername.value) {
      const { error: updateError } = await client.auth.updateUser({
        data: { username: username.value },
      });
      if (updateError) throw updateError;
    }

    // First check if a record exists
    const { data: existingData } = await client
      .from("user_preferences")
      .select("id")
      .eq("user_id", user.value.id)
      .single();

    const { error } = await client.from("user_preferences").upsert(
      {
        id: existingData?.id,
        user_id: user.value.id,
        gender: userPreferences.value.gender,
        ethnicity: userPreferences.value.ethnicity,
        body_type: userPreferences.value.body_type,
      },
      {
        onConflict: "user_id",
      }
    );

    if (error) throw error;

    // Update the Pinia outfit store with the new preferences
    outfitStore.updateSexe(userPreferences.value.gender);
    outfitStore.updateEthnicity(userPreferences.value.ethnicity);
    outfitStore.updateBodyType(userPreferences.value.body_type);

    // Update initial values after successful save
    initialUsername.value = username.value;
    initialPreferences.value = { ...userPreferences.value };
    hasChanges.value = false;

    toast.add({
      severity: "success",
      summary: "Success",
      description: "Profile updated successfully",
      timeout: 3000,
    });
  } catch (error) {
    console.error("Error saving profile:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      description: `Failed to save profile: ${error.message || "Unknown error"}`,
      timeout: 5000,
    });
  } finally {
    isSaving.value = false;
  }
};

// Load preferences when component mounts
onMounted(() => {
  loadUserPreferences();
});

const ethnicities = ETHNICITIES;
</script>

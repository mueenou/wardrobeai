<template>
  <div class="w-full h-full p-4">
    <div v-if="trip" class="flex flex-col gap-y-6">
      <!-- Trip Header -->
      <UCard>
        <template #header>
          <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div class="flex flex-col gap-2 items-start">
              <UBadge class="font-bold text-lg">Trip to {{ trip.destination.toUpperCase() }}</UBadge>
              <p class="text-sm">
                From
                <span class="text-primary">{{
                  format(new Date(trip.start_date), "EEEE, MMMM d, yyyy")
                }}</span>
                to
                <span class="text-primary">{{
                  format(new Date(trip.end_date), "EEEE, MMMM d, yyyy")
                }}</span>
              </p>
            </div>
            <div class="flex gap-2">
              <UBadge color="gray">{{ trip.sexe }}</UBadge>
              <UBadge color="gray">{{ trip.ethnicity }}</UBadge>
            </div>
          </div>
        </template>
      </UCard>

      <!-- Clothes List -->
      <UAccordion
        :items="[{
          label: 'Packed Clothes',
          icon: 'i-heroicons-clipboard-document-list',
          slot: 'clothes-content'
        }]"
        variant="outline"
        color="primary"
        size="xl"
      >
        <template #clothes-content>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="item in trip.clothes_list"
              :key="item.id"
              class="p-4 border rounded-lg"
            >
              <h3 class="font-bold">{{ item.type }}</h3>
              <div class="flex items-center gap-2">
                <p class="flex items-center gap-2">
                  Color:
                  <div
                    class="w-4 h-4 rounded-full border border-gray-300"
                    :style="{ backgroundColor: item.color.hex || item.color.name.toLowerCase() }"
                  ></div>
                </p>
              </div>
              <p>Fabric: {{ item.fabric }}</p>
              <p>Style: {{ item.style }}</p>
            </div>
          </div>
        </template>
      </UAccordion>

      <!-- Outfit Suggestions -->
      <UCard v-if="trip.outfit_suggestions">
        <template #header>
          <h2 class="text-xl font-bold">Outfit Suggestions</h2>
        </template>
        <div class="flex flex-col gap-6">
          <div
            v-for="(outfit, day) in trip.outfit_suggestions"
            :key="day"
            class="rounded-lg p-4 shadow border border-gray-800"
          >
            <h3 class="text-base font-bold mb-2">{{ day }}</h3>
            <div class="grid md:grid-cols-2 gap-4 items-center">
              <div class="flex flex-col gap-2 items-start">
                <p><span class="font-semibold">Outfit:</span> {{ outfit.Outfit }}</p>
                <p>
                  <span class="font-semibold">Style Theme:</span>
                  {{ outfit["Style Theme"] }}
                </p>
                <p>
                  <span class="font-semibold">Perfect for:</span>
                </p>
                <div class="flex flex-wrap gap-2">
                  <UBadge
                    v-for="activity in outfit['Perfect for']"
                    :key="activity"
                    color="gray"
                    class="text-xs"
                  >
                    {{ activity }}
                  </UBadge>
                </div>
                <UButton
                  v-if="!outfit.imageUrl"
                  @click="generateImage(day, outfit)"
                  :loading="loadingImages[day]"
                  color="primary"
                  class="mt-2"
                >
                  Generate Image
                </UButton>
              </div>
              <div v-if="outfit.imageUrl" class="flex justify-center">
                <div v-if="outfit.imageUrl" class="mt-2">
                  <img
                    :src="outfit.imageUrl"
                    :alt="`Outfit for day ${day}`"
                    class="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    @click="openImageModal(outfit.imageUrl)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>
    <div v-else class="flex justify-center items-center h-full">
      <p class="text-lg font-bold">Loading trip details...</p>
    </div>

    <!-- Image Modal -->
    <UModal v-model="isModalOpen" :ui="{ width: 'max-w-4xl' }">
      <div class="p-4">
        <img
          v-if="selectedImage"
          :src="selectedImage"
          alt="Full size outfit"
          class="w-full h-auto rounded-lg"
        />
      </div>
    </UModal>
  </div>
</template>

<script setup>
import { format } from "date-fns";
import { useOutfitStore } from "~/stores/outfit";

definePageMeta({
  layout: "registered-layout",
});

const route = useRoute();
const outfitStore = useOutfitStore();
const loadingImages = ref({});
const isModalOpen = ref(false);
const selectedImage = ref(null);

// Fetch trip data
const { data: trip } = await useFetch(`/api/get-trip/${route.params.id}`);

// If trip data is loaded, set it in the store
watch(
  trip,
  (newTrip) => {
    if (newTrip) {
      outfitStore.setTripData(newTrip);
    }
  },
  { immediate: true }
);

const generateImage = async (day, outfit) => {
  try {
    loadingImages.value[day] = true;
    await outfitStore.generateOutfitImage(day, outfit);
    // Update the local trip data with the new image
    if (trip.value?.outfit_suggestions) {
      trip.value.outfit_suggestions[day] = {
        ...outfit,
        imageUrl: outfitStore.outfitSuggestions[day].imageUrl,
      };
    }
  } catch (error) {
    console.error("Error generating image:", error);
  } finally {
    loadingImages.value[day] = false;
  }
};

const openImageModal = (imageUrl) => {
  selectedImage.value = imageUrl;
  isModalOpen.value = true;
};
</script>

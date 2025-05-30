<template>
  <div class="w-full h-full p-2">
    <div v-if="trip" class="flex flex-col gap-y-2">
      <!-- Trip Header -->
      <UCard>
        <template #header>
          <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div class="flex flex-col gap-2 items-start">
              <UBadge class="font-bold text-lg"
                >Trip to {{ trip.destination.toUpperCase() }}</UBadge
              >
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
        :items="[
          {
            label: 'Packed Clothes',
            icon: 'lucide:luggage',
            slot: 'clothes-content',
          },
        ]"
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
                <div class="flex items-center gap-2">
                  Color:
                  <div
                    class="w-4 h-4 rounded-full border border-gray-300"
                    :style="{
                      backgroundColor: item.color.hex || item.color.name.toLowerCase(),
                    }"
                  ></div>
                </div>
              </div>
              <p>Fabric: {{ item.fabric }}</p>
              <p>Style: {{ item.style }}</p>
            </div>
          </div>
        </template>
      </UAccordion>

      <!-- Outfit Suggestions -->
      <h2 class="text-xl font-bold">Outfit Suggestions</h2>
      <UDivider />
      <OutfitSuggestions :trip-id="route.params.id" />
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
  middleware: ["auth", "onboarding"],
});

const route = useRoute();
const outfitStore = useOutfitStore();
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

const openImageModal = (imageUrl) => {
  selectedImage.value = imageUrl;
  isModalOpen.value = true;
};
</script>

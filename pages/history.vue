<template>
  <div class="w-full h-full p-4">
    <div class="flex flex-col lg:flex-row gap-4 h-full">
      <!-- Left side: Trips list -->
      <div class="w-full lg:w-2/3 flex flex-col gap-y-4 overflow-y-auto">
        <UCard
          v-if="trips.length > 0"
          v-for="trip in trips"
          :key="trip.id"
          @click="selectTrip(trip)"
          :class="[
            selectedTrip?.id === trip.id ? 'border border-primary' : 'ring-0 border',
          ]"
          class="ring-0 transition-colors duration-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-primary-950/70"
        >
          <template #header>
            <div class="flex flex-col md:flex-row gap-2 justify-between items-center">
              <UBadge class="font-bold min-w-[55px] grid place-content-center text-md"
                >Trip to {{ trip.destination }}</UBadge
              >
              <UBadge
                :color="new Date(trip.start_date) > new Date() ? 'green' : 'gray'"
                variant="soft"
                class="ml-2"
              >
                {{ new Date(trip.start_date) > new Date() ? "Upcoming" : "Past" }}
              </UBadge>
              <p class="text-sm flex-grow flex items-center gap-2">
                <span class="text-primary">{{
                  format(new Date(trip.start_date), "MMM d")
                }}</span>
                <Icon name="lucide:arrow-right" class="inline-block" />
                <span class="text-primary">{{
                  format(new Date(trip.end_date), "MMM d, yyyy")
                }}</span>
              </p>
              <div class="flex gap-2 items-center">
                <UBadge v-if="trip.sexe" color="gray" variant="soft">{{
                  trip.sexe
                }}</UBadge>
                <UBadge v-if="trip.ethnicity" color="gray" variant="soft">{{
                  trip.ethnicity
                }}</UBadge>
                <UBadge v-if="trip.outfit_suggestions" color="primary" variant="soft">
                  <div class="flex items-center gap-1">
                    <Icon name="i-heroicons-photo" class="w-4 h-4" />
                    {{
                      Object.values(trip.outfit_suggestions).filter(
                        (outfit) => outfit.imageUrl
                      ).length
                    }}
                  </div>
                </UBadge>
              </div>
              <div class="flex gap-2">
                <NuxtLink :to="`/trip/${trip.id}`">
                  <UButton
                    icon="i-heroicons-arrow-right"
                    color="primary"
                    variant="ghost"
                  />
                </NuxtLink>
              </div>
            </div>
          </template>
        </UCard>
        <div v-else class="font-bold">No trips recorded yet.</div>
      </div>

      <!-- Right side: Image carousel -->
      <div class="w-full lg:w-1/3 lg:sticky lg:top-24 lg:self-start" ref="carouselRef">
        <UCard v-if="selectedTrip">
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold">Outfit Images</h2>
              <UBadge color="primary">{{ selectedTrip.destination }}</UBadge>
            </div>
          </template>
          <div v-if="selectedTrip.outfit_suggestions">
            <div
              v-if="
                Object.entries(selectedTrip.outfit_suggestions).some(
                  ([_, outfit]) => outfit.imageUrl
                )
              "
            >
              <UCarousel
                v-slot="{ item }"
                :items="
                  Object.entries(selectedTrip.outfit_suggestions).filter(
                    ([_, outfit]) => outfit.imageUrl
                  )
                "
                :ui="{
                  item: 'basis-full',
                  container: 'rounded-lg overflow-hidden',
                  indicators: {
                    wrapper:
                      'absolute flex items-center justify-center gap-2 bottom-4 inset-x-0',
                  },
                }"
                class="relative aspect-[3/4]"
                indicators
                arrows
              >
                <div class="relative w-full h-full">
                  <img
                    :src="item[1].imageUrl"
                    :alt="`Outfit for ${item[0]}`"
                    class="w-full h-full object-cover"
                    @click="showImage(item[1].imageUrl)"
                  />
                  <div
                    class="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2"
                  >
                    <p class="font-bold">{{ item[0] }}</p>
                    <p class="text-sm">{{ item[1].Outfit }}</p>
                  </div>
                </div>
              </UCarousel>
            </div>
            <div
              v-else
              class="flex flex-col items-center justify-center py-8 text-gray-500 gap-2"
            >
              <Icon name="i-heroicons-photo" class="w-12 h-12" />
              <p>No images generated for this trip yet</p>
              <p class="text-sm">
                Click on "Generate look" in the trip details to create images
              </p>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            No outfit suggestions available for this trip
          </div>
        </UCard>
        <div v-else class="h-full flex items-center justify-center text-gray-500">
          Select a trip to view outfit images
        </div>
      </div>
    </div>

    <!-- Scroll to top button -->
    <UButton
      v-if="showScrollTop"
      icon="i-heroicons-arrow-up"
      color="primary"
      variant="solid"
      class="fixed bottom-4 right-4 lg:hidden rounded-full shadow-lg"
      @click="scrollToTop"
    />

    <!-- Image viewer -->
    <ImageSlideViewer
      v-model="isSliderOpen"
      :image-url="currentImage"
      image-alt="Outfit Image"
    />
  </div>
</template>

<script setup>
import { useUserStore } from "~/stores/user";
import { storeToRefs } from "pinia";
import { format } from "date-fns";

definePageMeta({
  layout: "registered-layout",
});

const userStore = useUserStore();
const { data: trips } = await useFetch("/api/get-trips");
const carouselRef = ref(null);
const showScrollTop = ref(false);

// Image viewer state
const isSliderOpen = ref(false);
const currentImage = ref("");
const selectedTrip = ref(null);

// Handle scroll events
const handleScroll = () => {
  if (window.innerWidth < 1024) {
    // Only on mobile
    showScrollTop.value = window.scrollY > 300;
  }
};

// Scroll to top function
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// Add scroll event listener
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

// Remove scroll event listener
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const selectTrip = (trip) => {
  selectedTrip.value = trip;
  // Scroll to carousel on mobile after a short delay to ensure the DOM is updated
  nextTick(() => {
    if (window.innerWidth < 1024) {
      // lg breakpoint
      setTimeout(() => {
        carouselRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  });
};

const showImage = (imageUrl) => {
  if (imageUrl) {
    currentImage.value = imageUrl;
    isSliderOpen.value = true;
  }
};
</script>

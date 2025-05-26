<template>
  <div class="w-full h-full p-4">
    <div class="flex flex-col gap-y-4">
      <UCard v-if="trips.length > 0" v-for="trip in trips">
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
            </div>
            <NuxtLink :to="`/trip/${trip.id}`">
              <UButton class="block" label="See details..." variant="ghost" />
            </NuxtLink>
          </div>
        </template>
      </UCard>
      <div v-else class="font-bold">No trips recorded yet.</div>
    </div>
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
</script>

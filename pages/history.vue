<template>
  <div class="w-full h-full p-4">
    <div class="flex flex-col gap-y-4">
      <UCard v-if="trips.length > 0" v-for="trip in trips">
        <template #header>
          <div class="flex flex-col md:flex-row gap-2 justify-between items-center">
            <UBadge class="font-bold min-w-[55px] grid place-content-center text-md"
              >Trip to {{ trip.destination }}</UBadge
            >
            <p class="text-sm flex-grow">
              From the
              <span class="text-primary">{{
                format(new Date(trip.start_date), "EEEE, MMMM d, yyyy")
              }}</span>
              to
              <span class="text-primary">{{
                format(new Date(trip.end_date), "EEEE, MMMM d, yyyy")
              }}</span>
            </p>
            <UButton class="block" label="See details..." variant="ghost" />
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
// const { trips } = storeToRefs(userStore);

const { data: trips } = await useFetch("/api/get-trips");
</script>

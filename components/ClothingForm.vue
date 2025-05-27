<template>
  <div class="min-w-fit rounded-xl text-base overflow-y-auto px-6 py-6 relative">
    <div class="flex items-center">
      <p class="font-bold text-4xl text-primary">Clothes listing form</p>
      <UTooltip
        text="Tell us all the clothes you are bringing
          with you"
        :popper="{ placement: 'right' }"
        :openDelay="300"
      >
        <Icon name="lucide:info" class="text-primary" />
      </UTooltip>
    </div>
    <UDivider class="my-2" />
    <form @submit.prevent>
      <div class="flex flex-col gap-4 w-fit items-center mx-auto">
        <!-- User Preferences Display -->
        <div class="flex gap-6 items-center p-4 rounded-lg">
          <div class="flex items-center gap-2 bg-primary/10 py-2 px-4 rounded-full">
            <Icon name="lucide:user" class="text-primary" />
            <span class="font-medium">Gender:</span>
            <span class="text-gray-600 dark:text-gray-300 font-bold">{{ sexe }}</span>
          </div>
          <div class="flex items-center gap-2 bg-primary/10 py-2 px-4 rounded-full">
            <Icon name="lucide:globe" class="text-primary" />
            <span class="font-medium">Ethnicity:</span>
            <span class="text-gray-600 dark:text-gray-300 font-bold">{{
              ethnicity
            }}</span>
          </div>
        </div>
      </div>
      <div class="flex gap-4 w-fit items-center">
        <UFormGroup label="Destination (optional)" size="sm" class="my-2">
          <UInput
            v-model="destination"
            placeholder="Where are you going?"
            color="primary"
          />
        </UFormGroup>
        <UFormGroup
          :label="`Trip dates ${
            outfitStore.numberOfDays > 0 ? `- ${outfitStore.numberOfDays} days` : ''
          }`"
          size="sm"
          class="my-2"
        >
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton icon="lucide:calendar-days">
              {{ format(selected.start, "d MMM, yyy") }} -
              {{ format(selected.end, "d MMM, yyy") }}
            </UButton>

            <template #panel="{ close }">
              <div
                class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800"
              >
                <DatePicker v-model="selected" @close="close" />
              </div>
            </template>
          </UPopover>
        </UFormGroup>
      </div>
      <UButton label="Add new cloth" @click="isOpen = true" />

      <div
        v-if="isOpen"
        class="fixed top-0 left-0 w-full h-full flex items-center justify-center"
      >
        <UModal v-model="isOpen" :ui="{ base: 'sm:max-w-6xl' }">
          <ClothingModal @submitted="isOpen = false" />
        </UModal>
      </div>
    </form>
    <ClothTable v-model="clothesList" />
    <UButton
      v-if="clothesList.length > 0"
      label="Submit"
      color="indigo"
      variant="outline"
      size="md"
      class="mt-2 absolute bottom-2 right-6"
      @click="$emit('generate')"
    />
  </div>
</template>

<script setup>
import { useOutfitStore } from "~/stores/outfit";
import { ETHNICITIES } from "~/constants/clothing";
import { format } from "date-fns";

const isOpen = ref(false);

const outfitStore = useOutfitStore();
const { clothesList, sexe, ethnicity, tripDates, destination } = storeToRefs(outfitStore);
const emit = defineEmits(["generate"]);

const ethnicities = ETHNICITIES;

// update the trip dates in the store
const selected = computed({
  get: () => tripDates.value,
  set: (newDates) => outfitStore.updateTripDates(newDates),
});

// Load user preferences when component mounts
onMounted(async () => {
  await outfitStore.loadUserPreferences();
});
</script>

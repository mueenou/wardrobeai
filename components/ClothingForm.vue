<template>
  <div
    class="min-w-fit rounded-xl text-base overflow-y-auto px-2 md:px-4 sm:px-6 py-4 sm:py-6 relative min-h-screen"
  >
    <div class="flex items-center justify-between flex-col gap-4 sm:flex-row">
      <div class="flex items-center">
        <p class="font-bold text-2xl sm:text-4xl text-primary">Clothes listing form</p>
        <UTooltip
          text="Tell us all the clothes you are bringing
            with you"
          :popper="{ placement: 'right' }"
          :openDelay="300"
        >
          <Icon name="lucide:info" class="text-primary" />
        </UTooltip>
      </div>
    </div>
    <UDivider class="my-2" />
    <form @submit.prevent>
      <div class="flex flex-col gap-4 w-full sm:w-fit items-center mx-auto">
        <!-- User Preferences Display -->
        <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center p-4 rounded-lg">
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
      <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-fit items-center">
        <UFormGroup
          label="Destination (optional)"
          size="sm"
          class="my-2 w-full sm:w-auto"
        >
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
          class="my-2 sm:w-auto"
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
      <div class="flex justify-center w-full">
        <UButton
          label="Add new cloth"
          @click="isOpen = true"
          class="w-full sm:w-auto"
          icon="lucide:plus"
        />
      </div>

      <!-- Manual Modal Implementation -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isOpen"
          class="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <!-- Background overlay -->
          <div
            class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
            @click="isOpen = false"
          ></div>

          <!-- Modal panel -->
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-if="isOpen"
                class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-7xl"
              >
                <div class="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    class="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none"
                    @click="isOpen = false"
                  >
                    <span class="sr-only">Close</span>
                    <Icon name="lucide:x" class="h-6 w-6" />
                  </button>
                </div>
                <ClothingModal @submitted="isOpen = false" />
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </form>
    <ClothTable v-model="clothesList" />
    <UButton
      v-if="clothesList.length > 0"
      label="Submit"
      color="primary"
      variant="solid"
      size="md"
      class="absolute right-2 md:right-4 mt-4"
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

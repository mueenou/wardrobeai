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
        <UFormGroup size="lg" class="my-2">
          <UTooltip text="Ethnicity" :popper="{ placement: 'right' }" :openDelay="300">
            <UInputMenu
              color="primary"
              @change="outfitStore.updateEthnicity($event)"
              :value="ethnicity"
              :options="ethnicities"
            />
          </UTooltip>
        </UFormGroup>
        <UFormGroup size="sm" class="my-2">
          <GenderSelector v-model="sexe" />
        </UFormGroup>
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
            <UButton icon="i-heroicons-calendar-days-20-solid">
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

      <UModal v-model="isOpen" :ui="{ base: 'sm:max-w-4xl' }">
        <UCard
          :ui="{
            base: 'w-full',
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          }"
        >
          <ClothingModal @submitted="isOpen = false" />
        </UCard>
      </UModal>
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
</script>

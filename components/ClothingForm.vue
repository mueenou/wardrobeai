<template>
  <div class="w-full rounded-xl text-sm overflow-y-auto px-6 py-6">
    <p class="font-medium text-lg text-primary">Clothes listing form</p>
    <p class="dark:text-neutral-300 text-sm">
      This is the place where you are going to tell us all the clothes you are bringing
      with you
    </p>
    <UDivider class="my-2" />
    <form @submit.prevent>
      <!-- <URadioGroup
        @change="outfitStore.updateSexe($event)"
        legend="What is your gender?"
        :options="sexeOptions"
        :model-value="sexe"
      /> -->
      <h2 class="font-bold uppercase text-lg">Main Informations</h2>
      <div class="flex gap-4 w-fit items-center">
        <UFormGroup label="What is your gender?" size="sm" class="my-2">
          <GenderSelector v-model="sexe" />
        </UFormGroup>
        <UFormGroup label="Ethnicity" size="sm" class="my-2">
          <UInputMenu
            color="primary"
            @change="outfitStore.updateEthnicity($event)"
            :value="ethnicity"
            :options="ethnicities"
          />
        </UFormGroup>
      </div>
      <div class="flex gap-4 w-fit items-center">
        <UFormGroup label="Destination (optional)" size="sm" class="my-2">
          <UInput
            @input="outfitStore.updateDestination($event.target.value)"
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
      <template>
        <UModal title="Modal with title">
          <UButton label="Open" color="neutral" variant="subtle" />

          <template #body> </template>
        </UModal>
      </template>
    </form>
    <ClothTable v-model="clothesList" />
    <div class="text-right" v-if="clothesList.length > 0">
      <UButton
        label="Submit"
        color="indigo"
        variant="outline"
        size="md"
        class="mt-4"
        @click="$emit('generate')"
      />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useOutfitStore } from "~/stores/outfit";
import { ETHNICITIES } from "~/constants/clothing";
import { format } from "date-fns";

const outfitStore = useOutfitStore();
const { clothesList, sexe, ethnicity, tripDates } = storeToRefs(outfitStore);
const emit = defineEmits(["generate"]);

const ethnicities = ETHNICITIES;

// update the trip dates in the store
const selected = computed({
  get: () => tripDates.value,
  set: (newDates) => outfitStore.updateTripDates(newDates),
});

const toast = useToast();
// Fonction pour ajouter un vêtement
const addClothToList = () => {
  const cloth = {
    id: clothesList.value.length + 1,
    type: selectedClothingType.value,
    color: selectedColor.value,
    fabric: selectedFabric.value,
    style: selectedStyleTag.value,
  };
  outfitStore.addCloth(cloth);
  toast.add({
    title: "Cloth added",
    description: `A <b>${selectedClothingType.value}</b> color <b>${selectedColor.value.name}</b> was added to the list.`,
    timeout: 3000,
    icon: "i-bx-check",
  });
};
</script>

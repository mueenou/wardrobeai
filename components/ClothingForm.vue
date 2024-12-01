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
      <UFormGroup label="What is your gender?" size="sm" class="my-2">
        <GenderSelector v-model="sexe" />
      </UFormGroup>
      <UFormGroup label="Skin color" size="sm" class="my-2">
        <UInputMenu
          color="primary"
          @change="outfitStore.updateSkinColor($event)"
          :value="skinColor"
          :options="skinColors"
        />
      </UFormGroup>
      <UFormGroup label="Clothing type" size="sm" class="my-2">
        <!-- <UInputMenu
          color="primary"
          v-model="selectedClothingType"
          :options="clothingTypes"
          icon="mingcute:t-shirt-fill"
        /> -->
        <ClothImageInput v-model="selectedClothingType" />
      </UFormGroup>
      <UFormGroup label="Cloth color" size="sm" class="my-2">
        <!-- <UInputMenu
          color="primary"
          v-model="selectedColor"
          :options="clothingColors"
          placeholder="Select a person"
          by="id"
          option-attribute="name"
          :search-attributes="['name', 'color']"
        >
          <template #option="{ option: set }">
            <span :class="`h-3 w-8 rounded`" :style="`background-color: ${set.hex}`" />
            <span class="truncate">{{ set.name }}</span>
          </template>
        </UInputMenu> -->
        <ColorSelector v-model="selectedColor" />
      </UFormGroup>
      <UFormGroup label="Clothing fabric" size="sm" class="my-2">
        <UInputMenu
          color="primary"
          v-model="selectedFabric"
          :options="clothingFabrics"
          icon="mdi:fabric"
        />
      </UFormGroup>
      <UFormGroup label="Weather suitability" size="sm" class="my-2">
        <UInputMenu
          color="primary"
          v-model="selectedWeatherSuitability"
          :options="weatherSuitability"
          icon="material-symbols:matter"
        />
      </UFormGroup>
      <UFormGroup label="Style" size="sm" class="my-2">
        <UInputMenu
          color="primary"
          v-model="selectedStyleTag"
          :options="styleTags"
          icon="material-symbols:style"
        />
      </UFormGroup>
      <UFormGroup label="Number of days" size="sm" class="my-2">
        <UInput
          @input="outfitStore.updateNumberOfDays(Number($event.target.value))"
          type="number"
          color="primary"
          min="1"
          placeholder="How many days?"
        />
      </UFormGroup>

      <UFormGroup label="Destination (optional)" size="sm" class="my-2">
        <UInput
          @input="outfitStore.updateDestination($event.target.value)"
          placeholder="Where are you going?"
          color="primary"
        />
      </UFormGroup>
      <UFormGroup label="Trip dates" size="sm" class="my-2">
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
      <div class="w-full justify-end text-right">
        <UButton
          @click="addClothToList"
          label="Add cloth"
          color="indigo"
          variant="outline"
          size="sm"
          class="mt-2"
        />
      </div>
    </form>
    <ClothTable v-model="clothesList" />
    <div class="text-right" v-if="clothesList.length > 0">
      <UButton
        label="Submit"
        color="indigo"
        variant="outline"
        size="sm"
        class="mt-4"
        @click="$emit('generate')"
      />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useOutfitStore } from "~/stores/outfit";
import { useUserStore } from "~/stores/user";
import { CLOTHING_TYPES } from "~/constants/clothing";
import { CLOTHING_COLORS } from "~/constants/clothing";
import { FABRICS } from "~/constants/clothing";
import { WEATHER_SUITABILITY } from "~/constants/clothing";
import { STYLE_TAGS } from "~/constants/clothing";
import { SKIN_COLORS } from "~/constants/clothing";
import { sub, format, isSameDay } from "date-fns";

const userStore = useUserStore();
const outfitStore = useOutfitStore();
const { clothesList, sexe, skinColor, tripDates } = storeToRefs(outfitStore);
const { trips } = storeToRefs(userStore);
const emit = defineEmits(["generate"]);

// update the trip dates in the store
const selected = computed({
  get: () => tripDates.value,
  set: (newDates) => outfitStore.updateTripDates(newDates),
});

// Constantes pour les options des selects
const sexeOptions = [
  { value: "man", label: "Man" },
  { value: "woman", label: "Woman" },
];
const clothingTypes = CLOTHING_TYPES;
const clothingColors = CLOTHING_COLORS;
const clothingFabrics = FABRICS;
const skinColors = SKIN_COLORS;
const weatherSuitability = WEATHER_SUITABILITY;
const styleTags = STYLE_TAGS;

// Refs pour le formulaire
const selectedClothingType = ref(CLOTHING_TYPES[0]);
const selectedColor = ref(CLOTHING_COLORS[0]);
const selectedFabric = ref(FABRICS[0]);
const selectedWeatherSuitability = ref(WEATHER_SUITABILITY[0]);
const selectedStyleTag = ref(STYLE_TAGS[0]);

const toast = useToast();
// Fonction pour ajouter un vêtement
const addClothToList = () => {
  const cloth = {
    id: clothesList.value.length + 1,
    type: selectedClothingType.value,
    color: selectedColor.value,
    fabric: selectedFabric.value,
    weather: selectedWeatherSuitability.value,
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

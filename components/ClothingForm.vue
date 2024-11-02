<template>
  <div class="w-full rounded-xl text-sm overflow-y-auto px-6 py-6">
    <p class="font-medium">Clothes listing form</p>
    <p class="text-neutral-600 font-light text-xs">
      This is the place where you are going to tell us all the clothes you are bringing
      with you
    </p>
    <UDivider class="my-2" />
    <form @submit.prevent>
      <UFormGroup label="Clothing type" size="2xs" class="my-2">
        <UInputMenu
          v-model="selectedClothingType"
          :options="clothingTypes"
          icon="mingcute:t-shirt-fill"
        />
      </UFormGroup>
      <UFormGroup label="Cloth color" size="2xs" class="my-2">
        <UInputMenu
          v-model="selectedColor"
          :options="clothingColors"
          placeholder="Select a person"
          by="id"
          option-attribute="name"
          :search-attributes="['name', 'color']"
        >
          <template #option="{ option: set }">
            <span class="h-2 w-2 rounded-full" :class="`${set.color}`" />
            <span class="truncate">{{ set.name }}</span>
          </template>
        </UInputMenu>
      </UFormGroup>
      <!-- ... autres champs du formulaire ... -->
      <div class="w-full justify-end text-right">
        <UButton
          @click="addClothToList"
          label="Add cloth"
          color="teal"
          variant="outline"
          size="2xs"
          class="mt-2"
        />
      </div>
    </form>
    <ClothTable v-model="clothesList" />
    <div class="text-right" v-if="clothesList.length > 0">
      <UButton
        label="Submit"
        color="teal"
        variant="outline"
        size="2xs"
        class="mt-4"
        @click="$emit('generate')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CLOTHING_TYPES } from "~/constants/clothing";
import { CLOTHING_COLORS } from "~/constants/clothing";
import { FABRICS } from "~/constants/clothing";
import { WEATHER_SUITABILITY } from "~/constants/clothing";
import { STYLE_TAGS } from "~/constants/clothing";
import { defineProps } from "vue";
import type { Cloth } from "~/types/index.ts";

const props = defineProps<{
  modelValue: Cloth[];
  numberOfDays: number;
  destination: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: Cloth[]];
  generate: [];
}>();

const clothingTypes = CLOTHING_TYPES;
const clothingColors = CLOTHING_COLORS;

// Refs pour le formulaire
const selectedClothingType = ref(CLOTHING_TYPES[0]);
const selectedColor = ref(CLOTHING_COLORS[0]);
const selectedFabric = ref(FABRICS[0]);
const selectedWeatherSuitability = ref(WEATHER_SUITABILITY[0]);
const selectedStyleTag = ref(STYLE_TAGS[0]);

// Computed pour la liste des vêtements
const clothesList = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

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
  clothesList.value.push(cloth);
};
</script>

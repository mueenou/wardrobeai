<template>
  <div class="w-full rounded-xl text-sm overflow-y-auto px-6 py-6">
    <p class="font-medium">Clothes listing form</p>
    <p class="text-neutral-600 font-light text-xs">
      This is the place where you are going to tell us all the clothes you are bringing
      with you
    </p>
    <UDivider class="my-2" />
    <form @submit.prevent>
      <URadioGroup
        @change="emit('update:sexe', $event)"
        legend="What is your gender?"
        :options="sexeOptions"
        :model-value="props.sexe"
      />
      <UFormGroup label="Skin color" size="2xs" class="my-2">
        <UInputMenu
          @change="emit('update:skinColor', $event)"
          :value="props.skinColor"
          :options="skinColors"
        />
      </UFormGroup>
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
            <span :class="`h-3 w-8 rounded`" :style="`background-color: ${set.hex}`" />
            <span class="truncate">{{ set.name }}</span>
          </template>
        </UInputMenu>
      </UFormGroup>
      <UFormGroup label="Clothing fabric" size="2xs" class="my-2">
        <UInputMenu
          v-model="selectedFabric"
          :options="clothingFabrics"
          icon="mdi:fabric"
        />
      </UFormGroup>
      <UFormGroup label="Weather suitability" size="2xs" class="my-2">
        <UInputMenu
          v-model="selectedWeatherSuitability"
          :options="weatherSuitability"
          icon="material-symbols:matter"
        />
      </UFormGroup>
      <UFormGroup label="Style" size="2xs" class="my-2">
        <UInputMenu
          v-model="selectedStyleTag"
          :options="styleTags"
          icon="material-symbols:style"
        />
      </UFormGroup>
      <UFormGroup label="Number of days" size="2xs" class="my-2">
        <UInput
          @input="emit('update:numberOfDays', Number($event.target.value))"
          type="number"
          min="1"
          placeholder="How many days?"
        />
      </UFormGroup>

      <UFormGroup label="Destination (optional)" size="2xs" class="my-2">
        <UInput
          @input="emit('update:destination', $event.target.value)"
          placeholder="Where are you going?"
        />
      </UFormGroup>
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

<script setup>
import { CLOTHING_TYPES } from "~/constants/clothing";
import { CLOTHING_COLORS } from "~/constants/clothing";
import { FABRICS } from "~/constants/clothing";
import { WEATHER_SUITABILITY } from "~/constants/clothing";
import { STYLE_TAGS } from "~/constants/clothing";
import { SKIN_COLORS } from "~/constants/clothing";

const props = defineProps({
  modelValue: Array,
  numberOfDays: Number,
  destination: String,
  sexe: String,
  skinColor: String,
});

const emit = defineEmits([
  "update:modelValue",
  "generate",
  "update:sexe",
  "update:numberOfDays",
  "update:destination",
  "update:skinColor",
]);

// const changeSexe = ($event) => {
//   emit("update:sexe", $event);
// };

// const changeNoDays = ($event) => {
//   emit("update:numberOfDays", Number($event.target.value));
// };

// const changeDestination = ($event) => {
//   emit("update:destination", $event.target.value);
// };

// const changeSkinColor = ($event) => {
//   emit("update:skinColor", $event);
// };

// Constantes pour les options des selects
const sexeOptions = [
  { value: "man", label: "Man", icon: "i-bx-male" },
  { value: "woman", label: "Woman", icon: "i-bx-female" },
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

// Computed pour la liste des vêtements
const clothesList = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

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
  clothesList.value.push(cloth);
  toast.add({
    title: "Cloth added",
    description: `A <b>${selectedClothingType.value}</b> color <b>${selectedColor.value.name}</b> was added to the list.`,
    timeout: 3000,
    icon: "i-bx-check",
  });
};
</script>

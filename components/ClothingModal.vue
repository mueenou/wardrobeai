<template>
  <form>
    <UFormGroup label="Clothing type" size="sm" class="my-2">
      <ClothImageInput v-model="selectedClothingType" />
    </UFormGroup>
    <UFormGroup label="Cloth color" size="sm" class="my-2">
      <ColorSelector v-model="selectedColor" />
    </UFormGroup>
    <div class="flex flex-wrap gap-x-4 items-center">
      <UFormGroup label="Clothing fabric" size="sm" class="my-2">
        <UInputMenu
          color="primary"
          v-model="selectedFabric"
          :options="clothingFabrics"
          icon="mdi:fabric"
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
    </div>
    <div class="w-full justify-end text-right">
      <UButton
        @click="addClothToList"
        label="Add cloth"
        color="indigo"
        variant="outline"
        size="md"
        class="mt-2"
      />
    </div>
  </form>
</template>

<script setup>
import { CLOTHING_TYPES } from "~/constants/clothing";
import { CLOTHING_COLORS } from "~/constants/clothing";
import { FABRICS } from "~/constants/clothing";
import { STYLE_TAGS } from "~/constants/clothing";

// Constantes pour les options des selects
const clothingFabrics = FABRICS;

const styleTags = STYLE_TAGS;

// Refs pour le formulaire
const selectedClothingType = ref(CLOTHING_TYPES[0]);
const selectedColor = ref(CLOTHING_COLORS[0]);
const selectedFabric = ref(FABRICS[0]);
const selectedStyleTag = ref(STYLE_TAGS[0]);
</script>

<style scoped></style>

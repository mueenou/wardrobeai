<template>
  <form>
    <UFormGroup label="Clothing type" size="sm" class="my-2">
      <ClothImageInput v-model="selectedClothingType" />
    </UFormGroup>
    <UFormGroup label="Cloth color" size="sm" class="my-2">
      <ColorSelector v-model="selectedColor" />
    </UFormGroup>
    <div class="flex flex-wrap gap-x-[0.1rem] items-center">
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
import { storeToRefs } from "pinia";
import { CLOTHING_TYPES } from "~/constants/clothing";
import { CLOTHING_COLORS } from "~/constants/clothing";
import { FABRICS } from "~/constants/clothing";
import { STYLE_TAGS } from "~/constants/clothing";
const emit = defineEmits(["submitted"]);
const outfitStore = useOutfitStore();
const { clothesList } = storeToRefs(outfitStore);
const toast = useToast();

// Constantes pour les options des selects
const clothingFabrics = FABRICS;
const styleTags = STYLE_TAGS;

// Refs pour le formulaire
const selectedClothingType = ref(CLOTHING_TYPES[0]);
const selectedColor = ref(CLOTHING_COLORS[0]);
const selectedFabric = ref(FABRICS[0]);
const selectedStyleTag = ref(STYLE_TAGS[0]);

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
  emit("submitted"); // let the parent know to close the modal
};
</script>

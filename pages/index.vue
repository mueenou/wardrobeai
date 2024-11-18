<template>
  <div class="w-full flex flex-col md:flex-row h-full">
    <ClothingForm
      v-model="clothesList"
      v-model:sexe="sexe"
      v-model:numberOfDays="numberOfDays"
      v-model:destination="destination"
      v-model:skinColor="skinColor"
      @generate="generateOutfits"
    />
    <UDivider orientation="vertical" type="dashed" />
    <!-- <div
      class="w-full rounded-xl pl-4 flex flex-col gap-y-4 text-sm overflow-y-auto pr-4 py-2 relative"
    >
      <div
        v-if="isLoading"
        class="sticky top-10 text-4xl flex flex-col justify-center items-center h-full"
      >
        <p class="text-sm">Please wait until we find the best outfits for you !</p>
        <Icon name="eos-icons:three-dots-loading" class="text-teal-600" />
      </div>
      <UCard
        v-if="outfitSuggestions && isLoading === false"
        v-for="[day, outfit] in Object.entries(outfitSuggestions)"
        :key="outfit"
      >
        <template #header>
          <div class="flex gap-2 items-center font-bold">
            <UBadge class="font-bold min-w-[55px] grid place-content-center">{{
              day
            }}</UBadge>
            <p class="text-xs flex-grow">{{ outfit.Outfit }}</p>
            <UTooltip text="See how it looks in an image!">
              <UButton
                size="2xs"
                variant="outline"
                class="self-end"
                :icon="`${
                  isOutfitLoading(day) ? 'eos-icons:three-dots-loading' : 'bi:stars'
                }`"
                @click="generateOutfitImage(day, outfit)"
              >
                {{ isOutfitLoading(day) ? "Generating" : "" }}
              </UButton>
            </UTooltip>
          </div>
        </template>
        <div class="grid grid-cols-2 w-full items-center">
          <div class="flex gap-2">
            <p>{{ outfit["Style Theme"] }}</p>
            <p>{{ outfit["Weather"] }}</p>
            <p>{{ outfit["Accessories"] ? outfit["Accessories"] : "" }}</p>
          </div>
          <div>
            <img
              v-if="outfit.imageUrl"
              :src="outfit.imageUrl"
              alt="Outfit"
              class="cursor-pointer"
              @click="showImage(outfit.imageUrl)"
            />
          </div>
        </div>
        <template #footer>
          <div class="flex gap-x-2 w-full justify-end">
            <UBadge color="blue" v-for="pf in outfit['Perfect for']">{{ pf }}</UBadge>
          </div>
        </template>
      </UCard>
      <div v-else>No outfit suggestions available.</div>
      <ImageSlideViewer
        v-model="isSliderOpen"
        :image-url="currentImage"
        image-alt="Outfit Image"
      />
    </div>
    
    <UDivider orientation="vertical" type="dashed" /> -->
    <OutfitSuggestions
      :outfit-suggestions="outfitSuggestions"
      :is-loading="isLoading"
      @update-outfit="updateOutfit"
      :sexe="sexe"
      :skinColor="skinColor"
    />
  </div>
</template>

<script setup>
const isSliderOpen = ref(false);
const currentImage = ref("");

const showImage = (imageUrl) => {
  currentImage.value = imageUrl;
  isSliderOpen.value = true;
};

const clothesList = ref([]);

// Loading state
const isLoading = ref(false);
const outfitSuggestions = ref([]);

const sexe = ref("male");
const skinColor = ref("fair");
const numberOfDays = ref(1);
const destination = ref("");

// Fonction pour générer le prompt OpenAI
const generateOOTDPrompt = () => {
  // Organiser les vêtements par catégorie pour un prompt plus structuré
  const categorizedClothes = clothesList.value.reduce((acc, item) => {
    const category = item.type;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({
      color: item.color.name,
      fabric: item.fabric,
      weather: item.weather,
      style: item.style,
    });
    return acc;
  }, {});

  // Construire le prompt
  const prompt = `As a personal fashion stylist, create ${
    numberOfDays.value
  } daily outfit combinations for a ${skinColor.value} skinned ${sexe.value} for a ${
    numberOfDays.value
  }-day trip${destination.value ? ` to ${destination.value}` : ""}.

Available Clothing Items:
${Object.entries(categorizedClothes)
  .map(
    ([category, items]) =>
      `${category}:\n${items
        .map(
          (item) =>
            `- ${item.color} ${category} (${item.fabric}, ${item.weather} weather, ${item.style} style)`
        )
        .join("\n")}`
  )
  .join("\n\n")}

Please provide:
1. ${numberOfDays.value} different daily outfit combinations
2. Consider weather suitability and style consistency
3. For each day, specify:
   - Morning to evening outfit
   - Style theme of the day
   - Weather appropriateness
   - Suggested activities this outfit would be perfect for

Format each day as an object:
"Day X:
- Outfit: String
- Style Theme: String
- Weather: String
- Perfect for: [activities]"

Additional considerations:
- Ensure outfits are coordinated and color-matched
- Mix and match items efficiently for the ${numberOfDays.value}-day period
- Consider versatility and reusability of items
- Suggest possible accessories from the available items`;
  console.log(prompt);
  return prompt;
};

const generateOutfits = async () => {
  try {
    isLoading.value = true;

    const response = await $fetch("/api/generate-outfits", {
      method: "POST",
      body: {
        prompt: generateOOTDPrompt(),
      },
    });

    if (response) {
      outfitSuggestions.value = JSON.parse(response);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    isLoading.value = false;
  }
};

// Fonction pour transformer un outfit en prompt pour DALL-E
const createImagePrompt = (outfitDetails) => {
  const prompt = `Create a realistic fashion photography of a ${
    skinColor.value
  } skinned ${sexe.value} wearing an outfit consisting of ${outfitDetails.Outfit}.
The style is ${outfitDetails["Style Theme"]}, suitable for ${outfitDetails.Weather}.
The outfit should be photographed on a simple background.
Focus on showcasing the outfit's details and how the pieces work together.
${
  outfitDetails.Accessories !== "None"
    ? `Include these accessories: ${outfitDetails.Accessories}.`
    : ""
}
Style this as a modern fashion magazine photo shoot.`;

  return prompt;
};

// Définir un Map pour le statut de chargement de chaque outfit
const loadingStates = ref(new Map());

// Fonction pour gérer le chargement d'un outfit spécifique
const setOutfitLoading = (day, isLoading) => {
  loadingStates.value.set(day, isLoading);
};

// Fonction pour vérifier si un outfit spécifique est en cours de chargement
const isOutfitLoading = (day) => {
  return loadingStates.value.get(day) || false;
};

// Fonction pour générer l'image d'un outfit spécifique
const generateOutfitImage = async (day, outfit) => {
  try {
    setOutfitLoading(day, true);

    // Créer le prompt pour cet outfit spécifique
    const imagePrompt = createImagePrompt(outfit);

    // Appeler l'API pour générer l'image
    const response = await $fetch("/api/generate-image", {
      method: "POST",
      body: { prompt: imagePrompt },
    });

    // Stocker l'URL de l'image avec l'outfit
    outfitSuggestions.value[day] = {
      ...outfitSuggestions.value[day],
      imageUrl: response.data[0].url,
    };
  } catch (error) {
    console.error("Error generating outfit image:", error);
  } finally {
    setOutfitLoading(day, false);
  }
};

// const isGenerating = ref(false);
// const progressValue = ref(0);
// const generationStatus = ref("");
// const imageUrl = ref("");

// Simuler la progression pendant la génération
// const startProgressSimulation = () => {
//   progressValue.value = 0;
//   const interval = setInterval(() => {
//     if (progressValue.value < 90) {
//       progressValue.value += 2;
//     }
//   }, 1000);
//   return interval;
// };

// const generateImage = async (day, outfit) => {
//   try {
//     setOutfitLoading(day, true);
//     isGenerating.value = true;
//     generationStatus.value = "Initiating image generation...";

//     // Démarrer la simulation de progression
//     const progressInterval = startProgressSimulation();

//     const response = await $fetch("/api/generate-midjourney", {
//       method: "POST",
//       body: {
//         prompt: createImagePrompt(outfit),
//         aspectRatio: "16:9",
//       },
//     });

//     // Arrêter la simulation et finaliser la progression
//     clearInterval(progressInterval);
//     progressValue.value = 100;

//     if (response.status === "success") {
//       imageUrl.value = response.imageUrl;
//       outfitSuggestions.value[day] = {
//         ...outfitSuggestions.value[day],
//         imageUrl: response.data[0].url,
//       };
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   } finally {
//     isGenerating.value = false;
//     generationStatus.value = "";
//     setOutfitLoading(day, false);
//   }
// };

// États
// const clothesList = ref<Cloth[]>([]);
// const outfitSuggestions = ref<Record<string, OutfitDetails>>({});
// const isLoading = ref(false);
// const numberOfDays = ref(1);
// const destination = ref("");

// // Fonction pour générer le prompt OpenAI
// const generateOOTDPrompt = () => {
//   // ... votre fonction existante ...
// };

// // Fonction pour générer les tenues
// const generateOutfits = async () => {
//   try {
//     isLoading.value = true;
//     const response = await $fetch<string>("/api/generate-outfits", {
//       method: "POST",
//       body: {
//         prompt: generateOOTDPrompt(),
//       },
//     });

//     if (response) {
//       outfitSuggestions.value = JSON.parse(response);
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   } finally {
//     isLoading.value = false;
//   }
// };

// Fonction pour mettre à jour une tenue
const updateOutfit = (day, outfit) => {
  console.log(outfit);
  outfitSuggestions.value[day] = outfit;
};
</script>

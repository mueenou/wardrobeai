<template>
  <div class="w-full flex flex-col md:flex-row h-full">
    <div class="w-full rounded-xl text-sm overflow-y-auto px-6 py-6">
      <p class="font-medium">Clothes listing form</p>
      <p class="text-neutral-600 font-light text-xs">
        This is the place where you are going to tell us all the clothes you are bringing
        with you
      </p>
      <UDivider class="my-2" />
      <form action="">
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
        <UFormGroup label="Clothing fabric" size="2xs" class="my-2">
          <UInputMenu v-model="selectedFabric" :options="fabrics" icon="mdi:fabric" />
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
            v-model="numberOfDays"
            type="number"
            min="1"
            placeholder="How many days?"
          />
        </UFormGroup>

        <UFormGroup label="Destination (optional)" size="2xs" class="my-2">
          <UInput v-model="destination" placeholder="Where are you going?" />
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
          @click="generateOutfits"
        />
      </div>
    </div>
    <UDivider orientation="vertical" type="dashed" />
    <div
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
    <!-- <ClothingForm
      v-model="clothesList"
      :number-of-days="numberOfDays"
      :destination="destination"
      @generate="generateOutfits"
    />
    <UDivider orientation="vertical" type="dashed" />
    <OutfitSuggestions
      :outfit-suggestions="outfitSuggestions"
      :is-loading="isLoading"
      @update-outfit="updateOutfit"
    /> -->
  </div>
</template>

<script setup lang="ts">
const isSliderOpen = ref(false);
const currentImage = ref("");

const showImage = (imageUrl) => {
  currentImage.value = imageUrl;
  isSliderOpen.value = true;
};
// clothing types
const clothingTypes = ref([
  "Shirt",
  "T-shirt",
  "Blouse",
  "Sweater",
  "Hoodie",
  "Jacket",
  "Coat",
  "Pants",
  "Jeans",
  "Shorts",
  "Skirt",
  "Dress",
  "Suit",
  "Blazer",
  "Vest",
  "Sweatpants",
  "Joggers",
  "Leggings",
  "Cardigan",
  "Tank Top",
  "Polo Shirt",
  "Swimsuit",
  "Scarf",
  "Hat",
  "Gloves",
  "Socks",
  "Shoes",
  "Sandals",
  "Boots",
  "Sneakers",
  "Heels",
  "Flats",
  "Flip-Flops",
]);
const selectedClothingType = ref(clothingTypes.value[0]);

// Colors
const clothingColors = ref([
  { id: 1, name: "Black", color: "bg-slate-900" },
  { id: 2, name: "White", color: "bg-white" },
  { id: 3, name: "Gray", color: "bg-slate-500" },
  { id: 4, name: "Navy Blue", color: "bg-blue-800" },
  { id: 5, name: "Blue", color: "bg-blue-500" },
  { id: 6, name: "Sky Blue", color: "bg-blue-300" },
  { id: 7, name: "Red", color: "bg-red-500" },
  { id: 8, name: "Maroon", color: "bg-red-800" },
  { id: 9, name: "Pink", color: "bg-pink-400" },
  { id: 10, name: "Hot Pink", color: "bg-pink-500" },
  { id: 11, name: "Purple", color: "bg-purple-500" },
  { id: 12, name: "Lavender", color: "bg-purple-300" },
  { id: 13, name: "Green", color: "bg-green-500" },
  { id: 14, name: "Olive Green", color: "bg-green-800" },
  { id: 15, name: "Yellow", color: "bg-yellow-400" },
  { id: 16, name: "Orange", color: "bg-orange-500" },
  { id: 17, name: "Brown", color: "bg-stone-800" },
  { id: 18, name: "Beige", color: "bg-slate-200" },
  { id: 19, name: "Cream", color: "bg-slate-100" },
  { id: 20, name: "Teal", color: "bg-primary-600" },
  { id: 21, name: "Turquoise", color: "bg-teal-400" },
  { id: 22, name: "Gold", color: "bg-yellow-500" },
  { id: 23, name: "Silver", color: "bg-slate-300" },
  { id: 24, name: "Burgundy", color: "bg-red-900" },
  { id: 25, name: "Khaki", color: "bg-slate-400" },
]);
const selectedColor = ref(clothingColors.value[0]);

// Fabrics
const fabrics = ref([
  "Cotton",
  "Linen",
  "Wool",
  "Polyester",
  "Nylon",
  "Silk",
  "Rayon",
  "Acrylic",
  "Denim",
  "Leather",
  "Suede",
  "Corduroy",
  "Jersey",
  "Velvet",
  "Lace",
  "Satin",
  "Cashmere",
  "Fleece",
  "Spandex",
]);
const selectedFabric = ref(fabrics.value[0]);

// Weather Suitability
const weatherSuitability = ref([
  "Hot",
  "Warm",
  "Cool",
  "Cold",
  "Rainy",
  "Snowy",
  "Windy",
  "Humid",
  "Dry",
  "All-Weather",
]);
const selectedWeatherSuitability = ref(weatherSuitability.value[0]);

// Style Tags
const styleTags = ref([
  "Casual",
  "Formal",
  "Business Casual",
  "Sporty",
  "Athleisure",
  "Smart Casual",
  "Chic",
  "Elegant",
  "Vintage",
  "Streetwear",
  "Bohemian",
  "Minimalist",
  "Trendy",
  "Preppy",
  "Punk",
  "Glam",
  "Retro",
  "Beachwear",
  "Activewear",
  "Outdoor",
  "Loungewear",
  "Party",
  "Festival",
  "Holiday",
  "Resort",
]);
const selectedStyleTag = ref(styleTags.value[0]);

interface Cloth {
  type: string;
  color: { id: number; name: string; color: string };
  fabric: string;
  weather: string;
  style: string;
}

const clothesList = ref<Cloth[]>([]);

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

const selectedColumns = [
  { key: "type", label: "Type" },
  { key: "color", label: "Color" },
  { key: "fabric", label: "Fabric" },
  { key: "weather", label: "Weather" },
  { key: "style", label: "Style" },
];

// Loading state
const isLoading = ref(false);
const outfitSuggestions = ref([]);
// Handle delete action
const handleDelete = async (item) => {
  clothesList.value = clothesList.value.filter((cloth) => cloth.id !== item.id);
};

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
  } daily outfit combinations for a ${numberOfDays.value}-day trip${
    destination.value ? ` to ${destination.value}` : ""
  }.

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

  return prompt;
};

const generateOutfits = async () => {
  try {
    isLoading.value = true;

    const response = await $fetch<string>("/api/generate-outfits", {
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
const createImagePrompt = (outfitDetails: any) => {
  const prompt = `Create a realistic fashion photography of a person wearing an outfit consisting of ${
    outfitDetails.Outfit
  }.
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
const loadingStates = ref(new Map<string, boolean>());

// Fonction pour gérer le chargement d'un outfit spécifique
const setOutfitLoading = (day: string, isLoading: boolean) => {
  loadingStates.value.set(day, isLoading);
};

// Fonction pour vérifier si un outfit spécifique est en cours de chargement
const isOutfitLoading = (day: string) => {
  return loadingStates.value.get(day) || false;
};

// Fonction pour générer l'image d'un outfit spécifique
const generateOutfitImage = async (day: string, outfit: any) => {
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

// // Fonction pour mettre à jour une tenue
// const updateOutfit = (day: string, outfit: OutfitDetails) => {
//   outfitSuggestions.value[day] = outfit;
// };
</script>

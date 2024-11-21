// stores/outfit.js
import { defineStore } from "pinia";

export const useOutfitStore = defineStore("outfit", {
  state: () => ({
    clothesList: [],
    sexe: "male",
    skinColor: "fair",
    numberOfDays: 1,
    destination: "",
    outfitSuggestions: null,
    isLoading: false,
  }),

  actions: {
    updateClothesList(newList) {
      this.clothesList = newList;
    },
    addCloth(cloth) {
      this.clothesList.push(cloth);
    },
    removeCloth(id) {
      this.clothesList = this.clothesList.filter((cloth) => cloth.id !== id);
    },
    updateSexe(value) {
      this.sexe = value;
    },
    updateSkinColor(value) {
      this.skinColor = value;
    },
    updateNumberOfDays(value) {
      this.numberOfDays = value;
    },
    updateDestination(value) {
      this.destination = value;
    },
    // Clothes list management
    updateClothesList(newList) {
      this.clothesList = newList;
    },

    addCloth(cloth) {
      this.clothesList.push(cloth);
    },

    removeCloth(id) {
      this.clothesList = this.clothesList.filter((cloth) => cloth.id !== id);
    },

    // Outfit management
    updateOutfit(day, outfit) {
      if (this.outfitSuggestions) {
        this.outfitSuggestions = {
          ...this.outfitSuggestions,
          [day]: outfit,
        };
      }
    },

    // Generate prompt for OpenAI
    generateOOTDPrompt() {
      const categorizedClothes = this.clothesList.reduce((acc, item) => {
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

      return `As a personal fashion stylist, create ${
        this.numberOfDays
      } daily outfit combinations for a ${this.skinColor} skinned ${
        this.sexe
      } for a ${this.numberOfDays}-day trip${
        this.destination ? ` to ${this.destination}` : ""
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
      1. ${this.numberOfDays} different daily outfit combinations
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
      - Mix and match items efficiently for the ${this.numberOfDays}-day period
      - Consider versatility and reusability of items
      - Suggest possible accessories from the available items`;
    },

    // API calls
    async generateOutfits() {
      try {
        this.isLoading = true;
        const response = await $fetch("/api/generate-outfits", {
          method: "POST",
          body: {
            prompt: this.generateOOTDPrompt(),
          },
        });

        if (response) {
          this.outfitSuggestions = JSON.parse(response);
        }
      } catch (error) {
        console.error("Error:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    createImagePrompt(outfitDetails) {
      return `Create a realistic fashion photography for a ${
        this.skinColor
      } skinned ${this.sexe} wearing an outfit consisting of ${
        outfitDetails.Outfit
      }. 
      The style is ${outfitDetails["Style Theme"]}, suitable for ${
        outfitDetails.Weather
      }. 
      The outfit should be photographed on a simple background.
      Focus on showcasing the outfit's details and how the pieces work together.
      ${
        outfitDetails.Accessories !== "None"
          ? `Include these accessories: ${outfitDetails.Accessories}.`
          : ""
      }
      Style this as a modern fashion magazine photo shoot.`;
    },

    async generateOutfitImage(day, outfit) {
      try {
        const imagePrompt = this.createImagePrompt(outfit);

        const response = await $fetch("/api/generate-image", {
          method: "POST",
          body: { prompt: imagePrompt },
        });

        this.updateOutfit(day, {
          ...outfit,
          imageUrl: response.data[0].url,
        });
      } catch (error) {
        console.error("Error generating outfit image:", error);
        throw error;
      }
    },
  },
});

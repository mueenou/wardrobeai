// stores/outfit.js
import { defineStore } from "pinia";
import { sub, format, isSameDay } from "date-fns";
import { useUserStore } from "~/stores/user";

export const useOutfitStore = defineStore("outfit", {
  state: () => ({
    clothesList: [],
    sexe: "",
    ethnicity: "Western European",
    numberOfDays: 1,
    tripDates: {
      start: sub(new Date(), { days: 14 }),
      end: new Date(),
    },
    destination: "",
    outfitSuggestions: null,
    isLoading: false,
    currentTripId: null,
    loadingOutfits: new Map(),
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
    updateEthnicity(value) {
      this.ethnicity = value;
    },
    updateTripDates(dates) {
      this.tripDates = dates;
      const startDate = new Date(dates.start);
      const endDate = new Date(dates.end);
      const diffTime = Math.abs(endDate - startDate);
      this.numberOfDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    },
    updateDestination(value) {
      this.destination = value;
    },
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
          style: item.style,
        });
        return acc;
      }, {});

      return `As a personal fashion stylist, create ${
        this.numberOfDays
      } daily outfit combinations for a ${this.ethnicity} skinned ${
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
                  `- ${item.color} ${category} (${item.fabric}, ${item.style} style)`
              )
              .join("\n")}`
        )
        .join("\n\n")}
      
      Please provide:
      1. ${this.numberOfDays} different daily outfit combinations
      2. Consider style consistency
      3. For each day, specify:
         - Morning to evening outfit
         - Style theme of the day
         - Suggested activities this outfit would be perfect for
      
      Format each day as an object:
      "Day X:
      - Outfit: String
      - Style Theme: String
      - Perfect for: [activities]"
      
      Additional considerations:
      - Ensure outfits are coordinated and color-matched
      - Mix and match items efficiently for the ${this.numberOfDays}-day period
      - Consider versatility and reusability of items
      - Suggest possible accessories from the available items`;
    },

    async addTripDataToUserStore() {
      const user = useSupabaseUser();
      const userStore = useUserStore();
      const trip = {
        clothes_list: this.clothesList,
        start_date: this.tripDates.start,
        end_date: this.tripDates.end,
        destination: this.destination,
        outfit_suggestions: this.outfitSuggestions,
        user_id: user.id,
        sexe: this.sexe,
        ethnicity: this.ethnicity,
      };
      userStore.addTrip(trip);
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
          const userStore = useUserStore();
          const trip = {
            clothes_list: this.clothesList,
            start_date: this.tripDates.start,
            end_date: this.tripDates.end,
            destination: this.destination,
            outfit_suggestions: this.outfitSuggestions,
            sexe: this.sexe,
            ethnicity: this.ethnicity,
          };
          userStore.addTrip(trip);
          const result = await fetch("/api/add-trip", {
            method: "POST",
            body: JSON.stringify(trip),
            headers: { "Content-Type": "application/json" },
          });
          const data = await result.json();
          const newTrip = data[0];
          this.currentTripId = newTrip.id;
          return newTrip;
        }
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    createImagePrompt(outfitDetails) {
      let prompt = `Create a realistic full body head to feet fashion photography for a ${this.ethnicity} skinned ${this.sexe} wearing an outfit consisting of ${outfitDetails.Outfit}. 
      The style is ${outfitDetails["Style Theme"]}. 
      The outfit should be photographed in ${this.destination}. It should be a png image.
      Focus on showcasing the outfit's details and how the pieces work together.`;
      return prompt;
    },

    async generateOutfitImage(day, outfit) {
      try {
        // Set loading state for this specific outfit
        this.loadingOutfits.set(day, true);

        const imagePrompt = this.createImagePrompt(outfit);

        const response = await $fetch("/api/generate-image", {
          method: "POST",
          body: { prompt: imagePrompt },
        });

        // Upload the base64 image to Supabase storage
        const uploadResponse = await $fetch("/api/upload-outfit-image", {
          method: "POST",
          body: {
            image: response.image,
            tripId: this.currentTripId,
            day: day,
          },
        });

        // Update the outfit with the new image URL
        const updatedOutfit = {
          ...outfit,
          imageUrl: uploadResponse.imageUrl,
        };

        // Update the outfit in the store
        this.updateOutfit(day, updatedOutfit);

        // Update the outfit suggestions in the database
        await $fetch("/api/update-outfit", {
          method: "POST",
          body: {
            tripId: this.currentTripId,
            outfitSuggestions: this.outfitSuggestions,
          },
        });
      } catch (error) {
        console.error("Error generating outfit image:", error);
        throw error;
      } finally {
        // Clear loading state for this outfit
        this.loadingOutfits.set(day, false);
      }
    },

    setTripData(tripData) {
      this.destination = tripData.destination;
      this.tripDates = {
        start: new Date(tripData.start_date),
        end: new Date(tripData.end_date),
      };
      this.sexe = tripData.sexe;
      this.ethnicity = tripData.ethnicity;
      this.currentTripId = tripData.id;
      // Update number of days based on the trip dates
      const startDate = new Date(tripData.start_date);
      const endDate = new Date(tripData.end_date);
      const diffTime = Math.abs(endDate - startDate);
      this.numberOfDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // If there are outfit suggestions, set them
      if (tripData.outfit_suggestions) {
        this.outfitSuggestions = tripData.outfit_suggestions;
      }
    },
  },
});

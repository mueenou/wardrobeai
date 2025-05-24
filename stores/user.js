// stores/user.js
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    trips: [],
  }),

  actions: {
    addTrip(trip) {
      this.trips.push(trip);
    },
    removeTrip(id) {
      this.trips = this.trips.filter((trip) => trip.id !== id);
    },
    updateTrip(id, newTrip) {
      this.trips = this.trips.map((trip) => {
        if (trip.id === id) {
          return newTrip;
        }
        return trip;
      });
    },
  },
});

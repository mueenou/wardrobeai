export interface Cloth {
  id: number;
  type: string;
  color: { id: number; name: string; color: string };
  fabric: string;
  weather: string;
  style: string;
}

export interface OutfitDetails {
  Outfit: string;
  "Style Theme": string;
  Weather: string;
  "Perfect for": string[];
  Accessories: string;
  imageUrl?: string;
}

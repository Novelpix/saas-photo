export enum InteriorStyle {
  MODERN = 'Moderne',
  SCANDINAVIAN = 'Scandinave',
  INDUSTRIAL = 'Industriel',
  LUXURY = 'Luxe',
}

export interface DesignFormData {
  image: File | null;
  style: InteriorStyle;
  furniture_type: string;
  intensity: number;
  description: string;
  renovate_walls: boolean;
  change_floor: boolean;
  email: string;
}

export const FURNITURE_TYPES = [
  "Salon",
  "Chambre",
  "Cuisine",
  "Bureau",
  "Salle à manger",
  "Salle de bain",
  "Extérieur"
];

export const INITIAL_FORM_STATE: DesignFormData = {
  image: null,
  style: InteriorStyle.SCANDINAVIAN,
  furniture_type: "Salon",
  intensity: 50, // 0-100 range
  description: "",
  renovate_walls: false,
  change_floor: false,
  email: "",
};

export type Page = 'landing' | 'studio';
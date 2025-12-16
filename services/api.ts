import { DesignFormData } from '../types';

// URL précise du webhook N8N (Production)
const API_URL = 'https://n8n.novelpix.com/webhook/generate-interior';

// Fonction récursive pour chercher une image (URL ou Base64) dans n'importe quelle structure JSON
const findImageInJson = (obj: any): string | null => {
  if (!obj) return null;

  // 1. Si c'est une chaîne, on analyse si c'est une image
  if (typeof obj === 'string') {
     // URL absolue ou Data URI
     if (obj.startsWith('http') || obj.startsWith('data:image')) {
       return obj;
     }
     // Base64 probable (longueur > 1000 et pas d'espaces)
     // On nettoie les sauts de ligne potentiels
     const cleanStr = obj.trim().replace(/\s/g, '');
     if (cleanStr.length > 1000 && /^[A-Za-z0-9+/=]+$/.test(cleanStr)) {
       return `data:image/png;base64,${cleanStr}`;
     }
     return null;
  }

  // 2. Si c'est un tableau, on cherche dans chaque élément
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findImageInJson(item);
      if (found) return found;
    }
    return null;
  }

  // 3. Si c'est un objet, on cherche dans les propriétés prioritaires puis partout
  if (typeof obj === 'object') {
    // Clés courantes pour les images
    const priorityKeys = ['output', 'image', 'img', 'data', 'file', 'content', 'url', 'b64_json', 'base64'];
    
    // D'abord les clés prioritaires
    for (const key of priorityKeys) {
      if (key in obj) {
        const found = findImageInJson(obj[key]);
        if (found) return found;
      }
    }
    
    // Ensuite le reste de l'objet
    for (const key in obj) {
       if (!priorityKeys.includes(key)) {
         const found = findImageInJson(obj[key]);
         if (found) return found;
       }
    }
  }

  return null;
}

export const generateInteriorDesign = async (data: DesignFormData): Promise<string> => {
  if (!data.image) {
    throw new Error("No image provided");
  }

  const formData = new FormData();
  formData.append('image', data.image);
  formData.append('style', data.style);
  // N8N attend 'mobilier'
  formData.append('mobilier', data.furniture_type);
  formData.append('intensity', data.intensity.toString());
  formData.append('description', data.description);
  formData.append('renovate_walls', data.renovate_walls.toString());
  formData.append('change_floor', data.change_floor.toString());
  formData.append('email', data.email);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const json = await response.json();
      
      // En production, on évite de logger tout le JSON pour la performance et la sécurité, 
      // sauf si nécessaire pour le debug (ici commenté pour la prod)
      // console.log("N8N Response received:", json);

      const image = findImageInJson(json);
      
      if (image) {
        return image;
      }

      console.error("Structure JSON reçue (sans image détectée):", json);
      throw new Error("L'image générée est introuvable dans la réponse du serveur.");
    
    } else {
      // Cas binaire direct (Blob)
      const blob = await response.blob();
      if (blob.size < 100) {
         throw new Error("Le fichier image reçu est vide ou invalide.");
      }
      return URL.createObjectURL(blob);
    }

  } catch (error) {
    console.error("Generation failed:", error);
    throw error;
  }
};
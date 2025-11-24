import { GoogleGenAI } from '@google/genai';
import Constants from 'expo-constants'; 

// ACCESAREA CHEII DIN CONSTANTS (Citit din app.json, care citește din .env)
const GEMINI_API_KEY = Constants.manifest?.extra?.geminiApiKey;

// Verificam daca rulam local si daca cheia a fost incarcata
if (!GEMINI_API_KEY) {
    console.warn("Cheia Gemini API nu a fost setată în Constants. Verificați .env și app.json.");
}

// Initializarea clientului Gemini
const ai = new GoogleGenAI(GEMINI_API_KEY); 

/**
 * Genereaza o descriere "Vibe" captivanta folosind modelul Gemini.
 * @param {string} name - Numele locației.
 * @param {string} shortDesc - Descrierea scurtă existentă.
 * @returns {Promise<string>} - Descrierea generată sau un mesaj de eroare.
 */
export async function generateVibe(name, shortDesc) {
  if (!GEMINI_API_KEY) {
      console.error("Eroare fatala: Cheia API lipseste la rulare.");
      return "Eroare: API Key lipsa. Verifica configurarea app.json și .env.";
  }
  
  const prompt = `Rescrie descrierea scurta: "${shortDesc}" pentru locatia "${name}" intr-un ton creativ, captivant si turistic. Limiteaza raspunsul la doua propozitii clare.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    return response.text.trim(); 
  } catch (error) {
    console.error("Eroare la apelul Gemini:", error);
    return "Ne pare rau, a aparut o eroare la generarea Vibe. Verifica statusul contului.";
  }
}
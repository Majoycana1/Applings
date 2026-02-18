
import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const redesignSpace = async (
  base64Image: string,
  mimeType: string,
  userPrompt: string,
  style: string,
  type: 'Interior' | 'Landscape'
): Promise<string> => {
  const ai = getAIClient();
  
  // High-end prompt engineering
  const styleKeywords = {
    'Japanese Zen': 'minimalist, raked sand, structural acer palmatum, boulders, tranquil moss',
    'Mediterranean Estate': 'limestone pavers, lavender, olive trees, terracotta pots, cypress',
    'Contemporary Architectural': 'luxury outdoor kitchen, porcelain tile, designer lighting, sleek infinity edges',
    'New Perennial': 'naturalistic, prairie planting, stipa tenuissima, echinacea, ecological elegance',
    'English Manor': 'parterre, wisteria, stone statuary, manicured lawns, classic elegance',
    'French Formal': 'symmetry, geometric topiaries, grand axis, limestone paths, pleached trees'
  };

  const specificKeywords = styleKeywords[style as keyof typeof styleKeywords] || '';
  
  const enhancedPrompt = `
    Role: You are a world-class, award-winning ${type} architect and designer.
    Task: Re-imagine the attached ${type} space in a definitive "${style}" style.
    
    Design Guidelines:
    - Focus on ultra-high-end aesthetics, premium materials, and sophisticated spatial flow.
    - ${type === 'Landscape' ? 'Utilize expert planting palettes: ' + specificKeywords : 'Use premium interior finishes, designer furniture, and curated decor.'}
    - User specific requests: ${userPrompt || 'Create a stunning, cohesive vision.'}
    - Lighting: Implement cinematic, professional architectural lighting (golden hour or high-end interior lighting).
    - Preservation: Maintain the perspective and structural bones of the original image, but completely replace surfaces, textures, and objects with ${style} elements.
    
    Output: Return ONLY the final high-resolution, photorealistic rendered image of the redesigned space.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: mimeType,
            },
          },
          {
            text: enhancedPrompt,
          },
        ],
      },
    });

    let generatedImageUrl = '';
    
    if (!response || !response.candidates || response.candidates.length === 0) {
      throw new Error("No response from AI model.");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!generatedImageUrl) {
      throw new Error("The AI model returned text instead of a design. Try a clearer photo.");
    }

    return generatedImageUrl;
  } catch (error) {
    console.error("Design Generation Error:", error);
    throw error;
  }
};

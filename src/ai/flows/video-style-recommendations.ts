'use server';

/**
 * @fileOverview Provides video style recommendations (editing techniques, music choices, visual effects) to increase viewer engagement based on viral video data.
 *
 * - getVideoStyleRecommendations - A function that returns video style recommendations.
 * - VideoStyleRecommendationsInput - The input type for the getVideoStyleRecommendations function.
 * - VideoStyleRecommendationsOutput - The return type for the getVideoStyleRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VideoStyleRecommendationsInputSchema = z.object({
  topic: z.string().describe('The topic of the video.'),
  targetAudience: z.string().describe('The target audience for the video.'),
});
export type VideoStyleRecommendationsInput = z.infer<typeof VideoStyleRecommendationsInputSchema>;

const VideoStyleRecommendationsOutputSchema = z.object({
  editingTechniques: z.array(z.string()).describe('Recommended editing techniques.'),
  musicChoices: z.array(z.string()).describe('Recommended music choices or genres.'),
  visualEffects: z.array(z.string()).describe('Recommended visual effects.'),
  overallStyle: z.string().describe('Overall style recommendations to increase viewer engagement'),
});
export type VideoStyleRecommendationsOutput = z.infer<typeof VideoStyleRecommendationsOutputSchema>;

export async function getVideoStyleRecommendations(input: VideoStyleRecommendationsInput): Promise<VideoStyleRecommendationsOutput> {
  return videoStyleRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'videoStyleRecommendationsPrompt',
  input: {schema: VideoStyleRecommendationsInputSchema},
  output: {schema: VideoStyleRecommendationsOutputSchema},
  prompt: `You are a TikTok style expert. Based on trending viral videos, provide style recommendations for a video about the following topic, targeting the following audience.

Topic: {{{topic}}}
Target Audience: {{{targetAudience}}}

Return the recommendations in JSON format.

Here are some guidelines:

Editing Techniques:
* Consider fast cuts and dynamic transitions for high-energy content.
* Suggest using jump cuts and zoom effects to maintain viewer attention.
* Recommend incorporating text overlays and motion graphics for emphasis.

Music Choices:
* Suggest popular and trending songs on TikTok that align with the video's theme.
* Consider upbeat and catchy tunes to create a positive and engaging atmosphere.
* Recommend using royalty-free music options for monetization purposes.

Visual Effects:
* Suggest using filters and color grading to enhance the video's aesthetic appeal.
* Consider adding particle effects and animated elements to create visual interest.
* Recommend using transitions and overlays to create a seamless and professional look.

Overall Style:
* Provide an overall summary of the video style that would maximize user engagement based on the techniques outlined.
`,
});

const videoStyleRecommendationsFlow = ai.defineFlow(
  {
    name: 'videoStyleRecommendationsFlow',
    inputSchema: VideoStyleRecommendationsInputSchema,
    outputSchema: VideoStyleRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

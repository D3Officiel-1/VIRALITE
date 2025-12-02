'use server';

/**
 * @fileOverview A flow to generate content ideas and video script suggestions based on trending topics.
 *
 * - generateContentSuggestions - A function that generates content ideas and video script suggestions based on a trending topic.
 * - GenerateContentSuggestionsInput - The input type for the generateContentSuggestions function.
 * - GenerateContentSuggestionsOutput - The return type for the generateContentSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContentSuggestionsInputSchema = z.object({
  trendingTopic: z
    .string()
    .describe('The trending topic to generate content ideas for.'),
});
export type GenerateContentSuggestionsInput = z.infer<
  typeof GenerateContentSuggestionsInputSchema
>;

const GenerateContentSuggestionsOutputSchema = z.object({
  contentIdeas: z
    .array(z.string())
    .describe('An array of content idea suggestions.'),
  videoScriptSuggestions: z
    .array(z.string())
    .describe('An array of video script suggestions.'),
});
export type GenerateContentSuggestionsOutput = z.infer<
  typeof GenerateContentSuggestionsOutputSchema
>;

export async function generateContentSuggestions(
  input: GenerateContentSuggestionsInput
): Promise<GenerateContentSuggestionsOutput> {
  return generateContentSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContentSuggestionsPrompt',
  input: {schema: GenerateContentSuggestionsInputSchema},
  output: {schema: GenerateContentSuggestionsOutputSchema},
  prompt: `You are a creative content strategist specializing in TikTok. Based on the trending topic "{{{trendingTopic}}}", generate a list of 3 content ideas and 3 video script suggestions. Each idea and script should be short and engaging to maximize virality.

Output the content ideas in the format:
Content Ideas:
- [Content Idea 1]
- [Content Idea 2]
- [Content Idea 3]

Output the video script suggestions in the format:
Video Script Suggestions:
- [Video Script Suggestion 1]
- [Video Script Suggestion 2]
- [Video Script Suggestion 3]`,
});

const generateContentSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateContentSuggestionsFlow',
    inputSchema: GenerateContentSuggestionsInputSchema,
    outputSchema: GenerateContentSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

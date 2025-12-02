'use server';

/**
 * @fileOverview Identifies trending topics on TikTok based on views, shares, and comments.
 *
 * - identifyTrendingTopics - A function that identifies trending topics.
 * - TrendingTopicIdentificationInput - The input type for the identifyTrendingTopics function.
 * - TrendingTopicIdentificationOutput - The return type for the identifyTrendingTopics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrendingTopicIdentificationInputSchema = z.object({
  numberOfTopics: z
    .number()
    .default(5)
    .describe('The number of trending topics to identify.'),
});
export type TrendingTopicIdentificationInput = z.infer<typeof TrendingTopicIdentificationInputSchema>;

const TrendingTopicIdentificationOutputSchema = z.object({
  topics: z
    .array(z.string())
    .describe('A list of trending topics on TikTok.'),
});
export type TrendingTopicIdentificationOutput = z.infer<typeof TrendingTopicIdentificationOutputSchema>;

export async function identifyTrendingTopics(
  input: TrendingTopicIdentificationInput
): Promise<TrendingTopicIdentificationOutput> {
  return trendingTopicIdentificationFlow(input);
}

const trendingTopicIdentificationPrompt = ai.definePrompt({
  name: 'trendingTopicIdentificationPrompt',
  input: {schema: TrendingTopicIdentificationInputSchema},
  output: {schema: TrendingTopicIdentificationOutputSchema},
  prompt: `You are a social media expert. Identify the top {{numberOfTopics}} trending topics on TikTok based on views, shares, and comments. Return a list of topics.  Here are today\'s trending topics on TikTok: {{topics}}`,
});

const trendingTopicIdentificationFlow = ai.defineFlow(
  {
    name: 'trendingTopicIdentificationFlow',
    inputSchema: TrendingTopicIdentificationInputSchema,
    outputSchema: TrendingTopicIdentificationOutputSchema,
  },
  async input => {
    const {output} = await trendingTopicIdentificationPrompt(input);
    return output!;
  }
);

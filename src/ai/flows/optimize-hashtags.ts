'use server';

/**
 * @fileOverview A flow to suggest optimal hashtags for TikTok videos based on topic relevance and trending status.
 *
 * - optimizeHashtags - A function that suggests optimal hashtags.
 * - OptimizeHashtagsInput - The input type for the optimizeHashtags function.
 * - OptimizeHashtagsOutput - The return type for the optimizeHashtags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeHashtagsInputSchema = z.object({
  videoTopic: z
    .string()
    .describe('The topic of the TikTok video.'),
});
export type OptimizeHashtagsInput = z.infer<typeof OptimizeHashtagsInputSchema>;

const OptimizeHashtagsOutputSchema = z.object({
  hashtags: z
    .array(z.string())
    .describe('An array of optimal hashtags for the video.'),
});
export type OptimizeHashtagsOutput = z.infer<typeof OptimizeHashtagsOutputSchema>;

export async function optimizeHashtags(input: OptimizeHashtagsInput): Promise<OptimizeHashtagsOutput> {
  return optimizeHashtagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeHashtagsPrompt',
  input: {schema: OptimizeHashtagsInputSchema},
  output: {schema: OptimizeHashtagsOutputSchema},
  prompt: `You are a TikTok hashtag expert. Given the topic of a TikTok video, you will suggest a list of optimal hashtags to maximize discoverability.

Video Topic: {{{videoTopic}}}

Suggest a list of hashtags that are relevant to the video topic and are currently trending on TikTok. Return the hashtags as an array of strings.
`,
});

const optimizeHashtagsFlow = ai.defineFlow(
  {
    name: 'optimizeHashtagsFlow',
    inputSchema: OptimizeHashtagsInputSchema,
    outputSchema: OptimizeHashtagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

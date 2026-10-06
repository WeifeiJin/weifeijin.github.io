import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog', generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
  schema: z.object({
    title: z.string(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a nonempty, lowercase, hyphen-separated slug.'),
    language: z.enum(['zh', 'en']),
    publishedAt: z.iso.date(),
    talkDate: z.iso.date().optional(),
    description: z.string(),
    introduction: z.string().optional(),
  }),
});

export const collections = { blog };

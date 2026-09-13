import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['data-engineering', 'network-infrastructure', 'system-architecture', 'fintech', 'api-products', 'product-management']),
    date: z.coerce.date(),
    technologies: z.array(z.string()),
    metric: z.string().optional(),
    diagram: z.string().optional(),
  }),
});

const concepts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/concepts' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(), // "Explained Simply: X" - the descriptive tag under the title
    domain: z.string(), // groups concepts for the future nested/universe map, e.g. "Project Management", "Fintech Systems"
    parentConcept: z.string().optional(), // slug of a broader concept this nests under, for the future orbital map
    oneLiner: z.string(), // the bold takeaway banner at the bottom, e.g. "LEAD TIME = EXPERIENCE"
    leftColumnTitle: z.string(), // e.g. "WHY IT MATTERS" or "TEAMS STRUGGLE WHEN"
    leftColumnItems: z.array(z.string()),
    rightColumnTitle: z.string(), // e.g. "WHAT WORKS" or "EFFECTIVE MANAGEMENT"
    rightColumnItems: z.array(z.string()),
    date: z.coerce.date(),
  }),
});

export const collections = { blog, concepts };

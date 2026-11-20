import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const games = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/games' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    status: z.enum(['Concept', 'Prototype', 'In development', 'Playtesting', 'Early access', 'Released']),
    order: z.number().default(99),
    genres: z.array(z.string()).default([]),
    platforms: z.array(z.string()).default([]),
    /** Accent colour for this game's placeholder and details. */
    color: z.string().default('#F5B48C'),
    /** Hand-drawn sticker that peeks over the clip frame (file name in src/assets/art, no extension). */
    sticker: z.string().optional(),
    /**
     * Short looping clip shown on cards and the game page. Put files in public/media/games/<slug>/.
     * .mp4/.webm play as a silent loop, .gif/.webp/.png/.jpg show as an image.
     */
    clip: z.string().optional(),
    /** Still frame shown before the clip loads (and to people who prefer reduced motion). */
    poster: z.string().optional(),
    /** YouTube video id for a full trailer, e.g. "dQw4w9WgXcQ". */
    trailer: z.string().optional(),
    gallery: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    /** Play / download / wishlist buttons. */
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { games };

// Studio-wide settings. Leave a link empty ('') to hide it everywhere.
export const site = {
  name: 'Kinda Whimsical Games',
  short: 'KOWG',
  description:
    'Kinda Whimsical Games is a two-person indie studio making small, hand-drawn worlds.',
  email: 'hello@kindawhimsicalgames.com',
  /**
   * Optional looping video behind the home hero. Put files in public/media/hero/.
   * Leave mp4 empty to show the plain paper background.
   */
  heroVideo: {
    mp4: '/media/hero/loop.mp4',
    webm: '/media/hero/loop.webm', // optional smaller version
    poster: '/media/hero/loop.jpg', // still frame shown while it loads
    /**
     * How much paper colour is washed over the edges of the video (0 = none, 1 = hidden).
     * The middle, behind the logo and text, always gets a stronger wash so it stays readable.
     */
    wash: 0.35,
  },
  socials: {
    discord: '', // e.g. https://discord.gg/xxxx
    instagram: '', // studio account, e.g. https://instagram.com/kindawhimsical
    tiktok: '',
    youtube: '',
    itch: '',
  },
};

export type SocialKey = keyof typeof site.socials;
export const socialLabels: Record<SocialKey, string> = {
  discord: 'Discord',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  itch: 'itch.io',
};

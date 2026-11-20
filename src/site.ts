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
    mp4: '', // e.g. '/media/hero/loop.mp4'
    webm: '', // optional smaller version, e.g. '/media/hero/loop.webm'
    poster: '', // still frame shown while it loads
    /** How much paper colour is washed over the video (0 = none, 1 = hidden) so the logo stays readable. */
    wash: 0.55,
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

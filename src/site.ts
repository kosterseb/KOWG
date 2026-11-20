// Studio-wide settings. Leave a link empty ('') to hide it everywhere.
export const site = {
  name: 'Kinda Whimsical Games',
  short: 'KOWG',
  description:
    'Kinda Whimsical Games is a two-person indie studio making small, hand-drawn worlds.',
  email: 'hello@kindawhimsicalgames.com',
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

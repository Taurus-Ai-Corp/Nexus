import { z } from 'zod';

export const TierEnum = z.enum(['silver', 'gold', 'platinum', 'undecided']);
export type Tier = z.infer<typeof TierEnum>;

export const SourceEnum = z.enum([
  'hero-mini',
  'brochure-micro',
  'final-full',
  'tier-card-button',
]);
export type Source = z.infer<typeof SourceEnum>;

export const LeadPayloadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().toLowerCase(),
  phone: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{7,14}$/, 'Phone must be E.164 format, e.g. +919876543210'),
  tier: TierEnum.default('undecided'),
  message: z.string().trim().max(500).optional(),
  source: SourceEnum.default('final-full'),
});

export type LeadPayload = z.infer<typeof LeadPayloadSchema>;

export function getFirstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

export function getTierLabel(tier: Tier): string {
  if (tier === 'undecided') return 'residence programme';
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

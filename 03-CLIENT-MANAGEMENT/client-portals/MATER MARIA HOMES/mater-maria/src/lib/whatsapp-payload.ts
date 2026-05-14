import type { LeadPayload } from './lead-schema';
import { getFirstName, getTierLabel } from './lead-schema';

export function whatsappPayload(lead: LeadPayload) {
  return {
    messaging_product: 'whatsapp' as const,
    to: lead.phone.replace(/^\+/, ''),
    type: 'template' as const,
    template: {
      name: 'investor_welcome',
      language: { code: 'en' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: getFirstName(lead.name) },
            { type: 'text', text: getTierLabel(lead.tier) },
          ],
        },
      ],
    },
  };
}

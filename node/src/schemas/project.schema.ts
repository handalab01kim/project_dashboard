import { z } from 'zod';

// export const channelInfoSchema = z.object({
//   name: z.string(),
//   rtspurl: z.string().url(),
//   description: z.string().nullable(),
// });

// export type ChannelInfo = z.infer<typeof channelInfoSchema>;
export const projectSchema = z.object({
  week: z.coerce.number().optional().nullable(), // query / param?
  // week: z.number(), // body
});

export type ChannelInfo = z.infer<typeof projectSchema>;

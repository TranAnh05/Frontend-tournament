import { z } from 'zod';

export const courtSchema = z.object({
  id: z.number().optional(), 
  courtName: z.string().min(1, 'Tên sân không được để trống'),
  status: z.enum(['ACTIVE', 'MAINTENANCE']),
  supportedSportIds: z
    .array(z.number())
    .min(1, 'Vui lòng chọn ít nhất 1 môn thể thao cho sân này'),
});

export const venueFormSchema = z.object({
  name: z.string().min(1, 'Tên địa điểm không được để trống'),
  address: z.string().min(1, 'Địa chỉ cụ thể không được để trống'),
  courts: z.array(courtSchema).min(1, 'Phải có ít nhất 1 sân thi đấu trong địa điểm này'),
});

export type VenueFormValues = z.infer<typeof venueFormSchema>;
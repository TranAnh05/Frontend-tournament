import { z } from 'zod';

export const ruleSchema = z.object({
  id: z.number().optional(), 
  ruleKey: z
    .string()
    .min(1, 'Mã quy tắc không được để trống')
    .regex(/^[A-Z0-9_]+$/, 'Mã quy tắc chỉ được chứa chữ IN HOA, số và dấu gạch dưới (VD: MAX_SCORE)'),
  ruleValue: z.string().min(1, 'Giá trị không được để trống'),
  description: z.string().optional(),
});

export const sportFormSchema = z.object({
  name: z.string().min(1, 'Tên môn thể thao không được để trống'),
  description: z.string().optional(),
  rules: z.array(ruleSchema), 
});

export type SportFormValues = z.infer<typeof sportFormSchema>;
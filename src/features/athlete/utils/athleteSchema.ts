import { z } from 'zod';

const phoneRegex = /^(0|\+84)(3|5|7|8|9)\d{8}$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;
const cccdRegex = /^[0-9]{9,12}$/;

export const athleteRegisterSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Họ tên không được để trống')
    .max(100, 'Họ tên không được vượt quá 100 ký tự'),
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không đúng định dạng'),
  password: z
    .string()
    .min(1, 'Mật khẩu không được để trống')
    .regex(passwordRegex, 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt'),
  phoneNumber: z
    .string()
    .min(1, 'Số điện thoại không được để trống')
    .regex(phoneRegex, 'Số điện thoại không đúng định dạng của Việt Nam'),
  identityNumber: z
    .string()
    .min(1, 'Số CCCD không được để trống')
    .regex(cccdRegex, 'Số CCCD phải từ 9 đến 12 chữ số'),
  dateOfBirth: z
    .string()
    .min(1, 'Ngày sinh không được để trống')
    .refine(val => new Date(val) < new Date(), 'Ngày sinh phải là ngày trong quá khứ'),
});

export type AthleteRegisterFormData = z.infer<typeof athleteRegisterSchema>;
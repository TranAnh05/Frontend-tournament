import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { athleteRegisterSchema, type AthleteRegisterFormData } from '../utils/athleteSchema';
import { useAthleteRegister } from '../hooks/useAthleteRegister';

export const AthleteRegisterForm = () => {
  const { register: submitRegister, isLoading } = useAthleteRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AthleteRegisterFormData>({
    resolver: zodResolver(athleteRegisterSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phoneNumber: '',
      identityNumber: '',
      dateOfBirth: '',
    },
  });

  const onSubmit = (data: AthleteRegisterFormData) => {
    submitRegister(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Họ tên */}
      <Input
        label="Họ và tên"
        type="text"
        placeholder="VD: Nguyễn Văn A"
        {...register('fullName')}
        error={errors.fullName?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email */}
        <Input
          label="Email đăng nhập"
          type="email"
          placeholder="admin@tournament.com"
          {...register('email')}
          error={errors.email?.message}
        />

        {/* Số điện thoại */}
        <Input
          label="Số điện thoại"
          type="tel"
          placeholder="0912345678"
          {...register('phoneNumber')}
          error={errors.phoneNumber?.message}
        />
      </div>

      {/* CCCD + Ngày sinh */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Số CCCD"
          type="text"
          placeholder="001234567890"
          maxLength={12}
          {...register('identityNumber')}
          error={errors.identityNumber?.message}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Ngày sinh</label>
          <input
            type="date"
            max={new Date().toISOString().split('T')[0]}
            {...register('dateOfBirth')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.dateOfBirth && (
            <p className="text-xs text-red-500">{errors.dateOfBirth.message}</p>
          )}
        </div>
      </div>

      {/* Mật khẩu */}
      <div className="space-y-1 pt-2">
        <Input
          label="Mật khẩu"
          type="password"
          placeholder="Bao gồm chữ, số và ký tự đặc biệt"
          {...register('password')}
          error={errors.password?.message}
        />
        <p className="text-xs text-gray-500 mt-1">
          Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@#$%...).
        </p>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        className="w-full mt-4"
        size="lg"
        isLoading={isLoading}
      >
        Tạo tài khoản ngay
      </Button>

      <p className="text-center text-sm text-gray-600 mt-6">
        Đã có tài khoản?{' '}
        <Link to="/login" className="text-blue-600 hover:underline font-semibold">
          Đăng nhập tại đây
        </Link>
      </p>
    </form>
  );
};
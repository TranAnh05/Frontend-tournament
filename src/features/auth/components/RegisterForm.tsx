import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { registerSchema, type RegisterFormData } from '../utils/authSchema';
import { useRegister } from '../hooks/useRegister';

export const RegisterForm = () => {
  const { register: submitRegister, isLoading } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phoneNumber: '',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    submitRegister(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Ô nhập Họ tên */}
      <Input
        label="Họ và tên"
        type="text"
        placeholder="VD: Nguyễn Văn A"
        {...register('fullName')}
        error={errors.fullName?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ô nhập Email */}
        <Input
          label="Email đăng nhập"
          type="email"
          placeholder="admin@tournament.com"
          {...register('email')}
          error={errors.email?.message}
        />

        {/* Ô nhập Số điện thoại */}
        <Input
          label="Số điện thoại"
          type="tel"
          placeholder="0912345678"
          {...register('phoneNumber')}
          error={errors.phoneNumber?.message}
        />
      </div>

      {/* Ô nhập Mật khẩu */}
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

      {/* Nút Submit */}
      <Button
        type="submit"
        variant="primary"
        className="w-full mt-4"
        size="lg"
        isLoading={isLoading}
      >
        Tạo tài khoản ngay
      </Button>

      {/* Điều hướng về trang Đăng nhập */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Đã có tài khoản?{' '}
        <Link to="/login" className="text-blue-600 hover:underline font-semibold">
          Đăng nhập tại đây
        </Link>
      </p>
    </form>
  );
};
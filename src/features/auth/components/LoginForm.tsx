import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { loginSchema, type LoginFormData } from '../utils/authSchema';
import { useLogin } from '../hooks/useLogin';

export const LoginForm = () => {
  const { login, isLoading } = useLogin();

  // Khởi tạo React Hook Form kết hợp với Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Hàm xử lý khi submit thành công (không có lỗi validation)
  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Ô nhập Email */}
      <Input
        label="Email đăng nhập"
        type="email"
        placeholder="VD: your-email@gmail.com"
        {...register('email')}
        error={errors.email?.message} // lấy message từ Zod ("Email không được để trống")
      />

      {/* Ô nhập Mật khẩu */}
      <div className="space-y-1">
        <Input
          label="Mật khẩu"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
        />
      </div>

      {/* Nút Submit */}
      <Button
        type="submit"
        variant="primary"
        className="w-full mt-2"
        size="lg"
        isLoading={isLoading}
      >
        Đăng nhập hệ thống
      </Button>

      {/* Điều hướng sang trang Đăng ký */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="text-blue-600 hover:underline font-semibold">
          Đăng ký ngay
        </Link>
      </p>
    </form>
  );
};
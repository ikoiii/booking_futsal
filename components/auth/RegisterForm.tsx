"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Registrasi berhasil! Silakan login.');
        router.push('/login');
      } else {
        toast.error(result.message || 'Registrasi gagal');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan, silakan coba lagi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Daftar</h2>
        <p className="text-muted-foreground mt-2">
          Buat akun untuk mulai booking lapangan
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nama">Nama Lengkap</Label>
          <Input
            id="nama"
            placeholder="masukkan nama lengkap Anda"
            {...register('nama')}
            autoComplete="name"
            className={errors.nama ? 'border-red-500' : ''}
          />
          {errors.nama && (
            <p className="text-red-500 text-sm">{errors.nama.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="masukkan email Anda"
            {...register('email')}
            type="email"
            autoComplete="email"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="no_telp">Nomor Telepon</Label>
          <Input
            id="no_telp"
            placeholder="masukkan nomor telepon Anda"
            {...register('no_telp')}
            type="tel"
            autoComplete="tel"
            className={errors.no_telp ? 'border-red-500' : ''}
          />
          {errors.no_telp && (
            <p className="text-red-500 text-sm">{errors.no_telp.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="buat password yang kuat"
            {...register('password')}
            type="password"
            autoComplete="new-password"
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
          
          {/* Password strength indicator */}
          {password && (
            <div className="text-xs text-muted-foreground">
              <span className={`mr-2 ${
                password.length >= 6 ? 'text-green-500' : 'text-yellow-500'
              }`}>
                • Minimal 6 karakter
              </span>
              <span className={`mr-2 ${
                /[a-z]/.test(password) ? 'text-green-500' : 'text-yellow-500'
              }`}>
                • Huruf kecil
              </span>
              <span className={`mr-2 ${
                /[A-Z]/.test(password) ? 'text-green-500' : 'text-yellow-500'
              }`}>
                • Huruf besar
              </span>
              <span className={`${
                /\d/.test(password) ? 'text-green-500' : 'text-yellow-500'
              }`}>
                • Angka
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <Input
            id="confirmPassword"
            placeholder="ketik ulang password Anda"
            {...register('confirmPassword')}
            type="password"
            autoComplete="new-password"
            className={errors.confirmPassword ? 'border-red-500' : ''}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            'Daftar'
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

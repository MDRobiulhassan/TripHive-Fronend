'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signupSchema, SignupInput } from '@/lib/validations/auth';
import { Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [formData, setFormData] = useState<SignupInput>({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SignupInput, string>>>({});
  const [serverError, setServerError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (field: keyof SignupInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setErrors({});
    setServerError('');

    // Zod validation check
    const validation = signupSchema.safeParse(formData);
    if (!validation.success) {
      const formattedErrors: Partial<Record<keyof SignupInput, string>> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SignupInput;
        if (field) formattedErrors[field] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    setIsSubmitting(true);

    const res = await signup({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
    });

    setIsSubmitting(false);

    if (res.success) {
      router.push('/');
    } else {
      setServerError(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[14px] p-8 border border-[#dddddd] shadow-airbnb space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#dddddd] flex items-center justify-center">
              <img src="/assests/logo.jpg" alt="TripHive Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-black tracking-tight text-[#ff385c]">TripHive</span>
          </Link>
          <h2 className="text-xl font-bold text-[#222222] pt-2">Create an account</h2>
          <p className="text-sm text-[#6a6a6a]">Sign up to unlock instant hotel bookings</p>
        </div>

        {serverError && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 text-[#c13515] text-xs font-medium leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name Field */}
          <div>
            <label className="block text-xs font-medium text-[#6a6a6a] mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#6a6a6a] absolute left-3.5 top-4" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="John Doe"
                className={`w-full h-12 pl-10 pr-4 bg-white border rounded-lg text-sm text-[#222222] focus:outline-none focus:border-2 ${
                  errors.name ? 'border-[#c13515] focus:border-[#c13515]' : 'border-[#dddddd] focus:border-[#222222]'
                }`}
              />
            </div>
            {errors.name && <p className="text-[12px] font-medium text-[#c13515] mt-1">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-medium text-[#6a6a6a] mb-1">Email address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6a6a6a] absolute left-3.5 top-4" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="name@example.com"
                className={`w-full h-12 pl-10 pr-4 bg-white border rounded-lg text-sm text-[#222222] focus:outline-none focus:border-2 ${
                  errors.email ? 'border-[#c13515] focus:border-[#c13515]' : 'border-[#dddddd] focus:border-[#222222]'
                }`}
              />
            </div>
            {errors.email && <p className="text-[12px] font-medium text-[#c13515] mt-1">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-medium text-[#6a6a6a] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6a6a6a] absolute left-3.5 top-4" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="••••••••"
                className={`w-full h-12 pl-10 pr-4 bg-white border rounded-lg text-sm text-[#222222] focus:outline-none focus:border-2 ${
                  errors.password ? 'border-[#c13515] focus:border-[#c13515]' : 'border-[#dddddd] focus:border-[#222222]'
                }`}
              />
            </div>
            {errors.password && <p className="text-[12px] font-medium text-[#c13515] mt-1">{errors.password}</p>}
          </div>

          {/* Submit CTA Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-lg bg-[#ff385c] hover:bg-[#e00b41] text-white font-semibold text-base shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </span>
            ) : (
              <>
                <span>Agree and continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-[#6a6a6a]">
          Already have an account?{' '}
          <Link href="/auth/signup" className="font-semibold text-[#ff385c] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

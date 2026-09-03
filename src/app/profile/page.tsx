'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useUserProfileQuery, useUpdateProfileMutation } from '@/hooks/useUserQueries';
import { updateProfileSchema, UpdateProfileInput } from '@/lib/validations/user';
import { Gender } from '@/types/api';
import { User, Mail, Calendar, Save, CheckCircle, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const { data: userProfile, isLoading: profileLoading } = useUserProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();

  const [formData, setFormData] = useState<UpdateProfileInput>({
    name: '',
    dateOfBirth: '',
    gender: 'MALE',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UpdateProfileInput, string>>>({});
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [serverError, setServerError] = useState<string>('');

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        dateOfBirth: userProfile.dateOfBirth || '',
        gender: (userProfile.gender as Gender) || 'MALE',
      });
    }
  }, [userProfile]);

  const handleChange = (field: keyof UpdateProfileInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (serverError) setServerError('');
    if (successMsg) setSuccessMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError('');
    setSuccessMsg('');

    // Zod validation check
    const validation = updateProfileSchema.safeParse(formData);
    if (!validation.success) {
      const formattedErrors: Partial<Record<keyof UpdateProfileInput, string>> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof UpdateProfileInput;
        if (field) formattedErrors[field] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        name: formData.name.trim(),
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender,
      });

      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Update Profile Error:', err);
      const errMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update profile. Please try again.';
      setServerError(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <h1 className="text-2xl font-bold text-[#222222] mb-1">Personal Info</h1>
        <p className="text-sm text-[#6a6a6a] mb-8">Manage your account details and profile preferences</p>

        {profileLoading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff385c] mx-auto" />
          </div>
        ) : (
          <div className="bg-white border border-[#dddddd] rounded-[14px] p-8 shadow-airbnb space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-[#ebebeb]">
              <div className="w-16 h-16 rounded-full bg-[#222222] text-white flex items-center justify-center font-bold text-2xl">
                {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
              </div>
              <div>
                <p className="font-bold text-lg text-[#222222]">{userProfile?.name || 'Guest User'}</p>
                <p className="text-xs text-[#6a6a6a]">{userProfile?.email}</p>
              </div>
            </div>

            {serverError && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-100 flex items-center gap-3 text-[#c13515] text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-700 text-xs font-medium">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Name Input */}
              <div>
                <label className="block text-xs font-medium text-[#6a6a6a] mb-1">Legal Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#6a6a6a] absolute left-3.5 top-4" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Robiul Hassan"
                    className={`w-full h-12 pl-10 pr-4 bg-white border rounded-lg text-sm text-[#222222] focus:outline-none focus:border-2 ${
                      errors.name ? 'border-[#c13515] focus:border-[#c13515]' : 'border-[#dddddd] focus:border-[#222222]'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-[12px] font-medium text-[#c13515] mt-1">{errors.name}</p>}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-xs font-medium text-[#6a6a6a] mb-1">Email address (read-only)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6a6a6a] absolute left-3.5 top-4" />
                  <input
                    type="email"
                    disabled
                    value={userProfile?.email || ''}
                    className="w-full h-12 pl-10 pr-4 bg-[#f7f7f7] border border-[#dddddd] rounded-lg text-sm text-[#6a6a6a] cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Date of Birth Input */}
              <div>
                <label className="block text-xs font-medium text-[#6a6a6a] mb-1">Date of Birth</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#6a6a6a] absolute left-3.5 top-4" />
                  <input
                    type="date"
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    className="w-full h-12 pl-10 pr-4 bg-white border border-[#dddddd] rounded-lg text-sm text-[#222222] focus:outline-none focus:border-2 focus:border-[#222222] cursor-pointer"
                  />
                </div>
              </div>

              {/* Gender Selector */}
              <div>
                <label className="block text-xs font-medium text-[#6a6a6a] mb-1">Gender</label>
                <select
                  value={formData.gender || 'MALE'}
                  onChange={(e) => handleChange('gender', e.target.value as Gender)}
                  className="w-full h-12 px-4 bg-white border border-[#dddddd] rounded-lg text-sm text-[#222222] focus:outline-none focus:border-2 focus:border-[#222222] cursor-pointer"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#ff385c] hover:bg-[#e00b41] text-white font-semibold text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

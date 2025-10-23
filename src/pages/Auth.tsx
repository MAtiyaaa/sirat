import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { z } from 'zod';

const Auth = () => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const authSchema = z.object({
    email: z.string().email('Invalid email address').max(255, 'Email too long'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long'),
    firstName: z.string().min(1, 'First name required').max(50, 'First name too long').optional(),
    lastName: z.string().max(50, 'Last name too long').optional(),
  });

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      const validation = authSchema.safeParse({
        email: email.trim(),
        password,
        firstName: isSignUp ? firstName.trim() : undefined,
        lastName: isSignUp ? lastName.trim() : undefined,
      });

      if (!validation.success) {
        const errors = validation.error.errors.map(e => e.message).join(', ');
        toast.error(errors);
        setLoading(false);
        return;
      }

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              first_name: firstName,
              last_name: lastName,
            }
          }
        });

        if (error) throw error;
        toast.success(
          settings.language === 'ar' 
            ? 'تم إنشاء الحساب بنجاح!' 
            : 'Account created successfully!'
        );
        navigate('/');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast.success(settings.language === 'ar' ? 'تم تسجيل الدخول' : 'Signed in');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || (settings.language === 'ar' ? 'حدث خطأ' : 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">
            {isSignUp 
              ? (settings.language === 'ar' ? 'إنشاء حساب' : 'Create Account')
              : (settings.language === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp
              ? (settings.language === 'ar' ? 'أنشئ حسابًا جديدًا للمتابعة' : 'Create a new account to continue')
              : (settings.language === 'ar' ? 'سجل الدخول إلى حسابك' : 'Sign in to your account')}
          </p>
        </div>

        <div className="glass-effect rounded-2xl p-6 space-y-6">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    {settings.language === 'ar' ? 'الاسم الأول' : 'First Name'}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={settings.language === 'ar' ? 'أدخل اسمك الأول' : 'Enter your first name'}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    {settings.language === 'ar' ? 'اسم العائلة' : 'Last Name'}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={settings.language === 'ar' ? 'أدخل اسم العائلة' : 'Enter your last name'}
                      className="pl-10"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">
                {settings.language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={settings.language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {settings.language === 'ar' ? 'كلمة المرور' : 'Password'}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={settings.language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                isSignUp 
                  ? (settings.language === 'ar' ? 'إنشاء حساب' : 'Sign Up')
                  : (settings.language === 'ar' ? 'تسجيل الدخول' : 'Sign In')
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline"
            >
              {isSignUp
                ? (settings.language === 'ar' ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'Already have an account? Sign In')
                : (settings.language === 'ar' ? 'ليس لديك حساب؟ إنشاء حساب' : "Don't have an account? Sign Up")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

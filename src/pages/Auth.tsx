import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User, Star } from 'lucide-react';
import { z } from 'zod';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path
      d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
      fill="currentColor"
    />
  </svg>
);

const Auth = () => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/auth`,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast.error(
        error.message ||
          (settings.language === 'ar'
            ? 'حدث خطأ في تسجيل الدخول بجوجل'
            : 'Google sign-in failed')
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: `${window.location.origin}/auth`,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Apple sign-in error:', error);
      toast.error(
        error.message ||
          (settings.language === 'ar'
            ? 'حدث خطأ في تسجيل الدخول بـ Apple'
            : 'Apple sign-in failed')
      );
    } finally {
      setAppleLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none islamic-pattern-subtle opacity-30" />
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/6 rounded-full blur-3xl animate-glow-breathe" />
      <div className="absolute bottom-20 right-1/4 w-56 h-56 bg-islamic-gold/5 rounded-full blur-3xl animate-glow-breathe" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md space-y-8 relative animate-fade-in-up">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-elevated mb-2">
            <Star className="h-3 w-3 text-islamic-gold" />
            <span className="text-xs font-semibold text-foreground/70 tracking-wider">بسم الله</span>
            <Star className="h-3 w-3 text-islamic-gold" />
          </div>
          <h1 className="text-3xl font-bold ios-26-style">
            {isSignUp 
              ? (settings.language === 'ar' ? 'إنشاء حساب' : 'Create Account')
              : (settings.language === 'ar' ? 'تسجيل الدخول' : 'Welcome Back')}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isSignUp
              ? (settings.language === 'ar' ? 'أنشئ حسابًا جديدًا للمتابعة' : 'Create a new account to continue')
              : (settings.language === 'ar' ? 'سجل الدخول إلى حسابك' : 'Sign in to your account')}
          </p>
        </div>

        <div className="glass-card-elevated rounded-3xl p-7 space-y-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          {/* Social Sign In Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-13 text-base font-semibold gap-3 rounded-2xl border-2 hover:bg-accent/50 smooth-transition hover-lift"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || appleLoading || loading}
            >
              {googleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <GoogleIcon />
                  {settings.language === 'ar' 
                    ? (isSignUp ? 'التسجيل بحساب جوجل' : 'تسجيل الدخول بجوجل')
                    : (isSignUp ? 'Sign up with Google' : 'Sign in with Google')}
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-13 text-base font-semibold gap-3 rounded-2xl border-2 hover:bg-accent/50 smooth-transition hover-lift"
              onClick={handleAppleSignIn}
              disabled={googleLoading || appleLoading || loading}
            >
              {appleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <AppleIcon />
                  {settings.language === 'ar' 
                    ? (isSignUp ? 'التسجيل بـ Apple' : 'تسجيل الدخول بـ Apple')
                    : (isSignUp ? 'Sign up with Apple' : 'Sign in with Apple')}
                </>
              )}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full ornamental-divider" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-4 text-muted-foreground font-semibold tracking-wider">
                {settings.language === 'ar' ? 'أو' : 'or'}
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs font-semibold">
                    {settings.language === 'ar' ? 'الاسم الأول' : 'First Name'}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={settings.language === 'ar' ? 'الاسم' : 'First'}
                      className="pl-10 h-12 rounded-xl"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs font-semibold">
                    {settings.language === 'ar' ? 'اسم العائلة' : 'Last Name'}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={settings.language === 'ar' ? 'العائلة' : 'Last'}
                      className="pl-10 h-12 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold">
                {settings.language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={settings.language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  className="pl-10 h-12 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold">
                {settings.language === 'ar' ? 'كلمة المرور' : 'Password'}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={settings.language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                  className="pl-10 h-12 rounded-xl"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-13 text-base font-semibold rounded-2xl primary-glow smooth-transition" disabled={loading || googleLoading || appleLoading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                isSignUp 
                  ? (settings.language === 'ar' ? 'إنشاء حساب' : 'Create Account')
                  : (settings.language === 'ar' ? 'تسجيل الدخول' : 'Sign In')
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline font-medium smooth-transition"
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

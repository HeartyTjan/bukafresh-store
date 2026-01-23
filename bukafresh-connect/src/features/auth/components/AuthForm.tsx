import { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface AuthFormProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onSignup: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  defaultMode?: 'login' | 'signup';
  showPackageSummary?: React.ReactNode;
}

export function AuthForm({
  onLogin,
  onSignup,
  defaultMode = 'signup',
  showPackageSummary,
}: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(defaultMode === 'login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await onLogin(formData.email, formData.password);
      } else {
        result = await onSignup(formData.email, formData.password, formData.firstName, formData.lastName);
      }

      if (!result.success) {
        setError(result.error || 'Something went wrong');
      }
    } catch (err) {
      setError(isLogin ? 'Invalid email or password' : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {showPackageSummary}

      {/* Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center bg-muted rounded-full p-1">
          <button
            onClick={() => setIsLogin(false)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all",
              !isLogin ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            )}
          >
            Sign Up
          </button>
          <button
            onClick={() => setIsLogin(true)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all",
              isLogin ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            )}
          >
            Log In
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder={isLogin ? "Enter your password" : "Create a password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="pl-10"
              required
              minLength={6}
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? 'Please wait...' : (isLogin ? 'Log In & Continue' : 'Create Account & Continue')}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-4">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-primary hover:underline font-medium"
        >
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </div>
  );
}
import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useCheckout } from '@/context/CheckoutContext';
import { cn } from '@/lib/utils';

export const AccountSetup = () => {
  const { login, signup, isAuthenticated } = useAuth();
  const { nextStep, selectedPackage } = useCheckout();
  const [isLogin, setIsLogin] = useState(false);
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
        result = await login(formData.email, formData.password);
      } else {
        result = await signup(formData.email, formData.password, formData.firstName, formData.lastName);
      }
      
      if (result.success) {
        nextStep();
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch (err) {
      setError(isLogin ? 'Invalid email or password' : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground">You&apos;re logged in!</h2>
        <p className="text-muted-foreground mt-2">Proceeding to payment setup...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-foreground">
          {isLogin ? 'Welcome Back' : 'Create Your Account'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isLogin ? 'Log in to continue with your subscription' : 'Set up your account to manage your subscription'}
        </p>
      </div>

      <div className="max-w-md mx-auto">
        {/* Selected Package Summary */}
        {selectedPackage && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selected Package</p>
              <p className="font-semibold text-foreground">{selectedPackage.name} Package</p>
            </div>
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
        )}

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
    </div>
  );
};

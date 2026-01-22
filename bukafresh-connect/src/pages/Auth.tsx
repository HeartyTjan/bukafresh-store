import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

type AuthMode = 'login' | 'signup' | 'forgot';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (mode === 'forgot') {
        // Mock forgot password - simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuccessMessage('Password reset link sent! Check your email.');
        setIsLoading(false);
        return;
      }

      let result;
      if (mode === 'login') {
        result = await login(email, password);
      } else {
        result = await signup(email, password, firstName, lastName);
      }

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setSuccessMessage('');
  };

  const getHeadingText = () => {
    if (mode === 'forgot') return 'Reset Password';
    return mode === 'login' ? 'Welcome back!' : 'Create your account';
  };

  const getButtonText = () => {
    if (isLoading) return 'Please wait...';
    if (mode === 'forgot') return 'Send Reset Link';
    return mode === 'login' ? 'Sign In' : 'Create Account';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 justify-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-3xl font-display font-bold text-foreground">
                Buka<span className="text-primary">Fresh</span>
              </span>
            </Link>
            <p className="text-muted-foreground mt-2">
              {getHeadingText()}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-2xl shadow-elegant border border-border/50 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {mode === 'signup' && (
                    <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                  )}
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(''); setSuccessMessage(''); }}
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
              )}

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="bg-primary/10 text-primary text-sm p-3 rounded-lg">
                  {successMessage}
                </div>
              )}

              <Button 
                type="submit" 
                variant="hero" 
                className="w-full h-12 text-base"
                disabled={isLoading}
              >
                {getButtonText()}
              </Button>
            </form>

            {/* Test Credentials */}
            {mode === 'login' && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-dashed border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">🧪 Test Credentials</p>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="text-foreground">Email: <code className="bg-muted px-1 rounded">test@example.com</code></p>
                    <p className="text-foreground mt-1">Password: <code className="bg-muted px-1 rounded">password123</code></p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => {
                      setEmail('test@example.com');
                      setPassword('password123');
                    }}
                  >
                    Fill
                  </Button>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Toggle Mode */}
            <p className="text-center text-muted-foreground">
              {mode === 'forgot' ? (
                <>
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setSuccessMessage(''); }}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-primary hover:underline font-medium"
                  >
                    {mode === 'login' ? 'Sign Up' : 'Sign In'}
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Terms */}
          {mode === 'signup' && (
            <p className="text-center text-xs text-muted-foreground mt-4">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Auth;

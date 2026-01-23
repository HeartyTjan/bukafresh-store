import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';
import { useVerifyEmail, useResendVerificationEmail } from '@/features/auth/api/queries';

type VerificationStatus = 'loading' | 'success' | 'error' | 'expired';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  
  const verifyEmail = useVerifyEmail();
  const resendVerification = useResendVerificationEmail();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('No verification token provided');
      return;
    }

    // Simulate verification process
    const verifyToken = async () => {
      try {
        await verifyEmail.mutateAsync(token);
        setStatus('success');
      } catch (error) {
        if (error instanceof Error && error.message.includes('expired')) {
          setStatus('expired');
          setErrorMessage('This verification link has expired');
        } else {
          setStatus('error');
          setErrorMessage(error instanceof Error ? error.message : 'Verification failed');
        }
      }
    };

    verifyToken();
  }, [token]);

  const handleResendEmail = async () => {
    try {
      await resendVerification.mutateAsync();
      setResendSuccess(true);
    } catch (error) {
      setErrorMessage('Failed to resend verification email. Please try again.');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <CardTitle className="text-2xl mb-2">Verifying your email...</CardTitle>
            <CardDescription className="text-base">
              Please wait while we verify your email address
            </CardDescription>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl mb-2 text-primary">Email Verified!</CardTitle>
            <CardDescription className="text-base mb-6">
              Your email has been successfully verified. You can now access all features of your account.
            </CardDescription>
            <Button onClick={() => navigate('/dashboard')} className="gap-2">
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
              <Mail className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-2xl mb-2 text-accent">Link Expired</CardTitle>
            <CardDescription className="text-base mb-6">
              This verification link has expired. Please request a new one.
            </CardDescription>
            {resendSuccess ? (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-primary">
                <CheckCircle className="h-5 w-5 inline mr-2" />
                A new verification email has been sent. Please check your inbox.
              </div>
            ) : (
              <Button 
                onClick={handleResendEmail} 
                disabled={resendVerification.isPending}
                className="gap-2"
              >
                {resendVerification.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Resend Verification Email
                  </>
                )}
              </Button>
            )}
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl mb-2 text-destructive">Verification Failed</CardTitle>
            <CardDescription className="text-base mb-6">
              {errorMessage || 'We couldn\'t verify your email. The link may be invalid or already used.'}
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={handleResendEmail}
                disabled={resendVerification.isPending}
              >
                {resendVerification.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  'Resend Verification Email'
                )}
              </Button>
              <Button asChild>
                <Link to="/auth">Back to Login</Link>
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="pb-0">
          <div className="flex justify-center mb-4">
            <Link to="/" className="text-2xl font-display font-bold text-primary">
              FreshBox
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}

import { useAuthActions } from '@convex-dev/auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignInData = z.infer<typeof signInSchema>;
type SignUpData = z.infer<typeof signUpSchema>;

export const useAuth = () => {
  const { signIn, signOut } = useAuthActions();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const handleSignIn = async (data: SignInData) => {
    setIsLoading(true);
    try {
      await signIn('password', {
        email: data.email,
        password: data.password,
        flow: 'signin',
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Sign-in error:', error);
      signInForm.setError('password', {
        message: 'Invalid email or password',
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSignUp = async (data: SignUpData) => {
    setIsLoading(true);
    try {
      await signIn('password', {
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        flow: 'signup',
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Sign-up error:', error);
      signUpForm.setError('root', {
        message: 'Failed to create account. Email may already be in use.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
  };

  return {
    signInForm,
    signUpForm,
    handleSignIn,
    handleSignUp,
    handleSignOut,
    isLoading,
  };
};

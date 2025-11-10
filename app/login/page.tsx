import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">
            FUTSAL<span className="text-primary">KU</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Platform booking lapangan futsal terbaik
          </p>
        </div>
        
        <div className="bg-card shadow-sm border border-border rounded-lg p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

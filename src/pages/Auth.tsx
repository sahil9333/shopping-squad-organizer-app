
import { AuthForm } from "@/components/AuthForm";

export default function Auth() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">ShopListia</h1>
        <AuthForm />
      </div>
    </div>
  );
}


import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Account = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  // Simple display-only functionality
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    
    try {
      // Just show success toast without database interaction
      toast({
        title: "Success",
        description: "Display name updated in UI",
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Account Management</h1>
        <div className="flex justify-center mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage 
              src={undefined} 
              alt={displayName || 'User avatar'}
            />
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label htmlFor="display-name" className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <Input
              id="display-name"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              placeholder="Email"
              type="email"
              value={user?.email || ''}
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          <Button type="submit" className="w-full" disabled={updateLoading}>
            {updateLoading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="w-full"
          >
            Back to Lists
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Account;

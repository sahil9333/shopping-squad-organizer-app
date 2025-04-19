
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Account = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    display_name: '',
    email: user?.email || '',
    avatar_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.log('Error fetching profile:', error);
        // Set default profile with user email if no profile exists
        setProfile({
          display_name: '',
          email: user.email || '',
          avatar_url: ''
        });
      } else {
        // Profile exists, use it
        setProfile({
          display_name: data.display_name || '',
          email: data.email || user.email || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error: any) {
      console.error('Error in fetch profile operation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    
    try {
      if (!user) throw new Error("User not authenticated");

      // First check if profile exists
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (error) {
        // Profile doesn't exist, create a new one
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: user.id,
            display_name: profile.display_name,
            email: user.email
          }]);
        
        if (insertError) throw insertError;
      } else {
        // Profile exists, update it
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            display_name: profile.display_name
          })
          .eq('id', user.id);
        
        if (updateError) throw updateError;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
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
              src={profile.avatar_url || undefined} 
              alt={profile.display_name || 'User avatar'}
            />
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        {loading ? (
          <div className="text-center my-4">Loading profile...</div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label htmlFor="display-name" className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <Input
                id="display-name"
                placeholder="Display Name"
                value={profile.display_name}
                onChange={(e) => setProfile({...profile, display_name: e.target.value})}
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
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <Button type="submit" className="w-full" disabled={updateLoading}>
              {updateLoading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        )}
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

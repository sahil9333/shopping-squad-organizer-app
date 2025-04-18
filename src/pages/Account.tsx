
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

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // First check if profile exists
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // If profile exists, use it
      if (data && data.length > 0) {
        setProfile({
          display_name: data[0].display_name || '',
          email: data[0].email || user.email || '',
          avatar_url: data[0].avatar_url || ''
        });
      } else {
        // If profile doesn't exist, create it
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: user.id,
            email: user.email 
          }]);
        
        if (insertError) {
          throw insertError;
        }
        
        // Set default profile with user email
        setProfile({
          display_name: '',
          email: user.email || '',
          avatar_url: ''
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profile.display_name,
          email: profile.email
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
            <Input
              placeholder="Display Name"
              value={profile.display_name}
              onChange={(e) => setProfile({...profile, display_name: e.target.value})}
            />
            <Input
              placeholder="Email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              disabled
            />
            <Button type="submit" className="w-full">
              Update Profile
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

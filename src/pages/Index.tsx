
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import ShoppingList, { ShoppingListData } from '@/components/ShoppingList';
import CreateListDialog from '@/components/CreateListDialog';
import { Button } from "@/components/ui/button";
import { LogOut, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [lists, setLists] = useState<ShoppingListData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    const { data, error } = await supabase
      .from('shopping_lists')
      .select(`
        id,
        title,
        items:shopping_items (
          id,
          name,
          quantity,
          notes,
          price,
          purchase_date,
          purchased
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch shopping lists",
        variant: "destructive",
      });
      return;
    }

    setLists(data || []);
  };

  const handleCreateList = async (title: string) => {
    const { data, error } = await supabase
      .from('shopping_lists')
      .insert([{ title, user_id: user?.id }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create shopping list",
        variant: "destructive",
      });
      return;
    }

    setLists([{ ...data, items: [] }, ...lists]);
    toast({
      title: "Success",
      description: `${title} has been created successfully.`,
    });
  };

  const handleEditList = async (id: string, newTitle: string) => {
    const { error } = await supabase
      .from('shopping_lists')
      .update({ title: newTitle })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update shopping list",
        variant: "destructive",
      });
      return;
    }

    setLists(lists.map(list => 
      list.id === id ? { ...list, title: newTitle } : list
    ));
    toast({
      title: "Success",
      description: "List updated successfully",
    });
  };

  const handleDeleteList = async (id: string) => {
    const { error } = await supabase
      .from('shopping_lists')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete shopping list",
        variant: "destructive",
      });
      return;
    }

    setLists(lists.filter(list => list.id !== id));
    toast({
      title: "Success",
      description: "Shopping list has been deleted.",
    });
  };

  const handleDuplicateList = async (id: string) => {
    const listToDuplicate = lists.find(list => list.id === id);
    if (!listToDuplicate) return;

    const { data: newList, error: listError } = await supabase
      .from('shopping_lists')
      .insert([{ 
        title: `${listToDuplicate.title} (Copy)`,
        user_id: user?.id
      }])
      .select()
      .single();

    if (listError || !newList) {
      toast({
        title: "Error",
        description: "Failed to duplicate list",
        variant: "destructive",
      });
      return;
    }

    // Duplicate items
    if (listToDuplicate.items.length > 0) {
      const { error: itemsError } = await supabase
        .from('shopping_items')
        .insert(
          listToDuplicate.items.map(item => ({
            list_id: newList.id,
            name: item.name,
            quantity: item.quantity,
            notes: item.notes,
            purchased: item.purchased
          }))
        );

      if (itemsError) {
        toast({
          title: "Error",
          description: "Failed to duplicate list items",
          variant: "destructive",
        });
        return;
      }
    }

    await fetchLists(); // Refresh the lists to get the new items
    toast({
      title: "Success",
      description: `${listToDuplicate.title} has been duplicated.`,
    });
  };

  const handleToggleItem = async (listId: string, itemId: string) => {
    const list = lists.find(l => l.id === listId);
    if (!list) return;

    const item = list.items.find(i => i.id === itemId);
    if (!item) return;

    const { error } = await supabase
      .from('shopping_items')
      .update({ purchased: !item.purchased })
      .eq('id', itemId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update item status",
        variant: "destructive",
      });
      return;
    }

    setLists(lists.map(l => {
      if (l.id === listId) {
        return {
          ...l,
          items: l.items.map(i => 
            i.id === itemId ? { ...i, purchased: !i.purchased } : i
          )
        };
      }
      return l;
    }));
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const handleAccountManagement = () => {
    navigate('/account');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">ShopListia</h1>
          <div className="flex space-x-2">
            <Button variant="ghost" onClick={handleAccountManagement}>
              <UserCog className="mr-2" size={18} />
              Account
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="mr-2" size={18} />
              Sign Out
            </Button>
          </div>
        </div>
        
        {lists.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            <p className="text-lg">No shopping lists yet</p>
            <p className="text-sm mt-2">Create your first shopping list to get started!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {lists.map(list => (
              <ShoppingList
                key={list.id}
                list={list}
                onEdit={handleEditList}
                onDelete={handleDeleteList}
                onDuplicate={handleDuplicateList}
                onToggleItem={handleToggleItem}
                onRefreshList={fetchLists}
              />
            ))}
          </div>
        )}
        <CreateListDialog onCreateList={handleCreateList} />
      </div>
    </div>
  );
};

export default Index;

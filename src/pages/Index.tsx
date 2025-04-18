
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import ShoppingList, { ShoppingListData } from '@/components/ShoppingList';
import CreateListDialog from '@/components/CreateListDialog';

const Index = () => {
  const { toast } = useToast();
  const [lists, setLists] = useState<ShoppingListData[]>([]);

  const handleCreateList = (title: string) => {
    const newList: ShoppingListData = {
      id: Date.now().toString(),
      title,
      items: [],
    };
    setLists([...lists, newList]);
    toast({
      title: "Shopping list created",
      description: `${title} has been created successfully.`,
    });
  };

  const handleEditList = (id: string) => {
    // To be implemented in next iteration
    toast({
      title: "Coming soon",
      description: "Edit functionality will be available soon!",
    });
  };

  const handleDeleteList = (id: string) => {
    setLists(lists.filter(list => list.id !== id));
    toast({
      title: "List deleted",
      description: "Shopping list has been deleted.",
    });
  };

  const handleDuplicateList = (id: string) => {
    const listToDuplicate = lists.find(list => list.id === id);
    if (listToDuplicate) {
      const duplicatedList: ShoppingListData = {
        ...listToDuplicate,
        id: Date.now().toString(),
        title: `${listToDuplicate.title} (Copy)`,
      };
      setLists([...lists, duplicatedList]);
      toast({
        title: "List duplicated",
        description: `${listToDuplicate.title} has been duplicated.`,
      });
    }
  };

  const handleToggleItem = (listId: string, itemId: string) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.map(item => 
            item.id === itemId ? { ...item, purchased: !item.purchased } : item
          ),
        };
      }
      return list;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Shopping Lists
        </h1>
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

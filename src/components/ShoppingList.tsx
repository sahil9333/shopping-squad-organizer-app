
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from 'lucide-react';
import ShoppingListItem from './ShoppingListItem';
import EditListDialog from './EditListDialog';
import AddItemDialog from './AddItemDialog'; // New import

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  notes?: string;
  price?: number | null;
  purchase_date?: string | null;
  purchased: boolean;
}

export interface ShoppingListData {
  id: string;
  title: string;
  items: ShoppingItem[];
}

interface ShoppingListProps {
  list: ShoppingListData;
  onEdit: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleItem: (listId: string, itemId: string) => void;
  onRefreshList: () => void; // New prop
}

const ShoppingList: React.FC<ShoppingListProps> = ({
  list,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleItem,
  onRefreshList, // Added
}) => {
  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{list.title}</h3>
          <div className="flex gap-2">
            <EditListDialog
              listId={list.id}
              currentTitle={list.title}
              onEdit={onEdit}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDuplicate(list.id)}
              className="text-gray-600 hover:text-primary"
            >
              <Copy size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(list.id)}
              className="text-gray-600 hover:text-destructive"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          {list.items.map((item) => (
            <ShoppingListItem
              key={item.id}
              item={item}
              onToggle={() => onToggleItem(list.id, item.id)}
            />
          ))}
        </div>
        <AddItemDialog 
          listId={list.id} 
          onItemAdded={onRefreshList} 
        />
      </div>
    </Card>
  );
};

export default ShoppingList;

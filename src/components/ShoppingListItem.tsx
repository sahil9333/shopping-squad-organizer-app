
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import type { ShoppingItem } from './ShoppingList';
import { format } from 'date-fns';

interface ShoppingListItemProps {
  item: ShoppingItem;
  onToggle: () => void;
}

const ShoppingListItem: React.FC<ShoppingListItemProps> = ({ item, onToggle }) => {
  return (
    <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md group">
      <Checkbox
        checked={item.purchased}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
      <div className={`flex-1 ${item.purchased ? 'line-through text-gray-400' : ''}`}>
        <div className="flex items-center justify-between">
          <span className="font-medium">{item.name}</span>
          <div className="flex items-center space-x-2">
            {item.quantity && <span className="text-sm text-gray-500">{item.quantity}</span>}
            {item.price && <span className="text-sm text-gray-500">${item.price.toFixed(2)}</span>}
          </div>
        </div>
        {item.notes && (
          <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
        )}
        {item.purchase_date && (
          <p className="text-xs text-gray-400 mt-1">
            {format(new Date(item.purchase_date), 'PP')}
          </p>
        )}
      </div>
    </div>
  );
};

export default ShoppingListItem;

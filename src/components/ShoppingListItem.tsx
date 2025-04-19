
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import type { ShoppingItem } from './ShoppingList';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import EditItemDialog from './EditItemDialog';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ShoppingListItemProps {
  item: ShoppingItem;
  onToggle: () => void;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

const ShoppingListItem: React.FC<ShoppingListItemProps> = ({ 
  item, 
  onToggle, 
  onDelete,
  onUpdate 
}) => {
  const { toast } = useToast();
  
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('shopping_items')
        .delete()
        .eq('id', item.id);
        
      if (error) throw error;
      
      onDelete(item.id);
      toast({
        title: "Success",
        description: "Item deleted successfully",
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
      <div className="flex space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <EditItemDialog item={item} onItemUpdated={onUpdate} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Item</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDelete}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
              >
                <Trash2 size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Item</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ShoppingListItem;

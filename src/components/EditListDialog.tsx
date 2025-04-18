
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit } from 'lucide-react';

interface EditListDialogProps {
  listId: string;
  currentTitle: string;
  onEdit: (id: string, title: string) => void;
}

const EditListDialog: React.FC<EditListDialogProps> = ({
  listId,
  currentTitle,
  onEdit,
}) => {
  const [title, setTitle] = useState(currentTitle);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onEdit(listId, title.trim());
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-primary">
          <Edit size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit List Title</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            placeholder="List Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!title.trim()}>
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditListDialog;

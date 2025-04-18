
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ListPlus, Plus } from 'lucide-react';

interface CreateListDialogProps {
  onCreateList: (title: string) => void;
}

const CreateListDialog: React.FC<CreateListDialogProps> = ({ onCreateList }) => {
  const [title, setTitle] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateList(title.trim());
      setTitle('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ListPlus className="mr-2" />
          New List
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Shopping List</DialogTitle>
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
              Create List
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateListDialog;

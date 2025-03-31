
import React from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, ButtonProps } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  /** The item name to be displayed in the confirmation message */
  itemName: string;
  /** Custom title for the dialog (optional) */
  title?: string;
  /** Custom description for the dialog (optional) */
  description?: string;
  /** The function to call when deletion is confirmed */
  onConfirm: () => Promise<void> | void;
  /** Custom text for the confirm button (optional) */
  confirmText?: string;
  /** Custom text for the cancel button (optional) */
  cancelText?: string;
  /** Custom props for the trigger button (optional) */
  triggerButtonProps?: ButtonProps;
  /** Children as trigger (optional) */
  children?: React.ReactNode;
}

/**
 * A reusable dialog component for confirming deletions throughout the application
 */
export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  itemName,
  title = "Are you sure?",
  description,
  onConfirm,
  confirmText = "Delete",
  cancelText = "Cancel",
  triggerButtonProps,
  children,
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  const defaultDescription = `This action cannot be undone. This will permanently delete ${itemName}.`;
  
  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children || (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
            {...triggerButtonProps}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import queryString from "query-string";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Trash } from "lucide-react";

interface IProps {
  id: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
}
const DeleteMessageModal = ({ id, socketQuery, socketUrl }: IProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const url = queryString.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      const res = await axios.delete(url);
      if (res?.status === 200) {
        router.refresh();
        toast.success("Message deleted successfully");
        setOpen(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error((error as Error)?.message || "something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Trash className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
        </DialogTrigger>
        <DialogContent className="bg-white text-black p-0">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-center text-2xl font-bold">
              Delete Message
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Are you sure you want to delete this message
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-gray-100 px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <Button
                disabled={isLoading}
                onClick={() => setOpen(false)}
                variant={"ghost"}
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                onClick={handleDelete}
                variant={"primary"}
              >
                {isLoading ? "Confirming..." : "Confirm"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteMessageModal;

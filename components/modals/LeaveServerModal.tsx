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

import { useState } from "react";
import { Server } from "@/lib/generated/prisma";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";

interface IProps {
  server: Server;
}
const LeaveServerModal = ({ server }: IProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/servers/${server?.id}/leave`);
      if(response?.status === 200){
        router.refresh();
        toast.success("Leaving Successfully")
        setOpen(false)
        router.push("/");
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
        <DialogTrigger>Leave Server</DialogTrigger>
        <DialogContent className="bg-white text-black p-0">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-center text-2xl font-bold">
              Leave Server
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Are you sure you want to leave{" "}
              <span className="font-semibold text-indigo-500">
                {server?.name}
              </span>
              ?
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

export default LeaveServerModal;

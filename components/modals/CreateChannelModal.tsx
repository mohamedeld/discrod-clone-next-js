"use client";

import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { channelSchema } from "@/validations/AuthSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Channel, ChannelType } from "@/lib/generated/prisma";
import queryString from "query-string";
import { Edit, Plus } from "lucide-react";
import { ServerWithMembersWithProfiles } from "@/types";


interface IProps{
    server?:ServerWithMembersWithProfiles;
    isIcon?:boolean;
    channelType?:ChannelType;
    channel?:Channel;
    isUpdate?:boolean;
}

const CreateChannelModal = ({server,isIcon,channelType,channel,isUpdate}:IProps) => {
  const router = useRouter();
  const [open,setOpen] = useState(false);

  const form = useForm<z.infer<typeof channelSchema>>({
    defaultValues: {
      name:channel?.name ? channel?.name:'',
      type:channel?.type ? channel?.type : channelType || "TEXT"
    },
    resolver: zodResolver(channelSchema),
    mode: "onChange",
  });
  const isSubmitting = form?.formState?.isSubmitting;
  const onSubmit = async (data: z.infer<typeof channelSchema>) => {
    try {
        const url = queryString.stringifyUrl({
            url:`/api/channels`,
            query:{
                serverId:server?.id
            }
        })
        const response = await axios.post(url,data);
        if(response?.status ===200){    
            form.reset();
            router.refresh();
            toast.success("Channel created successfully");
            setOpen(false);
          }
    } catch (error) {
        if(axios.isAxiosError(error) && error?.response){
            toast.error(error?.response?.data?.message)
        }else{
            toast.error((error as Error)?.message || "something went wrong");
        }
    }
  };
  return (
    <div>
       <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
       {isUpdate ? <Edit className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"/> :isIcon ? <button className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                    <Plus className="h-4 w-4"/>
                </button> :<button>Create Channel</button>}
      </DialogTrigger>
      <DialogContent className="bg-white text-black p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-2xl font-bold">
           {isUpdate ? 'Edit' : 'Create'} Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Channel name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        className="!bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter channel name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Channel Type</FormLabel>
                        <Select disabled={isSubmitting} onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="w-full !bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                    <SelectValue
                                        placeholder="Select a channel type"
                                    />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="w-full">
                                {Object.values(ChannelType)?.map((channel)=>(
                                    <SelectItem key={channel} value={channel} className="capitalize">{channel?.toLowerCase()}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                )}  
            />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isSubmitting} variant={"primary"}>
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    </div>
  )
}

export default CreateChannelModal
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
import queryString from "query-string"
import {
  Form,
  FormControl,
  FormField,
  FormItem,

} from "@/components/ui/form";
import {  formUploadSchema } from "@/validations/AuthSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IProps{
    apiUrl:string;
    query?:Record<string, any>;
}
const MessageFileModal = ({query,apiUrl}:IProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formUploadSchema>>({
    defaultValues: {
      imageUrl: "",
    },
    resolver: zodResolver(formUploadSchema),
    mode: "onChange",
  });
  const isSubmitting = form?.formState?.isSubmitting;
  const onSubmit = async (data: z.infer<typeof formUploadSchema>) => {
    try {
        const url = queryString.stringifyUrl({
            url:apiUrl,
            query
        });

      const response = await axios.post(url, 
        {...data,content:data?.imageUrl}
      );
      if (response?.status === 200) {
        form.reset();
        router.refresh();
        toast.success("File uploaded successfully");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error?.response) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error((error as Error)?.message || "something went wrong");
      }
    }finally{
        form.reset();
        setOpen(false);
    }
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
          >
            <Plus className="text-white dark:text-[#313338]" />
          </button>
        </DialogTrigger>
        <DialogContent className="bg-white text-black p-0">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-center text-2xl font-bold">
              Add an attachment
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Send a file as message
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8 px-6">
                <div className="flex items-center justify-center text-center">
                  <FormField
                    name="imageUrl"
                    control={form.control}
                    render={({ field }) => {
                      const fileType = field?.value?.split(".").pop();

                      return (
                        <FormItem>
                          <FormControl>
                            {field?.value && fileType !== "pdf" ? (
                              <div className="relative h-20 w-20">
                                <Image
                                  src={field?.value}
                                  alt="upload image"
                                  fill
                                  className="object-cover"
                                />
                                <button
                                  className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                                  onClick={() => field.onChange("")}
                                  type="button"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <UploadDropzone
                                endpoint={"imageUploader"}
                                onClientUploadComplete={(res) => {
                                  // Do something with the response
                                  console.log("Files: ", res);
                                  field.onChange(res?.[0]?.ufsUrl);
                                  toast.success("Upload Completed");
                                }}
                                onUploadError={(error: Error) => {
                                  // Do something with the error.
                                  toast.error(`ERROR! ${error.message}`);
                                }}
                              />
                            )}
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </div>
                
              </div>
              <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button disabled={isSubmitting} variant={"primary"}>
                  {isSubmitting ? "Sending..." : "Send"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageFileModal;

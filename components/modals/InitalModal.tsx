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
import { formSchema } from "@/validations/AuthSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {  UploadDropzone } from "@/utils/uploadthing";
import "@uploadthing/react/styles.css"
import Image from "next/image";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const InitalModal = () => {
    const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: "",
      imageUrl: "",
    },
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });
  const isSubmitting = form?.formState?.isSubmitting;
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
        const response = await axios.post("/api/servers",data);
        if(response?.status ===200){
            form.reset();
            router.refresh();
            toast.success("Server created successfully");
            window.location.reload();
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
        <Dialog open={true}>
      <DialogTrigger>
      </DialogTrigger>
      <DialogContent className="bg-white text-black p-0 !top-[10%] !left-[40%]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-2xl font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later.
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
                        {(field?.value && fileType !== "pdf") ?
                        <div className="relative h-20 w-20">
                            <Image src={field?.value} alt="upload image" fill className="object-cover"/>
                            <button className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm" onClick={()=> field.onChange("")} type="button">
                                <X className="h-4 w-4"/>
                            </button>
                        </div> : <UploadDropzone
                          endpoint={"imageUploader"}
                          
                          onClientUploadComplete={(res) => {
                            // Do something with the response
                            console.log("Files: ", res);
                            field.onChange(res?.[0]?.ufsUrl)
                            toast.success("Upload Completed");
                          }}
                          onUploadError={(error: Error) => {
                            // Do something with the error.
                            toast.error(`ERROR! ${error.message}`);
                          }}
                        />}
                      </FormControl>
                    </FormItem>
                  )
                  }}
                />
              </div>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Server name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        className="bg-zinc-500 border-0 focus-visible:ring-0 text-black dark:focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
  );
};

export default InitalModal;

"use client";
import queryString from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios";
import { toast } from "sonner";
import MessageFileModal from "../modals/MessageFileModal";
import EmojiPicker from "../EmojiPicker";
import { useRouter } from "next/navigation";

interface IProps {
    apiUrl: string;
    query?: Record<string, any>;
    name: string;
    type: "channel" | "conversation";
}

const formSchema = z.object({
    content: z.string()
})

const ChatInput = ({ apiUrl, query, name, type }: IProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            content: ""
        },
        resolver: zodResolver(formSchema)
    });
    const router = useRouter();
    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const url = queryString.stringifyUrl({
                url: apiUrl,
                query,
            });
            const response = await axios.post(url,data);
            if(response.status !== 200){
                toast.error("Failed to send message");
                return;
            }
            form.reset();
            router.refresh();
        } catch (error) {
            if (axios.isAxiosError(error) && error?.response) {
                console.log("error",error?.response?.data)
                toast.error(error?.response?.data?.message)
            } else {
                console.log("error", error);
                toast.error((error as Error)?.message || "something went wrong");
            }
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    name="content"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6">
                                    <MessageFileModal query={query} apiUrl={apiUrl}/>
                                    <Input disabled={isSubmitting} className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                        {...field} placeholder={`Message ${type === "conversation" ? name : '#' + name}`} />
                                    <div className="absolute top-7 right-8 ">
                                        <EmojiPicker 
                                            onChange={(emoji:string)=> field.onChange(`${field?.value} ${emoji}`)}
                                        />
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}

export default ChatInput
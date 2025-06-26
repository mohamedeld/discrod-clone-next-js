"use client";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authSchema } from "@/validations/AuthSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof authSchema>>({
        defaultValues: {
            name: '',
            email: ""
        },
        resolver: zodResolver(authSchema),
        mode: 'onChange'
    })
    const onSubmit = async (data: z.infer<typeof authSchema>) => {
        try{
            const result = await signIn("credentials",{
                redirect:false,
                ...data
            });
            if(result.error){
                console.log(result.error)
                toast.error(result?.error);
                return;
            }
            toast.success("Logged in successfully");
            router.push("/");
        }catch(error){
            toast.error((error as Error)?.message || "Something went wrong" )
        }
    }
    const isSubmitting = form.formState.isSubmitting;
    return (
        <div className="w-full md:w-[30rem]">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-center text-2xl">Create Account</CardTitle>
                    <CardDescription></CardDescription>
                    <CardAction></CardAction>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Email" type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button disabled={isSubmitting} className="w-full cursor-pointer" type="submit">{
                                isSubmitting ? "Submitting..." : "Create Account"
                                }</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginForm
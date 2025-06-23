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

const LoginForm = () => {
    const form = useForm<z.infer<typeof authSchema>>({
        defaultValues: {
            name: '',
            email: ""
        },
        resolver: zodResolver(authSchema),
        mode: 'onChange'
    })
    const onSubmit = async (data: z.infer<typeof authSchema>) => {
        console.log(data);
        // Here you would typically handle the form submission, e.g., send data to an API
        // For example:
        // await api.post('/login', data);
    }
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
                            <Button disabled={form?.formState?.isSubmitting} className="w-full" type="submit">{
                                form?.formState?.isSubmitting ? "Submitting..." : "Create Account"
                                }</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginForm
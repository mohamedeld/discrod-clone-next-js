import { z } from 'zod';

export const authSchema = z.object({
    name:z.string({message:"name is required"}).min(1,{
        message: "Name is required"
    }).max(50, {
        message: "Name must be less than 50 characters"
    }),
    email:z.string({message:"email is required"}).email({
        message: "Invalid email address"
    })
})
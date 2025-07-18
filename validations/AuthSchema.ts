import { ChannelType } from '@/lib/generated/prisma';
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

export const formSchema = z.object({
    name:z.string().min(1,{message:"server name is required"}),
    imageUrl:z.string().min(1,{message:"server image is required"})
})
export const formUploadSchema = z.object({
    imageUrl:z.string().min(1,{message:"server image is required"})
})
export const channelSchema = z.object({
    name:z.string().min(1,{message:"Channel name is required"}).refine(
        name=> name !== "general",{
            message:"Channel can not be 'general'"
        }
    ),
    type:z.nativeEnum(ChannelType),
})
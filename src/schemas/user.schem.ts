import { z } from 'zod';

export const UserRegisterSchema = z.object({
    body: z.object({
        name: z.string().trim().min(4, "Username too short"),
        email: z.email("Invalid email address").toLowerCase(),
        password: z.string().min(6, "Password too short"),
    }),
});

export const UserLoginSchema = z.object({
    body: z.object({
        name: z.string().trim().min(4, "Username too short"),
        password: z.string().min(6, "Password too short"),
    })
})
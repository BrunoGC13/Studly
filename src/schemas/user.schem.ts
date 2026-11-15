import { z } from 'zod';

export const UserRegisterSchema = z.object({
    body: z.object({
        name: z.string().min(4, "Username too short"),
        email: z.email("Invalid email address"),
        password: z.string().min(6, "Password too short"),
    })
})

export default { UserRegisterSchema };
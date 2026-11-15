import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import logger from "../util/logger";
import { IUser } from "../types/user.types";

type TemplateVariables = Record<string, string>;

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export class EmailService {
    private static transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: process.env.MAIL_SSL === "true",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWD,
        },
    });

    private static async getTemplate(
        templateName: string,
        variables: TemplateVariables = {},
    ): Promise<string> {
        const templatePath = path.join(
            __dirname,
            "../config/mailTemplates",
            `${templateName}.html`,
        );

        let template = await fs.readFile(templatePath, "utf-8");

        for (const [key, value] of Object.entries(variables)) {
            const placeholder = `{{${key}}}`;

            template = template.replace(
                new RegExp(placeholder, "g"),
                escapeHtml(value),
            );
        }

        return template;
    }

    static async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            logger.info("SMTP connection verified successfully");
            return true;
        } catch (error) {
            logger.error(
                { error },
                "SMTP connection verification failed",
            );
            return false;
        }
    }

    static async sendVerificationMail(
        target: IUser,
        verificationToken: string,
    ): Promise<void> {
        const verificationUrl = new URL(
            "/api/v1/user/verify",
            process.env.CLIENT_URL ?? "http://localhost:3000",
        );

        verificationUrl.searchParams.set(
            "token",
            verificationToken,
        );

        const html = await EmailService.getTemplate("verify", {
            verificationUrl: verificationUrl.toString(),
            verificationCode: verificationToken,
            year: new Date().getFullYear().toString(),
        });

        const message = {
            from: process.env.MAIL_FROM ?? "info@brunoglotz.com",
            to: target.email,
            subject: "Studly | Verify your email address",
            html,
        };

        try {
            const result = await EmailService.transporter.sendMail(message);

            logger.info(`Sent mail: ${result.messageId}`);
        } catch (error) {
            logger.error(
                { error, targetId: target.id },
                "Failed to send verification email",
            );

            throw error;
        }
    }
}
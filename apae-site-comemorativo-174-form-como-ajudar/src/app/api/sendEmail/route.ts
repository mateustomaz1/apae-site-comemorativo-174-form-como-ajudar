import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Force Node runtime for this API route because it uses nodemailer and Buffer APIs.
export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
            console.error("Missing GMAIL_USER or GMAIL_PASS environment variables");
            return NextResponse.json({ success: false, error: "Missing email configuration" }, { status: 500 });
        }
        const formData = await req.formData();
        const nome = formData.get("nome") as string;
        const email = formData.get("email") as string;
        const telefone = formData.get("telefone") as string;
        const assunto = formData.get("assunto") as string;
        const mensagem = formData.get("mensagem") as string;
        const anexo = formData.get("anexo") as File | null;

    const attachments: { filename: string; content: Buffer }[] = [];

        if (anexo) {
            const buffer = Buffer.from(await anexo.arrayBuffer());
            attachments.push({
                filename: anexo.name,
                content: buffer,
            });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER,
            subject: assunto,
            text: `Nome: ${nome}\nEmail: ${email}\nMensagem: ${mensagem}\nTelefone: ${telefone}`, attachments,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.log("Erro ao enviar email: ", error);

        return NextResponse.json({ success: false }, { status: 500 });
    }
}
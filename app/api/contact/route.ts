import { NextResponse } from "next/server";

interface ContactPayload {
  name: string;
  company?: string;
  phone?: string;
  email: string;
  budget?: string;
  message: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let payload: Partial<ContactPayload>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const { name, email, message } = payload;

  if (!name || name.trim().length < 2) {
    return NextResponse.json({ error: "Bitte geben Sie Ihren Namen an." }, { status: 400 });
  }

  if (!email || !emailPattern.test(email)) {
    return NextResponse.json({ error: "Bitte geben Sie eine gültige E-Mail-Adresse an." }, { status: 400 });
  }

  if (!message || message.trim().length < 10) {
    return NextResponse.json(
      { error: "Bitte beschreiben Sie Ihr Projekt in wenigen Sätzen." },
      { status: 400 }
    );
  }

  // In production, this would enqueue an email/CRM notification (e.g. via Resend or a CRM webhook).
  console.log("Neue Kontaktanfrage:", {
    name,
    company: payload.company ?? "",
    phone: payload.phone ?? "",
    email,
    budget: payload.budget ?? "",
    message,
  });

  return NextResponse.json({ ok: true });
}

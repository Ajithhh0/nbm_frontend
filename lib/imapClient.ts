import imaps, {
  ImapSimple,
  Message,
  MessagePart,
} from "imap-simple";
import { simpleParser, ParsedMail } from "mailparser";

interface ParsedEmail {
  from?: string;
  subject?: string;
  text?: string;
  date?: Date;
}

const config = {
  imap: {
    user: process.env.MAIL_EMAIL!,
    password: process.env.MAIL_PASSWORD!,
    host: process.env.IMAP_HOST!,
    port: Number(process.env.IMAP_PORT),
    tls: true,
    authTimeout: 10000,
  },
};

export async function readInbox(): Promise<ParsedEmail[]> {
  let connection: ImapSimple | null = null;

  try {
    connection = await imaps.connect(config);
    await connection.openBox("INBOX");

    const messages: Message[] = await connection.search(
      ["UNSEEN"],
      { bodies: [""], markSeen: true }
    );

    const emails: ParsedEmail[] = [];

    for (const item of messages) {
      const all: MessagePart | undefined = item.parts.find(
        (p) => p.which === ""
      );

      if (!all?.body) continue;

      const parsed: ParsedMail = await simpleParser(all.body);

      emails.push({
        from: parsed.from?.text,
        subject: parsed.subject ?? undefined,
        text: parsed.text ?? undefined,
        date: parsed.date ?? undefined,
      });
    }

    return emails;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

namespace NodeJS {
  interface ProcessEnv {
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_SECURE?: string;
    MAIL_EMAIL: string;
    MAIL_PASSWORD: string;
  }
}

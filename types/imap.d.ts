declare module "imap-simple" {
  import { ImapConfig } from "imap";

  export interface ImapSimpleOptions {
    imap: ImapConfig & {
      authTimeout?: number;
    };
  }

  export interface MessagePart {
    which: string;
    body: string | Buffer;
  }

  export interface Message {
    parts: MessagePart[];
  }

  export interface ImapSimple {
    openBox(boxName: string): Promise<void>;
    search(
      criteria: readonly unknown[],
      options: {
        bodies: string[];
        markSeen?: boolean;
      }
    ): Promise<Message[]>;
    end(): Promise<void>;
  }

  const imaps: {
    connect(config: ImapSimpleOptions): Promise<ImapSimple>;
  };

  export default imaps;
}

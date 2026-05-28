/// <reference types="astro/client" />

declare module 'lunar-javascript' {
  export const Lunar: any;
  export const Solar: any;
}

declare module 'pngjs' {
  export class PNG {
    width: number;
    height: number;
    data: Uint8Array;
    constructor(options?: { width?: number; height?: number });
  }
  export namespace PNG {
    const sync: { read(buf: Buffer): PNG };
  }
}

declare namespace App {
  interface Locals {
    todayTheme?: { cssVars: Record<string, string> };
  }
}

interface Window {
  Toast: {
    show: (message: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
  };
  __toast: (msg: string, type?: string, duration?: number) => void;
  showToast: (msg: string, type?: string) => void;
  confirmDialog: (message: string, danger?: boolean) => Promise<boolean>;
  promptDialog: (label: string, placeholder?: string) => Promise<string | null>;
}

import type { SVGProps } from "react";

export type WhatsAppIconProps = SVGProps<SVGSVGElement>;

/**
 * Ícone vetorial oficial do WhatsApp (balão de fala + fone).
 * Usa fill="currentColor" com regra evenodd para que a cor seja herdada
 * (ex: text-white, text-[#25D366], text-mineral) e o fone seja vazado.
 */
export function WhatsAppIcon({ className, ...props }: WhatsAppIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.676.15-.2.301-.777.979-.953 1.18-.175.201-.351.226-.652.075-.3-.151-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.676-2.085-.175-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.151-.176.201-.301.301-.502.1-.2.05-.376-.025-.526-.075-.151-.676-1.63-.928-2.233-.245-.588-.495-.508-.676-.517l-.577-.01c-.2 0-.527.075-.802.376-.276.301-1.053 1.029-1.053 2.509s1.078 2.909 1.229 3.11c.15.2 2.121 3.24 5.138 4.542.718.31 1.278.495 1.716.634.721.229 1.377.197 1.896.12.578-.087 1.78-.727 2.03-1.43.25-.702.25-1.304.175-1.43-.075-.126-.275-.201-.576-.351zM12.04 2C6.545 2 2.08 6.465 2.08 11.96c0 1.966.574 3.799 1.564 5.344L2.001 22l4.832-1.583a9.92 9.92 0 005.207 1.463h.004c5.492 0 9.957-4.465 9.957-9.96.002-5.495-4.463-9.96-9.958-9.96h-.003z"
      />
    </svg>
  );
}

export const WhatsappIcon = WhatsAppIcon;

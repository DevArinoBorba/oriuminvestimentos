import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { mockImages } from "@/lib/mock/images";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-areia/20 py-24 border-t border-areia/60">
      <Image
        src={mockImages.livingRoom3}
        alt="Interior contemporâneo de alto padrão"
        fill
        sizes="100vw"
        className="object-cover opacity-15"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/90 to-white/70" />
      <Container className="relative flex flex-col items-center gap-6 text-center">
        <span className="text-[12px] font-bold uppercase tracking-[0.22em] text-primary inline-flex items-center gap-1.5">
          <span className="text-[11px] font-black">↗</span> Atendimento consultivo
        </span>
        <h2 className="font-display text-balance max-w-2xl text-3xl font-normal leading-tight text-graphite md:text-4xl">
          Pronto para encontrar a oportunidade certa para o seu patrimônio?
        </h2>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <ButtonLink href="/contato" variant="primary">
            Falar com um especialista
          </ButtonLink>
          <ButtonLink href="/venda-seu-imovel" variant="secondary">
            Quero vender meu imóvel
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

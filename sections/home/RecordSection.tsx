import { Database, FileLock2, ScrollText } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/visual/Reveal";

/** 首页 06 —— Permanent Record（Record.） */
const records = [
  {
    icon: ScrollText,
    title: "A public record",
    text: "A shared, public record of network activity is a core design goal — visible and auditable by anyone.",
  },
  {
    icon: Database,
    title: "Verifiable, not merely stored",
    text: "Records are designed to be verifiable through proofs — a reader does not have to trust a single server.",
  },
  {
    icon: FileLock2,
    title: "Built to last, honestly",
    text: "Long-term preservation is a design aim. Durability is engineered and tested — absolute permanence is never promised as marketing.",
  },
];

export function RecordSection() {
  return (
    <section className="relative py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Record."
          title={
            <>
              A shared record, built to <span className="text-gradient">last</span>
            </>
          }
          description="YAZIMAO is designed around a public, verifiable record — so that what people create can be kept, checked and carried forward over the long term."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {records.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-white/8 bg-ink-800/40 p-6">
                <r.icon className="mb-4 h-6 w-6 text-nova-cyanSoft" />
                <h3 className="font-display text-base font-semibold text-mist-100">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-400 text-pretty">
                  {r.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

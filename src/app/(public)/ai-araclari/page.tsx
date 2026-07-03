import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Araçları",
  description: "Yapay zeka destekli araçlarla işinizi bir üst seviyeye taşıyın.",
};

export default function AIAraclariPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">AI Araçları</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Yapay zeka destekli araçlarla daha hızlı, daha akıllı çalışın.
        </p>
      </div>
      {/* AI araç kartları buraya gelecek */}
    </section>
  );
}

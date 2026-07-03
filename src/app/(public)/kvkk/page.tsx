import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında e-partnerim.com aydınlatma metni.",
};

const sections = [
  {
    title: "1. Veri Sorumlusu Hakkında",
    content:
      '6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, e-partnerim.com olarak kişisel verilerinizi, veri sorumlusu sıfatıyla, aşağıda açıklanan çerçevede işliyoruz.',
  },
  {
    title: "2. İşlenen Kişisel Veriler",
    content: "İletişim formu aracılığıyla aşağıdaki kişisel veriler toplanmaktadır:",
    list: [
      "Ad ve soyad",
      "E-posta adresi",
      "Telefon numarası",
      "Şirket adı (isteğe bağlı)",
      "Web sitesi adresi (isteğe bağlı)",
    ],
  },
  {
    title: "3. Kişisel Verilerin İşlenme Amacı",
    content: "Toplanan veriler yalnızca aşağıdaki amaçlarla işlenmektedir:",
    list: [
      "Talep ve şikâyetlere yanıt vermek",
      "İletişim faaliyetlerini yürütmek",
      "Müşteri ilişkileri yönetimi",
    ],
  },
  {
    title: "4. Kişisel Verilerin Aktarımı",
    content:
      "Veriler sınırlı olarak aşağıdaki taraflarla paylaşılabilir:",
    list: [
      "Google Analytics ve benzer analiz araçları",
      "Reklam platformları (Meta, Google Ads) – yalnızca anonim kullanım verileri",
    ],
    note: "Kişisel verileriniz, açık rızanız olmaksızın yurt dışına aktarılmaz.",
  },
  {
    title: "5. Toplama Yöntemi ve Hukuki Sebebi",
    content:
      "Kişisel verileriniz otomatik olmayan yollarla toplanmaktadır. Hukuki işleme sebepleri:",
    list: [
      "İlgili kişinin açık rızası (KVKK m.5/1)",
      "Bir hakkın tesisi, kullanılması veya korunması için veri işlenmesinin zorunlu olması (KVKK m.5/2-e)",
    ],
  },
  {
    title: "6. KVKK Kapsamındaki Haklarınız",
    content:
      "KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:",
    list: [
      "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
      "İşlenme amacını ve buna uygun kullanılıp kullanılmadığını öğrenme",
      "Aktarıldığı üçüncü kişileri bilme",
      "Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme",
      "Verilerin silinmesini veya yok edilmesini isteme",
      "Düzeltme/silme işlemlerinin üçüncü kişilere bildirilmesini isteme",
      "Otomatik sistemler aracılığıyla analiz edilmesi nedeniyle aleyhe sonuç doğurmasına itiraz etme",
      "Hukuka aykırı işleme nedeniyle uğradığınız zararın giderilmesini talep etme",
    ],
  },
  {
    title: "7. Başvuru Yöntemi",
    content:
      "Yukarıda belirtilen haklarınızı kullanmak için web sitemizin iletişim formu üzerinden veya info@e-partnerim.com e-posta adresine yazılı başvuru yapabilirsiniz. Başvurularınız en geç 30 gün içinde sonuçlandırılır.",
  },
];

export default function KvkkPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "KVKK" }]}
        badge="Yasal"
        title="KVKK Aydınlatma Metni"
        subtitle="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında hazırlanmıştır."
      />

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

          {/* Yürürlük tarihi */}
          <div className="mb-10 flex items-center gap-3 rounded-xl border border-[#E8EEF0] bg-[#FAFCFC] px-5 py-3.5">
            <div className="h-2 w-2 rounded-full bg-[#00D084] flex-shrink-0" />
            <p className="text-sm text-[#64748B]">
              <span className="font-semibold text-[#0F172A]">Yürürlük Tarihi:</span> 30.07.2025 &nbsp;·&nbsp;
              <span className="font-semibold text-[#0F172A]">Veri Sorumlusu:</span> e-partnerim.com
            </p>
          </div>

          {/* Bölümler */}
          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="mb-3 text-lg font-bold text-[#0F172A]">{section.title}</h2>
                <p className="text-sm leading-relaxed text-[#64748B]">{section.content}</p>

                {section.list && (
                  <ul className="mt-3 space-y-1.5">
                    {section.list.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-[#64748B]">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#00D084]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.note && (
                  <div className="mt-4 rounded-lg border-l-2 border-[#00D084] bg-[#F0FDF9] px-4 py-3">
                    <p className="text-sm text-[#0F172A]">{section.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* İletişim */}
          <div className="mt-14 rounded-2xl border border-[#E8EEF0] bg-[#FAFCFC] p-6">
            <p className="text-sm font-semibold text-[#0F172A]">Sorularınız için</p>
            <p className="mt-1 text-sm text-[#64748B]">
              KVKK kapsamındaki talepleriniz için{" "}
              <a href="mailto:info@e-partnerim.com" className="font-semibold text-[#0F172A] hover:underline underline-offset-4">
                info@e-partnerim.com
              </a>{" "}
              adresine ulaşabilirsiniz.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}

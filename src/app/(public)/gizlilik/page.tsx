import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "e-partnerim.com gizlilik politikası — kişisel verilerinizi nasıl topladığımız, kullandığımız ve koruduğumuz hakkında bilgi.",
};

const sections = [
  {
    title: "Toplanan Veriler",
    content:
      "Yalnızca iletişim formu aracılığıyla ve yalnızca sizin ilettiğiniz bilgiler toplanmaktadır. Bu veriler:",
    list: [
      "Ad ve soyad",
      "E-posta adresi",
      "Telefon numarası",
      "Şirket adı (isteğe bağlı)",
      "Web sitesi adresi (isteğe bağlı)",
    ],
  },
  {
    title: "Verilerin Kullanım Amacı",
    content:
      "Toplanan kişisel veriler yalnızca sizinle iletişim kurmak ve gelen sorularınıza yanıt vermek amacıyla kullanılır. Başka hiçbir amaçla işlenmez.",
  },
  {
    title: "Analiz ve İzleme Araçları",
    content:
      "Sitemiz, ziyaretçi davranışlarını anonim biçimde analiz etmek amacıyla aşağıdaki araçları kullanmaktadır:",
    list: [
      "Google Analytics — ziyaretçi istatistikleri (anonim)",
      "Google Ads — reklam performansı (anonim)",
      "Meta Pixel — reklam performansı (anonim)",
    ],
    note: "Bu araçlar aracılığıyla toplanan veriler kimliğinizle ilişkilendirilmez ve yalnızca istatistiksel amaçlarla kullanılır.",
  },
  {
    title: "Veri Paylaşımı",
    content:
      "Kişisel verileriniz hiçbir şekilde üçüncü taraf kişi veya kuruluşlarla paylaşılmaz, satılmaz veya kiralanmaz. Yukarıda belirtilen anonim analiz verileri bu kapsamın dışındadır.",
  },
  {
    title: "Kullanıcı Hakları",
    content: "Kişisel verilerinize ilişkin aşağıdaki hakları kullanabilirsiniz:",
    list: [
      "Verilerinize erişim talep etme",
      "Hatalı verilerin düzeltilmesini isteme",
      "Verilerinizin silinmesini talep etme",
      "İşlemenin durdurulmasını isteme",
    ],
    note: "Taleplerinizi iletişim formu veya e-posta yoluyla iletebilirsiniz. En geç 30 gün içinde yanıt verilir.",
  },
  {
    title: "Çerezler (Cookies)",
    content:
      "Sitemiz, analiz araçlarının çalışması için teknik çerezler kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz; ancak bu durumda bazı işlevler düzgün çalışmayabilir.",
  },
  {
    title: "Politika Güncellemeleri",
    content:
      "Bu gizlilik politikası gerektiğinde güncellenebilir. Yapılan değişiklikler bu sayfada yayımlanır ve yürürlük tarihi güncellenir. Önemli değişiklikler için kayıtlı kullanıcılara e-posta ile bildirim yapılabilir.",
  },
];

export default function GizlilikPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "Gizlilik Politikası" }]}
        badge="Yasal"
        title="Gizlilik Politikası"
        subtitle="Kişisel verilerinizi nasıl topladığımız, kullandığımız ve koruduğumuz hakkında şeffaf bilgi."
      />

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

          {/* Yürürlük tarihi */}
          <div className="mb-10 flex items-center gap-3 rounded-xl border border-[#E8EEF0] bg-[#FAFCFC] px-5 py-3.5">
            <div className="h-2 w-2 rounded-full bg-[#00D084] flex-shrink-0" />
            <p className="text-sm text-[#64748B]">
              <span className="font-semibold text-[#0F172A]">Yürürlük Tarihi:</span> 30.07.2025 &nbsp;·&nbsp;
              <span className="font-semibold text-[#0F172A]">Son Güncelleme:</span> 30.07.2025
            </p>
          </div>

          {/* Giriş */}
          <div className="mb-10 rounded-2xl border border-[#E8EEF0] bg-[#FAFCFC] p-6">
            <p className="text-sm leading-relaxed text-[#64748B]">
              e-partnerim.com olarak kullanıcılarımızın gizliliğine saygı duyuyor ve kişisel verilerin korunmasını öncelikli bir ilke olarak benimsiyoruz. Bu politika, sitemizi ziyaret ettiğinizde ve iletişim formunu kullandığınızda verilerinize nasıl davrandığımızı açıklamaktadır.
            </p>
          </div>

          {/* Bölümler */}
          <div className="space-y-10">
            {sections.map((section, i) => (
              <div key={section.title}>
                <h2 className="mb-3 text-lg font-bold text-[#0F172A]">
                  {i + 1}. {section.title}
                </h2>
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
            <p className="text-sm font-semibold text-[#0F172A]">Gizlilik talepleriniz için</p>
            <p className="mt-1 text-sm text-[#64748B]">
              Her türlü soru ve talebiniz için{" "}
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

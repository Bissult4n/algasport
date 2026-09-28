import type { ProductSpec, ProductSpecKey } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n";

const labels: Record<ProductSpecKey, TranslationKey> = {
  composition: "product.specComposition",
  origin: "product.specOrigin",
  certification: "product.specCertification",
  purpose: "product.specPurpose",
  feature: "product.specFeature",
  model: "product.specModel",
};

export function ProductFacts({
  specs,
  compact = false,
}: {
  specs?: ProductSpec[];
  compact?: boolean;
}) {
  const { t } = useI18n();
  if (!specs?.length) return null;
  return (
    <section className={`product-facts${compact ? " compact" : ""}`}>
      <h4>{t("product.quickFacts")}</h4>
      <dl>
        {specs.slice(0, 5).map((spec) => (
          <div key={spec.key}>
            <dt>{t(labels[spec.key])}</dt>
            <dd>{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

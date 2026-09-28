"use client";

import { useI18n } from "@/lib/i18n/context";
import { localizedFitlineDetails } from "@/lib/i18n/fitline";

export function FitLineOverview({ productId }: { productId: string }) {
  const { locale, t } = useI18n();
  const info = localizedFitlineDetails(productId, locale);
  if (!info) return null;
  return (
    <section className="fitline-overview" aria-label={t("fitline.what")}>
      <h3 className="fitline-eyebrow">{t("fitline.what")}</h3>
      <p className="fitline-purpose">{info.purpose}</p>
      <div className="fitline-facts" aria-label={t("fitline.keyFeatures")}>
        {info.facts.map((fact) => (
          <div key={fact.value}><strong>{fact.value}</strong><span>{fact.label}</span></div>
        ))}
      </div>
      {info.usage && (
        <p className="fitline-quick-usage">
          <strong>{t("fitline.intake")}</strong> {info.usage.portion} · {info.usage.water} {t("fitline.waterSuffix")} · {info.usage.frequency}
        </p>
      )}
    </section>
  );
}

export function FitLineInformation({ productId }: { productId: string }) {
  const { locale, t } = useI18n();
  const info = localizedFitlineDetails(productId, locale);
  if (!info) return null;
  return (
    <section className="fitline-information" aria-labelledby="fitline-information-title">
      <div className="information-heading">
        <span className="label">{info.reference}</span>
        <h3 id="fitline-information-title">{t("fitline.more")}</h3>
      </div>
      <section className="fitline-audience">
        <h4>{t("fitline.audience")}</h4><p>{info.audience}</p>
      </section>
      <section className="fitline-properties">
        <h4>{t("fitline.properties")}</h4>
        <ul>{info.properties.map((property) => <li key={property}>{property}</li>)}</ul>
      </section>
      {info.usage && (
        <section className="fitline-usage">
          <h4>{t("fitline.howTo")}</h4>
          <div className="usage-facts">
            <span><b>{t("fitline.portion")}</b>{info.usage.portion}</span>
            <span><b>{t("fitline.water")}</b>{info.usage.water}</span>
            <span><b>{t("fitline.frequency")}</b>{info.usage.frequency}</span>
          </div>
          <ol>{info.usage.instructions.map((item) => <li key={item}>{item}</li>)}</ol>
        </section>
      )}
      <section className="fitline-nutrition">
        <h4>{t("fitline.contains")}</h4>
        <ul className="fitline-components">{info.components.map((component) => <li key={component}>{component}</li>)}</ul>
        {info.nutrition && (
          <table>
            <caption>{info.nutrition.caption}</caption>
            <thead><tr><th scope="col">{t("fitline.component")}</th>{info.nutrition.columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead>
            <tbody>{info.nutrition.rows.map(([name, ...amounts]) => (
              <tr key={name}><th scope="row">{name}</th>{amounts.map((amount, index) => <td key={index}>{amount}</td>)}</tr>
            ))}</tbody>
          </table>
        )}
      </section>
      {info.ingredients && (
        <details className="information-item">
          <summary><span>{t("fitline.ingredients")}</span><span className="information-toggle" aria-hidden="true">+</span></summary>
          <div className="information-copy"><p>{info.ingredients}</p></div>
        </details>
      )}
      {info.features.length > 0 && (
        <section className="fitline-features">
          <h4>{t("fitline.features")}</h4>
          <ul>{info.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
        </section>
      )}
      <section className="fitline-warnings">
        <h4>{t("fitline.warnings")}</h4>
        <ul>{info.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>
      </section>
      <details className="information-item">
        <summary><span>{t("fitline.difference")}</span><span className="information-toggle" aria-hidden="true">+</span></summary>
        <div className="information-copy"><p>{info.difference}</p></div>
      </details>
      <div className="information-sources">
        <p>{t("fitline.sources")}</p>
        {info.sources.map((source) => (
          <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">
            {source.title}<span className="sr-only"> {t("fitline.newTab")}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

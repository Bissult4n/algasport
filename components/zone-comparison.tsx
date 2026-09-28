"use client";

import { zoneManufacturerSizes } from "@/lib/zone-comparison";
import { getProduct } from "@/lib/catalog";
import { priceText } from "@/lib/orders";
import { useI18n } from "@/lib/i18n/context";
import { comparisonRowsFor, localizedZoneModels } from "@/lib/i18n/zone";
import { Arrow, Dialog } from "./shop-ui";

export function ZoneComparison({
  onClose,
  onChoose,
  onHelp,
}: {
  onClose: () => void;
  onChoose: (id: string) => void;
  onHelp: () => void;
}) {
  const { locale, t } = useI18n();
  const zoneModels = localizedZoneModels(locale);
  const comparisonRows = comparisonRowsFor(locale);
  return (
    <Dialog title={t("compare.title")} onClose={onClose} wide>
      <div className="zone-comparison">
        <p className="comparison-intro">
          {t("compare.intro1")}
          <br />
          <span>
            {t("compare.intro2")}
          </span>
        </p>
        <div className="comparison-models">
          {zoneModels.map((model, index) => (
            <article className="comparison-model" key={model.id}>
              <p className="label">0{index + 1} / ZONE</p>
              <h3>{model.name}</h3>
              <strong>{model.label}</strong>
              <p>{model.summary}</p>
              <dl className="comparison-mobile-facts">
                {comparisonRows.map((row) => (
                  <div key={row.key}>
                    <dt>{row.label}</dt>
                    <dd>{model[row.key]}</dd>
                  </div>
                ))}
                <div>
                  <dt>IJF</dt>
                  <dd>{t("compare.ijf")}</dd>
                </div>
                <div>
                  <dt>{t("compare.fit")}</dt>
                  <dd>Regular (A) · Slim (Y) · Relax (B)</dd>
                </div>
                <div>
                  <dt>{t("compare.price")}</dt>
                  <dd>{priceText(getProduct(model.id)!.price, locale)}</dd>
                </div>
              </dl>
              <button
                className="text-link"
                type="button"
                onClick={() => onChoose(model.id)}
              >
                {t("compare.open", { name: model.name })} <Arrow />
              </button>
            </article>
          ))}
        </div>
        <table className="comparison-table">
          <caption className="sr-only">
            {t("compare.caption")}
          </caption>
          <thead>
            <tr>
              <th scope="col">{t("compare.characteristic")}</th>
              {zoneModels.map((model) => (
                <th key={model.id} scope="col">
                  {model.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.key}>
                <th scope="row">{row.label}</th>
                {zoneModels.map((model) => (
                  <td key={model.id}>{model[row.key]}</td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row">IJF</th>
              {zoneModels.map((model) => (
                <td key={model.id}>
                  {t("compare.ijfTable")}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">{t("compare.fit")}</th>
              {zoneModels.map((model) => (
                <td key={model.id}>
                  Regular (A)
                  <br />
                  Slim (Y)
                  <br />
                  Relax (B)
                </td>
              ))}
            </tr>
            <tr className="comparison-price">
              <th scope="row">{t("compare.price")}</th>
              {zoneModels.map((model) => (
                <td key={model.id}>{priceText(getProduct(model.id)!.price, locale)}</td>
              ))}
            </tr>
          </tbody>
        </table>
        <details className="comparison-sizing">
          <summary>{t("compare.sizingTitle")}</summary>
          <p>{t("compare.sizing1")}</p>
          <p>{t("compare.sizing2", { sizes: zoneManufacturerSizes })}</p>
          <p>{t("compare.sizing3")}</p>
        </details>
        <section className="comparison-advice">
          <h3>{t("compare.adviceTitle")}</h3>
          <ul>
            {zoneModels.map((model) => (
              <li key={model.id}>{model.advice}</li>
            ))}
          </ul>
          <p>
            {t("compare.helpCopy")}
          </p>
          <button className="btn-secondary" type="button" onClick={onHelp}>
            {t("compare.help")} <Arrow />
          </button>
        </section>
        <div className="comparison-sources">
          <span>{t("compare.sources")}</span>
          {zoneModels.map((model) => (
            <a
              key={model.id}
              href={model.source}
              target="_blank"
              rel="noopener noreferrer"
            >
              Zone {model.name} ↗
            </a>
          ))}
        </div>
      </div>
    </Dialog>
  );
}

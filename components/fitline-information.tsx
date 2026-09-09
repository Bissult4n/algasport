import {
  fitlineDetails,
  fitlineRegionNotice,
  fitlineSectionTitles,
} from "@/lib/fitline-details";

export function FitLineInformation({ productId }: { productId: string }) {
  const information = fitlineDetails[productId];
  if (!information) return null;

  return (
    <section className="fitline-information" aria-labelledby="fitline-information-title">
      <div className="information-heading">
        <span className="label">FITLINE / ИНФОРМАЦИЯ О ПРОДУКТЕ</span>
        <h3 id="fitline-information-title">Подробнее</h3>
      </div>
      <div className="information-notice">
        <strong>Регион поставки уточняется</strong>
        <p>{fitlineRegionNotice}</p>
      </div>
      <p className="information-reference">Справочная версия: {information.reference}</p>
      {(Object.keys(fitlineSectionTitles) as (keyof typeof fitlineSectionTitles)[]).map((key) => {
        const section = information.sections[key];
        return (
          <details key={key} className="information-item" open={key === "about"}>
            <summary>
              <span>{fitlineSectionTitles[key]}</span>
              <span className="information-toggle" aria-hidden="true">+</span>
            </summary>
            <div className="information-copy">
              {section.needsConfirmation && <span className="information-status">Требует подтверждения</span>}
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </details>
        );
      })}
      <div className="information-sources">
        <p>Официальные источники · проверено 09.09.2026</p>
        {information.sources.map((source) => (
          <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">
            {source.title}<span className="sr-only"> (откроется в новой вкладке)</span>
          </a>
        ))}
      </div>
    </section>
  );
}

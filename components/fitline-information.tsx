import { fitlineDetails } from "@/lib/fitline-details";

export function FitLineOverview({ productId }: { productId: string }) {
  const info = fitlineDetails[productId];
  if (!info) return null;
  return (
    <section className="fitline-overview" aria-label="Что это">
      <h3 className="fitline-eyebrow">Что это</h3>
      <p className="fitline-purpose">{info.purpose}</p>
      <div className="fitline-facts" aria-label="Ключевые особенности">
        {info.facts.map((fact) => (
          <div key={fact.value}><strong>{fact.value}</strong><span>{fact.label}</span></div>
        ))}
      </div>
      {info.usage && (
        <p className="fitline-quick-usage">
          <strong>Приём</strong> {info.usage.portion} · {info.usage.water} воды · {info.usage.frequency}
        </p>
      )}
    </section>
  );
}

export function FitLineInformation({ productId }: { productId: string }) {
  const info = fitlineDetails[productId];
  if (!info) return null;
  return (
    <section className="fitline-information" aria-labelledby="fitline-information-title">
      <div className="information-heading">
        <span className="label">{info.reference}</span>
        <h3 id="fitline-information-title">Подробнее о продукте</h3>
      </div>
      <section className="fitline-audience">
        <h4>Для кого подходит</h4><p>{info.audience}</p>
      </section>
      <section className="fitline-properties">
        <h4>Основные свойства</h4>
        <ul>{info.properties.map((property) => <li key={property}>{property}</li>)}</ul>
      </section>
      {info.usage && (
        <section className="fitline-usage">
          <h4>Как принимать</h4>
          <div className="usage-facts">
            <span><b>Порция</b>{info.usage.portion}</span>
            <span><b>Вода</b>{info.usage.water}</span>
            <span><b>Частота</b>{info.usage.frequency}</span>
          </div>
          <ol>{info.usage.instructions.map((item) => <li key={item}>{item}</li>)}</ol>
        </section>
      )}
      <section className="fitline-nutrition">
        <h4>Что содержит</h4>
        <ul className="fitline-components">{info.components.map((component) => <li key={component}>{component}</li>)}</ul>
        {info.nutrition && (
          <table>
            <caption>{info.nutrition.caption}</caption>
            <thead><tr><th scope="col">Компонент</th>{info.nutrition.columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead>
            <tbody>{info.nutrition.rows.map(([name, ...amounts]) => (
              <tr key={name}><th scope="row">{name}</th>{amounts.map((amount, index) => <td key={index}>{amount}</td>)}</tr>
            ))}</tbody>
          </table>
        )}
      </section>
      {info.ingredients && (
        <details className="information-item">
          <summary><span>Полный состав</span><span className="information-toggle" aria-hidden="true">+</span></summary>
          <div className="information-copy"><p>{info.ingredients}</p></div>
        </details>
      )}
      {info.features.length > 0 && (
        <section className="fitline-features">
          <h4>Дополнительные особенности</h4>
          <ul>{info.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
        </section>
      )}
      <section className="fitline-warnings">
        <h4>Важная информация</h4>
        <ul>{info.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>
      </section>
      <details className="information-item">
        <summary><span>Чем отличается от других FitLine</span><span className="information-toggle" aria-hidden="true">+</span></summary>
        <div className="information-copy"><p>{info.difference}</p></div>
      </details>
      <div className="information-sources">
        <p>Информация FitLine Kazakhstan</p>
        {info.sources.map((source) => (
          <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">
            {source.title}<span className="sr-only"> (откроется в новой вкладке)</span>
          </a>
        ))}
      </div>
    </section>
  );
}

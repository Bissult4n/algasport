"use client";

import {
  comparisonRows,
  zoneManufacturerSizes,
  zoneModels,
} from "@/lib/zone-comparison";
import { getProduct } from "@/lib/catalog";
import { priceText } from "@/lib/orders";
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
  return (
    <Dialog title="Сравнить модели Zone" onClose={onClose} wide>
      <div className="zone-comparison">
        <p className="comparison-intro">
          Одна школа дзюдо. Три подхода к экипировке.
          <br />
          <span>
            Сравниваем IJF-версии из официального каталога Mitsuboshi Global.
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
                  <dd>
                    Одобрена по данным производителя для сравниваемой версии
                  </dd>
                </div>
                <div>
                  <dt>Посадка</dt>
                  <dd>Regular (A) · Slim (Y) · Relax (B)</dd>
                </div>
                <div>
                  <dt>Цена ALGA</dt>
                  <dd>{priceText(getProduct(model.id)!.price)}</dd>
                </div>
              </dl>
              <button
                className="text-link"
                type="button"
                onClick={() => onChoose(model.id)}
              >
                Открыть {model.name} <Arrow />
              </button>
            </article>
          ))}
        </div>
        <table className="comparison-table">
          <caption className="sr-only">
            Характеристики Migaku, Idomu и Kiwami
          </caption>
          <thead>
            <tr>
              <th scope="col">Характеристика</th>
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
                  IJF Approved по данным производителя для этой версии
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">Посадка</th>
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
              <th scope="row">Цена ALGA</th>
              {zoneModels.map((model) => (
                <td key={model.id}>{priceText(getProduct(model.id)!.price)}</td>
              ))}
            </tr>
          </tbody>
        </table>
        <details className="comparison-sizing">
          <summary>Посадка, размеры и версия комплекта</summary>
          <p>
            Для всех трёх моделей в каталоге производителя есть обычная посадка
            Regular (A), узкая Slim (Y) и свободная Relax (B).
          </p>
          <p>Обозначения размеров производителя: {zoneManufacturerSizes}.</p>
          <p>
            Это варианты производителя, не остатки ALGA. Размер, посадку,
            комплектацию брюк и маркировку конкретного изделия проверим перед
            заказом. Обозначения не заменяют подбор по росту и весу.
          </p>
        </details>
        <section className="comparison-advice">
          <h3>Какую выбрать?</h3>
          <ul>
            {zoneModels.map((model) => (
              <li key={model.id}>{model.advice}</li>
            ))}
          </ul>
          <p>
            Не уверены? Напишите нам рост, вес и задачи — поможем подобрать
            модель и размер.
          </p>
          <button className="btn-secondary" type="button" onClick={onHelp}>
            Помогите с выбором <Arrow />
          </button>
        </section>
        <div className="comparison-sources">
          <span>Официальные источники:</span>
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

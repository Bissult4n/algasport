"use client";

import { useId } from "react";
import localFont from "next/font/local";
import { asset } from "@/lib/shop-config";
import {
  embroideryColors,
  placementText,
  type Embroidery,
} from "@/lib/customization";

const japanese = localFont({
  src: "../assets/fonts/noto-sans-jp-600.woff2",
  weight: "600",
  display: "swap",
  preload: false,
});

// Coordinates follow the photographed fabric, not the size of the reference's red marks.
const scenes = {
  Куртка: {
    file: "jacket.webp",
    background: "#c1d0e3",
    photo: "Zone Kiwami, вид спереди",
    x: 181,
    y: 197,
    angle: 3,
    skew: -5,
    size: 9,
    length: 20,
    width: 34,
  },
  Штаны: {
    file: "pants.webp",
    background: "#ffffff",
    photo: "Adidas JT275, вид спереди",
    x: 165,
    y: 99,
    angle: -3,
    skew: 2,
    size: 11,
    length: 40,
    width: 32,
  },
  Пояс: {
    file: "belt.webp",
    background: "#f3f3f3",
    photo: "Outshock, чёрный пояс",
    x: 117,
    y: 286,
    angle: -30,
    skew: -6,
    size: 14,
    length: 38,
    width: 32,
  },
} satisfies Record<
  Embroidery["placement"],
  {
    file: string;
    background: string;
    photo: string;
    x: number;
    y: number;
    angle: number;
    skew: number;
    size: number;
    length: number;
    width: number;
  }
>;

export function EmbroideryPreview({ value }: { value: Embroidery }) {
  const uid = useId().replaceAll(":", "");
  const id = (name: string) => uid + name;
  const scene = scenes[value.placement];
  const text = value.text || "柔道";
  // Keep combining marks with their base character (including Kazakh and Japanese).
  const chars =
    typeof Intl.Segmenter === "function"
      ? Array.from(
          new Intl.Segmenter("und", { granularity: "grapheme" }).segment(text),
          (part) => part.segment,
        )
      : Array.from(text.normalize("NFC"));
  const vertical = value.orientation === "vertical";
  const step = Math.min(scene.size * 1.25, scene.length / chars.length);
  const size = vertical
    ? Math.min(scene.size, step / 1.15)
    : Math.min(scene.size, scene.width / Math.max(1, chars.length));
  const family =
    (value.font === "Modern" ? "Arial" : "Georgia") +
    "," +
    japanese.style.fontFamily +
    ',"Yu Gothic","Hiragino Kaku Gothic ProN","Noto Sans CJK JP",sans-serif';
  return (
    <figure className="patch-preview embroidery-preview">
      <div className="preview-label">
        <span className="live-dot" /> LIVE PREVIEW <span>ИМЕННАЯ ВЫШИВКА</span>
      </div>
      <svg
        key={value.placement}
        className="embroidery-scene"
        style={{ background: scene.background }}
        viewBox="0 0 400 400"
        role="img"
        aria-label={"Макет вышивки: " + text + ". " + placementText(value)}
      >
        <defs>
          <filter
            id={id("thread-relief")}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence type="fractalNoise" baseFrequency=".065 .17" numOctaves="1" seed="4" result="fabric" />
            <feDisplacementMap in="SourceGraphic" in2="fabric" scale=".32" xChannelSelector="R" yChannelSelector="G" />
            <feDropShadow
              dx=".12"
              dy=".25"
              stdDeviation=".1"
              floodColor="#14110d"
              floodOpacity=".22"
            />
          </filter>
          <pattern
            id={id("thread")}
            width=".9"
            height=".9"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-30)"
          >
            <path
              d="M0 .2H.9"
              stroke="#fff"
              strokeWidth=".18"
              strokeOpacity=".24"
            />
            <path
              d="M0 .7H.9"
              stroke="#16120f"
              strokeWidth=".13"
              strokeOpacity=".14"
            />
          </pattern>
          <linearGradient id={id("thread-light")} x1="0" y1="0" x2=".8" y2="1">
            <stop stopColor="#fff9e8" stopOpacity=".2" />
            <stop offset=".45" stopColor="#fff9e8" stopOpacity="0" />
            <stop offset="1" stopColor="#16120f" stopOpacity=".16" />
          </linearGradient>
          <g
            id={id("letters")}
            fontFamily={family}
            fontSize={size}
            fontWeight="600"
            fontStyle={value.font === "Brush" ? "italic" : "normal"}
            textAnchor="middle"
          >
            {vertical ? (
              chars.map((char, i) => (
                <text key={i} x="0" y={i * step}>
                  {char}
                </text>
              ))
            ) : (
              <text x="0" y="0">
                {text}
              </text>
            )}
          </g>
        </defs>
        <image
          data-embroidery-photo={value.placement}
          href={asset("/images/personalization/" + scene.file)}
          width="400"
          height="400"
          preserveAspectRatio="xMidYMid meet"
        />
        <g
          data-embroidery-zone={value.placement}
          data-orientation={value.orientation}
          transform={`translate(${scene.x} ${scene.y}) rotate(${scene.angle}) skewX(${scene.skew}) scale(1 .97)`}
          filter={"url(#" + id("thread-relief") + ")"}
        >
          <use
            href={"#" + id("letters")}
            fill={embroideryColors[value.color]}
          />
          <use href={"#" + id("letters")} fill={"url(#" + id("thread") + ")"} />
          <use href={"#" + id("letters")} fill={"url(#" + id("thread-light") + ")"} />
        </g>
      </svg>
      <div className="preview-placement">{placementText(value)}</div>
      <figcaption>
        <strong>Пример расположения вышивки</strong>
        <br />
        {scene.photo}. Размер надписи и место согласуем для вашего изделия.
      </figcaption>
    </figure>
  );
}

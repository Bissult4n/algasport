"use client";
import { useId } from "react";
import { asset } from "@/lib/shop-config";

// SVG clipping follows the existing photograph's silhouette; no generated product pixels.
export const frontOutline =
  "M158 8L166 19Q195 21 218 49Q238 77 258 114Q266 134 264 163L263 221Q245 233 211 227L210 174Q209 145 215 130L202 125L190 104L190 151L196 176L194 194L202 235L214 270L205 269L210 304L220 362L226 416L235 489Q207 500 172 486L163 426L152 364L138 329L130 313L124 349L121 402L122 474Q96 483 70 475L73 401L69 380L74 311L72 279L68 275L72 260L76 231L62 237L61 225L76 190L71 171L65 200L54 231Q28 232 13 221L26 175L37 115Q49 76 66 48Q78 37 102 30L107 20Q123 11 158 8Z";
export const backOutline =
  "M121 25L182 25L189 32Q210 38 222 55L232 81L237 127L243 164L252 222L241 241L213 248L208 209L207 237L211 259L204 271L208 321L218 386L218 489L187 497L175 490L156 380L141 325L125 374L118 485L95 491L73 486L74 391L75 321L78 272L74 263L83 223L84 188L75 197L62 241L46 244L17 231L35 172L50 116L65 76L78 57L101 41L120 34Z";
export function KimonoPhoto({ back = false }: { back?: boolean }) {
  const id = useId().replaceAll(":", "") + "cutout";
  return (
    <svg
      className="kimono-cutout"
      viewBox={back ? "0 0 260 500" : "0 0 281 500"}
      role="img"
      aria-label={
        "Реальное фото Adidas Champion II, " +
        (back ? "вид сзади" : "вид спереди")
      }
    >
      <defs>
        <clipPath id={id}>
          <path d={back ? backOutline : frontOutline} />
        </clipPath>
      </defs>
      <image
        href={asset(
          back
            ? "/images/kimono/adidas-ii-back.webp"
            : "/images/kimono/adidas-ii-0.webp",
        )}
        width={back ? 260 : 281}
        height="500"
        clipPath={"url(#" + id + ")"}
      />
    </svg>
  );
}

// Design illustration uses the same preset as the renderer; it is never a video result.
export function stylePreview(style, language='en') {
  const p=style.palette;
  const grid=style.decoration==='grid'
    ? `<pattern id="g" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="${p.grid}" stroke-width="1"/></pattern>`
    : `<pattern id="g" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="${p.grid}" opacity=".6"/></pattern>`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
    <defs>${grid}</defs><rect width="960" height="540" fill="${p.background}"/><rect width="960" height="540" fill="url(#g)"/>
    <g font-family="Segoe UI,Microsoft YaHei,sans-serif"><text x="56" y="58" fill="${p.muted}" font-size="12" letter-spacing="3">THE BEAUTY OF MATHEMATICS</text>
    <text x="56" y="111" fill="${p.foreground}" font-size="30" font-weight="bold">${language==='zh-CN'?'数学，可以看得见。':'Mathematics, made visible.'}</text>
    <text x="56" y="141" fill="${p.muted}" font-size="13">${language==='zh-CN'?'从一个直角三角形，理解勾股定理':'A geometric journey through the Pythagorean theorem'}</text></g>
    <g transform="translate(415 350)" stroke-width="${style.stroke_max}"><path d="M0 0V-150H-150V0Z" fill="${p.primary}" fill-opacity=".1" stroke="${p.primary}"/>
    <path d="M0 0H200V200H0Z" fill="${p.secondary}" fill-opacity=".1" stroke="${p.secondary}"/>
    <path d="M0-150 200 0 350-200 150-350Z" fill="${p.primary}" fill-opacity=".1" stroke="${p.primary}"/>
    <path d="M0-150V0H200Z" fill="${p.secondary}" fill-opacity=".12" stroke="${p.primary}"/>
    <path d="M0-19H19V0" fill="none" stroke="${p.primary}"/>
    <g font-family="Georgia,serif" font-size="25" font-style="italic" fill="${p.foreground}" stroke="none"><text x="-25" y="-70">a</text><text x="91" y="32">b</text><text x="105" y="-92">c</text></g></g>
    <rect x="55" y="227" width="267" height="83" rx="9" fill="${p.grid}" fill-opacity=".3"/>
    <text x="79" y="281" fill="${p.primary}" font-family="Georgia,serif" font-size="32" font-style="italic">a² + b² = c²</text>
    <text x="56" y="472" fill="${p.muted}" font-family="Segoe UI,sans-serif" font-size="11" letter-spacing="2">CODE → EXPLAIN → CREATE</text>
    <text x="903" y="484" text-anchor="end" fill="${p.foreground}" font-family="Segoe UI,sans-serif" font-size="18" font-weight="bold">Genesis</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Original concept artwork for the storyboard UI, never a model-generated frame or video result.
export function storyIllustration(scene='coast', {wireframe=false}={}) {
  const selected=['coast','journey','lighthouse'].includes(scene)?scene:'coast';
  const traveler=(x,y,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})"><ellipse cx="0" cy="48" rx="18" ry="5" fill="#213d39" opacity=".16"/><path d="M-5 12-11 45M5 12l8 33" fill="none" stroke="#263c38" stroke-width="5" stroke-linecap="round"/><path d="M-11-18Q0-27 11-18L16 17Q0 24-15 16Z" fill="#b57255"/><path d="M-10-15-17 5M10-15 17-1" fill="none" stroke="#9c5e46" stroke-width="5" stroke-linecap="round"/><path d="M-7-26q0-13 9-13 10 2 9 13l-4 6H-3Z" fill="#2e3d37"/><path d="M-6-23q3 5 10 2v7l-9 1Z" fill="#d7ad88"/><path d="m9-11 8 16 7-2" fill="none" stroke="#d0b38b" stroke-width="2"/><rect x="14" y="3" width="12" height="15" rx="3" fill="#c8aa7d"/><path d="M-9-17 6 13" stroke="#d5b68c" stroke-width="2" fill="none"/></g>`;
  const tower=(x,y,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})"><ellipse cx="0" cy="119" rx="40" ry="8" fill="#263e3a" opacity=".16"/><path d="M-22 113-15 10H15l10 103Z" fill="#eee1c6"/><path d="m5 10 5 103h15L15 10Z" fill="#baa98c"/><path d="M-19 57h39l1 12h-42Z" fill="#aa6c52"/><path d="M-17 9v-18h34V9Z" fill="#3d5650"/><path d="M-13-6h26V6h-26Z" fill="#f2d8a1"/><path d="m-24-10 24-17 24 17Z" fill="#4b5a50"/><path d="M-24 9h48M-22 13h44" stroke="#47574e" stroke-width="2"/><path d="M-5 113V96q5-8 11 0v17" fill="#576a5c"/><path d="M0-27v-10" stroke="#47574e" stroke-width="2"/><path d="M-4 37V26h7v11" fill="#7d8e7a"/></g>`;
  const defs=`<defs>
    <linearGradient id="sky" x2="0" y2="1"><stop stop-color="#c6d1c6"/><stop offset="1" stop-color="#f2d6b5"/></linearGradient>
    <linearGradient id="water" x2="0" y2="1"><stop stop-color="#9bb6ad"/><stop offset="1" stop-color="#3e726f"/></linearGradient>
    <linearGradient id="dusk" x2="0" y2="1"><stop stop-color="#526c72"/><stop offset="1" stop-color="#e5bd9f"/></linearGradient>
    <linearGradient id="window" x2="1" y2="1"><stop stop-color="#f8e8c8" stop-opacity=".2"/><stop offset=".6" stop-color="#faf1d9" stop-opacity="0"/><stop offset="1" stop-color="#e2d9bb" stop-opacity=".1"/></linearGradient>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
    <clipPath id="window-clip"><rect x="143" y="39" width="721" height="397" rx="39"/></clipPath>
    <pattern id="technical-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" stroke="#b8c9c2" stroke-width=".7" fill="none"/></pattern>
  </defs>`;
  const waterLines=`<g fill="none" stroke="#d5dfc5" stroke-linecap="round"><path d="M341 338h73m45 15h119m87-24h159m-256 60h155m-419-17h71m102 58h119m90-28h82m-342 58h113" stroke-width="2" opacity=".45"/><path d="M478 318h49m152-8h81m-211 68h53m117-15h104m-292 57h68m136 32h74" opacity=".35"/></g>`;
  let artwork;
  if(wireframe) {
    const geometry=selected==='journey'
      ? `<rect x="143" y="39" width="721" height="397" rx="39"/><rect x="127" y="23" width="753" height="429" rx="53"/><path d="M43 540V379q42-54 121-32l123 56v137M0 455h127M143 285h721M143 350h721M800 39v397"/><path d="m143 367 223-79 119 24 147-62 232 30M143 397l218-64 141 32 131-69 231 21"/>`
      : `<path d="M0 286H960M0 335h960M0 395h960M0 485h960M480 286 0 540M480 286 190 540M480 286 770 540M480 286 960 540" stroke="#bacbc3"/><path d="M0 337 123 305l180 55 103 89 75 91H0M960 300l-149-54-143 50-85 21-71 56 142 28 306-53M0 383l131-30 141 49 65 62 88 76M99 540l80-79 31-74 58-25"/><path d="M722 246 716 164h27l7 82ZM710 163v-18h40v18ZM704 145l25-15 25 15ZM705 163h49M722 202h24"/><ellipse cx="215" cy="420" rx="10" ry="14"/><path d="m204 434-8 54 39 0-10-54ZM208 489l-5 29m20-29 6 29M195 449l-12 26m50-26 12 19"/>`;
    artwork=`<rect width="960" height="540" fill="#e8eeea"/><rect width="960" height="540" fill="url(#technical-grid)"/><g fill="none" stroke="#55776d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${geometry}<path d="M35 70V35h35M890 35h35v35M925 470v35h-35M70 505H35v-35M460 270h40m-20-20v40" stroke="#6d8b7c"/><path d="M100 105h245M100 94v22m245-22v22M853 111v121m-11-121h22m-22 121h22" stroke-dasharray="5 5" opacity=".6"/></g>`;
  } else if(selected==='journey') {
    artwork=`<rect width="960" height="540" fill="#2d403b"/><path d="M0 0h960v22H0ZM0 472h960v68H0Z" fill="#263832"/>
      <g clip-path="url(#window-clip)"><rect x="143" y="39" width="721" height="397" fill="url(#sky)"/><circle cx="658" cy="153" r="49" fill="#f5dfb9"/>
      <path d="M143 262q153-33 274-9t222-12 225-12v207H143Z" fill="#96afa3"/><path d="M143 286q209-17 369 5t352-24v169H143Z" fill="url(#water)"/>
      <path d="m864 241-91-28-75 35-70 37 68 24 168-32Z" fill="#6c8b7b"/>${tower(748,178,.38)}${waterLines}
      <path d="m143 374 161-52 108 18 69 44 138 52H143Z" fill="#8b9273"/><path d="m143 392 171-46 91 21 81 69H143Z" fill="#b6a88b"/>
      <path d="M152 73 370 39H560L181 436H143V292ZM770 39h58L574 436H479Z" fill="url(#window)"/><path d="M175 60v351M830 65v345" stroke="#fff5d3" opacity=".14" stroke-width="3"/></g>
      <rect x="134" y="30" width="739" height="415" rx="46" fill="none" stroke="#a69779" stroke-width="9"/><rect x="143" y="39" width="721" height="397" rx="39" fill="none" stroke="#172e2a" stroke-width="5"/>
      <path d="M0 475h960M891 46v399M889 46h26" stroke="#56665a" stroke-width="3"/><rect x="446" y="454" width="129" height="8" rx="4" fill="#b4a88c"/>
      <path d="M0 540V347q40-39 92-18l113 100 99 111Z" fill="#1e3430"/><path d="M0 414q63-12 103 29l95 97H0Z" fill="#40554b"/>
      ${traveler(142,309,2.2)}<path d="M277 480q109-26 147 60H251Z" fill="#283d34"/><rect width="960" height="540" filter="url(#grain)" opacity=".055"/>`;
  } else if(selected==='lighthouse') {
    artwork=`<rect width="960" height="540" fill="url(#dusk)"/><circle cx="784" cy="92" r="28" fill="#f4ddbb" opacity=".8"/>
      <path d="M0 286q137-24 240 5t247-7 473 3v253H0Z" fill="#819d98"/><path d="M0 318q238-24 459 4t501-22v240H0Z" fill="#4d7875"/>${waterLines}
      <path d="M960 322 774 276l-105 28-82 55-214 181h587Z" fill="#3d6259"/><path d="m960 360-189-58-95 24-102 73-178 141h564Z" fill="#657c66"/>
      <path d="m960 419-186-60-105 14-125 89-95 78h511Z" fill="#899077"/><path d="M194 540q183-45 289-98t198-59l40-57-32-1-53 36q-123 16-231 71T120 540Z" fill="#c0af8b"/>
      <path d="m960 489-148-72-84 4-61 52 79 67h214Z" fill="#304e45"/><path d="m0 460 109-28 111 31 52 77H0Z" fill="#3d5b4c"/>
      <path d="m674 158-286-59v133Z" fill="#f4d99f" opacity=".16"/><path d="m685 158 275-73v149Z" fill="#f4d99f" opacity=".18"/>
      ${tower(679,179,1.26)}<path d="M638 333q40-10 88 2l-7 11h-85Z" fill="#b6ad8c"/>${traveler(359,409,1.35)}
      <g stroke="#364e40" stroke-width="2" fill="none"><path d="m113 513-7-28m7 18 9-12m-4 39 9-29M863 421l5-24m-6 36-10-20m-6 17-8-11"/></g>
      <rect width="960" height="540" filter="url(#grain)" opacity=".065"/>`;
  } else {
    artwork=`<rect width="960" height="540" fill="url(#sky)"/><circle cx="351" cy="161" r="53" fill="#f9e6c2" opacity=".9"/>
      <path d="M0 262q160-26 304-8t332-12 324-18v316H0Z" fill="#a3b9ab"/><path d="M0 287q216-23 434 6t526-25v272H0Z" fill="url(#water)"/>
      <path d="m960 250-147-37-82 26-66 32-98 13-47 32 130 16 107-21 203-21Z" fill="#77917c"/><path d="m960 276-152-29-101 28-85 17-25 22 105-4 105-26 153 12Z" fill="#9aa88a"/>
      ${tower(738,207,.43)}${waterLines}
      <path d="M0 297 110 294l119 43 64 18 96 91 72 94H0Z" fill="#4c7060"/><path d="M0 332 89 321l116 41 78 23 78 79 53 76H0Z" fill="#788775"/>
      <path d="M0 400 113 370l94 38 110 132H0Z" fill="#a6a287"/><path d="M53 540q108-59 135-113t77-59l-24-14q-61 13-84 64T0 514v26Z" fill="#d0bd98"/>
      <path d="m0 451 84-8 40 46 15 51H0ZM305 448l65 23 77 69h-75Z" fill="#3e5e4d"/>
      ${traveler(207,383,.94)}<g fill="none" stroke="#4c6551" stroke-width="2"><path d="m65 439-8-29m11 29 8-21m218 46-5-21m8 22 10-19m-31-41-5-17"/></g>
      <g fill="none" stroke="#728b7b" stroke-width="2" opacity=".7"><path d="m467 157 9-4 8 4m17 14 7-3 6 3"/></g>
      <rect width="960" height="540" filter="url(#grain)" opacity=".055"/>`;
  }
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">${defs}${artwork}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

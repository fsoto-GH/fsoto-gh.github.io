import{r as n,j as e}from"./vendor-react-BWQKYwBR.js";import{l as Ce,k as be,o as Ne,q as Pe,j as Ue}from"./index-DOkEe-pN.js";import"./vendor-leaflet-D9lupU1w.js";import"./vendor-tz-1-Tm3DMS.js";const Te=1.60934,xe=15,ge=7;function ze(t,i){return i==="imperial"?Math.round(t*3.28084).toLocaleString()+" ft":Math.round(t).toLocaleString()+" m"}function We(t,i){return i==="imperial"?t/Te:t}function pe(t,i){return We(t,i).toLocaleString(void 0,{minimumFractionDigits:1,maximumFractionDigits:1})}function He(t){return t==="imperial"?"mi":"km"}function ie(t,i,p){if(p.sameHoursEveryDay)return p.allDays;const I=Ue(t,i);return p.perDay[I]}function ve(t){return t?t==="open"?"cs-eta--open":t==="near-open"||t==="near-close"?"cs-eta--near":"cs-eta--closed":"cs-eta--unknown"}function Le(t,i,p,I,E,F,_,B,D){let u=null;if(t.lat!=null&&t.lon!=null&&Number.isFinite(t.lat)&&Number.isFinite(t.lon)&&D.length>0){const y=Pe(D,t.lat,t.lon,E,F);y&&(u=y.cumDist)}if(u==null&&t.distance.trim()){const y=parseFloat(t.distance);if(Number.isFinite(y)){const C=y*(B==="imperial"?Te:1);u=_==="target_distance"?C:E+C}}let m=null;if(u!=null){const y=u-E,C=B==="imperial"?y/Te:y,H=Date.parse(i),a=Date.parse(p);if(Number.isFinite(H)&&Number.isFinite(a)&&a>=H&&I>0){const Z=Math.max(0,Math.min(I,C)),M=(a-H)/I;Number.isFinite(M)&&M>0&&(m=new Date(H+Z*M).toISOString())}}return{cumKm:u,etaIso:m}}function _e(t,i){if(!i.length)return null;const p=Pe(i,t.lat,t.lon,0,i[i.length-1].cumDist);return(p==null?void 0:p.cumDist)??null}function Ye(t,i){return t.cueTrackIndex!=null&&i[t.cueTrackIndex]!=null?i[t.cueTrackIndex].cumDist:_e(t,i)}function h(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ae(t,i){return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${h(t)} — Cue Sheet</title>
<style>
/* ============================================================
   CUE SHEET STYLES
   Feel free to customise this block to match your event branding.
   ============================================================ */

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 11pt;
  color: #111;
  background: #fff;
  padding: 16px 20px;
}

h1 { font-size: 16pt; margin-bottom: 4px; }
.meta { font-size: 9pt; color: #555; margin-bottom: 16px; }

/* ── Table mode ── */
table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }

th {
  background: #1a1a2e;
  color: #fff;
  padding: 6px 8px;
  text-align: left;
  font-size: 9pt;
  white-space: nowrap;
}

td {
  padding: 5px 8px;
  border-bottom: 1px solid #ddd;
  vertical-align: top;
  font-size: 10pt;
}

tr:nth-child(even) td { background: #f7f7f7; }
.marker    { font-weight: bold; white-space: nowrap; }
.eta       { white-space: nowrap; }
.stop-section { margin-top: 4px; font-size: 9pt; color: #333; }
.stop-label   { font-weight: bold; }
.sub-item     { margin-left: 8px; }
.cues-list, .poi-list { margin: 0; padding: 0 0 0 16px; font-size: 9pt; }
.cues-list li, .poi-list li { margin: 2px 0; }
.unit       { font-size: 8pt; color: #666; }
.notes-cell { font-size: 9pt; color: #555; font-style: italic; }

/* ── Table row color coding ── */
tr.tr--start   td { background: #f0fdf4 !important; }
tr.tr--end     td { background: #fff1f2 !important; }
tr.tr--transit td { background: #fffbeb !important; }

/* ── Elevation cell ── */
.elev-cell { white-space: nowrap; font-size: 9pt; }
.elev-gain { color: #16a34a; display: block; }
.elev-loss { color: #ef4444; display: block; }

/* ── Compact mode ── */
.cs-list { max-width: 680px; }

.cs-entry {
  padding: 5px 8px 5px 10px;
  margin-bottom: 2px;
  border-left: 3px solid #bbb;
  line-height: 1.5;
}

.cs-entry--intermediate { background: #eff6ff; border-left-color: #3b82f6; }
.cs-entry--split        { background: #f9fafb; border-left-color: #9ca3af; }
.cs-entry--transit      { background: #fffbeb; border-left-color: #f59e0b; }
.cs-entry--start        { background: #f0fdf4; border-left-color: #16a34a; }
.cs-entry--end          { background: #fff1f2; border-left-color: #e11d48; }

.cs-header   { font-weight: bold; font-size: 11pt; }
.cs-dist     { font-weight: normal; color: #555; }
.cs-name     { font-weight: normal; }
.cs-details  { padding-left: 20px; font-size: 10pt; color: #444; }
.cs-detail-line { margin-top: 1px; }
.cs-notes    { color: #888; font-style: italic; }

.cs-eta--open    { color: #16a34a; font-weight: 500; }
.cs-eta--near    { color: #b45309; font-weight: 500; }
.cs-eta--closed  { color: #dc2626; font-weight: 500; }
.cs-eta--unknown { color: #374151; }

/* ── Print ── */
@media print {
  body { padding: 0; font-size: 10pt; }
  th {
    background: #000 !important;
    color: #fff !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  tr:nth-child(even) td {
    background: #f0f0f0 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  tr.tr--start   td { background: #d1fae5 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  tr.tr--end     td { background: #ffe4e6 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  tr.tr--transit td { background: #fef3c7 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  table { page-break-inside: auto; }
  tr    { page-break-inside: avoid; }
  .cs-entry { page-break-inside: avoid; }
  .cs-entry--intermediate { background: #eff6ff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .cs-entry--split        { background: #f9fafb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .cs-entry--transit      { background: #fffbeb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .cs-entry--start        { background: #f0fdf4 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .cs-entry--end          { background: #fff1f2 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .no-print { display: none !important; }
}
</style>
</head>
<body>
<h1>${h(t)}</h1>
<div class="meta">Generated ${new Date().toLocaleDateString(void 0,{month:"long",day:"numeric",year:"numeric"})} &nbsp;|&nbsp; Distances in ${h(i)}</div>
`}function qe(t,i){var l,$,U,L,R,P;const{form:p,result:I,splitBoundariesKm:E,gpxTrack:F,gpxProfiles:_,rwgpsCoursePoints:B,rwgpsPois:D,courseTz:u}=i,m=He(t.unitSystem);let y=0;for(const o of E)for(const f of o)f&&f[1]>y&&(y=f[1]);let C=0;for(let o=0;o<p.segments.length;o++){const f=I.segment_details[o];if(f)for(let z=0;z<p.segments[o].splits.length;z++)f.split_details[z]&&((l=E[o])!=null&&l[z])&&C++}const H=t.includeElevation&&_!=null&&_.some(o=>o.some(f=>f!=null)),a=[t.mileMarkerDirection==="from-end"?`Mile Marker from End (${m})`:`Mile Marker (${m})`,"Split Name"];t.includeSplitDistance&&a.push(`Distance (${m})`),H&&a.push("Elevation"),t.includeEta&&a.push("ETA"),t.includeNotes&&a.push("Notes"),(t.includeIntermediateStop||t.includeRestStop)&&a.push("Stops"),t.includeCoursePoints&&a.push("Cues"),t.includePois&&a.push("Points of Interest");const Z=a.map(o=>`<th>${h(o)}</th>`).join(""),M=[];let J=0;for(let o=0;o<p.segments.length;o++){const f=p.segments[o],z=I.segment_details[o];if(!z)continue;const w=parseFloat((f.fixed_elapsed_time??"").trim())>0;for(let k=0;k<f.splits.length;k++){const S=f.splits[k],N=z.split_details[k],W=($=E[o])==null?void 0:$[k];if(!N||!W)continue;const[Y,T]=W,se=t.mileMarkerDirection==="from-end"?y-T:T,b=N.end_timezone??u,K=J===0?"tr--start":J===C-1?"tr--end":w?"tr--transit":"",ae=`<td class="marker">${pe(se,t.unitSystem)}</td>`,re=`<td>${h(((U=S.name)==null?void 0:U.trim())||`Split ${k+1}`)}</td>`;let q="";t.includeSplitDistance&&(q=`<td>${pe(T-Y,t.unitSystem)}</td>`);let ne="";if(H){const d=(L=_==null?void 0:_[o])==null?void 0:L[k];d?ne=`<td class="elev-cell"><span class="elev-gain">&#8593; ${h(ze(d.elevGainM,t.unitSystem))}</span><span class="elev-loss">&#8595; ${h(ze(d.elevLossM,t.unitSystem))}</span></td>`:ne="<td></td>"}let A="";if(t.includeEta){let d="";const j=S.rest_stop;if(t.includeRestStop&&j.enabled){const v=ie(N.end_time,b,j),x=be(N.end_time,v,b,xe,ge);x&&(d=` class="${ve(x)}"`)}const c=h(Ne(N.end_time,b));A=d?`<td class="eta"><span${d}>${c}</span></td>`:`<td class="eta">${c}</td>`}let ye="";t.includeNotes&&(ye=`<td class="notes-cell">${h(((R=S.notes)==null?void 0:R.trim())||"")}</td>`);let le="";if(t.includeIntermediateStop||t.includeRestStop){const d=[],j=S.intermediate_stop;if(t.includeIntermediateStop&&(j!=null&&j.enabled)){const{cumKm:v,etaIso:x}=Le(j,N.start_time,N.end_time,N.distance,Y,T,p.mode,t.unitSystem,F),V=v!=null?t.mileMarkerDirection==="from-end"?y-v:v:null;let O=`<span class="stop-label">${h(j.name||"Intermediate Stop")}</span>`;if(V!=null&&(O+=` <span class="unit">@ ${pe(V,t.unitSystem)} ${m}</span>`),t.intermediateIncludeHours){const me=x??N.end_time,de=ie(me,b,j);O+=`<br><span class="sub-item">Hours: ${h(Ce(de))}</span>`}if(t.intermediateIncludeEta&&x){const de=ie(x,b,j),fe=be(x,de,b,xe,ge),X=fe?` class="${ve(fe)}"`:"";O+=`<br><span class="sub-item"><span${X}>ETA: ${h(Ne(x,b))}</span></span>`}d.push(`<div class="stop-section">${O}</div>`)}const c=S.rest_stop;if(t.includeRestStop&&c.enabled){let v=`<span class="stop-label">${h(c.name||"Rest Stop")}</span>`;if(t.restStopIncludeHours){const x=ie(N.end_time,b,c);v+=`<br><span class="sub-item">Hours: ${h(Ce(x))}</span>`}if(t.restStopIncludeEta){const x=ie(N.end_time,b,c),V=be(N.end_time,x,b,xe,ge),O=V?` class="${ve(V)}"`:"";v+=`<br><span class="sub-item"><span${O}>ETA: ${h(Ne(N.end_time,b))}</span></span>`}d.push(`<div class="stop-section">${v}</div>`)}le=`<td>${d.join("")}</td>`}let ce="";if(t.includeCoursePoints){const d=B.filter(j=>{var v;const c=Ye(j,F);return c==null||c<Y||c>T?!1:t.selectedCueTypes.size===0?!0:t.selectedCueTypes.has(((v=j.description)==null?void 0:v.trim())||"")});d.length>0?ce=`<td><ul class="cues-list">${d.map(c=>`<li>${h(c.name)}${c.description?` <span class="unit">(${h(c.description)})</span>`:""}</li>`).join("")}</ul></td>`:ce="<td></td>"}let G="";if(t.includePois){const d=D.filter(j=>{const c=_e(j,F);return c==null||c<Y||c>T?!1:t.selectedPoiTypes.size===0?!0:t.selectedPoiTypes.has(j.poiType??"")});d.length>0?G=`<td><ul class="poi-list">${d.map(c=>{const v=_e(c,F),x=v!=null?` <span class="unit">@ ${pe(t.mileMarkerDirection==="from-end"?y-v:v,t.unitSystem)} ${m}</span>`:"";return`<li>${h(c.name)}${x}</li>`}).join("")}</ul></td>`:G="<td></td>"}const ue=[ae,re,q,ne,A,ye,le,ce,G].filter(d=>d!=="").join("");M.push(`<tr${K?` class="${K}"`:""}>${ue}</tr>`),J++}}const ee=((P=p.name)==null?void 0:P.trim())||"Course";return`${Ae(ee,m)}
<table>
  <thead><tr>${Z}</tr></thead>
  <tbody>
${M.join(`
`)}
  </tbody>
</table>
</body>
</html>`}function Ve(t,i){var Z,M,J,ee;const{form:p,result:I,splitBoundariesKm:E,gpxTrack:F,courseTz:_}=i,B=He(t.unitSystem);let D=0;for(const l of E)for(const $ of l)$&&$[1]>D&&(D=$[1]);const u=[];let m=0,y=0,C=0;for(let l=0;l<p.segments.length;l++){const $=p.segments[l],U=I.segment_details[l];if(!U)continue;const L=parseFloat(($.fixed_elapsed_time??"").trim())>0;for(let R=0;R<$.splits.length;R++){const P=$.splits[R],o=U.split_details[R],f=(Z=E[l])==null?void 0:Z[R];if(!o||!f)continue;const[z,w]=f,k=o.end_timezone??_,S=P.intermediate_stop;if(t.includeIntermediateStop&&(S!=null&&S.enabled)){const{cumKm:b,etaIso:K}=Le(S,o.start_time,o.end_time,o.distance,z,w,p.mode,t.unitSystem,F),ae=b!=null?t.mileMarkerDirection==="from-end"?D-b:b:t.mileMarkerDirection==="from-end"?D-w:w;let re=null,q=null;if(t.intermediateIncludeHours||K){const ne=K??o.end_time,A=ie(ne,k,S);t.intermediateIncludeHours&&(re=Ce(A)),K&&(q=be(K,A,k,xe,ge)??null)}m++,u.push({entryType:"intermediate",typeNum:m,displayMarkerKm:ae,splitDistKm:null,splitName:null,stopName:S.name||"Intermediate Stop",hoursLabel:re,etaIso:t.intermediateIncludeEta?K:null,etaTz:k,etaStatus:q,notes:null})}L?C++:y++;const N=t.mileMarkerDirection==="from-end"?D-w:w;let W=null,Y=null,T=null;const se=P.rest_stop;if(t.includeRestStop&&se.enabled){W=se.name||"Rest Stop";const b=ie(o.end_time,k,se);t.restStopIncludeHours&&(Y=Ce(b)),T=be(o.end_time,b,k,xe,ge)??null}u.push({entryType:L?"transit":"split",typeNum:L?C:y,displayMarkerKm:N,splitDistKm:t.includeSplitDistance?w-z:null,splitName:((M=P.name)==null?void 0:M.trim())||`Split ${R+1}`,stopName:W,hoursLabel:Y,etaIso:t.includeEta?o.end_time:null,etaTz:k,etaStatus:T,notes:t.includeNotes&&((J=P.notes)==null?void 0:J.trim())||null})}}const H=u.map((l,$)=>{const U=$===0,L=$===u.length-1,R=U?"cs-entry--start":L?"cs-entry--end":l.entryType==="intermediate"?"cs-entry--intermediate":l.entryType==="transit"?"cs-entry--transit":"cs-entry--split",P=l.entryType==="intermediate"?"I":l.entryType==="transit"?"T":"S",o=l.splitDistKm!=null?` <span class="cs-dist">[${pe(l.splitDistKm,t.unitSystem)}]</span>`:"",f=l.splitName?` <span class="cs-name">${h(l.splitName)}</span>`:"",z=`<div class="cs-header"><span class="cs-marker">${pe(l.displayMarkerKm,t.unitSystem)}</span>: <span class="cs-label">${P}${l.typeNum}</span>${o} ${f}</div>`,w=[];if(l.stopName){const S=l.hoursLabel?`: ${h(l.hoursLabel)}`:"";w.push(`<div class="cs-detail-line">${h(l.stopName)}${S}</div>`)}if(l.notes&&w.push(`<div class="cs-detail-line cs-notes">${h(l.notes)}</div>`),l.etaIso){const S=Ne(l.etaIso,l.etaTz),N=ve(l.etaStatus);w.push(`<div class="cs-detail-line"><span class="${N}">ETA: ${h(S)}</span></div>`)}const k=w.length>0?`<div class="cs-details">${w.join("")}</div>`:"";return`<div class="cs-entry ${R}">
${z}
${k}
</div>`}),a=((ee=p.name)==null?void 0:ee.trim())||"Course";return`${Ae(a,B)}<div class="cs-list">
${H.join(`
`)}
</div>
</body>
</html>`}function Fe(t,i){return t.compact?Ve(t,i):qe(t,i)}const Re=[{type:"aid_station",label:"Aid Station"},{type:"atm",label:"ATM"},{type:"bar",label:"Bar"},{type:"bikeshare",label:"Bike Share"},{type:"bike_parking",label:"Bike Parking"},{type:"bike_shop",label:"Bike Shop"},{type:"camping",label:"Camping"},{type:"caution",label:"Caution"},{type:"coffee",label:"Coffee"},{type:"control",label:"Control"},{type:"convenience_store",label:"Convenience Store"},{type:"ferry",label:"Ferry"},{type:"finish",label:"Finish"},{type:"first_aid",label:"First Aid"},{type:"food",label:"Food"},{type:"gas",label:"Gas Station"},{type:"geocache",label:"Geocache"},{type:"generic",label:"Generic"},{type:"hospital",label:"Hospital"},{type:"library",label:"Library"},{type:"lodging",label:"Lodging"},{type:"monument",label:"Monument"},{type:"park",label:"Park"},{type:"parking",label:"Parking"},{type:"rest_stop",label:"Rest Stop"},{type:"restroom",label:"Restroom"},{type:"segment_end",label:"Segment End"},{type:"segment_start",label:"Segment Start"},{type:"shopping",label:"Shopping"},{type:"shower",label:"Shower"},{type:"start",label:"Start"},{type:"stop",label:"Stop"},{type:"summit",label:"Summit"},{type:"swimming",label:"Swimming"},{type:"transit",label:"Transit Center"},{type:"trailhead",label:"Trailhead"},{type:"viewpoint",label:"Viewpoint"},{type:"water",label:"Water"},{type:"winery",label:"Winery"}];function tt({open:t,onClose:i,onExportJson:p,jsonExportDisabled:I,form:E,result:F,splitBoundariesKm:_,gpxTrack:B,gpxProfiles:D,rwgpsPois:u,rwgpsCoursePoints:m}){const y=n.useRef(null),[C,H]=n.useState("json"),[a,Z]=n.useState(!1),[M,J]=n.useState("from-start"),[ee,l]=n.useState(!0),[$,U]=n.useState(!0),[L,R]=n.useState(!1),[P,o]=n.useState(!1),[f,z]=n.useState(!0),[w,k]=n.useState(!1),[S,N]=n.useState(!0),[W,Y]=n.useState(!0),[T,se]=n.useState(!0),[b,K]=n.useState(!1),[ae,re]=n.useState(!0),[q,ne]=n.useState(!0),[A,ye]=n.useState(!1),[le,ce]=n.useState(!1),[G,ue]=n.useState(()=>new Set),[d,j]=n.useState(!1),[c,v]=n.useState(!1),[x,V]=n.useState(()=>new Set),O=n.useMemo(()=>{var g;const s=new Map;for(const r of m){const Q=((g=r.description)==null?void 0:g.trim())||"(no type)";s.set(Q,(s.get(Q)??0)+1)}return Array.from(s.entries()).map(([r,Q])=>({type:r,count:Q})).sort((r,Q)=>r.type.localeCompare(Q.type))},[m]),me=n.useMemo(()=>{const s=new Map;for(const g of u){const r=g.poiType??"";s.set(r,(s.get(r)??0)+1)}return s},[u]),de=n.useRef(m);n.useEffect(()=>{m!==de.current&&(de.current=m,ue(new Set(m.map(s=>{var g;return((g=s.description)==null?void 0:g.trim())||"(no type)"}))))},[m]);const fe=n.useRef(u);n.useEffect(()=>{u!==fe.current&&(fe.current=u,V(new Set(u.map(s=>s.poiType??""))))},[u]),n.useEffect(()=>{const s=y.current;s&&(t&&!s.open?s.showModal():!t&&s.open&&s.close())},[t]);const X=m.length>0,oe=u.length>0,Se=D!=null&&D.some(s=>s.some(g=>g!=null)),we=F!=null&&_!=null,$e=!a&&A&&X&&G.size===0,Ee=!a&&d&&oe&&x.size===0,te=$e||Ee,[he,Me]=n.useState(!1),Ke=n.useCallback(async()=>{if(!(I||he)){Me(!0);try{await p()}finally{Me(!1)}}},[I,he,p]),je=n.useCallback(()=>({mileMarkerDirection:M,includeSplitDistance:ee,includeEta:$,includeNotes:L,includeElevation:!a&&P,compact:a,includeIntermediateStop:f,intermediateIncludeHours:S,intermediateIncludeEta:W,includeRestStop:T,restStopIncludeHours:ae,restStopIncludeEta:q,includeCoursePoints:!a&&A,selectedCueTypes:G,includePois:!a&&d,selectedPoiTypes:x,unitSystem:E.unitSystem}),[M,ee,$,L,P,a,f,S,W,T,ae,q,A,G,d,x,E.unitSystem]),ke=n.useCallback(()=>!F||!_?null:{form:E,result:F,splitBoundariesKm:_,gpxTrack:B,gpxProfiles:D,rwgpsCoursePoints:m,rwgpsPois:u,courseTz:E.timezone},[E,F,_,B,D,m,u]),Oe=n.useCallback(()=>{const s=ke();if(!s||te)return;const g=Fe(je(),s),r=new Blob([g],{type:"text/html"}),Q=URL.createObjectURL(r),De=document.createElement("a");De.href=Q,De.download=`cuesheet-${new Date().toISOString().slice(0,10)}.html`,De.click(),URL.revokeObjectURL(Q)},[ke,je,te]),Ge=n.useCallback(()=>{const s=ke();if(!s||te)return;const g=Fe(je(),s),r=window.open("","_blank");r&&(r.document.open(),r.document.write(g),r.document.close())},[ke,je,te]),Be=s=>ue(g=>{const r=new Set(g);return r.has(s)?r.delete(s):r.add(s),r}),Je=s=>V(g=>{const r=new Set(g);return r.has(s)?r.delete(s):r.add(s),r}),Ie=Re.filter(({type:s})=>(me.get(s)??0)>0);return e.jsxs("dialog",{ref:y,className:"export-modal",onClose:i,children:[e.jsxs("div",{className:"export-modal-header",children:[e.jsxs("div",{className:"export-modal-tabs",children:[e.jsxs("button",{type:"button",className:`export-modal-tab${C==="json"?" export-modal-tab--active":""}`,onClick:()=>H("json"),children:[e.jsx("i",{className:"fa-solid fa-file-code"})," Course JSON"]}),e.jsxs("button",{type:"button",className:`export-modal-tab${C==="cuesheet"?" export-modal-tab--active":""}`,onClick:()=>H("cuesheet"),children:[e.jsx("i",{className:"fa-solid fa-list-ol"})," Cue Sheet"]})]}),e.jsx("button",{className:"legend-close",onClick:i,"aria-label":"Close",type:"button",children:"✕"})]}),e.jsxs("div",{className:"export-modal-body",children:[C==="json"&&e.jsxs("div",{className:"export-modal-section",children:[e.jsx("p",{className:"export-modal-hint",children:"Download the current course configuration as a JSON file. You can re-import it later to restore all segments, splits, and settings."}),e.jsx("button",{type:"button",className:`action-btn action-btn-export${he?" nav-btn-loading":""}`,onClick:Ke,disabled:I||he,title:I?"Fix validation errors before exporting":"Download course configuration as JSON",children:he?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"btn-spinner"})," Saving…"]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fa-solid fa-file-export"})," Download JSON"]})})]}),C==="cuesheet"&&e.jsx("div",{className:"export-modal-section",children:we?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"export-compact-row",children:[e.jsxs("label",{className:"export-compact-label",children:[e.jsx("input",{type:"checkbox",checked:a,onChange:s=>Z(s.target.checked)}),e.jsx("span",{children:"Compact mode"})]}),a&&e.jsx("span",{className:"export-compact-desc",children:"Color-coded list — one entry per stop/split. Cues and POIs are excluded."})]}),e.jsxs("div",{className:"export-option-row",children:[e.jsx("span",{className:"export-option-label",children:"Mile marker"}),e.jsxs("div",{className:"export-radio-group",children:[e.jsxs("label",{className:"export-radio-label",children:[e.jsx("input",{type:"radio",name:"mileMarkerDir",value:"from-start",checked:M==="from-start",onChange:()=>J("from-start")}),"From start"]}),e.jsxs("label",{className:"export-radio-label",children:[e.jsx("input",{type:"radio",name:"mileMarkerDir",value:"from-end",checked:M==="from-end",onChange:()=>J("from-end")}),"From end"]})]})]}),e.jsx("div",{className:"export-option-row",children:e.jsxs("label",{className:"export-toggle-label",children:[e.jsx("input",{type:"checkbox",checked:ee,onChange:s=>l(s.target.checked)}),"Split Distance"]})}),e.jsx("div",{className:"export-option-row",children:e.jsxs("label",{className:"export-toggle-label",children:[e.jsx("input",{type:"checkbox",checked:$,onChange:s=>U(s.target.checked)}),"ETA"]})}),e.jsx("div",{className:"export-option-row",children:e.jsxs("label",{className:"export-toggle-label",children:[e.jsx("input",{type:"checkbox",checked:L,onChange:s=>R(s.target.checked)}),"Split Notes"]})}),e.jsx("div",{className:"export-option-row",children:e.jsxs("label",{className:`export-toggle-label${a||!Se?" export-toggle-label--muted":""}`,children:[e.jsx("input",{type:"checkbox",checked:P,disabled:a||!Se,onChange:s=>o(s.target.checked)}),"Split Elevation",!Se&&e.jsx("span",{className:"export-no-data",children:"(no GPX loaded)"}),a&&Se&&e.jsx("span",{className:"export-no-data",children:"(table mode only)"})]})}),e.jsxs("div",{className:"export-accordion",children:[e.jsxs("div",{className:"export-accordion-header",children:[e.jsxs("label",{className:"export-toggle-label",children:[e.jsx("input",{type:"checkbox",checked:f,onChange:s=>{z(s.target.checked),s.target.checked&&k(!0)}}),"Intermediate Stop"]}),f&&e.jsx("button",{type:"button",className:"export-accordion-toggle",onClick:()=>k(s=>!s),"aria-label":w?"Collapse":"Expand",children:e.jsx("i",{className:`fas fa-chevron-${w?"up":"down"}`})})]}),f&&w&&e.jsxs("div",{className:"export-accordion-body",children:[e.jsx("p",{className:"export-accordion-note",children:"Mile marker and name are always included."}),e.jsxs("label",{className:"export-toggle-label",children:[e.jsx("input",{type:"checkbox",checked:S,onChange:s=>N(s.target.checked)}),"Hours for ETA day"]}),e.jsxs("label",{className:"export-toggle-label",children:[e.jsx("input",{type:"checkbox",checked:W,onChange:s=>Y(s.target.checked)}),"ETA"]})]})]}),e.jsxs("div",{className:"export-accordion",children:[e.jsxs("div",{className:"export-accordion-header",children:[e.jsxs("label",{className:"export-toggle-label",children:[e.jsx("input",{type:"checkbox",checked:T,onChange:s=>{se(s.target.checked),s.target.checked&&K(!0)}}),"Rest Stop Details"]}),T&&e.jsx("button",{type:"button",className:"export-accordion-toggle",onClick:()=>K(s=>!s),"aria-label":b?"Collapse":"Expand",children:e.jsx("i",{className:`fas fa-chevron-${b?"up":"down"}`})})]}),T&&b&&e.jsxs("div",{className:"export-accordion-body",children:[e.jsx("p",{className:"export-accordion-note",children:"Name is always included. Mile marker is omitted — rest stops are always at the split endpoint."}),e.jsxs("label",{className:"export-toggle-label",children:[e.jsx("input",{type:"checkbox",checked:ae,onChange:s=>re(s.target.checked)}),"Hours for ETA day"]}),e.jsxs("label",{className:"export-toggle-label",children:[e.jsx("input",{type:"checkbox",checked:q,onChange:s=>ne(s.target.checked)}),"ETA"]})]})]}),e.jsxs("div",{className:`export-accordion${!X||a?" export-accordion--disabled":""}`,children:[e.jsxs("div",{className:"export-accordion-header",children:[e.jsxs("label",{className:"export-toggle-label",children:[e.jsx("input",{type:"checkbox",checked:A,disabled:!X||a,onChange:s=>{ye(s.target.checked),s.target.checked&&ce(!0)}}),"Course Points (Cues)",!X&&e.jsx("span",{className:"export-no-data",children:"(no RwGPS route loaded)"}),a&&X&&e.jsx("span",{className:"export-no-data",children:"(disabled in compact mode)"})]}),X&&!a&&A&&e.jsx("button",{type:"button",className:"export-accordion-toggle",onClick:()=>ce(s=>!s),"aria-label":le?"Collapse":"Expand",children:e.jsx("i",{className:`fas fa-chevron-${le?"up":"down"}`})})]}),X&&!a&&A&&le&&e.jsxs("div",{className:"export-accordion-body",children:[e.jsx("div",{className:"export-grid-header",children:e.jsx("button",{type:"button",className:"export-select-all-btn",onClick:()=>ue(G.size===O.length?new Set:new Set(O.map(s=>s.type))),children:G.size===O.length?"Deselect all":"Select all"})}),e.jsx("div",{className:"export-checkbox-grid",children:O.map(({type:s,count:g})=>e.jsxs("label",{className:"export-toggle-label",children:[e.jsx("input",{type:"checkbox",checked:G.has(s),onChange:()=>Be(s)}),s,e.jsxs("span",{className:"export-count-badge",children:["(",g,")"]})]},s))}),$e&&e.jsxs("p",{className:"export-section-error",children:[e.jsx("i",{className:"fa-solid fa-triangle-exclamation"})," ","Select at least one cue type."]})]}),$e&&!le&&e.jsxs("p",{className:"export-section-error export-section-error--outside",children:[e.jsx("i",{className:"fa-solid fa-triangle-exclamation"})," Select at least one cue type."]})]}),e.jsxs("div",{className:`export-accordion${!oe||a?" export-accordion--disabled":""}`,children:[e.jsxs("div",{className:"export-accordion-header",children:[e.jsxs("label",{className:"export-toggle-label",children:[e.jsx("input",{type:"checkbox",checked:d,disabled:!oe||a,onChange:s=>{j(s.target.checked),s.target.checked&&v(!0)}}),"Points of Interest",!oe&&e.jsx("span",{className:"export-no-data",children:"(no RwGPS route loaded)"}),a&&oe&&e.jsx("span",{className:"export-no-data",children:"(disabled in compact mode)"})]}),oe&&!a&&d&&e.jsx("button",{type:"button",className:"export-accordion-toggle",onClick:()=>v(s=>!s),"aria-label":c?"Collapse":"Expand",children:e.jsx("i",{className:`fas fa-chevron-${c?"up":"down"}`})})]}),oe&&!a&&d&&c&&e.jsxs("div",{className:"export-accordion-body",children:[e.jsx("div",{className:"export-grid-header",children:e.jsx("button",{type:"button",className:"export-select-all-btn",onClick:()=>{V(x.size===Ie.length?new Set:new Set(Ie.map(s=>s.type)))},children:x.size===Ie.length?"Deselect all":"Select all"})}),e.jsx("div",{className:"export-checkbox-grid",children:Re.map(({type:s,label:g})=>{const r=me.get(s)??0;return e.jsxs("label",{className:`export-toggle-label${r===0?" export-toggle-label--muted":""}`,children:[e.jsx("input",{type:"checkbox",checked:x.has(s),disabled:r===0,onChange:()=>Je(s)}),g,r>0&&e.jsxs("span",{className:"export-count-badge",children:["(",r,")"]})]},s)})}),Ee&&e.jsxs("p",{className:"export-section-error",children:[e.jsx("i",{className:"fa-solid fa-triangle-exclamation"})," ","Select at least one POI type."]})]}),Ee&&!c&&e.jsxs("p",{className:"export-section-error export-section-error--outside",children:[e.jsx("i",{className:"fa-solid fa-triangle-exclamation"})," Select at least one POI type."]})]})]}):e.jsxs("p",{className:"export-modal-hint export-modal-hint--disabled",children:[e.jsx("i",{className:"fa-solid fa-circle-info"})," Calculate the course first to generate a cue sheet."]})})]}),e.jsxs("div",{className:"export-modal-footer",children:[C==="json"&&e.jsx("span",{className:"export-modal-footer-note",children:"Saved JSON can be re-imported to restore this course."}),C==="cuesheet"&&we&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"export-modal-footer-note",children:a?"Color key: green = start, red = end, blue = intermediate, amber = transit.":"Name and mile marker are always included per split."}),e.jsxs("div",{className:"export-modal-footer-actions",children:[e.jsxs("button",{type:"button",className:"action-btn",onClick:Oe,disabled:te,title:te?"Fix selection errors before exporting":"Download as .html file",children:[e.jsx("i",{className:"fa-solid fa-file-arrow-down"})," Download HTML"]}),e.jsxs("button",{type:"button",className:"action-btn action-btn-export",onClick:Ge,disabled:te,title:te?"Fix selection errors before exporting":"Open in a new tab — use Ctrl+P / ⌘+P to save as PDF",children:[e.jsx("i",{className:"fa-solid fa-print"})," Open for Print / PDF"]})]})]}),C==="cuesheet"&&!we&&e.jsx("span",{})]})]})}export{tt as default};

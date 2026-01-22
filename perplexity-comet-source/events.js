try{let t=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},r=new t.Error().stack;r&&(t._sentryDebugIds=t._sentryDebugIds||{},t._sentryDebugIds[r]="d2788ea5-e582-41a8-94c4-2d291777d797",t._sentryDebugIdIdentifier="sentry-dbid-d2788ea5-e582-41a8-94c4-2d291777d797")}catch{}(function(){"use strict";const r="pplx-agent-0_0-overlay-stop-button",i=["auxclick","click","dblclick","mousedown","mouseenter","mouseleave","mousemove","mouseout","mouseover","mouseup","mousewheel","wheel","touchcancel","touchend","touchmove","touchstart","keydown","keyup","keypress","beforeinput","input","textInput","compositionstart","compositionend","compositionupdate","pointercancel","pointerdown","pointerenter","pointerleave","pointermove","pointerout","pointerover","pointerrawupdate","pointerup","drag","dragend","dragenter","dragleave","dragover","dragstart","drop","selectstart","contextmenu","change","beforetoggle","submit","reset"],o=document.createElement("style");o.textContent=`
  html body *,
  html body *::before,
  html body *::after {
    cursor: progress !important;
  }

  html body #${r},
  html body #${r} * {
    cursor: pointer !important;
  }
`;let n=!1,s=!1;chrome.runtime.onMessage.addListener(e=>{if(e.type==="START_OVERLAY"){if(e.payload.simpleMode||(n=!e.payload?.isPaused,o.remove(),n&&document.body.appendChild(o),s))return;i.forEach(d=>{window.addEventListener(d,a,{capture:!0,passive:!1})}),s=!0;return}if(e.type==="STOP_OVERLAY"){n=!1,o.remove(),i.forEach(d=>{window.removeEventListener(d,a,!0)}),s=!1,u=null;return}if(e.type==="START_BLOCKING"){n=!0,o.remove(),document.body.appendChild(o);return}if(e.type==="STOP_BLOCKING"){n=!1,e.payload.isPaused&&o.remove();return}});const a=e=>{if(!n||!e.isTrusted)return;const d=l();d&&e.composedPath().includes(d)||(e.stopImmediatePropagation(),e.preventDefault())};let u=null;const l=()=>u||(u=document.getElementById(r),u)})();
//# sourceMappingURL=events.js.map

(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const dr="160",Tc=0,Ir=1,bc=2,Ml=1,Sl=2,En=3,Gn=0,Ve=1,pe=2,Bn=0,Ii=1,Nr=2,Fr=3,Or=4,wc=5,ti=100,Ec=101,Ac=102,zr=103,Br=104,Rc=200,Cc=201,Pc=202,Lc=203,Za=204,Ja=205,Dc=206,Uc=207,Ic=208,Nc=209,Fc=210,Oc=211,zc=212,Bc=213,kc=214,Hc=0,Gc=1,Vc=2,qs=3,Wc=4,Xc=5,qc=6,$c=7,fr=0,Yc=1,jc=2,kn=0,Zc=1,Jc=2,Kc=3,Qc=4,th=5,eh=6,Tl=300,Oi=301,zi=302,Ka=303,Qa=304,ta=306,tr=1e3,un=1001,er=1002,Ce=1003,kr=1004,da=1005,Je=1006,nh=1007,ns=1008,Hn=1009,ih=1010,sh=1011,pr=1012,bl=1013,On=1014,zn=1015,is=1016,wl=1017,El=1018,ii=1020,ah=1021,an=1023,rh=1024,oh=1025,si=1026,Bi=1027,lh=1028,Al=1029,ch=1030,Rl=1031,Cl=1033,fa=33776,pa=33777,ma=33778,ga=33779,Hr=35840,Gr=35841,Vr=35842,Wr=35843,Pl=36196,Xr=37492,qr=37496,$r=37808,Yr=37809,jr=37810,Zr=37811,Jr=37812,Kr=37813,Qr=37814,to=37815,eo=37816,no=37817,io=37818,so=37819,ao=37820,ro=37821,_a=36492,oo=36494,lo=36495,hh=36283,co=36284,ho=36285,uo=36286,Ll=3e3,ai=3001,uh=3200,dh=3201,mr=0,fh=1,rn="",Pe="srgb",Cn="srgb-linear",gr="display-p3",ea="display-p3-linear",$s="linear",se="srgb",Ys="rec709",js="p3",fi=7680,fo=519,ph=512,mh=513,gh=514,Dl=515,_h=516,vh=517,xh=518,yh=519,po=35044,mo="300 es",nr=1035,Rn=2e3,Zs=2001;class Hi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const a=s.indexOf(e);a!==-1&&s.splice(a,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let a=0,o=s.length;a<o;a++)s[a].call(this,t);t.target=null}}}const Ue=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let go=1234567;const Ni=Math.PI/180,ss=180/Math.PI;function hi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ue[i&255]+Ue[i>>8&255]+Ue[i>>16&255]+Ue[i>>24&255]+"-"+Ue[t&255]+Ue[t>>8&255]+"-"+Ue[t>>16&15|64]+Ue[t>>24&255]+"-"+Ue[e&63|128]+Ue[e>>8&255]+"-"+Ue[e>>16&255]+Ue[e>>24&255]+Ue[n&255]+Ue[n>>8&255]+Ue[n>>16&255]+Ue[n>>24&255]).toLowerCase()}function xe(i,t,e){return Math.max(t,Math.min(e,i))}function _r(i,t){return(i%t+t)%t}function Mh(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Sh(i,t,e){return i!==t?(e-i)/(t-i):0}function Ji(i,t,e){return(1-e)*i+e*t}function Th(i,t,e,n){return Ji(i,t,1-Math.exp(-e*n))}function bh(i,t=1){return t-Math.abs(_r(i,t*2)-t)}function wh(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Eh(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Ah(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Rh(i,t){return i+Math.random()*(t-i)}function Ch(i){return i*(.5-Math.random())}function Ph(i){i!==void 0&&(go=i);let t=go+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Lh(i){return i*Ni}function Dh(i){return i*ss}function ir(i){return(i&i-1)===0&&i!==0}function Uh(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Js(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Ih(i,t,e,n,s){const a=Math.cos,o=Math.sin,r=a(e/2),l=o(e/2),c=a((t+n)/2),h=o((t+n)/2),u=a((t-n)/2),d=o((t-n)/2),f=a((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(r*h,l*u,l*d,r*c);break;case"YZY":i.set(l*d,r*h,l*u,r*c);break;case"ZXZ":i.set(l*u,l*d,r*h,r*c);break;case"XZX":i.set(r*h,l*g,l*f,r*c);break;case"YXY":i.set(l*f,r*h,l*g,r*c);break;case"ZYZ":i.set(l*g,l*f,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ci(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ze(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const We={DEG2RAD:Ni,RAD2DEG:ss,generateUUID:hi,clamp:xe,euclideanModulo:_r,mapLinear:Mh,inverseLerp:Sh,lerp:Ji,damp:Th,pingpong:bh,smoothstep:wh,smootherstep:Eh,randInt:Ah,randFloat:Rh,randFloatSpread:Ch,seededRandom:Ph,degToRad:Lh,radToDeg:Dh,isPowerOfTwo:ir,ceilPowerOfTwo:Uh,floorPowerOfTwo:Js,setQuaternionFromProperEuler:Ih,normalize:ze,denormalize:Ci};class vt{constructor(t=0,e=0){vt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(xe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),a=this.x-t.x,o=this.y-t.y;return this.x=a*n-o*s+t.x,this.y=a*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Yt{constructor(t,e,n,s,a,o,r,l,c){Yt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,a,o,r,l,c)}set(t,e,n,s,a,o,r,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=r,h[3]=e,h[4]=a,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,a=this.elements,o=n[0],r=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],_=s[0],m=s[3],p=s[6],y=s[1],v=s[4],M=s[7],I=s[2],C=s[5],b=s[8];return a[0]=o*_+r*y+l*I,a[3]=o*m+r*v+l*C,a[6]=o*p+r*M+l*b,a[1]=c*_+h*y+u*I,a[4]=c*m+h*v+u*C,a[7]=c*p+h*M+u*b,a[2]=d*_+f*y+g*I,a[5]=d*m+f*v+g*C,a[8]=d*p+f*M+g*b,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*r*c-n*a*h+n*r*l+s*a*c-s*o*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],u=h*o-r*c,d=r*l-h*a,f=c*a-o*l,g=e*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(s*c-h*n)*_,t[2]=(r*n-s*o)*_,t[3]=d*_,t[4]=(h*e-s*l)*_,t[5]=(s*a-r*e)*_,t[6]=f*_,t[7]=(n*l-c*e)*_,t[8]=(o*e-n*a)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,a,o,r){const l=Math.cos(a),c=Math.sin(a);return this.set(n*l,n*c,-n*(l*o+c*r)+o+t,-s*c,s*l,-s*(-c*o+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(va.makeScale(t,e)),this}rotate(t){return this.premultiply(va.makeRotation(-t)),this}translate(t,e){return this.premultiply(va.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const va=new Yt;function Ul(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Ks(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Nh(){const i=Ks("canvas");return i.style.display="block",i}const _o={};function Ki(i){i in _o||(_o[i]=!0,console.warn(i))}const vo=new Yt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),xo=new Yt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),ps={[Cn]:{transfer:$s,primaries:Ys,toReference:i=>i,fromReference:i=>i},[Pe]:{transfer:se,primaries:Ys,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[ea]:{transfer:$s,primaries:js,toReference:i=>i.applyMatrix3(xo),fromReference:i=>i.applyMatrix3(vo)},[gr]:{transfer:se,primaries:js,toReference:i=>i.convertSRGBToLinear().applyMatrix3(xo),fromReference:i=>i.applyMatrix3(vo).convertLinearToSRGB()}},Fh=new Set([Cn,ea]),Kt={enabled:!0,_workingColorSpace:Cn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Fh.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=ps[t].toReference,s=ps[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return ps[i].primaries},getTransfer:function(i){return i===rn?$s:ps[i].transfer}};function Fi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function xa(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let pi;class Il{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{pi===void 0&&(pi=Ks("canvas")),pi.width=t.width,pi.height=t.height;const n=pi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=pi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ks("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),a=s.data;for(let o=0;o<a.length;o++)a[o]=Fi(a[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Fi(e[n]/255)*255):e[n]=Fi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Oh=0;class Nl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Oh++}),this.uuid=hi(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let o=0,r=s.length;o<r;o++)s[o].isDataTexture?a.push(ya(s[o].image)):a.push(ya(s[o]))}else a=ya(s);n.url=a}return e||(t.images[this.uuid]=n),n}}function ya(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Il.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let zh=0;class Xe extends Hi{constructor(t=Xe.DEFAULT_IMAGE,e=Xe.DEFAULT_MAPPING,n=un,s=un,a=Je,o=ns,r=an,l=Hn,c=Xe.DEFAULT_ANISOTROPY,h=rn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:zh++}),this.uuid=hi(),this.name="",this.source=new Nl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=a,this.minFilter=o,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new vt(0,0),this.repeat=new vt(1,1),this.center=new vt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Ki("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===ai?Pe:rn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Tl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case tr:t.x=t.x-Math.floor(t.x);break;case un:t.x=t.x<0?0:1;break;case er:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case tr:t.y=t.y-Math.floor(t.y);break;case un:t.y=t.y<0?0:1;break;case er:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Ki("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Pe?ai:Ll}set encoding(t){Ki("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===ai?Pe:rn}}Xe.DEFAULT_IMAGE=null;Xe.DEFAULT_MAPPING=Tl;Xe.DEFAULT_ANISOTROPY=1;class Ee{constructor(t=0,e=0,n=0,s=1){Ee.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,a=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*a,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*a,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*a,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*a,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,a;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(c+1)/2,M=(f+1)/2,I=(p+1)/2,C=(h+d)/4,b=(u+_)/4,k=(g+m)/4;return v>M&&v>I?v<.01?(n=0,s=.707106781,a=.707106781):(n=Math.sqrt(v),s=C/n,a=b/n):M>I?M<.01?(n=.707106781,s=0,a=.707106781):(s=Math.sqrt(M),n=C/s,a=k/s):I<.01?(n=.707106781,s=.707106781,a=0):(a=Math.sqrt(I),n=b/a,s=k/a),this.set(n,s,a,e),this}let y=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(u-_)/y,this.z=(d-h)/y,this.w=Math.acos((c+f+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Bh extends Hi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ee(0,0,t,e),this.scissorTest=!1,this.viewport=new Ee(0,0,t,e);const s={width:t,height:e,depth:1};n.encoding!==void 0&&(Ki("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===ai?Pe:rn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Je,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Xe(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Nl(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ri extends Bh{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Fl extends Xe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ce,this.minFilter=Ce,this.wrapR=un,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class kh extends Xe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ce,this.minFilter=Ce,this.wrapR=un,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class cs{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,a,o,r){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3];const d=a[o+0],f=a[o+1],g=a[o+2],_=a[o+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(r===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(u!==_||l!==d||c!==f||h!==g){let m=1-r;const p=l*d+c*f+h*g+u*_,y=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const I=Math.sqrt(v),C=Math.atan2(I,p*y);m=Math.sin(m*C)/I,r=Math.sin(r*C)/I}const M=r*y;if(l=l*m+d*M,c=c*m+f*M,h=h*m+g*M,u=u*m+_*M,m===1-r){const I=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=I,c*=I,h*=I,u*=I}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,a,o){const r=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=a[o],d=a[o+1],f=a[o+2],g=a[o+3];return t[e]=r*g+h*u+l*f-c*d,t[e+1]=l*g+h*d+c*u-r*f,t[e+2]=c*g+h*f+r*d-l*u,t[e+3]=h*g-r*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,a=t._z,o=t._order,r=Math.cos,l=Math.sin,c=r(n/2),h=r(s/2),u=r(a/2),d=l(n/2),f=l(s/2),g=l(a/2);switch(o){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],a=e[8],o=e[1],r=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+r+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(a-c)*f,this._z=(o-s)*f}else if(n>r&&n>u){const f=2*Math.sqrt(1+n-r-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(a+c)/f}else if(r>u){const f=2*Math.sqrt(1+r-n-u);this._w=(a-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-r);this._w=(o-s)/f,this._x=(a+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(xe(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,a=t._z,o=t._w,r=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*r+s*c-a*l,this._y=s*h+o*l+a*r-n*c,this._z=a*h+o*c+n*l-s*r,this._w=o*h-n*r-s*l-a*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,a=this._z,o=this._w;let r=o*t._w+n*t._x+s*t._y+a*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=o,this._x=n,this._y=s,this._z=a,this;const l=1-r*r;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*a+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=a*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),a=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(a),n*Math.cos(a),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(t=0,e=0,n=0){L.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(yo.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(yo.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[3]*n+a[6]*s,this.y=a[1]*e+a[4]*n+a[7]*s,this.z=a[2]*e+a[5]*n+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,a=t.elements,o=1/(a[3]*e+a[7]*n+a[11]*s+a[15]);return this.x=(a[0]*e+a[4]*n+a[8]*s+a[12])*o,this.y=(a[1]*e+a[5]*n+a[9]*s+a[13])*o,this.z=(a[2]*e+a[6]*n+a[10]*s+a[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,a=t.x,o=t.y,r=t.z,l=t.w,c=2*(o*s-r*n),h=2*(r*e-a*s),u=2*(a*n-o*e);return this.x=e+l*c+o*u-r*h,this.y=n+l*h+r*c-a*u,this.z=s+l*u+a*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s,this.y=a[1]*e+a[5]*n+a[9]*s,this.z=a[2]*e+a[6]*n+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,a=t.z,o=e.x,r=e.y,l=e.z;return this.x=s*l-a*r,this.y=a*o-n*l,this.z=n*r-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ma.copy(this).projectOnVector(t),this.sub(Ma)}reflect(t){return this.sub(Ma.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(xe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ma=new L,yo=new cs;class hs{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(ln.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(ln.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=ln.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const a=n.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0)for(let o=0,r=a.count;o<r;o++)t.isMesh===!0?t.getVertexPosition(o,ln):ln.fromBufferAttribute(a,o),ln.applyMatrix4(t.matrixWorld),this.expandByPoint(ln);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ms.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ms.copy(n.boundingBox)),ms.applyMatrix4(t.matrixWorld),this.union(ms)}const s=t.children;for(let a=0,o=s.length;a<o;a++)this.expandByObject(s[a],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,ln),ln.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Xi),gs.subVectors(this.max,Xi),mi.subVectors(t.a,Xi),gi.subVectors(t.b,Xi),_i.subVectors(t.c,Xi),Ln.subVectors(gi,mi),Dn.subVectors(_i,gi),Yn.subVectors(mi,_i);let e=[0,-Ln.z,Ln.y,0,-Dn.z,Dn.y,0,-Yn.z,Yn.y,Ln.z,0,-Ln.x,Dn.z,0,-Dn.x,Yn.z,0,-Yn.x,-Ln.y,Ln.x,0,-Dn.y,Dn.x,0,-Yn.y,Yn.x,0];return!Sa(e,mi,gi,_i,gs)||(e=[1,0,0,0,1,0,0,0,1],!Sa(e,mi,gi,_i,gs))?!1:(_s.crossVectors(Ln,Dn),e=[_s.x,_s.y,_s.z],Sa(e,mi,gi,_i,gs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ln).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ln).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(yn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),yn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),yn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),yn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),yn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),yn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),yn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),yn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(yn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const yn=[new L,new L,new L,new L,new L,new L,new L,new L],ln=new L,ms=new hs,mi=new L,gi=new L,_i=new L,Ln=new L,Dn=new L,Yn=new L,Xi=new L,gs=new L,_s=new L,jn=new L;function Sa(i,t,e,n,s){for(let a=0,o=i.length-3;a<=o;a+=3){jn.fromArray(i,a);const r=s.x*Math.abs(jn.x)+s.y*Math.abs(jn.y)+s.z*Math.abs(jn.z),l=t.dot(jn),c=e.dot(jn),h=n.dot(jn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const Hh=new hs,qi=new L,Ta=new L;class na{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Hh.setFromPoints(t).getCenter(n);let s=0;for(let a=0,o=t.length;a<o;a++)s=Math.max(s,n.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;qi.subVectors(t,this.center);const e=qi.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(qi,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ta.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(qi.copy(t.center).add(Ta)),this.expandByPoint(qi.copy(t.center).sub(Ta))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Mn=new L,ba=new L,vs=new L,Un=new L,wa=new L,xs=new L,Ea=new L;class vr{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Mn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Mn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Mn.copy(this.origin).addScaledVector(this.direction,e),Mn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ba.copy(t).add(e).multiplyScalar(.5),vs.copy(e).sub(t).normalize(),Un.copy(this.origin).sub(ba);const a=t.distanceTo(e)*.5,o=-this.direction.dot(vs),r=Un.dot(this.direction),l=-Un.dot(vs),c=Un.lengthSq(),h=Math.abs(1-o*o);let u,d,f,g;if(h>0)if(u=o*l-r,d=o*r-l,g=a*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,f=u*(u+o*d+2*r)+d*(o*u+d+2*l)+c}else d=a,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*l)+c;else d=-a,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*a+r)),d=u>0?-a:Math.min(Math.max(-a,-l),a),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-a,-l),a),f=d*(d+2*l)+c):(u=Math.max(0,-(o*a+r)),d=u>0?a:Math.min(Math.max(-a,-l),a),f=-u*u+d*(d+2*l)+c);else d=o>0?-a:a,u=Math.max(0,-(o*d+r)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ba).addScaledVector(vs,d),f}intersectSphere(t,e){Mn.subVectors(t.center,this.origin);const n=Mn.dot(this.direction),s=Mn.dot(Mn)-n*n,a=t.radius*t.radius;if(s>a)return null;const o=Math.sqrt(a-s),r=n-o,l=n+o;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,a,o,r,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(a=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(a=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||a>s||((a>n||isNaN(n))&&(n=a),(o<s||isNaN(s))&&(s=o),u>=0?(r=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(r=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||r>s)||((r>n||n!==n)&&(n=r),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Mn)!==null}intersectTriangle(t,e,n,s,a){wa.subVectors(e,t),xs.subVectors(n,t),Ea.crossVectors(wa,xs);let o=this.direction.dot(Ea),r;if(o>0){if(s)return null;r=1}else if(o<0)r=-1,o=-o;else return null;Un.subVectors(this.origin,t);const l=r*this.direction.dot(xs.crossVectors(Un,xs));if(l<0)return null;const c=r*this.direction.dot(wa.cross(Un));if(c<0||l+c>o)return null;const h=-r*Un.dot(Ea);return h<0?null:this.at(h/o,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class me{constructor(t,e,n,s,a,o,r,l,c,h,u,d,f,g,_,m){me.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,a,o,r,l,c,h,u,d,f,g,_,m)}set(t,e,n,s,a,o,r,l,c,h,u,d,f,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=a,p[5]=o,p[9]=r,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new me().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/vi.setFromMatrixColumn(t,0).length(),a=1/vi.setFromMatrixColumn(t,1).length(),o=1/vi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*a,e[5]=n[5]*a,e[6]=n[6]*a,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,a=t.z,o=Math.cos(n),r=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(a),u=Math.sin(a);if(t.order==="XYZ"){const d=o*h,f=o*u,g=r*h,_=r*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+g*c,e[5]=d-_*c,e[9]=-r*l,e[2]=_-d*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d+_*r,e[4]=g*r-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-r,e[2]=f*r-g,e[6]=_+d*r,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d-_*r,e[4]=-o*u,e[8]=g+f*r,e[1]=f+g*r,e[5]=o*h,e[9]=_-d*r,e[2]=-o*c,e[6]=r,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,f=o*u,g=r*h,_=r*u;e[0]=l*h,e[4]=g*c-f,e[8]=d*c+_,e[1]=l*u,e[5]=_*c+d,e[9]=f*c-g,e[2]=-c,e[6]=r*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,g=r*l,_=r*c;e[0]=l*h,e[4]=_-d*u,e[8]=g*u+f,e[1]=u,e[5]=o*h,e[9]=-r*h,e[2]=-c*h,e[6]=f*u+g,e[10]=d-_*u}else if(t.order==="XZY"){const d=o*l,f=o*c,g=r*l,_=r*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+_,e[5]=o*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=r*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Gh,t,Vh)}lookAt(t,e,n){const s=this.elements;return $e.subVectors(t,e),$e.lengthSq()===0&&($e.z=1),$e.normalize(),In.crossVectors(n,$e),In.lengthSq()===0&&(Math.abs(n.z)===1?$e.x+=1e-4:$e.z+=1e-4,$e.normalize(),In.crossVectors(n,$e)),In.normalize(),ys.crossVectors($e,In),s[0]=In.x,s[4]=ys.x,s[8]=$e.x,s[1]=In.y,s[5]=ys.y,s[9]=$e.y,s[2]=In.z,s[6]=ys.z,s[10]=$e.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,a=this.elements,o=n[0],r=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],y=n[3],v=n[7],M=n[11],I=n[15],C=s[0],b=s[4],k=s[8],x=s[12],T=s[1],E=s[5],R=s[9],B=s[13],U=s[2],H=s[6],$=s[10],tt=s[14],it=s[3],st=s[7],et=s[11],at=s[15];return a[0]=o*C+r*T+l*U+c*it,a[4]=o*b+r*E+l*H+c*st,a[8]=o*k+r*R+l*$+c*et,a[12]=o*x+r*B+l*tt+c*at,a[1]=h*C+u*T+d*U+f*it,a[5]=h*b+u*E+d*H+f*st,a[9]=h*k+u*R+d*$+f*et,a[13]=h*x+u*B+d*tt+f*at,a[2]=g*C+_*T+m*U+p*it,a[6]=g*b+_*E+m*H+p*st,a[10]=g*k+_*R+m*$+p*et,a[14]=g*x+_*B+m*tt+p*at,a[3]=y*C+v*T+M*U+I*it,a[7]=y*b+v*E+M*H+I*st,a[11]=y*k+v*R+M*$+I*et,a[15]=y*x+v*B+M*tt+I*at,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],a=t[12],o=t[1],r=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+a*l*u-s*c*u-a*r*d+n*c*d+s*r*f-n*l*f)+_*(+e*l*f-e*c*d+a*o*d-s*o*f+s*c*h-a*l*h)+m*(+e*c*u-e*r*f-a*o*u+n*o*f+a*r*h-n*c*h)+p*(-s*r*h-e*l*u+e*r*d+s*o*u-n*o*d+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],o=t[4],r=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],y=u*m*c-_*d*c+_*l*f-r*m*f-u*l*p+r*d*p,v=g*d*c-h*m*c-g*l*f+o*m*f+h*l*p-o*d*p,M=h*_*c-g*u*c+g*r*f-o*_*f-h*r*p+o*u*p,I=g*u*l-h*_*l-g*r*d+o*_*d+h*r*m-o*u*m,C=e*y+n*v+s*M+a*I;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const b=1/C;return t[0]=y*b,t[1]=(_*d*a-u*m*a-_*s*f+n*m*f+u*s*p-n*d*p)*b,t[2]=(r*m*a-_*l*a+_*s*c-n*m*c-r*s*p+n*l*p)*b,t[3]=(u*l*a-r*d*a-u*s*c+n*d*c+r*s*f-n*l*f)*b,t[4]=v*b,t[5]=(h*m*a-g*d*a+g*s*f-e*m*f-h*s*p+e*d*p)*b,t[6]=(g*l*a-o*m*a-g*s*c+e*m*c+o*s*p-e*l*p)*b,t[7]=(o*d*a-h*l*a+h*s*c-e*d*c-o*s*f+e*l*f)*b,t[8]=M*b,t[9]=(g*u*a-h*_*a-g*n*f+e*_*f+h*n*p-e*u*p)*b,t[10]=(o*_*a-g*r*a+g*n*c-e*_*c-o*n*p+e*r*p)*b,t[11]=(h*r*a-o*u*a-h*n*c+e*u*c+o*n*f-e*r*f)*b,t[12]=I*b,t[13]=(h*_*s-g*u*s+g*n*d-e*_*d-h*n*m+e*u*m)*b,t[14]=(g*r*s-o*_*s-g*n*l+e*_*l+o*n*m-e*r*m)*b,t[15]=(o*u*s-h*r*s+h*n*l-e*u*l-o*n*d+e*r*d)*b,this}scale(t){const e=this.elements,n=t.x,s=t.y,a=t.z;return e[0]*=n,e[4]*=s,e[8]*=a,e[1]*=n,e[5]*=s,e[9]*=a,e[2]*=n,e[6]*=s,e[10]*=a,e[3]*=n,e[7]*=s,e[11]*=a,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),a=1-n,o=t.x,r=t.y,l=t.z,c=a*o,h=a*r;return this.set(c*o+n,c*r-s*l,c*l+s*r,0,c*r+s*l,h*r+n,h*l-s*o,0,c*l-s*r,h*l+s*o,a*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,a,o){return this.set(1,n,a,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,a=e._x,o=e._y,r=e._z,l=e._w,c=a+a,h=o+o,u=r+r,d=a*c,f=a*h,g=a*u,_=o*h,m=o*u,p=r*u,y=l*c,v=l*h,M=l*u,I=n.x,C=n.y,b=n.z;return s[0]=(1-(_+p))*I,s[1]=(f+M)*I,s[2]=(g-v)*I,s[3]=0,s[4]=(f-M)*C,s[5]=(1-(d+p))*C,s[6]=(m+y)*C,s[7]=0,s[8]=(g+v)*b,s[9]=(m-y)*b,s[10]=(1-(d+_))*b,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let a=vi.set(s[0],s[1],s[2]).length();const o=vi.set(s[4],s[5],s[6]).length(),r=vi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),t.x=s[12],t.y=s[13],t.z=s[14],cn.copy(this);const c=1/a,h=1/o,u=1/r;return cn.elements[0]*=c,cn.elements[1]*=c,cn.elements[2]*=c,cn.elements[4]*=h,cn.elements[5]*=h,cn.elements[6]*=h,cn.elements[8]*=u,cn.elements[9]*=u,cn.elements[10]*=u,e.setFromRotationMatrix(cn),n.x=a,n.y=o,n.z=r,this}makePerspective(t,e,n,s,a,o,r=Rn){const l=this.elements,c=2*a/(e-t),h=2*a/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s);let f,g;if(r===Rn)f=-(o+a)/(o-a),g=-2*o*a/(o-a);else if(r===Zs)f=-o/(o-a),g=-o*a/(o-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,a,o,r=Rn){const l=this.elements,c=1/(e-t),h=1/(n-s),u=1/(o-a),d=(e+t)*c,f=(n+s)*h;let g,_;if(r===Rn)g=(o+a)*u,_=-2*u;else if(r===Zs)g=a*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const vi=new L,cn=new me,Gh=new L(0,0,0),Vh=new L(1,1,1),In=new L,ys=new L,$e=new L,Mo=new me,So=new cs;class ia{constructor(t=0,e=0,n=0,s=ia.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,a=s[0],o=s[4],r=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(xe(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,a)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-xe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,a),this._z=0);break;case"ZXY":this._x=Math.asin(xe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-xe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(xe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(r,f));break;case"XZY":this._z=Math.asin(-xe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(r,a)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Mo.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Mo,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return So.setFromEuler(this),this.setFromQuaternion(So,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ia.DEFAULT_ORDER="XYZ";class xr{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Wh=0;const To=new L,xi=new cs,Sn=new me,Ms=new L,$i=new L,Xh=new L,qh=new cs,bo=new L(1,0,0),wo=new L(0,1,0),Eo=new L(0,0,1),$h={type:"added"},Yh={type:"removed"};class Le extends Hi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Wh++}),this.uuid=hi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Le.DEFAULT_UP.clone();const t=new L,e=new ia,n=new cs,s=new L(1,1,1);function a(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(a),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new me},normalMatrix:{value:new Yt}}),this.matrix=new me,this.matrixWorld=new me,this.matrixAutoUpdate=Le.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Le.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new xr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return xi.setFromAxisAngle(t,e),this.quaternion.multiply(xi),this}rotateOnWorldAxis(t,e){return xi.setFromAxisAngle(t,e),this.quaternion.premultiply(xi),this}rotateX(t){return this.rotateOnAxis(bo,t)}rotateY(t){return this.rotateOnAxis(wo,t)}rotateZ(t){return this.rotateOnAxis(Eo,t)}translateOnAxis(t,e){return To.copy(t).applyQuaternion(this.quaternion),this.position.add(To.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(bo,t)}translateY(t){return this.translateOnAxis(wo,t)}translateZ(t){return this.translateOnAxis(Eo,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Sn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ms.copy(t):Ms.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),$i.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Sn.lookAt($i,Ms,this.up):Sn.lookAt(Ms,$i,this.up),this.quaternion.setFromRotationMatrix(Sn),s&&(Sn.extractRotation(s.matrixWorld),xi.setFromRotationMatrix(Sn),this.quaternion.premultiply(xi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent($h)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Yh)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Sn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Sn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Sn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($i,t,Xh),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($i,qh,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++){const a=e[n];(a.matrixWorldAutoUpdate===!0||t===!0)&&a.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++){const r=s[a];r.matrixWorldAutoUpdate===!0&&r.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function a(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];a(t.shapes,u)}else a(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(a(t.materials,this.material[l]));s.material=r}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let r=0;r<this.children.length;r++)s.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];s.animations.push(a(t.animations,l))}}if(e){const r=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),g=o(t.nodes);r.length>0&&(n.geometries=r),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Le.DEFAULT_UP=new L(0,1,0);Le.DEFAULT_MATRIX_AUTO_UPDATE=!0;Le.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const hn=new L,Tn=new L,Aa=new L,bn=new L,yi=new L,Mi=new L,Ao=new L,Ra=new L,Ca=new L,Pa=new L;let Ss=!1;class nn{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),hn.subVectors(t,e),s.cross(hn);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,e,n,s,a){hn.subVectors(s,e),Tn.subVectors(n,e),Aa.subVectors(t,e);const o=hn.dot(hn),r=hn.dot(Tn),l=hn.dot(Aa),c=Tn.dot(Tn),h=Tn.dot(Aa),u=o*c-r*r;if(u===0)return a.set(0,0,0),null;const d=1/u,f=(c*l-r*h)*d,g=(o*h-r*l)*d;return a.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,bn)===null?!1:bn.x>=0&&bn.y>=0&&bn.x+bn.y<=1}static getUV(t,e,n,s,a,o,r,l){return Ss===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ss=!0),this.getInterpolation(t,e,n,s,a,o,r,l)}static getInterpolation(t,e,n,s,a,o,r,l){return this.getBarycoord(t,e,n,s,bn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,bn.x),l.addScaledVector(o,bn.y),l.addScaledVector(r,bn.z),l)}static isFrontFacing(t,e,n,s){return hn.subVectors(n,e),Tn.subVectors(t,e),hn.cross(Tn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return hn.subVectors(this.c,this.b),Tn.subVectors(this.a,this.b),hn.cross(Tn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return nn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return nn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,a){return Ss===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ss=!0),nn.getInterpolation(t,this.a,this.b,this.c,e,n,s,a)}getInterpolation(t,e,n,s,a){return nn.getInterpolation(t,this.a,this.b,this.c,e,n,s,a)}containsPoint(t){return nn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return nn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,a=this.c;let o,r;yi.subVectors(s,n),Mi.subVectors(a,n),Ra.subVectors(t,n);const l=yi.dot(Ra),c=Mi.dot(Ra);if(l<=0&&c<=0)return e.copy(n);Ca.subVectors(t,s);const h=yi.dot(Ca),u=Mi.dot(Ca);if(h>=0&&u<=h)return e.copy(s);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(yi,o);Pa.subVectors(t,a);const f=yi.dot(Pa),g=Mi.dot(Pa);if(g>=0&&f<=g)return e.copy(a);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return r=c/(c-g),e.copy(n).addScaledVector(Mi,r);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return Ao.subVectors(a,s),r=(u-h)/(u-h+(f-g)),e.copy(s).addScaledVector(Ao,r);const p=1/(m+_+d);return o=_*p,r=d*p,e.copy(n).addScaledVector(yi,o).addScaledVector(Mi,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Ol={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Nn={h:0,s:0,l:0},Ts={h:0,s:0,l:0};function La(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class kt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Pe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Kt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Kt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Kt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Kt.workingColorSpace){if(t=_r(t,1),e=xe(e,0,1),n=xe(n,0,1),e===0)this.r=this.g=this.b=n;else{const a=n<=.5?n*(1+e):n+e-n*e,o=2*n-a;this.r=La(o,a,t+1/3),this.g=La(o,a,t),this.b=La(o,a,t-1/3)}return Kt.toWorkingColorSpace(this,s),this}setStyle(t,e=Pe){function n(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a;const o=s[1],r=s[2];switch(o){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,e);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const a=s[1],o=a.length;if(o===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(a,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Pe){const n=Ol[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Fi(t.r),this.g=Fi(t.g),this.b=Fi(t.b),this}copyLinearToSRGB(t){return this.r=xa(t.r),this.g=xa(t.g),this.b=xa(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Pe){return Kt.fromWorkingColorSpace(Ie.copy(this),t),Math.round(xe(Ie.r*255,0,255))*65536+Math.round(xe(Ie.g*255,0,255))*256+Math.round(xe(Ie.b*255,0,255))}getHexString(t=Pe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Kt.workingColorSpace){Kt.fromWorkingColorSpace(Ie.copy(this),e);const n=Ie.r,s=Ie.g,a=Ie.b,o=Math.max(n,s,a),r=Math.min(n,s,a);let l,c;const h=(r+o)/2;if(r===o)l=0,c=0;else{const u=o-r;switch(c=h<=.5?u/(o+r):u/(2-o-r),o){case n:l=(s-a)/u+(s<a?6:0);break;case s:l=(a-n)/u+2;break;case a:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Kt.workingColorSpace){return Kt.fromWorkingColorSpace(Ie.copy(this),e),t.r=Ie.r,t.g=Ie.g,t.b=Ie.b,t}getStyle(t=Pe){Kt.fromWorkingColorSpace(Ie.copy(this),t);const e=Ie.r,n=Ie.g,s=Ie.b;return t!==Pe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Nn),this.setHSL(Nn.h+t,Nn.s+e,Nn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Nn),t.getHSL(Ts);const n=Ji(Nn.h,Ts.h,e),s=Ji(Nn.s,Ts.s,e),a=Ji(Nn.l,Ts.l,e);return this.setHSL(n,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,a=t.elements;return this.r=a[0]*e+a[3]*n+a[6]*s,this.g=a[1]*e+a[4]*n+a[7]*s,this.b=a[2]*e+a[5]*n+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ie=new kt;kt.NAMES=Ol;let jh=0;class ui extends Hi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:jh++}),this.uuid=hi(),this.name="",this.type="Material",this.blending=Ii,this.side=Gn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Za,this.blendDst=Ja,this.blendEquation=ti,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new kt(0,0,0),this.blendAlpha=0,this.depthFunc=qs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=fo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fi,this.stencilZFail=fi,this.stencilZPass=fi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ii&&(n.blending=this.blending),this.side!==Gn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Za&&(n.blendSrc=this.blendSrc),this.blendDst!==Ja&&(n.blendDst=this.blendDst),this.blendEquation!==ti&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==qs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==fo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==fi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==fi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==fi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(a){const o=[];for(const r in a){const l=a[r];delete l.metadata,o.push(l)}return o}if(e){const a=s(t.textures),o=s(t.images);a.length>0&&(n.textures=a),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let a=0;a!==s;++a)n[a]=e[a].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class ie extends ui{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new kt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=fr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ge=new L,bs=new vt;class fn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=po,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=zn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)bs.fromBufferAttribute(this,e),bs.applyMatrix3(t),this.setXY(e,bs.x,bs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyMatrix3(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyMatrix4(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyNormalMatrix(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.transformDirection(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ci(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ze(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ci(e,this.array)),e}setX(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ci(e,this.array)),e}setY(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ci(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ci(e,this.array)),e}setW(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ze(e,this.array),n=ze(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ze(e,this.array),n=ze(n,this.array),s=ze(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,a){return t*=this.itemSize,this.normalized&&(e=ze(e,this.array),n=ze(n,this.array),s=ze(s,this.array),a=ze(a,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==po&&(t.usage=this.usage),t}}class zl extends fn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Bl extends fn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Qt extends fn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Zh=0;const tn=new me,Da=new Le,Si=new L,Ye=new hs,Yi=new hs,we=new L;class Ae extends Hi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Zh++}),this.uuid=hi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ul(t)?Bl:zl)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const a=new Yt().getNormalMatrix(t);n.applyNormalMatrix(a),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return tn.makeRotationFromQuaternion(t),this.applyMatrix4(tn),this}rotateX(t){return tn.makeRotationX(t),this.applyMatrix4(tn),this}rotateY(t){return tn.makeRotationY(t),this.applyMatrix4(tn),this}rotateZ(t){return tn.makeRotationZ(t),this.applyMatrix4(tn),this}translate(t,e,n){return tn.makeTranslation(t,e,n),this.applyMatrix4(tn),this}scale(t,e,n){return tn.makeScale(t,e,n),this.applyMatrix4(tn),this}lookAt(t){return Da.lookAt(t),Da.updateMatrix(),this.applyMatrix4(Da.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Si).negate(),this.translate(Si.x,Si.y,Si.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const a=t[n];e.push(a.x,a.y,a.z||0)}return this.setAttribute("position",new Qt(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new hs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const a=e[n];Ye.setFromBufferAttribute(a),this.morphTargetsRelative?(we.addVectors(this.boundingBox.min,Ye.min),this.boundingBox.expandByPoint(we),we.addVectors(this.boundingBox.max,Ye.max),this.boundingBox.expandByPoint(we)):(this.boundingBox.expandByPoint(Ye.min),this.boundingBox.expandByPoint(Ye.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new na);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new L,1/0);return}if(t){const n=this.boundingSphere.center;if(Ye.setFromBufferAttribute(t),e)for(let a=0,o=e.length;a<o;a++){const r=e[a];Yi.setFromBufferAttribute(r),this.morphTargetsRelative?(we.addVectors(Ye.min,Yi.min),Ye.expandByPoint(we),we.addVectors(Ye.max,Yi.max),Ye.expandByPoint(we)):(Ye.expandByPoint(Yi.min),Ye.expandByPoint(Yi.max))}Ye.getCenter(n);let s=0;for(let a=0,o=t.count;a<o;a++)we.fromBufferAttribute(t,a),s=Math.max(s,n.distanceToSquared(we));if(e)for(let a=0,o=e.length;a<o;a++){const r=e[a],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)we.fromBufferAttribute(r,c),l&&(Si.fromBufferAttribute(t,c),we.add(Si)),s=Math.max(s,n.distanceToSquared(we))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,s=e.position.array,a=e.normal.array,o=e.uv.array,r=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new fn(new Float32Array(4*r),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let T=0;T<r;T++)c[T]=new L,h[T]=new L;const u=new L,d=new L,f=new L,g=new vt,_=new vt,m=new vt,p=new L,y=new L;function v(T,E,R){u.fromArray(s,T*3),d.fromArray(s,E*3),f.fromArray(s,R*3),g.fromArray(o,T*2),_.fromArray(o,E*2),m.fromArray(o,R*2),d.sub(u),f.sub(u),_.sub(g),m.sub(g);const B=1/(_.x*m.y-m.x*_.y);isFinite(B)&&(p.copy(d).multiplyScalar(m.y).addScaledVector(f,-_.y).multiplyScalar(B),y.copy(f).multiplyScalar(_.x).addScaledVector(d,-m.x).multiplyScalar(B),c[T].add(p),c[E].add(p),c[R].add(p),h[T].add(y),h[E].add(y),h[R].add(y))}let M=this.groups;M.length===0&&(M=[{start:0,count:n.length}]);for(let T=0,E=M.length;T<E;++T){const R=M[T],B=R.start,U=R.count;for(let H=B,$=B+U;H<$;H+=3)v(n[H+0],n[H+1],n[H+2])}const I=new L,C=new L,b=new L,k=new L;function x(T){b.fromArray(a,T*3),k.copy(b);const E=c[T];I.copy(E),I.sub(b.multiplyScalar(b.dot(E))).normalize(),C.crossVectors(k,E);const B=C.dot(h[T])<0?-1:1;l[T*4]=I.x,l[T*4+1]=I.y,l[T*4+2]=I.z,l[T*4+3]=B}for(let T=0,E=M.length;T<E;++T){const R=M[T],B=R.start,U=R.count;for(let H=B,$=B+U;H<$;H+=3)x(n[H+0]),x(n[H+1]),x(n[H+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new fn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new L,a=new L,o=new L,r=new L,l=new L,c=new L,h=new L,u=new L;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),a.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,a),u.subVectors(s,a),h.cross(u),r.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),r.add(h),l.add(h),c.add(h),n.setXYZ(g,r.x,r.y,r.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),a.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,a),u.subVectors(s,a),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)we.fromBufferAttribute(t,e),we.normalize(),t.setXYZ(e,we.x,we.y,we.z)}toNonIndexed(){function t(r,l){const c=r.array,h=r.itemSize,u=r.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let _=0,m=l.length;_<m;_++){r.isInterleavedBufferAttribute?f=l[_]*r.data.stride+r.offset:f=l[_]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new fn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ae,n=this.index.array,s=this.attributes;for(const r in s){const l=s[r],c=t(l,n);e.setAttribute(r,c)}const a=this.morphAttributes;for(const r in a){const l=[],c=a[r];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let r=0,l=o.length;r<l;r++){const c=o[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const a=t.morphAttributes;for(const c in a){const h=[],u=a[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ro=new me,Zn=new vr,ws=new na,Co=new L,Ti=new L,bi=new L,wi=new L,Ua=new L,Es=new L,As=new vt,Rs=new vt,Cs=new vt,Po=new L,Lo=new L,Do=new L,Ps=new L,Ls=new L;class P extends Le{constructor(t=new Ae,e=new ie){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=s.length;a<o;a++){const r=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=a}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,a=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const r=this.morphTargetInfluences;if(a&&r){Es.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const h=r[l],u=a[l];h!==0&&(Ua.fromBufferAttribute(u,t),o?Es.addScaledVector(Ua,h):Es.addScaledVector(Ua.sub(e),h))}e.add(Es)}return e}raycast(t,e){const n=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ws.copy(n.boundingSphere),ws.applyMatrix4(a),Zn.copy(t.ray).recast(t.near),!(ws.containsPoint(Zn.origin)===!1&&(Zn.intersectSphere(ws,Co)===null||Zn.origin.distanceToSquared(Co)>(t.far-t.near)**2))&&(Ro.copy(a).invert(),Zn.copy(t.ray).applyMatrix4(Ro),!(n.boundingBox!==null&&Zn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Zn)))}_computeIntersections(t,e,n){let s;const a=this.geometry,o=this.material,r=a.index,l=a.attributes.position,c=a.attributes.uv,h=a.attributes.uv1,u=a.attributes.normal,d=a.groups,f=a.drawRange;if(r!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],y=Math.max(m.start,f.start),v=Math.min(r.count,Math.min(m.start+m.count,f.start+f.count));for(let M=y,I=v;M<I;M+=3){const C=r.getX(M),b=r.getX(M+1),k=r.getX(M+2);s=Ds(this,p,t,n,c,h,u,C,b,k),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(r.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const y=r.getX(m),v=r.getX(m+1),M=r.getX(m+2);s=Ds(this,o,t,n,c,h,u,y,v,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],y=Math.max(m.start,f.start),v=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let M=y,I=v;M<I;M+=3){const C=M,b=M+1,k=M+2;s=Ds(this,p,t,n,c,h,u,C,b,k),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const y=m,v=m+1,M=m+2;s=Ds(this,o,t,n,c,h,u,y,v,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Jh(i,t,e,n,s,a,o,r){let l;if(t.side===Ve?l=n.intersectTriangle(o,a,s,!0,r):l=n.intersectTriangle(s,a,o,t.side===Gn,r),l===null)return null;Ls.copy(r),Ls.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Ls);return c<e.near||c>e.far?null:{distance:c,point:Ls.clone(),object:i}}function Ds(i,t,e,n,s,a,o,r,l,c){i.getVertexPosition(r,Ti),i.getVertexPosition(l,bi),i.getVertexPosition(c,wi);const h=Jh(i,t,e,n,Ti,bi,wi,Ps);if(h){s&&(As.fromBufferAttribute(s,r),Rs.fromBufferAttribute(s,l),Cs.fromBufferAttribute(s,c),h.uv=nn.getInterpolation(Ps,Ti,bi,wi,As,Rs,Cs,new vt)),a&&(As.fromBufferAttribute(a,r),Rs.fromBufferAttribute(a,l),Cs.fromBufferAttribute(a,c),h.uv1=nn.getInterpolation(Ps,Ti,bi,wi,As,Rs,Cs,new vt),h.uv2=h.uv1),o&&(Po.fromBufferAttribute(o,r),Lo.fromBufferAttribute(o,l),Do.fromBufferAttribute(o,c),h.normal=nn.getInterpolation(Ps,Ti,bi,wi,Po,Lo,Do,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:r,b:l,c,normal:new L,materialIndex:0};nn.getNormal(Ti,bi,wi,u.normal),h.face=u}return h}class Q extends Ae{constructor(t=1,e=1,n=1,s=1,a=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:a,depthSegments:o};const r=this;s=Math.floor(s),a=Math.floor(a),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,o,a,0),g("z","y","x",1,-1,n,e,-t,o,a,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,a,4),g("x","y","z",-1,-1,t,e,-n,s,a,5),this.setIndex(l),this.setAttribute("position",new Qt(c,3)),this.setAttribute("normal",new Qt(h,3)),this.setAttribute("uv",new Qt(u,2));function g(_,m,p,y,v,M,I,C,b,k,x){const T=M/b,E=I/k,R=M/2,B=I/2,U=C/2,H=b+1,$=k+1;let tt=0,it=0;const st=new L;for(let et=0;et<$;et++){const at=et*E-B;for(let z=0;z<H;z++){const N=z*T-R;st[_]=N*y,st[m]=at*v,st[p]=U,c.push(st.x,st.y,st.z),st[_]=0,st[m]=0,st[p]=C>0?1:-1,h.push(st.x,st.y,st.z),u.push(z/b),u.push(1-et/k),tt+=1}}for(let et=0;et<k;et++)for(let at=0;at<b;at++){const z=d+at+H*et,N=d+at+H*(et+1),V=d+(at+1)+H*(et+1),nt=d+(at+1)+H*et;l.push(z,N,nt),l.push(N,V,nt),it+=6}r.addGroup(f,it,x),f+=it,d+=tt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Q(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ki(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Be(i){const t={};for(let e=0;e<i.length;e++){const n=ki(i[e]);for(const s in n)t[s]=n[s]}return t}function Kh(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function kl(i){return i.getRenderTarget()===null?i.outputColorSpace:Kt.workingColorSpace}const Qh={clone:ki,merge:Be};var tu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,eu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class oi extends ui{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=tu,this.fragmentShader=eu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ki(t.uniforms),this.uniformsGroups=Kh(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Hl extends Le{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new me,this.projectionMatrix=new me,this.projectionMatrixInverse=new me,this.coordinateSystem=Rn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class sn extends Hl{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ss*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ni*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ss*2*Math.atan(Math.tan(Ni*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,a,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ni*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,a=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;a+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const r=this.filmOffset;r!==0&&(a+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ei=-90,Ai=1;class nu extends Le{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new sn(Ei,Ai,t,e);s.layers=this.layers,this.add(s);const a=new sn(Ei,Ai,t,e);a.layers=this.layers,this.add(a);const o=new sn(Ei,Ai,t,e);o.layers=this.layers,this.add(o);const r=new sn(Ei,Ai,t,e);r.layers=this.layers,this.add(r);const l=new sn(Ei,Ai,t,e);l.layers=this.layers,this.add(l);const c=new sn(Ei,Ai,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,a,o,r,l]=e;for(const c of e)this.remove(c);if(t===Rn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Zs)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[a,o,r,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,a),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,r),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Gl extends Xe{constructor(t,e,n,s,a,o,r,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Oi,super(t,e,n,s,a,o,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class iu extends ri{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(Ki("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===ai?Pe:rn),this.texture=new Gl(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Je}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Q(5,5,5),a=new oi({name:"CubemapFromEquirect",uniforms:ki(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ve,blending:Bn});a.uniforms.tEquirect.value=e;const o=new P(s,a),r=e.minFilter;return e.minFilter===ns&&(e.minFilter=Je),new nu(1,10,this).update(t,o),e.minFilter=r,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const a=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(a)}}const Ia=new L,su=new L,au=new Yt;class Fn{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Ia.subVectors(n,e).cross(su.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Ia),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:e.copy(t.start).addScaledVector(n,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||au.getNormalMatrix(t),s=this.coplanarPoint(Ia).applyMatrix4(t),a=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Jn=new na,Us=new L;class yr{constructor(t=new Fn,e=new Fn,n=new Fn,s=new Fn,a=new Fn,o=new Fn){this.planes=[t,e,n,s,a,o]}set(t,e,n,s,a,o){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(n),r[3].copy(s),r[4].copy(a),r[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Rn){const n=this.planes,s=t.elements,a=s[0],o=s[1],r=s[2],l=s[3],c=s[4],h=s[5],u=s[6],d=s[7],f=s[8],g=s[9],_=s[10],m=s[11],p=s[12],y=s[13],v=s[14],M=s[15];if(n[0].setComponents(l-a,d-c,m-f,M-p).normalize(),n[1].setComponents(l+a,d+c,m+f,M+p).normalize(),n[2].setComponents(l+o,d+h,m+g,M+y).normalize(),n[3].setComponents(l-o,d-h,m-g,M-y).normalize(),n[4].setComponents(l-r,d-u,m-_,M-v).normalize(),e===Rn)n[5].setComponents(l+r,d+u,m+_,M+v).normalize();else if(e===Zs)n[5].setComponents(r,u,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Jn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Jn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Jn)}intersectsSprite(t){return Jn.center.set(0,0,0),Jn.radius=.7071067811865476,Jn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Jn)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Us.x=s.normal.x>0?t.max.x:t.min.x,Us.y=s.normal.y>0?t.max.y:t.min.y,Us.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Us)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Vl(){let i=null,t=!1,e=null,n=null;function s(a,o){e(a,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){i=a}}}function ru(i,t){const e=t.isWebGL2,n=new WeakMap;function s(c,h){const u=c.array,d=c.usage,f=u.byteLength,g=i.createBuffer();i.bindBuffer(h,g),i.bufferData(h,u,d),c.onUploadCallback();let _;if(u instanceof Float32Array)_=i.FLOAT;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)_=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)_=i.SHORT;else if(u instanceof Uint32Array)_=i.UNSIGNED_INT;else if(u instanceof Int32Array)_=i.INT;else if(u instanceof Int8Array)_=i.BYTE;else if(u instanceof Uint8Array)_=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)_=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:_,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version,size:f}}function a(c,h,u){const d=h.array,f=h._updateRange,g=h.updateRanges;if(i.bindBuffer(u,c),f.count===-1&&g.length===0&&i.bufferSubData(u,0,d),g.length!==0){for(let _=0,m=g.length;_<m;_++){const p=g[_];e?i.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d,p.start,p.count):i.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d.subarray(p.start,p.start+p.count))}h.clearUpdateRanges()}f.count!==-1&&(e?i.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d,f.offset,f.count):i.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d.subarray(f.offset,f.offset+f.count)),f.count=-1),h.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function r(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(i.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const d=n.get(c);(!d||d.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const u=n.get(c);if(u===void 0)n.set(c,s(c,h));else if(u.version<c.version){if(u.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");a(u.buffer,c,h),u.version=c.version}}return{get:o,remove:r,update:l}}class dn extends Ae{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const a=t/2,o=e/2,r=Math.floor(n),l=Math.floor(s),c=r+1,h=l+1,u=t/r,d=e/l,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const y=p*d-o;for(let v=0;v<c;v++){const M=v*u-a;g.push(M,-y,0),_.push(0,0,1),m.push(v/r),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<r;y++){const v=y+c*p,M=y+c*(p+1),I=y+1+c*(p+1),C=y+1+c*p;f.push(v,M,C),f.push(M,I,C)}this.setIndex(f),this.setAttribute("position",new Qt(g,3)),this.setAttribute("normal",new Qt(_,3)),this.setAttribute("uv",new Qt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new dn(t.width,t.height,t.widthSegments,t.heightSegments)}}var ou=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,lu=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,cu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,hu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,uu=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,du=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,fu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,pu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,mu=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,gu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,_u=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,vu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,xu=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,yu=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Mu=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Su=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,Tu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,bu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,wu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Eu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Au=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ru=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Cu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Pu=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Lu=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Du=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Uu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Iu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Nu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Fu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ou="gl_FragColor = linearToOutputTexel( gl_FragColor );",zu=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Bu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,ku=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Hu=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Gu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Vu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Wu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Xu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,qu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,$u=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Yu=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ju=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Zu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ju=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ku=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Qu=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,td=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,ed=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,nd=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,id=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,sd=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ad=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,rd=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,od=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,ld=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,cd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,hd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ud=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,fd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,pd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,md=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,gd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,_d=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,vd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,xd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,yd=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Md=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,Sd=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,Td=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,bd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,wd=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Ed=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ad=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Cd=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Pd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ld=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Dd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ud=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Id=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Nd=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Fd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Od=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,zd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Bd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,kd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Hd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Gd=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,Vd=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Wd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Xd=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,qd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,$d=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Yd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,jd=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Zd=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Jd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Kd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Qd=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,tf=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,ef=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,nf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,sf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,af=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,rf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const of=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,lf=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,uf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,df=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ff=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,pf=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,mf=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,gf=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,_f=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,vf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xf=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,yf=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Mf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Sf=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tf=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,bf=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wf=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Ef=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Af=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Rf=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Cf=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Pf=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lf=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Df=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Uf=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,If=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Nf=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Ff=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Of=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,zf=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Bf=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,kf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Gt={alphahash_fragment:ou,alphahash_pars_fragment:lu,alphamap_fragment:cu,alphamap_pars_fragment:hu,alphatest_fragment:uu,alphatest_pars_fragment:du,aomap_fragment:fu,aomap_pars_fragment:pu,batching_pars_vertex:mu,batching_vertex:gu,begin_vertex:_u,beginnormal_vertex:vu,bsdfs:xu,iridescence_fragment:yu,bumpmap_pars_fragment:Mu,clipping_planes_fragment:Su,clipping_planes_pars_fragment:Tu,clipping_planes_pars_vertex:bu,clipping_planes_vertex:wu,color_fragment:Eu,color_pars_fragment:Au,color_pars_vertex:Ru,color_vertex:Cu,common:Pu,cube_uv_reflection_fragment:Lu,defaultnormal_vertex:Du,displacementmap_pars_vertex:Uu,displacementmap_vertex:Iu,emissivemap_fragment:Nu,emissivemap_pars_fragment:Fu,colorspace_fragment:Ou,colorspace_pars_fragment:zu,envmap_fragment:Bu,envmap_common_pars_fragment:ku,envmap_pars_fragment:Hu,envmap_pars_vertex:Gu,envmap_physical_pars_fragment:td,envmap_vertex:Vu,fog_vertex:Wu,fog_pars_vertex:Xu,fog_fragment:qu,fog_pars_fragment:$u,gradientmap_pars_fragment:Yu,lightmap_fragment:ju,lightmap_pars_fragment:Zu,lights_lambert_fragment:Ju,lights_lambert_pars_fragment:Ku,lights_pars_begin:Qu,lights_toon_fragment:ed,lights_toon_pars_fragment:nd,lights_phong_fragment:id,lights_phong_pars_fragment:sd,lights_physical_fragment:ad,lights_physical_pars_fragment:rd,lights_fragment_begin:od,lights_fragment_maps:ld,lights_fragment_end:cd,logdepthbuf_fragment:hd,logdepthbuf_pars_fragment:ud,logdepthbuf_pars_vertex:dd,logdepthbuf_vertex:fd,map_fragment:pd,map_pars_fragment:md,map_particle_fragment:gd,map_particle_pars_fragment:_d,metalnessmap_fragment:vd,metalnessmap_pars_fragment:xd,morphcolor_vertex:yd,morphnormal_vertex:Md,morphtarget_pars_vertex:Sd,morphtarget_vertex:Td,normal_fragment_begin:bd,normal_fragment_maps:wd,normal_pars_fragment:Ed,normal_pars_vertex:Ad,normal_vertex:Rd,normalmap_pars_fragment:Cd,clearcoat_normal_fragment_begin:Pd,clearcoat_normal_fragment_maps:Ld,clearcoat_pars_fragment:Dd,iridescence_pars_fragment:Ud,opaque_fragment:Id,packing:Nd,premultiplied_alpha_fragment:Fd,project_vertex:Od,dithering_fragment:zd,dithering_pars_fragment:Bd,roughnessmap_fragment:kd,roughnessmap_pars_fragment:Hd,shadowmap_pars_fragment:Gd,shadowmap_pars_vertex:Vd,shadowmap_vertex:Wd,shadowmask_pars_fragment:Xd,skinbase_vertex:qd,skinning_pars_vertex:$d,skinning_vertex:Yd,skinnormal_vertex:jd,specularmap_fragment:Zd,specularmap_pars_fragment:Jd,tonemapping_fragment:Kd,tonemapping_pars_fragment:Qd,transmission_fragment:tf,transmission_pars_fragment:ef,uv_pars_fragment:nf,uv_pars_vertex:sf,uv_vertex:af,worldpos_vertex:rf,background_vert:of,background_frag:lf,backgroundCube_vert:cf,backgroundCube_frag:hf,cube_vert:uf,cube_frag:df,depth_vert:ff,depth_frag:pf,distanceRGBA_vert:mf,distanceRGBA_frag:gf,equirect_vert:_f,equirect_frag:vf,linedashed_vert:xf,linedashed_frag:yf,meshbasic_vert:Mf,meshbasic_frag:Sf,meshlambert_vert:Tf,meshlambert_frag:bf,meshmatcap_vert:wf,meshmatcap_frag:Ef,meshnormal_vert:Af,meshnormal_frag:Rf,meshphong_vert:Cf,meshphong_frag:Pf,meshphysical_vert:Lf,meshphysical_frag:Df,meshtoon_vert:Uf,meshtoon_frag:If,points_vert:Nf,points_frag:Ff,shadow_vert:Of,shadow_frag:zf,sprite_vert:Bf,sprite_frag:kf},pt={common:{diffuse:{value:new kt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new vt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new kt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new kt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new kt(16777215)},opacity:{value:1},center:{value:new vt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},gn={basic:{uniforms:Be([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.fog]),vertexShader:Gt.meshbasic_vert,fragmentShader:Gt.meshbasic_frag},lambert:{uniforms:Be([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new kt(0)}}]),vertexShader:Gt.meshlambert_vert,fragmentShader:Gt.meshlambert_frag},phong:{uniforms:Be([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new kt(0)},specular:{value:new kt(1118481)},shininess:{value:30}}]),vertexShader:Gt.meshphong_vert,fragmentShader:Gt.meshphong_frag},standard:{uniforms:Be([pt.common,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.roughnessmap,pt.metalnessmap,pt.fog,pt.lights,{emissive:{value:new kt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Gt.meshphysical_vert,fragmentShader:Gt.meshphysical_frag},toon:{uniforms:Be([pt.common,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.gradientmap,pt.fog,pt.lights,{emissive:{value:new kt(0)}}]),vertexShader:Gt.meshtoon_vert,fragmentShader:Gt.meshtoon_frag},matcap:{uniforms:Be([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,{matcap:{value:null}}]),vertexShader:Gt.meshmatcap_vert,fragmentShader:Gt.meshmatcap_frag},points:{uniforms:Be([pt.points,pt.fog]),vertexShader:Gt.points_vert,fragmentShader:Gt.points_frag},dashed:{uniforms:Be([pt.common,pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Gt.linedashed_vert,fragmentShader:Gt.linedashed_frag},depth:{uniforms:Be([pt.common,pt.displacementmap]),vertexShader:Gt.depth_vert,fragmentShader:Gt.depth_frag},normal:{uniforms:Be([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,{opacity:{value:1}}]),vertexShader:Gt.meshnormal_vert,fragmentShader:Gt.meshnormal_frag},sprite:{uniforms:Be([pt.sprite,pt.fog]),vertexShader:Gt.sprite_vert,fragmentShader:Gt.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Gt.background_vert,fragmentShader:Gt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Gt.backgroundCube_vert,fragmentShader:Gt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Gt.cube_vert,fragmentShader:Gt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Gt.equirect_vert,fragmentShader:Gt.equirect_frag},distanceRGBA:{uniforms:Be([pt.common,pt.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Gt.distanceRGBA_vert,fragmentShader:Gt.distanceRGBA_frag},shadow:{uniforms:Be([pt.lights,pt.fog,{color:{value:new kt(0)},opacity:{value:1}}]),vertexShader:Gt.shadow_vert,fragmentShader:Gt.shadow_frag}};gn.physical={uniforms:Be([gn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new vt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new kt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new vt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new kt(0)},specularColor:{value:new kt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new vt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:Gt.meshphysical_vert,fragmentShader:Gt.meshphysical_frag};const Is={r:0,b:0,g:0};function Hf(i,t,e,n,s,a,o){const r=new kt(0);let l=a===!0?0:1,c,h,u=null,d=0,f=null;function g(m,p){let y=!1,v=p.isScene===!0?p.background:null;v&&v.isTexture&&(v=(p.backgroundBlurriness>0?e:t).get(v)),v===null?_(r,l):v&&v.isColor&&(_(v,1),y=!0);const M=i.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,o):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||y)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),v&&(v.isCubeTexture||v.mapping===ta)?(h===void 0&&(h=new P(new Q(1,1,1),new oi({name:"BackgroundCubeMaterial",uniforms:ki(gn.backgroundCube.uniforms),vertexShader:gn.backgroundCube.vertexShader,fragmentShader:gn.backgroundCube.fragmentShader,side:Ve,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(I,C,b){this.matrixWorld.copyPosition(b.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=Kt.getTransfer(v.colorSpace)!==se,(u!==v||d!==v.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=v,d=v.version,f=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new P(new dn(2,2),new oi({name:"BackgroundMaterial",uniforms:ki(gn.background.uniforms),vertexShader:gn.background.vertexShader,fragmentShader:gn.background.fragmentShader,side:Gn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,c.material.toneMapped=Kt.getTransfer(v.colorSpace)!==se,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||d!==v.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,u=v,d=v.version,f=i.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function _(m,p){m.getRGB(Is,kl(i)),n.buffers.color.setClear(Is.r,Is.g,Is.b,p,o)}return{getClearColor:function(){return r},setClearColor:function(m,p=1){r.set(m),l=p,_(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,_(r,l)},render:g}}function Gf(i,t,e,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),a=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||a!==null,r={},l=m(null);let c=l,h=!1;function u(U,H,$,tt,it){let st=!1;if(o){const et=_(tt,$,H);c!==et&&(c=et,f(c.object)),st=p(U,tt,$,it),st&&y(U,tt,$,it)}else{const et=H.wireframe===!0;(c.geometry!==tt.id||c.program!==$.id||c.wireframe!==et)&&(c.geometry=tt.id,c.program=$.id,c.wireframe=et,st=!0)}it!==null&&e.update(it,i.ELEMENT_ARRAY_BUFFER),(st||h)&&(h=!1,k(U,H,$,tt),it!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(it).buffer))}function d(){return n.isWebGL2?i.createVertexArray():a.createVertexArrayOES()}function f(U){return n.isWebGL2?i.bindVertexArray(U):a.bindVertexArrayOES(U)}function g(U){return n.isWebGL2?i.deleteVertexArray(U):a.deleteVertexArrayOES(U)}function _(U,H,$){const tt=$.wireframe===!0;let it=r[U.id];it===void 0&&(it={},r[U.id]=it);let st=it[H.id];st===void 0&&(st={},it[H.id]=st);let et=st[tt];return et===void 0&&(et=m(d()),st[tt]=et),et}function m(U){const H=[],$=[],tt=[];for(let it=0;it<s;it++)H[it]=0,$[it]=0,tt[it]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:H,enabledAttributes:$,attributeDivisors:tt,object:U,attributes:{},index:null}}function p(U,H,$,tt){const it=c.attributes,st=H.attributes;let et=0;const at=$.getAttributes();for(const z in at)if(at[z].location>=0){const V=it[z];let nt=st[z];if(nt===void 0&&(z==="instanceMatrix"&&U.instanceMatrix&&(nt=U.instanceMatrix),z==="instanceColor"&&U.instanceColor&&(nt=U.instanceColor)),V===void 0||V.attribute!==nt||nt&&V.data!==nt.data)return!0;et++}return c.attributesNum!==et||c.index!==tt}function y(U,H,$,tt){const it={},st=H.attributes;let et=0;const at=$.getAttributes();for(const z in at)if(at[z].location>=0){let V=st[z];V===void 0&&(z==="instanceMatrix"&&U.instanceMatrix&&(V=U.instanceMatrix),z==="instanceColor"&&U.instanceColor&&(V=U.instanceColor));const nt={};nt.attribute=V,V&&V.data&&(nt.data=V.data),it[z]=nt,et++}c.attributes=it,c.attributesNum=et,c.index=tt}function v(){const U=c.newAttributes;for(let H=0,$=U.length;H<$;H++)U[H]=0}function M(U){I(U,0)}function I(U,H){const $=c.newAttributes,tt=c.enabledAttributes,it=c.attributeDivisors;$[U]=1,tt[U]===0&&(i.enableVertexAttribArray(U),tt[U]=1),it[U]!==H&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](U,H),it[U]=H)}function C(){const U=c.newAttributes,H=c.enabledAttributes;for(let $=0,tt=H.length;$<tt;$++)H[$]!==U[$]&&(i.disableVertexAttribArray($),H[$]=0)}function b(U,H,$,tt,it,st,et){et===!0?i.vertexAttribIPointer(U,H,$,it,st):i.vertexAttribPointer(U,H,$,tt,it,st)}function k(U,H,$,tt){if(n.isWebGL2===!1&&(U.isInstancedMesh||tt.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;v();const it=tt.attributes,st=$.getAttributes(),et=H.defaultAttributeValues;for(const at in st){const z=st[at];if(z.location>=0){let N=it[at];if(N===void 0&&(at==="instanceMatrix"&&U.instanceMatrix&&(N=U.instanceMatrix),at==="instanceColor"&&U.instanceColor&&(N=U.instanceColor)),N!==void 0){const V=N.normalized,nt=N.itemSize,rt=e.get(N);if(rt===void 0)continue;const ut=rt.buffer,Mt=rt.type,St=rt.bytesPerElement,yt=n.isWebGL2===!0&&(Mt===i.INT||Mt===i.UNSIGNED_INT||N.gpuType===bl);if(N.isInterleavedBufferAttribute){const dt=N.data,W=dt.stride,Ot=N.offset;if(dt.isInstancedInterleavedBuffer){for(let O=0;O<z.locationSize;O++)I(z.location+O,dt.meshPerAttribute);U.isInstancedMesh!==!0&&tt._maxInstanceCount===void 0&&(tt._maxInstanceCount=dt.meshPerAttribute*dt.count)}else for(let O=0;O<z.locationSize;O++)M(z.location+O);i.bindBuffer(i.ARRAY_BUFFER,ut);for(let O=0;O<z.locationSize;O++)b(z.location+O,nt/z.locationSize,Mt,V,W*St,(Ot+nt/z.locationSize*O)*St,yt)}else{if(N.isInstancedBufferAttribute){for(let dt=0;dt<z.locationSize;dt++)I(z.location+dt,N.meshPerAttribute);U.isInstancedMesh!==!0&&tt._maxInstanceCount===void 0&&(tt._maxInstanceCount=N.meshPerAttribute*N.count)}else for(let dt=0;dt<z.locationSize;dt++)M(z.location+dt);i.bindBuffer(i.ARRAY_BUFFER,ut);for(let dt=0;dt<z.locationSize;dt++)b(z.location+dt,nt/z.locationSize,Mt,V,nt*St,nt/z.locationSize*dt*St,yt)}}else if(et!==void 0){const V=et[at];if(V!==void 0)switch(V.length){case 2:i.vertexAttrib2fv(z.location,V);break;case 3:i.vertexAttrib3fv(z.location,V);break;case 4:i.vertexAttrib4fv(z.location,V);break;default:i.vertexAttrib1fv(z.location,V)}}}}C()}function x(){R();for(const U in r){const H=r[U];for(const $ in H){const tt=H[$];for(const it in tt)g(tt[it].object),delete tt[it];delete H[$]}delete r[U]}}function T(U){if(r[U.id]===void 0)return;const H=r[U.id];for(const $ in H){const tt=H[$];for(const it in tt)g(tt[it].object),delete tt[it];delete H[$]}delete r[U.id]}function E(U){for(const H in r){const $=r[H];if($[U.id]===void 0)continue;const tt=$[U.id];for(const it in tt)g(tt[it].object),delete tt[it];delete $[U.id]}}function R(){B(),h=!0,c!==l&&(c=l,f(c.object))}function B(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:R,resetDefaultState:B,dispose:x,releaseStatesOfGeometry:T,releaseStatesOfProgram:E,initAttributes:v,enableAttribute:M,disableUnusedAttributes:C}}function Vf(i,t,e,n){const s=n.isWebGL2;let a;function o(h){a=h}function r(h,u){i.drawArrays(a,h,u),e.update(u,a,1)}function l(h,u,d){if(d===0)return;let f,g;if(s)f=i,g="drawArraysInstanced";else if(f=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[g](a,h,u,d),e.update(u,a,d)}function c(h,u,d){if(d===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<d;g++)this.render(h[g],u[g]);else{f.multiDrawArraysWEBGL(a,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=u[_];e.update(g,a,1)}}this.setMode=o,this.render=r,this.renderInstances=l,this.renderMultiDraw=c}function Wf(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const b=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(b.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function a(b){if(b==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";b="mediump"}return b==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let r=e.precision!==void 0?e.precision:"highp";const l=a(r);l!==r&&(console.warn("THREE.WebGLRenderer:",r,"not supported, using",l,"instead."),r=l);const c=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),_=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),p=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),v=d>0,M=o||t.has("OES_texture_float"),I=v&&M,C=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:s,getMaxPrecision:a,precision:r,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:f,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:y,vertexTextures:v,floatFragmentTextures:M,floatVertexTextures:I,maxSamples:C}}function Xf(i){const t=this;let e=null,n=0,s=!1,a=!1;const o=new Fn,r=new Yt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||a&&!m)a?h(null):c();else{const y=a?0:n,v=y*4;let M=p.clippingState||null;l.value=M,M=h(g,d,v,f);for(let I=0;I!==v;++I)M[I]=e[I];p.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const p=f+_*4,y=d.matrixWorldInverse;r.getNormalMatrix(y),(m===null||m.length<p)&&(m=new Float32Array(p));for(let v=0,M=f;v!==_;++v,M+=4)o.copy(u[v]).applyMatrix4(y,r),o.normal.toArray(m,M),m[M+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function qf(i){let t=new WeakMap;function e(o,r){return r===Ka?o.mapping=Oi:r===Qa&&(o.mapping=zi),o}function n(o){if(o&&o.isTexture){const r=o.mapping;if(r===Ka||r===Qa)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new iu(l.height/2);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const r=o.target;r.removeEventListener("dispose",s);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function a(){t=new WeakMap}return{get:n,dispose:a}}class Wl extends Hl{constructor(t=-1,e=1,n=1,s=-1,a=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=a,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,a,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=n-t,o=n+t,r=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,o=a+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(a,o,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Li=4,Uo=[.125,.215,.35,.446,.526,.582],ei=20,Na=new Wl,Io=new kt;let Fa=null,Oa=0,za=0;const Qn=(1+Math.sqrt(5))/2,Ri=1/Qn,No=[new L(1,1,1),new L(-1,1,1),new L(1,1,-1),new L(-1,1,-1),new L(0,Qn,Ri),new L(0,Qn,-Ri),new L(Ri,0,Qn),new L(-Ri,0,Qn),new L(Qn,Ri,0),new L(-Qn,Ri,0)];class Fo{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Fa=this._renderer.getRenderTarget(),Oa=this._renderer.getActiveCubeFace(),za=this._renderer.getActiveMipmapLevel(),this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(t,n,s,a),e>0&&this._blur(a,0,0,e),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Bo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=zo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Fa,Oa,za),t.scissorTest=!1,Ns(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Oi||t.mapping===zi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Fa=this._renderer.getRenderTarget(),Oa=this._renderer.getActiveCubeFace(),za=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Je,minFilter:Je,generateMipmaps:!1,type:is,format:an,colorSpace:Cn,depthBuffer:!1},s=Oo(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Oo(t,e,n);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=$f(a)),this._blurMaterial=Yf(a,t,e)}return s}_compileMaterial(t){const e=new P(this._lodPlanes[0],t);this._renderer.compile(e,Na)}_sceneToCubeUV(t,e,n,s){const r=new sn(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Io),h.toneMapping=kn,h.autoClear=!1;const f=new ie({name:"PMREM.Background",side:Ve,depthWrite:!1,depthTest:!1}),g=new P(new Q,f);let _=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,_=!0):(f.color.copy(Io),_=!0);for(let p=0;p<6;p++){const y=p%3;y===0?(r.up.set(0,l[p],0),r.lookAt(c[p],0,0)):y===1?(r.up.set(0,0,l[p]),r.lookAt(0,c[p],0)):(r.up.set(0,l[p],0),r.lookAt(0,0,c[p]));const v=this._cubeSize;Ns(s,y*v,p>2?v:0,v,v),h.setRenderTarget(s),_&&h.render(g,r),h.render(t,r)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Oi||t.mapping===zi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Bo()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=zo());const a=s?this._cubemapMaterial:this._equirectMaterial,o=new P(this._lodPlanes[0],a),r=a.uniforms;r.envMap.value=t;const l=this._cubeSize;Ns(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Na)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=No[(s-1)%No.length];this._blur(t,s-1,s,a,o)}e.autoClear=n}_blur(t,e,n,s,a){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",a),this._halfBlur(o,t,n,n,s,"longitudinal",a)}_halfBlur(t,e,n,s,a,o,r){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new P(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(a)?Math.PI/(2*f):2*Math.PI/(2*ei-1),_=a/g,m=isFinite(a)?1+Math.floor(h*_):ei;m>ei&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ei}`);const p=[];let y=0;for(let b=0;b<ei;++b){const k=b/_,x=Math.exp(-k*k/2);p.push(x),b===0?y+=x:b<m&&(y+=2*x)}for(let b=0;b<p.length;b++)p[b]=p[b]/y;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:v}=this;d.dTheta.value=g,d.mipInt.value=v-n;const M=this._sizeLods[s],I=3*M*(s>v-Li?s-v+Li:0),C=4*(this._cubeSize-M);Ns(e,I,C,3*M,2*M),l.setRenderTarget(e),l.render(u,Na)}}function $f(i){const t=[],e=[],n=[];let s=i;const a=i-Li+1+Uo.length;for(let o=0;o<a;o++){const r=Math.pow(2,s);e.push(r);let l=1/r;o>i-Li?l=Uo[o-i+Li-1]:o===0&&(l=0),n.push(l);const c=1/(r-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,m=2,p=1,y=new Float32Array(_*g*f),v=new Float32Array(m*g*f),M=new Float32Array(p*g*f);for(let C=0;C<f;C++){const b=C%3*2/3-1,k=C>2?0:-1,x=[b,k,0,b+2/3,k,0,b+2/3,k+1,0,b,k,0,b+2/3,k+1,0,b,k+1,0];y.set(x,_*g*C),v.set(d,m*g*C);const T=[C,C,C,C,C,C];M.set(T,p*g*C)}const I=new Ae;I.setAttribute("position",new fn(y,_)),I.setAttribute("uv",new fn(v,m)),I.setAttribute("faceIndex",new fn(M,p)),t.push(I),s>Li&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Oo(i,t,e){const n=new ri(i,t,e);return n.texture.mapping=ta,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ns(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Yf(i,t,e){const n=new Float32Array(ei),s=new L(0,1,0);return new oi({name:"SphericalGaussianBlur",defines:{n:ei,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Mr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function zo(){return new oi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Mr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function Bo(){return new oi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Mr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function Mr(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function jf(i){let t=new WeakMap,e=null;function n(r){if(r&&r.isTexture){const l=r.mapping,c=l===Ka||l===Qa,h=l===Oi||l===zi;if(c||h)if(r.isRenderTargetTexture&&r.needsPMREMUpdate===!0){r.needsPMREMUpdate=!1;let u=t.get(r);return e===null&&(e=new Fo(i)),u=c?e.fromEquirectangular(r,u):e.fromCubemap(r,u),t.set(r,u),u.texture}else{if(t.has(r))return t.get(r).texture;{const u=r.image;if(c&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new Fo(i));const d=c?e.fromEquirectangular(r):e.fromCubemap(r);return t.set(r,d),r.addEventListener("dispose",a),d.texture}else return null}}}return r}function s(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function a(r){const l=r.target;l.removeEventListener("dispose",a);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Zf(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Jf(i,t,e,n){const s={},a=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const _=d.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}d.removeEventListener("dispose",o),delete s[d.id];const f=a.get(d);f&&(t.remove(f),a.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const g in d)t.update(d[g],i.ARRAY_BUFFER);const f=u.morphAttributes;for(const g in f){const _=f[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],i.ARRAY_BUFFER)}}function c(u){const d=[],f=u.index,g=u.attributes.position;let _=0;if(f!==null){const y=f.array;_=f.version;for(let v=0,M=y.length;v<M;v+=3){const I=y[v+0],C=y[v+1],b=y[v+2];d.push(I,C,C,b,b,I)}}else if(g!==void 0){const y=g.array;_=g.version;for(let v=0,M=y.length/3-1;v<M;v+=3){const I=v+0,C=v+1,b=v+2;d.push(I,C,C,b,b,I)}}else return;const m=new(Ul(d)?Bl:zl)(d,1);m.version=_;const p=a.get(u);p&&t.remove(p),a.set(u,m)}function h(u){const d=a.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return a.get(u)}return{get:r,update:l,getWireframeAttribute:h}}function Kf(i,t,e,n){const s=n.isWebGL2;let a;function o(f){a=f}let r,l;function c(f){r=f.type,l=f.bytesPerElement}function h(f,g){i.drawElements(a,g,r,f*l),e.update(g,a,1)}function u(f,g,_){if(_===0)return;let m,p;if(s)m=i,p="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](a,g,r,f*l,_),e.update(g,a,_)}function d(f,g,_){if(_===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<_;p++)this.render(f[p]/l,g[p]);else{m.multiDrawElementsWEBGL(a,g,0,r,f,0,_);let p=0;for(let y=0;y<_;y++)p+=g[y];e.update(p,a,1)}}this.setMode=o,this.setIndex=c,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function Qf(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,o,r){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=r*(a/3);break;case i.LINES:e.lines+=r*(a/2);break;case i.LINE_STRIP:e.lines+=r*(a-1);break;case i.LINE_LOOP:e.lines+=r*a;break;case i.POINTS:e.points+=r*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function tp(i,t){return i[0]-t[0]}function ep(i,t){return Math.abs(t[1])-Math.abs(i[1])}function np(i,t,e){const n={},s=new Float32Array(8),a=new WeakMap,o=new Ee,r=[];for(let c=0;c<8;c++)r[c]=[c,0];function l(c,h,u){const d=c.morphTargetInfluences;if(t.isWebGL2===!0){const g=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,_=g!==void 0?g.length:0;let m=a.get(h);if(m===void 0||m.count!==_){let H=function(){B.dispose(),a.delete(h),h.removeEventListener("dispose",H)};var f=H;m!==void 0&&m.texture.dispose();const v=h.morphAttributes.position!==void 0,M=h.morphAttributes.normal!==void 0,I=h.morphAttributes.color!==void 0,C=h.morphAttributes.position||[],b=h.morphAttributes.normal||[],k=h.morphAttributes.color||[];let x=0;v===!0&&(x=1),M===!0&&(x=2),I===!0&&(x=3);let T=h.attributes.position.count*x,E=1;T>t.maxTextureSize&&(E=Math.ceil(T/t.maxTextureSize),T=t.maxTextureSize);const R=new Float32Array(T*E*4*_),B=new Fl(R,T,E,_);B.type=zn,B.needsUpdate=!0;const U=x*4;for(let $=0;$<_;$++){const tt=C[$],it=b[$],st=k[$],et=T*E*4*$;for(let at=0;at<tt.count;at++){const z=at*U;v===!0&&(o.fromBufferAttribute(tt,at),R[et+z+0]=o.x,R[et+z+1]=o.y,R[et+z+2]=o.z,R[et+z+3]=0),M===!0&&(o.fromBufferAttribute(it,at),R[et+z+4]=o.x,R[et+z+5]=o.y,R[et+z+6]=o.z,R[et+z+7]=0),I===!0&&(o.fromBufferAttribute(st,at),R[et+z+8]=o.x,R[et+z+9]=o.y,R[et+z+10]=o.z,R[et+z+11]=st.itemSize===4?o.w:1)}}m={count:_,texture:B,size:new vt(T,E)},a.set(h,m),h.addEventListener("dispose",H)}let p=0;for(let v=0;v<d.length;v++)p+=d[v];const y=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(i,"morphTargetBaseInfluence",y),u.getUniforms().setValue(i,"morphTargetInfluences",d),u.getUniforms().setValue(i,"morphTargetsTexture",m.texture,e),u.getUniforms().setValue(i,"morphTargetsTextureSize",m.size)}else{const g=d===void 0?0:d.length;let _=n[h.id];if(_===void 0||_.length!==g){_=[];for(let M=0;M<g;M++)_[M]=[M,0];n[h.id]=_}for(let M=0;M<g;M++){const I=_[M];I[0]=M,I[1]=d[M]}_.sort(ep);for(let M=0;M<8;M++)M<g&&_[M][1]?(r[M][0]=_[M][0],r[M][1]=_[M][1]):(r[M][0]=Number.MAX_SAFE_INTEGER,r[M][1]=0);r.sort(tp);const m=h.morphAttributes.position,p=h.morphAttributes.normal;let y=0;for(let M=0;M<8;M++){const I=r[M],C=I[0],b=I[1];C!==Number.MAX_SAFE_INTEGER&&b?(m&&h.getAttribute("morphTarget"+M)!==m[C]&&h.setAttribute("morphTarget"+M,m[C]),p&&h.getAttribute("morphNormal"+M)!==p[C]&&h.setAttribute("morphNormal"+M,p[C]),s[M]=b,y+=b):(m&&h.hasAttribute("morphTarget"+M)===!0&&h.deleteAttribute("morphTarget"+M),p&&h.hasAttribute("morphNormal"+M)===!0&&h.deleteAttribute("morphNormal"+M),s[M]=0)}const v=h.morphTargetsRelative?1:1-y;u.getUniforms().setValue(i,"morphTargetBaseInfluence",v),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:l}}function ip(i,t,e,n){let s=new WeakMap;function a(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function o(){s=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:a,dispose:o}}class Xl extends Xe{constructor(t,e,n,s,a,o,r,l,c,h){if(h=h!==void 0?h:si,h!==si&&h!==Bi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===si&&(n=On),n===void 0&&h===Bi&&(n=ii),super(null,s,a,o,r,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:Ce,this.minFilter=l!==void 0?l:Ce,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const ql=new Xe,$l=new Xl(1,1);$l.compareFunction=Dl;const Yl=new Fl,jl=new kh,Zl=new Gl,ko=[],Ho=[],Go=new Float32Array(16),Vo=new Float32Array(9),Wo=new Float32Array(4);function Gi(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let a=ko[s];if(a===void 0&&(a=new Float32Array(s),ko[s]=a),t!==0){n.toArray(a,0);for(let o=1,r=0;o!==t;++o)r+=e,i[o].toArray(a,r)}return a}function ye(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Me(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function sa(i,t){let e=Ho[t];e===void 0&&(e=new Int32Array(t),Ho[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function sp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function ap(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;i.uniform2fv(this.addr,t),Me(e,t)}}function rp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ye(e,t))return;i.uniform3fv(this.addr,t),Me(e,t)}}function op(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;i.uniform4fv(this.addr,t),Me(e,t)}}function lp(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ye(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Me(e,t)}else{if(ye(e,n))return;Wo.set(n),i.uniformMatrix2fv(this.addr,!1,Wo),Me(e,n)}}function cp(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ye(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Me(e,t)}else{if(ye(e,n))return;Vo.set(n),i.uniformMatrix3fv(this.addr,!1,Vo),Me(e,n)}}function hp(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ye(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Me(e,t)}else{if(ye(e,n))return;Go.set(n),i.uniformMatrix4fv(this.addr,!1,Go),Me(e,n)}}function up(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function dp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;i.uniform2iv(this.addr,t),Me(e,t)}}function fp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ye(e,t))return;i.uniform3iv(this.addr,t),Me(e,t)}}function pp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;i.uniform4iv(this.addr,t),Me(e,t)}}function mp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function gp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;i.uniform2uiv(this.addr,t),Me(e,t)}}function _p(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ye(e,t))return;i.uniform3uiv(this.addr,t),Me(e,t)}}function vp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;i.uniform4uiv(this.addr,t),Me(e,t)}}function xp(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const a=this.type===i.SAMPLER_2D_SHADOW?$l:ql;e.setTexture2D(t||a,s)}function yp(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||jl,s)}function Mp(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Zl,s)}function Sp(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Yl,s)}function Tp(i){switch(i){case 5126:return sp;case 35664:return ap;case 35665:return rp;case 35666:return op;case 35674:return lp;case 35675:return cp;case 35676:return hp;case 5124:case 35670:return up;case 35667:case 35671:return dp;case 35668:case 35672:return fp;case 35669:case 35673:return pp;case 5125:return mp;case 36294:return gp;case 36295:return _p;case 36296:return vp;case 35678:case 36198:case 36298:case 36306:case 35682:return xp;case 35679:case 36299:case 36307:return yp;case 35680:case 36300:case 36308:case 36293:return Mp;case 36289:case 36303:case 36311:case 36292:return Sp}}function bp(i,t){i.uniform1fv(this.addr,t)}function wp(i,t){const e=Gi(t,this.size,2);i.uniform2fv(this.addr,e)}function Ep(i,t){const e=Gi(t,this.size,3);i.uniform3fv(this.addr,e)}function Ap(i,t){const e=Gi(t,this.size,4);i.uniform4fv(this.addr,e)}function Rp(i,t){const e=Gi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Cp(i,t){const e=Gi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Pp(i,t){const e=Gi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Lp(i,t){i.uniform1iv(this.addr,t)}function Dp(i,t){i.uniform2iv(this.addr,t)}function Up(i,t){i.uniform3iv(this.addr,t)}function Ip(i,t){i.uniform4iv(this.addr,t)}function Np(i,t){i.uniform1uiv(this.addr,t)}function Fp(i,t){i.uniform2uiv(this.addr,t)}function Op(i,t){i.uniform3uiv(this.addr,t)}function zp(i,t){i.uniform4uiv(this.addr,t)}function Bp(i,t,e){const n=this.cache,s=t.length,a=sa(e,s);ye(n,a)||(i.uniform1iv(this.addr,a),Me(n,a));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||ql,a[o])}function kp(i,t,e){const n=this.cache,s=t.length,a=sa(e,s);ye(n,a)||(i.uniform1iv(this.addr,a),Me(n,a));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||jl,a[o])}function Hp(i,t,e){const n=this.cache,s=t.length,a=sa(e,s);ye(n,a)||(i.uniform1iv(this.addr,a),Me(n,a));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Zl,a[o])}function Gp(i,t,e){const n=this.cache,s=t.length,a=sa(e,s);ye(n,a)||(i.uniform1iv(this.addr,a),Me(n,a));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Yl,a[o])}function Vp(i){switch(i){case 5126:return bp;case 35664:return wp;case 35665:return Ep;case 35666:return Ap;case 35674:return Rp;case 35675:return Cp;case 35676:return Pp;case 5124:case 35670:return Lp;case 35667:case 35671:return Dp;case 35668:case 35672:return Up;case 35669:case 35673:return Ip;case 5125:return Np;case 36294:return Fp;case 36295:return Op;case 36296:return zp;case 35678:case 36198:case 36298:case 36306:case 35682:return Bp;case 35679:case 36299:case 36307:return kp;case 35680:case 36300:case 36308:case 36293:return Hp;case 36289:case 36303:case 36311:case 36292:return Gp}}class Wp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Tp(e.type)}}class Xp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Vp(e.type)}}class qp{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let a=0,o=s.length;a!==o;++a){const r=s[a];r.setValue(t,e[r.id],n)}}}const Ba=/(\w+)(\])?(\[|\.)?/g;function Xo(i,t){i.seq.push(t),i.map[t.id]=t}function $p(i,t,e){const n=i.name,s=n.length;for(Ba.lastIndex=0;;){const a=Ba.exec(n),o=Ba.lastIndex;let r=a[1];const l=a[2]==="]",c=a[3];if(l&&(r=r|0),c===void 0||c==="["&&o+2===s){Xo(e,c===void 0?new Wp(r,i,t):new Xp(r,i,t));break}else{let u=e.map[r];u===void 0&&(u=new qp(r),Xo(e,u)),e=u}}}class Xs{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const a=t.getActiveUniform(e,s),o=t.getUniformLocation(e,a.name);$p(a,o,this)}}setValue(t,e,n,s){const a=this.map[e];a!==void 0&&a.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let a=0,o=e.length;a!==o;++a){const r=e[a],l=n[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,a=t.length;s!==a;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function qo(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Yp=37297;let jp=0;function Zp(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let o=s;o<a;o++){const r=o+1;n.push(`${r===t?">":" "} ${r}: ${e[o]}`)}return n.join(`
`)}function Jp(i){const t=Kt.getPrimaries(Kt.workingColorSpace),e=Kt.getPrimaries(i);let n;switch(t===e?n="":t===js&&e===Ys?n="LinearDisplayP3ToLinearSRGB":t===Ys&&e===js&&(n="LinearSRGBToLinearDisplayP3"),i){case Cn:case ea:return[n,"LinearTransferOETF"];case Pe:case gr:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function $o(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+Zp(i.getShaderSource(t),o)}else return s}function Kp(i,t){const e=Jp(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Qp(i,t){let e;switch(t){case Zc:e="Linear";break;case Jc:e="Reinhard";break;case Kc:e="OptimizedCineon";break;case Qc:e="ACESFilmic";break;case eh:e="AgX";break;case th:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function tm(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Di).join(`
`)}function em(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Di).join(`
`)}function nm(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function im(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const a=i.getActiveAttrib(t,s),o=a.name;let r=1;a.type===i.FLOAT_MAT2&&(r=2),a.type===i.FLOAT_MAT3&&(r=3),a.type===i.FLOAT_MAT4&&(r=4),e[o]={type:a.type,location:i.getAttribLocation(t,o),locationSize:r}}return e}function Di(i){return i!==""}function Yo(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function jo(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const sm=/^[ \t]*#include +<([\w\d./]+)>/gm;function sr(i){return i.replace(sm,rm)}const am=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function rm(i,t){let e=Gt[t];if(e===void 0){const n=am.get(t);if(n!==void 0)e=Gt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return sr(e)}const om=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Zo(i){return i.replace(om,lm)}function lm(i,t,e,n){let s="";for(let a=parseInt(t);a<parseInt(e);a++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function Jo(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function cm(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Ml?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Sl?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===En&&(t="SHADOWMAP_TYPE_VSM"),t}function hm(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Oi:case zi:t="ENVMAP_TYPE_CUBE";break;case ta:t="ENVMAP_TYPE_CUBE_UV";break}return t}function um(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case zi:t="ENVMAP_MODE_REFRACTION";break}return t}function dm(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case fr:t="ENVMAP_BLENDING_MULTIPLY";break;case Yc:t="ENVMAP_BLENDING_MIX";break;case jc:t="ENVMAP_BLENDING_ADD";break}return t}function fm(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function pm(i,t,e,n){const s=i.getContext(),a=e.defines;let o=e.vertexShader,r=e.fragmentShader;const l=cm(e),c=hm(e),h=um(e),u=dm(e),d=fm(e),f=e.isWebGL2?"":tm(e),g=em(e),_=nm(a),m=s.createProgram();let p,y,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Di).join(`
`),p.length>0&&(p+=`
`),y=[f,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Di).join(`
`),y.length>0&&(y+=`
`)):(p=[Jo(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Di).join(`
`),y=[f,Jo(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==kn?"#define TONE_MAPPING":"",e.toneMapping!==kn?Gt.tonemapping_pars_fragment:"",e.toneMapping!==kn?Qp("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Gt.colorspace_pars_fragment,Kp("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Di).join(`
`)),o=sr(o),o=Yo(o,e),o=jo(o,e),r=sr(r),r=Yo(r,e),r=jo(r,e),o=Zo(o),r=Zo(r),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,p=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,y=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===mo?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===mo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const M=v+p+o,I=v+y+r,C=qo(s,s.VERTEX_SHADER,M),b=qo(s,s.FRAGMENT_SHADER,I);s.attachShader(m,C),s.attachShader(m,b),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function k(R){if(i.debug.checkShaderErrors){const B=s.getProgramInfoLog(m).trim(),U=s.getShaderInfoLog(C).trim(),H=s.getShaderInfoLog(b).trim();let $=!0,tt=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if($=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,C,b);else{const it=$o(s,C,"vertex"),st=$o(s,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+B+`
`+it+`
`+st)}else B!==""?console.warn("THREE.WebGLProgram: Program Info Log:",B):(U===""||H==="")&&(tt=!1);tt&&(R.diagnostics={runnable:$,programLog:B,vertexShader:{log:U,prefix:p},fragmentShader:{log:H,prefix:y}})}s.deleteShader(C),s.deleteShader(b),x=new Xs(s,m),T=im(s,m)}let x;this.getUniforms=function(){return x===void 0&&k(this),x};let T;this.getAttributes=function(){return T===void 0&&k(this),T};let E=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=s.getProgramParameter(m,Yp)),E},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=jp++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=C,this.fragmentShader=b,this}let mm=0;class gm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),a=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(a)===!1&&(o.add(a),a.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new _m(t),e.set(t,n)),n}}class _m{constructor(t){this.id=mm++,this.code=t,this.usedTimes=0}}function vm(i,t,e,n,s,a,o){const r=new xr,l=new gm,c=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(x){return x===0?"uv":`uv${x}`}function m(x,T,E,R,B){const U=R.fog,H=B.geometry,$=x.isMeshStandardMaterial?R.environment:null,tt=(x.isMeshStandardMaterial?e:t).get(x.envMap||$),it=tt&&tt.mapping===ta?tt.image.height:null,st=g[x.type];x.precision!==null&&(f=s.getMaxPrecision(x.precision),f!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",f,"instead."));const et=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,at=et!==void 0?et.length:0;let z=0;H.morphAttributes.position!==void 0&&(z=1),H.morphAttributes.normal!==void 0&&(z=2),H.morphAttributes.color!==void 0&&(z=3);let N,V,nt,rt;if(st){const Fe=gn[st];N=Fe.vertexShader,V=Fe.fragmentShader}else N=x.vertexShader,V=x.fragmentShader,l.update(x),nt=l.getVertexShaderID(x),rt=l.getFragmentShaderID(x);const ut=i.getRenderTarget(),Mt=B.isInstancedMesh===!0,St=B.isBatchedMesh===!0,yt=!!x.map,dt=!!x.matcap,W=!!tt,Ot=!!x.aoMap,O=!!x.lightMap,q=!!x.bumpMap,G=!!x.normalMap,D=!!x.displacementMap,Nt=!!x.emissiveMap,A=!!x.metalnessMap,S=!!x.roughnessMap,Y=x.anisotropy>0,ct=x.clearcoat>0,lt=x.iridescence>0,ht=x.sheen>0,Et=x.transmission>0,_t=Y&&!!x.anisotropyMap,Tt=ct&&!!x.clearcoatMap,Dt=ct&&!!x.clearcoatNormalMap,Wt=ct&&!!x.clearcoatRoughnessMap,ot=lt&&!!x.iridescenceMap,Jt=lt&&!!x.iridescenceThicknessMap,jt=ht&&!!x.sheenColorMap,Ft=ht&&!!x.sheenRoughnessMap,Rt=!!x.specularMap,bt=!!x.specularColorMap,Ht=!!x.specularIntensityMap,Zt=Et&&!!x.transmissionMap,he=Et&&!!x.thicknessMap,qt=!!x.gradientMap,ft=!!x.alphaMap,F=x.alphaTest>0,mt=!!x.alphaHash,gt=!!x.extensions,Ut=!!H.attributes.uv1,Ct=!!H.attributes.uv2,te=!!H.attributes.uv3;let ee=kn;return x.toneMapped&&(ut===null||ut.isXRRenderTarget===!0)&&(ee=i.toneMapping),{isWebGL2:h,shaderID:st,shaderType:x.type,shaderName:x.name,vertexShader:N,fragmentShader:V,defines:x.defines,customVertexShaderID:nt,customFragmentShaderID:rt,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:f,batching:St,instancing:Mt,instancingColor:Mt&&B.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:ut===null?i.outputColorSpace:ut.isXRRenderTarget===!0?ut.texture.colorSpace:Cn,map:yt,matcap:dt,envMap:W,envMapMode:W&&tt.mapping,envMapCubeUVHeight:it,aoMap:Ot,lightMap:O,bumpMap:q,normalMap:G,displacementMap:d&&D,emissiveMap:Nt,normalMapObjectSpace:G&&x.normalMapType===fh,normalMapTangentSpace:G&&x.normalMapType===mr,metalnessMap:A,roughnessMap:S,anisotropy:Y,anisotropyMap:_t,clearcoat:ct,clearcoatMap:Tt,clearcoatNormalMap:Dt,clearcoatRoughnessMap:Wt,iridescence:lt,iridescenceMap:ot,iridescenceThicknessMap:Jt,sheen:ht,sheenColorMap:jt,sheenRoughnessMap:Ft,specularMap:Rt,specularColorMap:bt,specularIntensityMap:Ht,transmission:Et,transmissionMap:Zt,thicknessMap:he,gradientMap:qt,opaque:x.transparent===!1&&x.blending===Ii,alphaMap:ft,alphaTest:F,alphaHash:mt,combine:x.combine,mapUv:yt&&_(x.map.channel),aoMapUv:Ot&&_(x.aoMap.channel),lightMapUv:O&&_(x.lightMap.channel),bumpMapUv:q&&_(x.bumpMap.channel),normalMapUv:G&&_(x.normalMap.channel),displacementMapUv:D&&_(x.displacementMap.channel),emissiveMapUv:Nt&&_(x.emissiveMap.channel),metalnessMapUv:A&&_(x.metalnessMap.channel),roughnessMapUv:S&&_(x.roughnessMap.channel),anisotropyMapUv:_t&&_(x.anisotropyMap.channel),clearcoatMapUv:Tt&&_(x.clearcoatMap.channel),clearcoatNormalMapUv:Dt&&_(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Wt&&_(x.clearcoatRoughnessMap.channel),iridescenceMapUv:ot&&_(x.iridescenceMap.channel),iridescenceThicknessMapUv:Jt&&_(x.iridescenceThicknessMap.channel),sheenColorMapUv:jt&&_(x.sheenColorMap.channel),sheenRoughnessMapUv:Ft&&_(x.sheenRoughnessMap.channel),specularMapUv:Rt&&_(x.specularMap.channel),specularColorMapUv:bt&&_(x.specularColorMap.channel),specularIntensityMapUv:Ht&&_(x.specularIntensityMap.channel),transmissionMapUv:Zt&&_(x.transmissionMap.channel),thicknessMapUv:he&&_(x.thicknessMap.channel),alphaMapUv:ft&&_(x.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(G||Y),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,vertexUv1s:Ut,vertexUv2s:Ct,vertexUv3s:te,pointsUvs:B.isPoints===!0&&!!H.attributes.uv&&(yt||ft),fog:!!U,useFog:x.fog===!0,fogExp2:U&&U.isFogExp2,flatShading:x.flatShading===!0,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:B.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:at,morphTextureStride:z,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&E.length>0,shadowMapType:i.shadowMap.type,toneMapping:ee,useLegacyLights:i._useLegacyLights,decodeVideoTexture:yt&&x.map.isVideoTexture===!0&&Kt.getTransfer(x.map.colorSpace)===se,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===pe,flipSided:x.side===Ve,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionDerivatives:gt&&x.extensions.derivatives===!0,extensionFragDepth:gt&&x.extensions.fragDepth===!0,extensionDrawBuffers:gt&&x.extensions.drawBuffers===!0,extensionShaderTextureLOD:gt&&x.extensions.shaderTextureLOD===!0,extensionClipCullDistance:gt&&x.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()}}function p(x){const T=[];if(x.shaderID?T.push(x.shaderID):(T.push(x.customVertexShaderID),T.push(x.customFragmentShaderID)),x.defines!==void 0)for(const E in x.defines)T.push(E),T.push(x.defines[E]);return x.isRawShaderMaterial===!1&&(y(T,x),v(T,x),T.push(i.outputColorSpace)),T.push(x.customProgramCacheKey),T.join()}function y(x,T){x.push(T.precision),x.push(T.outputColorSpace),x.push(T.envMapMode),x.push(T.envMapCubeUVHeight),x.push(T.mapUv),x.push(T.alphaMapUv),x.push(T.lightMapUv),x.push(T.aoMapUv),x.push(T.bumpMapUv),x.push(T.normalMapUv),x.push(T.displacementMapUv),x.push(T.emissiveMapUv),x.push(T.metalnessMapUv),x.push(T.roughnessMapUv),x.push(T.anisotropyMapUv),x.push(T.clearcoatMapUv),x.push(T.clearcoatNormalMapUv),x.push(T.clearcoatRoughnessMapUv),x.push(T.iridescenceMapUv),x.push(T.iridescenceThicknessMapUv),x.push(T.sheenColorMapUv),x.push(T.sheenRoughnessMapUv),x.push(T.specularMapUv),x.push(T.specularColorMapUv),x.push(T.specularIntensityMapUv),x.push(T.transmissionMapUv),x.push(T.thicknessMapUv),x.push(T.combine),x.push(T.fogExp2),x.push(T.sizeAttenuation),x.push(T.morphTargetsCount),x.push(T.morphAttributeCount),x.push(T.numDirLights),x.push(T.numPointLights),x.push(T.numSpotLights),x.push(T.numSpotLightMaps),x.push(T.numHemiLights),x.push(T.numRectAreaLights),x.push(T.numDirLightShadows),x.push(T.numPointLightShadows),x.push(T.numSpotLightShadows),x.push(T.numSpotLightShadowsWithMaps),x.push(T.numLightProbes),x.push(T.shadowMapType),x.push(T.toneMapping),x.push(T.numClippingPlanes),x.push(T.numClipIntersection),x.push(T.depthPacking)}function v(x,T){r.disableAll(),T.isWebGL2&&r.enable(0),T.supportsVertexTextures&&r.enable(1),T.instancing&&r.enable(2),T.instancingColor&&r.enable(3),T.matcap&&r.enable(4),T.envMap&&r.enable(5),T.normalMapObjectSpace&&r.enable(6),T.normalMapTangentSpace&&r.enable(7),T.clearcoat&&r.enable(8),T.iridescence&&r.enable(9),T.alphaTest&&r.enable(10),T.vertexColors&&r.enable(11),T.vertexAlphas&&r.enable(12),T.vertexUv1s&&r.enable(13),T.vertexUv2s&&r.enable(14),T.vertexUv3s&&r.enable(15),T.vertexTangents&&r.enable(16),T.anisotropy&&r.enable(17),T.alphaHash&&r.enable(18),T.batching&&r.enable(19),x.push(r.mask),r.disableAll(),T.fog&&r.enable(0),T.useFog&&r.enable(1),T.flatShading&&r.enable(2),T.logarithmicDepthBuffer&&r.enable(3),T.skinning&&r.enable(4),T.morphTargets&&r.enable(5),T.morphNormals&&r.enable(6),T.morphColors&&r.enable(7),T.premultipliedAlpha&&r.enable(8),T.shadowMapEnabled&&r.enable(9),T.useLegacyLights&&r.enable(10),T.doubleSided&&r.enable(11),T.flipSided&&r.enable(12),T.useDepthPacking&&r.enable(13),T.dithering&&r.enable(14),T.transmission&&r.enable(15),T.sheen&&r.enable(16),T.opaque&&r.enable(17),T.pointsUvs&&r.enable(18),T.decodeVideoTexture&&r.enable(19),x.push(r.mask)}function M(x){const T=g[x.type];let E;if(T){const R=gn[T];E=Qh.clone(R.uniforms)}else E=x.uniforms;return E}function I(x,T){let E;for(let R=0,B=c.length;R<B;R++){const U=c[R];if(U.cacheKey===T){E=U,++E.usedTimes;break}}return E===void 0&&(E=new pm(i,T,x,a),c.push(E)),E}function C(x){if(--x.usedTimes===0){const T=c.indexOf(x);c[T]=c[c.length-1],c.pop(),x.destroy()}}function b(x){l.remove(x)}function k(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:M,acquireProgram:I,releaseProgram:C,releaseShaderCache:b,programs:c,dispose:k}}function xm(){let i=new WeakMap;function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function e(a){i.delete(a)}function n(a,o,r){i.get(a)[o]=r}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function ym(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Ko(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Qo(){const i=[];let t=0;const e=[],n=[],s=[];function a(){t=0,e.length=0,n.length=0,s.length=0}function o(u,d,f,g,_,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function r(u,d,f,g,_,m){const p=o(u,d,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function l(u,d,f,g,_,m){const p=o(u,d,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||ym),n.length>1&&n.sort(d||Ko),s.length>1&&s.sort(d||Ko)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:a,push:r,unshift:l,finish:h,sort:c}}function Mm(){let i=new WeakMap;function t(n,s){const a=i.get(n);let o;return a===void 0?(o=new Qo,i.set(n,[o])):s>=a.length?(o=new Qo,a.push(o)):o=a[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Sm(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new L,color:new kt};break;case"SpotLight":e={position:new L,direction:new L,color:new kt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new kt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new kt,groundColor:new kt};break;case"RectAreaLight":e={color:new kt,position:new L,halfWidth:new L,halfHeight:new L};break}return i[t.id]=e,e}}}function Tm(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let bm=0;function wm(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Em(i,t){const e=new Sm,n=Tm(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new L);const a=new L,o=new me,r=new me;function l(h,u){let d=0,f=0,g=0;for(let R=0;R<9;R++)s.probe[R].set(0,0,0);let _=0,m=0,p=0,y=0,v=0,M=0,I=0,C=0,b=0,k=0,x=0;h.sort(wm);const T=u===!0?Math.PI:1;for(let R=0,B=h.length;R<B;R++){const U=h[R],H=U.color,$=U.intensity,tt=U.distance,it=U.shadow&&U.shadow.map?U.shadow.map.texture:null;if(U.isAmbientLight)d+=H.r*$*T,f+=H.g*$*T,g+=H.b*$*T;else if(U.isLightProbe){for(let st=0;st<9;st++)s.probe[st].addScaledVector(U.sh.coefficients[st],$);x++}else if(U.isDirectionalLight){const st=e.get(U);if(st.color.copy(U.color).multiplyScalar(U.intensity*T),U.castShadow){const et=U.shadow,at=n.get(U);at.shadowBias=et.bias,at.shadowNormalBias=et.normalBias,at.shadowRadius=et.radius,at.shadowMapSize=et.mapSize,s.directionalShadow[_]=at,s.directionalShadowMap[_]=it,s.directionalShadowMatrix[_]=U.shadow.matrix,M++}s.directional[_]=st,_++}else if(U.isSpotLight){const st=e.get(U);st.position.setFromMatrixPosition(U.matrixWorld),st.color.copy(H).multiplyScalar($*T),st.distance=tt,st.coneCos=Math.cos(U.angle),st.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),st.decay=U.decay,s.spot[p]=st;const et=U.shadow;if(U.map&&(s.spotLightMap[b]=U.map,b++,et.updateMatrices(U),U.castShadow&&k++),s.spotLightMatrix[p]=et.matrix,U.castShadow){const at=n.get(U);at.shadowBias=et.bias,at.shadowNormalBias=et.normalBias,at.shadowRadius=et.radius,at.shadowMapSize=et.mapSize,s.spotShadow[p]=at,s.spotShadowMap[p]=it,C++}p++}else if(U.isRectAreaLight){const st=e.get(U);st.color.copy(H).multiplyScalar($),st.halfWidth.set(U.width*.5,0,0),st.halfHeight.set(0,U.height*.5,0),s.rectArea[y]=st,y++}else if(U.isPointLight){const st=e.get(U);if(st.color.copy(U.color).multiplyScalar(U.intensity*T),st.distance=U.distance,st.decay=U.decay,U.castShadow){const et=U.shadow,at=n.get(U);at.shadowBias=et.bias,at.shadowNormalBias=et.normalBias,at.shadowRadius=et.radius,at.shadowMapSize=et.mapSize,at.shadowCameraNear=et.camera.near,at.shadowCameraFar=et.camera.far,s.pointShadow[m]=at,s.pointShadowMap[m]=it,s.pointShadowMatrix[m]=U.shadow.matrix,I++}s.point[m]=st,m++}else if(U.isHemisphereLight){const st=e.get(U);st.skyColor.copy(U.color).multiplyScalar($*T),st.groundColor.copy(U.groundColor).multiplyScalar($*T),s.hemi[v]=st,v++}}y>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=pt.LTC_FLOAT_1,s.rectAreaLTC2=pt.LTC_FLOAT_2):(s.rectAreaLTC1=pt.LTC_HALF_1,s.rectAreaLTC2=pt.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=pt.LTC_FLOAT_1,s.rectAreaLTC2=pt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=pt.LTC_HALF_1,s.rectAreaLTC2=pt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=d,s.ambient[1]=f,s.ambient[2]=g;const E=s.hash;(E.directionalLength!==_||E.pointLength!==m||E.spotLength!==p||E.rectAreaLength!==y||E.hemiLength!==v||E.numDirectionalShadows!==M||E.numPointShadows!==I||E.numSpotShadows!==C||E.numSpotMaps!==b||E.numLightProbes!==x)&&(s.directional.length=_,s.spot.length=p,s.rectArea.length=y,s.point.length=m,s.hemi.length=v,s.directionalShadow.length=M,s.directionalShadowMap.length=M,s.pointShadow.length=I,s.pointShadowMap.length=I,s.spotShadow.length=C,s.spotShadowMap.length=C,s.directionalShadowMatrix.length=M,s.pointShadowMatrix.length=I,s.spotLightMatrix.length=C+b-k,s.spotLightMap.length=b,s.numSpotLightShadowsWithMaps=k,s.numLightProbes=x,E.directionalLength=_,E.pointLength=m,E.spotLength=p,E.rectAreaLength=y,E.hemiLength=v,E.numDirectionalShadows=M,E.numPointShadows=I,E.numSpotShadows=C,E.numSpotMaps=b,E.numLightProbes=x,s.version=bm++)}function c(h,u){let d=0,f=0,g=0,_=0,m=0;const p=u.matrixWorldInverse;for(let y=0,v=h.length;y<v;y++){const M=h[y];if(M.isDirectionalLight){const I=s.directional[d];I.direction.setFromMatrixPosition(M.matrixWorld),a.setFromMatrixPosition(M.target.matrixWorld),I.direction.sub(a),I.direction.transformDirection(p),d++}else if(M.isSpotLight){const I=s.spot[g];I.position.setFromMatrixPosition(M.matrixWorld),I.position.applyMatrix4(p),I.direction.setFromMatrixPosition(M.matrixWorld),a.setFromMatrixPosition(M.target.matrixWorld),I.direction.sub(a),I.direction.transformDirection(p),g++}else if(M.isRectAreaLight){const I=s.rectArea[_];I.position.setFromMatrixPosition(M.matrixWorld),I.position.applyMatrix4(p),r.identity(),o.copy(M.matrixWorld),o.premultiply(p),r.extractRotation(o),I.halfWidth.set(M.width*.5,0,0),I.halfHeight.set(0,M.height*.5,0),I.halfWidth.applyMatrix4(r),I.halfHeight.applyMatrix4(r),_++}else if(M.isPointLight){const I=s.point[f];I.position.setFromMatrixPosition(M.matrixWorld),I.position.applyMatrix4(p),f++}else if(M.isHemisphereLight){const I=s.hemi[m];I.direction.setFromMatrixPosition(M.matrixWorld),I.direction.transformDirection(p),m++}}}return{setup:l,setupView:c,state:s}}function tl(i,t){const e=new Em(i,t),n=[],s=[];function a(){n.length=0,s.length=0}function o(u){n.push(u)}function r(u){s.push(u)}function l(u){e.setup(n,u)}function c(u){e.setupView(n,u)}return{init:a,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:r}}function Am(i,t){let e=new WeakMap;function n(a,o=0){const r=e.get(a);let l;return r===void 0?(l=new tl(i,t),e.set(a,[l])):o>=r.length?(l=new tl(i,t),r.push(l)):l=r[o],l}function s(){e=new WeakMap}return{get:n,dispose:s}}class Rm extends ui{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=uh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Cm extends ui{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Pm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Lm=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Dm(i,t,e){let n=new yr;const s=new vt,a=new vt,o=new Ee,r=new Rm({depthPacking:dh}),l=new Cm,c={},h=e.maxTextureSize,u={[Gn]:Ve,[Ve]:Gn,[pe]:pe},d=new oi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new vt},radius:{value:4}},vertexShader:Pm,fragmentShader:Lm}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Ae;g.setAttribute("position",new fn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new P(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ml;let p=this.type;this.render=function(C,b,k){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;const x=i.getRenderTarget(),T=i.getActiveCubeFace(),E=i.getActiveMipmapLevel(),R=i.state;R.setBlending(Bn),R.buffers.color.setClear(1,1,1,1),R.buffers.depth.setTest(!0),R.setScissorTest(!1);const B=p!==En&&this.type===En,U=p===En&&this.type!==En;for(let H=0,$=C.length;H<$;H++){const tt=C[H],it=tt.shadow;if(it===void 0){console.warn("THREE.WebGLShadowMap:",tt,"has no shadow.");continue}if(it.autoUpdate===!1&&it.needsUpdate===!1)continue;s.copy(it.mapSize);const st=it.getFrameExtents();if(s.multiply(st),a.copy(it.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/st.x),s.x=a.x*st.x,it.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/st.y),s.y=a.y*st.y,it.mapSize.y=a.y)),it.map===null||B===!0||U===!0){const at=this.type!==En?{minFilter:Ce,magFilter:Ce}:{};it.map!==null&&it.map.dispose(),it.map=new ri(s.x,s.y,at),it.map.texture.name=tt.name+".shadowMap",it.camera.updateProjectionMatrix()}i.setRenderTarget(it.map),i.clear();const et=it.getViewportCount();for(let at=0;at<et;at++){const z=it.getViewport(at);o.set(a.x*z.x,a.y*z.y,a.x*z.z,a.y*z.w),R.viewport(o),it.updateMatrices(tt,at),n=it.getFrustum(),M(b,k,it.camera,tt,this.type)}it.isPointLightShadow!==!0&&this.type===En&&y(it,k),it.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(x,T,E)};function y(C,b){const k=t.update(_);d.defines.VSM_SAMPLES!==C.blurSamples&&(d.defines.VSM_SAMPLES=C.blurSamples,f.defines.VSM_SAMPLES=C.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new ri(s.x,s.y)),d.uniforms.shadow_pass.value=C.map.texture,d.uniforms.resolution.value=C.mapSize,d.uniforms.radius.value=C.radius,i.setRenderTarget(C.mapPass),i.clear(),i.renderBufferDirect(b,null,k,d,_,null),f.uniforms.shadow_pass.value=C.mapPass.texture,f.uniforms.resolution.value=C.mapSize,f.uniforms.radius.value=C.radius,i.setRenderTarget(C.map),i.clear(),i.renderBufferDirect(b,null,k,f,_,null)}function v(C,b,k,x){let T=null;const E=k.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(E!==void 0)T=E;else if(T=k.isPointLight===!0?l:r,i.localClippingEnabled&&b.clipShadows===!0&&Array.isArray(b.clippingPlanes)&&b.clippingPlanes.length!==0||b.displacementMap&&b.displacementScale!==0||b.alphaMap&&b.alphaTest>0||b.map&&b.alphaTest>0){const R=T.uuid,B=b.uuid;let U=c[R];U===void 0&&(U={},c[R]=U);let H=U[B];H===void 0&&(H=T.clone(),U[B]=H,b.addEventListener("dispose",I)),T=H}if(T.visible=b.visible,T.wireframe=b.wireframe,x===En?T.side=b.shadowSide!==null?b.shadowSide:b.side:T.side=b.shadowSide!==null?b.shadowSide:u[b.side],T.alphaMap=b.alphaMap,T.alphaTest=b.alphaTest,T.map=b.map,T.clipShadows=b.clipShadows,T.clippingPlanes=b.clippingPlanes,T.clipIntersection=b.clipIntersection,T.displacementMap=b.displacementMap,T.displacementScale=b.displacementScale,T.displacementBias=b.displacementBias,T.wireframeLinewidth=b.wireframeLinewidth,T.linewidth=b.linewidth,k.isPointLight===!0&&T.isMeshDistanceMaterial===!0){const R=i.properties.get(T);R.light=k}return T}function M(C,b,k,x,T){if(C.visible===!1)return;if(C.layers.test(b.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&T===En)&&(!C.frustumCulled||n.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,C.matrixWorld);const B=t.update(C),U=C.material;if(Array.isArray(U)){const H=B.groups;for(let $=0,tt=H.length;$<tt;$++){const it=H[$],st=U[it.materialIndex];if(st&&st.visible){const et=v(C,st,x,T);C.onBeforeShadow(i,C,b,k,B,et,it),i.renderBufferDirect(k,null,B,et,C,it),C.onAfterShadow(i,C,b,k,B,et,it)}}}else if(U.visible){const H=v(C,U,x,T);C.onBeforeShadow(i,C,b,k,B,H,null),i.renderBufferDirect(k,null,B,H,C,null),C.onAfterShadow(i,C,b,k,B,H,null)}}const R=C.children;for(let B=0,U=R.length;B<U;B++)M(R[B],b,k,x,T)}function I(C){C.target.removeEventListener("dispose",I);for(const k in c){const x=c[k],T=C.target.uuid;T in x&&(x[T].dispose(),delete x[T])}}}function Um(i,t,e){const n=e.isWebGL2;function s(){let F=!1;const mt=new Ee;let gt=null;const Ut=new Ee(0,0,0,0);return{setMask:function(Ct){gt!==Ct&&!F&&(i.colorMask(Ct,Ct,Ct,Ct),gt=Ct)},setLocked:function(Ct){F=Ct},setClear:function(Ct,te,ee,Te,Fe){Fe===!0&&(Ct*=Te,te*=Te,ee*=Te),mt.set(Ct,te,ee,Te),Ut.equals(mt)===!1&&(i.clearColor(Ct,te,ee,Te),Ut.copy(mt))},reset:function(){F=!1,gt=null,Ut.set(-1,0,0,0)}}}function a(){let F=!1,mt=null,gt=null,Ut=null;return{setTest:function(Ct){Ct?St(i.DEPTH_TEST):yt(i.DEPTH_TEST)},setMask:function(Ct){mt!==Ct&&!F&&(i.depthMask(Ct),mt=Ct)},setFunc:function(Ct){if(gt!==Ct){switch(Ct){case Hc:i.depthFunc(i.NEVER);break;case Gc:i.depthFunc(i.ALWAYS);break;case Vc:i.depthFunc(i.LESS);break;case qs:i.depthFunc(i.LEQUAL);break;case Wc:i.depthFunc(i.EQUAL);break;case Xc:i.depthFunc(i.GEQUAL);break;case qc:i.depthFunc(i.GREATER);break;case $c:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}gt=Ct}},setLocked:function(Ct){F=Ct},setClear:function(Ct){Ut!==Ct&&(i.clearDepth(Ct),Ut=Ct)},reset:function(){F=!1,mt=null,gt=null,Ut=null}}}function o(){let F=!1,mt=null,gt=null,Ut=null,Ct=null,te=null,ee=null,Te=null,Fe=null;return{setTest:function(ne){F||(ne?St(i.STENCIL_TEST):yt(i.STENCIL_TEST))},setMask:function(ne){mt!==ne&&!F&&(i.stencilMask(ne),mt=ne)},setFunc:function(ne,Oe,pn){(gt!==ne||Ut!==Oe||Ct!==pn)&&(i.stencilFunc(ne,Oe,pn),gt=ne,Ut=Oe,Ct=pn)},setOp:function(ne,Oe,pn){(te!==ne||ee!==Oe||Te!==pn)&&(i.stencilOp(ne,Oe,pn),te=ne,ee=Oe,Te=pn)},setLocked:function(ne){F=ne},setClear:function(ne){Fe!==ne&&(i.clearStencil(ne),Fe=ne)},reset:function(){F=!1,mt=null,gt=null,Ut=null,Ct=null,te=null,ee=null,Te=null,Fe=null}}}const r=new s,l=new a,c=new o,h=new WeakMap,u=new WeakMap;let d={},f={},g=new WeakMap,_=[],m=null,p=!1,y=null,v=null,M=null,I=null,C=null,b=null,k=null,x=new kt(0,0,0),T=0,E=!1,R=null,B=null,U=null,H=null,$=null;const tt=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let it=!1,st=0;const et=i.getParameter(i.VERSION);et.indexOf("WebGL")!==-1?(st=parseFloat(/^WebGL (\d)/.exec(et)[1]),it=st>=1):et.indexOf("OpenGL ES")!==-1&&(st=parseFloat(/^OpenGL ES (\d)/.exec(et)[1]),it=st>=2);let at=null,z={};const N=i.getParameter(i.SCISSOR_BOX),V=i.getParameter(i.VIEWPORT),nt=new Ee().fromArray(N),rt=new Ee().fromArray(V);function ut(F,mt,gt,Ut){const Ct=new Uint8Array(4),te=i.createTexture();i.bindTexture(F,te),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ee=0;ee<gt;ee++)n&&(F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY)?i.texImage3D(mt,0,i.RGBA,1,1,Ut,0,i.RGBA,i.UNSIGNED_BYTE,Ct):i.texImage2D(mt+ee,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ct);return te}const Mt={};Mt[i.TEXTURE_2D]=ut(i.TEXTURE_2D,i.TEXTURE_2D,1),Mt[i.TEXTURE_CUBE_MAP]=ut(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Mt[i.TEXTURE_2D_ARRAY]=ut(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Mt[i.TEXTURE_3D]=ut(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),r.setClear(0,0,0,1),l.setClear(1),c.setClear(0),St(i.DEPTH_TEST),l.setFunc(qs),Nt(!1),A(Ir),St(i.CULL_FACE),G(Bn);function St(F){d[F]!==!0&&(i.enable(F),d[F]=!0)}function yt(F){d[F]!==!1&&(i.disable(F),d[F]=!1)}function dt(F,mt){return f[F]!==mt?(i.bindFramebuffer(F,mt),f[F]=mt,n&&(F===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=mt),F===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=mt)),!0):!1}function W(F,mt){let gt=_,Ut=!1;if(F)if(gt=g.get(mt),gt===void 0&&(gt=[],g.set(mt,gt)),F.isWebGLMultipleRenderTargets){const Ct=F.texture;if(gt.length!==Ct.length||gt[0]!==i.COLOR_ATTACHMENT0){for(let te=0,ee=Ct.length;te<ee;te++)gt[te]=i.COLOR_ATTACHMENT0+te;gt.length=Ct.length,Ut=!0}}else gt[0]!==i.COLOR_ATTACHMENT0&&(gt[0]=i.COLOR_ATTACHMENT0,Ut=!0);else gt[0]!==i.BACK&&(gt[0]=i.BACK,Ut=!0);Ut&&(e.isWebGL2?i.drawBuffers(gt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(gt))}function Ot(F){return m!==F?(i.useProgram(F),m=F,!0):!1}const O={[ti]:i.FUNC_ADD,[Ec]:i.FUNC_SUBTRACT,[Ac]:i.FUNC_REVERSE_SUBTRACT};if(n)O[zr]=i.MIN,O[Br]=i.MAX;else{const F=t.get("EXT_blend_minmax");F!==null&&(O[zr]=F.MIN_EXT,O[Br]=F.MAX_EXT)}const q={[Rc]:i.ZERO,[Cc]:i.ONE,[Pc]:i.SRC_COLOR,[Za]:i.SRC_ALPHA,[Fc]:i.SRC_ALPHA_SATURATE,[Ic]:i.DST_COLOR,[Dc]:i.DST_ALPHA,[Lc]:i.ONE_MINUS_SRC_COLOR,[Ja]:i.ONE_MINUS_SRC_ALPHA,[Nc]:i.ONE_MINUS_DST_COLOR,[Uc]:i.ONE_MINUS_DST_ALPHA,[Oc]:i.CONSTANT_COLOR,[zc]:i.ONE_MINUS_CONSTANT_COLOR,[Bc]:i.CONSTANT_ALPHA,[kc]:i.ONE_MINUS_CONSTANT_ALPHA};function G(F,mt,gt,Ut,Ct,te,ee,Te,Fe,ne){if(F===Bn){p===!0&&(yt(i.BLEND),p=!1);return}if(p===!1&&(St(i.BLEND),p=!0),F!==wc){if(F!==y||ne!==E){if((v!==ti||C!==ti)&&(i.blendEquation(i.FUNC_ADD),v=ti,C=ti),ne)switch(F){case Ii:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Nr:i.blendFunc(i.ONE,i.ONE);break;case Fr:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Or:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case Ii:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Nr:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Fr:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Or:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}M=null,I=null,b=null,k=null,x.set(0,0,0),T=0,y=F,E=ne}return}Ct=Ct||mt,te=te||gt,ee=ee||Ut,(mt!==v||Ct!==C)&&(i.blendEquationSeparate(O[mt],O[Ct]),v=mt,C=Ct),(gt!==M||Ut!==I||te!==b||ee!==k)&&(i.blendFuncSeparate(q[gt],q[Ut],q[te],q[ee]),M=gt,I=Ut,b=te,k=ee),(Te.equals(x)===!1||Fe!==T)&&(i.blendColor(Te.r,Te.g,Te.b,Fe),x.copy(Te),T=Fe),y=F,E=!1}function D(F,mt){F.side===pe?yt(i.CULL_FACE):St(i.CULL_FACE);let gt=F.side===Ve;mt&&(gt=!gt),Nt(gt),F.blending===Ii&&F.transparent===!1?G(Bn):G(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),l.setFunc(F.depthFunc),l.setTest(F.depthTest),l.setMask(F.depthWrite),r.setMask(F.colorWrite);const Ut=F.stencilWrite;c.setTest(Ut),Ut&&(c.setMask(F.stencilWriteMask),c.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),c.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Y(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?St(i.SAMPLE_ALPHA_TO_COVERAGE):yt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Nt(F){R!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),R=F)}function A(F){F!==Tc?(St(i.CULL_FACE),F!==B&&(F===Ir?i.cullFace(i.BACK):F===bc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):yt(i.CULL_FACE),B=F}function S(F){F!==U&&(it&&i.lineWidth(F),U=F)}function Y(F,mt,gt){F?(St(i.POLYGON_OFFSET_FILL),(H!==mt||$!==gt)&&(i.polygonOffset(mt,gt),H=mt,$=gt)):yt(i.POLYGON_OFFSET_FILL)}function ct(F){F?St(i.SCISSOR_TEST):yt(i.SCISSOR_TEST)}function lt(F){F===void 0&&(F=i.TEXTURE0+tt-1),at!==F&&(i.activeTexture(F),at=F)}function ht(F,mt,gt){gt===void 0&&(at===null?gt=i.TEXTURE0+tt-1:gt=at);let Ut=z[gt];Ut===void 0&&(Ut={type:void 0,texture:void 0},z[gt]=Ut),(Ut.type!==F||Ut.texture!==mt)&&(at!==gt&&(i.activeTexture(gt),at=gt),i.bindTexture(F,mt||Mt[F]),Ut.type=F,Ut.texture=mt)}function Et(){const F=z[at];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function _t(){try{i.compressedTexImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Tt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Dt(){try{i.texSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Wt(){try{i.texSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ot(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Jt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function jt(){try{i.texStorage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ft(){try{i.texStorage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Rt(){try{i.texImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function bt(){try{i.texImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ht(F){nt.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),nt.copy(F))}function Zt(F){rt.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),rt.copy(F))}function he(F,mt){let gt=u.get(mt);gt===void 0&&(gt=new WeakMap,u.set(mt,gt));let Ut=gt.get(F);Ut===void 0&&(Ut=i.getUniformBlockIndex(mt,F.name),gt.set(F,Ut))}function qt(F,mt){const Ut=u.get(mt).get(F);h.get(mt)!==Ut&&(i.uniformBlockBinding(mt,Ut,F.__bindingPointIndex),h.set(mt,Ut))}function ft(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},at=null,z={},f={},g=new WeakMap,_=[],m=null,p=!1,y=null,v=null,M=null,I=null,C=null,b=null,k=null,x=new kt(0,0,0),T=0,E=!1,R=null,B=null,U=null,H=null,$=null,nt.set(0,0,i.canvas.width,i.canvas.height),rt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),l.reset(),c.reset()}return{buffers:{color:r,depth:l,stencil:c},enable:St,disable:yt,bindFramebuffer:dt,drawBuffers:W,useProgram:Ot,setBlending:G,setMaterial:D,setFlipSided:Nt,setCullFace:A,setLineWidth:S,setPolygonOffset:Y,setScissorTest:ct,activeTexture:lt,bindTexture:ht,unbindTexture:Et,compressedTexImage2D:_t,compressedTexImage3D:Tt,texImage2D:Rt,texImage3D:bt,updateUBOMapping:he,uniformBlockBinding:qt,texStorage2D:jt,texStorage3D:Ft,texSubImage2D:Dt,texSubImage3D:Wt,compressedTexSubImage2D:ot,compressedTexSubImage3D:Jt,scissor:Ht,viewport:Zt,reset:ft}}function Im(i,t,e,n,s,a,o){const r=s.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,S){return f?new OffscreenCanvas(A,S):Ks("canvas")}function _(A,S,Y,ct){let lt=1;if((A.width>ct||A.height>ct)&&(lt=ct/Math.max(A.width,A.height)),lt<1||S===!0)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap){const ht=S?Js:Math.floor,Et=ht(lt*A.width),_t=ht(lt*A.height);u===void 0&&(u=g(Et,_t));const Tt=Y?g(Et,_t):u;return Tt.width=Et,Tt.height=_t,Tt.getContext("2d").drawImage(A,0,0,Et,_t),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+A.width+"x"+A.height+") to ("+Et+"x"+_t+")."),Tt}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+A.width+"x"+A.height+")."),A;return A}function m(A){return ir(A.width)&&ir(A.height)}function p(A){return r?!1:A.wrapS!==un||A.wrapT!==un||A.minFilter!==Ce&&A.minFilter!==Je}function y(A,S){return A.generateMipmaps&&S&&A.minFilter!==Ce&&A.minFilter!==Je}function v(A){i.generateMipmap(A)}function M(A,S,Y,ct,lt=!1){if(r===!1)return S;if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let ht=S;if(S===i.RED&&(Y===i.FLOAT&&(ht=i.R32F),Y===i.HALF_FLOAT&&(ht=i.R16F),Y===i.UNSIGNED_BYTE&&(ht=i.R8)),S===i.RED_INTEGER&&(Y===i.UNSIGNED_BYTE&&(ht=i.R8UI),Y===i.UNSIGNED_SHORT&&(ht=i.R16UI),Y===i.UNSIGNED_INT&&(ht=i.R32UI),Y===i.BYTE&&(ht=i.R8I),Y===i.SHORT&&(ht=i.R16I),Y===i.INT&&(ht=i.R32I)),S===i.RG&&(Y===i.FLOAT&&(ht=i.RG32F),Y===i.HALF_FLOAT&&(ht=i.RG16F),Y===i.UNSIGNED_BYTE&&(ht=i.RG8)),S===i.RGBA){const Et=lt?$s:Kt.getTransfer(ct);Y===i.FLOAT&&(ht=i.RGBA32F),Y===i.HALF_FLOAT&&(ht=i.RGBA16F),Y===i.UNSIGNED_BYTE&&(ht=Et===se?i.SRGB8_ALPHA8:i.RGBA8),Y===i.UNSIGNED_SHORT_4_4_4_4&&(ht=i.RGBA4),Y===i.UNSIGNED_SHORT_5_5_5_1&&(ht=i.RGB5_A1)}return(ht===i.R16F||ht===i.R32F||ht===i.RG16F||ht===i.RG32F||ht===i.RGBA16F||ht===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ht}function I(A,S,Y){return y(A,Y)===!0||A.isFramebufferTexture&&A.minFilter!==Ce&&A.minFilter!==Je?Math.log2(Math.max(S.width,S.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?S.mipmaps.length:1}function C(A){return A===Ce||A===kr||A===da?i.NEAREST:i.LINEAR}function b(A){const S=A.target;S.removeEventListener("dispose",b),x(S),S.isVideoTexture&&h.delete(S)}function k(A){const S=A.target;S.removeEventListener("dispose",k),E(S)}function x(A){const S=n.get(A);if(S.__webglInit===void 0)return;const Y=A.source,ct=d.get(Y);if(ct){const lt=ct[S.__cacheKey];lt.usedTimes--,lt.usedTimes===0&&T(A),Object.keys(ct).length===0&&d.delete(Y)}n.remove(A)}function T(A){const S=n.get(A);i.deleteTexture(S.__webglTexture);const Y=A.source,ct=d.get(Y);delete ct[S.__cacheKey],o.memory.textures--}function E(A){const S=A.texture,Y=n.get(A),ct=n.get(S);if(ct.__webglTexture!==void 0&&(i.deleteTexture(ct.__webglTexture),o.memory.textures--),A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let lt=0;lt<6;lt++){if(Array.isArray(Y.__webglFramebuffer[lt]))for(let ht=0;ht<Y.__webglFramebuffer[lt].length;ht++)i.deleteFramebuffer(Y.__webglFramebuffer[lt][ht]);else i.deleteFramebuffer(Y.__webglFramebuffer[lt]);Y.__webglDepthbuffer&&i.deleteRenderbuffer(Y.__webglDepthbuffer[lt])}else{if(Array.isArray(Y.__webglFramebuffer))for(let lt=0;lt<Y.__webglFramebuffer.length;lt++)i.deleteFramebuffer(Y.__webglFramebuffer[lt]);else i.deleteFramebuffer(Y.__webglFramebuffer);if(Y.__webglDepthbuffer&&i.deleteRenderbuffer(Y.__webglDepthbuffer),Y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(Y.__webglMultisampledFramebuffer),Y.__webglColorRenderbuffer)for(let lt=0;lt<Y.__webglColorRenderbuffer.length;lt++)Y.__webglColorRenderbuffer[lt]&&i.deleteRenderbuffer(Y.__webglColorRenderbuffer[lt]);Y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(Y.__webglDepthRenderbuffer)}if(A.isWebGLMultipleRenderTargets)for(let lt=0,ht=S.length;lt<ht;lt++){const Et=n.get(S[lt]);Et.__webglTexture&&(i.deleteTexture(Et.__webglTexture),o.memory.textures--),n.remove(S[lt])}n.remove(S),n.remove(A)}let R=0;function B(){R=0}function U(){const A=R;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),R+=1,A}function H(A){const S=[];return S.push(A.wrapS),S.push(A.wrapT),S.push(A.wrapR||0),S.push(A.magFilter),S.push(A.minFilter),S.push(A.anisotropy),S.push(A.internalFormat),S.push(A.format),S.push(A.type),S.push(A.generateMipmaps),S.push(A.premultiplyAlpha),S.push(A.flipY),S.push(A.unpackAlignment),S.push(A.colorSpace),S.join()}function $(A,S){const Y=n.get(A);if(A.isVideoTexture&&D(A),A.isRenderTargetTexture===!1&&A.version>0&&Y.__version!==A.version){const ct=A.image;if(ct===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ct.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{nt(Y,A,S);return}}e.bindTexture(i.TEXTURE_2D,Y.__webglTexture,i.TEXTURE0+S)}function tt(A,S){const Y=n.get(A);if(A.version>0&&Y.__version!==A.version){nt(Y,A,S);return}e.bindTexture(i.TEXTURE_2D_ARRAY,Y.__webglTexture,i.TEXTURE0+S)}function it(A,S){const Y=n.get(A);if(A.version>0&&Y.__version!==A.version){nt(Y,A,S);return}e.bindTexture(i.TEXTURE_3D,Y.__webglTexture,i.TEXTURE0+S)}function st(A,S){const Y=n.get(A);if(A.version>0&&Y.__version!==A.version){rt(Y,A,S);return}e.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture,i.TEXTURE0+S)}const et={[tr]:i.REPEAT,[un]:i.CLAMP_TO_EDGE,[er]:i.MIRRORED_REPEAT},at={[Ce]:i.NEAREST,[kr]:i.NEAREST_MIPMAP_NEAREST,[da]:i.NEAREST_MIPMAP_LINEAR,[Je]:i.LINEAR,[nh]:i.LINEAR_MIPMAP_NEAREST,[ns]:i.LINEAR_MIPMAP_LINEAR},z={[ph]:i.NEVER,[yh]:i.ALWAYS,[mh]:i.LESS,[Dl]:i.LEQUAL,[gh]:i.EQUAL,[xh]:i.GEQUAL,[_h]:i.GREATER,[vh]:i.NOTEQUAL};function N(A,S,Y){if(Y?(i.texParameteri(A,i.TEXTURE_WRAP_S,et[S.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,et[S.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,et[S.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,at[S.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,at[S.minFilter])):(i.texParameteri(A,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(A,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(S.wrapS!==un||S.wrapT!==un)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(A,i.TEXTURE_MAG_FILTER,C(S.magFilter)),i.texParameteri(A,i.TEXTURE_MIN_FILTER,C(S.minFilter)),S.minFilter!==Ce&&S.minFilter!==Je&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),S.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,z[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const ct=t.get("EXT_texture_filter_anisotropic");if(S.magFilter===Ce||S.minFilter!==da&&S.minFilter!==ns||S.type===zn&&t.has("OES_texture_float_linear")===!1||r===!1&&S.type===is&&t.has("OES_texture_half_float_linear")===!1)return;(S.anisotropy>1||n.get(S).__currentAnisotropy)&&(i.texParameterf(A,ct.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy)}}function V(A,S){let Y=!1;A.__webglInit===void 0&&(A.__webglInit=!0,S.addEventListener("dispose",b));const ct=S.source;let lt=d.get(ct);lt===void 0&&(lt={},d.set(ct,lt));const ht=H(S);if(ht!==A.__cacheKey){lt[ht]===void 0&&(lt[ht]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,Y=!0),lt[ht].usedTimes++;const Et=lt[A.__cacheKey];Et!==void 0&&(lt[A.__cacheKey].usedTimes--,Et.usedTimes===0&&T(S)),A.__cacheKey=ht,A.__webglTexture=lt[ht].texture}return Y}function nt(A,S,Y){let ct=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(ct=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(ct=i.TEXTURE_3D);const lt=V(A,S),ht=S.source;e.bindTexture(ct,A.__webglTexture,i.TEXTURE0+Y);const Et=n.get(ht);if(ht.version!==Et.__version||lt===!0){e.activeTexture(i.TEXTURE0+Y);const _t=Kt.getPrimaries(Kt.workingColorSpace),Tt=S.colorSpace===rn?null:Kt.getPrimaries(S.colorSpace),Dt=S.colorSpace===rn||_t===Tt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Dt);const Wt=p(S)&&m(S.image)===!1;let ot=_(S.image,Wt,!1,s.maxTextureSize);ot=Nt(S,ot);const Jt=m(ot)||r,jt=a.convert(S.format,S.colorSpace);let Ft=a.convert(S.type),Rt=M(S.internalFormat,jt,Ft,S.colorSpace,S.isVideoTexture);N(ct,S,Jt);let bt;const Ht=S.mipmaps,Zt=r&&S.isVideoTexture!==!0&&Rt!==Pl,he=Et.__version===void 0||lt===!0,qt=I(S,ot,Jt);if(S.isDepthTexture)Rt=i.DEPTH_COMPONENT,r?S.type===zn?Rt=i.DEPTH_COMPONENT32F:S.type===On?Rt=i.DEPTH_COMPONENT24:S.type===ii?Rt=i.DEPTH24_STENCIL8:Rt=i.DEPTH_COMPONENT16:S.type===zn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),S.format===si&&Rt===i.DEPTH_COMPONENT&&S.type!==pr&&S.type!==On&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),S.type=On,Ft=a.convert(S.type)),S.format===Bi&&Rt===i.DEPTH_COMPONENT&&(Rt=i.DEPTH_STENCIL,S.type!==ii&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),S.type=ii,Ft=a.convert(S.type))),he&&(Zt?e.texStorage2D(i.TEXTURE_2D,1,Rt,ot.width,ot.height):e.texImage2D(i.TEXTURE_2D,0,Rt,ot.width,ot.height,0,jt,Ft,null));else if(S.isDataTexture)if(Ht.length>0&&Jt){Zt&&he&&e.texStorage2D(i.TEXTURE_2D,qt,Rt,Ht[0].width,Ht[0].height);for(let ft=0,F=Ht.length;ft<F;ft++)bt=Ht[ft],Zt?e.texSubImage2D(i.TEXTURE_2D,ft,0,0,bt.width,bt.height,jt,Ft,bt.data):e.texImage2D(i.TEXTURE_2D,ft,Rt,bt.width,bt.height,0,jt,Ft,bt.data);S.generateMipmaps=!1}else Zt?(he&&e.texStorage2D(i.TEXTURE_2D,qt,Rt,ot.width,ot.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,ot.width,ot.height,jt,Ft,ot.data)):e.texImage2D(i.TEXTURE_2D,0,Rt,ot.width,ot.height,0,jt,Ft,ot.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Zt&&he&&e.texStorage3D(i.TEXTURE_2D_ARRAY,qt,Rt,Ht[0].width,Ht[0].height,ot.depth);for(let ft=0,F=Ht.length;ft<F;ft++)bt=Ht[ft],S.format!==an?jt!==null?Zt?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ft,0,0,0,bt.width,bt.height,ot.depth,jt,bt.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ft,Rt,bt.width,bt.height,ot.depth,0,bt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Zt?e.texSubImage3D(i.TEXTURE_2D_ARRAY,ft,0,0,0,bt.width,bt.height,ot.depth,jt,Ft,bt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,ft,Rt,bt.width,bt.height,ot.depth,0,jt,Ft,bt.data)}else{Zt&&he&&e.texStorage2D(i.TEXTURE_2D,qt,Rt,Ht[0].width,Ht[0].height);for(let ft=0,F=Ht.length;ft<F;ft++)bt=Ht[ft],S.format!==an?jt!==null?Zt?e.compressedTexSubImage2D(i.TEXTURE_2D,ft,0,0,bt.width,bt.height,jt,bt.data):e.compressedTexImage2D(i.TEXTURE_2D,ft,Rt,bt.width,bt.height,0,bt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Zt?e.texSubImage2D(i.TEXTURE_2D,ft,0,0,bt.width,bt.height,jt,Ft,bt.data):e.texImage2D(i.TEXTURE_2D,ft,Rt,bt.width,bt.height,0,jt,Ft,bt.data)}else if(S.isDataArrayTexture)Zt?(he&&e.texStorage3D(i.TEXTURE_2D_ARRAY,qt,Rt,ot.width,ot.height,ot.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ot.width,ot.height,ot.depth,jt,Ft,ot.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,Rt,ot.width,ot.height,ot.depth,0,jt,Ft,ot.data);else if(S.isData3DTexture)Zt?(he&&e.texStorage3D(i.TEXTURE_3D,qt,Rt,ot.width,ot.height,ot.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ot.width,ot.height,ot.depth,jt,Ft,ot.data)):e.texImage3D(i.TEXTURE_3D,0,Rt,ot.width,ot.height,ot.depth,0,jt,Ft,ot.data);else if(S.isFramebufferTexture){if(he)if(Zt)e.texStorage2D(i.TEXTURE_2D,qt,Rt,ot.width,ot.height);else{let ft=ot.width,F=ot.height;for(let mt=0;mt<qt;mt++)e.texImage2D(i.TEXTURE_2D,mt,Rt,ft,F,0,jt,Ft,null),ft>>=1,F>>=1}}else if(Ht.length>0&&Jt){Zt&&he&&e.texStorage2D(i.TEXTURE_2D,qt,Rt,Ht[0].width,Ht[0].height);for(let ft=0,F=Ht.length;ft<F;ft++)bt=Ht[ft],Zt?e.texSubImage2D(i.TEXTURE_2D,ft,0,0,jt,Ft,bt):e.texImage2D(i.TEXTURE_2D,ft,Rt,jt,Ft,bt);S.generateMipmaps=!1}else Zt?(he&&e.texStorage2D(i.TEXTURE_2D,qt,Rt,ot.width,ot.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,jt,Ft,ot)):e.texImage2D(i.TEXTURE_2D,0,Rt,jt,Ft,ot);y(S,Jt)&&v(ct),Et.__version=ht.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function rt(A,S,Y){if(S.image.length!==6)return;const ct=V(A,S),lt=S.source;e.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+Y);const ht=n.get(lt);if(lt.version!==ht.__version||ct===!0){e.activeTexture(i.TEXTURE0+Y);const Et=Kt.getPrimaries(Kt.workingColorSpace),_t=S.colorSpace===rn?null:Kt.getPrimaries(S.colorSpace),Tt=S.colorSpace===rn||Et===_t?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Tt);const Dt=S.isCompressedTexture||S.image[0].isCompressedTexture,Wt=S.image[0]&&S.image[0].isDataTexture,ot=[];for(let ft=0;ft<6;ft++)!Dt&&!Wt?ot[ft]=_(S.image[ft],!1,!0,s.maxCubemapSize):ot[ft]=Wt?S.image[ft].image:S.image[ft],ot[ft]=Nt(S,ot[ft]);const Jt=ot[0],jt=m(Jt)||r,Ft=a.convert(S.format,S.colorSpace),Rt=a.convert(S.type),bt=M(S.internalFormat,Ft,Rt,S.colorSpace),Ht=r&&S.isVideoTexture!==!0,Zt=ht.__version===void 0||ct===!0;let he=I(S,Jt,jt);N(i.TEXTURE_CUBE_MAP,S,jt);let qt;if(Dt){Ht&&Zt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,he,bt,Jt.width,Jt.height);for(let ft=0;ft<6;ft++){qt=ot[ft].mipmaps;for(let F=0;F<qt.length;F++){const mt=qt[F];S.format!==an?Ft!==null?Ht?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,F,0,0,mt.width,mt.height,Ft,mt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,F,bt,mt.width,mt.height,0,mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ht?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,F,0,0,mt.width,mt.height,Ft,Rt,mt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,F,bt,mt.width,mt.height,0,Ft,Rt,mt.data)}}}else{qt=S.mipmaps,Ht&&Zt&&(qt.length>0&&he++,e.texStorage2D(i.TEXTURE_CUBE_MAP,he,bt,ot[0].width,ot[0].height));for(let ft=0;ft<6;ft++)if(Wt){Ht?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,0,0,ot[ft].width,ot[ft].height,Ft,Rt,ot[ft].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,bt,ot[ft].width,ot[ft].height,0,Ft,Rt,ot[ft].data);for(let F=0;F<qt.length;F++){const gt=qt[F].image[ft].image;Ht?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,F+1,0,0,gt.width,gt.height,Ft,Rt,gt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,F+1,bt,gt.width,gt.height,0,Ft,Rt,gt.data)}}else{Ht?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,0,0,Ft,Rt,ot[ft]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0,bt,Ft,Rt,ot[ft]);for(let F=0;F<qt.length;F++){const mt=qt[F];Ht?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,F+1,0,0,Ft,Rt,mt.image[ft]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,F+1,bt,Ft,Rt,mt.image[ft])}}}y(S,jt)&&v(i.TEXTURE_CUBE_MAP),ht.__version=lt.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function ut(A,S,Y,ct,lt,ht){const Et=a.convert(Y.format,Y.colorSpace),_t=a.convert(Y.type),Tt=M(Y.internalFormat,Et,_t,Y.colorSpace);if(!n.get(S).__hasExternalTextures){const Wt=Math.max(1,S.width>>ht),ot=Math.max(1,S.height>>ht);lt===i.TEXTURE_3D||lt===i.TEXTURE_2D_ARRAY?e.texImage3D(lt,ht,Tt,Wt,ot,S.depth,0,Et,_t,null):e.texImage2D(lt,ht,Tt,Wt,ot,0,Et,_t,null)}e.bindFramebuffer(i.FRAMEBUFFER,A),G(S)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ct,lt,n.get(Y).__webglTexture,0,q(S)):(lt===i.TEXTURE_2D||lt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&lt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ct,lt,n.get(Y).__webglTexture,ht),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Mt(A,S,Y){if(i.bindRenderbuffer(i.RENDERBUFFER,A),S.depthBuffer&&!S.stencilBuffer){let ct=r===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(Y||G(S)){const lt=S.depthTexture;lt&&lt.isDepthTexture&&(lt.type===zn?ct=i.DEPTH_COMPONENT32F:lt.type===On&&(ct=i.DEPTH_COMPONENT24));const ht=q(S);G(S)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ht,ct,S.width,S.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,ht,ct,S.width,S.height)}else i.renderbufferStorage(i.RENDERBUFFER,ct,S.width,S.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,A)}else if(S.depthBuffer&&S.stencilBuffer){const ct=q(S);Y&&G(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,ct,i.DEPTH24_STENCIL8,S.width,S.height):G(S)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ct,i.DEPTH24_STENCIL8,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,A)}else{const ct=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let lt=0;lt<ct.length;lt++){const ht=ct[lt],Et=a.convert(ht.format,ht.colorSpace),_t=a.convert(ht.type),Tt=M(ht.internalFormat,Et,_t,ht.colorSpace),Dt=q(S);Y&&G(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Dt,Tt,S.width,S.height):G(S)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Dt,Tt,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,Tt,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function St(A,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,A),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(S.depthTexture).__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),$(S.depthTexture,0);const ct=n.get(S.depthTexture).__webglTexture,lt=q(S);if(S.depthTexture.format===si)G(S)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ct,0,lt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ct,0);else if(S.depthTexture.format===Bi)G(S)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ct,0,lt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ct,0);else throw new Error("Unknown depthTexture format")}function yt(A){const S=n.get(A),Y=A.isWebGLCubeRenderTarget===!0;if(A.depthTexture&&!S.__autoAllocateDepthBuffer){if(Y)throw new Error("target.depthTexture not supported in Cube render targets");St(S.__webglFramebuffer,A)}else if(Y){S.__webglDepthbuffer=[];for(let ct=0;ct<6;ct++)e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[ct]),S.__webglDepthbuffer[ct]=i.createRenderbuffer(),Mt(S.__webglDepthbuffer[ct],A,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer=i.createRenderbuffer(),Mt(S.__webglDepthbuffer,A,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function dt(A,S,Y){const ct=n.get(A);S!==void 0&&ut(ct.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),Y!==void 0&&yt(A)}function W(A){const S=A.texture,Y=n.get(A),ct=n.get(S);A.addEventListener("dispose",k),A.isWebGLMultipleRenderTargets!==!0&&(ct.__webglTexture===void 0&&(ct.__webglTexture=i.createTexture()),ct.__version=S.version,o.memory.textures++);const lt=A.isWebGLCubeRenderTarget===!0,ht=A.isWebGLMultipleRenderTargets===!0,Et=m(A)||r;if(lt){Y.__webglFramebuffer=[];for(let _t=0;_t<6;_t++)if(r&&S.mipmaps&&S.mipmaps.length>0){Y.__webglFramebuffer[_t]=[];for(let Tt=0;Tt<S.mipmaps.length;Tt++)Y.__webglFramebuffer[_t][Tt]=i.createFramebuffer()}else Y.__webglFramebuffer[_t]=i.createFramebuffer()}else{if(r&&S.mipmaps&&S.mipmaps.length>0){Y.__webglFramebuffer=[];for(let _t=0;_t<S.mipmaps.length;_t++)Y.__webglFramebuffer[_t]=i.createFramebuffer()}else Y.__webglFramebuffer=i.createFramebuffer();if(ht)if(s.drawBuffers){const _t=A.texture;for(let Tt=0,Dt=_t.length;Tt<Dt;Tt++){const Wt=n.get(_t[Tt]);Wt.__webglTexture===void 0&&(Wt.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(r&&A.samples>0&&G(A)===!1){const _t=ht?S:[S];Y.__webglMultisampledFramebuffer=i.createFramebuffer(),Y.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,Y.__webglMultisampledFramebuffer);for(let Tt=0;Tt<_t.length;Tt++){const Dt=_t[Tt];Y.__webglColorRenderbuffer[Tt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,Y.__webglColorRenderbuffer[Tt]);const Wt=a.convert(Dt.format,Dt.colorSpace),ot=a.convert(Dt.type),Jt=M(Dt.internalFormat,Wt,ot,Dt.colorSpace,A.isXRRenderTarget===!0),jt=q(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,jt,Jt,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.RENDERBUFFER,Y.__webglColorRenderbuffer[Tt])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(Y.__webglDepthRenderbuffer=i.createRenderbuffer(),Mt(Y.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(lt){e.bindTexture(i.TEXTURE_CUBE_MAP,ct.__webglTexture),N(i.TEXTURE_CUBE_MAP,S,Et);for(let _t=0;_t<6;_t++)if(r&&S.mipmaps&&S.mipmaps.length>0)for(let Tt=0;Tt<S.mipmaps.length;Tt++)ut(Y.__webglFramebuffer[_t][Tt],A,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+_t,Tt);else ut(Y.__webglFramebuffer[_t],A,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+_t,0);y(S,Et)&&v(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ht){const _t=A.texture;for(let Tt=0,Dt=_t.length;Tt<Dt;Tt++){const Wt=_t[Tt],ot=n.get(Wt);e.bindTexture(i.TEXTURE_2D,ot.__webglTexture),N(i.TEXTURE_2D,Wt,Et),ut(Y.__webglFramebuffer,A,Wt,i.COLOR_ATTACHMENT0+Tt,i.TEXTURE_2D,0),y(Wt,Et)&&v(i.TEXTURE_2D)}e.unbindTexture()}else{let _t=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(r?_t=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(_t,ct.__webglTexture),N(_t,S,Et),r&&S.mipmaps&&S.mipmaps.length>0)for(let Tt=0;Tt<S.mipmaps.length;Tt++)ut(Y.__webglFramebuffer[Tt],A,S,i.COLOR_ATTACHMENT0,_t,Tt);else ut(Y.__webglFramebuffer,A,S,i.COLOR_ATTACHMENT0,_t,0);y(S,Et)&&v(_t),e.unbindTexture()}A.depthBuffer&&yt(A)}function Ot(A){const S=m(A)||r,Y=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let ct=0,lt=Y.length;ct<lt;ct++){const ht=Y[ct];if(y(ht,S)){const Et=A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,_t=n.get(ht).__webglTexture;e.bindTexture(Et,_t),v(Et),e.unbindTexture()}}}function O(A){if(r&&A.samples>0&&G(A)===!1){const S=A.isWebGLMultipleRenderTargets?A.texture:[A.texture],Y=A.width,ct=A.height;let lt=i.COLOR_BUFFER_BIT;const ht=[],Et=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,_t=n.get(A),Tt=A.isWebGLMultipleRenderTargets===!0;if(Tt)for(let Dt=0;Dt<S.length;Dt++)e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Dt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Dt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,_t.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglFramebuffer);for(let Dt=0;Dt<S.length;Dt++){ht.push(i.COLOR_ATTACHMENT0+Dt),A.depthBuffer&&ht.push(Et);const Wt=_t.__ignoreDepthValues!==void 0?_t.__ignoreDepthValues:!1;if(Wt===!1&&(A.depthBuffer&&(lt|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&(lt|=i.STENCIL_BUFFER_BIT)),Tt&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,_t.__webglColorRenderbuffer[Dt]),Wt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[Et]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[Et])),Tt){const ot=n.get(S[Dt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ot,0)}i.blitFramebuffer(0,0,Y,ct,0,0,Y,ct,lt,i.NEAREST),c&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ht)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Tt)for(let Dt=0;Dt<S.length;Dt++){e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Dt,i.RENDERBUFFER,_t.__webglColorRenderbuffer[Dt]);const Wt=n.get(S[Dt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Dt,i.TEXTURE_2D,Wt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglMultisampledFramebuffer)}}function q(A){return Math.min(s.maxSamples,A.samples)}function G(A){const S=n.get(A);return r&&A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function D(A){const S=o.render.frame;h.get(A)!==S&&(h.set(A,S),A.update())}function Nt(A,S){const Y=A.colorSpace,ct=A.format,lt=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||A.format===nr||Y!==Cn&&Y!==rn&&(Kt.getTransfer(Y)===se?r===!1?t.has("EXT_sRGB")===!0&&ct===an?(A.format=nr,A.minFilter=Je,A.generateMipmaps=!1):S=Il.sRGBToLinear(S):(ct!==an||lt!==Hn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Y)),S}this.allocateTextureUnit=U,this.resetTextureUnits=B,this.setTexture2D=$,this.setTexture2DArray=tt,this.setTexture3D=it,this.setTextureCube=st,this.rebindTextures=dt,this.setupRenderTarget=W,this.updateRenderTargetMipmap=Ot,this.updateMultisampleRenderTarget=O,this.setupDepthRenderbuffer=yt,this.setupFrameBufferTexture=ut,this.useMultisampledRTT=G}function Nm(i,t,e){const n=e.isWebGL2;function s(a,o=rn){let r;const l=Kt.getTransfer(o);if(a===Hn)return i.UNSIGNED_BYTE;if(a===wl)return i.UNSIGNED_SHORT_4_4_4_4;if(a===El)return i.UNSIGNED_SHORT_5_5_5_1;if(a===ih)return i.BYTE;if(a===sh)return i.SHORT;if(a===pr)return i.UNSIGNED_SHORT;if(a===bl)return i.INT;if(a===On)return i.UNSIGNED_INT;if(a===zn)return i.FLOAT;if(a===is)return n?i.HALF_FLOAT:(r=t.get("OES_texture_half_float"),r!==null?r.HALF_FLOAT_OES:null);if(a===ah)return i.ALPHA;if(a===an)return i.RGBA;if(a===rh)return i.LUMINANCE;if(a===oh)return i.LUMINANCE_ALPHA;if(a===si)return i.DEPTH_COMPONENT;if(a===Bi)return i.DEPTH_STENCIL;if(a===nr)return r=t.get("EXT_sRGB"),r!==null?r.SRGB_ALPHA_EXT:null;if(a===lh)return i.RED;if(a===Al)return i.RED_INTEGER;if(a===ch)return i.RG;if(a===Rl)return i.RG_INTEGER;if(a===Cl)return i.RGBA_INTEGER;if(a===fa||a===pa||a===ma||a===ga)if(l===se)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(a===fa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(a===pa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(a===ma)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(a===ga)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(a===fa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(a===pa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(a===ma)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(a===ga)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(a===Hr||a===Gr||a===Vr||a===Wr)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(a===Hr)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(a===Gr)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(a===Vr)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(a===Wr)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(a===Pl)return r=t.get("WEBGL_compressed_texture_etc1"),r!==null?r.COMPRESSED_RGB_ETC1_WEBGL:null;if(a===Xr||a===qr)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(a===Xr)return l===se?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(a===qr)return l===se?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(a===$r||a===Yr||a===jr||a===Zr||a===Jr||a===Kr||a===Qr||a===to||a===eo||a===no||a===io||a===so||a===ao||a===ro)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(a===$r)return l===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(a===Yr)return l===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(a===jr)return l===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(a===Zr)return l===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(a===Jr)return l===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(a===Kr)return l===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(a===Qr)return l===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(a===to)return l===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(a===eo)return l===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(a===no)return l===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(a===io)return l===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(a===so)return l===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(a===ao)return l===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(a===ro)return l===se?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(a===_a||a===oo||a===lo)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(a===_a)return l===se?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(a===oo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(a===lo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(a===hh||a===co||a===ho||a===uo)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(a===_a)return r.COMPRESSED_RED_RGTC1_EXT;if(a===co)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(a===ho)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(a===uo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return a===ii?n?i.UNSIGNED_INT_24_8:(r=t.get("WEBGL_depth_texture"),r!==null?r.UNSIGNED_INT_24_8_WEBGL:null):i[a]!==void 0?i[a]:null}return{convert:s}}class Fm extends sn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class de extends Le{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Om={type:"move"};class ka{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new de,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new de,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new de,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,a=null,o=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,n),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&a!==null&&(s=a),s!==null&&(r.matrix.fromArray(s.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,s.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(s.linearVelocity)):r.hasLinearVelocity=!1,s.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(s.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(Om)))}return r!==null&&(r.visible=s!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new de;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class zm extends Hi{constructor(t,e){super();const n=this;let s=null,a=1,o=null,r="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null;const _=e.getContextAttributes();let m=null,p=null;const y=[],v=[],M=new vt;let I=null;const C=new sn;C.layers.enable(1),C.viewport=new Ee;const b=new sn;b.layers.enable(2),b.viewport=new Ee;const k=[C,b],x=new Fm;x.layers.enable(1),x.layers.enable(2);let T=null,E=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(N){let V=y[N];return V===void 0&&(V=new ka,y[N]=V),V.getTargetRaySpace()},this.getControllerGrip=function(N){let V=y[N];return V===void 0&&(V=new ka,y[N]=V),V.getGripSpace()},this.getHand=function(N){let V=y[N];return V===void 0&&(V=new ka,y[N]=V),V.getHandSpace()};function R(N){const V=v.indexOf(N.inputSource);if(V===-1)return;const nt=y[V];nt!==void 0&&(nt.update(N.inputSource,N.frame,c||o),nt.dispatchEvent({type:N.type,data:N.inputSource}))}function B(){s.removeEventListener("select",R),s.removeEventListener("selectstart",R),s.removeEventListener("selectend",R),s.removeEventListener("squeeze",R),s.removeEventListener("squeezestart",R),s.removeEventListener("squeezeend",R),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",U);for(let N=0;N<y.length;N++){const V=v[N];V!==null&&(v[N]=null,y[N].disconnect(V))}T=null,E=null,t.setRenderTarget(m),f=null,d=null,u=null,s=null,p=null,z.stop(),n.isPresenting=!1,t.setPixelRatio(I),t.setSize(M.width,M.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(N){a=N,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(N){r=N,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(N){c=N},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(N){if(s=N,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",R),s.addEventListener("selectstart",R),s.addEventListener("selectend",R),s.addEventListener("squeeze",R),s.addEventListener("squeezestart",R),s.addEventListener("squeezeend",R),s.addEventListener("end",B),s.addEventListener("inputsourceschange",U),_.xrCompatible!==!0&&await e.makeXRCompatible(),I=t.getPixelRatio(),t.getSize(M),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const V={antialias:s.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:a};f=new XRWebGLLayer(s,e,V),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),p=new ri(f.framebufferWidth,f.framebufferHeight,{format:an,type:Hn,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil})}else{let V=null,nt=null,rt=null;_.depth&&(rt=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,V=_.stencil?Bi:si,nt=_.stencil?ii:On);const ut={colorFormat:e.RGBA8,depthFormat:rt,scaleFactor:a};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(ut),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),p=new ri(d.textureWidth,d.textureHeight,{format:an,type:Hn,depthTexture:new Xl(d.textureWidth,d.textureHeight,nt,void 0,void 0,void 0,void 0,void 0,void 0,V),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0});const Mt=t.properties.get(p);Mt.__ignoreDepthValues=d.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(r),z.setContext(s),z.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function U(N){for(let V=0;V<N.removed.length;V++){const nt=N.removed[V],rt=v.indexOf(nt);rt>=0&&(v[rt]=null,y[rt].disconnect(nt))}for(let V=0;V<N.added.length;V++){const nt=N.added[V];let rt=v.indexOf(nt);if(rt===-1){for(let Mt=0;Mt<y.length;Mt++)if(Mt>=v.length){v.push(nt),rt=Mt;break}else if(v[Mt]===null){v[Mt]=nt,rt=Mt;break}if(rt===-1)break}const ut=y[rt];ut&&ut.connect(nt)}}const H=new L,$=new L;function tt(N,V,nt){H.setFromMatrixPosition(V.matrixWorld),$.setFromMatrixPosition(nt.matrixWorld);const rt=H.distanceTo($),ut=V.projectionMatrix.elements,Mt=nt.projectionMatrix.elements,St=ut[14]/(ut[10]-1),yt=ut[14]/(ut[10]+1),dt=(ut[9]+1)/ut[5],W=(ut[9]-1)/ut[5],Ot=(ut[8]-1)/ut[0],O=(Mt[8]+1)/Mt[0],q=St*Ot,G=St*O,D=rt/(-Ot+O),Nt=D*-Ot;V.matrixWorld.decompose(N.position,N.quaternion,N.scale),N.translateX(Nt),N.translateZ(D),N.matrixWorld.compose(N.position,N.quaternion,N.scale),N.matrixWorldInverse.copy(N.matrixWorld).invert();const A=St+D,S=yt+D,Y=q-Nt,ct=G+(rt-Nt),lt=dt*yt/S*A,ht=W*yt/S*A;N.projectionMatrix.makePerspective(Y,ct,lt,ht,A,S),N.projectionMatrixInverse.copy(N.projectionMatrix).invert()}function it(N,V){V===null?N.matrixWorld.copy(N.matrix):N.matrixWorld.multiplyMatrices(V.matrixWorld,N.matrix),N.matrixWorldInverse.copy(N.matrixWorld).invert()}this.updateCamera=function(N){if(s===null)return;x.near=b.near=C.near=N.near,x.far=b.far=C.far=N.far,(T!==x.near||E!==x.far)&&(s.updateRenderState({depthNear:x.near,depthFar:x.far}),T=x.near,E=x.far);const V=N.parent,nt=x.cameras;it(x,V);for(let rt=0;rt<nt.length;rt++)it(nt[rt],V);nt.length===2?tt(x,C,b):x.projectionMatrix.copy(C.projectionMatrix),st(N,x,V)};function st(N,V,nt){nt===null?N.matrix.copy(V.matrixWorld):(N.matrix.copy(nt.matrixWorld),N.matrix.invert(),N.matrix.multiply(V.matrixWorld)),N.matrix.decompose(N.position,N.quaternion,N.scale),N.updateMatrixWorld(!0),N.projectionMatrix.copy(V.projectionMatrix),N.projectionMatrixInverse.copy(V.projectionMatrixInverse),N.isPerspectiveCamera&&(N.fov=ss*2*Math.atan(1/N.projectionMatrix.elements[5]),N.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(N){l=N,d!==null&&(d.fixedFoveation=N),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=N)};let et=null;function at(N,V){if(h=V.getViewerPose(c||o),g=V,h!==null){const nt=h.views;f!==null&&(t.setRenderTargetFramebuffer(p,f.framebuffer),t.setRenderTarget(p));let rt=!1;nt.length!==x.cameras.length&&(x.cameras.length=0,rt=!0);for(let ut=0;ut<nt.length;ut++){const Mt=nt[ut];let St=null;if(f!==null)St=f.getViewport(Mt);else{const dt=u.getViewSubImage(d,Mt);St=dt.viewport,ut===0&&(t.setRenderTargetTextures(p,dt.colorTexture,d.ignoreDepthValues?void 0:dt.depthStencilTexture),t.setRenderTarget(p))}let yt=k[ut];yt===void 0&&(yt=new sn,yt.layers.enable(ut),yt.viewport=new Ee,k[ut]=yt),yt.matrix.fromArray(Mt.transform.matrix),yt.matrix.decompose(yt.position,yt.quaternion,yt.scale),yt.projectionMatrix.fromArray(Mt.projectionMatrix),yt.projectionMatrixInverse.copy(yt.projectionMatrix).invert(),yt.viewport.set(St.x,St.y,St.width,St.height),ut===0&&(x.matrix.copy(yt.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),rt===!0&&x.cameras.push(yt)}}for(let nt=0;nt<y.length;nt++){const rt=v[nt],ut=y[nt];rt!==null&&ut!==void 0&&ut.update(rt,V,c||o)}et&&et(N,V),V.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:V}),g=null}const z=new Vl;z.setAnimationLoop(at),this.setAnimationLoop=function(N){et=N},this.dispose=function(){}}}function Bm(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,kl(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,y,v,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?a(m,p):p.isMeshToonMaterial?(a(m,p),u(m,p)):p.isMeshPhongMaterial?(a(m,p),h(m,p)):p.isMeshStandardMaterial?(a(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,M)):p.isMeshMatcapMaterial?(a(m,p),g(m,p)):p.isMeshDepthMaterial?a(m,p):p.isMeshDistanceMaterial?(a(m,p),_(m,p)):p.isMeshNormalMaterial?a(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&r(m,p)):p.isPointsMaterial?l(m,p,y,v):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ve&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ve&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const y=t.get(p).envMap;if(y&&(m.envMap.value=y,m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;const v=i._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*v,e(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function r(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,y,v){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*y,m.scale.value=v*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),t.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,y){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ve&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const y=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function km(i,t,e,n){let s={},a={},o=[];const r=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(y,v){const M=v.program;n.uniformBlockBinding(y,M)}function c(y,v){let M=s[y.id];M===void 0&&(g(y),M=h(y),s[y.id]=M,y.addEventListener("dispose",m));const I=v.program;n.updateUBOMapping(y,I);const C=t.render.frame;a[y.id]!==C&&(d(y),a[y.id]=C)}function h(y){const v=u();y.__bindingPointIndex=v;const M=i.createBuffer(),I=y.__size,C=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,I,C),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,M),M}function u(){for(let y=0;y<r;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const v=s[y.id],M=y.uniforms,I=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let C=0,b=M.length;C<b;C++){const k=Array.isArray(M[C])?M[C]:[M[C]];for(let x=0,T=k.length;x<T;x++){const E=k[x];if(f(E,C,x,I)===!0){const R=E.__offset,B=Array.isArray(E.value)?E.value:[E.value];let U=0;for(let H=0;H<B.length;H++){const $=B[H],tt=_($);typeof $=="number"||typeof $=="boolean"?(E.__data[0]=$,i.bufferSubData(i.UNIFORM_BUFFER,R+U,E.__data)):$.isMatrix3?(E.__data[0]=$.elements[0],E.__data[1]=$.elements[1],E.__data[2]=$.elements[2],E.__data[3]=0,E.__data[4]=$.elements[3],E.__data[5]=$.elements[4],E.__data[6]=$.elements[5],E.__data[7]=0,E.__data[8]=$.elements[6],E.__data[9]=$.elements[7],E.__data[10]=$.elements[8],E.__data[11]=0):($.toArray(E.__data,U),U+=tt.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,R,E.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(y,v,M,I){const C=y.value,b=v+"_"+M;if(I[b]===void 0)return typeof C=="number"||typeof C=="boolean"?I[b]=C:I[b]=C.clone(),!0;{const k=I[b];if(typeof C=="number"||typeof C=="boolean"){if(k!==C)return I[b]=C,!0}else if(k.equals(C)===!1)return k.copy(C),!0}return!1}function g(y){const v=y.uniforms;let M=0;const I=16;for(let b=0,k=v.length;b<k;b++){const x=Array.isArray(v[b])?v[b]:[v[b]];for(let T=0,E=x.length;T<E;T++){const R=x[T],B=Array.isArray(R.value)?R.value:[R.value];for(let U=0,H=B.length;U<H;U++){const $=B[U],tt=_($),it=M%I;it!==0&&I-it<tt.boundary&&(M+=I-it),R.__data=new Float32Array(tt.storage/Float32Array.BYTES_PER_ELEMENT),R.__offset=M,M+=tt.storage}}}const C=M%I;return C>0&&(M+=I-C),y.__size=M,y.__cache={},this}function _(y){const v={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(v.boundary=4,v.storage=4):y.isVector2?(v.boundary=8,v.storage=8):y.isVector3||y.isColor?(v.boundary=16,v.storage=12):y.isVector4?(v.boundary=16,v.storage=16):y.isMatrix3?(v.boundary=48,v.storage=48):y.isMatrix4?(v.boundary=64,v.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),v}function m(y){const v=y.target;v.removeEventListener("dispose",m);const M=o.indexOf(v.__bindingPointIndex);o.splice(M,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete a[v.id]}function p(){for(const y in s)i.deleteBuffer(s[y]);o=[],s={},a={}}return{bind:l,update:c,dispose:p}}class Jl{constructor(t={}){const{canvas:e=Nh(),context:n=null,depth:s=!0,stencil:a=!0,alpha:o=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=o;const f=new Uint32Array(4),g=new Int32Array(4);let _=null,m=null;const p=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Pe,this._useLegacyLights=!1,this.toneMapping=kn,this.toneMappingExposure=1;const v=this;let M=!1,I=0,C=0,b=null,k=-1,x=null;const T=new Ee,E=new Ee;let R=null;const B=new kt(0);let U=0,H=e.width,$=e.height,tt=1,it=null,st=null;const et=new Ee(0,0,H,$),at=new Ee(0,0,H,$);let z=!1;const N=new yr;let V=!1,nt=!1,rt=null;const ut=new me,Mt=new vt,St=new L,yt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function dt(){return b===null?tt:1}let W=n;function Ot(w,X){for(let J=0;J<w.length;J++){const K=w[J],Z=e.getContext(K,X);if(Z!==null)return Z}return null}try{const w={alpha:!0,depth:s,stencil:a,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${dr}`),e.addEventListener("webglcontextlost",ft,!1),e.addEventListener("webglcontextrestored",F,!1),e.addEventListener("webglcontextcreationerror",mt,!1),W===null){const X=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&X.shift(),W=Ot(X,w),W===null)throw Ot(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&W instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),W.getShaderPrecisionFormat===void 0&&(W.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let O,q,G,D,Nt,A,S,Y,ct,lt,ht,Et,_t,Tt,Dt,Wt,ot,Jt,jt,Ft,Rt,bt,Ht,Zt;function he(){O=new Zf(W),q=new Wf(W,O,t),O.init(q),bt=new Nm(W,O,q),G=new Um(W,O,q),D=new Qf(W),Nt=new xm,A=new Im(W,O,G,Nt,q,bt,D),S=new qf(v),Y=new jf(v),ct=new ru(W,q),Ht=new Gf(W,O,ct,q),lt=new Jf(W,ct,D,Ht),ht=new ip(W,lt,ct,D),jt=new np(W,q,A),Wt=new Xf(Nt),Et=new vm(v,S,Y,O,q,Ht,Wt),_t=new Bm(v,Nt),Tt=new Mm,Dt=new Am(O,q),Jt=new Hf(v,S,Y,G,ht,d,l),ot=new Dm(v,ht,q),Zt=new km(W,D,q,G),Ft=new Vf(W,O,D,q),Rt=new Kf(W,O,D,q),D.programs=Et.programs,v.capabilities=q,v.extensions=O,v.properties=Nt,v.renderLists=Tt,v.shadowMap=ot,v.state=G,v.info=D}he();const qt=new zm(v,W);this.xr=qt,this.getContext=function(){return W},this.getContextAttributes=function(){return W.getContextAttributes()},this.forceContextLoss=function(){const w=O.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=O.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return tt},this.setPixelRatio=function(w){w!==void 0&&(tt=w,this.setSize(H,$,!1))},this.getSize=function(w){return w.set(H,$)},this.setSize=function(w,X,J=!0){if(qt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=w,$=X,e.width=Math.floor(w*tt),e.height=Math.floor(X*tt),J===!0&&(e.style.width=w+"px",e.style.height=X+"px"),this.setViewport(0,0,w,X)},this.getDrawingBufferSize=function(w){return w.set(H*tt,$*tt).floor()},this.setDrawingBufferSize=function(w,X,J){H=w,$=X,tt=J,e.width=Math.floor(w*J),e.height=Math.floor(X*J),this.setViewport(0,0,w,X)},this.getCurrentViewport=function(w){return w.copy(T)},this.getViewport=function(w){return w.copy(et)},this.setViewport=function(w,X,J,K){w.isVector4?et.set(w.x,w.y,w.z,w.w):et.set(w,X,J,K),G.viewport(T.copy(et).multiplyScalar(tt).floor())},this.getScissor=function(w){return w.copy(at)},this.setScissor=function(w,X,J,K){w.isVector4?at.set(w.x,w.y,w.z,w.w):at.set(w,X,J,K),G.scissor(E.copy(at).multiplyScalar(tt).floor())},this.getScissorTest=function(){return z},this.setScissorTest=function(w){G.setScissorTest(z=w)},this.setOpaqueSort=function(w){it=w},this.setTransparentSort=function(w){st=w},this.getClearColor=function(w){return w.copy(Jt.getClearColor())},this.setClearColor=function(){Jt.setClearColor.apply(Jt,arguments)},this.getClearAlpha=function(){return Jt.getClearAlpha()},this.setClearAlpha=function(){Jt.setClearAlpha.apply(Jt,arguments)},this.clear=function(w=!0,X=!0,J=!0){let K=0;if(w){let Z=!1;if(b!==null){const xt=b.texture.format;Z=xt===Cl||xt===Rl||xt===Al}if(Z){const xt=b.texture.type,At=xt===Hn||xt===On||xt===pr||xt===ii||xt===wl||xt===El,Pt=Jt.getClearColor(),It=Jt.getClearAlpha(),Xt=Pt.r,zt=Pt.g,Bt=Pt.b;At?(f[0]=Xt,f[1]=zt,f[2]=Bt,f[3]=It,W.clearBufferuiv(W.COLOR,0,f)):(g[0]=Xt,g[1]=zt,g[2]=Bt,g[3]=It,W.clearBufferiv(W.COLOR,0,g))}else K|=W.COLOR_BUFFER_BIT}X&&(K|=W.DEPTH_BUFFER_BIT),J&&(K|=W.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W.clear(K)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ft,!1),e.removeEventListener("webglcontextrestored",F,!1),e.removeEventListener("webglcontextcreationerror",mt,!1),Tt.dispose(),Dt.dispose(),Nt.dispose(),S.dispose(),Y.dispose(),ht.dispose(),Ht.dispose(),Zt.dispose(),Et.dispose(),qt.dispose(),qt.removeEventListener("sessionstart",Fe),qt.removeEventListener("sessionend",ne),rt&&(rt.dispose(),rt=null),Oe.stop()};function ft(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function F(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const w=D.autoReset,X=ot.enabled,J=ot.autoUpdate,K=ot.needsUpdate,Z=ot.type;he(),D.autoReset=w,ot.enabled=X,ot.autoUpdate=J,ot.needsUpdate=K,ot.type=Z}function mt(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function gt(w){const X=w.target;X.removeEventListener("dispose",gt),Ut(X)}function Ut(w){Ct(w),Nt.remove(w)}function Ct(w){const X=Nt.get(w).programs;X!==void 0&&(X.forEach(function(J){Et.releaseProgram(J)}),w.isShaderMaterial&&Et.releaseShaderCache(w))}this.renderBufferDirect=function(w,X,J,K,Z,xt){X===null&&(X=yt);const At=Z.isMesh&&Z.matrixWorld.determinant()<0,Pt=xc(w,X,J,K,Z);G.setMaterial(K,At);let It=J.index,Xt=1;if(K.wireframe===!0){if(It=lt.getWireframeAttribute(J),It===void 0)return;Xt=2}const zt=J.drawRange,Bt=J.attributes.position;let fe=zt.start*Xt,qe=(zt.start+zt.count)*Xt;xt!==null&&(fe=Math.max(fe,xt.start*Xt),qe=Math.min(qe,(xt.start+xt.count)*Xt)),It!==null?(fe=Math.max(fe,0),qe=Math.min(qe,It.count)):Bt!=null&&(fe=Math.max(fe,0),qe=Math.min(qe,Bt.count));const be=qe-fe;if(be<0||be===1/0)return;Ht.setup(Z,K,Pt,J,It);let xn,re=Ft;if(It!==null&&(xn=ct.get(It),re=Rt,re.setIndex(xn)),Z.isMesh)K.wireframe===!0?(G.setLineWidth(K.wireframeLinewidth*dt()),re.setMode(W.LINES)):re.setMode(W.TRIANGLES);else if(Z.isLine){let $t=K.linewidth;$t===void 0&&($t=1),G.setLineWidth($t*dt()),Z.isLineSegments?re.setMode(W.LINES):Z.isLineLoop?re.setMode(W.LINE_LOOP):re.setMode(W.LINE_STRIP)}else Z.isPoints?re.setMode(W.POINTS):Z.isSprite&&re.setMode(W.TRIANGLES);if(Z.isBatchedMesh)re.renderMultiDraw(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount);else if(Z.isInstancedMesh)re.renderInstances(fe,be,Z.count);else if(J.isInstancedBufferGeometry){const $t=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,la=Math.min(J.instanceCount,$t);re.renderInstances(fe,be,la)}else re.render(fe,be)};function te(w,X,J){w.transparent===!0&&w.side===pe&&w.forceSinglePass===!1?(w.side=Ve,w.needsUpdate=!0,fs(w,X,J),w.side=Gn,w.needsUpdate=!0,fs(w,X,J),w.side=pe):fs(w,X,J)}this.compile=function(w,X,J=null){J===null&&(J=w),m=Dt.get(J),m.init(),y.push(m),J.traverseVisible(function(Z){Z.isLight&&Z.layers.test(X.layers)&&(m.pushLight(Z),Z.castShadow&&m.pushShadow(Z))}),w!==J&&w.traverseVisible(function(Z){Z.isLight&&Z.layers.test(X.layers)&&(m.pushLight(Z),Z.castShadow&&m.pushShadow(Z))}),m.setupLights(v._useLegacyLights);const K=new Set;return w.traverse(function(Z){const xt=Z.material;if(xt)if(Array.isArray(xt))for(let At=0;At<xt.length;At++){const Pt=xt[At];te(Pt,J,Z),K.add(Pt)}else te(xt,J,Z),K.add(xt)}),y.pop(),m=null,K},this.compileAsync=function(w,X,J=null){const K=this.compile(w,X,J);return new Promise(Z=>{function xt(){if(K.forEach(function(At){Nt.get(At).currentProgram.isReady()&&K.delete(At)}),K.size===0){Z(w);return}setTimeout(xt,10)}O.get("KHR_parallel_shader_compile")!==null?xt():setTimeout(xt,10)})};let ee=null;function Te(w){ee&&ee(w)}function Fe(){Oe.stop()}function ne(){Oe.start()}const Oe=new Vl;Oe.setAnimationLoop(Te),typeof self<"u"&&Oe.setContext(self),this.setAnimationLoop=function(w){ee=w,qt.setAnimationLoop(w),w===null?Oe.stop():Oe.start()},qt.addEventListener("sessionstart",Fe),qt.addEventListener("sessionend",ne),this.render=function(w,X){if(X!==void 0&&X.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),qt.enabled===!0&&qt.isPresenting===!0&&(qt.cameraAutoUpdate===!0&&qt.updateCamera(X),X=qt.getCamera()),w.isScene===!0&&w.onBeforeRender(v,w,X,b),m=Dt.get(w,y.length),m.init(),y.push(m),ut.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),N.setFromProjectionMatrix(ut),nt=this.localClippingEnabled,V=Wt.init(this.clippingPlanes,nt),_=Tt.get(w,p.length),_.init(),p.push(_),pn(w,X,0,v.sortObjects),_.finish(),v.sortObjects===!0&&_.sort(it,st),this.info.render.frame++,V===!0&&Wt.beginShadows();const J=m.state.shadowsArray;if(ot.render(J,w,X),V===!0&&Wt.endShadows(),this.info.autoReset===!0&&this.info.reset(),Jt.render(_,w),m.setupLights(v._useLegacyLights),X.isArrayCamera){const K=X.cameras;for(let Z=0,xt=K.length;Z<xt;Z++){const At=K[Z];Rr(_,w,At,At.viewport)}}else Rr(_,w,X);b!==null&&(A.updateMultisampleRenderTarget(b),A.updateRenderTargetMipmap(b)),w.isScene===!0&&w.onAfterRender(v,w,X),Ht.resetDefaultState(),k=-1,x=null,y.pop(),y.length>0?m=y[y.length-1]:m=null,p.pop(),p.length>0?_=p[p.length-1]:_=null};function pn(w,X,J,K){if(w.visible===!1)return;if(w.layers.test(X.layers)){if(w.isGroup)J=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(X);else if(w.isLight)m.pushLight(w),w.castShadow&&m.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||N.intersectsSprite(w)){K&&St.setFromMatrixPosition(w.matrixWorld).applyMatrix4(ut);const At=ht.update(w),Pt=w.material;Pt.visible&&_.push(w,At,Pt,J,St.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||N.intersectsObject(w))){const At=ht.update(w),Pt=w.material;if(K&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),St.copy(w.boundingSphere.center)):(At.boundingSphere===null&&At.computeBoundingSphere(),St.copy(At.boundingSphere.center)),St.applyMatrix4(w.matrixWorld).applyMatrix4(ut)),Array.isArray(Pt)){const It=At.groups;for(let Xt=0,zt=It.length;Xt<zt;Xt++){const Bt=It[Xt],fe=Pt[Bt.materialIndex];fe&&fe.visible&&_.push(w,At,fe,J,St.z,Bt)}}else Pt.visible&&_.push(w,At,Pt,J,St.z,null)}}const xt=w.children;for(let At=0,Pt=xt.length;At<Pt;At++)pn(xt[At],X,J,K)}function Rr(w,X,J,K){const Z=w.opaque,xt=w.transmissive,At=w.transparent;m.setupLightsView(J),V===!0&&Wt.setGlobalState(v.clippingPlanes,J),xt.length>0&&vc(Z,xt,X,J),K&&G.viewport(T.copy(K)),Z.length>0&&ds(Z,X,J),xt.length>0&&ds(xt,X,J),At.length>0&&ds(At,X,J),G.buffers.depth.setTest(!0),G.buffers.depth.setMask(!0),G.buffers.color.setMask(!0),G.setPolygonOffset(!1)}function vc(w,X,J,K){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;const xt=q.isWebGL2;rt===null&&(rt=new ri(1,1,{generateMipmaps:!0,type:O.has("EXT_color_buffer_half_float")?is:Hn,minFilter:ns,samples:xt?4:0})),v.getDrawingBufferSize(Mt),xt?rt.setSize(Mt.x,Mt.y):rt.setSize(Js(Mt.x),Js(Mt.y));const At=v.getRenderTarget();v.setRenderTarget(rt),v.getClearColor(B),U=v.getClearAlpha(),U<1&&v.setClearColor(16777215,.5),v.clear();const Pt=v.toneMapping;v.toneMapping=kn,ds(w,J,K),A.updateMultisampleRenderTarget(rt),A.updateRenderTargetMipmap(rt);let It=!1;for(let Xt=0,zt=X.length;Xt<zt;Xt++){const Bt=X[Xt],fe=Bt.object,qe=Bt.geometry,be=Bt.material,xn=Bt.group;if(be.side===pe&&fe.layers.test(K.layers)){const re=be.side;be.side=Ve,be.needsUpdate=!0,Cr(fe,J,K,qe,be,xn),be.side=re,be.needsUpdate=!0,It=!0}}It===!0&&(A.updateMultisampleRenderTarget(rt),A.updateRenderTargetMipmap(rt)),v.setRenderTarget(At),v.setClearColor(B,U),v.toneMapping=Pt}function ds(w,X,J){const K=X.isScene===!0?X.overrideMaterial:null;for(let Z=0,xt=w.length;Z<xt;Z++){const At=w[Z],Pt=At.object,It=At.geometry,Xt=K===null?At.material:K,zt=At.group;Pt.layers.test(J.layers)&&Cr(Pt,X,J,It,Xt,zt)}}function Cr(w,X,J,K,Z,xt){w.onBeforeRender(v,X,J,K,Z,xt),w.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),Z.onBeforeRender(v,X,J,K,w,xt),Z.transparent===!0&&Z.side===pe&&Z.forceSinglePass===!1?(Z.side=Ve,Z.needsUpdate=!0,v.renderBufferDirect(J,X,K,Z,w,xt),Z.side=Gn,Z.needsUpdate=!0,v.renderBufferDirect(J,X,K,Z,w,xt),Z.side=pe):v.renderBufferDirect(J,X,K,Z,w,xt),w.onAfterRender(v,X,J,K,Z,xt)}function fs(w,X,J){X.isScene!==!0&&(X=yt);const K=Nt.get(w),Z=m.state.lights,xt=m.state.shadowsArray,At=Z.state.version,Pt=Et.getParameters(w,Z.state,xt,X,J),It=Et.getProgramCacheKey(Pt);let Xt=K.programs;K.environment=w.isMeshStandardMaterial?X.environment:null,K.fog=X.fog,K.envMap=(w.isMeshStandardMaterial?Y:S).get(w.envMap||K.environment),Xt===void 0&&(w.addEventListener("dispose",gt),Xt=new Map,K.programs=Xt);let zt=Xt.get(It);if(zt!==void 0){if(K.currentProgram===zt&&K.lightsStateVersion===At)return Lr(w,Pt),zt}else Pt.uniforms=Et.getUniforms(w),w.onBuild(J,Pt,v),w.onBeforeCompile(Pt,v),zt=Et.acquireProgram(Pt,It),Xt.set(It,zt),K.uniforms=Pt.uniforms;const Bt=K.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Bt.clippingPlanes=Wt.uniform),Lr(w,Pt),K.needsLights=Mc(w),K.lightsStateVersion=At,K.needsLights&&(Bt.ambientLightColor.value=Z.state.ambient,Bt.lightProbe.value=Z.state.probe,Bt.directionalLights.value=Z.state.directional,Bt.directionalLightShadows.value=Z.state.directionalShadow,Bt.spotLights.value=Z.state.spot,Bt.spotLightShadows.value=Z.state.spotShadow,Bt.rectAreaLights.value=Z.state.rectArea,Bt.ltc_1.value=Z.state.rectAreaLTC1,Bt.ltc_2.value=Z.state.rectAreaLTC2,Bt.pointLights.value=Z.state.point,Bt.pointLightShadows.value=Z.state.pointShadow,Bt.hemisphereLights.value=Z.state.hemi,Bt.directionalShadowMap.value=Z.state.directionalShadowMap,Bt.directionalShadowMatrix.value=Z.state.directionalShadowMatrix,Bt.spotShadowMap.value=Z.state.spotShadowMap,Bt.spotLightMatrix.value=Z.state.spotLightMatrix,Bt.spotLightMap.value=Z.state.spotLightMap,Bt.pointShadowMap.value=Z.state.pointShadowMap,Bt.pointShadowMatrix.value=Z.state.pointShadowMatrix),K.currentProgram=zt,K.uniformsList=null,zt}function Pr(w){if(w.uniformsList===null){const X=w.currentProgram.getUniforms();w.uniformsList=Xs.seqWithValue(X.seq,w.uniforms)}return w.uniformsList}function Lr(w,X){const J=Nt.get(w);J.outputColorSpace=X.outputColorSpace,J.batching=X.batching,J.instancing=X.instancing,J.instancingColor=X.instancingColor,J.skinning=X.skinning,J.morphTargets=X.morphTargets,J.morphNormals=X.morphNormals,J.morphColors=X.morphColors,J.morphTargetsCount=X.morphTargetsCount,J.numClippingPlanes=X.numClippingPlanes,J.numIntersection=X.numClipIntersection,J.vertexAlphas=X.vertexAlphas,J.vertexTangents=X.vertexTangents,J.toneMapping=X.toneMapping}function xc(w,X,J,K,Z){X.isScene!==!0&&(X=yt),A.resetTextureUnits();const xt=X.fog,At=K.isMeshStandardMaterial?X.environment:null,Pt=b===null?v.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:Cn,It=(K.isMeshStandardMaterial?Y:S).get(K.envMap||At),Xt=K.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,zt=!!J.attributes.tangent&&(!!K.normalMap||K.anisotropy>0),Bt=!!J.morphAttributes.position,fe=!!J.morphAttributes.normal,qe=!!J.morphAttributes.color;let be=kn;K.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(be=v.toneMapping);const xn=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,re=xn!==void 0?xn.length:0,$t=Nt.get(K),la=m.state.lights;if(V===!0&&(nt===!0||w!==x)){const Qe=w===x&&K.id===k;Wt.setState(K,w,Qe)}let ue=!1;K.version===$t.__version?($t.needsLights&&$t.lightsStateVersion!==la.state.version||$t.outputColorSpace!==Pt||Z.isBatchedMesh&&$t.batching===!1||!Z.isBatchedMesh&&$t.batching===!0||Z.isInstancedMesh&&$t.instancing===!1||!Z.isInstancedMesh&&$t.instancing===!0||Z.isSkinnedMesh&&$t.skinning===!1||!Z.isSkinnedMesh&&$t.skinning===!0||Z.isInstancedMesh&&$t.instancingColor===!0&&Z.instanceColor===null||Z.isInstancedMesh&&$t.instancingColor===!1&&Z.instanceColor!==null||$t.envMap!==It||K.fog===!0&&$t.fog!==xt||$t.numClippingPlanes!==void 0&&($t.numClippingPlanes!==Wt.numPlanes||$t.numIntersection!==Wt.numIntersection)||$t.vertexAlphas!==Xt||$t.vertexTangents!==zt||$t.morphTargets!==Bt||$t.morphNormals!==fe||$t.morphColors!==qe||$t.toneMapping!==be||q.isWebGL2===!0&&$t.morphTargetsCount!==re)&&(ue=!0):(ue=!0,$t.__version=K.version);let qn=$t.currentProgram;ue===!0&&(qn=fs(K,X,Z));let Dr=!1,Wi=!1,ca=!1;const De=qn.getUniforms(),$n=$t.uniforms;if(G.useProgram(qn.program)&&(Dr=!0,Wi=!0,ca=!0),K.id!==k&&(k=K.id,Wi=!0),Dr||x!==w){De.setValue(W,"projectionMatrix",w.projectionMatrix),De.setValue(W,"viewMatrix",w.matrixWorldInverse);const Qe=De.map.cameraPosition;Qe!==void 0&&Qe.setValue(W,St.setFromMatrixPosition(w.matrixWorld)),q.logarithmicDepthBuffer&&De.setValue(W,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(K.isMeshPhongMaterial||K.isMeshToonMaterial||K.isMeshLambertMaterial||K.isMeshBasicMaterial||K.isMeshStandardMaterial||K.isShaderMaterial)&&De.setValue(W,"isOrthographic",w.isOrthographicCamera===!0),x!==w&&(x=w,Wi=!0,ca=!0)}if(Z.isSkinnedMesh){De.setOptional(W,Z,"bindMatrix"),De.setOptional(W,Z,"bindMatrixInverse");const Qe=Z.skeleton;Qe&&(q.floatVertexTextures?(Qe.boneTexture===null&&Qe.computeBoneTexture(),De.setValue(W,"boneTexture",Qe.boneTexture,A)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}Z.isBatchedMesh&&(De.setOptional(W,Z,"batchingTexture"),De.setValue(W,"batchingTexture",Z._matricesTexture,A));const ha=J.morphAttributes;if((ha.position!==void 0||ha.normal!==void 0||ha.color!==void 0&&q.isWebGL2===!0)&&jt.update(Z,J,qn),(Wi||$t.receiveShadow!==Z.receiveShadow)&&($t.receiveShadow=Z.receiveShadow,De.setValue(W,"receiveShadow",Z.receiveShadow)),K.isMeshGouraudMaterial&&K.envMap!==null&&($n.envMap.value=It,$n.flipEnvMap.value=It.isCubeTexture&&It.isRenderTargetTexture===!1?-1:1),Wi&&(De.setValue(W,"toneMappingExposure",v.toneMappingExposure),$t.needsLights&&yc($n,ca),xt&&K.fog===!0&&_t.refreshFogUniforms($n,xt),_t.refreshMaterialUniforms($n,K,tt,$,rt),Xs.upload(W,Pr($t),$n,A)),K.isShaderMaterial&&K.uniformsNeedUpdate===!0&&(Xs.upload(W,Pr($t),$n,A),K.uniformsNeedUpdate=!1),K.isSpriteMaterial&&De.setValue(W,"center",Z.center),De.setValue(W,"modelViewMatrix",Z.modelViewMatrix),De.setValue(W,"normalMatrix",Z.normalMatrix),De.setValue(W,"modelMatrix",Z.matrixWorld),K.isShaderMaterial||K.isRawShaderMaterial){const Qe=K.uniformsGroups;for(let ua=0,Sc=Qe.length;ua<Sc;ua++)if(q.isWebGL2){const Ur=Qe[ua];Zt.update(Ur,qn),Zt.bind(Ur,qn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return qn}function yc(w,X){w.ambientLightColor.needsUpdate=X,w.lightProbe.needsUpdate=X,w.directionalLights.needsUpdate=X,w.directionalLightShadows.needsUpdate=X,w.pointLights.needsUpdate=X,w.pointLightShadows.needsUpdate=X,w.spotLights.needsUpdate=X,w.spotLightShadows.needsUpdate=X,w.rectAreaLights.needsUpdate=X,w.hemisphereLights.needsUpdate=X}function Mc(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return I},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(w,X,J){Nt.get(w.texture).__webglTexture=X,Nt.get(w.depthTexture).__webglTexture=J;const K=Nt.get(w);K.__hasExternalTextures=!0,K.__hasExternalTextures&&(K.__autoAllocateDepthBuffer=J===void 0,K.__autoAllocateDepthBuffer||O.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),K.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(w,X){const J=Nt.get(w);J.__webglFramebuffer=X,J.__useDefaultFramebuffer=X===void 0},this.setRenderTarget=function(w,X=0,J=0){b=w,I=X,C=J;let K=!0,Z=null,xt=!1,At=!1;if(w){const It=Nt.get(w);It.__useDefaultFramebuffer!==void 0?(G.bindFramebuffer(W.FRAMEBUFFER,null),K=!1):It.__webglFramebuffer===void 0?A.setupRenderTarget(w):It.__hasExternalTextures&&A.rebindTextures(w,Nt.get(w.texture).__webglTexture,Nt.get(w.depthTexture).__webglTexture);const Xt=w.texture;(Xt.isData3DTexture||Xt.isDataArrayTexture||Xt.isCompressedArrayTexture)&&(At=!0);const zt=Nt.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(zt[X])?Z=zt[X][J]:Z=zt[X],xt=!0):q.isWebGL2&&w.samples>0&&A.useMultisampledRTT(w)===!1?Z=Nt.get(w).__webglMultisampledFramebuffer:Array.isArray(zt)?Z=zt[J]:Z=zt,T.copy(w.viewport),E.copy(w.scissor),R=w.scissorTest}else T.copy(et).multiplyScalar(tt).floor(),E.copy(at).multiplyScalar(tt).floor(),R=z;if(G.bindFramebuffer(W.FRAMEBUFFER,Z)&&q.drawBuffers&&K&&G.drawBuffers(w,Z),G.viewport(T),G.scissor(E),G.setScissorTest(R),xt){const It=Nt.get(w.texture);W.framebufferTexture2D(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_CUBE_MAP_POSITIVE_X+X,It.__webglTexture,J)}else if(At){const It=Nt.get(w.texture),Xt=X||0;W.framebufferTextureLayer(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,It.__webglTexture,J||0,Xt)}k=-1},this.readRenderTargetPixels=function(w,X,J,K,Z,xt,At){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pt=Nt.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&At!==void 0&&(Pt=Pt[At]),Pt){G.bindFramebuffer(W.FRAMEBUFFER,Pt);try{const It=w.texture,Xt=It.format,zt=It.type;if(Xt!==an&&bt.convert(Xt)!==W.getParameter(W.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Bt=zt===is&&(O.has("EXT_color_buffer_half_float")||q.isWebGL2&&O.has("EXT_color_buffer_float"));if(zt!==Hn&&bt.convert(zt)!==W.getParameter(W.IMPLEMENTATION_COLOR_READ_TYPE)&&!(zt===zn&&(q.isWebGL2||O.has("OES_texture_float")||O.has("WEBGL_color_buffer_float")))&&!Bt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=w.width-K&&J>=0&&J<=w.height-Z&&W.readPixels(X,J,K,Z,bt.convert(Xt),bt.convert(zt),xt)}finally{const It=b!==null?Nt.get(b).__webglFramebuffer:null;G.bindFramebuffer(W.FRAMEBUFFER,It)}}},this.copyFramebufferToTexture=function(w,X,J=0){const K=Math.pow(2,-J),Z=Math.floor(X.image.width*K),xt=Math.floor(X.image.height*K);A.setTexture2D(X,0),W.copyTexSubImage2D(W.TEXTURE_2D,J,0,0,w.x,w.y,Z,xt),G.unbindTexture()},this.copyTextureToTexture=function(w,X,J,K=0){const Z=X.image.width,xt=X.image.height,At=bt.convert(J.format),Pt=bt.convert(J.type);A.setTexture2D(J,0),W.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,J.flipY),W.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,J.premultiplyAlpha),W.pixelStorei(W.UNPACK_ALIGNMENT,J.unpackAlignment),X.isDataTexture?W.texSubImage2D(W.TEXTURE_2D,K,w.x,w.y,Z,xt,At,Pt,X.image.data):X.isCompressedTexture?W.compressedTexSubImage2D(W.TEXTURE_2D,K,w.x,w.y,X.mipmaps[0].width,X.mipmaps[0].height,At,X.mipmaps[0].data):W.texSubImage2D(W.TEXTURE_2D,K,w.x,w.y,At,Pt,X.image),K===0&&J.generateMipmaps&&W.generateMipmap(W.TEXTURE_2D),G.unbindTexture()},this.copyTextureToTexture3D=function(w,X,J,K,Z=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const xt=w.max.x-w.min.x+1,At=w.max.y-w.min.y+1,Pt=w.max.z-w.min.z+1,It=bt.convert(K.format),Xt=bt.convert(K.type);let zt;if(K.isData3DTexture)A.setTexture3D(K,0),zt=W.TEXTURE_3D;else if(K.isDataArrayTexture||K.isCompressedArrayTexture)A.setTexture2DArray(K,0),zt=W.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}W.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,K.flipY),W.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,K.premultiplyAlpha),W.pixelStorei(W.UNPACK_ALIGNMENT,K.unpackAlignment);const Bt=W.getParameter(W.UNPACK_ROW_LENGTH),fe=W.getParameter(W.UNPACK_IMAGE_HEIGHT),qe=W.getParameter(W.UNPACK_SKIP_PIXELS),be=W.getParameter(W.UNPACK_SKIP_ROWS),xn=W.getParameter(W.UNPACK_SKIP_IMAGES),re=J.isCompressedTexture?J.mipmaps[Z]:J.image;W.pixelStorei(W.UNPACK_ROW_LENGTH,re.width),W.pixelStorei(W.UNPACK_IMAGE_HEIGHT,re.height),W.pixelStorei(W.UNPACK_SKIP_PIXELS,w.min.x),W.pixelStorei(W.UNPACK_SKIP_ROWS,w.min.y),W.pixelStorei(W.UNPACK_SKIP_IMAGES,w.min.z),J.isDataTexture||J.isData3DTexture?W.texSubImage3D(zt,Z,X.x,X.y,X.z,xt,At,Pt,It,Xt,re.data):J.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),W.compressedTexSubImage3D(zt,Z,X.x,X.y,X.z,xt,At,Pt,It,re.data)):W.texSubImage3D(zt,Z,X.x,X.y,X.z,xt,At,Pt,It,Xt,re),W.pixelStorei(W.UNPACK_ROW_LENGTH,Bt),W.pixelStorei(W.UNPACK_IMAGE_HEIGHT,fe),W.pixelStorei(W.UNPACK_SKIP_PIXELS,qe),W.pixelStorei(W.UNPACK_SKIP_ROWS,be),W.pixelStorei(W.UNPACK_SKIP_IMAGES,xn),Z===0&&K.generateMipmaps&&W.generateMipmap(zt),G.unbindTexture()},this.initTexture=function(w){w.isCubeTexture?A.setTextureCube(w,0):w.isData3DTexture?A.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?A.setTexture2DArray(w,0):A.setTexture2D(w,0),G.unbindTexture()},this.resetState=function(){I=0,C=0,b=null,G.reset(),Ht.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Rn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===gr?"display-p3":"srgb",e.unpackColorSpace=Kt.workingColorSpace===ea?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Pe?ai:Ll}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===ai?Pe:Cn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class Hm extends Jl{}Hm.prototype.isWebGL1Renderer=!0;class Sr{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new kt(t),this.near=e,this.far=n}clone(){return new Sr(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Gm extends Le{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class Vm extends Xe{constructor(t=null,e=1,n=1,s,a,o,r,l,c=Ce,h=Ce,u,d){super(null,o,r,l,c,h,s,a,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class as extends ui{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new kt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const el=new L,nl=new L,il=new me,Ha=new vr,Fs=new na;class Tr extends Le{constructor(t=new Ae,e=new as){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,a=e.count;s<a;s++)el.fromBufferAttribute(e,s-1),nl.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=el.distanceTo(nl);t.setAttribute("lineDistance",new Qt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,a=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Fs.copy(n.boundingSphere),Fs.applyMatrix4(s),Fs.radius+=a,t.ray.intersectsSphere(Fs)===!1)return;il.copy(s).invert(),Ha.copy(t.ray).applyMatrix4(il);const r=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=new L,h=new L,u=new L,d=new L,f=this.isLineSegments?2:1,g=n.index,m=n.attributes.position;if(g!==null){const p=Math.max(0,o.start),y=Math.min(g.count,o.start+o.count);for(let v=p,M=y-1;v<M;v+=f){const I=g.getX(v),C=g.getX(v+1);if(c.fromBufferAttribute(m,I),h.fromBufferAttribute(m,C),Ha.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);const k=t.ray.origin.distanceTo(d);k<t.near||k>t.far||e.push({distance:k,point:u.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}else{const p=Math.max(0,o.start),y=Math.min(m.count,o.start+o.count);for(let v=p,M=y-1;v<M;v+=f){if(c.fromBufferAttribute(m,v),h.fromBufferAttribute(m,v+1),Ha.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);const C=t.ray.origin.distanceTo(d);C<t.near||C>t.far||e.push({distance:C,point:u.clone().applyMatrix4(this.matrixWorld),index:v,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,o=s.length;a<o;a++){const r=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=a}}}}}const sl=new L,al=new L;class Kl extends Tr{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,a=e.count;s<a;s+=2)sl.fromBufferAttribute(e,s),al.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+sl.distanceTo(al);t.setAttribute("lineDistance",new Qt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Wm extends Tr{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}}class vn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),a=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),a+=n.distanceTo(s),e.push(a),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const a=n.length;let o;e?o=e:o=t*n[a-1];let r=0,l=a-1,c;for(;r<=l;)if(s=Math.floor(r+(l-r)/2),c=n[s]-o,c<0)r=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(a-1);const h=n[s],d=n[s+1]-h,f=(o-h)/d;return(s+f)/(a-1)}getTangent(t,e){let s=t-1e-4,a=t+1e-4;s<0&&(s=0),a>1&&(a=1);const o=this.getPoint(s),r=this.getPoint(a),l=e||(o.isVector2?new vt:new L);return l.copy(r).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new L,s=[],a=[],o=[],r=new L,l=new me;for(let f=0;f<=t;f++){const g=f/t;s[f]=this.getTangentAt(g,new L)}a[0]=new L,o[0]=new L;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),r.crossVectors(s[0],n).normalize(),a[0].crossVectors(s[0],r),o[0].crossVectors(s[0],a[0]);for(let f=1;f<=t;f++){if(a[f]=a[f-1].clone(),o[f]=o[f-1].clone(),r.crossVectors(s[f-1],s[f]),r.length()>Number.EPSILON){r.normalize();const g=Math.acos(xe(s[f-1].dot(s[f]),-1,1));a[f].applyMatrix4(l.makeRotationAxis(r,g))}o[f].crossVectors(s[f],a[f])}if(e===!0){let f=Math.acos(xe(a[0].dot(a[t]),-1,1));f/=t,s[0].dot(r.crossVectors(a[0],a[t]))>0&&(f=-f);for(let g=1;g<=t;g++)a[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),o[g].crossVectors(s[g],a[g])}return{tangents:s,normals:a,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class br extends vn{constructor(t=0,e=0,n=1,s=1,a=0,o=Math.PI*2,r=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=a,this.aEndAngle=o,this.aClockwise=r,this.aRotation=l}getPoint(t,e){const n=e||new vt,s=Math.PI*2;let a=this.aEndAngle-this.aStartAngle;const o=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=s;for(;a>s;)a-=s;a<Number.EPSILON&&(o?a=0:a=s),this.aClockwise===!0&&!o&&(a===s?a=-s:a=a-s);const r=this.aStartAngle+t*a;let l=this.aX+this.xRadius*Math.cos(r),c=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Xm extends br{constructor(t,e,n,s,a,o){super(t,e,n,n,s,a,o),this.isArcCurve=!0,this.type="ArcCurve"}}function wr(){let i=0,t=0,e=0,n=0;function s(a,o,r,l){i=a,t=r,e=-3*a+3*o-2*r-l,n=2*a-2*o+r+l}return{initCatmullRom:function(a,o,r,l,c){s(o,r,c*(r-a),c*(l-o))},initNonuniformCatmullRom:function(a,o,r,l,c,h,u){let d=(o-a)/c-(r-a)/(c+h)+(r-o)/h,f=(r-o)/h-(l-o)/(h+u)+(l-r)/u;d*=h,f*=h,s(o,r,d,f)},calc:function(a){const o=a*a,r=o*a;return i+t*a+e*o+n*r}}}const Os=new L,Ga=new wr,Va=new wr,Wa=new wr;class qm extends vn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new L){const n=e,s=this.points,a=s.length,o=(a-(this.closed?0:1))*t;let r=Math.floor(o),l=o-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/a)+1)*a:l===0&&r===a-1&&(r=a-2,l=1);let c,h;this.closed||r>0?c=s[(r-1)%a]:(Os.subVectors(s[0],s[1]).add(s[0]),c=Os);const u=s[r%a],d=s[(r+1)%a];if(this.closed||r+2<a?h=s[(r+2)%a]:(Os.subVectors(s[a-1],s[a-2]).add(s[a-1]),h=Os),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Ga.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,_,m),Va.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,_,m),Wa.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(Ga.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Va.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Wa.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(Ga.calc(l),Va.calc(l),Wa.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new L().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function rl(i,t,e,n,s){const a=(n-t)*.5,o=(s-e)*.5,r=i*i,l=i*r;return(2*e-2*n+a+o)*l+(-3*e+3*n-2*a-o)*r+a*i+e}function $m(i,t){const e=1-i;return e*e*t}function Ym(i,t){return 2*(1-i)*i*t}function jm(i,t){return i*i*t}function Qi(i,t,e,n){return $m(i,t)+Ym(i,e)+jm(i,n)}function Zm(i,t){const e=1-i;return e*e*e*t}function Jm(i,t){const e=1-i;return 3*e*e*i*t}function Km(i,t){return 3*(1-i)*i*i*t}function Qm(i,t){return i*i*i*t}function ts(i,t,e,n,s){return Zm(i,t)+Jm(i,e)+Km(i,n)+Qm(i,s)}class Ql extends vn{constructor(t=new vt,e=new vt,n=new vt,s=new vt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new vt){const n=e,s=this.v0,a=this.v1,o=this.v2,r=this.v3;return n.set(ts(t,s.x,a.x,o.x,r.x),ts(t,s.y,a.y,o.y,r.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class t0 extends vn{constructor(t=new L,e=new L,n=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new L){const n=e,s=this.v0,a=this.v1,o=this.v2,r=this.v3;return n.set(ts(t,s.x,a.x,o.x,r.x),ts(t,s.y,a.y,o.y,r.y),ts(t,s.z,a.z,o.z,r.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class tc extends vn{constructor(t=new vt,e=new vt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new vt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new vt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class e0 extends vn{constructor(t=new L,e=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new L){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new L){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class ec extends vn{constructor(t=new vt,e=new vt,n=new vt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new vt){const n=e,s=this.v0,a=this.v1,o=this.v2;return n.set(Qi(t,s.x,a.x,o.x),Qi(t,s.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class n0 extends vn{constructor(t=new L,e=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new L){const n=e,s=this.v0,a=this.v1,o=this.v2;return n.set(Qi(t,s.x,a.x,o.x),Qi(t,s.y,a.y,o.y),Qi(t,s.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class nc extends vn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new vt){const n=e,s=this.points,a=(s.length-1)*t,o=Math.floor(a),r=a-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(rl(r,l.x,c.x,h.x,u.x),rl(r,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new vt().fromArray(s))}return this}}var ol=Object.freeze({__proto__:null,ArcCurve:Xm,CatmullRomCurve3:qm,CubicBezierCurve:Ql,CubicBezierCurve3:t0,EllipseCurve:br,LineCurve:tc,LineCurve3:e0,QuadraticBezierCurve:ec,QuadraticBezierCurve3:n0,SplineCurve:nc});class i0 extends vn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ol[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let a=0;for(;a<s.length;){if(s[a]>=n){const o=s[a]-n,r=this.curves[a],l=r.getLength(),c=l===0?0:1-o/l;return r.getPointAt(c,e)}a++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,a=this.curves;s<a.length;s++){const o=a[s],r=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(r);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new ol[s.type]().fromJSON(s))}return this}}class ar extends i0{constructor(t){super(),this.type="Path",this.currentPoint=new vt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new tc(this.currentPoint.clone(),new vt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const a=new ec(this.currentPoint.clone(),new vt(t,e),new vt(n,s));return this.curves.push(a),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,a,o){const r=new Ql(this.currentPoint.clone(),new vt(t,e),new vt(n,s),new vt(a,o));return this.curves.push(r),this.currentPoint.set(a,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new nc(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,a,o){const r=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+r,e+l,n,s,a,o),this}absarc(t,e,n,s,a,o){return this.absellipse(t,e,n,n,s,a,o),this}ellipse(t,e,n,s,a,o,r,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,a,o,r,l),this}absellipse(t,e,n,s,a,o,r,l){const c=new br(t,e,n,s,a,o,r,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Er extends Ae{constructor(t=[new vt(0,-.5),new vt(.5,0),new vt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=xe(s,0,Math.PI*2);const a=[],o=[],r=[],l=[],c=[],h=1/e,u=new L,d=new vt,f=new L,g=new L,_=new L;let m=0,p=0;for(let y=0;y<=t.length-1;y++)switch(y){case 0:m=t[y+1].x-t[y].x,p=t[y+1].y-t[y].y,f.x=p*1,f.y=-m,f.z=p*0,_.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case t.length-1:l.push(_.x,_.y,_.z);break;default:m=t[y+1].x-t[y].x,p=t[y+1].y-t[y].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=_.x,f.y+=_.y,f.z+=_.z,f.normalize(),l.push(f.x,f.y,f.z),_.copy(g)}for(let y=0;y<=e;y++){const v=n+y*h*s,M=Math.sin(v),I=Math.cos(v);for(let C=0;C<=t.length-1;C++){u.x=t[C].x*M,u.y=t[C].y,u.z=t[C].x*I,o.push(u.x,u.y,u.z),d.x=y/e,d.y=C/(t.length-1),r.push(d.x,d.y);const b=l[3*C+0]*M,k=l[3*C+1],x=l[3*C+0]*I;c.push(b,k,x)}}for(let y=0;y<e;y++)for(let v=0;v<t.length-1;v++){const M=v+y*t.length,I=M,C=M+t.length,b=M+t.length+1,k=M+1;a.push(I,C,k),a.push(b,k,C)}this.setIndex(a),this.setAttribute("position",new Qt(o,3)),this.setAttribute("uv",new Qt(r,2)),this.setAttribute("normal",new Qt(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Er(t.points,t.segments,t.phiStart,t.phiLength)}}class Pn extends Er{constructor(t=1,e=1,n=4,s=8){const a=new ar;a.absarc(0,-e/2,t,Math.PI*1.5,0),a.absarc(0,e/2,t,0,Math.PI*.5),super(a.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:s}}static fromJSON(t){return new Pn(t.radius,t.length,t.capSegments,t.radialSegments)}}class aa extends Ae{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const a=[],o=[],r=[],l=[],c=new L,h=new vt;o.push(0,0,0),r.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*s;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),r.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)a.push(u,u+1,0);this.setIndex(a),this.setAttribute("position",new Qt(o,3)),this.setAttribute("normal",new Qt(r,3)),this.setAttribute("uv",new Qt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new aa(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class wt extends Ae{constructor(t=1,e=1,n=1,s=32,a=1,o=!1,r=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:a,openEnded:o,thetaStart:r,thetaLength:l};const c=this;s=Math.floor(s),a=Math.floor(a);const h=[],u=[],d=[],f=[];let g=0;const _=[],m=n/2;let p=0;y(),o===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new Qt(u,3)),this.setAttribute("normal",new Qt(d,3)),this.setAttribute("uv",new Qt(f,2));function y(){const M=new L,I=new L;let C=0;const b=(e-t)/n;for(let k=0;k<=a;k++){const x=[],T=k/a,E=T*(e-t)+t;for(let R=0;R<=s;R++){const B=R/s,U=B*l+r,H=Math.sin(U),$=Math.cos(U);I.x=E*H,I.y=-T*n+m,I.z=E*$,u.push(I.x,I.y,I.z),M.set(H,b,$).normalize(),d.push(M.x,M.y,M.z),f.push(B,1-T),x.push(g++)}_.push(x)}for(let k=0;k<s;k++)for(let x=0;x<a;x++){const T=_[x][k],E=_[x+1][k],R=_[x+1][k+1],B=_[x][k+1];h.push(T,E,B),h.push(E,R,B),C+=6}c.addGroup(p,C,0),p+=C}function v(M){const I=g,C=new vt,b=new L;let k=0;const x=M===!0?t:e,T=M===!0?1:-1;for(let R=1;R<=s;R++)u.push(0,m*T,0),d.push(0,T,0),f.push(.5,.5),g++;const E=g;for(let R=0;R<=s;R++){const U=R/s*l+r,H=Math.cos(U),$=Math.sin(U);b.x=x*$,b.y=m*T,b.z=x*H,u.push(b.x,b.y,b.z),d.push(0,T,0),C.x=H*.5+.5,C.y=$*.5*T+.5,f.push(C.x,C.y),g++}for(let R=0;R<s;R++){const B=I+R,U=E+R;M===!0?h.push(U,U+1,B):h.push(U+1,U,B),k+=3}c.addGroup(p,k,M===!0?1:2),p+=k}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wt(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class li extends wt{constructor(t=1,e=1,n=32,s=1,a=!1,o=0,r=Math.PI*2){super(0,t,e,n,s,a,o,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:r}}static fromJSON(t){return new li(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}const zs=new L,Bs=new L,Xa=new L,ks=new nn;class s0 extends Ae{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const s=Math.pow(10,4),a=Math.cos(Ni*e),o=t.getIndex(),r=t.getAttribute("position"),l=o?o.count:r.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d={},f=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:_,b:m,c:p}=ks;if(_.fromBufferAttribute(r,c[0]),m.fromBufferAttribute(r,c[1]),p.fromBufferAttribute(r,c[2]),ks.getNormal(Xa),u[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,u[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,u[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let y=0;y<3;y++){const v=(y+1)%3,M=u[y],I=u[v],C=ks[h[y]],b=ks[h[v]],k=`${M}_${I}`,x=`${I}_${M}`;x in d&&d[x]?(Xa.dot(d[x].normal)<=a&&(f.push(C.x,C.y,C.z),f.push(b.x,b.y,b.z)),d[x]=null):k in d||(d[k]={index0:c[y],index1:c[v],normal:Xa.clone()})}}for(const g in d)if(d[g]){const{index0:_,index1:m}=d[g];zs.fromBufferAttribute(r,_),Bs.fromBufferAttribute(r,m),f.push(zs.x,zs.y,zs.z),f.push(Bs.x,Bs.y,Bs.z)}this.setAttribute("position",new Qt(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class ic extends ar{constructor(t){super(t),this.uuid=hi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new ar().fromJSON(s))}return this}}const a0={triangulate:function(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let a=sc(i,0,s,e,!0);const o=[];if(!a||a.next===a.prev)return o;let r,l,c,h,u,d,f;if(n&&(a=h0(i,t,a,e)),i.length>80*e){r=c=i[0],l=h=i[1];for(let g=e;g<s;g+=e)u=i[g],d=i[g+1],u<r&&(r=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);f=Math.max(c-r,h-l),f=f!==0?32767/f:0}return rs(a,o,e,r,l,f,0),o}};function sc(i,t,e,n,s){let a,o;if(s===M0(i,t,e,n)>0)for(a=t;a<e;a+=n)o=ll(a,i[a],i[a+1],o);else for(a=e-n;a>=t;a-=n)o=ll(a,i[a],i[a+1],o);return o&&ra(o,o.next)&&(ls(o),o=o.next),o}function ci(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(ra(e,e.next)||ce(e.prev,e,e.next)===0)){if(ls(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function rs(i,t,e,n,s,a,o){if(!i)return;!o&&a&&m0(i,n,s,a);let r=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,a?o0(i,n,s,a):r0(i)){t.push(l.i/e|0),t.push(i.i/e|0),t.push(c.i/e|0),ls(i),i=c.next,r=c.next;continue}if(i=c,i===r){o?o===1?(i=l0(ci(i),t,e),rs(i,t,e,n,s,a,2)):o===2&&c0(i,t,e,n,s,a):rs(ci(i),t,e,n,s,a,1);break}}}function r0(i){const t=i.prev,e=i,n=i.next;if(ce(t,e,n)>=0)return!1;const s=t.x,a=e.x,o=n.x,r=t.y,l=e.y,c=n.y,h=s<a?s<o?s:o:a<o?a:o,u=r<l?r<c?r:c:l<c?l:c,d=s>a?s>o?s:o:a>o?a:o,f=r>l?r>c?r:c:l>c?l:c;let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&Ui(s,r,a,l,o,c,g.x,g.y)&&ce(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function o0(i,t,e,n){const s=i.prev,a=i,o=i.next;if(ce(s,a,o)>=0)return!1;const r=s.x,l=a.x,c=o.x,h=s.y,u=a.y,d=o.y,f=r<l?r<c?r:c:l<c?l:c,g=h<u?h<d?h:d:u<d?u:d,_=r>l?r>c?r:c:l>c?l:c,m=h>u?h>d?h:d:u>d?u:d,p=rr(f,g,t,e,n),y=rr(_,m,t,e,n);let v=i.prevZ,M=i.nextZ;for(;v&&v.z>=p&&M&&M.z<=y;){if(v.x>=f&&v.x<=_&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Ui(r,h,l,u,c,d,v.x,v.y)&&ce(v.prev,v,v.next)>=0||(v=v.prevZ,M.x>=f&&M.x<=_&&M.y>=g&&M.y<=m&&M!==s&&M!==o&&Ui(r,h,l,u,c,d,M.x,M.y)&&ce(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;v&&v.z>=p;){if(v.x>=f&&v.x<=_&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Ui(r,h,l,u,c,d,v.x,v.y)&&ce(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;M&&M.z<=y;){if(M.x>=f&&M.x<=_&&M.y>=g&&M.y<=m&&M!==s&&M!==o&&Ui(r,h,l,u,c,d,M.x,M.y)&&ce(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function l0(i,t,e){let n=i;do{const s=n.prev,a=n.next.next;!ra(s,a)&&ac(s,n,n.next,a)&&os(s,a)&&os(a,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(a.i/e|0),ls(n),ls(n.next),n=i=a),n=n.next}while(n!==i);return ci(n)}function c0(i,t,e,n,s,a){let o=i;do{let r=o.next.next;for(;r!==o.prev;){if(o.i!==r.i&&v0(o,r)){let l=rc(o,r);o=ci(o,o.next),l=ci(l,l.next),rs(o,t,e,n,s,a,0),rs(l,t,e,n,s,a,0);return}r=r.next}o=o.next}while(o!==i)}function h0(i,t,e,n){const s=[];let a,o,r,l,c;for(a=0,o=t.length;a<o;a++)r=t[a]*n,l=a<o-1?t[a+1]*n:i.length,c=sc(i,r,l,n,!1),c===c.next&&(c.steiner=!0),s.push(_0(c));for(s.sort(u0),a=0;a<s.length;a++)e=d0(s[a],e);return e}function u0(i,t){return i.x-t.x}function d0(i,t){const e=f0(i,t);if(!e)return t;const n=rc(e,i);return ci(n,n.next),ci(e,e.next)}function f0(i,t){let e=t,n=-1/0,s;const a=i.x,o=i.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=a&&d>n&&(n=d,s=e.x<e.next.x?e:e.next,d===a))return s}e=e.next}while(e!==t);if(!s)return null;const r=s,l=s.x,c=s.y;let h=1/0,u;e=s;do a>=e.x&&e.x>=l&&a!==e.x&&Ui(o<c?a:n,o,l,c,o<c?n:a,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(a-e.x),os(e,i)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&p0(s,e)))&&(s=e,h=u)),e=e.next;while(e!==r);return s}function p0(i,t){return ce(i.prev,i,t.prev)<0&&ce(t.next,i,i.next)<0}function m0(i,t,e,n){let s=i;do s.z===0&&(s.z=rr(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,g0(s)}function g0(i){let t,e,n,s,a,o,r,l,c=1;do{for(e=i,i=null,a=null,o=0;e;){for(o++,n=e,r=0,t=0;t<c&&(r++,n=n.nextZ,!!n);t++);for(l=c;r>0||l>0&&n;)r!==0&&(l===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,r--):(s=n,n=n.nextZ,l--),a?a.nextZ=s:i=s,s.prevZ=a,a=s;e=n}a.nextZ=null,c*=2}while(o>1);return i}function rr(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function _0(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Ui(i,t,e,n,s,a,o,r){return(s-o)*(t-r)>=(i-o)*(a-r)&&(i-o)*(n-r)>=(e-o)*(t-r)&&(e-o)*(a-r)>=(s-o)*(n-r)}function v0(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!x0(i,t)&&(os(i,t)&&os(t,i)&&y0(i,t)&&(ce(i.prev,i,t.prev)||ce(i,t.prev,t))||ra(i,t)&&ce(i.prev,i,i.next)>0&&ce(t.prev,t,t.next)>0)}function ce(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function ra(i,t){return i.x===t.x&&i.y===t.y}function ac(i,t,e,n){const s=Gs(ce(i,t,e)),a=Gs(ce(i,t,n)),o=Gs(ce(e,n,i)),r=Gs(ce(e,n,t));return!!(s!==a&&o!==r||s===0&&Hs(i,e,t)||a===0&&Hs(i,n,t)||o===0&&Hs(e,i,n)||r===0&&Hs(e,t,n))}function Hs(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Gs(i){return i>0?1:i<0?-1:0}function x0(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&ac(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function os(i,t){return ce(i.prev,i,i.next)<0?ce(i,t,i.next)>=0&&ce(i,i.prev,t)>=0:ce(i,t,i.prev)<0||ce(i,i.next,t)<0}function y0(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,a=(i.y+t.y)/2;do e.y>a!=e.next.y>a&&e.next.y!==e.y&&s<(e.next.x-e.x)*(a-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function rc(i,t){const e=new or(i.i,i.x,i.y),n=new or(t.i,t.x,t.y),s=i.next,a=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,a.next=n,n.prev=a,n}function ll(i,t,e,n){const s=new or(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function ls(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function or(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function M0(i,t,e,n){let s=0;for(let a=t,o=e-n;a<e;a+=n)s+=(i[o]-i[a])*(i[a+1]+i[o+1]),o=a;return s}class es{static area(t){const e=t.length;let n=0;for(let s=e-1,a=0;a<e;s=a++)n+=t[s].x*t[a].y-t[a].x*t[s].y;return n*.5}static isClockWise(t){return es.area(t)<0}static triangulateShape(t,e){const n=[],s=[],a=[];cl(t),hl(n,t);let o=t.length;e.forEach(cl);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,hl(n,e[l]);const r=a0.triangulate(n,s);for(let l=0;l<r.length;l+=3)a.push(r.slice(l,l+3));return a}}function cl(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function hl(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class on extends Ae{constructor(t=.5,e=1,n=32,s=1,a=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:a,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const r=[],l=[],c=[],h=[];let u=t;const d=(e-t)/s,f=new L,g=new vt;for(let _=0;_<=s;_++){for(let m=0;m<=n;m++){const p=a+m/n*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let _=0;_<s;_++){const m=_*(n+1);for(let p=0;p<n;p++){const y=p+m,v=y,M=y+n+1,I=y+n+2,C=y+1;r.push(v,M,C),r.push(M,I,C)}}this.setIndex(r),this.setAttribute("position",new Qt(l,3)),this.setAttribute("normal",new Qt(c,3)),this.setAttribute("uv",new Qt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new on(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Ar extends Ae{constructor(t=new ic([new vt(0,.5),new vt(-.5,-.5),new vt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],a=[],o=[];let r=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(r,l,h),r+=l,l=0;this.setIndex(n),this.setAttribute("position",new Qt(s,3)),this.setAttribute("normal",new Qt(a,3)),this.setAttribute("uv",new Qt(o,2));function c(h){const u=s.length/3,d=h.extractPoints(e);let f=d.shape;const g=d.holes;es.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){const y=g[m];es.isClockWise(y)===!0&&(g[m]=y.reverse())}const _=es.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){const y=g[m];f=f.concat(y)}for(let m=0,p=f.length;m<p;m++){const y=f[m];s.push(y.x,y.y,0),a.push(0,0,1),o.push(y.x,y.y)}for(let m=0,p=_.length;m<p;m++){const y=_[m],v=y[0]+u,M=y[1]+u,I=y[2]+u;n.push(v,M,I),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return S0(e,t)}static fromJSON(t,e){const n=[];for(let s=0,a=t.shapes.length;s<a;s++){const o=e[t.shapes[s]];n.push(o)}return new Ar(n,t.curveSegments)}}function S0(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class _e extends Ae{constructor(t=1,e=32,n=16,s=0,a=Math.PI*2,o=0,r=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:a,thetaStart:o,thetaLength:r},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+r,Math.PI);let c=0;const h=[],u=new L,d=new L,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const y=[],v=p/n;let M=0;p===0&&o===0?M=.5/e:p===n&&l===Math.PI&&(M=-.5/e);for(let I=0;I<=e;I++){const C=I/e;u.x=-t*Math.cos(s+C*a)*Math.sin(o+v*r),u.y=t*Math.cos(o+v*r),u.z=t*Math.sin(s+C*a)*Math.sin(o+v*r),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(C+M,1-v),y.push(c++)}h.push(y)}for(let p=0;p<n;p++)for(let y=0;y<e;y++){const v=h[p][y+1],M=h[p][y],I=h[p+1][y],C=h[p+1][y+1];(p!==0||o>0)&&f.push(v,M,C),(p!==n-1||l<Math.PI)&&f.push(M,I,C)}this.setIndex(f),this.setAttribute("position",new Qt(g,3)),this.setAttribute("normal",new Qt(_,3)),this.setAttribute("uv",new Qt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Vn extends ui{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new kt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new kt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mr,this.normalScale=new vt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class T0 extends Vn{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new vt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return xe(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new kt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new kt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new kt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class wn extends ui{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new kt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new kt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mr,this.normalScale=new vt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=fr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class oc extends Le{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new kt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}const qa=new me,ul=new L,dl=new L;class b0{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new vt(512,512),this.map=null,this.mapPass=null,this.matrix=new me,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new yr,this._frameExtents=new vt(1,1),this._viewportCount=1,this._viewports=[new Ee(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;ul.setFromMatrixPosition(t.matrixWorld),e.position.copy(ul),dl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(dl),e.updateMatrixWorld(),qa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(qa),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(qa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class w0 extends b0{constructor(){super(new Wl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class E0 extends oc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Le.DEFAULT_UP),this.updateMatrix(),this.target=new Le,this.shadow=new w0}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class A0 extends oc{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class R0{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=fl(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=fl();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function fl(){return(typeof performance>"u"?Date:performance).now()}class C0{constructor(t,e,n=0,s=1/0){this.ray=new vr(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new xr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return lr(t,this,n,e),n.sort(pl),n}intersectObjects(t,e=!0,n=[]){for(let s=0,a=t.length;s<a;s++)lr(t[s],this,n,e);return n.sort(pl),n}}function pl(i,t){return i.distance-t.distance}function lr(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){const s=i.children;for(let a=0,o=s.length;a<o;a++)lr(s[a],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:dr}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=dr);const oe={LAND:"land",COAST:"coast",SEA:"sea"},cr=1200,ml={default:{burst:1,burstDelay:0,spread:0},burst:{burst:3,burstDelay:.08,spread:5},dual:{burst:2,burstDelay:.1,spread:0},salvo:{burst:4,burstDelay:.15,spread:15},homing:{burst:1,burstDelay:0,spread:0,homing:!0},carpet:{burst:3,burstDelay:.2,spread:0,carpet:!0},barrage:{burst:3,burstDelay:.4,spread:0,barrage:!0},ap:{burst:1,burstDelay:0,spread:0,ap:!0}},An={infantry:{domain:"land",hp:50,damage:8,range:18,speed:14,fireRate:1,hitChance:.85,cost:50,color:5597999,canFireWhileMoving:!1,bounty:30,projectile:"burst",splashRadius:0,splashFalloff:1},tank:{domain:"land",hp:200,damage:50,range:50,speed:10,fireRate:1.5,hitChance:.9,cost:200,color:4873507,canFireWhileMoving:!1,bounty:100,projectile:"ap",splashRadius:2,splashFalloff:.5},heavyTank:{domain:"land",hp:1e3,damage:1500,range:30,speed:10,fireRate:5,hitChance:.9,cost:500,color:3815978,canFireWhileMoving:!1,bounty:400,projectile:"ap",splashRadius:0,splashFalloff:1},crusher:{domain:"land",hp:3e3,damage:200,range:30,speed:10,fireRate:3,hitChance:.85,cost:1e3,color:5583701,canFireWhileMoving:!0,bounty:500,projectile:"ap",splashRadius:100,splashFalloff:.5,crusher:!0,baseTarget:!0},artillery:{domain:"land",hp:120,damage:128,range:96,speed:6,fireRate:3,hitChance:.7,cost:300,color:7035706,canFireWhileMoving:!1,bounty:120,projectile:"barrage",splashRadius:3,splashFalloff:.5},mlrs:{domain:"land",hp:80,damage:15,range:110,speed:10,fireRate:4,hitChance:.6,cost:350,color:5987130,canFireWhileMoving:!1,bounty:120,projectile:"salvo",splashRadius:2,splashFalloff:.4},missileDefense:{domain:"land",hp:500,damage:300,range:85,speed:0,fireRate:2,hitChance:.9,cost:500,color:8930440,canFireWhileMoving:!1,bounty:150,projectile:"homing",splashRadius:0,splashFalloff:1,airOnly:!0},coastal:{domain:"land",hp:400,damage:100,range:120,speed:0,fireRate:2.5,hitChance:.9,cost:400,color:5588019,canFireWhileMoving:!1,bounty:150,projectile:"ap",splashRadius:2,splashFalloff:.5,seaOnly:!0},destroyer:{domain:"sea",hp:250,damage:45,range:96,speed:12,fireRate:1.2,hitChance:.85,cost:250,color:8952234,canFireWhileMoving:!0,bounty:150,projectile:"dual",splashRadius:8,splashFalloff:.5},frigate:{domain:"sea",hp:150,damage:20,range:60,speed:18,fireRate:1,hitChance:.85,cost:150,color:5925498,canFireWhileMoving:!0,bounty:60,projectile:"default",splashRadius:0,splashFalloff:1},cruiser:{domain:"sea",hp:200,damage:40,range:100,speed:16,fireRate:1,hitChance:.9,cost:300,color:6715272,canFireWhileMoving:!0,bounty:100,projectile:"homing",splashRadius:0,splashFalloff:1,airOnly:!0},submarine:{domain:"sea",hp:100,damage:150,range:50,speed:10,fireRate:3.5,hitChance:.85,cost:350,color:2241348,canFireWhileMoving:!1,bounty:150,projectile:"ap",splashRadius:0,splashFalloff:1,seaOnly:!0,stealth:!0},battleship:{domain:"sea",hp:600,damage:130,range:160,speed:12,fireRate:3.5,hitChance:.8,cost:600,color:3359829,canFireWhileMoving:!0,bounty:300,projectile:"salvo",splashRadius:10,splashFalloff:.6},carrier:{domain:"sea",hp:800,damage:20,range:160,speed:8,fireRate:2,hitChance:.7,cost:700,color:5596791,canLaunchFighters:!0,altitude:0,canFireWhileMoving:!0,bounty:400,projectile:"default",splashRadius:0,splashFalloff:1},fighter:{domain:"air",hp:80,damage:35,range:45,speed:30,fireRate:.6,hitChance:.9,cost:300,color:10066346,altitude:25,canFireWhileMoving:!0,bounty:80,projectile:"homing",splashRadius:2,splashFalloff:.5},heli:{domain:"air",hp:120,damage:25,range:40,speed:25,fireRate:.8,hitChance:.8,cost:350,color:4868682,altitude:15,canFireWhileMoving:!0,bounty:90,projectile:"burst",splashRadius:1,splashFalloff:.5},gunship:{domain:"air",hp:250,damage:35,range:60,speed:14,fireRate:.4,hitChance:.8,cost:600,color:8952234,altitude:20,canFireWhileMoving:!0,bounty:200,projectile:"barrage",splashRadius:2,splashFalloff:.5,groundOnly:!0},bomber:{domain:"air",hp:180,damage:140,range:30,speed:18,fireRate:3.5,hitChance:.75,cost:500,color:7833753,altitude:30,canFireWhileMoving:!0,bounty:160,projectile:"carpet",splashRadius:12,splashFalloff:.5},transport:{domain:"sea",hp:1e3,damage:0,range:0,speed:15,fireRate:99,hitChance:0,cost:400,color:9139029,canFireWhileMoving:!1,bounty:200,projectile:"default",splashRadius:0,splashFalloff:1,transportCapacity:4},healer:{domain:"land",hp:150,damage:0,range:30,speed:10,fireRate:1,hitChance:0,cost:500,color:4500036,canFireWhileMoving:!1,bounty:100,projectile:"default",splashRadius:0,splashFalloff:1,healer:!0},medHeli:{domain:"air",hp:150,damage:0,range:30,speed:15,fireRate:1,hitChance:0,cost:500,color:4500036,altitude:15,canFireWhileMoving:!1,bounty:100,projectile:"default",splashRadius:0,splashFalloff:1,healer:!0},minigunnerVehicle:{domain:"land",hp:700,damage:5,range:40,speed:15,fireRate:.1,hitChance:.85,cost:800,color:8939076,canFireWhileMoving:!1,bounty:300,projectile:"burst",splashRadius:0,splashFalloff:1,buffDamage:.3,buffRange:40},megaMedic:{domain:"land",hp:500,damage:0,range:0,speed:15,fireRate:99,hitChance:0,cost:1e3,color:4500104,canFireWhileMoving:!1,bounty:400,projectile:"default",splashRadius:0,splashFalloff:1,buffHp:.3,buffRange:30},minigunner:{domain:"land",hp:500,damage:5,range:40,speed:8,fireRate:.1,hitChance:.85,cost:400,color:8943445,canFireWhileMoving:!1,bounty:150,projectile:"burst",splashRadius:0,splashFalloff:1,buffInfantryHp:2,buffRange:30},escortJet:{domain:"air",hp:2e3,damage:10,range:10,speed:25,fireRate:.5,hitChance:.9,cost:800,color:5596791,altitude:25,canFireWhileMoving:!0,bounty:200,projectile:"homing",splashRadius:0,splashFalloff:1},b2:{domain:"air",hp:800,damage:1e3,range:25,speed:20,fireRate:3,hitChance:.9,cost:800,color:3355460,altitude:35,canFireWhileMoving:!0,bounty:400,projectile:"carpet",splashRadius:18,splashFalloff:.3,baseOnly:!0,oneWay:!0},escortBomber:{domain:"air",hp:5e3,damage:0,range:0,speed:22,fireRate:99,hitChance:0,cost:500,color:4473941,altitude:30,canFireWhileMoving:!0,bounty:0,projectile:"default",splashRadius:0,splashFalloff:1,escortBomber:!0,oneWay:!0}},P0=1e5,gl=20,hr={easy:{aiIncome:.6,maxAttackGroup:10,hpMultiplier:1,baseHpMultiplier:1},normal:{aiIncome:1,maxAttackGroup:20,hpMultiplier:1,baseHpMultiplier:2},hard:{aiIncome:1.5,maxAttackGroup:50,hpMultiplier:2,baseHpMultiplier:4}},L0=1.56,D0=20,$a=2,je={LAND:"land",COAST:"coast",SEA:"sea",MOUNTAIN:"mountain"},ae=1200,lc=12,U0=Math.ceil(ae/lc),ji={hp:{name:"Armor",icon:"🛡️",tiers:[1,1.25,1.5,2],costs:[0,300,800,2e3]},damage:{name:"Firepower",icon:"💥",tiers:[1,1.25,1.5,2],costs:[0,300,800,2e3]},speed:{name:"Engines",icon:"⚡",tiers:[1,1.2,1.4,1.7],costs:[0,250,700,1800]}},Re=8;function I0(i){const t=new P(new dn(ae,ae),new wn({color:2776463,transparent:!0,opacity:.85}));t.rotation.x=-Math.PI/2,t.position.y=0,t.receiveShadow=!0,i.add(t);const e=[{x:-400,z:0,w:350,d:800,color:4881466},{x:350,z:-100,w:400,d:600,color:4881466},{x:0,z:-450,w:200,d:180,color:4881466},{x:-50,z:450,w:160,d:140,color:5597999},{x:200,z:380,w:100,d:100,color:4881466}];for(const a of e){const r=new P(new Q(a.w,20,a.d),new wn({color:a.color}));r.position.set(a.x,Re-20/2,a.z),r.receiveShadow=!0,i.add(r)}const n=[],s=18;for(let a=0;a<s;a++){let o=0,r,l;do{const d=e[Math.floor(Math.random()*e.length)];r=d.x+(Math.random()-.5)*d.w*.8,l=d.z+(Math.random()-.5)*d.d*.8,o++}while(o<10);const c=10+Math.random()*12,h=10+Math.random()*6,u=new P(new li(h,c,5),new wn({color:7035706,flatShading:!0}));u.position.set(r,Re+c/2,l),u.castShadow=!0,i.add(u),n.push({x:r,z:l,r:h})}for(const a of e){if(a.w*a.d<=1e5)continue;const r=15,l=20,c=13943976,h=new P(new Q(a.w,l,r),new wn({color:c}));h.position.set(a.x,Re-l/2,a.z+a.d/2-r/2);const u=new P(new Q(a.w,l,r),new wn({color:c}));u.position.set(a.x,Re-l/2,a.z-a.d/2+r/2);const d=new P(new Q(r,l,a.d),new wn({color:c}));d.position.set(a.x+a.w/2-r/2,Re-l/2,a.z);const f=new P(new Q(r,l,a.d),new wn({color:c}));f.position.set(a.x-a.w/2+r/2,Re-l/2,a.z),i.add(h,u,d,f)}for(let a=0;a<80;a++){const o=e[Math.floor(Math.random()*e.length)],r=o.x+(Math.random()-.5)*o.w*.9,l=o.z+(Math.random()-.5)*o.d*.9,c=2,h=4,u=new P(new wt(.4,.4,c,5),new wn({color:6044190,flatShading:!0}));u.position.set(r,Re+c/2,l);const d=new P(new li(2,h,6),new wn({color:2972191,flatShading:!0}));d.position.set(r,Re+c+h/2,l),i.add(u,d)}return{landmasses:e,mountains:n,mapSize:ae,getTerrainAt(a,o){for(const r of n){const l=a-r.x,c=o-r.z;if(l*l+c*c<r.r*r.r)return je.MOUNTAIN}for(const r of e){const l=a>r.x-r.w/2&&a<r.x+r.w/2,c=o>r.z-r.d/2&&o<r.z+r.d/2;if(l&&c)return Math.min(Math.abs(a-(r.x-r.w/2)),Math.abs(a-(r.x+r.w/2)),Math.abs(o-(r.z-r.d/2)),Math.abs(o-(r.z+r.d/2)))<15?je.COAST:je.LAND}for(const r of e){const l=a>r.x-r.w/2-8&&a<r.x+r.w/2+8,c=o>r.z-r.d/2-8&&o<r.z+r.d/2+8;if(l&&c)return je.COAST}return je.SEA}}}const Zi=new L;function en(i,t,e,n,s,a){const o=2*Math.PI*s/4,r=Math.max(a-2*s,0),l=Math.PI/4;Zi.copy(t),Zi[n]=0,Zi.normalize();const c=.5*o/(o+r),h=1-Zi.angleTo(i)/l;return Math.sign(Zi[e])===1?h*c:r/(o+r)+c+c*(1-h)}class N0 extends Q{constructor(t=1,e=1,n=1,s=2,a=.1){if(s=s*2+1,a=Math.min(t/2,e/2,n/2,a),super(1,1,1,s,s,s),s===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const r=new L,l=new L,c=new L(t,e,n).divideScalar(2).subScalar(a),h=this.attributes.position.array,u=this.attributes.normal.array,d=this.attributes.uv.array,f=h.length/6,g=new L,_=.5/s;for(let m=0,p=0;m<h.length;m+=3,p+=2)switch(r.fromArray(h,m),l.copy(r),l.x-=Math.sign(l.x)*_,l.y-=Math.sign(l.y)*_,l.z-=Math.sign(l.z)*_,l.normalize(),h[m+0]=c.x*Math.sign(r.x)+l.x*a,h[m+1]=c.y*Math.sign(r.y)+l.y*a,h[m+2]=c.z*Math.sign(r.z)+l.z*a,u[m+0]=l.x,u[m+1]=l.y,u[m+2]=l.z,Math.floor(m/f)){case 0:g.set(1,0,0),d[p+0]=en(g,l,"z","y",a,n),d[p+1]=1-en(g,l,"y","z",a,e);break;case 1:g.set(-1,0,0),d[p+0]=1-en(g,l,"z","y",a,n),d[p+1]=1-en(g,l,"y","z",a,e);break;case 2:g.set(0,1,0),d[p+0]=1-en(g,l,"x","z",a,t),d[p+1]=en(g,l,"z","x",a,n);break;case 3:g.set(0,-1,0),d[p+0]=1-en(g,l,"x","z",a,t),d[p+1]=1-en(g,l,"z","x",a,n);break;case 4:g.set(0,0,1),d[p+0]=1-en(g,l,"x","y",a,t),d[p+1]=1-en(g,l,"y","x",a,e);break;case 5:g.set(0,0,-1),d[p+0]=en(g,l,"x","y",a,t),d[p+1]=1-en(g,l,"y","x",a,e);break}}}const us=new Map,cc=new Map;function di(i,t,e){return i.has(t)||i.set(t,e()),i.get(t)}function Ne(i,t,e,n=.06){const s=Math.min(n,i*.2,t*.2,e*.2);return di(cc,`box:${i}:${t}:${e}:${s}`,()=>new N0(i,t,e,2,s))}function Ge(i,t,e,n=12){return di(cc,`cyl:${i}:${t}:${e}:${n}`,()=>new wt(i,t,e,n))}function Lt(i,t=.45,e=.75){return di(us,`metal:${i}:${t}:${e}`,()=>new Vn({color:i,roughness:t,metalness:e}))}function Vt(i){return di(us,`matte:${i}`,()=>new Vn({color:i,roughness:.88,metalness:.08}))}function Se(i=1122867){return di(us,`glass:${i}`,()=>new T0({color:i,roughness:.04,metalness:0,transparent:!0,opacity:.65,transmission:.15,emissive:i,emissiveIntensity:.25,depthWrite:!1}))}function ve(i,t=1.5){return di(us,`glow:${i}:${t}`,()=>new Vn({color:i,emissive:i,emissiveIntensity:t,roughness:.45,metalness:.35}))}function _n(){return di(us,"track",()=>new Vn({color:1381653,roughness:.95,metalness:.25}))}function F0(i,t,e){const n=new kt(i),s=new kt(t);return n.lerp(s,e).getHex()}function j(i){return i.castShadow=!0,i.receiveShadow=!0,i}function le(i,t,e,n){const s=j(new P(i,t));return e&&s.position.set(e[0],e[1],e[2]),n&&s.rotation.set(n[0],n[1],n[2]),s}const O0=new as({color:0,transparent:!0,opacity:.22,depthTest:!0});function z0(i,{outlines:t=!0}={}){const e=[];i.traverse(n=>{if(!n.isMesh)return;j(n),n.geometry&&(n.geometry.computeVertexNormals(),n.geometry.computeBoundingSphere());const s=Array.isArray(n.material)?n.material:[n.material];for(const a of s)a&&"envMapIntensity"in a&&(a.envMapIntensity=.7);!n.material?.transparent&&t&&e.push(n)});for(const n of e){const s=new Kl(new s0(n.geometry,35),O0);s.userData.noShadow=!0,s.renderOrder=2,n.add(s)}return i}const B0={infantry:k0,tank:H0,heavyTank:G0,crusher:V0,artillery:W0,missileDefense:X0,coastal:$0,mlrs:q0,healer:Y0,medHeli:sg,frigate:j0,cruiser:Z0,submarine:J0,carrier:K0,transport:Q0,heli:ig,gunship:ag,escortJet:tg,b2:eg,escortBomber:ng,minigunnerVehicle:cg,megaMedic:hg,minigunner:ug,destroyer:(i,t)=>_l(i,t,1),battleship:(i,t)=>_l(i,t,1.6),fighter:(i,t)=>vl(i,t,1),bomber:(i,t)=>vl(i,t,1.4)};function hc(i,t,e){const n=e==="enemy"?F0(t,11154227,.4):t,s=new de;s.userData.turret=null,s.userData.muzzleOffset=null;const a=B0[i],o=a?a(s,n):s;return z0(o)}function k0(i,t){const e=Vt(t),n=Lt(3355443,.6,.4),s=j(new P(new Q(.8,1.2,.5),e));s.position.y=1.4;const a=new Q(.3,1,.3),o=j(new P(a,e));o.position.set(-.2,.5,0);const r=j(new P(a,e));r.position.set(.2,.5,0);const l=new Q(.25,1,.25),c=j(new P(l,e));c.position.set(-.55,1.4,0);const h=j(new P(l,e));h.position.set(.55,1.4,.2),h.rotation.x=-.5;const u=j(new P(new _e(.25,8,8),Vt(14531481)));u.position.y=2.2;const d=j(new P(new _e(.28,8,8,0,Math.PI*2,0,Math.PI/2),n));d.position.y=2.25;const f=new P(new Q(.4,.1,.1),Se(65535));f.position.set(0,2.2,.25);const g=j(new P(new Q(.1,.1,1.2),n));return g.position.set(.55,1.2,.6),g.rotation.x=-.2,i.add(s,o,r,c,h,u,d,f,g),i}function H0(i,t){const e=Vt(t),n=Lt(3355443,.7,.5),s=le(Ne(4.5,1,7,.12),e,[0,.8,0]),a=le(Ne(4,.8,5,.1),e,[0,1.7,-.5]),o=le(Ne(4,1,2,.1),e,[0,1.5,3],[-.4,0,0]),r=Ne(.8,1.2,7.5,.08),l=le(r,_n(),[-2.4,.6,0]),c=le(r,_n(),[2.4,.6,0]),h=Ge(.4,.4,.9,12);for(let v=-3;v<=3;v++){const M=new P(h,n);M.rotation.z=Math.PI/2,M.position.set(-2.4,.6,v*1.1),i.add(M);const I=M.clone();I.position.x=2.4,i.add(I)}const u=new de,d=le(Ne(3,1,3.5,.1),e,[0,2.4,0]),f=le(Ne(3,1,1.5,.1),e,[0,2.4,2],[-.3,0,0]),g=le(Ge(.4,.4,.3,12),n,[-.8,3,-.5]),_=le(Ge(.2,.2,5,16),n,[0,2.5,3.5],[Math.PI/2,0,0]),m=le(Ge(.3,.3,.6,12),n,[0,2.5,4.5],[Math.PI/2,0,0]),p=Ne(.4,.4,.1,.02);for(let v=0;v<3;v++){const M=new P(p,n);M.position.set(-1+v*1,2.4,2.8),M.rotation.x=-.3,u.add(M)}u.add(d,f,g,_,m);const y=new P(Ge(.02,.02,2,4),n);return y.position.set(1,3.5,-1),u.add(y),i.add(s,a,o,l,c,u),i.userData.turret=u,i.userData.muzzleOffset=new L(0,2.5,6),i}function G0(i,t){const e=Vt(t),n=Lt(3355443,.7,.5),s=le(Ne(6,1.4,9,.15),e,[0,1,0]),a=le(Ne(5.5,1,7,.12),e,[0,2.2,-.5]),o=le(Ne(5.5,1.4,2.5,.12),e,[0,2,4],[-.35,0,0]),r=Lt(4473924,.6,.3),l=le(Ne(.3,1.5,8,.05),r,[-3.2,1,0]),c=le(Ne(.3,1.5,8,.05),r,[3.2,1,0]),h=Ne(1,1.5,9.5,.1),u=le(h,_n(),[-2.8,.7,0]),d=le(h,_n(),[2.8,.7,0]),f=Ge(.5,.5,1.1,12);for(let k=-4;k<=4;k++){const x=new P(f,n);x.rotation.z=Math.PI/2,x.position.set(-2.8,.7,k*1.1),i.add(x);const T=x.clone();T.position.x=2.8,i.add(T)}const g=new de,_=le(Ne(4,1.2,4.5,.12),e,[0,3.1,0]),m=le(Ne(4,1.2,2,.1),e,[0,3.1,2.5],[-.25,0,0]),p=le(Ge(.5,.5,.4,12),n,[-1,3.9,-1]),y=le(Ge(.4,.4,.2,12),n,[1,3.8,-.5]),v=le(Ge(.35,.35,6,16),n,[0,3.2,5.5],[Math.PI/2,0,0]),M=le(Ge(.5,.5,.8,12),n,[0,3.2,8.5],[Math.PI/2,0,0]),I=Ne(.5,.5,.15,.03);for(let k=0;k<4;k++){const x=new P(I,n);x.position.set(-1.5+k*1,3.1,2.2),x.rotation.x=-.25,g.add(x)}g.add(_,m,p,y,v,M);const C=new P(Ge(.03,.03,2.5,4),n);C.position.set(1.5,4.5,-1.5),g.add(C);const b=new P(Ge(.25,.25,.3,12),Se(16729088));return b.rotation.x=Math.PI/2,b.position.set(-1.8,3.5,2.5),g.add(b),i.add(s,a,o,l,c,u,d,g),i.userData.turret=g,i.userData.muzzleOffset=new L(0,3.2,9),i}function V0(i,t){const e=Vt(t),n=Lt(4473924,.6,.5),s=j(new P(new Q(7,1.8,10),e));s.position.y=1.2;const a=j(new P(new Q(7,2,3),e));a.position.set(0,2,4.5),a.rotation.x=-.3;const o=Lt(4473924,.7,.6),r=j(new P(new Q(.5,2,9),o));r.position.set(-3.7,1.5,0);const l=j(new P(new Q(.5,2,9),o));l.position.set(3.7,1.5,0);const c=new Q(1.2,1.8,10.5),h=j(new P(c,_n()));h.position.set(-3.2,.9,0);const u=j(new P(c,_n()));u.position.set(3.2,.9,0);const d=new wt(.6,.6,1.3,8);for(let M=-4;M<=4;M++){const I=new P(d,n);I.rotation.z=Math.PI/2,I.position.set(-3.2,.9,M*1.2),i.add(I);const C=I.clone();C.position.x=3.2,i.add(C)}const f=new de,g=j(new P(new Q(4.5,1.5,5),e));g.position.y=3;const _=j(new P(new wt(.5,.5,.4,8),n));_.position.set(-1,3.9,-1);const m=new wt(.25,.25,5,8),p=j(new P(m,n));p.rotation.x=Math.PI/2,p.position.set(-.6,3.2,4);const y=j(new P(m,n));y.rotation.x=Math.PI/2,y.position.set(.6,3.2,4),f.add(g,_,p,y);const v=new P(new on(38,42,48),new ie({color:4482815,transparent:!0,opacity:.15,side:pe,depthTest:!1}));return v.rotation.x=-Math.PI/2,v.position.y=.3,v.renderOrder=894,i.add(v),i.userData.shieldRing=v,i.add(s,a,r,l,h,u,f),i.userData.turret=f,i.userData.muzzleOffset=new L(0,3.2,6.5),i}function W0(i,t){const e=Vt(t),n=Lt(3355443),s=j(new P(new Q(3.5,1,5),e));s.position.y=.8;const a=new Q(.3,.5,2),o=j(new P(a,n));o.position.set(-2.2,.4,0);const r=j(new P(a,n));r.position.set(2.2,.4,0);const l=new de,c=j(new P(new wt(1.5,1.8,.8,8),e));c.position.y=1.6;const h=j(new P(new Q(1.2,1.5,2),e));h.position.set(0,2.2,0);const u=j(new P(new wt(.25,.25,7,8),n));u.rotation.x=Math.PI/2.2,u.position.set(0,3.2,3);const d=j(new P(new wt(.4,.4,.5,8),n));d.rotation.x=Math.PI/2.2,d.position.set(0,4.3,5.8);const f=new wt(.1,.1,2,6),g=new P(f,Lt(8947848,.3,.9));g.rotation.x=Math.PI/3,g.position.set(-.8,2.5,1.5);const _=g.clone();return _.position.x=.8,l.add(c,h,u,d,g,_),i.add(s,o,r,l),i.userData.turret=l,i.userData.muzzleOffset=new L(0,4.5,6),i}function X0(i,t){const e=Vt(t),n=Lt(2236962),s=j(new P(new Q(4,.8,4),e));s.position.y=.6;const a=j(new P(new Q(1,3,1),n));a.position.set(-1.2,2.5,-1.2);const o=j(new P(new Q(2,2,.2),Se(4500223)));o.position.set(-1.2,4,-1.2),o.rotation.y=Math.PI/4;const r=new de,l=j(new P(new Q(3,.5,3),e));l.position.y=1.3;const c=new Q(.6,1.5,.6),h=Lt(4473924),u=ve(16724736,1);for(let d=-1;d<=1;d++)for(let f=-1;f<=1;f++){const g=j(new P(c,h));g.position.set(d*.8,2.1,f*.8),r.add(g);const _=new P(new li(.2,.4,6),u);_.position.set(d*.8,2.9,f*.8),r.add(_)}return i.add(s,a,o,r),i.userData.turret=r,i.userData.muzzleOffset=new L(0,3,0),i}function q0(i,t){const e=Vt(t),n=Lt(2236962),s=j(new P(new Q(2.8,1.5,2),e));s.position.set(0,1.5,2.5);const a=new P(new Q(2.6,.8,.1),Se(2241348));a.position.set(0,2,3.5),i.add(a);const o=j(new P(new Q(2.8,1,5),n));o.position.y=.8;const r=new wt(.6,.6,.4,8),l=[[-1.4,.6,2.5],[1.4,.6,2.5],[-1.4,.6,-1.5],[1.4,.6,-1.5]];for(const g of l){const _=j(new P(r,_n()));_.position.set(g[0],g[1],g[2]),_.rotation.z=Math.PI/2,i.add(_)}const c=new de,h=j(new P(new Q(2.4,.8,2),e));h.position.y=1.8;const u=j(new P(new Q(2.2,1.5,3.5),Lt(4478276)));u.position.set(0,3,-.5),u.rotation.x=-.4;const d=new wt(.2,.2,.2,6),f=Lt(1118481);for(let g=0;g<3;g++)for(let _=0;_<4;_++){const m=new P(d,f);m.rotation.x=Math.PI/2,m.position.set(-.75+_*.5,2.5+g*.5,1.2),u.add(m)}return c.add(h,u),i.add(s,o,c),i.userData.turret=c,i.userData.muzzleOffset=new L(0,4,2),i}function $0(i,t){const e=Vt(6710886),n=Vt(t),s=Lt(3355443),a=j(new P(new Q(6,1.5,6),e));a.position.y=.75;const o=j(new P(new Q(6,2,1),e));o.position.set(0,1.5,2.5);const r=new de,l=j(new P(new wt(2,2.2,1.2,8),n));l.position.y=2.1;const c=new wt(.3,.3,5,8),h=j(new P(c,s));h.rotation.x=Math.PI/2,h.position.set(-.6,2.4,3);const u=h.clone();u.position.x=.6;const d=new wt(.5,.5,.6,8),f=new P(d,s);f.rotation.x=Math.PI/2,f.position.set(-.6,2.4,5.5);const g=f.clone();return g.position.x=.6,r.add(l,h,u,f,g),i.add(a,o,r),i.userData.turret=r,i.userData.muzzleOffset=new L(0,2.4,6),i}function Y0(i,t){const e=Vt(t),n=Lt(3355443),s=ve(4521796,1.5),a=j(new P(new Q(3,2,2.5),e));a.position.set(0,2,2.5);const o=new P(new Q(2.8,1,.1),Se(2245666));o.position.set(0,2.8,3.8),i.add(o);const r=j(new P(new Q(3,1,6),n));r.position.y=.8;const l=new wt(.7,.7,.4,8),c=[[-1.5,.6,2],[1.5,.6,2],[-1.5,.6,-2],[1.5,.6,-2]];for(const _ of c){const m=j(new P(l,_n()));m.position.set(_[0],_[1],_[2]),m.rotation.z=Math.PI/2,i.add(m)}const h=j(new P(new Q(2.8,2,3.5),e));h.position.set(0,2.3,-1);const u=new P(new Q(1.2,.3,.1),s);u.position.set(0,2.8,.76);const d=new P(new Q(.3,1.2,.1),s);d.position.set(0,2.8,.76);const f=new P(new wt(.05,.05,2,4),n);f.position.set(1,4,-2);const g=new P(new wt(.6,.6,.15,8),s);return g.position.set(0,5,-2),i.add(a,r,h,u,d,f,g),i.userData.muzzleOffset=null,i}function j0(i,t){const e=Vt(t),n=Lt(8947865,.6,.4),s=Vt(3355443),a=j(new P(new Q(3.5,1.5,10),e));a.position.y=.75;const o=j(new P(new Q(3.5,1.5,2),e));o.position.set(0,1,5.5),o.rotation.x=.3;const r=j(new P(new Q(3.5,.2,3),s));r.position.set(0,1.5,-4);const l=j(new P(new Q(2.5,2,3),n));l.position.set(0,2.5,-1);const c=j(new P(new Q(2,1.5,2),n));c.position.set(0,4.2,-1);const h=new P(new Q(2.6,.5,.1),Se(1127253));h.position.set(0,3,.5),i.add(h);const u=new de,d=j(new P(new Q(1.5,.8,1.5),e));d.position.y=1.9;const f=j(new P(new wt(.15,.15,2.5,6),Lt(2236962)));f.rotation.x=Math.PI/2,f.position.set(0,2.1,1.5),u.add(d,f),u.position.set(0,0,3);const g=j(new P(new Q(1.5,.3,1.5),Lt(5592405)));g.position.set(0,1.6,-2.5);const _=new P(new wt(.1,.1,3,4),Lt(4473924));_.position.set(0,6.5,-1);const m=j(new P(new Q(1.5,1,.2),Se(8965375)));return m.position.set(0,7,-1),i.add(a,o,r,l,c,u,g,_,m),i.userData.turret=u,i.userData.muzzleOffset=new L(0,2.1,4.5),i.userData.bobPhase=Math.random()*Math.PI*2,i}function Z0(i,t){const e=Vt(t),n=Lt(8947865,.6,.4),s=j(new P(new Q(4.5,1.8,16),e));s.position.y=.9;const a=j(new P(new Q(4.5,1.8,3),e));a.position.set(0,1.2,7.5),a.rotation.x=.2;const o=j(new P(new Q(3.5,3,5),n));o.position.set(0,3.3,-3);const r=j(new P(new Q(2.5,2,3),n));r.position.set(0,5.8,-3);const l=Se(4500223),c=new P(new Q(.2,1.5,1.5),l);c.position.set(1.8,4,-1.5);const h=c.clone();h.position.x=-1.8,i.add(c,h);const u=new de,d=j(new P(new Q(2,1,2),e));d.position.y=2.3;const f=j(new P(new wt(.2,.2,4,6),Lt(2236962)));f.rotation.x=Math.PI/2,f.position.set(-.5,2.5,2);const g=f.clone();g.position.x=.5,u.add(d,f,g),u.position.set(0,0,5);const _=j(new P(new Q(2,.3,3),Lt(5592405)));_.position.set(0,1.9,-6);const m=j(new P(new Q(4,.2,4),Vt(3355443)));return m.position.set(0,1.9,-8),i.add(s,a,o,r,u,_,m),i.userData.turret=u,i.userData.muzzleOffset=new L(0,2.5,7),i.userData.bobPhase=Math.random()*Math.PI*2,i}function J0(i,t){const e=Vt(t),n=Lt(2236962),s=j(new P(new Pn(1.2,8,8,16),e));s.rotation.z=Math.PI/2,s.position.y=0;const a=j(new P(new Q(1.2,1.5,2.5),e));a.position.set(0,1.5,-1);const o=new Q(2,.1,.8),r=new P(o,n);r.position.set(0,1.5,-1),i.add(r);const l=new P(new wt(.05,.05,1.5,4),n);l.position.set(-.3,2.8,-1);const c=l.clone();c.position.x=.3,i.add(l,c);const h=new P(new Q(.2,.2,1),ve(65450,1));h.position.set(0,2.3,-1),i.add(h);const u=j(new P(new wt(.8,.8,1,8),n));return u.rotation.z=Math.PI/2,u.position.set(-5,0,0),i.add(s,a,u),i.userData.bobPhase=Math.random()*Math.PI*2,i}function _l(i,t,e){const n=5*e,s=14*e,a=Vt(t),o=Lt(8947865,.6,.4),r=j(new P(new Q(n,1.5,s),a));r.position.y=.75;const l=j(new P(new Q(n,1.5,3*e),a));l.position.set(0,1,s/2+1),l.rotation.x=.2;const c=j(new P(new Q(3*e,3*e,4*e),o));c.position.set(0,3*e,-1*e);const h=new de,u=j(new P(new Q(2*e,1.2,2*e),a));u.position.y=2.1*e;const d=e>1.2?3:2,f=.6*e;for(let g=0;g<d;g++){const _=j(new P(new wt(.25*e,.25*e,4*e,8),Lt(2236962)));_.rotation.x=Math.PI/2,_.position.set((g-(d-1)/2)*f,2.3*e,2.5*e),h.add(_)}return h.add(u),h.position.z=4*e,i.add(r,l,c,h),i.userData.turret=h,i.userData.muzzleOffset=new L(0,2.3*e,6*e),i.userData.bobPhase=Math.random()*Math.PI*2,i}function K0(i,t){const e=Vt(t),n=Vt(2236962),s=Lt(8947865,.6,.4),a=j(new P(new Q(7,1.5,20),e));a.position.y=.75;const o=j(new P(new Q(9,.3,22),n));o.position.y=1.6;const r=ve(16777215,.5),l=new P(new Q(.1,.05,20),r);l.position.set(0,1.8,0);const c=new P(new Q(8,.05,.1),r);c.position.set(0,1.8,-5),i.add(l,c);const h=j(new P(new Q(5,.3,10),n));h.position.set(3,1.65,-3),h.rotation.y=.2;const u=j(new P(new Q(1.5,4,5),s));u.position.set(4,3.8,-5);const d=new P(new Q(.2,1.5,1.5),Se(4500223));d.position.set(4.8,4.5,-4),i.add(d);const f=Vt(5596791);for(let g=-1;g<=1;g+=2){const _=j(new P(new Q(2,.3,3),f));_.position.set(g*1.5,1.9,5),i.add(_)}return i.add(a,o,h,u),i.userData.bobPhase=Math.random()*Math.PI*2,i}function Q0(i,t){const e=Vt(t),n=Vt(4469538),s=Lt(3355443),a=j(new P(new Q(6,1.5,14),e));a.position.y=.75;const o=j(new P(new Q(5,.3,8),n));o.position.set(0,1.5,1);const r=j(new P(new Q(5,.3,4),s));r.position.set(0,.8,6.5),r.rotation.x=.4;const l=j(new P(new Q(5.5,3,4),e));l.position.set(0,3,-4.5);const c=new P(new Q(5,1,.1),Se(2241348));c.position.set(0,3.5,-2.5),i.add(c);const h=Vt(11158562),u=j(new P(new Q(2,2,4),h));return u.position.set(-1,2.6,1),i.add(u),i.add(a,o,r,l),i.userData.bobPhase=Math.random()*Math.PI*2,i.userData.muzzleOffset=null,i}function tg(i,t){const e=Vt(t);Lt(3355443);const n=j(new P(new Pn(.5,5,4,8),e));n.rotation.z=Math.PI/2;const s=j(new P(new _e(.45,8,8,0,Math.PI*2,0,Math.PI/2),Se(1127236)));s.position.set(2,.3,0),s.rotation.z=-Math.PI/3;const a=new Q(2.5,.15,5),o=j(new P(a,e));o.position.set(-.5,-.1,2.5),o.rotation.y=-.3;const r=j(new P(a,e));r.position.set(-.5,-.1,-2.5),r.rotation.y=.3;const l=new wt(.3,.35,.6,8),c=new P(l,ve(4500223,2));c.rotation.z=Math.PI/2,c.position.set(-3,0,.5);const h=c.clone();h.position.z=-.5;const u=new Q(.15,1.5,1.2),d=j(new P(u,e));d.position.set(-2.5,.8,1),d.rotation.z=-.15;const f=j(new P(u,e));f.position.set(-2.5,.8,-1),f.rotation.z=.15;const g=new wt(.08,.08,1.5,6),_=Lt(6710886);for(let m=0;m<2;m++){const p=new P(g,_);p.rotation.x=Math.PI/2,p.position.set(-.3,-.3,1.5+m*1.2),i.add(p);const y=p.clone();y.position.z=-(1.5+m*1.2),i.add(y)}return i.add(n,s,o,r,c,h,d,f),i}function eg(i,t){const e=Vt(t),n=Lt(2236962),s=j(new P(new Q(1,.6,6),e));s.position.y=0;const a=j(new P(new Q(6,.3,5),e));a.position.set(-3,0,-1),a.rotation.y=.3;const o=j(new P(new Q(6,.3,5),e));o.position.set(-3,0,1),o.rotation.y=-.3;const r=j(new P(new _e(.4,6,6,0,Math.PI*2,0,Math.PI/2),Se(1122850)));r.position.set(.5,.4,0);const l=new P(new Q(1.5,.3,.8),n);l.position.set(-.5,.2,1.5);const c=l.clone();c.position.z=-1.5;const h=new Q(.8,.15,1),u=new P(h,ve(16733440,1.5));u.position.set(-4,0,1);const d=u.clone();d.position.z=-1;const f=new P(new Q(3,.05,2),n);return f.position.set(-1,-.3,0),i.add(s,a,o,r,l,c,u,d,f),i}function ng(i,t){const e=Vt(t),n=Lt(3355443),s=j(new P(new Pn(1.8,8,4,8),e));s.rotation.z=Math.PI/2;const a=j(new P(new _e(.8,8,8,0,Math.PI*2,0,Math.PI/2),Se(1127236)));a.position.set(4.5,.5,0),a.rotation.z=-Math.PI/3;const o=new Q(2.5,.25,10),r=j(new P(o,e));r.position.set(-1,.3,5);const l=j(new P(o,e));l.position.set(-1,.3,-5);const c=new wt(.5,.5,2.5,8),h=[[-1,.3,3],[-1,.3,6],[-1,.3,-3],[-1,.3,-6]];for(const _ of h){const m=j(new P(c,n));m.rotation.x=Math.PI/2,m.position.set(_[0],_[1],_[2]),i.add(m);const p=new P(new wt(.4,.4,.3,8),ve(16729088,1.5));p.rotation.x=Math.PI/2,p.position.set(_[0],_[1],_[2]-1.5),i.add(p)}const u=j(new P(new Q(1.5,.2,3),e));u.position.set(-5,.5,0);const d=j(new P(new Q(.2,3,2.5),e));d.position.set(-5,2,0);const f=Lt(4473924),g=new P(new wt(.3,.3,.8,6),f);return g.rotation.x=Math.PI/2,g.position.set(-2,-1,1),i.add(g),i.add(s,a,r,l,u,d),i}function ig(i,t){const e=Vt(t),n=Se(1127202),s=Lt(2236962),a=j(new P(new Pn(.7,2.5,4,8),e));a.rotation.z=Math.PI/2;const o=j(new P(new _e(.5,8,8,0,Math.PI*2,0,Math.PI/2),n));o.position.set(1.2,.2,0),o.rotation.z=-Math.PI/2;const r=j(new P(new _e(.5,8,8,0,Math.PI*2,0,Math.PI/2),n));r.position.set(-.2,.6,0),r.rotation.z=-Math.PI/2;const l=j(new P(new wt(.15,.3,3.5,6),e));l.rotation.z=Math.PI/2,l.position.set(-2.8,.2,0);const c=j(new P(new Q(.8,1.2,.1),e));c.position.set(-4.2,.8,0);const h=new Q(.5,.2,2),u=j(new P(h,s));u.position.set(-.5,-.2,1.2);const d=j(new P(h,s));d.position.set(-.5,-.2,-1.2);const f=new wt(.1,.1,1,6);for(let M=0;M<2;M++){const I=new P(f,Lt(5592405));I.rotation.x=Math.PI/2,I.position.set(-.5,-.4,.8+M*.8),i.add(I);const C=I.clone();C.position.z=-(.8+M*.8),i.add(C)}const g=new P(new _e(.25,8,8),ve(16711680,1));g.position.set(1.6,-.4,0),i.add(g);const _=new P(new wt(.2,.2,.4,6),s);_.position.set(0,1.1,0);const m=new Vn({color:1118481,roughness:.5,metalness:.5,transparent:!0,opacity:.6}),p=new P(new Q(7,.05,.3),m);p.position.set(0,1.3,0);const y=new P(new Q(.3,.05,7),m);y.position.set(0,1.3,0);const v=new P(new Q(.05,1.5,.2),m);return v.position.set(-4.2,.8,.2),i.add(a,o,r,l,c,u,d,g,_,p,y,v),i.userData.muzzleOffset=new L(1.6,-.4,0),i}function sg(i,t){const e=Vt(t),n=Lt(2236962),s=ve(4521796,1.5),a=j(new P(new Pn(.7,2.5,4,8),e));a.rotation.z=Math.PI/2;const o=j(new P(new _e(.5,8,8,0,Math.PI*2,0,Math.PI/2),Se(1127202)));o.position.set(1.2,.2,0),o.rotation.z=-Math.PI/2;const r=j(new P(new wt(.15,.3,3.5,6),e));r.rotation.z=Math.PI/2,r.position.set(-2.8,.2,0);const l=j(new P(new Q(.8,1.2,.1),e));l.position.set(-4.2,.8,0);const c=new P(new Q(1.2,.3,.1),s);c.position.set(0,.5,.75);const h=new P(new Q(.3,1.2,.1),s);h.position.set(0,.5,.75);const u=j(new P(new Q(.5,.2,1.5),n));u.position.set(-.5,-.2,1);const d=j(new P(new Q(.5,.2,1.5),n));d.position.set(-.5,-.2,-1);const f=new P(new wt(.4,.4,.1,8),s);f.position.set(0,-.5,0);const g=new P(new wt(.2,.2,.4,6),n);g.position.set(0,1.1,0);const _=new Vn({color:1118481,roughness:.5,metalness:.5,transparent:!0,opacity:.6}),m=new P(new Q(7,.05,.3),_);m.position.set(0,1.3,0);const p=new P(new Q(.3,.05,7),_);p.position.set(0,1.3,0);const y=new P(new Q(.05,1.5,.2),_);return y.position.set(-4.2,.8,.2),i.add(a,o,r,l,c,h,u,d,f,g,m,p,y),i.userData.muzzleOffset=null,i}function ag(i,t){const e=Vt(t),n=Lt(2236962),s=j(new P(new Pn(1.5,6,4,8),e));s.rotation.z=Math.PI/2;const a=j(new P(new _e(1.2,8,8,0,Math.PI*2,0,Math.PI/2),Se(1127202)));a.position.set(3.5,.5,0),a.rotation.z=-Math.PI/2;const o=j(new P(new Q(2,.3,12),e));o.position.set(-.5,.5,0);const r=Ge(.4,.4,2,12);for(let _=0;_<4;_++){const m=j(new P(r,n));m.rotation.x=Math.PI/2,m.position.set(-.5,0,-4.5+_*3);const p=new P(Ge(.3,.3,.2,12),ve(16733440,2));p.rotation.x=Math.PI/2,p.position.set(-.5,0,-5.5+_*3),i.add(m,p)}const l=j(new P(new Q(1,.2,4),e));l.position.set(-4,.5,0);const c=j(new P(new Q(.2,2.5,2),e));c.position.set(-4,1.5,0);const h=new wt(.15,.15,2.5,6),u=j(new P(h,n));u.rotation.x=Math.PI/2,u.position.set(0,-1,1.5);const d=u.clone();d.position.z=-.5;const f=j(new P(new wt(.3,.3,3,8),n));f.rotation.x=Math.PI/2,f.position.set(0,-1,-2.5);const g=new P(new _e(.5,8,8),Se(2245802));return g.position.set(1,-1,0),i.add(g),i.add(s,a,o,l,c,u,d,f),i.userData.muzzleOffset=new L(0,-1,2.5),i}function vl(i,t,e){const n=Vt(t);Lt(3355443);const s=j(new P(new Pn(.4*e,5*e,4,8),n));s.rotation.z=Math.PI/2;const a=j(new P(new _e(.4*e,8,8,0,Math.PI*2,0,Math.PI/2),Se(1127236)));a.position.set(1.5*e,.3*e,0),a.rotation.z=-Math.PI/3;const o=new Q(2*e,.1*e,4*e),r=j(new P(o,n));r.position.set(-.5*e,-.1*e,2*e),r.rotation.y=-.4;const l=j(new P(o,n));l.position.set(-.5*e,-.1*e,-2*e),l.rotation.y=.4;const c=new Q(1*e,.1*e,1.5*e),h=j(new P(c,n));h.position.set(-2.5*e,.5*e,1*e),h.rotation.z=-.5;const u=j(new P(c,n));u.position.set(-2.5*e,.5*e,-1*e),u.rotation.z=.5;const d=new wt(.25*e,.3*e,.5*e,8),f=new P(d,ve(4500223,2));f.rotation.z=Math.PI/2,f.position.set(-3*e,0,.4*e);const g=f.clone();g.position.z=-.4*e;const _=new Q(.8*e,.05*e,1*e),m=j(new P(_,n));m.position.set(1*e,0,1*e);const p=j(new P(_,n));return p.position.set(1*e,0,-1*e),i.add(s,a,r,l,h,u,f,g,m,p),i}function rg(i=1,t=!1){const e=new de,n=t?2254506:11154227,s=Vt(5592405),a=Vt(n),o=t?4500223:16729156,r=j(new P(new Q(20*i,4,20*i),s));r.position.y=2;const l=new P(new Q(20.2*i,.2,20.2*i),ve(o,1));l.position.y=4.1,e.add(l);const c=j(new P(new Q(8*i,8,8*i),a));c.position.y=8;const h=ve(o,.8);for(let _=0;_<3;_++){const m=new P(new Q(8.1*i,.5,.5),h);m.position.set(0,5+_*2.5,4*i),e.add(m);const p=m.clone();p.position.z=-4*i,e.add(p)}const u=new P(new wt(3*i,3*i,.1,16),Vt(3355443));u.position.y=12.1;const d=new P(new on(2*i,2.2*i,16),ve(o,1));d.rotation.x=-Math.PI/2,d.position.y=12.2,e.add(u,d);const f=new P(new wt(.2,.2,6),Lt(8947848));f.position.set(0,15,0);const g=new P(new Q(3,2,.1),Vt(n));return g.position.set(1.5,16,0),g.userData.isFlag=!0,e.add(r,c,f,g),e}function og(i=1,t=!1){const e=new de,n=t?2254506:11154227,s=Vt(5592405),a=Lt(7829367,.6,.8),o=t?4500223:16729156,r=j(new P(new Q(24*i,1.5,20*i),s));r.position.y=.75;const l=j(new P(new Q(10*i,6,8*i),Vt(n)));l.position.set(-4*i,4.5,0);const c=new P(new Q(4*i,4,.1),ve(o,.5));c.position.set(-4*i,3.5,4.1*i),e.add(c);const h=j(new P(new Q(.5*i,12,.5*i),a));h.position.set(6*i,6,4*i);const u=h.clone();u.position.z=-4*i;const d=j(new P(new Q(12*i,1,1*i),a));d.position.set(8*i,12,0);const f=new P(new _e(.3*i,8,8),ve(16777130,2));f.position.set(12*i,11.5,0),e.add(f);const g=new Vn({color:1127253,roughness:.1,metalness:.8,transparent:!0,opacity:.8});for(let p=-1;p<=1;p+=2){const y=new P(new Q(4*i,.5,10*i),g);y.position.set(p*4*i,.1,0),e.add(y)}const _=new P(new wt(.2,.2,6),Lt(8947848));_.position.set(0,15,0);const m=new P(new Q(3,2,.1),Vt(n));return m.position.set(1.5,16,0),m.userData.isFlag=!0,e.add(r,l,h,u,d,_,m),e}function lg(i){if(i==="land"){const t=new de,e=new P(new wt(.1,.1,.8,6),ve(16755200,2));e.rotation.x=Math.PI/2,t.add(e);const n=new P(new li(.15,1.5,6),new ie({color:16733440,transparent:!0,opacity:.6}));return n.rotation.x=-Math.PI/2,n.position.z=-1,t.add(n),t}if(i==="sea"){const t=new de,e=new P(new wt(.3,.3,1.5,8),Lt(5592422,.4,.8));e.rotation.x=Math.PI/2,t.add(e);const n=new P(new li(.3,.5,8),Lt(8947865,.3,.9));return n.rotation.x=Math.PI/2,n.position.z=1,t.add(n),t}if(i==="air"){const t=new de,e=new P(new wt(.15,.15,1.2,8),Lt(13421772,.5,.5));e.rotation.x=Math.PI/2,t.add(e);const n=new Q(.4,.05,.2);for(let a=0;a<4;a++){const o=new P(n,Lt(5592405));o.position.z=-.5,o.rotation.z=Math.PI/2*a,t.add(o)}const s=new P(new wt(.1,.15,.3,6),ve(16729088,3));return s.rotation.x=Math.PI/2,s.position.z=-.7,t.add(s),t}return new P(new _e(.3,8,8),ve(16755200,2))}function cg(i,t){const e=Vt(t),n=Lt(4473924),s=Lt(6710886),a=j(new P(new Q(3.5,1,5),n));a.position.y=.8;const o=j(new P(new Q(3,2,3),e));o.position.set(0,2,.5);const r=j(new P(new wt(1.2,1.5,1,8),n));r.position.set(0,2.8,1.5);const l=new P(new wt(.3,.3,2.5,6),s);l.rotation.x=Math.PI/2,l.position.set(0,2.8,3.5);const c=new P(new wt(.3,.3,2.5,6),s);c.rotation.x=Math.PI/2,c.position.set(.6,2.8,3.5);const h=new P(new wt(.3,.3,2.5,6),s);h.rotation.x=Math.PI/2,h.position.set(-.6,2.8,3.5);const u=new wt(.7,.7,.4,8);for(const d of[[-1.7,.6,2],[1.7,.6,2],[-1.7,.6,-2],[1.7,.6,-2]]){const f=j(new P(u,_n()));f.position.set(d[0],d[1],d[2]),f.rotation.z=Math.PI/2,i.add(f)}return i.userData.muzzleOffset=new L(0,2.8,4.8),i.add(a,o,r,l,c,h),i}function hg(i,t){const e=Vt(t),n=Lt(3355443),s=ve(4521796,1.5),a=j(new P(new Q(3.5,1,6),n));a.position.y=.8;const o=j(new P(new Q(3,2,2.5),e));o.position.set(0,2,2.5);const r=j(new P(new Q(3.2,2.5,4),e));r.position.set(0,2.5,-1);const l=new P(new Q(2.5,.4,.1),s);l.position.set(0,2.8,-1);const c=new P(new Q(.4,2.5,.1),s);c.position.set(0,2.8,-1);const h=new P(new Q(2.8,1,.1),Se(2245666));h.position.set(0,2.8,3.8);const u=new wt(.7,.7,.4,8);for(const d of[[-1.7,.6,2],[1.7,.6,2],[-1.7,.6,-2],[1.7,.6,-2]]){const f=j(new P(u,_n()));f.position.set(d[0],d[1],d[2]),f.rotation.z=Math.PI/2,i.add(f)}return i.add(a,o,r,l,c,h),i}function ug(i,t){const e=Vt(t),n=Lt(6710886),s=j(new P(new wt(.5,.6,1.5,6),e));s.position.y=1;const a=j(new P(new _e(.35,6,6),e));a.position.y=1.9;const o=new P(new wt(.08,.08,1.5,4),n);o.rotation.x=Math.PI/2,o.position.set(.4,1.3,.8);const r=new P(new wt(.08,.08,1.5,4),n);return r.rotation.x=Math.PI/2,r.position.set(.6,1.3,.8),i.add(s,a,o,r),i}const xl={COAST:"coast",SEA:"sea"},dg={land:{land:{dmg:1.15,hp:1.15},sea:{dmg:.9,hp:.9},coast:{dmg:.9,hp:.9},mountain:{dmg:.9,hp:1.15}},sea:{land:{dmg:.9,hp:.9},sea:{dmg:1.2,hp:1.2},coast:{dmg:1,hp:1},mountain:{dmg:.9,hp:.9}},air:{land:{dmg:1,hp:1},sea:{dmg:1,hp:1},coast:{dmg:1,hp:1},mountain:{dmg:1,hp:1}}},uc=.1,dc=1.5,fg={land:{speed:80,radius:.3,color:16755200},sea:{speed:60,radius:.5,color:4473958},air:{speed:120,radius:.2,color:16729088}},Qs={default:{burst:1,burstDelay:0,spread:0},burst:{burst:3,burstDelay:.08,spread:5},dual:{burst:2,burstDelay:.1,spread:0},salvo:{burst:4,burstDelay:.15,spread:15},homing:{burst:1,burstDelay:0,spread:0,homing:!0},carpet:{burst:3,burstDelay:.2,spread:0,carpet:!0},barrage:{burst:3,burstDelay:.4,spread:0,barrage:!0},ap:{burst:1,burstDelay:0,spread:0,ap:!0}},ni={infantry:{domain:"land",hp:50,damage:8,range:18,speed:14,fireRate:1,hitChance:.85,cost:50,color:5597999,canFireWhileMoving:!1,bounty:30,projectile:"burst",splashRadius:0,splashFalloff:1},tank:{domain:"land",hp:200,damage:50,range:50,speed:10,fireRate:1.5,hitChance:.9,cost:200,color:4873507,canFireWhileMoving:!1,bounty:100,projectile:"ap",splashRadius:2,splashFalloff:.5},heavyTank:{domain:"land",hp:1e3,damage:1500,range:30,speed:10,fireRate:5,hitChance:.9,cost:500,color:3815978,canFireWhileMoving:!1,bounty:400,projectile:"ap",splashRadius:0,splashFalloff:1},crusher:{domain:"land",hp:3e3,damage:200,range:30,speed:10,fireRate:3,hitChance:.85,cost:1e3,color:5583701,canFireWhileMoving:!0,bounty:500,projectile:"ap",splashRadius:100,splashFalloff:.5,crusher:!0,baseTarget:!0},artillery:{domain:"land",hp:120,damage:128,range:96,speed:6,fireRate:3,hitChance:.7,cost:300,color:7035706,canFireWhileMoving:!1,bounty:120,projectile:"barrage",splashRadius:3,splashFalloff:.5},mlrs:{domain:"land",hp:80,damage:15,range:110,speed:10,fireRate:4,hitChance:.6,cost:350,color:5987130,canFireWhileMoving:!1,bounty:120,projectile:"salvo",splashRadius:2,splashFalloff:.4},missileDefense:{domain:"land",hp:500,damage:300,range:85,speed:0,fireRate:2,hitChance:.9,cost:500,color:8930440,canFireWhileMoving:!1,bounty:150,projectile:"homing",splashRadius:0,splashFalloff:1,airOnly:!0},coastal:{domain:"land",hp:400,damage:100,range:120,speed:0,fireRate:2.5,hitChance:.9,cost:400,color:5588019,canFireWhileMoving:!1,bounty:150,projectile:"ap",splashRadius:2,splashFalloff:.5,seaOnly:!0},destroyer:{domain:"sea",hp:250,damage:45,range:96,speed:12,fireRate:1.2,hitChance:.85,cost:250,color:8952234,canFireWhileMoving:!0,bounty:150,projectile:"dual",splashRadius:8,splashFalloff:.5},frigate:{domain:"sea",hp:150,damage:20,range:60,speed:18,fireRate:1,hitChance:.85,cost:150,color:5925498,canFireWhileMoving:!0,bounty:60,projectile:"default",splashRadius:0,splashFalloff:1},cruiser:{domain:"sea",hp:200,damage:40,range:100,speed:16,fireRate:1,hitChance:.9,cost:300,color:6715272,canFireWhileMoving:!0,bounty:100,projectile:"homing",splashRadius:0,splashFalloff:1,airOnly:!0},submarine:{domain:"sea",hp:100,damage:150,range:50,speed:10,fireRate:3.5,hitChance:.85,cost:350,color:2241348,canFireWhileMoving:!1,bounty:150,projectile:"ap",splashRadius:0,splashFalloff:1,seaOnly:!0,stealth:!0},battleship:{domain:"sea",hp:600,damage:130,range:160,speed:12,fireRate:3.5,hitChance:.8,cost:600,color:3359829,canFireWhileMoving:!0,bounty:300,projectile:"salvo",splashRadius:10,splashFalloff:.6},carrier:{domain:"sea",hp:800,damage:20,range:160,speed:8,fireRate:2,hitChance:.7,cost:700,color:5596791,canLaunchFighters:!0,altitude:0,canFireWhileMoving:!0,bounty:400,projectile:"default",splashRadius:0,splashFalloff:1},fighter:{domain:"air",hp:80,damage:35,range:45,speed:30,fireRate:.6,hitChance:.9,cost:300,color:10066346,altitude:25,canFireWhileMoving:!0,bounty:80,projectile:"homing",splashRadius:2,splashFalloff:.5},heli:{domain:"air",hp:120,damage:25,range:40,speed:25,fireRate:.8,hitChance:.8,cost:350,color:4868682,altitude:15,canFireWhileMoving:!0,bounty:90,projectile:"burst",splashRadius:1,splashFalloff:.5},gunship:{domain:"air",hp:250,damage:35,range:60,speed:14,fireRate:.4,hitChance:.8,cost:600,color:8952234,altitude:20,canFireWhileMoving:!0,bounty:200,projectile:"barrage",splashRadius:2,splashFalloff:.5,groundOnly:!0},bomber:{domain:"air",hp:180,damage:140,range:30,speed:18,fireRate:3.5,hitChance:.75,cost:500,color:7833753,altitude:30,canFireWhileMoving:!0,bounty:160,projectile:"carpet",splashRadius:12,splashFalloff:.5},transport:{domain:"sea",hp:1e3,damage:0,range:0,speed:15,fireRate:99,hitChance:0,cost:400,color:9139029,canFireWhileMoving:!1,bounty:200,projectile:"default",splashRadius:0,splashFalloff:1,transportCapacity:4},healer:{domain:"land",hp:150,damage:0,range:30,speed:10,fireRate:1,hitChance:0,cost:500,color:4500036,canFireWhileMoving:!1,bounty:100,projectile:"default",splashRadius:0,splashFalloff:1,healer:!0},medHeli:{domain:"air",hp:150,damage:0,range:30,speed:15,fireRate:1,hitChance:0,cost:500,color:4500036,altitude:15,canFireWhileMoving:!1,bounty:100,projectile:"default",splashRadius:0,splashFalloff:1,healer:!0},minigunnerVehicle:{domain:"land",hp:700,damage:5,range:40,speed:15,fireRate:.1,hitChance:.85,cost:800,color:8939076,canFireWhileMoving:!1,bounty:300,projectile:"burst",splashRadius:0,splashFalloff:1,buffDamage:.3,buffRange:40},megaMedic:{domain:"land",hp:500,damage:0,range:0,speed:15,fireRate:99,hitChance:0,cost:1e3,color:4500104,canFireWhileMoving:!1,bounty:400,projectile:"default",splashRadius:0,splashFalloff:1,buffHp:.3,buffRange:30},minigunner:{domain:"land",hp:500,damage:5,range:40,speed:8,fireRate:.1,hitChance:.85,cost:400,color:8943445,canFireWhileMoving:!1,bounty:150,projectile:"burst",splashRadius:0,splashFalloff:1,buffInfantryHp:2,buffRange:30},escortJet:{domain:"air",hp:2e3,damage:10,range:10,speed:25,fireRate:.5,hitChance:.9,cost:800,color:5596791,altitude:25,canFireWhileMoving:!0,bounty:200,projectile:"homing",splashRadius:0,splashFalloff:1},b2:{domain:"air",hp:800,damage:1e3,range:25,speed:20,fireRate:3,hitChance:.9,cost:800,color:3355460,altitude:35,canFireWhileMoving:!0,bounty:400,projectile:"carpet",splashRadius:18,splashFalloff:.3,baseOnly:!0,oneWay:!0},escortBomber:{domain:"air",hp:5e3,damage:0,range:0,speed:22,fireRate:99,hitChance:0,cost:500,color:4473941,altitude:30,canFireWhileMoving:!0,bounty:0,projectile:"default",splashRadius:0,splashFalloff:1,escortBomber:!0,oneWay:!0}},Pi={hp:{name:"Armor",icon:"🛡️",tiers:[1,1.25,1.5,2],costs:[0,300,800,2e3]},damage:{name:"Firepower",icon:"💥",tiers:[1,1.25,1.5,2],costs:[0,300,800,2e3]},speed:{name:"Engines",icon:"⚡",tiers:[1,1.2,1.4,1.7],costs:[0,250,700,1800]}};class pg{constructor(t,e,n,s,a,o="land",r="default",l=0,c=1){this.scene=t,this.target=n,this.damage=s,this.hitChance=a,this.type=o,this.speed=fg[o].speed,this.pattern=r,this.splashRadius=l,this.splashFalloff=c,this.alive=!0,this.mesh=lg(o),this.mesh.position.copy(e),t.add(this.mesh);const h=Qs[r]||Qs.default;this.burst=h.burst||1,this.burstDelay=h.burstDelay||0,this.spread=h.spread||0,this.homing=h.homing||!1,this.carpet=h.carpet||!1,this.barrage=h.barrage||!1,this.ap=h.ap||!1,this._burstIndex=0,this._burstTimer=0,this._initialPos=e.clone(),this._targetPos=n.mesh?n.mesh.position.clone():n.position.clone(),this._arcProgress=0,this._arcTotalDist=this._initialPos.distanceTo(this._targetPos),this._arcHeight=this._arcTotalDist*.3,this._arcDuration=this._arcTotalDist/this.speed}update(t){if(!this.alive||!this.target||!this.target.alive){this.destroy();return}if(!this.target.mesh){this.destroy();return}const e=this.target.mesh.position;if(this.type==="land"){if(this._arcProgress+=t/this._arcDuration,this._arcProgress>=1){this.mesh.position.copy(e),this.impact();return}const n=this._arcProgress;this.mesh.position.lerpVectors(this._initialPos,this._targetPos,n);const s=4*this._arcHeight*n*(1-n);this.mesh.position.y+=s}else{const n=new L().subVectors(e,this.mesh.position);if(n.length()<2){this.impact();return}n.normalize().multiplyScalar(this.speed*t),this.mesh.position.add(n)}this.type==="air"&&this.spawnAirTrail()}impact(){const t=Math.random()<this.hitChance,e=this.mesh.position.clone();if(t){let n=this.damage;const s=Math.random()<uc;s&&(n*=dc),this.ap&&this.target.takeDamage?this.target.takeDamage(n):this.target.takeDamage(n),console.log(`[DEBUG COMBAT] HIT — ${n.toFixed(1)} damage${s?" (CRITICAL!)":""} → ${this.target.type||"target"} HP: ${this.target.hp!=null?this.target.hp.toFixed(0):"N/A"}`)}else console.log("[DEBUG COMBAT] MISS — no damage dealt");this.splashRadius>0&&this.applySplash(e),pc(this.scene,e,this.splashRadius),this.destroy()}applySplash(t){const e=[...this.scene.userData.game?.playerUnits||[],...this.scene.userData.game?.enemyUnits||[]];for(const s of e){if(!s.alive)continue;const a=Math.hypot(s.mesh.position.x-t.x,s.mesh.position.z-t.z);if(a<=this.splashRadius&&s!==this.target){const o=We.lerp(1,this.splashFalloff,a/this.splashRadius),r=this.damage*o;s.takeDamage(r),console.log(`[DEBUG COMBAT] SPLASH — ${r.toFixed(1)} to ${s.type} (dist: ${a.toFixed(1)})`)}}const n=this.scene.userData.game?.bases||[];for(const s of n){if(!s.alive)continue;const a=Math.hypot(s.mesh.position.x-t.x,s.mesh.position.z-t.z);if(a<=this.splashRadius){const o=We.lerp(1,this.splashFalloff,a/this.splashRadius),r=this.damage*o;s.takeDamage(r),console.log(`[DEBUG COMBAT] SPLASH BASE — ${r.toFixed(1)} to ${s.name} (dist: ${a.toFixed(1)})`)}}}destroy(){this.alive=!1,this.scene.remove(this.mesh)}spawnAirTrail(){const t=new P(new _e(.1,4,4),new ie({color:16750848,transparent:!0,opacity:.8}));t.position.copy(this.mesh.position),t.userData.life=.3,this.scene.add(t),this.scene.userData.airTrails=this.scene.userData.airTrails||[],this.scene.userData.airTrails.push(t)}}function fc(i,t,e,n,s,a,o,r,l,c=0,h=null,u=null,d=null,f=0){const g=Qs[o]||Qs.default,_=[],m=u!==null?u:g.burst;f||g.burstDelay;const p=h||(e.mesh?e.mesh.position:e.position);for(let y=0;y<m;y++){const v=new pg(i,t,e,n,s,a,o,r,l);if(g.spread>0&&m>1){const M=We.degToRad(g.spread),I=(y/(m-1)-.5)*M,C=new L().subVectors(p,t).normalize();C.applyAxisAngle(new L(0,1,0),I);const b=t.clone().add(C.multiplyScalar(1e3));v._targetPos=b}if(g.carpet&&m>1){const M=d||new L(0,0,1),C=(y-(m-1)/2)*6;v._targetPos=p.clone().add(M.multiplyScalar(C))}if(g.barrage&&m>1){const M=new L().subVectors(p,t).normalize(),C=t.distanceTo(p)/m;v._targetPos=t.clone().add(M.multiplyScalar(C*(y+1)))}_.push(v)}return _}function mg(i,t){const e=i.userData.airTrails||[];for(let n=e.length-1;n>=0;n--){const s=e[n];s.userData.life-=t,s.scale.multiplyScalar(.9),s.material.opacity-=.3*t,s.userData.life<=0&&(i.remove(s),e.splice(n,1))}}function pc(i,t,e=0){const n=[],s=e>0?16:8;for(let a=0;a<s;a++){const o=new P(new Q(.6,.6,.6),new ie({color:a%2?16737792:16763904}));o.position.copy(t);const r=new L((Math.random()-.5)*20,Math.random()*15,(Math.random()-.5)*20);o.userData={v:r,life:.6},i.add(o),n.push(o)}if(i.userData.explosions=i.userData.explosions||[],i.userData.explosions.push(...n),e>0){const a=new on(e*.9,e*1.1,32),o=new ie({color:16746496,transparent:!0,opacity:.5,side:pe,depthTest:!1}),r=new P(a,o);r.rotation.x=-Math.PI/2,r.position.set(t.x,.2,t.z),r.userData={life:.4,maxRadius:e},i.add(r),i.userData.splashRings=i.userData.splashRings||[],i.userData.splashRings.push(r)}}function gg(i,t){const e=i.userData.explosions||[];for(let s=e.length-1;s>=0;s--){const a=e[s];a.userData.life-=t,a.userData.v.y-=30*t,a.position.addScaledVector(a.userData.v,t),a.scale.multiplyScalar(.96),a.userData.life<=0&&(i.remove(a),e.splice(s,1))}const n=i.userData.splashRings||[];for(let s=n.length-1;s>=0;s--){const a=n[s];a.userData.life-=t,a.material.opacity=We.lerp(0,.5,a.userData.life/.4),a.scale.multiplyScalar(1.02),a.userData.life<=0&&(i.remove(a),n.splice(s,1))}}function _g(i,t){mg(i,t)}function vg(i,t,e,n,s,a=0,o=1){const r=Math.random()<s,l=e.mesh?e.mesh.position.clone():e.position?e.position.clone():t.clone();let c=n;if(r&&(Math.random()<uc&&(c*=dc),e.takeDamage(c)),a>0){const h=[...i.userData.game?.playerUnits||[],...i.userData.game?.enemyUnits||[]];for(const d of h){if(!d.alive||d===e)continue;const f=Math.hypot(d.mesh.position.x-l.x,d.mesh.position.z-l.z);if(f<=a){const g=We.lerp(1,o,f/a);d.takeDamage(n*g)}}const u=i.userData.game?.bases||[];for(const d of u){if(!d.alive)continue;const f=Math.hypot(d.mesh.position.x-l.x,d.mesh.position.z-l.z);if(f<=a){const g=We.lerp(1,o,f/a);d.takeDamage(n*g)}}}return pc(i,l,a),{hit:r,damage:r?c:0}}function xg(i,t,e,n){const s=dg[i]?.[t]||{dmg:1,hp:1};return{dmg:e*s.dmg,hp:n*s.hp}}class yg{constructor(t){this.terrain=t,this.size=U0,this.cell=lc,this.terrainGrid=new Array(this.size*this.size);for(let e=0;e<this.size;e++)for(let n=0;n<this.size;n++){const{x:s,z:a}=this.gridToWorld(n,e);let o=t.getTerrainAt(s,a);if(t.mountains){for(const r of t.mountains)if(Math.hypot(s-r.x,a-r.z)<r.r){o=je.MOUNTAIN;break}}this.terrainGrid[e*this.size+n]=o}}worldToGrid(t,e){const n=Math.floor((t+ae/2)/this.cell),s=Math.floor((e+ae/2)/this.cell);return{gx:n,gy:s}}gridToWorld(t,e){return{x:t*this.cell-ae/2+this.cell/2,z:e*this.cell-ae/2+this.cell/2}}inBounds(t,e){return t>=0&&e>=0&&t<this.size&&e<this.size}walkable(t,e,n){if(!this.inBounds(t,e))return!1;const s=this.terrainGrid[e*this.size+t];return n==="air"?s!==je.MOUNTAIN:n==="sea"?s===je.SEA||s===je.COAST:n==="land"?s===je.LAND||s===je.COAST:!1}findTransportPath(t,e){const n=this.findPath(t,e,"land");if(n)return{needsTransport:!1,path:n};const s=this.worldToGrid(t.x,t.z),a=this.worldToGrid(e.x,e.z),o=this.findNearestCoast(s.gx,s.gy,"land"),r=this.findNearestCoast(a.gx,a.gy,"land");if(!o||!r)return null;const l=this.gridToWorld(o.groundTile.gx,o.groundTile.gy),c=this.gridToWorld(r.groundTile.gx,r.groundTile.gy),h=this.gridToWorld(o.seaTile.gx,o.seaTile.gy),u=this.gridToWorld(r.seaTile.gx,r.seaTile.gy),d=new L(l.x,0,l.z),f=new L(c.x,0,c.z),g=new L(h.x,0,h.z),_=new L(u.x,0,u.z),m=this.findPath(t,d,"land"),p=this.findPath(g,_,"sea",!1),y=this.findPath(f,e,"land");if(!m||!p||!y)return null;const v=[...m];for(let M=1;M<p.length;M++)v.push(p[M]);for(let M=1;M<y.length;M++)v.push(y[M]);return{needsTransport:!0,path:v,embarkPoint:d,disembarkPoint:f,shipEmbarkPoint:g,shipDisembarkPoint:_,segments:{walkToShip:m,sail:p,walkToTarget:y}}}findPath(t,e,n,s=!0){if(n==="air")return[e.clone()];const a=this.worldToGrid(t.x,t.z);let o=this.worldToGrid(e.x,e.z);if(!this.walkable(o.gx,o.gy,n)&&(o=this.findNearestWalkable(o.gx,o.gy,n),!o))return null;if(a.gx===o.gx&&a.gy===o.gy)return[e.clone()];const r=new Mg,l=new Set,c=new Map,h=new Map,u=(m,p)=>p*this.size+m,d=u(a.gx,a.gy);h.set(d,0),r.push({key:d,gx:a.gx,gy:a.gy,f:this.heuristic(a,o)});const f=[[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.414],[-1,1,1.414],[1,-1,1.414],[-1,-1,1.414]];let g=0;const _=4e3;for(;!r.isEmpty()&&g++<_;){const m=r.pop();if(m.gx===o.gx&&m.gy===o.gy)return this.reconstruct(c,m.key,e,n,s);l.add(m.key);for(const[p,y,v]of f){const M=m.gx+p,I=m.gy+y;if(!this.walkable(M,I,n)||p!==0&&y!==0&&(!this.walkable(m.gx+p,m.gy,n)||!this.walkable(m.gx,m.gy+y,n)))continue;const C=u(M,I);if(l.has(C))continue;const b=(h.get(m.key)??1/0)+v;if(b<(h.get(C)??1/0)){c.set(C,m.key),h.set(C,b);const k=b+this.heuristic({gx:M,gy:I},o);r.push({key:C,gx:M,gy:I,f:k})}}}return null}heuristic(t,e){const n=Math.abs(t.gx-e.gx),s=Math.abs(t.gy-e.gy);return n+s+(1.414-2)*Math.min(n,s)}reconstruct(t,e,n,s,a){const o=[];let r=e;for(;r!==void 0;){const l=Math.floor(r/this.size),c=r%this.size,h=this.gridToWorld(c,l);o.push(new L(h.x,0,h.z)),r=t.get(r)}return o.reverse(),o.length>0&&(o[o.length-1]=n.clone()),a?this.smoothPath(o,s):o}smoothPath(t,e){if(t.length<3)return t;const n=[t[0]];let s=0;for(;s<t.length-1;){let a=t.length-1;for(;a>s+1&&!this.hasLineOfSight(t[s],t[a],e);)a--;n.push(t[a]),s=a}return n}hasLineOfSight(t,e,n){if(n==="air")return!0;const s=this.worldToGrid(t.x,t.z),a=this.worldToGrid(e.x,e.z);let o=s.gx,r=s.gy;const l=a.gx,c=a.gy,h=Math.abs(l-o),u=o<l?1:-1,d=-Math.abs(c-r),f=r<c?1:-1;let g=h+d,_;for(;;){if(!this.walkable(o,r,n))return!1;if(o===l&&r===c)break;_=2*g,_>=d&&(g+=d,o+=u),_<=h&&(g+=h,r+=f)}return!0}findNearestWalkable(t,e,n){const s=[{gx:t,gy:e}],a=new Set([e*this.size+t]);for(;s.length>0;){const o=s.shift();if(this.walkable(o.gx,o.gy,n))return o;const r=[[1,0],[-1,0],[0,1],[0,-1]];for(const[l,c]of r){const h=o.gx+l,u=o.gy+c,d=u*this.size+h;this.inBounds(h,u)&&!a.has(d)&&(a.add(d),s.push({gx:h,gy:u}))}}return null}findNearestCoast(t,e,n){if(!this.walkable(t,e,n)){const o=this.findNearestWalkable(t,e,n);if(!o)return null;t=o.gx,e=o.gy}const s=[{gx:t,gy:e}],a=new Set([e*this.size+t]);for(;s.length>0;){const o=s.shift();if(this.terrainGrid[o.gy*this.size+o.gx]===je.COAST){const c=[[1,0],[-1,0],[0,1],[0,-1]];for(const[h,u]of c){const d=o.gx+h,f=o.gy+u;if(!this.inBounds(d,f))continue;if(this.terrainGrid[f*this.size+d]===je.SEA)return{groundTile:o,seaTile:{gx:d,gy:f}}}return{groundTile:o,seaTile:o}}const l=[[1,0],[-1,0],[0,1],[0,-1]];for(const[c,h]of l){const u=o.gx+c,d=o.gy+h,f=d*this.size+u;this.inBounds(u,d)&&!a.has(f)&&this.walkable(u,d,n)&&(a.add(f),s.push({gx:u,gy:d}))}}return null}}class Mg{constructor(){this.data=[]}isEmpty(){return this.data.length===0}push(t){this.data.push(t);let e=this.data.length-1;for(;e>0;){const n=e-1>>1;if(this.data[n].f<=this.data[e].f)break;[this.data[n],this.data[e]]=[this.data[e],this.data[n]],e=n}}pop(){const t=this.data[0],e=this.data.pop();if(this.data.length>0){this.data[0]=e;let n=0;const s=this.data.length;for(;;){let a=2*n+1,o=2*n+2,r=n;if(a<s&&this.data[a].f<this.data[r].f&&(r=a),o<s&&this.data[o].f<this.data[r].f&&(r=o),r===n)break;[this.data[r],this.data[n]]=[this.data[n],this.data[r]],n=r}}return t}}class Sg{constructor(t){this.scene=t,this.size=60,this.cell=ae/this.size,this.grid=new Uint8Array(this.size*this.size),this.fogTexture=new Vm(new Uint8Array(this.size*this.size*4),this.size,this.size,an),this.fogTexture.magFilter=Je;const e=new dn(ae,ae);e.rotateX(-Math.PI/2);const n=new ie({map:this.fogTexture,transparent:!0,depthWrite:!1});this.mesh=new P(e,n),this.mesh.position.y=30,this.mesh.renderOrder=999,t.add(this.mesh),this.updateMesh()}worldToGrid(t,e){const n=Math.floor((t+ae/2)/this.cell),s=Math.floor((e+ae/2)/this.cell);return{gx:Math.max(0,Math.min(this.size-1,n)),gy:Math.max(0,Math.min(this.size-1,s))}}isExplored(t,e){const{gx:n,gy:s}=this.worldToGrid(t,e);return this.grid[s*this.size+n]>=1}isVisible(t,e){const{gx:n,gy:s}=this.worldToGrid(t,e);return this.grid[s*this.size+n]===2}update(t,e){for(let a=0;a<this.grid.length;a++)this.grid[a]===2&&(this.grid[a]=1);const n=100,s=200;for(const a of t)a.alive&&this.reveal(a.mesh.position.x,a.mesh.position.z,n);for(const a of e)this.reveal(a.mesh.position.x,a.mesh.position.z,s);this.updateMesh()}reveal(t,e,n){const s=Math.ceil(n/this.cell),{gx:a,gy:o}=this.worldToGrid(t,e);for(let r=-s;r<=s;r++)for(let l=-s;l<=s;l++){if(l*l+r*r>s*s)continue;const c=a+l,h=o+r;c<0||h<0||c>=this.size||h>=this.size||(this.grid[h*this.size+c]=2)}}updateMesh(){const t=this.fogTexture.image.data;for(let e=0;e<this.size*this.size;e++){const n=this.grid[e],s=n===0?80:n===1?30:0;t[e*4]=0,t[e*4+1]=0,t[e*4+2]=0,t[e*4+3]=s}this.fogTexture.needsUpdate=!0}serialize(){return Array.from(this.grid)}deserialize(t){this.grid=new Uint8Array(t),this.updateMesh()}}class Tg{constructor(t,e){this.game=t,this.camera=e,this.size=250,this.canvas=document.createElement("canvas"),this.canvas.width=this.size,this.canvas.height=this.size,this.canvas.id="minimap",this.canvas.style.cssText=`
      position:fixed; top:50px; right:10px;
      border:2px solid #4af; border-radius:6px;
      background:#2a4a6c; cursor:crosshair; z-index:20;
      box-shadow:0 0 15px rgba(70,170,255,0.4);
    `,document.body.appendChild(this.canvas),this.ctx=this.canvas.getContext("2d"),this.canvas.addEventListener("mousedown",n=>this.onClick(n)),this.canvas.addEventListener("mousemove",n=>{n.buttons&1&&this.onClick(n)})}worldToMini(t,e){const n=this.size/ae;return{x:(t+ae/2)*n,y:(e+ae/2)*n}}miniToWorld(t,e){const n=ae/this.size;return{x:t*n-ae/2,z:e*n-ae/2}}onClick(t){const e=this.canvas.getBoundingClientRect(),n=t.clientX-e.left,s=t.clientY-e.top,a=this.miniToWorld(n,s);if(this.game.placementMode&&this.game.placementMode.active){const o={x:a.x,z:a.z};this.game.confirmPlacement(o);return}this.game.cameraTarget&&(this.game.cameraTarget.x=a.x,this.game.cameraTarget.z=a.z,this.addPing(n,s))}addPing(t,e){this.pings=this.pings||[],this.pings.push({x:t,y:e,life:1,maxLife:1,time:0})}draw(){const t=this.ctx,e=this.size;t.clearRect(0,0,e,e),t.fillStyle="#2a4a6c",t.fillRect(0,0,e,e),t.strokeStyle="#4a7a5a",t.lineWidth=2;for(const n of this.game.terrain.landmasses){const s=this.worldToMini(n.x-n.w/2,n.z-n.d/2),a=n.w*e/ae,o=n.d*e/ae;t.strokeRect(s.x,s.y,a,o)}t.fillStyle="#5a4a3a";for(const n of this.game.terrain.mountains){const s=this.worldToMini(n.x,n.z);t.fillRect(s.x-1,s.y-1,2,2)}if(this.game.fog){const n=this.game.fog,s=e/n.size;for(let a=0;a<n.size;a++)for(let o=0;o<n.size;o++){const r=n.grid[a*n.size+o];if(r===0)t.fillStyle="rgba(0,0,0,0.85)",t.fillRect(o*s,a*s,s+1,s+1);else if(r===1){const l=o*s+s/2,c=a*s+s/2,h=this.miniToWorld(l,c),u=this.game.terrain.getTerrainAt(h.x,h.z);u==="land"||u==="coast"?(t.fillStyle="rgba(58,90,42,0.5)",t.fillRect(o*s,a*s,s+1,s+1)):u==="sea"&&(t.fillStyle="rgba(26,58,92,0.5)",t.fillRect(o*s,a*s,s+1,s+1))}}}for(const n of this.game.bases){if(!n.alive||n.faction==="enemy"&&this.game.fog&&!this.game.fog.isExplored(n.mesh.position.x,n.mesh.position.z))continue;const s=this.worldToMini(n.mesh.position.x,n.mesh.position.z),a=n.territory/ae*e;t.beginPath(),t.arc(s.x,s.y,a,0,Math.PI*2),t.fillStyle=n.faction==="player"?"rgba(68,170,255,0.12)":"rgba(255,68,68,0.12)",t.fill(),t.strokeStyle=n.faction==="player"?"rgba(68,170,255,0.4)":"rgba(255,68,68,0.4)",t.lineWidth=1,t.stroke()}for(const n of this.game.bases){const s=this.worldToMini(n.mesh.position.x,n.mesh.position.z);n.faction==="enemy"&&this.game.fog&&!this.game.fog.isExplored(n.mesh.position.x,n.mesh.position.z)||(t.fillStyle=n.faction==="player"?"#44aaff":"#ff4444",t.fillRect(s.x-3,s.y-3,6,6),t.strokeStyle="#fff",t.lineWidth=1,t.strokeRect(s.x-3,s.y-3,6,6))}for(const n of this.game.playerUnits){if(!n.alive)continue;const s=this.worldToMini(n.mesh.position.x,n.mesh.position.z);t.fillStyle=n.selected?"#44ff88":"#44aaff",t.fillRect(s.x-1,s.y-1,2,2)}for(const n of this.game.enemyUnits){if(!n.alive||this.game.fog&&!this.game.fog.isVisible(n.mesh.position.x,n.mesh.position.z))continue;const s=this.worldToMini(n.mesh.position.x,n.mesh.position.z);t.fillStyle="#ff5555",t.fillRect(s.x-1,s.y-1,2,2)}if(this.game.cameraTarget){const n=this.worldToMini(this.game.cameraTarget.x,this.game.cameraTarget.z),s=150*e/ae,a=100*e/ae;t.strokeStyle="#ffffff",t.lineWidth=1,t.strokeRect(n.x-s/2,n.y-a/2,s,a)}if(this.pings)for(let n=this.pings.length-1;n>=0;n--){const s=this.pings[n];if(s.life-=.03,s.time+=.03,s.life<=0){this.pings.splice(n,1);continue}const a=s.life/s.maxLife;t.strokeStyle=`rgba(68, 255, 136, ${a})`,t.lineWidth=2,t.beginPath();const o=8*(1-a)+2;t.arc(s.x,s.y,o,0,Math.PI*2),t.stroke(),t.strokeStyle=`rgba(68, 255, 136, ${a*.5})`,t.beginPath(),t.arc(s.x,s.y,o*.6,0,Math.PI*2),t.stroke()}}}class bg{constructor(){this.ctx=null,this.enabled=!0,this.masterVolume=.3}init(){this.ctx||(this.ctx=new(window.AudioContext||window.webkitAudioContext),this.master=this.ctx.createGain(),this.master.gain.value=this.masterVolume,this.master.connect(this.ctx.destination))}resume(){this.ctx?.state==="suspended"&&this.ctx.resume()}play(t){if(!(!this.enabled||!this.ctx))switch(this.resume(),t){case"fire":return this.playFire();case"explosion":return this.playExplosion();case"select":return this.playSelect();case"move":return this.playMove();case"build":return this.playBuild();case"upgrade":return this.playUpgrade();case"capture":return this.playCapture();case"launch":return this.playLaunch()}}playFire(){const t=this.ctx.currentTime,e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="square",e.frequency.setValueAtTime(180,t),e.frequency.exponentialRampToValueAtTime(60,t+.08),n.gain.setValueAtTime(.3,t),n.gain.exponentialRampToValueAtTime(.001,t+.1),e.connect(n),n.connect(this.master),e.start(t),e.stop(t+.12)}playExplosion(){const t=this.ctx.currentTime,e=this.ctx.sampleRate*.4,n=this.ctx.createBuffer(1,e,this.ctx.sampleRate),s=n.getChannelData(0);for(let l=0;l<e;l++)s[l]=(Math.random()*2-1)*Math.pow(1-l/e,2);const a=this.ctx.createBufferSource();a.buffer=n;const o=this.ctx.createBiquadFilter();o.type="lowpass",o.frequency.setValueAtTime(800,t),o.frequency.exponentialRampToValueAtTime(100,t+.4);const r=this.ctx.createGain();r.gain.setValueAtTime(.6,t),r.gain.exponentialRampToValueAtTime(.01,t+.4),a.connect(o),o.connect(r),r.connect(this.master),a.start(t)}playSelect(){const t=this.ctx.currentTime,e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="sine",e.frequency.setValueAtTime(660,t),e.frequency.linearRampToValueAtTime(880,t+.05),n.gain.setValueAtTime(.15,t),n.gain.exponentialRampToValueAtTime(.001,t+.08),e.connect(n),n.connect(this.master),e.start(t),e.stop(t+.1)}playMove(){const t=this.ctx.currentTime,e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="triangle",e.frequency.setValueAtTime(440,t),n.gain.setValueAtTime(.1,t),n.gain.exponentialRampToValueAtTime(.001,t+.06),e.connect(n),n.connect(this.master),e.start(t),e.stop(t+.08)}playBuild(){const t=this.ctx.currentTime;[440,554,659].forEach((e,n)=>{const s=this.ctx.createOscillator(),a=this.ctx.createGain();s.type="sine",s.frequency.value=e,a.gain.setValueAtTime(0,t+n*.05),a.gain.linearRampToValueAtTime(.12,t+n*.05+.01),a.gain.exponentialRampToValueAtTime(.001,t+n*.05+.1),s.connect(a),a.connect(this.master),s.start(t+n*.05),s.stop(t+n*.05+.12)})}playUpgrade(){const t=this.ctx.currentTime,e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="sawtooth",e.frequency.setValueAtTime(220,t),e.frequency.exponentialRampToValueAtTime(880,t+.3),n.gain.setValueAtTime(.15,t),n.gain.exponentialRampToValueAtTime(.001,t+.35),e.connect(n),n.connect(this.master),e.start(t),e.stop(t+.4)}playCapture(){const t=this.ctx.currentTime;[523,659,784,1047].forEach((e,n)=>{const s=this.ctx.createOscillator(),a=this.ctx.createGain();s.type="square",s.frequency.value=e,a.gain.setValueAtTime(0,t+n*.1),a.gain.linearRampToValueAtTime(.12,t+n*.1+.01),a.gain.exponentialRampToValueAtTime(.001,t+n*.1+.15),s.connect(a),a.connect(this.master),s.start(t+n*.1),s.stop(t+n*.1+.18)})}playLaunch(){const t=this.ctx.currentTime,e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="sawtooth",e.frequency.setValueAtTime(100,t),e.frequency.exponentialRampToValueAtTime(600,t+.5),n.gain.setValueAtTime(.2,t),n.gain.exponentialRampToValueAtTime(.001,t+.5),e.connect(n),n.connect(this.master),e.start(t),e.stop(t+.55)}}const He=new bg;class wg{constructor(t){this.game=t,this.tiers={hp:0,damage:0,speed:0}}multiplier(t){return ji[t].tiers[this.tiers[t]]}applyTo(t){return{...t,hp:t.hp*this.multiplier("hp"),damage:t.damage*this.multiplier("damage"),speed:t.speed*this.multiplier("speed")}}canUpgrade(t){const e=this.tiers[t];return e>=ji[t].tiers.length-1?!1:this.game.money>=ji[t].costs[e+1]}nextCost(t){const e=this.tiers[t];return e>=ji[t].tiers.length-1?null:ji[t].costs[e+1]}upgrade(t){if(!this.canUpgrade(t))return!1;const e=this.nextCost(t);if(this.game.money-=e,this.tiers[t]++,He.play("upgrade"),t==="hp")for(const n of this.game.playerUnits){const s=n.hp/n.maxHp,a=n.stats.hp*this.multiplier("hp");n.maxHp=a,n.hp=a*s}return!0}serialize(){return{...this.tiers}}deserialize(t){this.tiers={...this.tiers,...t}}}class Eg{constructor(t,e,n,s){this.game=t,this.type=e,this.faction=n;const a=An[e];this.stats=n==="player"?t.upgrades.applyTo(a):{...a},this.domain=a.domain,this.maxHp=this.stats.hp,this.hp=this.maxHp,this.state="idle",this.target=null,this.path=[],this.moveTarget=null,this.attackMoveDest=null,this.cooldown=0,this.alive=!0,this.selected=!1,this.engageRange=this.stats.range*L0,this._pursueTarget=null,this.canLaunch=!!a.canLaunchFighters,this.launchCooldown=0,this.canFireWhileMoving=!!this.stats.canFireWhileMoving,this._targetScanTimer=0,this.isTransport=this.type==="transport",this.carriedUnits=[],this.transportCapacity=this.stats.transportCapacity||0,this._boardingTimer=0,this._assignedEmbarkPoint=null,this._claimedByShip=null,this._amphibious=!1,this._transportData=null,this._pathLine=null,this._pathArrowHead=null,this._dmgMult=1,this._hpMult=1,this._baseMaxHp=this.stats.hp,this._auraTimer=0,this._destroyerShotCount=0,this._battleshipBroadside=!1,this._bomberCarpetDir=null,this._artilleryBarrageIndex=0,this._infantryCaptureTarget=null,this.mesh=hc(e,a.color,n),this._stealthed=!!this.stats.stealth,this._stealthed&&this.mesh.traverse(v=>{v.material&&(v.material=v.material.clone(),v.userData.origOpacity=v.material.opacity,v.material.transparent=!0,v.material.opacity=.15)});const o=this.domain==="air"?a.altitude:s.y??(this.domain==="sea"?.3:Re+.5);this.mesh.position.set(s.x,o,s.z),this._labelHeight=this.domain==="air"||this.domain==="sea"?4:3.5;const r=new on(3,4,16),l=new ie({color:n==="player"?65535:16729156,side:pe,transparent:!0,opacity:0});this.ring=new P(r,l),this.ring.rotation.x=-Math.PI/2,this.ring.position.y=.1,this.mesh.add(this.ring);const c=new aa(3,16),h=new ie({color:n==="player"?65535:16729156,transparent:!0,opacity:0,side:pe,depthWrite:!1});this._ringFill=new P(c,h),this._ringFill.rotation.x=-Math.PI/2,this._ringFill.position.y=.05,this.mesh.add(this._ringFill);const u=e==="carrier"?7:e==="battleship"?6:e==="destroyer"?5:e==="tank"||e==="artillery"?4:e==="infantry"?3:2.5,d=.5,f=this.domain==="air"?-3:this.domain==="sea"?2.5:3.5;this._barWidth=u;const g=new P(new dn(u+.15,d+.15),new ie({color:0,transparent:!0,opacity:.9,depthTest:!1}));g.rotation.x=-Math.PI/2,g.position.y=f-.01,g.renderOrder=899;const _=new P(new dn(u,d),new ie({color:1118481,transparent:!0,opacity:.9,depthTest:!1}));_.rotation.x=-Math.PI/2,_.position.y=f,_.renderOrder=900;const m=new P(new dn(u,d),new ie({color:n==="player"?4521864:16729156,depthTest:!1}));m.renderOrder=901;const p=new P(new dn(u,d),new ie({color:16755336,transparent:!0,opacity:.6,depthTest:!1}));p.renderOrder=900;const y=new de;y.add(g,_,m,p),y.position.set(0,f,0),this.mesh.add(y),this._hpBar={fg:m,trail:p,barWidth:u},this._displayHp=this.maxHp,this._trailHp=this.maxHp,this._hitFlash=!1,this._hitFlashTimer=0,this._hitFlashOrig=!1,this._rangeRing=null,this._pushCooldown=0,t.scene.add(this.mesh)}setSelected(t){this.selected=t,this.ring.material.opacity=t?1:0,this._ringFill&&(this._ringFill.material.opacity=t?.2:0),this._updateHpBar(0),t?(this._buildRangeRing(),this._rangeRing&&(this._rangeRing.position.set(this.mesh.position.x,.3,this.mesh.position.z),this.game.scene.add(this._rangeRing),this._rangeRing.visible=!0)):this._rangeRing&&(this._rangeRing.visible=!1,this.game.scene.remove(this._rangeRing))}moveTo(t,e=!1){if(!t||t.x==null||t.z==null){this.state="idle";return}if(this.stats.speed===0){this.state="idle";return}const n=t instanceof L?t:new L(t.x,0,t.z);if(this.domain!=="air"){const s=this.game.terrain.getTerrainAt(n.x,n.z);if(!this.canEnter(s)){const a=this.game.pathfinder.worldToGrid(n.x,n.z),o=this.game.pathfinder.findNearestWalkable(a.gx,a.gy,this.domain);if(o){const r=this.game.pathfinder.gridToWorld(o.gx,o.gy);n.set(r.x,0,r.z)}else{this.state="idle";return}}}if(this.attackMove=e,this.attackMoveDest=n.clone(),this._transportData=null,this.domain==="air")this.moveTarget=n.clone(),this.path=[];else if(this.domain==="land"){const s=this.game.pathfinder.findTransportPath(this.mesh.position,n);if(s)if(s.needsTransport){const a=this.game.bases.filter(o=>o.faction===this.faction&&o.alive);if(a.length>0){let o=a[0],r=1/0;for(const h of a){const u=Math.hypot(h.mesh.position.x-n.x,h.mesh.position.z-n.z);u<r&&(r=u,o=h)}const l=this.game.pathfinder.worldToGrid(o.mesh.position.x,o.mesh.position.z),c=this.game.pathfinder.findNearestCoast(l.gx,l.gy,"land");if(c){const h=this.game.pathfinder.gridToWorld(c.groundTile.gx,c.groundTile.gy),u=this.game.pathfinder.gridToWorld(c.seaTile.gx,c.seaTile.gy);s.disembarkPoint=new L(h.x,0,h.z),s.shipDisembarkPoint=new L(u.x,0,u.z);const d=this.game.pathfinder.findPath(s.disembarkPoint,n,"land");d&&d.length>0&&(s.segments.walkToTarget=d)}}if(this._transportData=s,this.path=s.segments.walkToShip,this.path.length>0)this.moveTarget=this.path.shift();else{this.state="idle";return}console.log(`[DEBUG PATH] ${this.type} needs transport — walking to embark (${s.embarkPoint.x.toFixed(0)}, ${s.embarkPoint.z.toFixed(0)})`)}else if(this.path=s.path,this.path.length>0)this.moveTarget=this.path.shift();else{this.state="idle";return}else this.path=[],this.moveTarget=n.clone()}else{let s=this.game.pathfinder.findPath(this.mesh.position,n,this.domain);s&&s.length>0?(this.path=s,this.moveTarget=this.path.shift()):(this.path=[],this.moveTarget=n.clone())}this.state="moving"}attack(t){console.log(`[DEBUG UNIT] ${this.type} (${this.faction}) attacking ${t.type||"base"}`),this.target=t,this.state="attacking"}takeDamage(t){if(this.stats&&!this.stats.crusher){const e=this.faction==="player"?this.game.playerUnits:this.game.enemyUnits;for(const n of e){if(!n.alive||!n.stats.crusher||n===this)continue;if(this.mesh.position.distanceTo(n.mesh.position)<=n.stats.range){const a=t*.6;t-=a,n.hp-=a*.3,n.hp<=0&&(n.hp=0),n._displayHp=n.hp,n.hp<=0&&n.die();break}}}this.hp-=t,this.hp<=0&&(this.hp=0),this._displayHp=this.hp,this._hitFlashOrig||(this.mesh.traverse(e=>{e.material?.color&&e.userData.origColor===void 0&&(e.userData.origColor=e.material.color.getHex())}),this._hitFlashOrig=!0),this._hitFlash=!0,this._hitFlashTimer=.12,this.hp<=0&&this.die()}die(){if(!this.alive)return;this.alive=!1,this.state="dead",console.log(`[DEBUG UNIT] ${this.type} (${this.faction}) DIED at (${this.mesh.position.x.toFixed(0)}, ${this.mesh.position.z.toFixed(0)})`),He.play("explosion");const t=(this.stats.bounty||0)*2;this.faction==="enemy"&&t>0&&(this.game.money+=t,this.game.flashMessage(`+${t}$ bounty`));for(const e of this.carriedUnits)e.alive&&(e.mesh.visible=!0,e.die());this.carriedUnits=[],this._createDeathLabel(),this.game.queueDeath(this)}_createDeathLabel(){const t=document.createElement("div");t.className="death-label",t.textContent="OUT OF COMMISSION",document.body.appendChild(t),this._deathLabel=t}_updateDeathLabel(){if(!this._deathLabel)return;const t=new L;t.copy(this.mesh.position),t.y+=this._labelHeight||3,t.project(this.game.camera);const e=(t.x*.5+.5)*this.game.renderer.domElement.clientWidth,n=(-t.y*.5+.5)*this.game.renderer.domElement.clientHeight;this._deathLabel.style.left=`${e}px`,this._deathLabel.style.top=`${n}px`,this._deathLabel.style.display=t.z<1?"block":"none"}update(t){if(!this.alive){this.updateDeath(t);return}if(this.cooldown-=t,this.canLaunch&&(this.launchCooldown-=t),this._pushCooldown>0&&(this._pushCooldown-=t),this.domain==="sea"&&(this.mesh.userData.bobPhase+=t*2,this.mesh.position.y=Math.sin(this.mesh.userData.bobPhase)*.15+.3),this._updateHpBar(t),this._updateHitFlash(t),this.stats.healer&&this._healNearby(t),this._auraTimer+=t,this._auraTimer>=1&&(this._auraTimer=0,this._recalcAuras()),this.type==="carrier"&&this.canLaunch&&this.launchCooldown<=0&&this._enemiesInRange(80)>0&&this.launchFighters(),this.type==="fighter"&&this.mesh.userData.launchedFrom&&this._fighterAutoReturn(t),this.type==="infantry"&&this._tryCaptureBase(t),(this.state==="idle"||this.state==="pursuing"||this.state==="moving")&&this.findTarget(),this._targetScanTimer+=t,this._targetScanTimer>=2&&(this._targetScanTimer=0,this.state!=="dead"&&this.findTarget()),(this.state==="moving"||this.state==="pursuing")&&this.canFireWhileMoving&&this.target&&this.updateAttackWhileMoving(t),this.domain!=="air"&&this.state!=="dead"){const e=this.mesh.position,n=this.game.terrain.getTerrainAt(e.x,e.z);this.domain==="land"&&n===oe.SEA?(this._amphibious=!0,this.domain="sea",this.mesh.position.y=.3,this._rangeRing&&this._rangeRing.material.color.setHex(4491519)):this._amphibious&&(n===oe.LAND||n===oe.COAST)&&(this._amphibious=!1,this.domain="land",this.mesh.position.y=.5,this._rangeRing&&this._rangeRing.material.color.setHex(this.faction==="player"?4491519:16729156))}switch(this.state){case"moving":this.updateMove(t);break;case"attacking":this.updateAttack(t);break;case"pursuing":this.updatePursue(t);break;case"waitingForTransport":this.updateWaitingForTransport(t);break}if(this.isTransport&&(this._updateTransport(t),this.target=null),(this.type==="crusher"||this.type==="escortJet")&&(this.state==="moving"||this.state==="pursuing")&&this._provokeEnemies(),this._updatePathLine(),this.state!=="dead"&&!this._amphibious){const e=this.mesh.position,n=this.game.terrain.getTerrainAt(e.x,e.z);this.domain==="sea"&&n!==oe.SEA&&n!==oe.COAST?this._pushToValidTerrain("sea"):this.domain==="land"&&n!==oe.LAND&&n!==oe.COAST&&this._pushToValidTerrain("land")}this.selected&&this._rangeRing&&this._rangeRing.position.set(this.mesh.position.x,.3,this.mesh.position.z)}_provokeEnemies(){const t=this.faction==="player"?this.game.enemyUnits:this.game.playerUnits;for(const e of t){if(!e.alive||e.state==="dead"||e.target&&e.target.alive&&e.state==="attacking"||e.domain==="land"&&!e.stats.airOnly&&this.domain==="air"||e.stats.airOnly&&this.domain!=="air"||e.stats.seaOnly&&this.domain!=="sea"||e.stats.groundOnly&&this.domain==="air")continue;this._dist2d(e.mesh.position)<=e.engageRange&&e.attack(this)}}_enemiesInRange(t){const e=this.faction==="player"?this.game.enemyUnits:this.game.playerUnits;let n=0;for(const s of e)s.alive&&this.mesh.position.distanceTo(s.mesh.position)<=t&&n++;return n}_recalcAuras(){this._dmgMult=1,this._hpMult=1;const t=this.faction==="player"?this.game.playerUnits:this.game.enemyUnits;for(const n of t){if(!n.alive||n===this)continue;const s=this.mesh.position.distanceTo(n.mesh.position),a=n.stats.buffRange||30;s>a||(n.stats.buffDamage&&(this._dmgMult*=1+n.stats.buffDamage),n.stats.buffHp&&(this._hpMult*=1+n.stats.buffHp),n.stats.buffInfantryHp&&this.type==="infantry"&&(this._hpMult*=1+n.stats.buffInfantryHp))}const e=this._baseMaxHp*this._hpMult;if(e!==this.maxHp){const n=this.hp/this.maxHp;this.maxHp=e,this.hp=Math.min(this.maxHp,n*e)}}_healNearby(t){const e=this.faction==="player"?this.game.playerUnits:this.game.enemyUnits;let n=null,s=1;for(const a of e){if(!a.alive||a===this||a.domain!=="air"&&a.domain!=="land")continue;const o=a.hp/a.maxHp;if(a.hp<a.maxHp&&this.mesh.position.distanceTo(a.mesh.position)<=this.stats.range){const l=a.maxHp*.05*t;a.hp=Math.min(a.maxHp,a.hp+l),a._displayHp=a.hp}o<s&&a.hp<a.maxHp&&(s=o,n=a)}if(this.state==="idle"){const a=e.filter(o=>o.alive&&o!==this&&o.domain==="land"&&!o.isTransport&&o.stats.speed>0&&o.state!=="waitingForTransport"&&!o.carried&&this.mesh.position.distanceTo(o.mesh.position)<60);if(a.length>0){const o=a.reduce((u,d)=>u.hp/u.maxHp<d.hp/d.maxHp?u:d),r=this.faction==="player"?this.game.enemyUnits:this.game.playerUnits;let l=null,c=1/0;for(const u of r){if(!u.alive)continue;const d=o.mesh.position.distanceTo(u.mesh.position);d<c&&(c=d,l=u)}const h=o.mesh.position.clone();if(l){const u=new L().subVectors(h,l.mesh.position).normalize();h.add(u.multiplyScalar(12))}this.mesh.position.distanceTo(h)>5&&this.moveTo(h)}else n&&this.mesh.position.distanceTo(n.mesh.position)>this.stats.range*.7&&this.moveTo(n.mesh.position.clone())}}_spawnHitConfirm(t){const e=new P(new on(2,4,16),new ie({color:16711680,side:pe,transparent:!0,opacity:.9,depthTest:!1}));e.rotation.x=-Math.PI/2,e.position.set(t.x,1,t.z),e.userData={life:.6,maxLife:.6},this.game.scene.add(e),this.game.scene.userData.hitConfirms=this.game.scene.userData.hitConfirms||[],this.game.scene.userData.hitConfirms.push(e)}_tryCaptureBase(t){const e=this.faction==="player"?this.game.bases.filter(n=>n.faction==="enemy"):this.game.bases.filter(n=>n.faction==="player");for(const n of e){if(!n.alive)continue;if(this.mesh.position.distanceTo(n.mesh.position)<=15){n.hp=Math.max(0,n.hp-t*1),n._displayHp=n.hp,n.hp<=0?(n.capture(),this.game.flashMessage(`Captured ${n.name}!`)):this.game.flashMessage(`Capturing ${n.name}... ${Math.ceil(n.hp)} HP`);return}}}_fighterAutoReturn(t){if(this.mesh.userData.launchedFrom&&(this.mesh.userData.launchTime=(this.mesh.userData.launchTime||0)+t,this.mesh.userData.launchTime>60)){const e=this.mesh.userData.launchedFrom;e&&e.alive&&(this.moveTo(e.mesh.position.clone()),this.mesh.userData.returning=!0,this.mesh.position.distanceTo(e.mesh.position)<10&&(this.hp=this.maxHp,this._displayHp=this.hp,this.mesh.userData.launchTime=0,this.mesh.userData.returning=!1,console.log("[DEBUG FIGHTER] Returned to carrier, fully repaired")))}}canLoadUnit(t){return!this.isTransport||!this.alive||t.faction!==this.faction||!t.alive||t.domain!=="land"||this.carriedUnits.length>=this.transportCapacity?!1:this.mesh.position.distanceTo(t.mesh.position)<=14}loadUnit(t){return this.canLoadUnit(t)?(this.carriedUnits.push(t),t.mesh.visible=!1,t.carried=!0,t.state="idle",console.log(`[DEBUG TRANSPORT] Loaded ${t.type} (${this.carriedUnits.length}/${this.transportCapacity})`),!0):!1}canUnload(){if(!this.isTransport||!this.alive||this.carriedUnits.length===0)return!1;const t=this.game.terrain.getTerrainAt(this.mesh.position.x,this.mesh.position.z);return t===oe.COAST||t===oe.LAND}unloadAll(){if(!this.canUnload())return;const t=this.carriedUnits.length,e=this.game.pathfinder.worldToGrid(this.mesh.position.x,this.mesh.position.z),n=this.game.pathfinder.findNearestWalkable(e.gx,e.gy,"land");let s;if(n){const a=this.game.pathfinder.gridToWorld(n.gx,n.gy);s=new L(a.x,0,a.z)}else s=this.mesh.position.clone();for(let a=this.carriedUnits.length-1;a>=0;a--){const o=this.carriedUnits[a],r=a/t*Math.PI*2,l=4+Math.floor(a/t)*4,c=s.clone().add(new L(Math.cos(r)*l,0,Math.sin(r)*l));if(o.domain!=="air"){const d=this.game.pathfinder.worldToGrid(c.x,c.z),f=this.game.pathfinder.findNearestWalkable(d.gx,d.gy,o.domain);if(f){const g=this.game.pathfinder.gridToWorld(f.gx,f.gy);c.set(g.x,0,g.z)}}o.mesh.position.copy(c),o.mesh.visible=!0,o.carried=!1,o.state="idle";const u=(o.faction==="player"?this.game.enemyUnits:this.game.playerUnits).reduce((d,f)=>{if(!f.alive)return d;const g=o.mesh.position.distanceTo(f.mesh.position);return g<(d?.dist??1/0)?{unit:f,dist:g}:d},null);u&&u.dist<o.stats.range*2&&o.attack(u.unit),this.carriedUnits.splice(a,1)}console.log(`[DEBUG TRANSPORT] Unloaded ${t} units`)}_updateTransport(t){if(this.alive){if(this.carriedUnits.length===0&&!this._disembarkPoint&&!this._assignedEmbarkPoint){const e=this.faction==="player"?this.game.playerUnits:this.game.enemyUnits;let n=1/0,s=null;for(const a of e)if(a.alive&&a.state==="waitingForTransport"&&a._transportData&&!a._claimedByShip){const o=this.mesh.position.distanceTo(a.mesh.position);o<n&&(n=o,s=a)}if(s){const a=s._transportData?.shipEmbarkPoint?.clone(),o=this.game.pathfinder.findPath(this.mesh.position,a,"sea",!1);o&&o.length>0?(this.path=o,this.moveTarget=this.path.shift(),this.state="moving"):this.moveTo(a),this._assignedEmbarkPoint=a,this._transportData=s._transportData,this._boardingTimer=0;for(const r of e)r.alive&&r.state==="waitingForTransport"&&r._transportData&&!r._claimedByShip&&(r._transportData?.shipEmbarkPoint?.distanceTo(this._assignedEmbarkPoint)??1/0)<5&&(r._claimedByShip=this);console.log(`[DEBUG TRANSPORT] Ship moving to pick up troops at (${this._assignedEmbarkPoint.x.toFixed(0)}, ${this._assignedEmbarkPoint.z.toFixed(0)})`)}else this.state==="idle"&&this._retreatToFriendlyBase();return}if(this._assignedEmbarkPoint&&this.path.length===0){this._boardingTimer+=t;const e=this.carriedUnits.length>=this.transportCapacity,n=this._boardingTimer>15;if((e||n)&&this.carriedUnits.length>0){console.log(`[DEBUG TRANSPORT] Setting sail! Troops aboard: ${this.carriedUnits.length}`);const s=this._transportData?.segments?.sail;s&&s.length>0?(this.path=s.map(o=>o.clone()),this.moveTarget=this.path.shift(),this.state="moving"):this._transportData?.shipDisembarkPoint&&this.moveTo(this._transportData.shipDisembarkPoint.clone()),this._disembarkPoint=this._transportData?.disembarkPoint?.clone(),this._assignedEmbarkPoint=null;const a=this.faction==="player"?this.game.playerUnits:this.game.enemyUnits;for(const o of a)o._claimedByShip===this&&(o._claimedByShip=null)}else if(n&&this.carriedUnits.length===0){const s=this.faction==="player"?this.game.playerUnits:this.game.enemyUnits;for(const a of s)a._claimedByShip===this&&(a._claimedByShip=null);this._assignedEmbarkPoint=null,this._transportData=null,this._retreatToFriendlyBase()}return}if(this._disembarkPoint&&this.carriedUnits.length>0&&this.path.length===0){const e=[...this.carriedUnits];this.unloadAll();for(const n of e)n.alive&&n._transportData&&n._transportData.segments&&(n.path=n._transportData.segments.walkToTarget,n.path.length>0&&(n.moveTarget=n.path.shift(),n.state="moving"),n._transportData=null);this._disembarkPoint=null,this._transportData=null,this._retreatToFriendlyBase();return}for(const e of this.carriedUnits)e.mesh.position.copy(this.mesh.position),e.mesh.position.y+=.5}}_findNearestCoast(t,e){const n=this.game.pathfinder.findNearestCoast(t,e,"land");if(n&&n.groundTile){const s=this.game.pathfinder.gridToWorld(n.groundTile.gx,n.groundTile.gy);return new L(s.x,0,s.z)}return null}_updatePathLine(){if(!this.isTransport){this._removePathLine();return}if(!(this.path.length>0||this.moveTarget)||this.state==="dead"||this.state==="idle"){this._removePathLine();return}const e=this.faction==="player"?4521864:16729156,n=[];n.push(new L(this.mesh.position.x,.5,this.mesh.position.z)),this.moveTarget&&n.push(new L(this.moveTarget.x,.5,this.moveTarget.z));for(const d of this.path)n.push(new L(d.x,.5,d.z));if(n.length<2){this._removePathLine();return}this._removePathLine();const s=new Ae().setFromPoints(n),a=new as({color:e,transparent:!0,opacity:.6,depthTest:!1});this._pathLine=new Tr(s,a),this._pathLine.renderOrder=890,this.game.scene.add(this._pathLine);const o=n[n.length-1],r=n[n.length-2],l=Math.atan2(o.x-r.x,o.z-r.z),c=new ic;c.moveTo(0,0),c.lineTo(-1.5,-3),c.lineTo(1.5,-3),c.closePath();const h=new Ar(c),u=new ie({color:e,transparent:!0,opacity:.7,side:pe,depthTest:!1});this._pathArrowHead=new P(h,u),this._pathArrowHead.position.set(o.x,.5,o.z),this._pathArrowHead.rotation.x=-Math.PI/2,this._pathArrowHead.rotation.z=-l,this._pathArrowHead.renderOrder=891,this.game.scene.add(this._pathArrowHead)}_removePathLine(){this._pathLine&&(this.game.scene.remove(this._pathLine),this._pathLine.geometry.dispose(),this._pathLine.material.dispose(),this._pathLine=null),this._pathArrowHead&&(this.game.scene.remove(this._pathArrowHead),this._pathArrowHead.geometry.dispose(),this._pathArrowHead.material.dispose(),this._pathArrowHead=null)}_retreatToFriendlyBase(){const t=this.game.bases.filter(a=>a.faction===this.faction);if(!t.length)return;const e=t.reduce((a,o)=>this.mesh.position.distanceTo(a.mesh.position)<this.mesh.position.distanceTo(o.mesh.position)?a:o),n=this.game.pathfinder.worldToGrid(e.mesh.position.x,e.mesh.position.z),s=this.game.pathfinder.findNearestWalkable(n.gx,n.gy,"sea");if(s){const a=this.game.pathfinder.gridToWorld(s.gx,s.gy);this.moveTo(new L(a.x,0,a.z))}}_pushToValidTerrain(t){if(this._pushCooldown>0)return;this._pushCooldown=.05;const e=Math.floor((this.mesh.position.x+cr/2)/12),n=Math.floor((this.mesh.position.z+cr/2)/12),s=this.game.pathfinder.findNearestWalkable(e,n,t);if(s){const a=this.game.pathfinder.gridToWorld(s.gx,s.gy);this.mesh.position.set(a.x,0,a.z);const o=Math.random()*Math.PI*2;this.mesh.rotation.y=o,this.attackMoveDest&&this.state!=="idle"&&this.moveTo(this.attackMoveDest,this.attackMove)}}_buildRangeRing(){if(this._rangeRing)return;const t=[],e=48;for(let a=0;a<=e;a++){const o=a/e*Math.PI*2;t.push(new L(Math.cos(o)*this.stats.range,0,Math.sin(o)*this.stats.range))}const n=new Ae().setFromPoints(t),s=new as({color:this.faction==="player"?4491519:16729156,transparent:!0,opacity:.4,depthTest:!1});this._rangeRing=new Wm(n,s),this._rangeRing.position.y=.3,this._rangeRing.renderOrder=895,this._rangeRing.visible=!1}_updateHpBar(t){if(!this._hpBar)return;this._trailHp+=(this._displayHp-this._trailHp)*Math.min(1,t*2);const e=this._displayHp/this.maxHp,n=this._trailHp/this.maxHp;this._hpBar.fg.scale.x=e,this._hpBar.fg.position.x=-(this._hpBar.barWidth/2)*(1-e),this._hpBar.trail.scale.x=n,this._hpBar.trail.position.x=-(this._hpBar.barWidth/2)*(1-n);const s=this._displayHp<this.maxHp||this.selected;this._hpBar.fg.parent.visible=s}_updateHitFlash(t){if(!this._hitFlash)return;this._hitFlashTimer-=t;const e=this._hitFlashTimer>0;this.mesh.traverse(n=>{n.material?.color&&n.userData.origColor!==void 0&&n.material.color.setHex(e?16777215:n.userData.origColor)}),e||(this._hitFlash=!1)}updateMove(t){if(!this.moveTarget)if(this.path.length>0)this.moveTarget=this.path.shift();else{this.state="idle";return}const e=this.mesh.position;if(this.domain!=="air"){const l=this.game.terrain.getTerrainAt(e.x,e.z);if(!this.canEnter(l)){this._pushToValidTerrain(this.domain);return}}if(this.domain!=="air"){const l=this.game.terrain.getTerrainAt(this.moveTarget.x,this.moveTarget.z);if(!this.canEnter(l)){const c=this.game.pathfinder.worldToGrid(this.moveTarget.x,this.moveTarget.z),h=this.game.pathfinder.findNearestWalkable(c.gx,c.gy,this.domain);if(h){const u=this.game.pathfinder.gridToWorld(h.gx,h.gy);this.moveTarget.set(u.x,0,u.z)}else this.moveTarget=this.path.shift()||null,this.moveTarget||(this.state="idle");return}}const n=this.moveTarget.x-e.x,s=this.moveTarget.z-e.z,a=Math.hypot(n,s);if(a<2){if(this.moveTarget=this.path.length>0?this.path.shift():null,!this.moveTarget){if(this._transportData&&this._transportData.needsTransport&&this._transportData.segments){this.state="waitingForTransport",this._transportData._phase="waiting",console.log(`[DEBUG TRANSPORT] ${this.type} reached embark point, waiting for transport`);return}this.state="idle"}return}const o=this.stats.speed*t;e.x+=n/a*o,e.z+=s/a*o;const r=Math.atan2(n,s);if(this.smoothRotate(r,t),this.domain==="air"){const l=(r-this.mesh.rotation.y+Math.PI*3)%(Math.PI*2)-Math.PI;this.mesh.rotation.z=We.clamp(-l,-.5,.5),this.mesh.position.y=this.stats.altitude}}smoothRotate(t,e){let n=this.mesh.rotation.y,s=(t-n+Math.PI*3)%(Math.PI*2)-Math.PI;const a=this.domain==="air"?e*10:e*6;n+=s*Math.min(1,a),this.mesh.rotation.y=n}canEnter(t){return this.domain==="air"?!0:this.domain==="sea"?t===oe.SEA||t===oe.COAST:this.domain==="land"?t===oe.LAND||t===oe.COAST:!0}findTarget(){if(this.stats.escortBomber||this.target&&this.target.alive&&this.state==="attacking")return;const t=this.faction==="player"?this.game.enemyUnits:this.game.playerUnits,e=!!this.stats.airOnly,n=!!this.stats.baseOnly,s=!!this.stats.baseTarget,a=this.domain==="land";if(n){const c=this.game.bases.filter(d=>d.alive&&d.faction!==this.faction);let h=null,u=this.engageRange;for(const d of c){const f=this._dist2d(d.mesh.position);f<u&&(h=d,u=f)}h&&(u<=this.stats.range?(this.target=h,this.state="attacking"):this.stats.speed>0&&(this._pursueTarget=h,this.state="pursuing"));return}if(s){const c=this.game.bases.filter(d=>d.alive&&d.faction!==this.faction);let h=null,u=this.engageRange;for(const d of c){const f=this._dist2d(d.mesh.position);f<u&&(h=d,u=f)}h&&(u<=this.stats.range?(this.target=h,this.state="attacking"):(this._pursueTarget=h,this.state="pursuing"));return}let o=null,r=this.engageRange,l=99;for(const c of t){if(!c.alive||e&&c.domain!=="air"||this.stats.seaOnly&&c.domain!=="sea"||this.stats.groundOnly&&c.domain==="air"||a&&!e&&c.domain==="air")continue;const h=this._dist2d(c.mesh.position);let u=1;if(a&&!e)if(c.domain==="sea"){if(h>this.stats.range*.3)continue;u=3}else u=1;(u<l||u===l&&h<r)&&(o=c,r=h,l=u)}if(this.stats.range>0){const c=this.game.bases.filter(h=>h.alive&&h.faction!==this.faction);for(const h of c){const u=this._dist2d(h.mesh.position);u<r&&(u<=this.stats.range||!o||l>2)&&(o=h,r=u,l=2)}}if(o){const c=r;c<=this.stats.range?(this.state==="moving"&&this.moveTarget&&(this._resumePath=this.path.slice(),this._resumeTarget=this.moveTarget.clone(),this._resumeAttackMove=this.attackMove,this._resumeAttackMoveDest=this.attackMoveDest?this.attackMoveDest.clone():null),this.target=o,this.state="attacking"):c<=this.engageRange&&this.stats.speed>0&&(this._pursueTarget=o,this.state="pursuing")}}_dist2d(t){return Math.hypot(this.mesh.position.x-t.x,this.mesh.position.z-t.z)}updateAttack(t){if(!this.target||!this.target.alive){this.target=null,this._resumePath||this._resumeTarget?(this.path=this._resumePath||[],this.moveTarget=this._resumeTarget||null,this.attackMove=this._resumeAttackMove||!1,this.attackMoveDest=this._resumeAttackMoveDest||null,this._resumePath=null,this._resumeTarget=null,this._resumeAttackMove=null,this._resumeAttackMoveDest=null,this.moveTarget?this.state="moving":this.attackMove&&this.attackMoveDest?this.moveTo(this.attackMoveDest,!0):this.state="idle"):this.attackMove&&this.attackMoveDest?this.moveTo(this.attackMoveDest,!0):this.state="idle";return}if(this.target.faction&&this.target.faction===this.faction){this.target=null,this._resumePath||this._resumeTarget?(this.path=this._resumePath||[],this.moveTarget=this._resumeTarget||null,this.attackMove=this._resumeAttackMove||!1,this.attackMoveDest=this._resumeAttackMoveDest||null,this._resumePath=null,this._resumeTarget=null,this._resumeAttackMove=null,this._resumeAttackMoveDest=null,this.moveTarget?this.state="moving":this.attackMove&&this.attackMoveDest?this.moveTo(this.attackMoveDest,!0):this.state="idle"):this.attackMove&&this.attackMoveDest?this.moveTo(this.attackMoveDest,!0):this.state="idle";return}const e=this.target.mesh?this.target.mesh.position:this.target.position;if(this._dist2d(e)>this.stats.range){if(this.domain==="sea"&&this.target.domain==="land"){const r=this._findCoastInRange(e);if(r)this.moveTo(r,this.attackMove);else{const l=this._snapToNearestSea(e);l&&this.moveTo(l,this.attackMove)}}else this.moveTo(e,this.attackMove);return}const s=e.x-this.mesh.position.x,a=e.z-this.mesh.position.z,o=Math.atan2(s,a);this.mesh.userData.turret?this.mesh.userData.turret.rotation.y=o-this.mesh.rotation.y:this.smoothRotate(o,t),this.cooldown<=0&&this.fire()}_findCoastInRange(t){const e=this.game.pathfinder.worldToGrid(t.x,t.z),n=Math.ceil(this.stats.range/this.game.pathfinder.cell)+1;let s=null,a=1/0;for(let o=-n;o<=n;o++)for(let r=-n;r<=n;r++){const l=e.gx+r,c=e.gy+o;if(!this.game.pathfinder.walkable(l,c,"sea"))continue;const h=this.game.pathfinder.gridToWorld(l,c),u=Math.hypot(h.x-t.x,h.z-t.z);if(u<=this.stats.range&&u<a){const d=Math.hypot(h.x-this.mesh.position.x,h.z-this.mesh.position.z);d<a&&(a=d,s=new L(h.x,0,h.z))}}return s}_snapToNearestSea(t){const e=this.game.pathfinder.worldToGrid(t.x,t.z),n=this.game.pathfinder.findNearestWalkable(e.gx,e.gy,"sea");if(!n)return null;const s=this.game.pathfinder.gridToWorld(n.gx,n.gy);return new L(s.x,0,s.z)}updateAttackWhileMoving(t){if(!this.target){this.target=null;return}if(!(this.target.alive!=null?this.target.alive:!0)){this.target=null;return}if(this.target.faction&&this.target.faction===this.faction){this.target=null;return}const n=this.target.mesh?this.target.mesh.position:this.target.position;if(this._dist2d(n)>this.stats.range){if(this.domain==="sea"&&this.target.domain==="land"){const l=this._findCoastInRange(n);l&&this.moveTo(l,this.attackMove)}return}const a=n.x-this.mesh.position.x,o=n.z-this.mesh.position.z,r=Math.atan2(a,o);this.mesh.userData.turret?this.mesh.userData.turret.rotation.y=r-this.mesh.rotation.y:this.smoothRotate(r,t),this.cooldown<=0&&this.fire()}updatePursue(t){if(!this._pursueTarget||!this._pursueTarget.alive){this._pursueTarget=null,this.target=null,this.attackMove&&this.attackMoveDest?this.moveTo(this.attackMoveDest,!0):this.state="idle";return}if(this._pursueTarget.faction&&this._pursueTarget.faction===this.faction){this._pursueTarget=null,this.target=null,this.state="idle";return}const e=this._pursueTarget.mesh?this._pursueTarget.mesh.position:this._pursueTarget.position,n=this._dist2d(e);if(this.stats.oneWay&&this.stats.range===0&&n<20){this.hp=0,this.die();return}if(n<=this.stats.range){this.target=this._pursueTarget,this.state="attacking",this._pursueTarget=null;return}if(this.canFireWhileMoving&&n<=this.stats.range*1.2){this.target=this._pursueTarget;const l=e.x-this.mesh.position.x,c=e.z-this.mesh.position.z,h=Math.atan2(l,c);this.mesh.userData.turret&&(this.mesh.userData.turret.rotation.y=h-this.mesh.rotation.y),this.cooldown<=0&&this.fire()}const s=e.x-this.mesh.position.x,a=e.z-this.mesh.position.z,o=this.stats.speed*t;n>o&&(this.mesh.position.x+=s/n*o,this.mesh.position.z+=a/n*o);const r=Math.atan2(s,a);if(this.smoothRotate(r,t),this.domain==="air"){const l=(r-this.mesh.rotation.y+Math.PI*3)%(Math.PI*2)-Math.PI;this.mesh.rotation.z=We.clamp(-l,-.5,.5),this.mesh.position.y=this.stats.altitude}this.domain==="sea"&&(this.mesh.userData.bobPhase+=t*2,this.mesh.position.y=Math.sin(this.mesh.userData.bobPhase)*.15+.3)}updateWaitingForTransport(t){if(!this._transportData||!this._transportData.needsTransport){this.state="idle";return}let e=this._claimedByShip;if(!e||!e.alive||e.carriedUnits.length>=e.transportCapacity){const n=this.faction==="player"?this.game.playerUnits:this.game.enemyUnits;for(const s of n)if(!(!s.alive||!s.isTransport)&&s.faction===this.faction&&!(s.carriedUnits.length>=s.transportCapacity)){if(s._assignedEmbarkPoint&&this._transportData&&s._assignedEmbarkPoint.distanceTo(this._transportData.shipEmbarkPoint)<5){e=s;break}e||(e=s)}}if(e)if(this.mesh.position.distanceTo(e.mesh.position)<=14){e.loadUnit(this),e._transportData||(e._transportData=this._transportData),this._claimedByShip=null,console.log(`[DEBUG TRANSPORT] ${this.type} boarded transport (${e.carriedUnits.length}/${e.transportCapacity})`);return}else{e._assignedEmbarkPoint?this.moveTo(e._assignedEmbarkPoint.clone()):this._transportData&&this._transportData.shipEmbarkPoint&&this.moveTo(this._transportData.shipEmbarkPoint.clone());return}this.domain==="sea"&&(this.mesh.userData.bobPhase=(this.mesh.userData.bobPhase||0)+t*2,this.mesh.position.y=Math.sin(this.mesh.userData.bobPhase)*.15+.3)}fire(){this.cooldown=this.stats.fireRate;const t=this.game.terrain.getTerrainAt(this.mesh.position.x,this.mesh.position.z),{dmg:e}=xg(this.domain,t,this.stats.damage,this.maxHp),n=this.target.mesh?this.target.mesh.position:this.target.position;let s=e;s*=this._dmgMult,this._stealthed&&(this._stealthed=!1,s*=5,this.mesh.traverse(c=>{c.material&&c.material.opacity<1&&(c.material.opacity=c.userData.origOpacity||1)}),this.target.mesh&&this._spawnHitConfirm(this.target.mesh.position),console.log(`[DEBUG SUB] Stealth break! First strike: ${s.toFixed(0)} damage`));let a;this.mesh.userData.muzzleOffset?(a=this.mesh.userData.muzzleOffset.clone(),a.applyQuaternion(this.mesh.quaternion),a.add(this.mesh.position)):(a=this.mesh.position.clone(),a.y+=this.domain==="air"?-.5:2),this.game.spawnMuzzleFlash(a),He.play("fire");const o=this.stats.splashRadius||0,r=this.stats.splashFalloff||1;if(this.type==="destroyer"&&(this._destroyerShotCount++,this._destroyerShotCount%3===0&&this._fireFlak(a)),this.type==="battleship"){const c=new L().subVectors(n,this.mesh.position).normalize(),u=new L(0,0,1).applyQuaternion(this.mesh.quaternion).dot(c);this._battleshipBroadside=Math.abs(u)<.3}if(this.type==="fighter"&&this.target.type){const c=An[this.target.type]?.domain;c==="air"?s*=1.5:(c==="land"||c==="sea")&&(s*=.5)}this.domain==="sea"&&this.target.domain==="air"&&(s*=.5);let l=null;if(this.type==="bomber"){const c=new L().subVectors(n,this.mesh.position).normalize();l=new L(-c.z,0,c.x),this._bomberCarpetDir=l}if(this.type==="artillery"&&(this._artilleryBarrageIndex=0),this.domain==="sea"||this.domain==="air"){if(vg(this.game.scene,a,this.target,s,this.stats.hitChance,o,r),this.stats.baseOnly&&console.log(`[DEBUG B2] Hitscan fired: ${s} dmg → ${this.target.name||"base"} HP: ${this.target.hp?.toFixed(0)}`),this.stats.oneWay){this.hp=0,this.die();return}}else{const c="land",h=this.stats.projectile||"default",u=ml[h]||ml.default,d=u.burst,f=fc(this.game.scene,a,this.target,s,this.stats.hitChance,c,h,o,r,this.mesh.rotation.y,n,d,l,u.burstDelay||0);for(const g of f)this.game.projectiles.push(g);if(this.type==="crusher"){const g=n,_=this.faction==="player"?this.game.enemyUnits:this.game.playerUnits;for(const m of _){if(!m.alive||m===this)continue;const p=m.mesh.position.distanceTo(g);if(p>100)continue;const y=new L().subVectors(m.mesh.position,g).normalize(),v=(1-p/100)*20;m.mesh.position.x+=y.x*v,m.mesh.position.z+=y.z*v}}}}_fireFlak(t){const n=[...this.game.playerUnits,...this.game.enemyUnits];for(const s of n){if(!s.alive||s.domain!=="air")continue;if(s.mesh.position.distanceTo(this.mesh.position)<=25){const o=this.stats.damage*.6;s.takeDamage(o),console.log(`[DEBUG DESTROYER] FLAK hit ${s.type} for ${o.toFixed(1)}`),this._spawnFlakPuff(s.mesh.position)}}}_spawnFlakPuff(t){const e=new P(new _e(1.5,8,8),new ie({color:8947848,transparent:!0,opacity:.6}));e.position.copy(t),e.userData.life=.5,this.game.scene.add(e),this.game.scene.userData.flakPuffs=this.game.scene.userData.flakPuffs||[],this.game.scene.userData.flakPuffs.push(e)}launchFighters(){if(!this.canLaunch||this.launchCooldown>0)return console.warn(`[DEBUG UNIT] Carrier launch FAILED — canLaunch: ${this.canLaunch}, cooldown: ${this.launchCooldown.toFixed(1)}`),!1;this.launchCooldown=D0,He.play("launch"),console.log(`[DEBUG UNIT] Carrier LAUNCHING ${$a} fighters`);for(let t=0;t<$a;t++){const e=t/$a*Math.PI*2,n={x:this.mesh.position.x+Math.cos(e)*10,z:this.mesh.position.z+Math.sin(e)*10},s=this.game.spawn("fighter",this.faction,n);s.mesh.position.y=An.fighter.altitude,s.mesh.userData.launchedFrom=this}return!0}updateDeath(t){this.deathTime=(this.deathTime||0)+t,this._updateDeathLabel(),this.domain==="air"?(this.mesh.rotation.x+=t*2,this.mesh.position.y-=30*t,this.mesh.position.y<0&&this.cleanup()):this.domain==="sea"?(this.mesh.rotation.z+=t*.5,this.mesh.position.y-=2*t,this.mesh.position.y<-5&&this.cleanup()):this.deathTime>.4&&this.cleanup()}cleanup(){this._cleaned||(this._cleaned=!0,this.game.scene.remove(this.mesh),this._removePathLine(),this._deathLabel&&(this._deathLabel.remove(),this._deathLabel=null))}}class Kn{constructor(t,e,n,s=1,a="Base"){this.game=t,this.faction=e,this.name=a,this.size=s;const l=e==="enemy"?{x:-500,z:200}:{x:450,z:-100},c=Math.hypot(n.x-l.x,n.z-l.z);let h=1;a!=="Player HQ"&&a!=="Main Base"&&(c<150?h=4:c<300?h=3:c<500?h=2:h=1.5);const d=(hr[t.difficulty]||hr.easy).baseHpMultiplier||1;this.hp=500*s*h*d,this.maxHp=this.hp,this.alive=!0,this.domain="land",this.territory=150*s,a==="Main Base"&&(this.territory=200*s),this.turretRange=60*s,this.turretDamage=20*s*h,this.turretCooldown=0;const f=t.terrain.getTerrainAt(n.x,n.z),g=f===oe.SEA||f===oe.COAST;this.mesh=g?og(s,e==="player"):rg(s,e==="player"),this.mesh.position.set(n.x,Re,n.z),t.scene.add(this.mesh),this.territoryRing=null,this._createHpBar()}_createHpBar(){const t=8*this.size,e=.6,n=6+this.size*2,s=new P(new dn(t,e),new ie({color:1118481,transparent:!0,opacity:.9,depthTest:!1}));s.rotation.x=-Math.PI/2,s.position.y=n,s.renderOrder=900;const a=new P(new dn(t,e),new ie({color:this.faction==="player"?4521864:16729156,depthTest:!1}));a.rotation.x=-Math.PI/2,a.position.y=n+.02,a.renderOrder=901,this.mesh.add(s,a),this._hpBar={bg:s,fg:a,barWidth:t,maxHp:this.maxHp},this._displayHp=this.hp,this._trailHp=this.hp}update(t){if(!this.alive)return;if(this._hpBar){this._trailHp+=(this._displayHp-this._trailHp)*Math.min(1,t*2);const a=this._displayHp/this._hpBar.maxHp;this._trailHp/this._hpBar.maxHp,this._hpBar.fg.scale.x=a,this._hpBar.fg.position.x=-(this._hpBar.barWidth/2)*(1-a),this._hpBar.fg.material.color.setHex(this.faction==="player"?4521864:16729156)}if(this.turretCooldown-=t,this.turretCooldown>0)return;const e=this.faction==="player"?this.game.enemyUnits:this.game.playerUnits;let n=null,s=this.turretRange;for(const a of e){if(!a.alive)continue;const o=this.mesh.position.distanceTo(a.mesh.position);o<s&&(n=a,s=o)}if(n){this.turretCooldown=1.5;const a=this.faction==="sea"?"sea":this.faction==="air"?"air":"land",o=n.mesh.position,r=fc(this.game.scene,this.mesh.position.clone().add(new L(0,10,0)),n,this.turretDamage,.85,a,"default",0,1,0,o);this.game.projectiles.push(...r)}}takeDamage(t){this.hp-=t,this._displayHp=this.hp,this.hp<=0?this.capture():this.game.onBaseUnderAttack&&this.game.onBaseUnderAttack(this)}capture(){if(!this.alive)return;const t=this.faction==="player"?this.game.enemyUnits:this.game.playerUnits,e=t.length?t[0].faction:this.faction==="player"?"enemy":"player";this.faction=e,this.hp=this.maxHp,this._displayHp=this.hp,this._trailHp=this.hp;const n=e==="player"?2254506:11154227;this.mesh.children.forEach(s=>{s.userData?.isFlag&&s.material.color.setHex(n),s.geometry?.type==="BoxGeometry"&&s.position.y>4&&s.material.color.setHex(n)}),this.territoryRing&&this.territoryRing.material.color.setHex(n),e==="player"&&(this.game.money+=400),this.game.checkWinCondition()}cleanup(){this.alive&&(this.alive=!1,this.game.scene.remove(this.mesh),this.territoryRing&&(this.game.scene.remove(this.territoryRing),this.territoryRing=null))}}class Ag{constructor(t,e,n,s){this.scene=t,this.camera=e,this.cameraTarget=s,this.difficulty=n,this.diffConfig=hr[n],this.money=P0,this.playerUnits=[],this.enemyUnits=[],this.bases=[],this.projectiles=[],this.deadUnits=[],this.selectedUnits=[],this.formation="line",this.attackMoveMode=!1,this.aiTimer=0,this.ended=!1,this.fogUpdateTimer=0,this.paused=!1,this.selectedBuilding=null,this.placementMode={active:!1,type:null,ghost:null,ring:null,isValid:!1,previewPos:null}}init(){this.scene.userData.game=this,this.terrain=I0(this.scene),this.pathfinder=new yg(this.terrain),this.upgrades=new wg(this),this.fog=new Sg(this.scene),this.minimap=new Tg(this,this.camera),He.init(),this.createBases(),this.spawnStartingArmy(),document.getElementById("difficulty").textContent=`Difficulty: ${this.difficulty.toUpperCase()}`,document.getElementById("basesTotal").textContent=this.bases.length}createBases(){this.bases.push(new Kn(this,"player",{x:-500,z:200},1.8,"Player HQ")),this.bases.push(new Kn(this,"enemy",{x:-300,z:-200},1,"Outpost Alpha")),this.bases.push(new Kn(this,"enemy",{x:-250,z:350},1,"Outpost Bravo")),this.bases.push(new Kn(this,"enemy",{x:50,z:-400},1.2,"Northern Fort")),this.bases.push(new Kn(this,"enemy",{x:250,z:100},1.3,"Coastal Garrison")),this.bases.push(new Kn(this,"enemy",{x:200,z:380},1,"Island Watch")),this.bases.push(new Kn(this,"enemy",{x:450,z:-100},2.2,"Main Base"));for(const t of this.bases){const e=t.faction==="player"?2254506:11154227,n=new aa(t.territory,48),s=new ie({color:e,transparent:!0,opacity:.08,side:pe,depthWrite:!1});t.territoryRing=new P(n,s),t.territoryRing.rotation.x=-Math.PI/2,t.territoryRing.position.set(t.mesh.position.x,.15,t.mesh.position.z),this.scene.add(t.territoryRing)}}spawnStartingArmy(){const t=this.bases[0].mesh.position;this.spawn("tank","player",{x:t.x+20,z:t.z+10}),this.spawn("tank","player",{x:t.x+30,z:t.z+10}),this.spawn("infantry","player",{x:t.x+20,z:t.z+25}),this.spawn("infantry","player",{x:t.x+30,z:t.z+25});for(const e of this.bases){if(e.faction!=="enemy")continue;const n=e.mesh.position;this.spawn("infantry","enemy",{x:n.x+10,z:n.z+10}),this.spawn("tank","enemy",{x:n.x-10,z:n.z+10})}}spawn(t,e,n){const s=new Eg(this,t,e,n);return(e==="player"?this.playerUnits:this.enemyUnits).push(s),s}purchaseUnit(t){const e=An[t],n=e.cost;if(console.log("[BUY]",t,"cost:",n,"money:",Math.floor(this.money)),this.money<n)return this.flashMessage(`Not enough $ for ${t} ($${n})`),!1;const s=this.bases.find(r=>r.faction==="player");if(!s)return console.error("[BUY] No player HQ!"),!1;const a=this.findValidSpawn(s.mesh.position,e.domain);if(!a)return console.error("[BUY] No valid spawn for",t),this.flashMessage(`No valid spawn location for ${t}!`),!1;console.log("[BUY] Spawning at",a.x.toFixed(1),a.y.toFixed(1),a.z.toFixed(1)),this.money-=n;const o=this.spawn(t,"player",a);return console.log("[BUY] Spawned! playerUnits:",this.playerUnits.length),this.spawnMuzzleFlash(o.mesh.position.clone().add(new L(0,3,0))),this.spawnSpawnMarker(a),He.play("build"),this.flashMessage(`Built ${t.toUpperCase()} ($${n})`),this.pingMinimap(a.x,a.z),this.fog&&this.fog.update(this.playerUnits,this.bases.filter(r=>r.faction==="player")),o.setSelected(!0),this.selectedUnits.includes(o)||this.selectedUnits.push(o),this.cameraTarget.x=o.mesh.position.x,this.cameraTarget.z=o.mesh.position.z,!0}spawnSpawnMarker(t){const e=new P(new on(4,6,32),new ie({color:4521864,side:pe,transparent:!0,opacity:.8}));e.rotation.x=-Math.PI/2,e.position.set(t.x,.5,t.z),e.userData.life=2,this.scene.add(e),this.scene.userData.spawnMarkers=this.scene.userData.spawnMarkers||[],this.scene.userData.spawnMarkers.push(e)}pingMinimap(t,e){if(!this.minimap)return;this.minimap.ctx;const{x:n,y:s}=this.minimap.worldToMini(t,e),a={x:n,y:s,radius:4,life:1.5,maxLife:1.5};this.minimap.pings=this.minimap.pings||[],this.minimap.pings.push(a)}findValidSpawn(t,e){if(e==="air"){const s=Math.random()*Math.PI*2;return new L(t.x+Math.cos(s)*25,An.fighter.altitude,t.z+Math.sin(s)*25)}const n=e==="sea"?[oe.SEA,oe.COAST]:[oe.LAND,oe.COAST];for(let s=15;s<=200;s+=8)for(let a=0;a<16;a++){const o=a/16*Math.PI*2+Math.random()*.2,r=t.x+Math.cos(o)*s,l=t.z+Math.sin(o)*s,c=this.terrain.getTerrainAt(r,l);if(n.includes(c)){let h=!1;for(const u of this.terrain.mountains)if(Math.hypot(r-u.x,l-u.z)<u.r+3){h=!0;break}if(!h){const u=e==="sea"?.3:Re+.5;return new L(r,u,l)}}}return null}enterPlacementMode(t,e){console.log(`[DEBUG] enterPlacementMode called: ${t}${e?" (GROUP×5)":""}`);const n=An[t],s=n.cost,a=e?s*5:s;if(this.money<a)return this.flashMessage(`Not enough $ for ${e?"5× ":""}${t} ($${a})`),!1;this.exitPlacementMode(!0);const o=hc(t,n.color,"player");o.traverse(c=>{c.material&&(c.material=c.material.clone(),c.material.transparent=!0,c.material.opacity=.5)}),this.scene.add(o);const r=new P(new on(4,4.5,24),new ie({color:4521864,side:pe,transparent:!0,opacity:.7}));r.rotation.x=-Math.PI/2,r.position.y=.2,o.add(r);const l=[];if(e){const c=new ie({color:4521864,side:pe,transparent:!0,opacity:.4});for(let h=0;h<5;h++){const u=h/5*Math.PI*2,d=Math.cos(u)*10,f=Math.sin(u)*10,g=new P(new on(3,3.5,16),c);g.rotation.x=-Math.PI/2,g.position.set(d,.2,f),o.add(g),l.push(g)}}return this.placementMode={active:!0,type:t,ghost:o,ring:r,groupMarkers:l,groupPlace:!!e,isValid:!1,previewPos:null,cost:a,unitCost:s},this._showPlacementIndicator(t),this._setBuyButtonsDisabled(!0),this.flashMessage(e?`Ctrl+Click to place 5× ${t.toUpperCase()} ($${a})`:`Click to place ${t.toUpperCase()}`),!0}exitPlacementMode(t){this.placementMode.active&&(console.log(`[DEBUG] exitPlacementMode — canceled: ${t}`),this.placementMode.ghost&&(this.scene.remove(this.placementMode.ghost),this.placementMode.ghost=null),this.placementMode={active:!1,type:null,ghost:null,ring:null,isValid:!1,previewPos:null},this._hidePlacementIndicator(),this._setBuyButtonsDisabled(!1))}updatePlacementPreview(t){if(!this.placementMode.active||!this.placementMode.ghost)return;const e=An[this.placementMode.type],n=e.domain,s=n==="air"?e.altitude:n==="sea"?.3:Re+.5;this.placementMode.ghost.position.set(t.x,s,t.z),this.placementMode.previewPos=t;const a=this.placementMode;let o=this.isValidPlacement(t.x,t.z,n);if(a.groupPlace&&o)for(let r=0;r<5;r++){const l=r/5*Math.PI*2,c=t.x+Math.cos(l)*10,h=t.z+Math.sin(l)*10;this.isValidPlacement(c,h,n)?a.groupMarkers?.[r]&&a.groupMarkers[r].material.color.setHex(4521864):(o=!1,a.groupMarkers?.[r]&&a.groupMarkers[r].material.color.setHex(16729156))}a.isValid=o,a.ring.material.color.setHex(o?4521864:16729156)}confirmPlacement(t){if(!this.placementMode.active||!t)return!1;const{type:e,groupPlace:n,unitCost:s}=this.placementMode,a=An[e],o=a.domain,r=o==="air"?a.altitude:o==="sea"?.3:Re+.5;if(n){const l=[];for(let c=0;c<5;c++){const h=c/5*Math.PI*2,u=t.x+Math.cos(h)*10,d=t.z+Math.sin(h)*10;if(!this.isValidPlacement(u,d,o))return this.flashMessage("Not enough space for group placement"),!1;l.push({x:u,z:d})}this.money-=s*5;for(const c of l){const h=this.spawn(e,"player",c);h.mesh.position.y=r,this.spawnMuzzleFlash(h.mesh.position.clone().add(new L(0,3,0))),this.spawnSpawnMarker(h.mesh.position.clone())}He.play("build"),this.flashMessage(`Built 5× ${e.toUpperCase()} ($${s*5})`),this.pingMinimap(t.x,t.z)}else{if(!this.isValidPlacement(t.x,t.z,o))return this.flashMessage("Cannot place here — invalid location"),!1;this.money-=s;const l=this.spawn(e,"player",{x:t.x,z:t.z});l.mesh.position.y=r,this.spawnMuzzleFlash(l.mesh.position.clone().add(new L(0,3,0))),this.spawnSpawnMarker(l.mesh.position.clone()),He.play("build"),this.flashMessage(`Built ${e.toUpperCase()} ($${s})`),this.pingMinimap(t.x,t.z)}return this.fog&&this.fog.update(this.playerUnits,this.bases.filter(l=>l.faction==="player")),this.exitPlacementMode(!1),!0}getTerritoryAt(t,e){let n=null,s=1/0;for(const a of this.bases){if(!a.alive)continue;const o=Math.hypot(t-a.mesh.position.x,e-a.mesh.position.z);o<a.territory&&o<s&&(n=a,s=o)}return n?{base:n,faction:n.faction}:null}isValidPlacement(t,e,n){const s=cr/2;if(t<-s+5||t>s-5||e<-s+5||e>s-5)return console.log(`[DEBUG] isValidPlacement: OUT OF BOUNDS at (${t.toFixed(1)}, ${e.toFixed(1)})`),!1;if(n!=="air"){const a=this.terrain.getTerrainAt(t,e);if(!(n==="sea"?[oe.SEA,oe.COAST]:[oe.LAND,oe.COAST]).includes(a))return console.log(`[DEBUG] isValidPlacement: WRONG TERRAIN "${a}" at (${t.toFixed(1)}, ${e.toFixed(1)}) for domain "${n}"`),!1;for(const r of this.terrain.mountains)if(Math.hypot(t-r.x,e-r.z)<r.r+3)return console.log(`[DEBUG] isValidPlacement: MOUNTAIN COLLISION at (${t.toFixed(1)}, ${e.toFixed(1)})`),!1}for(const a of[...this.playerUnits,...this.enemyUnits])if(a.alive&&Math.hypot(t-a.mesh.position.x,e-a.mesh.position.z)<4)return console.log(`[DEBUG] isValidPlacement: UNIT COLLISION with ${a.type} at (${a.mesh.position.x.toFixed(1)}, ${a.mesh.position.z.toFixed(1)})`),!1;for(const a of this.bases){if(!a.alive)continue;if(Math.hypot(t-a.mesh.position.x,e-a.mesh.position.z)<15)return console.log(`[DEBUG] isValidPlacement: BASE COLLISION with "${a.name}" at (${a.mesh.position.x.toFixed(1)}, ${a.mesh.position.z.toFixed(1)})`),!1}if(n==="land"){const a=this.getTerritoryAt(t,e);if(!a||a.faction!=="player")return!1}return!0}_showPlacementIndicator(t){let e=document.getElementById("placementIndicator");e||(e=document.createElement("div"),e.id="placementIndicator",document.body.appendChild(e)),e.textContent=`Placing: ${t.toUpperCase()} — Click to place, Right-click / Esc to cancel`,e.classList.remove("hidden")}_hidePlacementIndicator(){const t=document.getElementById("placementIndicator");t&&t.classList.add("hidden")}_setBuyButtonsDisabled(t){document.querySelectorAll("#armoryContent .unitBtn[data-unit-type]").forEach(n=>{n.disabled=t})}flashMessage(t){let e=document.getElementById("flashMsg");e||(e=document.createElement("div"),e.id="flashMsg",e.style.cssText=`
        position:fixed; top:60px; left:50%; transform:translateX(-50%);
        background:rgba(170,40,40,0.9); color:#fff; padding:8px 16px;
        border-radius:6px; font-family:monospace; z-index:100;
        pointer-events:none; transition:opacity 0.3s;
      `,document.body.appendChild(e)),e.textContent=t,e.style.opacity="1",clearTimeout(this._flashT),this._flashT=setTimeout(()=>{e.style.opacity="0"},1800)}queueDeath(t){this.deadUnits.push(t)}spawnMuzzleFlash(t){const e=new P(new _e(.6,6,6),new ie({color:16772676}));e.position.copy(t),e.userData.life=.08,this.scene.add(e),this.scene.userData.flashes=this.scene.userData.flashes||[],this.scene.userData.flashes.push(e)}update(t){if(this.ended||this.paused)return;const e=this.bases.filter(r=>r.faction==="player").length;this.money+=gl*e*t;for(const r of this.playerUnits)r.update(t);for(const r of this.enemyUnits)r.update(t);for(const r of this.bases)r.update(t);this._updateTransportLogistics(t),this._applySoftCollision(this.playerUnits),this._applySoftCollision(this.enemyUnits);for(let r=this.projectiles.length-1;r>=0;r--){const l=this.projectiles[r];l.update(t),l.alive||this.projectiles.splice(r,1)}gg(this.scene,t),_g(this.scene,t);const n=this.scene.userData.hitConfirms||[];for(let r=n.length-1;r>=0;r--){const l=n[r];l.userData.life-=t;const c=1-l.userData.life/l.userData.maxLife;l.scale.setScalar(1+c*3),l.material.opacity=.9*(1-c),l.userData.life<=0&&(this.scene.remove(l),l.geometry.dispose(),l.material.dispose(),n.splice(r,1))}const s=this.scene.userData.flashes||[];for(let r=s.length-1;r>=0;r--)s[r].userData.life-=t,s[r].scale.multiplyScalar(.9),s[r].userData.life<=0&&(this.scene.remove(s[r]),s.splice(r,1));const a=this.scene.userData.spawnMarkers||[];for(let r=a.length-1;r>=0;r--){const l=a[r];l.userData.life-=t,l.material.opacity=.8*(l.userData.life/2),l.scale.multiplyScalar(1.02),l.userData.life<=0&&(this.scene.remove(l),a.splice(r,1))}const o=this.scene.userData.flakPuffs||[];for(let r=o.length-1;r>=0;r--){const l=o[r];l.userData.life-=t,l.material.opacity=.6*(l.userData.life/.5),l.scale.multiplyScalar(1.05),l.userData.life<=0&&(this.scene.remove(l),o.splice(r,1))}for(const r of this.playerUnits)if(r.type==="fighter"&&r.faction==="player"&&r.mesh.userData.launchedFrom&&(r._fighterLifeTimer=(r._fighterLifeTimer||0)+t,r._fighterLifeTimer>60)){const l=r.mesh.userData.launchedFrom;l&&l.alive&&(r.moveTo(l.mesh.position.clone()),r._fighterLifeTimer=0,r.hp=Math.min(r.maxHp,r.hp+r.maxHp*.5),r._displayHp=r.hp)}if(this.minimap&&this.minimap.pings)for(let r=this.minimap.pings.length-1;r>=0;r--){const l=this.minimap.pings[r];l.life-=t,l.life<=0&&this.minimap.pings.splice(r,1)}this._animateFormationPreview(t),this.deadUnits.length,this.playerUnits=this.playerUnits.filter(r=>!r._cleaned),this.enemyUnits=this.enemyUnits.filter(r=>!r._cleaned),this.selectedUnits=this.selectedUnits.filter(r=>r.alive),this.aiTimer+=t,this.onAITick&&this.onAITick(t),this.fogUpdateTimer+=t,this.fogUpdateTimer>.25&&this.fog&&(this.fog.update(this.playerUnits,this.bases.filter(r=>r.faction==="player")),this.fogUpdateTimer=0),this.minimap&&this.minimap.draw(),this.updateHUD()}updateHUD(){const t=this.bases.filter(n=>n.faction==="player").length;document.getElementById("money").textContent=Math.floor(this.money),document.getElementById("income").textContent=`+${gl*t}/s`,document.getElementById("unitCount").textContent=this.playerUnits.length,document.getElementById("basesOwned").textContent=t;const e=this.enemyUnits.filter(n=>n.alive&&n.state!=="dead");document.getElementById("enemyCount").textContent=e.length,this.updateSelectionUI?.()}_updateTransportLogistics(t){for(const e of["player","enemy"]){const n=e==="player"?this.playerUnits:this.enemyUnits;let s=0;for(const a of n)a.alive&&a.state==="waitingForTransport"&&!a._claimedByShip&&s++;if(s>0){let a=0;for(const r of n)r.alive&&r.isTransport&&r._assignedEmbarkPoint&&r.carriedUnits.length<r.transportCapacity&&a++;const o=Math.ceil(s/4);if(a<o){const r=An.transport.cost;if((e==="player"?this.money:1/0)>=r){const c=this.bases.filter(u=>u.faction===e&&u.alive);let h=null;for(const u of c){const d=this.findValidSpawn(u.mesh.position,"sea");if(d){h=d;break}}if(!h&&c.length>0){const u=this.pathfinder.worldToGrid(c[0].mesh.position.x,c[0].mesh.position.z),d=this.pathfinder.findNearestWalkable(u.gx,u.gy,"sea");if(d){const f=this.pathfinder.gridToWorld(d.gx,d.gy);h=new L(f.x,.3,f.z)}}h&&(e==="player"&&(this.money-=r),console.log(`[DEBUG LOGISTICS] Spawning Transport ship for ${e} (${a+1}/${o})`),this.spawn("transport",e,h))}}}}}checkWinCondition(){const t=this.bases.filter(n=>n.faction==="player").length,e=this.bases.filter(n=>n.faction==="enemy").length;console.log(`[DEBUG GAME] Win check: player bases=${t}, enemy bases=${e}`),e===0?this.endGame(!0):t===0&&this.endGame(!1)}endGame(t){this.ended=!0,console.log(`[DEBUG GAME] GAME ENDED — ${t?"VICTORY":"DEFEAT"}`),document.getElementById("endScreen").classList.remove("hidden"),document.getElementById("endTitle").textContent=t?"🏆 Victory!":"💀 Defeat"}_animateFormationPreview(t){if(!this.scene||!this.scene.children)return;const e=performance.now()*.004;for(const n of this.scene.children)n.userData?.animOffset!==void 0&&(n.scale.setScalar(1+Math.sin(e+n.userData.animOffset)*.15),n.material.opacity=.4+Math.sin(e*2+n.userData.animOffset)*.2)}computeFormation(t,e,n){const a=[];switch(n){case"line":for(let r=0;r<e;r++)a.push(new L(t.x+(r-(e-1)/2)*6,0,t.z));break;case"column":for(let r=0;r<e;r++)a.push(new L(t.x,0,t.z+(r-(e-1)/2)*6));break;case"wedge":for(let r=0;r<e;r++){const l=Math.floor(r/2),c=r%2===0?-1:1;a.push(new L(t.x+c*l*6,0,t.z-l*6))}break;case"square":const o=Math.ceil(Math.sqrt(e));for(let r=0;r<e;r++){const l=Math.floor(r/o),c=r%o;a.push(new L(t.x+(c-(o-1)/2)*6,0,t.z+(l-(o-1)/2)*6))}break}return a}_applySoftCollision(t){for(let e=0;e<t.length;e++)for(let n=e+1;n<t.length;n++){const s=t[e],a=t[n];if(!s.alive||!a.alive||s.domain==="air"||a.domain==="air")continue;const o=a.mesh.position.x-s.mesh.position.x,r=a.mesh.position.z-s.mesh.position.z,l=Math.hypot(o,r),c=s.domain==="sea"||a.domain==="sea"?6:3.5;if(l>=c||l<.01)continue;const u=(c-l)*.3,d=o/l,f=r/l;s.mesh.position.x-=d*u,s.mesh.position.z-=f*u,a.mesh.position.x+=d*u,a.mesh.position.z+=f*u}}}function Rg(i,t,e){const n=new C0,s=new vt,a=e.domElement,o=new Fn(new L(0,1,0),-Re);let r=!1,l={x:0,y:0},c={x:0,y:0};const h=5,u=document.getElementById("selectionBox");function d(z){const N=a.getBoundingClientRect();s.x=(z.clientX-N.left)/N.width*2-1,s.y=-((z.clientY-N.top)/N.height)*2+1}function f(z){d(z),n.setFromCamera(s,t);const N=new L;return n.ray.intersectPlane(o,N),N}function g(z){d(z),n.setFromCamera(s,t);const N=[...i.playerUnits,...i.enemyUnits].filter(ut=>ut.alive),V=N.map(ut=>ut.mesh),nt=n.intersectObjects(V,!0);if(nt.length===0)return null;let rt=nt[0].object;for(;rt&&!N.find(ut=>ut.mesh===rt);)rt=rt.parent;return N.find(ut=>ut.mesh===rt)||null}function _(z){d(z),n.setFromCamera(s,t);const N=i.bases.map(rt=>rt.mesh),V=n.intersectObjects(N,!0);if(V.length===0)return null;let nt=V[0].object;for(;nt&&!i.bases.find(rt=>rt.mesh===nt);)nt=nt.parent;return i.bases.find(rt=>rt.mesh===nt)||null}let m=null,p=[];function y(){const z=new on(1.5,2.5,24),N=new ie({color:4521864,side:pe,transparent:!0,opacity:.8,depthTest:!1}),V=new P(z,N);V.rotation.x=-Math.PI/2,V.position.y=.15;const nt=new Ae,rt=new as({color:4521864,transparent:!0,opacity:.6,depthTest:!1}),ut=new Float32Array([-4,0,0,-1.5,0,0,1.5,0,0,4,0,0,0,0,-4,0,0,-1.5,0,0,1.5,0,0,4]);nt.setAttribute("position",new fn(ut,3));const Mt=new Kl(nt,rt);Mt.rotation.x=-Math.PI/2,Mt.position.y=.15,m=new de,m.add(V,Mt),m.visible=!1,i.scene.add(m)}function v(z){if(m||y(),!z){m.visible=!1;return}m.visible=!0,m.position.set(z.x,0,z.z);const N=performance.now()*.003,V=m.children[0];V&&(V.scale.setScalar(1+Math.sin(N)*.15),V.material.opacity=.5+Math.sin(N*2)*.3)}function M(){for(const z of p)i.scene.remove(z);p=[]}function I(z){if(M(),!z||i.selectedUnits.length===0)return;const N=i.computeFormation(z,i.selectedUnits.length,i.formation),V=i.selectedUnits[0].type,nt=ni[V];nt.color;const rt=nt.domain==="air",ut=nt.domain==="sea";for(const Mt of N){const St=new on(1.5,2.2,16),yt=new ie({color:4521864,side:pe,transparent:!0,opacity:.6,depthTest:!1}),dt=new P(St,yt);dt.rotation.x=-Math.PI/2;const W=rt?nt.altitude:ut?.3:Re+.5;dt.position.set(Mt.x,W+.1,Mt.z),dt.userData.animOffset=Math.random()*Math.PI*2,i.scene.add(dt),p.push(dt)}}function C(){for(const z of i.selectedUnits)z.setSelected(!1);i.selectedUnits=[],i.selectedBuilding=null,x()}function b(z,N=!1){N||C(),z.faction==="player"&&(i.selectedUnits.includes(z)||(z.setSelected(!0),i.selectedUnits.push(z),He.play("select")),x())}function k(z,N,V,nt){C();const rt=Math.min(z,V),ut=Math.max(z,V),Mt=Math.min(N,nt),St=Math.max(N,nt),yt=a.getBoundingClientRect();for(const dt of i.playerUnits){if(!dt.alive)continue;const W=dt.mesh.position.clone().project(t),Ot=(W.x*.5+.5)*yt.width+yt.left,O=(-W.y*.5+.5)*yt.height+yt.top;Ot>=rt&&Ot<=ut&&O>=Mt&&O<=St&&(dt.setSelected(!0),i.selectedUnits.push(dt))}x()}function x(){const z=document.getElementById("selectionInfo");if(i.selectedUnits.length===0){if(i.selectedBuilding){const dt=i.selectedBuilding;z.innerHTML=`<div style="color:#4af;text-align:center;padding:10px;">Selected: ${dt.base.name}<br><span style="color:#888;">${dt.isShipyard?"🏭 Shipyard":"🏛️ Barracks"}</span></div>`}else z.innerHTML='<div style="color:#888; text-align:center; padding:10px;">Click or drag to select units</div>';return}const N={};for(const dt of i.selectedUnits)N[dt.type]=(N[dt.type]||0)+1;const V={};function nt(dt,W){if(!V[dt]){const Ot=document.createElement("canvas");Ot.width=24,Ot.height=24;const O=Ot.getContext("2d");O.fillStyle="#"+W.toString(16).padStart(6,"0"),O.strokeStyle="#4af",O.lineWidth=.5;const q=12,G=12,D=7;switch(O.beginPath(),dt){case"infantry":O.moveTo(q,G-D),O.lineTo(q-D*.6,G+D*.5),O.lineTo(q+D*.6,G+D*.5),O.closePath();break;case"tank":O.roundRect(q-D,G-D*.7,D*2,D*1.4,2),O.closePath();break;case"heavyTank":O.roundRect(q-D*1.2,G-D*.8,D*2.4,D*1.6,2),O.closePath();break;case"crusher":O.roundRect(q-D*1.3,G-D*.9,D*2.6,D*1.8,2),O.closePath();break;case"artillery":O.roundRect(q-D,G-D*.6,D*2,D*1.2,1.5),O.closePath();break;case"missileDefense":O.roundRect(q-D*.8,G-D*.6,D*1.6,D*1.2,1),O.moveTo(q,G-D*.6),O.lineTo(q,G-D*1.3),O.closePath();break;case"mlrs":O.roundRect(q-D,G-D*.7,D*2,D*1.4,2),O.moveTo(q-D*.6,G-D*.4),O.lineTo(q+D*.6,G-D*.4),O.lineTo(q+D*.4,G-D*1),O.lineTo(q-D*.4,G-D*1),O.closePath();break;case"coastal":O.roundRect(q-D,G-D*.3,D*2,D*.6,1),O.moveTo(q-D*.3,G-D*.3),O.lineTo(q+D*.3,G-D*.3),O.lineTo(q+D*.3,G-D*.8),O.lineTo(q-D*.3,G-D*.8),O.closePath();break;case"healer":O.roundRect(q-D,G-D*.7,D*2,D*1.4,2),O.moveTo(q-D*.3,G),O.lineTo(q+D*.3,G),O.moveTo(q,G-D*.3),O.lineTo(q,G+D*.3),O.closePath();break;case"medHeli":O.moveTo(q,G),O.lineTo(q+D*.8,G+D*.3),O.lineTo(q+D*.8,G-D*.3),O.lineTo(q,G-D*.2),O.lineTo(q-D*.8,G-D*.1),O.lineTo(q-D*.8,G+D*.1),O.closePath();break;case"escortJet":O.moveTo(q,G-D*1.1),O.lineTo(q+D*.7,G+D*.2),O.lineTo(q+D*.4,G+D*.2),O.lineTo(q+D*.5,G+D*.6),O.lineTo(q,G+D*.4),O.lineTo(q-D*.5,G+D*.6),O.lineTo(q-D*.4,G+D*.2),O.lineTo(q-D*.7,G+D*.2),O.closePath();break;case"b2":O.moveTo(q,G-D*.4),O.lineTo(q-D*1.3,G+D*.5),O.lineTo(q-D*1.3,G+D*.7),O.lineTo(q+D*1.3,G+D*.7),O.lineTo(q+D*1.3,G+D*.5),O.closePath();break;case"escortBomber":O.moveTo(q,G-D*1.3),O.lineTo(q+D*1,G+D*.3),O.lineTo(q+D*.6,G+D*.3),O.lineTo(q+D*.7,G+D*.8),O.lineTo(q,G+D*.6),O.lineTo(q-D*.7,G+D*.8),O.lineTo(q-D*.6,G+D*.3),O.lineTo(q-D*1,G+D*.3),O.closePath();break;case"destroyer":case"battleship":O.moveTo(q-D*1.2,G+D*.3),O.lineTo(q+D*1.2,G+D*.3),O.lineTo(q+D*.8,G-D*.4),O.lineTo(q-D*.8,G-D*.4),O.closePath();break;case"frigate":O.moveTo(q-D*.9,G+D*.3),O.lineTo(q+D*1.2,G+D*.3),O.lineTo(q+D*.9,G-D*.3),O.lineTo(q-D*.6,G-D*.3),O.closePath();break;case"cruiser":O.moveTo(q-D*1.3,G+D*.3),O.lineTo(q+D*1.3,G+D*.3),O.lineTo(q+D*1,G-D*.4),O.lineTo(q-D*1,G-D*.4),O.closePath();break;case"submarine":O.ellipse(q,G,D*1.3,D*.5,0,0,Math.PI*2),O.closePath();break;case"carrier":O.moveTo(q-D*1.3,G+D*.2),O.lineTo(q+D*1.3,G+D*.2),O.lineTo(q+D*1.3,G-D*.3),O.lineTo(q-D*1.3,G-D*.3),O.closePath();break;case"fighter":O.moveTo(q,G-D*1.1),O.lineTo(q+D*.6,G+D*.2),O.lineTo(q+D*.3,G+D*.2),O.lineTo(q+D*.4,G+D*.6),O.lineTo(q,G+D*.4),O.lineTo(q-D*.4,G+D*.6),O.lineTo(q-D*.3,G+D*.2),O.lineTo(q-D*.6,G+D*.2),O.closePath();break;case"bomber":O.moveTo(q,G-D*1.2),O.lineTo(q+D*.8,G+D*.3),O.lineTo(q+D*.4,G+D*.3),O.lineTo(q+D*.5,G+D*.7),O.lineTo(q,G+D*.5),O.lineTo(q-D*.5,G+D*.7),O.lineTo(q-D*.4,G+D*.3),O.lineTo(q-D*.8,G+D*.3),O.closePath();break;case"heli":O.moveTo(q,G),O.lineTo(q+D*.8,G+D*.3),O.lineTo(q+D*.8,G-D*.3),O.lineTo(q,G-D*.2),O.lineTo(q-D*.8,G-D*.1),O.lineTo(q-D*.8,G+D*.1),O.closePath();break;case"gunship":O.roundRect(q-D,G-D*.4,D*2,D*.8,2),O.moveTo(q-D*1.5,G),O.lineTo(q+D*1.5,G),O.lineTo(q+D*1.5,G+D*.15),O.lineTo(q-D*1.5,G+D*.15),O.closePath();break;case"transport":O.roundRect(q-D,G-D*.5,D*2,D,2),O.closePath();break;case"minigunnerVehicle":O.roundRect(q-D*1.1,G-D*.7,D*2.2,D*1.4,2),O.closePath();break;case"megaMedic":O.roundRect(q-D,G-D*.7,D*2,D*1.4,2),O.closePath();break;case"minigunner":O.moveTo(q,G-D),O.lineTo(q-D*.6,G+D*.5),O.lineTo(q+D*.6,G+D*.5),O.closePath();break}O.fill(),O.stroke(),V[dt]=Ot.toDataURL("image/png")}return V[dt]}let rt="";for(const[dt,W]of Object.entries(N)){const Ot=ni[dt],O=nt(dt,Ot.color);let q=0,G=0,D=0,Nt=0;for(const Y of i.selectedUnits)Y.type===dt&&(q+=Y.hp,G+=Y.stats.damage,D=Math.max(D,Y.stats.range),Nt++);const A=Math.round(q/Nt),S=Math.round(G/Nt);rt+=`
        <div class="selection-item">
          <img class="selection-icon" src="${O}" alt="${dt}">
          <div>
            <div class="selection-type">${dt.toUpperCase()}</div>
            <div class="selection-stats">HP: ${A} | DMG: ${S} | RNG: ${D}</div>
          </div>
          <div class="selection-count">×${W}</div>
        </div>
      `}const ut=i.selectedUnits.length===1?"unit":"units";if(rt+=`<div style="margin-top:8px;color:#4af;text-align:center;">Total: ${i.selectedUnits.length} ${ut}</div>`,i.selectedUnits.some(dt=>dt.isTransport&&dt.alive)){const dt=i.selectedUnits.find(q=>q.isTransport),Ot=i.playerUnits.filter(q=>q.alive&&q.domain==="land"&&!q.carried&&dt.canLoadUnit(q)).length>0,O=dt.carriedUnits.length>0;rt+='<div class="transport-actions" style="display:flex;gap:8px;margin-top:8px;justify-content:center;">',rt+=`<button id="loadBtn" class="action-btn" style="background:#2a6;color:#fff;border:none;padding:6px 14px;border-radius:4px;cursor:pointer;font-family:inherit;"${Ot?"":" disabled"}>📦 Load${Ot?"":" (no units nearby)"}</button>`,rt+=`<button id="unloadBtn" class="action-btn" style="background:#a62;color:#fff;border:none;padding:6px 14px;border-radius:4px;cursor:pointer;font-family:inherit;"${O?"":" disabled"}>📤 Unload${O?` (${dt.carriedUnits.length})`:" (no cargo)"}</button>`,rt+="</div>"}z.innerHTML=rt;const St=document.getElementById("loadBtn");St&&St.addEventListener("click",()=>{const dt=i.selectedUnits.find(Ot=>Ot.isTransport);if(!dt)return;const W=i.playerUnits.filter(Ot=>Ot.alive&&Ot.domain==="land"&&!Ot.carried&&dt.canLoadUnit(Ot));for(const Ot of W)dt.loadUnit(Ot);i.updateSelectionUI()});const yt=document.getElementById("unloadBtn");yt&&yt.addEventListener("click",()=>{const dt=i.selectedUnits.find(W=>W.isTransport);dt&&dt.unloadAll(),i.updateSelectionUI()})}function T(z,N=null){const V=i.selectedUnits;if(V.length===0)return;if(N&&N.faction!=="player"){for(const St of V)St.attack(N);return}const nt=i.playerUnits.filter(St=>St.isTransport&&St.alive);for(const St of V)if(St.domain==="land"&&!St.carried)for(const yt of nt){if(yt.carriedUnits.length>=yt.transportCapacity)continue;if(St.mesh.position.distanceTo(yt.mesh.position)<=12&&yt.mesh.position.distanceTo(z)<=10){yt.loadUnit(St);break}}const rt=i.computeFormation(z,V.length,i.formation),ut=[...V],Mt=[...rt];for(;ut.length>0&&Mt.length>0;){let St=0,yt=0,dt=1/0;for(let W=0;W<ut.length;W++)for(let Ot=0;Ot<Mt.length;Ot++){const O=ut[W].mesh.position.distanceTo(Mt[Ot]);O<dt&&(dt=O,St=W,yt=Ot)}ut[St].moveTo(Mt[yt],i.attackMoveMode),ut.splice(St,1),Mt.splice(yt,1)}He.play("move")}let E=null;function R(z){const N=g(z),V=_(z),nt=N||V;if(nt&&nt.alive!==!1){E||(E=document.createElement("div"),E.className="unit-tooltip",document.body.appendChild(E));const rt=Math.ceil(nt.hp||nt._displayHp||0),ut=Math.ceil(nt.maxHp||0),Mt=ut>0?Math.round(rt/ut*100):0,St=nt.type||nt.name||"Unit";E.innerHTML=`<strong>${St.toUpperCase()}</strong><br>❤ HP: ${rt} / ${ut} <span style="color:${Mt>50?"#4f4":Mt>25?"#fa0":"#f44"}">(${Mt}%)</span>`,E.style.left=z.clientX+16+"px",E.style.top=z.clientY+16+"px",E.classList.add("visible")}else E&&(E.classList.remove("visible"),E.remove(),E=null)}a.addEventListener("contextmenu",z=>z.preventDefault()),a.addEventListener("mousedown",z=>{if(z.button===0){if(i.placementMode&&i.placementMode.active){console.log("[DEBUG INPUT] Left-click blocked — placement mode active");return}c={x:z.clientX,y:z.clientY},l={x:z.clientX,y:z.clientY},r=!1}}),a.addEventListener("mousemove",z=>{if(R(z),i.placementMode&&i.placementMode.active){const N=f(z);N&&i.updatePlacementPreview(N);return}if(z.buttons&1){const N=z.clientX-c.x,V=z.clientY-c.y;if(!r&&Math.hypot(N,V)>h&&(r=!0,u.style.display="block"),r){const nt=Math.min(l.x,z.clientX),rt=Math.min(l.y,z.clientY),ut=Math.abs(z.clientX-l.x),Mt=Math.abs(z.clientY-l.y);u.style.left=`${nt}px`,u.style.top=`${rt}px`,u.style.width=`${ut}px`,u.style.height=`${Mt}px`}}else if(i.selectedUnits.length>0){const N=f(z);N&&(v(N),I(N))}}),a.addEventListener("mouseup",z=>{if(i.placementMode&&i.placementMode.active){if(z.button===0){console.log("[DEBUG INPUT] Left-click in placement mode — confirming placement");const N=f(z);i.confirmPlacement(N)}else z.button===2&&(console.log("[DEBUG INPUT] Right-click in placement mode — cancelling"),i.exitPlacementMode(!0));return}if(z.button===0)if(r)k(l.x,l.y,z.clientX,z.clientY),r=!1,u.style.display="none";else{const N=g(z),V=_(z);N?(b(N,z.shiftKey),i.selectedBuilding=null):V&&V.faction==="player"?(C(),i.selectedBuilding={base:V,faction:V.faction,isShipyard:[xl.SEA,xl.COAST].includes(i.terrain.getTerrainAt(V.mesh.position.x,V.mesh.position.z))},x()):(C(),i.selectedBuilding=null)}else if(z.button===2){const N=g(z),V=_(z),nt=N||(V&&V.faction!=="player"?{mesh:V.mesh,faction:V.faction,get alive(){return V.alive},get hp(){return V.hp},takeDamage:rt=>V.takeDamage(rt)}:null);if(nt&&nt.faction!=="player"){console.log(`[DEBUG INPUT] Right-click ATTACK on ${N?"unit":"base"} (${i.selectedUnits.length} attackers)`);for(const rt of i.selectedUnits)rt.attack(nt)}else{const rt=f(z);rt&&(console.log(`[DEBUG INPUT] Right-click MOVE to (${rt.x.toFixed(0)}, ${rt.z.toFixed(0)}) — ${i.selectedUnits.length} units`),T(rt))}}}),a.addEventListener("mouseleave",()=>{E&&(E.classList.remove("visible"),E.remove(),E=null)});let B,U,H=null,$=null;const tt=500;function it(z){const N=z[0].clientX-z[1].clientX,V=z[0].clientY-z[1].clientY;return Math.sqrt(N*N+V*V)}function st(z,N,V){const nt=new MouseEvent(z,{clientX:N,clientY:V,bubbles:!0});a.dispatchEvent(nt)}function et(z,N){cameraTarget.x+=z*.5,cameraTarget.z-=N*.5,cameraTarget.x=We.clamp(cameraTarget.x,-MAP_SIZE/2,MAP_SIZE/2),cameraTarget.z=We.clamp(cameraTarget.z,-MAP_SIZE/2,MAP_SIZE/2)}function at(z){t.position.y=We.clamp(t.position.y+z,60,400)}a.addEventListener("touchstart",z=>{if(z.preventDefault(),z.touches.length===1){const N=z.touches[0];B=N.clientX,U=N.clientY,$=setTimeout(()=>{st("contextmenu",N.clientX,N.clientY),$=null},tt)}else z.touches.length===2&&(clearTimeout($),H=it(z.touches))},{passive:!1}),a.addEventListener("touchmove",z=>{if(z.preventDefault(),clearTimeout($),z.touches.length===1){const N=z.touches[0],V=N.clientX-B,nt=N.clientY-U;et(V,nt),B=N.clientX,U=N.clientY}else if(z.touches.length===2){const N=it(z.touches),V=H-N;at(V*.1),H=N}},{passive:!1}),a.addEventListener("touchend",z=>{z.preventDefault(),$&&(clearTimeout($),st("click",B,U)),H=null},{passive:!1}),i.updateSelectionUI=x,i.renderer=e,console.log("✅ Input system online — LMB select/drag, RMB move/attack, touch enabled.")}const Vs={LAND:"land",COAST:"coast",SEA:"sea"},Ws=1200,Ya={infantry:{domain:"land",hp:50,damage:8,range:18,speed:14,fireRate:1,hitChance:.85,cost:50,color:5597999,canFireWhileMoving:!1,bounty:30,projectile:"burst",splashRadius:0,splashFalloff:1},tank:{domain:"land",hp:200,damage:50,range:50,speed:10,fireRate:1.5,hitChance:.9,cost:200,color:4873507,canFireWhileMoving:!1,bounty:100,projectile:"ap",splashRadius:2,splashFalloff:.5},heavyTank:{domain:"land",hp:1e3,damage:1500,range:30,speed:10,fireRate:5,hitChance:.9,cost:500,color:3815978,canFireWhileMoving:!1,bounty:400,projectile:"ap",splashRadius:0,splashFalloff:1},crusher:{domain:"land",hp:3e3,damage:200,range:30,speed:10,fireRate:3,hitChance:.85,cost:1e3,color:5583701,canFireWhileMoving:!0,bounty:500,projectile:"ap",splashRadius:100,splashFalloff:.5,crusher:!0,baseTarget:!0},artillery:{domain:"land",hp:120,damage:128,range:96,speed:6,fireRate:3,hitChance:.7,cost:300,color:7035706,canFireWhileMoving:!1,bounty:120,projectile:"barrage",splashRadius:3,splashFalloff:.5},mlrs:{domain:"land",hp:80,damage:15,range:110,speed:10,fireRate:4,hitChance:.6,cost:350,color:5987130,canFireWhileMoving:!1,bounty:120,projectile:"salvo",splashRadius:2,splashFalloff:.4},missileDefense:{domain:"land",hp:500,damage:300,range:85,speed:0,fireRate:2,hitChance:.9,cost:500,color:8930440,canFireWhileMoving:!1,bounty:150,projectile:"homing",splashRadius:0,splashFalloff:1,airOnly:!0},coastal:{domain:"land",hp:400,damage:100,range:120,speed:0,fireRate:2.5,hitChance:.9,cost:400,color:5588019,canFireWhileMoving:!1,bounty:150,projectile:"ap",splashRadius:2,splashFalloff:.5,seaOnly:!0},destroyer:{domain:"sea",hp:250,damage:45,range:96,speed:12,fireRate:1.2,hitChance:.85,cost:250,color:8952234,canFireWhileMoving:!0,bounty:150,projectile:"dual",splashRadius:8,splashFalloff:.5},frigate:{domain:"sea",hp:150,damage:20,range:60,speed:18,fireRate:1,hitChance:.85,cost:150,color:5925498,canFireWhileMoving:!0,bounty:60,projectile:"default",splashRadius:0,splashFalloff:1},cruiser:{domain:"sea",hp:200,damage:40,range:100,speed:16,fireRate:1,hitChance:.9,cost:300,color:6715272,canFireWhileMoving:!0,bounty:100,projectile:"homing",splashRadius:0,splashFalloff:1,airOnly:!0},submarine:{domain:"sea",hp:100,damage:150,range:50,speed:10,fireRate:3.5,hitChance:.85,cost:350,color:2241348,canFireWhileMoving:!1,bounty:150,projectile:"ap",splashRadius:0,splashFalloff:1,seaOnly:!0,stealth:!0},battleship:{domain:"sea",hp:600,damage:130,range:160,speed:12,fireRate:3.5,hitChance:.8,cost:600,color:3359829,canFireWhileMoving:!0,bounty:300,projectile:"salvo",splashRadius:10,splashFalloff:.6},carrier:{domain:"sea",hp:800,damage:20,range:160,speed:8,fireRate:2,hitChance:.7,cost:700,color:5596791,canLaunchFighters:!0,altitude:0,canFireWhileMoving:!0,bounty:400,projectile:"default",splashRadius:0,splashFalloff:1},fighter:{domain:"air",hp:80,damage:35,range:45,speed:30,fireRate:.6,hitChance:.9,cost:300,color:10066346,altitude:25,canFireWhileMoving:!0,bounty:80,projectile:"homing",splashRadius:2,splashFalloff:.5},heli:{domain:"air",hp:120,damage:25,range:40,speed:25,fireRate:.8,hitChance:.8,cost:350,color:4868682,altitude:15,canFireWhileMoving:!0,bounty:90,projectile:"burst",splashRadius:1,splashFalloff:.5},gunship:{domain:"air",hp:250,damage:35,range:60,speed:14,fireRate:.4,hitChance:.8,cost:600,color:8952234,altitude:20,canFireWhileMoving:!0,bounty:200,projectile:"barrage",splashRadius:2,splashFalloff:.5,groundOnly:!0},bomber:{domain:"air",hp:180,damage:140,range:30,speed:18,fireRate:3.5,hitChance:.75,cost:500,color:7833753,altitude:30,canFireWhileMoving:!0,bounty:160,projectile:"carpet",splashRadius:12,splashFalloff:.5},transport:{domain:"sea",hp:1e3,damage:0,range:0,speed:15,fireRate:99,hitChance:0,cost:400,color:9139029,canFireWhileMoving:!1,bounty:200,projectile:"default",splashRadius:0,splashFalloff:1,transportCapacity:4},healer:{domain:"land",hp:150,damage:0,range:30,speed:10,fireRate:1,hitChance:0,cost:500,color:4500036,canFireWhileMoving:!1,bounty:100,projectile:"default",splashRadius:0,splashFalloff:1,healer:!0},medHeli:{domain:"air",hp:150,damage:0,range:30,speed:15,fireRate:1,hitChance:0,cost:500,color:4500036,altitude:15,canFireWhileMoving:!1,bounty:100,projectile:"default",splashRadius:0,splashFalloff:1,healer:!0},minigunnerVehicle:{domain:"land",hp:700,damage:5,range:40,speed:15,fireRate:.1,hitChance:.85,cost:800,color:8939076,canFireWhileMoving:!1,bounty:300,projectile:"burst",splashRadius:0,splashFalloff:1,buffDamage:.3,buffRange:40},megaMedic:{domain:"land",hp:500,damage:0,range:0,speed:15,fireRate:99,hitChance:0,cost:1e3,color:4500104,canFireWhileMoving:!1,bounty:400,projectile:"default",splashRadius:0,splashFalloff:1,buffHp:.3,buffRange:30},minigunner:{domain:"land",hp:500,damage:5,range:40,speed:8,fireRate:.1,hitChance:.85,cost:400,color:8943445,canFireWhileMoving:!1,bounty:150,projectile:"burst",splashRadius:0,splashFalloff:1,buffInfantryHp:2,buffRange:30},escortJet:{domain:"air",hp:2e3,damage:10,range:10,speed:25,fireRate:.5,hitChance:.9,cost:800,color:5596791,altitude:25,canFireWhileMoving:!0,bounty:200,projectile:"homing",splashRadius:0,splashFalloff:1},b2:{domain:"air",hp:800,damage:1e3,range:25,speed:20,fireRate:3,hitChance:.9,cost:800,color:3355460,altitude:35,canFireWhileMoving:!0,bounty:400,projectile:"carpet",splashRadius:18,splashFalloff:.3,baseOnly:!0,oneWay:!0},escortBomber:{domain:"air",hp:5e3,damage:0,range:0,speed:22,fireRate:99,hitChance:0,cost:500,color:4473941,altitude:30,canFireWhileMoving:!0,bounty:0,projectile:"default",splashRadius:0,splashFalloff:1,escortBomber:!0,oneWay:!0}},Cg={easy:{aiIncome:.6,maxAttackGroup:10,hpMultiplier:1,baseHpMultiplier:1},normal:{aiIncome:1,maxAttackGroup:20,hpMultiplier:1,baseHpMultiplier:2},hard:{aiIncome:1.5,maxAttackGroup:50,hpMultiplier:2,baseHpMultiplier:4}};function Pg(i){const t=Cg[i.difficulty];let e=0,n=200;const a={easy:1,normal:2,hard:4}[i.difficulty]||1,o=[],r=2;function l(b){o.push({pos:b,time:e});const k=e-r;for(let x=o.length-1;x>=0;x--)o[x].time<k&&o.splice(x,1)}function c(b,k=15){for(const x of o)if(b.distanceTo(x.pos)<k)return!0;return!1}function h(b,k){const x=k==="sea"?[Vs.SEA,Vs.COAST]:[Vs.LAND,Vs.COAST];for(let T=15;T<=400;T+=8)for(let E=0;E<24;E++){const R=E/24*Math.PI*2+Math.random()*.2,B=b.mesh.position.x+Math.cos(R)*T,U=b.mesh.position.z+Math.sin(R)*T,H=i.terrain.getTerrainAt(B,U);if(!x.includes(H))continue;let $=!1;for(const it of i.terrain.mountains)if(Math.hypot(B-it.x,U-it.z)<it.r+3){$=!0;break}if($)continue;const tt=new L(B,k==="sea"?.3:Re+.5,U);if(!c(tt))return tt}for(let T=15;T<=400;T+=8)for(let E=0;E<24;E++){const R=E/24*Math.PI*2+Math.random()*.2,B=b.mesh.position.x+Math.cos(R)*T,U=b.mesh.position.z+Math.sin(R)*T,H=i.terrain.getTerrainAt(B,U);if(!x.includes(H))continue;let $=!1;for(const tt of i.terrain.mountains)if(Math.hypot(B-tt.x,U-tt.z)<tt.r+3){$=!0;break}if(!$)return new L(B,k==="sea"?.3:Re+.5,U)}return null}function u(){return i.difficulty==="easy"?["infantry","infantry","tank"][Math.floor(Math.random()*3)]:i.difficulty==="normal"?["infantry","tank","tank","artillery","fighter","fighter","minigunner","missileDefense","missileDefense","destroyer","frigate","battleship"][Math.floor(Math.random()*12)]:["tank","tank","heavyTank","artillery","mlrs","minigunnerVehicle","megaMedic","fighter","fighter","bomber","heli","gunship","destroyer","frigate","cruiser","submarine","battleship","carrier","missileDefense","missileDefense","missileDefense","missileDefense","coastal"][Math.floor(Math.random()*23)]}function d(b=null){const k=i.bases.filter(R=>R.faction==="enemy");if(k.length===0)return null;if(b)return k.reduce((R,B)=>B.mesh.position.distanceTo(b.mesh.position)<R.mesh.position.distanceTo(b.mesh.position)?B:R);const x=i.bases.filter(R=>R.faction==="player");if(x.length===0)return k[Math.floor(Math.random()*k.length)];let T=k[0],E=-1;for(const R of k){let B=0;for(const $ of x)B+=R.mesh.position.distanceTo($.mesh.position);const H=1/(B/x.length+1);H>E&&(E=H,T=R)}return Math.random()<.7?T:k[Math.floor(Math.random()*k.length)]}function f(b,k=null){const x=d(k);if(!x)return!1;const T=Ya[b],E=h(x,T.domain);if(!E)return console.warn(`[DEBUG AI] Failed to find non-overlapping spawn for ${b} near ${x.name}`),!1;l(E);const R=i.spawn(b,"enemy",E);return t.hpMultiplier>1&&(R.maxHp=Math.round(R.maxHp*t.hpMultiplier),R.hp=R.maxHp,R._displayHp=R.hp),console.log(`[DEBUG AI] Spawned ${b} near ${x.name} at (${E.x.toFixed(0)}, ${E.z.toFixed(0)})`),!0}function g(){const b=i.bases.filter(R=>R.faction==="player");if(b.length===0)return null;if(i.difficulty==="hard")return b.reduce((R,B)=>R.hp<B.hp?R:B);const k=b.reduce((R,B)=>R+B.hp,0),x=b.map(R=>Math.max(1,k-R.hp+1)),T=x.reduce((R,B)=>R+B,0);let E=Math.random()*T;for(let R=0;R<b.length;R++)if(E-=x[R],E<=0)return b[R];return b[0]}let _=0,m=!1;function p(){return i.enemyUnits.filter(b=>b.alive&&b.domain!=="sea"&&!b.isTransport&&b.state!=="waitingForTransport"&&!b.carried&&b.stats.damage>0)}function y(){const b=i.enemyUnits.filter(k=>k.alive).length;b>=12&&b-_>=3&&!m&&(i.flashMessage(`⚠️ Enemy battalion detected! (~${b} units massing)`),m=!0),b<8&&(m=!1),_=b}function v(){const b=i.bases.filter(et=>et.faction==="player");if(b.length===0)return;const k=p(),x=i.enemyUnits.filter(et=>et.alive&&et.domain!=="sea"&&!et.isTransport&&et.stats.damage>0).length;let T;if(x<4?T=x:x<8?T=Math.ceil(x*.7):x<15?T=Math.ceil(x*.6):T=Math.ceil(x*(.4+Math.random()*.2)),T=Math.min(T,t.maxAttackGroup),T<1)return;const E=Math.random()<.3,R=E?b:[g()];if(!R.length)return;const B=Math.min(3,a);for(let et=0;et<B;et++){const at=u(),z=Ya[at];z.speed!==0&&n>=z.cost&&f(at,R[0])&&(n-=z.cost)}const U=[...k].sort((et,at)=>{const z=R.reduce((V,nt)=>Math.min(V,et.mesh.position.distanceTo(nt.mesh.position)),1/0),N=R.reduce((V,nt)=>Math.min(V,at.mesh.position.distanceTo(nt.mesh.position)),1/0);return z-N}),H=U.slice(0,Math.min(T,U.length));if(H.length<1)return;H.length>=8&&i.flashMessage(`⚠️ Enemy attack inbound! ${H.length} units detected`);const $=H.length>=10,tt=R[0],it=H.filter(et=>et.domain==="air");for(const et of R)for(const at of it)at.attack(et);const st=H.filter(et=>et.domain!=="air");if(st.length){if(E){const et=Math.max(1,Math.floor(st.length/R.length));let at=0;for(const N of R){const V=st.slice(at,at+et);at+=et;const nt=i.computeFormation(N.mesh.position,V.length,$?"wedge":"line");V.forEach((rt,ut)=>rt.moveTo(nt[ut]||N.mesh.position.clone()))}const z=st.slice(at);if(z.length>0){const N=i.computeFormation(tt.mesh.position,z.length,"line");z.forEach((V,nt)=>V.moveTo(N[nt]||tt.mesh.position.clone()))}}else{const et=i.computeFormation(tt.mesh.position,st.length,$?"wedge":"line");st.forEach((at,z)=>at.moveTo(et[z]||tt.mesh.position.clone()))}console.log(`[DEBUG AI] ATTACK WAVE: ${H.length} units (air:${it.length}, ground:${st.length}) → ${E?R.length+" targets":R[0].name}${$?" (HUGE BATTALION!)":""}`)}}function M(){for(const b of i.bases){if(b.faction!=="enemy")continue;const k=i.playerUnits.filter(T=>T.alive&&T.mesh.position.distanceTo(b.mesh.position)<80);if(k.length===0)continue;const x=i.enemyUnits.filter(T=>T.alive&&T.state==="idle"&&!T.target&&T.mesh.position.distanceTo(b.mesh.position)<100);for(const T of x){const E=T.stats.airOnly?k.filter(B=>B.domain==="air"):k.filter(B=>T.domain==="land"&&B.domain==="sea"?T.mesh.position.distanceTo(B.mesh.position)<T.stats.range*.3:!0);if(E.length===0)continue;const R=E.reduce((B,U)=>T.mesh.position.distanceTo(B.mesh.position)<T.mesh.position.distanceTo(U.mesh.position)?B:U);T.attack(R)}}}function I(b){const k=i.bases.filter(E=>E.faction==="enemy"&&E.alive&&E!==b);if(k.length===0)return;const x=i.enemyUnits.filter(E=>E.alive&&E.domain==="land"&&!E.isTransport&&E.state==="idle"&&!E.carried&&E.stats.speed>0);let T=0;for(const E of x){if(T>=4)break;for(const R of k)if(E.mesh.position.distanceTo(R.mesh.position)<100){E.moveTo(b.mesh.position.clone()),T++;break}}T>0&&console.log(`[DEBUG AI] Reinforcing ${b.name} with ${T} troops via transport`)}let C=0;i.onBaseUnderAttack=function(b){const k=Date.now();k-C<6e3||(C=k,I(b))},i.onAITick=function(b){if(!i.ended&&(M(),e+=b,e>=1)){e=0;const x=12*i.bases.filter(R=>R.faction==="enemy").length*t.aiIncome;n+=x;const T=i.enemyUnits.filter(R=>R.alive&&R.domain!=="sea"&&!R.isTransport&&R.stats.damage>0).length,E=Math.min(1,T/t.maxAttackGroup);if(Math.random()<E)v();else{for(let R=0;R<a;R++){const B=u(),U=Ya[B],H=U.speed===0?0:U.cost;n<H||f(B)&&(n-=H)}if(Math.random()<.2){const R=i.bases.filter(B=>B.faction==="enemy");for(const B of R){const U=i.enemyUnits.filter(tt=>tt.alive&&tt.stats.speed===0&&tt.mesh.position.distanceTo(B.mesh.position)<80).length,H=i.difficulty==="hard"?10:5;if(U>=H)continue;const $=Math.random()<.5?"missileDefense":"coastal";f($,B)}}}y()}},console.log(`✅ AI online — Difficulty: ${i.difficulty.toUpperCase()}`)}const oa="rts_save_v1";function Lg(i){const t={timestamp:Date.now(),difficulty:i.difficulty,money:i.money,formation:i.formation,upgrades:i.upgrades.serialize(),bases:i.bases.map(e=>({faction:e.faction,hp:e.hp,name:e.name,size:e.size,pos:{x:e.mesh.position.x,z:e.mesh.position.z}})),playerUnits:i.playerUnits.filter(e=>e.alive).map(yl),enemyUnits:i.enemyUnits.filter(e=>e.alive).map(yl),fog:i.fog?i.fog.serialize():null,cameraTarget:i.cameraTarget?{x:i.cameraTarget.x,z:i.cameraTarget.z}:null};try{return localStorage.setItem(oa,JSON.stringify(t)),!0}catch(e){return console.error("Save failed",e),!1}}function yl(i){return{type:i.type,faction:i.faction,hp:i.hp,maxHp:i.maxHp,pos:{x:i.mesh.position.x,y:i.mesh.position.y,z:i.mesh.position.z},rotY:i.mesh.rotation.y}}function Dg(){const i=localStorage.getItem(oa);if(!i)return null;try{return JSON.parse(i)}catch{return null}}function mc(){return!!localStorage.getItem(oa)}function Ug(){localStorage.removeItem(oa)}function Ig(i,t,e=48){const n=document.createElement("canvas");n.width=e,n.height=e;const s=n.getContext("2d");function a(c,h,u,d,f,g){const _=Math.min(g,d/2,f/2);c.beginPath(),c.moveTo(h+_,u),c.lineTo(h+d-_,u),c.quadraticCurveTo(h+d,u,h+d,u+_),c.lineTo(h+d,u+f-_),c.quadraticCurveTo(h+d,u+f,h+d-_,u+f),c.lineTo(h+_,u+f),c.quadraticCurveTo(h,u+f,h,u+f-_),c.lineTo(h,u+_),c.quadraticCurveTo(h,u,h+_,u),c.closePath()}s.fillStyle="#"+t.toString(16).padStart(6,"0"),s.strokeStyle="#4af",s.lineWidth=1;const o=e/2,r=e/2,l=e*.35;switch(s.beginPath(),i){case"infantry":s.moveTo(o,r-l),s.lineTo(o-l*.6,r+l*.5),s.lineTo(o+l*.6,r+l*.5),s.closePath();break;case"tank":a(s,o-l,r-l*.7,l*2,l*1.4,3),s.moveTo(o-l*.3,r-l*.7),s.lineTo(o+l*.3,r-l*.7),s.lineTo(o+l*.3,r-l*1.2),s.lineTo(o-l*.3,r-l*1.2),s.closePath();break;case"heavyTank":a(s,o-l*1.2,r-l*.8,l*2.4,l*1.6,3),s.moveTo(o-l*.35,r-l*.8),s.lineTo(o+l*.35,r-l*.8),s.lineTo(o+l*.35,r-l*1.4),s.lineTo(o-l*.35,r-l*1.4),s.closePath();break;case"crusher":a(s,o-l*1.3,r-l*.9,l*2.6,l*1.8,3),s.moveTo(o-l*.4,r-l*.9),s.lineTo(o+l*.4,r-l*.9),s.lineTo(o+l*.4,r-l*1.5),s.lineTo(o-l*.4,r-l*1.5),s.closePath();break;case"artillery":a(s,o-l,r-l*.6,l*2,l*1.2,2),s.moveTo(o+l*.1,r),s.lineTo(o+l*1.5,r-l*.3),s.lineTo(o+l*1.5,r+l*.3),s.lineTo(o+l*.1,r),s.closePath();break;case"missileDefense":a(s,o-l*.8,r-l*.6,l*1.6,l*1.2,2),s.moveTo(o,r-l*.6),s.lineTo(o,r-l*1.3),s.lineTo(o+l*.3,r-l*1.1),s.lineTo(o,r-l*1.3),s.lineTo(o-l*.3,r-l*1.1),s.closePath();break;case"coastal":a(s,o-l*1,r-l*.3,l*2,l*.6,1),s.moveTo(o-l*.3,r-l*.3),s.lineTo(o+l*.3,r-l*.3),s.lineTo(o+l*.3,r-l*.8),s.lineTo(o-l*.3,r-l*.8),s.closePath();break;case"destroyer":case"battleship":s.moveTo(o-l*1.2,r+l*.3),s.lineTo(o+l*1.2,r+l*.3),s.lineTo(o+l*.8,r-l*.4),s.lineTo(o-l*.8,r-l*.4),s.closePath();break;case"frigate":s.moveTo(o-l*.9,r+l*.3),s.lineTo(o+l*1.2,r+l*.3),s.lineTo(o+l*.9,r-l*.3),s.lineTo(o-l*.6,r-l*.3),s.closePath();break;case"cruiser":s.moveTo(o-l*1.3,r+l*.3),s.lineTo(o+l*1.3,r+l*.3),s.lineTo(o+l*1,r-l*.4),s.lineTo(o-l*1,r-l*.4),s.closePath();break;case"submarine":s.ellipse(o,r,l*1.3,l*.5,0,0,Math.PI*2),s.closePath();break;case"carrier":s.moveTo(o-l*1.3,r+l*.2),s.lineTo(o+l*1.3,r+l*.2),s.lineTo(o+l*1.3,r-l*.3),s.lineTo(o-l*1.3,r-l*.3),s.closePath(),s.moveTo(o+l*.4,r-l*.3),s.lineTo(o+l*.4,r-l*.8),s.lineTo(o+l*.9,r-l*.5),s.lineTo(o+l*.9,r-l*.3),s.closePath();break;case"fighter":s.moveTo(o,r-l*1.1),s.lineTo(o+l*.6,r+l*.2),s.lineTo(o+l*.3,r+l*.2),s.lineTo(o+l*.4,r+l*.6),s.lineTo(o,r+l*.4),s.lineTo(o-l*.4,r+l*.6),s.lineTo(o-l*.3,r+l*.2),s.lineTo(o-l*.6,r+l*.2),s.closePath();break;case"bomber":s.moveTo(o,r-l*1.2),s.lineTo(o+l*.8,r+l*.3),s.lineTo(o+l*.4,r+l*.3),s.lineTo(o+l*.5,r+l*.7),s.lineTo(o,r+l*.5),s.lineTo(o-l*.5,r+l*.7),s.lineTo(o-l*.4,r+l*.3),s.lineTo(o-l*.8,r+l*.3),s.closePath();break;case"heli":s.moveTo(o,r),s.lineTo(o+l*.8,r+l*.3),s.lineTo(o+l*.8,r-l*.3),s.lineTo(o,r-l*.2),s.lineTo(o-l*.8,r-l*.1),s.lineTo(o-l*.8,r+l*.1),s.closePath();break;case"gunship":a(s,o-l,r-l*.4,l*2,l*.8,2),s.moveTo(o-l*1.5,r),s.lineTo(o+l*1.5,r),s.lineTo(o+l*1.5,r+l*.15),s.lineTo(o-l*1.5,r+l*.15),s.closePath();break;case"mlrs":a(s,o-l,r-l*.7,l*2,l*1.4,2),s.moveTo(o-l*.6,r-l*.4),s.lineTo(o+l*.6,r-l*.4),s.lineTo(o+l*.4,r-l*1),s.lineTo(o-l*.4,r-l*1),s.closePath();break;case"healer":a(s,o-l,r-l*.7,l*2,l*1.4,2),s.moveTo(o-l*.3,r),s.lineTo(o+l*.3,r),s.moveTo(o,r-l*.3),s.lineTo(o,r+l*.3),s.closePath();break;case"medHeli":s.moveTo(o,r),s.lineTo(o+l*.8,r+l*.3),s.lineTo(o+l*.8,r-l*.3),s.lineTo(o,r-l*.2),s.lineTo(o-l*.8,r-l*.1),s.lineTo(o-l*.8,r+l*.1),s.closePath(),s.moveTo(o-l*.2,r-l*.3),s.lineTo(o+l*.2,r-l*.3),s.moveTo(o,r-l*.5),s.lineTo(o,r-l*.1),s.closePath();break;case"escortJet":s.moveTo(o,r-l*1.1),s.lineTo(o+l*.7,r+l*.2),s.lineTo(o+l*.4,r+l*.2),s.lineTo(o+l*.5,r+l*.6),s.lineTo(o,r+l*.4),s.lineTo(o-l*.5,r+l*.6),s.lineTo(o-l*.4,r+l*.2),s.lineTo(o-l*.7,r+l*.2),s.closePath();break;case"b2":s.moveTo(o,r-l*.4),s.lineTo(o-l*1.3,r+l*.5),s.lineTo(o-l*1.3,r+l*.7),s.lineTo(o+l*1.3,r+l*.7),s.lineTo(o+l*1.3,r+l*.5),s.closePath();break;case"escortBomber":s.moveTo(o,r-l*1.3),s.lineTo(o+l*1,r+l*.3),s.lineTo(o+l*.6,r+l*.3),s.lineTo(o+l*.7,r+l*.8),s.lineTo(o,r+l*.6),s.lineTo(o-l*.7,r+l*.8),s.lineTo(o-l*.6,r+l*.3),s.lineTo(o-l*1,r+l*.3),s.closePath();break;case"minigunnerVehicle":a(s,o-l*1.1,r-l*.7,l*2.2,l*1.4,3),s.moveTo(o+l*.8,r-l*.3),s.lineTo(o+l*1.5,r-l*.5),s.lineTo(o+l*1.5,r+l*.1),s.lineTo(o+l*.8,r+l*.1),s.closePath();break;case"megaMedic":a(s,o-l,r-l*.7,l*2,l*1.4,2),s.moveTo(o-l*.4,r),s.lineTo(o+l*.4,r),s.moveTo(o,r-l*.4),s.lineTo(o,r+l*.4),s.closePath();break;case"minigunner":s.moveTo(o,r-l),s.lineTo(o-l*.6,r+l*.5),s.lineTo(o+l*.6,r+l*.5),s.closePath(),s.moveTo(o+l*.1,r+l*.3),s.lineTo(o+l*.8,r),s.lineTo(o+l*.8,r+l*.5),s.lineTo(o+l*.1,r+l*.5),s.closePath();break}return s.fill(),s.stroke(),n.toDataURL("image/png")}function Ng(i){const t=document.createElement("div");return t.className="unit-tooltip",t.innerHTML=i,document.body.appendChild(t),t}function ja(i,t,e){const n=ni[i],s=Ig(i,n.color),a=document.createElement("button");a.className="unitBtn",a.dataset.unitType=i,a.dataset.hotkey=t,a.innerHTML=`
    <img class="unit-icon" src="${s}" alt="${i}" loading="lazy">
    <div class="unit-info">
      <span class="unit-name">${i.toUpperCase()}</span>
      <span class="unit-domain">${n.domain.toUpperCase()}</span>
    </div>
    <div class="unit-cost">$${n.cost}</div>
    <span class="unit-hotkey">${t}</span>
  `,a.title="",a.addEventListener("click",r=>e.enterPlacementMode(i,r.ctrlKey));let o=null;return a.addEventListener("mouseenter",r=>{o=Ng(`
      <strong>${i.toUpperCase()}</strong> <span class="domain-badge ${n.domain}">${n.domain}</span><br>
      <span class="stat">❤ HP:</span> ${n.hp} | 
      <span class="stat">⚔ DMG:</span> ${n.damage} | 
      <span class="stat">🎯 RNG:</span> ${n.range}<br>
      <span class="stat">⚡ SPD:</span> ${n.speed} | 
      <span class="stat">🔥 FR:</span> ${n.fireRate}s | 
      <span class="stat">% HIT:</span> ${Math.round(n.hitChance*100)}%
    `);const l=a.getBoundingClientRect();o.style.left=l.right+8+"px",o.style.top=l.top+window.scrollY+"px",o.classList.add("visible")}),a.addEventListener("mouseleave",()=>{o&&(o.classList.remove("visible"),setTimeout(()=>o.remove(),150))}),a.addEventListener("mousemove",r=>{o&&(o.style.left=r.clientX+16+"px",o.style.top=r.clientY+16+"px")}),a}function Fg(i,t,e){const n=document.createElement("button");return n.className="unitBtn upgradeBtn",n.dataset.stat=i,e.appendChild(n),n.addEventListener("click",()=>{t.upgrades.upgrade(i)&&ur()}),n}function ur(i,t){for(const e of Object.keys(Pi)){const n=t.querySelector(`[data-stat="${e}"]`),s=i.upgrades.tiers[e];Pi[e].tiers.length-1;const a=i.upgrades.nextCost(e),o=Pi[e].tiers[s];n.innerHTML=`<span>${Pi[e].icon} ${Pi[e].name} T${s} (×${o.toFixed(2)})</span><span>${a===null?"MAX":"$"+a}</span>`,n.disabled=a===null||i.money<a}}function Og(i){const t=document.querySelectorAll(".tab-btn"),e=document.getElementById("armoryContent"),n={land:[],sea:[],air:[]};Object.keys(ni).forEach((E,R)=>{const B=ni[E];n[B.domain].push({key:E,index:R+1})});const a={},o=document.createElement("div");o.className="armory-tab-panel active",o.dataset.tab="land",n.land.forEach(({key:E,index:R})=>{o.appendChild(ja(E,R,i))}),a.land=o;const r=document.createElement("div");r.className="armory-tab-panel",r.dataset.tab="sea",n.sea.forEach(({key:E,index:R})=>{r.appendChild(ja(E,R,i))}),a.sea=r;const l=document.createElement("div");l.className="armory-tab-panel",l.dataset.tab="air",n.air.forEach(({key:E,index:R})=>{l.appendChild(ja(E,R,i))}),a.air=l;const c=document.createElement("div");c.className="armory-tab-panel upgrades",c.dataset.tab="upgrades";for(const[E,R]of Object.entries(Pi))Fg(E,i,c);a.upgrades=c,Object.values(a).forEach(E=>e.appendChild(E)),t.forEach(E=>{E.addEventListener("click",()=>{const R=E.dataset.tab;t.forEach(B=>B.classList.remove("active")),document.querySelectorAll(".armory-tab-panel").forEach(B=>B.classList.remove("active")),E.classList.add("active"),a[R].classList.add("active")})}),setInterval(()=>{const E=i.selectedBuilding;document.querySelectorAll(".unitBtn[data-unit-type]").forEach(R=>{const B=R.dataset.unitType,U=ni[B].cost,H=i.money>=U;let $=!1;if(E){const tt=ni[B].domain;E.faction!=="player"?$=!0:E.isShipyard?$=tt!=="sea"&&tt!=="air":$=tt!=="land"&&tt!=="air"}R.classList.toggle("unaffordable",!H&&!$),R.classList.toggle("context-disabled",$),R.disabled=!H||$}),document.querySelectorAll(".upgradeBtn").forEach(R=>{const B=R.dataset.stat,U=i.upgrades.nextCost(B);R.disabled=U===null||i.money<U})},200),ur(i,c),setInterval(()=>ur(i,c),500);const h=document.getElementById("formationSelect"),u=document.querySelectorAll(".formation-btn");function d(E){i.formation=E,h.value=E,u.forEach(R=>{R.classList.toggle("active",R.dataset.formation===E)})}const f={line:'Line Formation <span style="color:#888;font-size:10px;">(F1)</span><br><span style="color:#aaa;font-size:10px;">Units spread horizontally</span>',wedge:'Wedge Formation <span style="color:#888;font-size:10px;">(F2)</span><br><span style="color:#aaa;font-size:10px;">V-shaped assault formation</span>',square:'Square Formation <span style="color:#888;font-size:10px;">(F3)</span><br><span style="color:#aaa;font-size:10px;">All-around defense</span>',column:'Column Formation <span style="color:#888;font-size:10px;">(F4)</span><br><span style="color:#aaa;font-size:10px;">Single-file movement</span>'};u.forEach(E=>{E.addEventListener("click",()=>d(E.dataset.formation));let R=null;E.addEventListener("mouseenter",B=>{R&&R.remove(),R=document.createElement("div"),R.className="unit-tooltip",R.innerHTML=f[E.dataset.formation]||E.title,document.body.appendChild(R);const U=E.getBoundingClientRect();R.style.left=U.right+8+"px",R.style.top=U.top+window.scrollY+"px",R.classList.add("visible")}),E.addEventListener("mouseleave",()=>{R&&(R.classList.remove("visible"),setTimeout(()=>{R.remove(),R=null},150))}),E.addEventListener("mousemove",B=>{R&&(R.style.left=B.clientX+16+"px",R.style.top=B.clientY+16+"px")})}),h.addEventListener("change",E=>{d(E.target.value)});const g=document.getElementById("topBar"),_=document.createElement("span");_.style.marginLeft="auto",_.innerHTML=`
    <button id="launchBtn" class="topBtn" title="Launch fighters from selected carrier">✈️ Launch</button>
    <button id="focusHqBtn" class="topBtn" title="Center camera on HQ (F)">🏠 HQ</button>
    <button id="helpBtn" class="topBtn" title="Help & Controls (H)">❓</button>
    <div class="top-dropdown" id="menuDropdown">
      <button class="topBtn dropdown-toggle" id="menuToggleBtn" title="More options">☰</button>
      <div class="dropdown-menu hidden" id="dropdownMenu">
        <button id="saveBtn" class="dropdown-item" title="Save game">💾 Save</button>
        <button id="loadBtn" class="dropdown-item" title="Load game">📂 Load</button>
        <button id="soundBtn" class="dropdown-item" title="Toggle sound">🔊 Sound</button>
      </div>
    </div>
  `,g.appendChild(_);const m=document.getElementById("menuToggleBtn"),p=document.getElementById("dropdownMenu");m.addEventListener("click",E=>{E.stopPropagation(),p.classList.toggle("hidden"),m.classList.toggle("active")}),document.addEventListener("click",E=>{E.target.closest(".top-dropdown")||(p.classList.add("hidden"),m.classList.remove("active"))}),document.getElementById("launchBtn").addEventListener("click",()=>{const E=i.selectedUnits.filter(B=>B.canLaunch&&B.alive);if(E.length===0){i.flashMessage("Select a carrier first");return}let R=0;for(const B of E)B.launchFighters()&&R++;R===0&&i.flashMessage("Carriers on cooldown")}),document.getElementById("focusHqBtn").addEventListener("click",()=>{const E=i.bases.find(R=>R.faction==="player");E&&(i.cameraTarget.x=E.mesh.position.x,i.cameraTarget.z=E.mesh.position.z,i.flashMessage("Camera centered on HQ"))}),document.getElementById("selectAllBtn").addEventListener("click",()=>{const E=i.playerUnits.filter(R=>R.alive);if(E.length===0){i.flashMessage("No units to select");return}for(const R of i.selectedUnits)R.setSelected(!1);i.selectedUnits=E;for(const R of i.selectedUnits)R.setSelected(!0);i.flashMessage(`Selected ${E.length} units`)}),document.getElementById("saveBtn").addEventListener("click",()=>{Lg(i)?i.flashMessage("💾 Game saved!"):i.flashMessage("Save failed"),p.classList.add("hidden"),m.classList.remove("active")}),document.getElementById("loadBtn").addEventListener("click",()=>{mc()?location.reload():i.flashMessage("No save found"),p.classList.add("hidden"),m.classList.remove("active")}),document.getElementById("soundBtn").addEventListener("click",E=>{He.enabled=!He.enabled,E.currentTarget.textContent=He.enabled?"🔊 Sound":"🔇 Sound",p.classList.add("hidden"),m.classList.remove("active")}),window.addEventListener("keydown",E=>{if(!(E.target.tagName==="INPUT"||E.target.tagName==="SELECT")){if(E.key==="h"||E.key==="H"){M(!v);return}if(E.key==="Escape"){if(v){M(!1);return}for(const R of i.selectedUnits)R.setSelected(!1);i.selectedUnits=[],i.selectedBuilding=null;return}if(E.key==="a"||E.key==="A"){if(E.ctrlKey||E.metaKey){const R=i.playerUnits.filter(B=>B.alive);if(R.length>0){for(const B of i.selectedUnits)B.setSelected(!1);i.selectedUnits=R;for(const B of i.selectedUnits)B.setSelected(!0);i.flashMessage(`Selected ${R.length} units`)}return}return}if(E.key==="F1"){d("line"),i.flashMessage("Formation: Line");return}if(E.key==="F2"){d("wedge"),i.flashMessage("Formation: Wedge");return}if(E.key==="F3"){d("square"),i.flashMessage("Formation: Square");return}if(E.key==="F4"){d("column"),i.flashMessage("Formation: Column");return}if(E.key==="f"||E.key==="F"){const R=i.bases.find(B=>B.faction==="player");R&&(i.cameraTarget.x=R.mesh.position.x,i.cameraTarget.z=R.mesh.position.z)}}}),y(),document.getElementById("helpBtn").addEventListener("click",()=>{M(!0)});function y(){const E=document.createElement("div");E.id="helpModal",E.className="overlay center hidden",E.innerHTML=`
      <div class="panel help-panel">
        <div class="help-header">
          <h1>CONTROLS & HOW TO PLAY</h1>
          <span class="help-hint">Press <span class="help-key">H</span> or <span class="help-key">Escape</span> to close</span>
          <button id="helpCloseBtn" class="help-close" title="Close (H/Escape)">×</button>
        </div>
        <div class="help-body">
          <nav class="help-nav" role="tablist" aria-label="Help categories">
            <button class="help-nav-btn active" data-tab="controls" role="tab" aria-selected="true">🖱️ Controls</button>
            <button class="help-nav-btn" data-tab="gameplay" role="tab" aria-selected="false">🎮 Gameplay</button>
            <button class="help-nav-btn" data-tab="ui" role="tab" aria-selected="false">📊 UI Guide</button>
            <button class="help-nav-btn" data-tab="quickstart" role="tab" aria-selected="false">🚀 Quick Start</button>
          </nav>
          <div class="help-content">
            <div class="help-panel-content active" id="tab-controls" role="tabpanel">
              <h3>Mouse Controls</h3>
              <div class="help-row"><span class="help-key">LMB Click</span><span>Select unit / Click button</span></div>
              <div class="help-row"><span class="help-key">LMB Drag</span><span>Box select multiple units</span></div>
              <div class="help-row"><span class="help-key">RMB Click</span><span>Move selected units / Attack enemy</span></div>
              <div class="help-row"><span class="help-key">Mouse Wheel</span><span>Zoom camera in/out</span></div>
              <div class="help-row"><span class="help-key">Minimap Click</span><span>Jump camera to location</span></div>
              
              <h3>Keyboard Shortcuts</h3>
              <div class="help-row"><span class="help-key">W / ↑</span><span>Move camera up</span></div>
              <div class="help-row"><span class="help-key">S / ↓</span><span>Move camera down</span></div>
              <div class="help-row"><span class="help-key">A / ←</span><span>Move camera left</span></div>
              <div class="help-row"><span class="help-key">D / →</span><span>Move camera right</span></div>
              <div class="help-row"><span class="help-key">F</span><span>Focus camera on HQ</span></div>
              <div class="help-row"><span class="help-key">Ctrl+A</span><span>Select all player units</span></div>
              <div class="help-row"><span class="help-key">Escape</span><span>Deselect units / Close menus</span></div>
              <div class="help-row"><span class="help-key">H</span><span>Toggle this help menu</span></div>
              <div class="help-row"><span class="help-key">1–9</span><span>Quick-build unit (Armory order)</span></div>
              <div class="help-row"><span class="help-key">F1–F4</span><span>Set formation (Line/Wedge/Square/Column)</span></div>
            </div>
            
            <div class="help-panel-content" id="tab-gameplay" role="tabpanel" hidden>
              <h3>Core Mechanics</h3>
              <div class="help-row"><span class="help-key">Build Units</span><span>Click unit buttons in Armory (bottom-right). Units spawn near your HQ.</span></div>
              <div class="help-row"><span class="help-key">Capture Bases</span><span>Move units to enemy bases (red flags). When HP reaches 0, base switches to your faction.</span></div>
              <div class="help-row"><span class="help-key">Fog of War</span><span>Map is dark until explored. Units and bases reveal area around them.</span></div>
              <div class="help-row"><span class="help-key">Formations</span><span>Select units → choose formation (Line, Wedge, Square, Column) → right-click to move in formation.</span></div>
              <div class="help-row"><span class="help-key">Carrier Launch</span><span>Select carrier → click ✈️ Launch button to deploy fighters (cooldown: 20s).</span></div>
              <div class="help-row"><span class="help-key">Upgrades</span><span>Buy Armor, Firepower, Engines in Armory (gold buttons) to permanently buff all player units.</span></div>
              <div class="help-row"><span class="help-key">Income</span><span>Earn passive income per owned base. Destroy enemy units for bonus cash.</span></div>
            </div>
            
            <div class="help-panel-content" id="tab-ui" role="tabpanel" hidden>
              <h3>UI Elements</h3>
              <div class="help-row"><span class="help-key">Top Bar</span><span>Money ($) • Bases Owned/Total • Unit Count • Difficulty</span></div>
              <div class="help-row"><span class="help-key">Minimap (top-right)</span><span>Blue = your units/bases • Red = known enemies • Gray outline = terrain • White box = camera view</span></div>
              <div class="help-row"><span class="help-key">Selection Panel (bottom-left)</span><span>Shows selected unit portraits, types, count, and combined stats</span></div>
              <div class="help-row"><span class="help-key">Formation Selector</span><span>Integrated in Selection Panel — visual preview of Line/Wedge/Square/Column</span></div>
              <div class="help-row"><span class="help-key">Armory (bottom-right)</span><span>Build units (with hotkeys 1–9) & buy upgrades</span></div>
            </div>
            
            <div class="help-panel-content" id="tab-quickstart" role="tabpanel" hidden>
              <h3>Quick Start</h3>
              <ol class="quickstart-steps">
                <li><span class="step-num">1</span><div><strong>Build an army</strong> — Click <span class="help-key">TANK</span> / <span class="help-key">INFANTRY</span> in Armory (or press <span class="help-key">1</span> / <span class="help-key">2</span>). Costs $.</div></li>
                <li><span class="step-num">2</span><div><strong>Select units</strong> — Click a unit, or drag a box to select multiple. Press <span class="help-key">Ctrl+A</span> for all.</div></li>
                <li><span class="step-num">3</span><div><strong>Move & Attack</strong> — Right-click ground to move, right-click enemy to attack. Use <span class="help-key">F1–F4</span> for formations.</div></li>
                <li><span class="step-num">4</span><div><strong>Capture bases</strong> — Move units onto enemy bases (red flags) to capture them. Earn income per base.</div></li>
                <li><span class="step-num">5</span><div><strong>Win</strong> — Capture all enemy bases. Lose if you lose your HQ.</div></li>
              </ol>
            </div>
          </div>
        </div>
        <div class="help-footer">Press <span class="help-key">H</span> or <span class="help-key">Escape</span> or click outside to close</div>
      </div>
    `,document.body.appendChild(E);const R=E.querySelectorAll(".help-nav-btn"),B=E.querySelectorAll(".help-panel-content");R.forEach(U=>{U.addEventListener("click",()=>{const H=U.dataset.tab;R.forEach(tt=>{tt.classList.remove("active"),tt.setAttribute("aria-selected","false")}),B.forEach(tt=>{tt.classList.remove("active"),tt.hidden=!0}),U.classList.add("active"),U.setAttribute("aria-selected","true");const $=E.querySelector(`#tab-${H}`);$.classList.add("active"),$.hidden=!1})}),E.addEventListener("click",U=>{U.target===E&&M(!1)}),document.getElementById("helpCloseBtn").addEventListener("click",()=>{M(!1)})}let v=!1;function M(E){const R=document.getElementById("helpModal");E?(R.classList.remove("hidden"),v=!0,i.paused=!0):(R.classList.add("hidden"),v=!1,i.paused=!1)}window.addEventListener("keydown",E=>{if(!(E.target.tagName==="INPUT"||E.target.tagName==="SELECT")){if(E.key==="h"||E.key==="H"){M(!v);return}if(E.key==="Escape"){if(v){M(!1);return}for(const R of i.selectedUnits)R.setSelected(!1);i.selectedUnits=[],i.selectedBuilding=null;return}if(E.key==="f"||E.key==="F"){const R=i.bases.find(B=>B.faction==="player");R&&(i.cameraTarget.x=R.mesh.position.x,i.cameraTarget.z=R.mesh.position.z)}else if(E.key==="a"||E.key==="A"){const R=i.playerUnits.filter(B=>B.alive);if(R.length>0){for(const B of i.selectedUnits)B.setSelected(!1);i.selectedUnits=R;for(const B of i.selectedUnits)B.setSelected(!0)}}}}),document.getElementById("restartBtn").addEventListener("click",()=>{Ug(),location.reload()}),I();function I(){localStorage.getItem("tutorialCompleted")!=="true"&&setTimeout(()=>x(1),500)}const C=[{title:"Welcome to Low-Poly Command!",text:'This tutorial will walk you through the basics. Click "Next" to continue or "Skip" to jump straight into the game.',highlight:null,action:null},{title:"Step 1: Build Your Army",text:`Click the <strong>TANK</strong> or <strong>INFANTRY</strong> button in the Armory (bottom-right) to build units. They'll spawn near your HQ. You can also press <span class="help-key">1</span> or <span class="help-key">2</span> as hotkeys.`,highlight:"#buildPanel",action:null},{title:"Step 2: Select Units",text:'Click a unit to select it, or drag a box to select multiple. Press <span class="help-key">Ctrl+A</span> to select all your units. Selected units show a green ring and appear in the Selection panel (bottom-left).',highlight:"#selectionPanel",action:null},{title:"Step 3: Move & Attack",text:'Right-click on the ground to move selected units. Right-click on an enemy to attack. Choose a formation (Line/Wedge/Square/Column) in the Selection panel or press <span class="help-key">F1–F4</span>.',highlight:"#selectionPanel .formation-options",action:null},{title:"Step 4: Capture Bases",text:"Move your units onto enemy bases (red flags). When a base's HP reaches 0, it switches to your faction (blue flag). You earn passive income per owned base. Capture all enemy bases to win!",highlight:null,action:null},{title:"Step 5: Win the Game!",text:`Destroy all enemy bases to achieve victory. If you lose your HQ, it's defeat. Use the Minimap (top-right) to navigate, and press <span class="help-key">H</span> anytime to reopen the Help menu. Good luck, Commander!`,highlight:null,action:"complete"}];let b=null,k=null;function x(E){const R=C[E-1];if(b&&b.remove(),k&&k.remove(),R.highlight){const B=document.querySelector(R.highlight);if(B){k=document.createElement("div"),k.className="tutorial-highlight";const U=B.getBoundingClientRect();k.style.cssText=`
          position: fixed;
          left: ${U.left-4}px;
          top: ${U.top-4}px;
          width: ${U.width+8}px;
          height: ${U.height+8}px;
          border: 3px solid #4af;
          border-radius: 8px;
          box-shadow: 0 0 0 9999px rgba(0,0,0,0.7), 0 0 20px rgba(70,170,255,0.5);
          pointer-events: none;
          z-index: 1000;
          animation: tutorialPulse 1.5s ease-in-out infinite;
        `,document.body.appendChild(k)}}if(b=document.createElement("div"),b.className="tutorial-overlay",b.innerHTML=`
      <div class="tutorial-card">
        <div class="tutorial-header">
          <span class="tutorial-step">${E} / ${C.length}</span>
          <button class="tutorial-skip" title="Skip tutorial">Skip</button>
        </div>
        <h2>${R.title}</h2>
        <p>${R.text}</p>
        <div class="tutorial-footer">
          ${E>1?'<button class="tutorial-btn tutorial-prev">← Back</button>':'<div style="width:80px;"></div>'}
          <div style="flex:1;"></div>
          ${E<C.length?'<button class="tutorial-btn tutorial-next">Next →</button>':'<button class="tutorial-btn tutorial-finish">Start Playing!</button>'}
        </div>
      </div>
    `,document.body.appendChild(b),!document.getElementById("tutorial-style")){const B=document.createElement("style");B.id="tutorial-style",B.textContent=`
        @keyframes tutorialPulse {
          0%, 100% { box-shadow: 0 0 0 9999px rgba(0,0,0,0.7), 0 0 20px rgba(70,170,255,0.5); }
          50% { box-shadow: 0 0 0 9999px rgba(0,0,0,0.7), 0 0 30px rgba(70,170,255,0.9); }
        }
        .tutorial-overlay {
          position: fixed; inset: 0; z-index: 1001;
          display: flex; align-items: center; justify-content: center;
          background: transparent; pointer-events: none;
        }
        .tutorial-card {
          pointer-events: auto;
          background: rgba(20,25,35,0.98);
          border: 2px solid #4af;
          border-radius: 12px;
          padding: 24px;
          max-width: 420px;
          width: 90%;
          box-shadow: 0 0 40px rgba(70,170,255,0.3);
          animation: slideUp 0.3s ease;
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .tutorial-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .tutorial-step { font-size: 12px; color: #888; font-family: monospace; }
        .tutorial-skip {
          background: none; border: 1px solid #444; color: #888;
          padding: 4px 10px; border-radius: 4px; cursor: pointer;
          font-family: inherit; font-size: 11px; transition: all 0.15s;
        }
        .tutorial-skip:hover { border-color: #f66; color: #f66; }
        .tutorial-card h2 { color: #4af; margin-bottom: 12px; font-size: 18px; }
        .tutorial-card p { color: #ddd; line-height: 1.6; font-size: 13px; }
        .tutorial-card p strong { color: #4af; }
        .tutorial-footer { display: flex; align-items: center; gap: 12px; margin-top: 20px; }
        .tutorial-btn {
          background: #1a3a5a; border: 1px solid #4af; color: #4af;
          padding: 8px 20px; border-radius: 6px; cursor: pointer;
          font-family: inherit; font-size: 12px; font-weight: bold;
          transition: all 0.15s;
        }
        .tutorial-btn:hover { background: #235a8a; }
        .tutorial-btn.tutorial-prev { background: #2a2; border-color: #4f4; color: #4f4; }
        .tutorial-btn.tutorial-prev:hover { background: #3b3; }
        .tutorial-btn.tutorial-finish { background: #2a8; border-color: #4c4; color: #fff; }
        .tutorial-btn.tutorial-finish:hover { background: #3b9; }
      `,document.head.appendChild(B)}b.querySelector(".tutorial-next")?.addEventListener("click",()=>{x(E+1)}),b.querySelector(".tutorial-prev")?.addEventListener("click",()=>{x(E-1)}),b.querySelector(".tutorial-finish")?.addEventListener("click",()=>{T()}),b.querySelector(".tutorial-skip")?.addEventListener("click",()=>{T()})}function T(){localStorage.setItem("tutorialCompleted","true"),b&&b.remove(),k&&k.remove(),i.flashMessage("Tutorial complete! Press H for help anytime.")}console.log("✅ UI initialized")}const Vi=new Gm;Vi.background=new kt(8894696);Vi.fog=new Sr(8894696,400,1e3);const Ke=new sn(60,window.innerWidth/window.innerHeight,.1,2500);Ke.position.set(0,150,150);Ke.lookAt(0,0,0);const Wn=new Jl({antialias:!0});Wn.setPixelRatio(Math.min(window.devicePixelRatio,2));Wn.setSize(window.innerWidth,window.innerHeight);Wn.shadowMap.enabled=!0;Wn.shadowMap.type=Sl;document.getElementById("gameCanvas").appendChild(Wn.domElement);const zg=new A0(16777215,.9);Vi.add(zg);const Xn=new E0(16777215,.9);Xn.position.set(300,400,200);Xn.castShadow=!0;Xn.shadow.mapSize.set(2048,2048);Xn.shadow.camera.left=-600;Xn.shadow.camera.right=600;Xn.shadow.camera.top=600;Xn.shadow.camera.bottom=-600;Vi.add(Xn);const ke=new L(-500,0,200),mn={};window.addEventListener("keydown",i=>{mn[i.key.toLowerCase()]=!0,He.resume(),i.key==="Escape"&&Ze&&Ze.placementMode&&Ze.placementMode.active&&Ze.exitPlacementMode(!0)});window.addEventListener("keyup",i=>mn[i.key.toLowerCase()]=!1);function Bg(i){const t=150*i;(mn.w||mn.arrowup)&&(ke.z-=t),(mn.s||mn.arrowdown)&&(ke.z+=t),(mn.a||mn.arrowleft)&&(ke.x-=t),(mn.d||mn.arrowright)&&(ke.x+=t),ke.x=We.clamp(ke.x,-Ws/2,Ws/2),ke.z=We.clamp(ke.z,-Ws/2,Ws/2),Ke.position.x=ke.x,Ke.position.z=ke.z+150,Ke.position.y=150,Ke.lookAt(ke.x,0,ke.z)}window.addEventListener("wheel",i=>{Ke.position.y=We.clamp(Ke.position.y+i.deltaY*.3,60,400)});window.addEventListener("resize",()=>{Ke.aspect=window.innerWidth/window.innerHeight,Ke.updateProjectionMatrix(),Wn.setSize(window.innerWidth,window.innerHeight)});let Ze=null;if(mc()){const i=document.querySelector("#startMenu .panel"),t=document.createElement("button");t.className="btn btn-green",t.style.marginTop="10px",t.textContent="📂 CONTINUE SAVED GAME",t.addEventListener("click",()=>{const e=Dg();e&&(document.getElementById("startMenu").classList.add("hidden"),document.getElementById("hud").classList.remove("hidden"),gc(e.difficulty,e))}),i.appendChild(t)}document.querySelectorAll("#startMenu .btn[data-diff]").forEach(i=>{i.addEventListener("click",()=>{const t=i.dataset.diff;document.getElementById("startMenu").classList.add("hidden"),document.getElementById("hud").classList.remove("hidden"),gc(t,null),He.resume()})});function gc(i,t){try{console.log("[INIT] Starting game with difficulty:",i),Ze=new Ag(Vi,Ke,i,ke),console.log("[INIT] Game instance created"),Ze.init(),console.log("[INIT] game.init() done, playerUnits:",Ze.playerUnits.length),t&&kg(Ze,t),Rg(Ze,Ke,Wn),console.log("[INIT] Input initialized"),Pg(Ze),console.log("[INIT] AI initialized"),Og(Ze),console.log("[INIT] UI initialized — game ready!")}catch(e){console.error("[INIT] CRASH:",e);const n=document.createElement("div");n.style.cssText="position:fixed;top:0;left:0;right:0;background:red;color:white;padding:16px;z-index:99999;font-family:monospace;font-size:16px;white-space:pre-wrap;",n.textContent="GAME CRASH: "+e.message+`
`+e.stack,document.body.appendChild(n)}}function kg(i,t){for(const e of[...i.playerUnits,...i.enemyUnits])i.scene.remove(e.mesh);i.playerUnits=[],i.enemyUnits=[],i.money=t.money,i.formation=t.formation,i.upgrades.deserialize(t.upgrades),document.getElementById("formationSelect").value=t.formation;for(let e=0;e<t.bases.length&&e<i.bases.length;e++){const n=t.bases[e],s=i.bases[e];if(n.faction!==s.faction){s.faction=n.faction;const a=n.faction==="player"?2254506:11154227;s.mesh.children.forEach(o=>{o.userData?.isFlag&&o.material.color.setHex(a)})}s.hp=n.hp}for(const e of t.playerUnits){const n=i.spawn(e.type,"player",e.pos);n.hp=e.hp,n.maxHp=e.maxHp,n.mesh.position.set(e.pos.x,e.pos.y,e.pos.z),n.mesh.rotation.y=e.rotY}for(const e of t.enemyUnits){const n=i.spawn(e.type,"enemy",e.pos);n.hp=e.hp,n.maxHp=e.maxHp,n.mesh.position.set(e.pos.x,e.pos.y,e.pos.z),n.mesh.rotation.y=e.rotY}t.fog&&i.fog&&i.fog.deserialize(t.fog),t.cameraTarget&&(ke.x=t.cameraTarget.x,ke.z=t.cameraTarget.z),i.flashMessage("📂 Game loaded!")}const Hg=new R0;function _c(){requestAnimationFrame(_c);const i=Math.min(Hg.getDelta(),.05);Bg(i),Ze&&Ze.update(i),Wn.render(Vi,Ke)}_c();

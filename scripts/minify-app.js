#!/usr/bin/env node
"use strict";
const fs=require("fs"),path=require("path"),vm=require("vm");
const root=path.resolve(__dirname,"..");
const pkg=JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8"));
const version=pkg.version;
const input=path.join(root,`dist/js/hm-calc-app.v${version}.js`);
const output=path.join(root,`dist/js/hm-calc-app.v${version}.min.js`);
let src=fs.readFileSync(input,"utf8");
// Production build omits the informational console banner.
src=src.replace(/\n\s*try\{console\.info\([\s\S]*?\);\}catch\(_\)\{\}\s*/,'\n');
const rename={APP_VERSION:"V",resolveBasePath:"rb",explicitBase:"B",loadedScripts:"L",originalTitle:"T",originalDescription:"D",bottomNavFrame:"N",LEGACY_RECENT_KEYS:"K",lastSearchEvents:"E",decodeEntities:"de",normalizeSearch:"ns",repairRenderedEntities:"re",categoryCode:"cc",loadScript:"ls",ensurePlatform:"ep",categoryCalcs:"cl",getCategory:"gc",getCalculator:"gx",primaryCategory:"pc",categoryName:"cn",subcategoryName:"sn",routeHref:"rh",currentRoute:"cr",setDocumentMeta:"sm",searchableText:"st",searchEntries:"se",findCalculators:"fc",toolMeta:"tm",trackSearch:"ts",migrateRecentIds:"mr",getRecentIds:"gr",rememberCalculator:"rc",recentCalculators:"rr",calcCard:"ca",compactCard:"cp",categoryAccordion:"ac",suggestionChips:"sg",searchResultsHtml:"sr",bindSearchInput:"bi",bindHome:"bh",renderHome:"ho",bindCategory:"bc",renderCategory:"ct",contentHtml:"ch",relatedCalculators:"rl",mountCalculator:"mc",renderCalculator:"rca",fixedTopOffset:"fo",appTop:"at",jumpToApp:"ja",renderApp:"ra",navigate:"nv",ensureSheet:"es",openSheet:"os",closeSheet:"cs",applySuggestion:"as",bindGlobalControls:"bg",updateBottomNavVisibility:"un",requestBottomNavUpdate:"rn",bindBottomBoundary:"bb",bootRoot:"br"};
function isIdStart(c){return /[A-Za-z_$]/.test(c)}
function isId(c){return /[A-Za-z0-9_$]/.test(c)}
let out="",i=0,lastType="",lastText="";
function needSpace(aType,a,bType,b){if(!a||!b)return false;if((aType==="id"||aType==="num")&&(bType==="id"||bType==="num"))return true;if((a==='+'&&b==='+')||(a==='-'&&b==='-'))return true;return false;}
function emit(type,text){if(needSpace(lastType,lastText,type,text))out+=' ';out+=text;lastType=type;lastText=text;}
while(i<src.length){let c=src[i],n=src[i+1];
 if(/\s/.test(c)){i++;continue;}
 if(c==='/'&&n==='/' ){i+=2;while(i<src.length&&src[i]!='\n')i++;continue;}
 if(c==='/'&&n==='*'){i+=2;while(i<src.length&&!(src[i]==='*'&&src[i+1]==='/'))i++;i+=2;continue;}
 if(c==='"'||c==="'"||c==='`'){let q=c,s=c;i++;while(i<src.length){c=src[i];s+=c;i++;if(c==='\\'&&i<src.length){s+=src[i++];continue;}if(c===q)break;}emit('str',s);continue;}
 if(isIdStart(c)){let j=i+1;while(j<src.length&&isId(src[j]))j++;let x=src.slice(i,j);let prev=out[out.length-1]||'';if(rename[x]&&prev!=='.')x=rename[x];emit('id',x);i=j;continue;}
 if(/[0-9]/.test(c)||(c==='.'&&/[0-9]/.test(n))){let j=i+1;while(j<src.length&&/[0-9A-Fa-fxXbBoOeE._]/.test(src[j]))j++;emit('num',src.slice(i,j));i=j;continue;}
 const three=src.slice(i,i+3),two=src.slice(i,i+2);if(['===','!==','>>>','**=','&&=','||=','??=','...'].includes(three)){emit('op',three);i+=3;continue;}if(['==','!=','<=','>=','++','--','&&','||','=>','+=','-=','*=','/=','%=','<<','>>','**','??','?.'].includes(two)){emit('op',two);i+=2;continue;}emit('op',c);i++;}
function publicApiKeys(code,filename){
 const window={addEventListener(){},setTimeout,clearTimeout,location:{href:"https://example.com/calculator",search:""},history:{pushState(){},replaceState(){}}};
 const document={currentScript:{dataset:{base:""},src:`https://example.com/dist/js/${path.basename(filename)}`},title:"",querySelector(){return null;},readyState:"loading",addEventListener(){}};
 const sandbox={window,document,console:{info(){},error(){}},URL,URLSearchParams,Object,Array,String,Number,Boolean,RegExp,Set,Map,Date,Math,JSON,Promise,Intl,parseFloat,parseInt,isFinite,Infinity,NaN,setTimeout,clearTimeout};
 vm.createContext(sandbox);vm.runInContext(code,sandbox,{filename,timeout:2000});
 if(!window.HM_CALCULATOR_APP)throw new Error(`${filename}: HM_CALCULATOR_APP missing`);
 return Object.keys(window.HM_CALCULATOR_APP).sort();
}
new vm.Script(out,{filename:path.basename(output)});
const sourceApi=publicApiKeys(src,path.basename(input));
const minApi=publicApiKeys(out,path.basename(output));
if(JSON.stringify(sourceApi)!==JSON.stringify(minApi))throw new Error(`Public API mismatch: source=${sourceApi.join(',')} min=${minApi.join(',')}`);
fs.writeFileSync(output,out+'\n');
console.log(JSON.stringify({input:path.relative(root,input),output:path.relative(root,output),sourceBytes:Buffer.byteLength(src),minifiedBytes:Buffer.byteLength(out),ratio:Number((Buffer.byteLength(out)/Buffer.byteLength(src)).toFixed(3)),sourceMap:false,publicApi:sourceApi,publicApiPreserved:true},null,2));

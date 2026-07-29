#!/usr/bin/env node
"use strict";
const fs=require("fs"),path=require("path"),vm=require("vm");
const root=path.resolve(__dirname,"..");
const pkg=JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8"));
const version=pkg.version;
const expected=["openCalculatorById","openSheet","render","routeHref","search","searchDetailed","validate","version"].sort();
function inspect(file){
 const code=fs.readFileSync(path.join(root,file),"utf8");
 const window={addEventListener(){},setTimeout,clearTimeout,location:{href:"https://example.com/calculator",search:""},history:{pushState(){},replaceState(){}}};
 const document={currentScript:{dataset:{base:""},src:`https://example.com/${file}`},title:"",querySelector(){return null;},readyState:"loading",addEventListener(){}};
 const sandbox={window,document,console:{info(){},error(){}},URL,URLSearchParams,Object,Array,String,Number,Boolean,RegExp,Set,Map,Date,Math,JSON,Promise,Intl,parseFloat,parseInt,isFinite,Infinity,NaN,setTimeout,clearTimeout};
 vm.createContext(sandbox);vm.runInContext(code,sandbox,{filename:file,timeout:2000});
 const api=window.HM_CALCULATOR_APP;
 return {file,exists:!!api,keys:api?Object.keys(api).sort():[],types:api?Object.fromEntries(Object.keys(api).sort().map(k=>[k,typeof api[k]])):{},version:api&&api.version};
}
const source=inspect(`dist/js/hm-calc-app.v${version}.js`);
const minified=inspect(`dist/js/hm-calc-app.v${version}.min.js`);
const checks={
 sourceExists:source.exists,
 minifiedExists:minified.exists,
 sourceMatchesExpected:JSON.stringify(source.keys)===JSON.stringify(expected),
 minifiedMatchesExpected:JSON.stringify(minified.keys)===JSON.stringify(expected),
 sourceMinifiedParity:JSON.stringify(source.keys)===JSON.stringify(minified.keys),
 callableSurface:["openCalculatorById","openSheet","render","routeHref","search","searchDetailed","validate"].every(k=>source.types[k]==="function"&&minified.types[k]==="function"),
 versionMatches:source.version===version&&minified.version===version
};
const report={version,expected,source,minified,checks,passed:Object.values(checks).filter(Boolean).length,total:Object.keys(checks).length,ok:Object.values(checks).every(Boolean)};
fs.writeFileSync(path.join(root,`PUBLIC_API_CONTRACT_REPORT_v${version}.json`),JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report,null,2));
process.exitCode=report.ok?0:1;

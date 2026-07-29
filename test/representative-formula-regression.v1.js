#!/usr/bin/env node
"use strict";
const fs=require("fs"),path=require("path"),vm=require("vm");
const root=path.resolve(__dirname,"..");
const registry=JSON.parse(fs.readFileSync(path.join(root,"registry-v6.json"),"utf8"));
const definitions=new Map(),loaded=new Set();
function loadLegacy(legacy){const c=registry.calculators.find(x=>x.legacyId===legacy);if(!c)throw new Error("Missing calculator: "+legacy);const file=path.join(root,"dist/calculators",c.module+".min.js");if(!loaded.has(file)){const sandbox={window:{HM_CALC:{register:(id,def)=>definitions.set(id,def)}},Date,Math,Number,String,Array,Object,JSON,RegExp,Set,Map,Intl,parseFloat,parseInt,isFinite,Infinity,NaN,console};vm.runInNewContext(fs.readFileSync(file,"utf8"),sandbox,{filename:file,timeout:2000});loaded.add(file);}return definitions.get(c.handlerId);}
function near(a,b,t=1e-8){return Number.isFinite(a)&&Math.abs(a-b)<=t*Math.max(1,Math.abs(b));}
const cases=[
 ["D-day",'dday',{today:'2026-07-29',target:'2026-08-08'},r=>r.days===10&&r.label==='D-10'],
 ["만 나이",'age',{birth:'2000-08-01',today:'2026-07-29'},r=>r.age===25],
 ["날짜 차이",'date-diff',{start:'2026-07-01',end:'2026-07-29'},r=>r.days===28],
 ["대출 원리금균등",'loan',{principal:10000000,rate:6,months:12,method:'equal-payment'},r=>near(r.first,860664.297,1e-6)&&near(r.total,10327971.56,1e-6)],
 ["복리",'compound',{principal:1000000,rate:10,years:2,compounds:1},r=>near(r.future||r.amount||r.total||r.value,1210000,1e-9)],
 ["BMI",'bmi',{height:170,weight:65},r=>near(r.bmi,22.49134948,1e-8)],
 ["BMR",'bmr',{sex:'male',age:30,height:175,weight:70},r=>near(r.bmr||r.value,1648.75,1e-8)],
 ["퍼센트",'percent',{a:20,b:200,mode:'part'},r=>near(r.value,10,1e-9)],
 ["평균",'average',{values:'10, 20, 30'},r=>near(r.average||r.value,20,1e-9)],
 ["평↔㎡",'area',{value:1,from:'pyeong',to:'m2'},r=>near(r.value,3.3057851239669422,1e-10)],
 ["온도 변환",'temperature',{value:0,from:'c',to:'f'},r=>near(r.value,32,1e-9)],
 ["급여 세전→세후",'gross-to-net-custom',{gross:3000000,rate:10},r=>near(r.value,2700000,1e-9)]
];
let pass=0;const results=[];for(const [name,id,input,check] of cases){try{const def=loadLegacy(id);if(!def||typeof def.compute!=="function")throw new Error("compute missing");const result=def.compute(input);const ok=!result.error&&check(result);results.push({name,handlerId:id,ok,result});if(ok)pass++;}catch(e){results.push({name,handlerId:id,ok:false,error:e.message});}}
const report={version:registry.version,total:cases.length,passed:pass,failed:cases.length-pass,ok:pass===cases.length,results};fs.writeFileSync(path.join(root,`FORMULA_REGRESSION_REPORT_v${registry.version}.json`),JSON.stringify(report,null,2)+"\n");console.log(JSON.stringify(report,null,2));process.exitCode=report.ok?0:1;

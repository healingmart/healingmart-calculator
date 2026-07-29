#!/usr/bin/env node
"use strict";
const fs=require("fs"),path=require("path"),vm=require("vm"),cp=require("child_process");
const root=path.resolve(__dirname,"..");
const pkg=JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8"));
const registry=JSON.parse(fs.readFileSync(path.join(root,"registry-v6.json"),"utf8"));
const version=pkg.version;
const expectedPublished=registry.calculators.filter(function(item){return item.status==="published"&&item.enabled!==false;});
const expectedPublishedCount=expectedPublished.length;
function loadBase(extra){
  const window=Object.assign({location:{href:"https://www.healing-mart.com/p/calculator.html",search:""},history:{pushState(){},replaceState(){}}},extra||{});
  const ctx={window,console,URL,URLSearchParams,Object,Array,String,Number,RegExp,Set,Map,Date,Math,JSON};
  vm.createContext(ctx);
  for(const file of ["dist/data/hm-calculator-categories.v2.js","dist/data/hm-calculators-data.v2.js","dist/js/hm-calculator-search.v2.js"]){
    vm.runInContext(fs.readFileSync(path.join(root,file),"utf8"),ctx,{filename:file});
  }
  return ctx;
}
const results=[];
function check(name,ok,detail){results.push({name,ok:!!ok,detail:detail||""});if(!ok)process.exitCode=1;}
const ctx=loadBase(),w=ctx.window;
check("calculator_count",w.HM_CALCULATORS.length===expectedPublishedCount,`${w.HM_CALCULATORS.length}/${expectedPublishedCount}`);
check("category_count",w.HM_CALCULATOR_CATEGORIES.length===registry.categories.length,`${w.HM_CALCULATOR_CATEGORIES.length}/${registry.categories.length}`);
check("unique_public_ids",new Set(w.HM_CALCULATORS.map(c=>c.id)).size===expectedPublishedCount);
check("unique_legacy_ids",new Set(w.HM_CALCULATORS.map(c=>c.legacyId)).size===expectedPublishedCount);
check("handler_count",new Set(expectedPublished.map(c=>c.handlerId)).size===expectedPublishedCount,String(expectedPublishedCount));
check("required_metadata",w.HM_CALCULATORS.every(c=>c.id&&c.legacyId&&c.handlerId&&c.name&&c.shortName&&c.category&&c.subcategory&&c.description&&c.route&&c.status&&c.updatedAt&&Number.isFinite(c.order)&&c.aliases.length&&c.keywords.length&&Array.isArray(c.relatedIds)&&typeof c.searchVisible==="boolean"&&typeof c.featured==="boolean"&&typeof c.popular==="boolean"&&(c.addedAt===null||/^\d{4}-\d{2}-\d{2}$/.test(c.addedAt))));
check("no_duplicate_calculator_word_aliases",w.HM_CALCULATORS.every(c=>(c.aliases||[]).every(x=>!/계산기\s*계산기/.test(x))));
check("no_duplicate_calculator_word_keywords",w.HM_CALCULATORS.every(c=>(c.keywords||[]).every(x=>!/계산기\s*계산기/.test(x))));
for(const query of ["디데이","D-day","D데이","기념일"]){
  const first=w.HM_CALCULATOR_SEARCH.search(query,{limit:1})[0];
  check("search_"+query,first&&first.calculator.id==="dday-calculator",first&&first.calculator.id);
}
for(const [query,expected] of [["월급 실수령액","gross-to-net-custom-calculator"],["세후 월급","gross-to-net-custom-calculator"],["평수","area-calculator"],["평 제곱미터","area-calculator"],["평방미터","area-calculator"],["중개수수료","brokerage-custom-calculator"]]){
  const first=w.HM_CALCULATOR_SEARCH.search(query,{limit:1})[0];
  check("search_quality_"+query,first&&first.calculator.id===expected,first&&first.calculator.id);
}
const dateFirst=w.HM_CALCULATOR_SEARCH.search("날짜 차이",{limit:1})[0];
check("search_date_difference",dateFirst&&dateFirst.calculator.id==="date-difference-calculator",dateFirst&&dateFirst.calculator.id);
const gross=w.HM_CALCULATOR_BY_ID["gross-to-net-custom-calculator"];
check("gross_to_net_disclaimer",gross&&/직접 입력/.test(gross.description)&&/자동 산정하지 않습니다/.test(gross.description),gross&&gross.description);
function routeTest(search){
  const c=loadBase({location:{href:"https://www.healing-mart.com/p/calculator.html"+search,search},history:{pushState(){},replaceState(){}}});
  vm.runInContext(fs.readFileSync(path.join(root,"dist/js/hm-calculator-router.v2.js"),"utf8"),c,{filename:"router"});
  return c.window.HM_CALCULATOR_ROUTER.current();
}
let route=routeTest("?tool=dday-calculator");
check("canonical_route",route.view==="calculator"&&route.toolId==="dday-calculator"&&!route.migrated,JSON.stringify(route));
route=routeTest("?calc=dday");
check("legacy_route_migration",route.view==="calculator"&&route.toolId==="dday-calculator"&&route.migrated,JSON.stringify(route));
route=routeTest("?tool=not-existing");
check("invalid_route_fallback",route.view==="home",JSON.stringify(route));
const analyticsSource=fs.readFileSync(path.join(root,"dist/js/hm-calculator-analytics.v2.js"),"utf8");
const appSource=fs.readFileSync(path.join(root,`dist/js/hm-calc-app.v${version}.js`),"utf8");
check("analytics_no_raw_search_query",!analyticsSource.includes("search_query")&&!appSource.includes("search_query"));
const appMin=fs.readFileSync(path.join(root,`dist/js/hm-calc-app.v${version}.min.js`),"utf8");
check("real_minified_build",appMin.length<appSource.length&&appMin!==appSource,appSource.length+" -> "+appMin.length);
const validation=cp.spawnSync(process.execPath,[path.join(root,"scripts/validate-calculators.js")],{encoding:"utf8"});
check("runtime_registry_validation",validation.status===0,validation.status===0?"0 errors":validation.stderr||validation.stdout);
const report={version,expectedPublishedCount,ok:results.every(r=>r.ok),total:results.length,passed:results.filter(r=>r.ok).length,failed:results.filter(r=>!r.ok).length,results};
fs.writeFileSync(path.join(root,`STRUCTURE_TEST_REPORT_v${version}.json`),JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report,null,2));

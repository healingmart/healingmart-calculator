/*
 * HealingMart Calculator Self Test v1.0.1
 * Target: Calculator app v4.2.1 / CSS v4.2.0 / Registry v3.0.0
 *
 * Automates:
 * - GitHub deployment file integrity
 * - Registry 12 categories / 180 calculators
 * - 80 calculator module registration
 * - 460 formula QA cases
 * - Blogger integration/version/TOC/bottom-nav checks
 *
 * This test focuses on programmatic validation. Visual layout still needs PC/mobile smoke checking.
 */
(function (w, d) {
  "use strict";

  var CONFIG = {"selfTestVersion":"1.2.0","target":{"platform":"HealingMart Calculator","appVersion":"4.4.0","cssVersion":"4.2.0","registryVersion":"3.2.0"},"baseUrl":"https://healingmart.github.io/healingmart-calculator","expected":{"categories":12,"calculators":240,"published":240,"modules":90,"qaCases":460,"categoryCounts":{"life":49,"finance":48,"health":11,"date":14,"unit":24,"math":37,"payroll-tax":13,"real-estate":24,"auto":17,"education":12,"food":10,"science":30},"categoryIds":["life","finance","health","date","unit","math","payroll-tax","real-estate","auto","education","food","science"],"calculatorIds":["percent","average","split-bill","unit-price","age","date-diff","dday","bmi","bmr","standard-weight","compound","loan","length","weight","temperature","median","mode","gcd","lcm","prime-check","prime-factorization","fraction","ratio","proportion","power-root","power","factorial","permutation","combination","linear-equation","quadratic-equation","circle","triangle-area","area","volume-unit","speed-unit","pressure-unit","energy-unit","data-size","angle-unit","time-unit","power-unit","force-unit","frequency-unit","torque-unit","date-add","day-of-week","time-diff","time-add","leap-year","days-in-month","iso-week","density","pressure-formula","force-formula","kinetic-energy","potential-energy","power-formula","electrical-power","momentum","wave-speed","cylinder-volume","sphere-volume","cone-volume","work","speed-distance-time","ohms-law","frequency-period","discount-price","price-change-rate","tip","custom-fee-total","savings-progress","target-difference","hourly-cost","daily-budget","annual-subscription","cost-per-use","consumption-cost","simple-interest","roi","cagr","future-value","present-value","annuity-fv","annuity-pv","savings-goal-monthly","effective-annual-rate","profit-margin","markup-rate","break-even","body-surface-area","waist-height-ratio","hourly-to-annual","annual-to-monthly","monthly-to-annual","overtime-custom","commission","bonus-rate","salary-raise","gross-to-net-custom","net-to-gross-custom","custom-tax-amount","price-per-pyeong","price-per-m2","total-from-pyeong","total-from-m2","ltv-simple","dti-simple","rent-income-ratio","deposit-rent-custom","brokerage-custom","trip-fuel-cost","fuel-needed","kmpl-to-l100","l100-to-kmpl","ev-charging-cost","trip-time","average-speed-trip","tire-circumference","fuel-budget-distance","travel-cost-per-person","score-percent","weighted-grade","target-final-score","gpa-simple","gpa-weighted","attendance-rate","required-average","wrong-answer-rate","study-hours-average","rank-percent","recipe-scale","serving-amount","bakers-percentage","dough-hydration","ingredient-ratio","nutrition-per-serving","calorie-density","cooking-loss-rate","cooking-yield","sum-list","range-list","variance-pop","stddev-pop","percent-change","arithmetic-nth","arithmetic-sum","geometric-nth","geometric-sum","slope","midpoint","distance-2d","pythagorean","rectangle","trapezoid-area","polygon-angle-sum","sector-area","acceleration-unit","density-unit","flow-rate-unit","digital-speed-unit","mass-flow-unit","acceleration-formula","centripetal-force","gravitational-force","hooke-force","electrical-energy","resistance-series","resistance-parallel","capacitor-energy","wavelength","pendulum-period","free-fall-distance","projectile-range","torque-formula","day-of-year","quarter-of-year","month-difference","birthday-countdown","average-purchase-price","additional-purchase-average","dividend-yield","annual-dividend","real-return-rate","inflation-purchasing-power","loan-refinance-savings","loan-prepayment-break-even","target-profit-sales","contribution-margin-rate","ad-roas","customer-acquisition-cost","platform-settlement","required-selling-price","inventory-turnover","cash-runway","sales-growth-rate","average-order-value","savings-rate","fixed-cost-ratio","emergency-fund-months","subscription-break-even","commute-monthly-cost","appliance-electricity-cost","car-monthly-cost","ev-vs-ice-cost","fuel-cost-per-100km","rental-yield","vacancy-adjusted-rental-yield","deposit-loan-vs-rent","customer-lifetime-value","customer-churn-rate","monthly-recurring-revenue","annual-recurring-revenue","customer-payback-period","inventory-reorder-point","paint-quantity","wallpaper-rolls","tile-quantity","flooring-packs","concrete-volume","moving-box-volume","waist-hip-ratio","navy-body-fat","lean-body-mass","target-heart-rate-zone","pace-calculator","steps-distance","reading-time","typing-time","download-time","video-file-size","aspect-ratio","resize-dimensions","cash-on-cash-return","debt-service-coverage-ratio","rent-increase","ev-charging-time","tire-size-comparison","vehicle-depreciation"]},"files":{"dist/js/hm-calc-app.v4.4.0.min.js":"b93f149318c254b034fd4ef07ea9ffb86ea342f9ff0855ffde4e53a6619333f5","dist/css/hm-calc.v4.2.css":"de9562b5ec0d450af31f4ac64b3b4fa3821622c0433c4c15d333e2b760237650","dist/data/hm-calc-registry.v1.js":"931ff8e9a17a2460bf73f66b5ad145e4e0c07c1ad7f66da1d76101f903123e66","dist/js/hm-calc-core.v1.min.js":"1e3d508db11c7571d05e43b4a583f0d303c3325f0a0372a3490733b0a57ba0fe","dist/js/hm-calc-sound.v1.min.js":"ec8198c408e95fcc48f3c0fd287f66107466b28d2e4d5d517d03bae09f33ba42","dist/js/hm-calc-share.v1.min.js":"ff6b82eae887ed1d647beec77724a5f18e3668af21ebab93ccf57dcdffc08858","dist/calculators/age.min.js":"1b5a7f2db3f5b54358ae16d8c5be91d0857057083dd67684970c65f770bcbce1","dist/calculators/angle-unit.min.js":"48be56bf9740251724e9766a143c1990ae12013e41bccd30e6e05660f9f7cdc8","dist/calculators/area.min.js":"25cf941b7987fbbe3f533fe074b08f27854eb5610ae30a4331a5aa7763a2c7bb","dist/calculators/auto-cost-pack-v4.min.js":"c87cc8bdf7fd13ce21c543392fa312933f1fe7d5d5058328f5a80e67730b5b31","dist/calculators/auto-pack-v3.min.js":"51f7c649c13fefd13abaaad47e30f7e7858fda77d80ed60d84719b5e6825ec90","dist/calculators/average.min.js":"d1ec5a89e8c57670e8b60eae2c4be16cdc9cb0ad66f2792a6e773defc8b8bf1d","dist/calculators/bmi.min.js":"d9488caed6c6b45a0a43a05a4ebf2554e4fdd1bbe4932532e6b71718f89e0dcb","dist/calculators/bmr.min.js":"f50382a64f9540531d62effb0ccea07826ea6135213bff710d95e505c17df9f5","dist/calculators/business-metrics-pack-v4.min.js":"53a86d8ffe56a368f8814c99dfdb0e312793907c029160b462caea3b95b4016d","dist/calculators/business-retention-pack-v5.min.js":"3e95123bc71af03318db9d8c0f4de3f9f4da7c8b8066c1ac2651517ca0196ac7","dist/calculators/circle.min.js":"92f2bcaa19a96e577c71c0844aa33eced3b481722500ec85b100258729fa1320","dist/calculators/combination.min.js":"b53a1c80a8dccea802aea36ad3ae9cd411b293cf3f8cee1e1a1a9f7eef2c13de","dist/calculators/compound.min.js":"e6246051567ce1cff744107061ce4650267adb9ca0fdddd194c4bb6b060cc33c","dist/calculators/cone-volume.min.js":"59ac56fa91a2907945ed9b0e83dfd332d08900caa9cc71dac69e4f37394a7cf1","dist/calculators/cylinder-volume.min.js":"b2590e1c27f229afa3c27eb779a3a37e9953212fc6d86e7ae361239cb8765d1a","dist/calculators/data-size.min.js":"452391ed14655e1743135d8ded6b656b99bbeb8d60e4e159d526d4a01d73e34a","dist/calculators/date-add.min.js":"f11354a706a94ebce8ac590bfaa0c396a947c4dcd47049c4dce78d414919341a","dist/calculators/date-diff.min.js":"3ff9e5dfd9f5a505d6a13a49d44243c1cc122df26149fd045fba4f9bfb07fead","dist/calculators/date-pack-v3.min.js":"a2c53c27d1d812f751819b1bc162781db29e81b06b800188ba788d25ec9e618c","dist/calculators/day-of-week.min.js":"c3f48f38fdff924a8f589a721cf8054ef07dc1be144ed6409efd880b4f81cfc5","dist/calculators/days-in-month.min.js":"bfb2faa3596136da3d477a3be01785a3eea3dd911476fa64a1208928d0c8139d","dist/calculators/dday.min.js":"b76bd091529da44c90dc17339d9c603b0e7437cc165c7675ec77a60122a28835","dist/calculators/density.min.js":"979292c382d3a2222487b12cc174ee5493d2df369f72e74c6292f8710a0ecccc","dist/calculators/digital-productivity-pack-v5.min.js":"4bf4ed1486f87a18e3f74abf4887b673b0853069a6e4078deea9d3841bc9e51c","dist/calculators/education-pack-v3.min.js":"a1d166f6237b9bb93e7173723a6ea08809781a4fd45498398fd02246ac2ed4eb","dist/calculators/electrical-power.min.js":"196bb8f530a39d918fcefc3680eb87d0239d39c4d42327aa619d22e75ec6587d","dist/calculators/energy-unit.min.js":"5484973544ea1a37d7309248c14c8324271cd25b2c22c501938ebd2c44218368","dist/calculators/factorial.min.js":"3b0a5273e4c5f3d153c2b42d7dfa247f1dc784f8ce912f57b041bc1722cc1d65","dist/calculators/finance-growth-pack-v4.min.js":"1ed26ff064b09fd2790628afdca5a6ee70f04d39e4ddd0e65ecd8574cceff8cd","dist/calculators/finance-pack-v3.min.js":"44200284112abc61c85d7750b75e8e75f19aafa329bd97e0e153006219ebbf9f","dist/calculators/food-pack-v3.min.js":"e467b58d6bb0d535d2dfebbdc5c98bc91b7002608f106d4fd9a60eaadf8bdecb","dist/calculators/force-formula.min.js":"6271ed90f0f0566eb2100630630772cf8eb6e6d4b4ffd08441c33ff1df27ccfb","dist/calculators/force-unit.min.js":"8d3d9e34a80ce910f34da21b65f7071cd5d93a827c0ada97c41b9bcd2845616e","dist/calculators/fraction.min.js":"0146b3bd533a9f23504544959967a4a18c19e29f9fe396f931d90855a7463335","dist/calculators/frequency-period.min.js":"580e234338244727f1d6cbe43bc58906d003f88b624151d157e77600067d54fe","dist/calculators/frequency-unit.min.js":"49ba2ac0ef53347809648cd2de0963cb2bd94f72c4541fc521c69089e3e7cac8","dist/calculators/gcd.min.js":"b166916c01e9b35fae2eacffb6bb5051b68e2f903f87e87a2a32517666018b45","dist/calculators/health-fitness-pack-v5.min.js":"cc5c49addeea1ddecbf18197ea9e6102ade87615d1ec18f64b3c368e7a2d1b22","dist/calculators/health-pack-v3.min.js":"dfa8e680724ba7f546d9e8e6bb4a6b08008d38c2a9a1e286badb6c05cac96df1","dist/calculators/home-project-pack-v5.min.js":"22982a72f3df2e103c4f7c825b01d98ab07bf04da178de8f6eea88218e267477","dist/calculators/household-pack-v4.min.js":"90cc3d419cd4ad01e11176fa550d43ca19c20fd20ea6bfaa3239e3b9b06acefe","dist/calculators/iso-week.min.js":"5507c863f7d78685382981f09d7cb70c4fac94fc86e5938a6b0dc4c9bba271e1","dist/calculators/kinetic-energy.min.js":"065925543c5e34a675fb72cc1de521bc12b3b87bf2e00039511224b8835840c6","dist/calculators/lcm.min.js":"09d8f3598913dcb5aa6836331b5525e7b5130bcfd47dca1d5566975be9d644ae","dist/calculators/leap-year.min.js":"62332c6604158c1f656c1fa85735d62253eccb0e8f171a86757669895e383c6b","dist/calculators/length.min.js":"bbf33456f52b04fd25c1cff5b5e634bf695cd419285bb2c9b5522746e2f9d4d4","dist/calculators/life-pack-v3.min.js":"fa5b8efcb57909a51c92eb8eb8a08248a880d7e3b449d2d8b0fc453140cc5d59","dist/calculators/linear-equation.min.js":"ee207c72c461dbd763f6183e259182e39495f1efddd355cffbbb0cba5df92503","dist/calculators/loan.min.js":"f9163c57430e5dee4d9fb3c0547caed6098ae9acfcfeeefaf1798f859b82ce23","dist/calculators/math-pack-v3.min.js":"6f62d4d001166303a994342246760ac2be8aa88ea95cdeb1079fe576447b0746","dist/calculators/median.min.js":"742bc6ae9fbe95e9d8a09c180943d68f83cd53a0fda5d9dcce0773de342024d4","dist/calculators/mode.min.js":"572d2febd69d7a79c268ae19447082814fb12e23cb9e9dc102b5a836a1e284a5","dist/calculators/momentum.min.js":"62ff6926f8a025f5cf0466512136c5627e033f5364ca42845ef45f2a5aab9c6a","dist/calculators/ohms-law.min.js":"c9840e156c04944d3bf05e41713ded35330f26113a8ab9ad331e89a1f2050cf8","dist/calculators/payroll-pack-v3.min.js":"91ebefe6cc734557ba274ab00ff2334ff06c3fa994a293f727e7d3c582c50432","dist/calculators/percent.min.js":"b7efb31e43c4e8caf0eb01397ccff46b4f02193c2c6a8803dbc2d4e4bf67291e","dist/calculators/permutation.min.js":"b6d5325ba44586af2eaceb7824f5903affba0dd2102afa032cdb43885accb6b8","dist/calculators/potential-energy.min.js":"5e0f67d37ae65c1557db1cf0a8aa56fbf63facddce7b01fa63d093ffeb0ec641","dist/calculators/power.min.js":"45e3f4d2c25b12fd7f6b4d2576e363068f050dd6070c642da69bb3cf3c44b06b","dist/calculators/power-formula.min.js":"22c5b4bd1e9376f0d40413bea849d2f2b44e10552ecd9b5925d29ac390465d01","dist/calculators/power-root.min.js":"ad00793547d85f5965c4e868a52d6562d53175314929bac212cbbf070e144747","dist/calculators/power-unit.min.js":"60463023dac68c5ec2319345d55ad15d670f23385c86212b3960215695d0f921","dist/calculators/pressure-formula.min.js":"c20f12c388f5a2012cbc98663ae11e842992a66037899bdc6ca5ea0aca052808","dist/calculators/pressure-unit.min.js":"fcb350b8a2941a1b0b4c3d1983f4d950d86c3779a7fa52d9f3dd5e2206c5c347","dist/calculators/prime-check.min.js":"6c80dcb1583d0cf133439543ccf87d9825fe03b875b72d2f7626e77c9780c2a4","dist/calculators/prime-factorization.min.js":"bff19c150c336869453571ec6947458bf776e1911f11563931e0dd69a2c9dbcf","dist/calculators/property-auto-pack-v5.min.js":"7880c2318336a73ddccc8c2dfff5fa029ed9e917da65225526421b2bf9ce7534","dist/calculators/proportion.min.js":"d0f923a1a299b6ea9ad7f528bd461ff454d0c19fc0b5a1cb7ea9f99318c7af77","dist/calculators/quadratic-equation.min.js":"e0b01396c2eb5d9c2c25611eab31ba4bfea236f856a673a0126f865763478d17","dist/calculators/ratio.min.js":"3a656666789614578e7779e50bc60e020c53b0579145a1433461286236db742a","dist/calculators/real-estate-pack-v3.min.js":"b12b26da30086a0701f7702e71e0b706b1eeed797df5a1be0fe154e1ecd68a7c","dist/calculators/rental-pack-v4.min.js":"2c43e1a01aa587462d3774f21fb413466a19bf6c3eac575b5f279c72b7e62be5","dist/calculators/science-pack-v3.min.js":"22a5342cf5ef378268bb574b56c54e4981223cfb43414d8b414a182f85dc7ec2","dist/calculators/speed-distance-time.min.js":"84ccbda605fd45c87b04adc2793d2cd8ed4e28d4bc0afc5e97dd2c0d9fe638c7","dist/calculators/speed-unit.min.js":"8d53d66aa6f26c0ba3845b7eb995ddaca5d0aabb7bd531930ac617586722e8c6","dist/calculators/sphere-volume.min.js":"f6dc7c10a409cc199185a9afc7e5b3df2c3993ef6684c82ef87378ea880acfc5","dist/calculators/split-bill.min.js":"7d97cd22d9c48556c85ccf1ea9f604fa4760c315065df2fc5ac230728bdaac09","dist/calculators/standard-weight.min.js":"d1a4b4cfa9593b9cfca62ad9a90821098f269312bc06d3b7bae254180cc3a265","dist/calculators/temperature.min.js":"79f26763fd7aadacfeea832d4981d594e35c20be57633ac12949dd068709420d","dist/calculators/time-add.min.js":"531f70969b1caba7448024793deb8442945612c71eb2ea099fe5a39c433d64f3","dist/calculators/time-diff.min.js":"d9c737dabe4b6776b6aabbdaf3489663b006ebcc6a8db02325105aaa8d06d41b","dist/calculators/time-unit.min.js":"db4e2b612b7728bc4cc7e72adf97a2289473003fb2c158003cc5af32809dd4fe","dist/calculators/torque-unit.min.js":"3feee707bc87f7599b5a39052726b7bf0b86bf782ce686dd2d532203161f84b5","dist/calculators/triangle-area.min.js":"639b386a732aeab68c20e394e247ec6aa0c1c130fde9373696618ef67236513d","dist/calculators/unit-pack-v3.min.js":"571dbe75c44d0d5fe74f68bd961397c102f6bd67148238a56d84002dc2da9cdb","dist/calculators/unit-price.min.js":"b952793b7eda6d9ace89a5d312d6fafb3e3dadb2a5a7aa7cf39bfa468b39ab55","dist/calculators/volume-unit.min.js":"8679d47930bd43cd6725ccc7183b6a4a51f661966100619e6839e7fecb86f37a","dist/calculators/wave-speed.min.js":"2650805b05d3b8054c67fda735a6f342fff609338fe94155344febbd86f4070c","dist/calculators/weight.min.js":"27822ea7cad2b0adf0867bac63cd074173733616b54df06c95f29f3bb55bcb5f","dist/calculators/work.min.js":"6b978189c797a7944a63a9df590954e227688c310cff0f1385d4d8d3ae1a9694"},"modules":["age","angle-unit","area","auto-pack-v3","average","bmi","bmr","circle","combination","compound","cone-volume","cylinder-volume","data-size","date-add","date-diff","date-pack-v3","day-of-week","days-in-month","dday","density","education-pack-v3","electrical-power","energy-unit","factorial","finance-pack-v3","food-pack-v3","force-formula","force-unit","fraction","frequency-period","frequency-unit","gcd","health-pack-v3","iso-week","kinetic-energy","lcm","leap-year","length","life-pack-v3","linear-equation","loan","math-pack-v3","median","mode","momentum","ohms-law","payroll-pack-v3","percent","permutation","potential-energy","power","power-formula","power-root","power-unit","pressure-formula","pressure-unit","prime-check","prime-factorization","proportion","quadratic-equation","ratio","real-estate-pack-v3","science-pack-v3","speed-distance-time","speed-unit","sphere-volume","split-bill","standard-weight","temperature","time-add","time-diff","time-unit","torque-unit","triangle-area","unit-pack-v3","unit-price","volume-unit","wave-speed","weight","work"],"cases":{"percent":[{"input":{"a":20,"b":200,"mode":"part"},"path":"value","expected":10,"tolerance":1e-09}],"average":[{"input":{"values":"10,20,30"},"path":"average","expected":20}],"split-bill":[{"input":{"total":10000,"people":4,"round":100},"path":"rounded","expected":2500}],"unit-price":[{"input":{"p1":1000,"q1":100,"p2":1800,"q2":200},"path":"winner","expected":2}],"age":[{"input":{"birth":"2000-07-20","today":"2026-07-19"},"path":"age","expected":25}],"date-diff":[{"input":{"start":"2026-07-01","end":"2026-07-19"},"path":"days","expected":18}],"dday":[{"input":{"today":"2026-07-19","target":"2026-07-20"},"path":"label","expected":"D-1"}],"bmi":[{"input":{"height":170,"weight":65},"path":"bmi","expected":22.49134948096886,"tolerance":1e-09}],"bmr":[{"input":{"sex":"male","age":30,"height":175,"weight":70},"path":"bmr","expected":1648.75}],"standard-weight":[{"input":{"height":170,"bmi":22},"path":"weight","expected":63.58,"tolerance":1e-09}],"compound":[{"input":{"principal":1000000,"rate":5,"years":1,"compounds":1},"path":"future","expected":1050000,"tolerance":1e-06}],"loan":[{"input":{"principal":12000000,"rate":0,"months":12,"method":"equal-payment"},"path":"first","expected":1000000,"tolerance":1e-06}],"length":[{"input":{"value":1,"from":"m","to":"cm"},"path":"value","expected":100}],"weight":[{"input":{"value":1,"from":"kg","to":"g"},"path":"value","expected":1000}],"temperature":[{"input":{"value":0,"from":"c","to":"f"},"path":"value","expected":32}],"median":[{"input":{"values":"1,3,2"},"path":"median","expected":2},{"input":{"values":"1,2,3,4"},"path":"median","expected":2.5},{"input":{"values":"-5,-1,-3"},"path":"median","expected":-3},{"input":{"values":"1.5 2.5 10"},"path":"median","expected":2.5},{"input":{"values":"7"},"path":"median","expected":7}],"mode":[{"input":{"values":"1,2,2,3"},"path":"modeText","expected":"2"},{"input":{"values":"1,1,2,2,3"},"path":"modeText","expected":"1, 2"},{"input":{"values":"1,2,3"},"path":"modeText","expected":"없음"},{"input":{"values":"-1,-1,2"},"path":"modeText","expected":"-1"},{"input":{"values":"1.5,1.5,2"},"path":"modeText","expected":"1.5"}],"gcd":[{"input":{"a":"48","b":"18"},"path":"value","expected":"6"},{"input":{"a":"-48","b":"18"},"path":"value","expected":"6"},{"input":{"a":"0","b":"5"},"path":"value","expected":"5"},{"input":{"a":"0","b":"0"},"path":"value","expected":"0"},{"input":{"a":"9007199254740993","b":"3"},"path":"value","expected":"3"}],"lcm":[{"input":{"a":"12","b":"18"},"path":"value","expected":"36"},{"input":{"a":"-4","b":"6"},"path":"value","expected":"12"},{"input":{"a":"0","b":"5"},"path":"value","expected":"0"},{"input":{"a":"21","b":"6"},"path":"value","expected":"42"},{"input":{"a":"25","b":"30"},"path":"value","expected":"150"}],"prime-check":[{"input":{"n":"2"},"path":"isPrime","expected":true},{"input":{"n":"1"},"path":"isPrime","expected":false},{"input":{"n":"97"},"path":"isPrime","expected":true},{"input":{"n":"221"},"path":"isPrime","expected":false},{"input":{"n":"2147483647"},"path":"isPrime","expected":true}],"prime-factorization":[{"input":{"n":"360"},"path":"factorText","expected":"2^3 × 3^2 × 5"},{"input":{"n":"97"},"path":"factorText","expected":"97"},{"input":{"n":"1"},"path":"factorText","expected":"1"},{"input":{"n":"1024"},"path":"factorText","expected":"2^10"},{"input":{"n":"84"},"path":"factorText","expected":"2^2 × 3 × 7"}],"fraction":[{"input":{"n1":"1","d1":"2","n2":"1","d2":"3","op":"add"},"path":"fraction","expected":"5/6"},{"input":{"n1":"3","d1":"4","n2":"1","d2":"2","op":"sub"},"path":"fraction","expected":"1/4"},{"input":{"n1":"2","d1":"3","n2":"9","d2":"4","op":"mul"},"path":"fraction","expected":"3/2"},{"input":{"n1":"2","d1":"3","n2":"4","d2":"5","op":"div"},"path":"fraction","expected":"5/6"},{"input":{"n1":"-2","d1":"-4","n2":"0","d2":"7","op":"add"},"path":"fraction","expected":"1/2"}],"ratio":[{"input":{"a":"12","b":"18"},"path":"ratioText","expected":"2:3"},{"input":{"a":"1.5","b":"2.5"},"path":"ratioText","expected":"3:5"},{"input":{"a":"-4","b":"6"},"path":"ratioText","expected":"-2:3"},{"input":{"a":"0","b":"5"},"path":"ratioText","expected":"0:1"},{"input":{"a":"5","b":"0"},"path":"ratioText","expected":"1:0"}],"proportion":[{"input":{"a":"2","b":"3","c":"10"},"path":"fraction","expected":"15"},{"input":{"a":"0.5","b":"1.5","c":"2"},"path":"fraction","expected":"6"},{"input":{"a":"4","b":"10","c":"2"},"path":"fraction","expected":"5"},{"input":{"a":"3","b":"2","c":"7"},"path":"fraction","expected":"14/3"},{"input":{"a":"-2","b":"3","c":"4"},"path":"fraction","expected":"-6"}],"power-root":[{"input":{"value":12,"mode":"square"},"path":"value","expected":144},{"input":{"value":144,"mode":"sqrt"},"path":"value","expected":12},{"input":{"value":2,"mode":"sqrt"},"path":"value","expected":1.4142135623730951,"tolerance":1e-12},{"input":{"value":-3,"mode":"square"},"path":"value","expected":9},{"input":{"value":0,"mode":"sqrt"},"path":"value","expected":0}],"power":[{"input":{"base":2,"exponent":10},"path":"value","expected":1024},{"input":{"base":9,"exponent":0.5},"path":"value","expected":3,"tolerance":1e-12},{"input":{"base":2,"exponent":-3},"path":"value","expected":0.125,"tolerance":1e-12},{"input":{"base":-2,"exponent":3},"path":"value","expected":-8},{"input":{"base":10,"exponent":0},"path":"value","expected":1}],"factorial":[{"input":{"n":"0"},"path":"value","expected":"1"},{"input":{"n":"1"},"path":"value","expected":"1"},{"input":{"n":"5"},"path":"value","expected":"120"},{"input":{"n":"10"},"path":"value","expected":"3628800"},{"input":{"n":"20"},"path":"value","expected":"2432902008176640000"}],"permutation":[{"input":{"n":"5","r":"2"},"path":"value","expected":"20"},{"input":{"n":"10","r":"3"},"path":"value","expected":"720"},{"input":{"n":"7","r":"0"},"path":"value","expected":"1"},{"input":{"n":"5","r":"5"},"path":"value","expected":"120"},{"input":{"n":"20","r":"2"},"path":"value","expected":"380"}],"combination":[{"input":{"n":"5","r":"2"},"path":"value","expected":"10"},{"input":{"n":"10","r":"3"},"path":"value","expected":"120"},{"input":{"n":"7","r":"0"},"path":"value","expected":"1"},{"input":{"n":"5","r":"5"},"path":"value","expected":"1"},{"input":{"n":"52","r":"5"},"path":"value","expected":"2598960"}],"linear-equation":[{"input":{"a":2,"b":-6},"path":"value","expected":3},{"input":{"a":0,"b":5},"path":"type","expected":"none"},{"input":{"a":0,"b":0},"path":"type","expected":"infinite"},{"input":{"a":-4,"b":8},"path":"value","expected":2},{"input":{"a":0.5,"b":1},"path":"value","expected":-2}],"quadratic-equation":[{"input":{"a":1,"b":-5,"c":6},"path":"root1","expected":2,"tolerance":1e-12},{"input":{"a":1,"b":-5,"c":6},"path":"root2","expected":3,"tolerance":1e-12},{"input":{"a":1,"b":2,"c":1},"path":"root1","expected":-1,"tolerance":1e-12},{"input":{"a":1,"b":0,"c":1},"path":"imag","expected":1,"tolerance":1e-12},{"input":{"a":0,"b":2,"c":-4},"path":"x","expected":2,"tolerance":1e-12},{"input":{"a":2,"b":0,"c":-8},"path":"root1","expected":-2,"tolerance":1e-12},{"input":{"a":2,"b":0,"c":-8},"path":"root2","expected":2,"tolerance":1e-12}],"circle":[{"input":{"radius":1},"path":"area","expected":3.141592653589793,"tolerance":1e-12},{"input":{"radius":1},"path":"circumference","expected":6.283185307179586,"tolerance":1e-12},{"input":{"radius":5},"path":"diameter","expected":10},{"input":{"radius":0},"path":"area","expected":0},{"input":{"radius":2.5},"path":"area","expected":19.634954084936208,"tolerance":1e-12}],"triangle-area":[{"input":{"mode":"base-height","base":10,"height":6},"path":"area","expected":30},{"input":{"mode":"base-height","base":0,"height":10},"path":"area","expected":0},{"input":{"mode":"three-sides","a":3,"b":4,"c":5},"path":"area","expected":6,"tolerance":1e-12},{"input":{"mode":"three-sides","a":2,"b":2,"c":2},"path":"area","expected":1.7320508075688772,"tolerance":1e-12},{"input":{"mode":"three-sides","a":5,"b":5,"c":6},"path":"perimeter","expected":16}],"area":[{"input":{"value":1,"from":"m2","to":"pyeong"},"path":"value","expected":0.3025,"tolerance":1e-10},{"input":{"value":10,"from":"pyeong","to":"m2"},"path":"value","expected":33.057851239669425,"tolerance":1e-10}],"volume-unit":[{"input":{"value":1,"from":"l","to":"ml"},"path":"value","expected":1000.0000000000001,"tolerance":1e-10},{"input":{"value":10,"from":"ml","to":"l"},"path":"value","expected":0.009999999999999998,"tolerance":1e-10}],"speed-unit":[{"input":{"value":1,"from":"kmh","to":"mps"},"path":"value","expected":0.2777777777777778,"tolerance":1e-10},{"input":{"value":10,"from":"mps","to":"kmh"},"path":"value","expected":36.0,"tolerance":1e-10}],"pressure-unit":[{"input":{"value":1,"from":"kpa","to":"bar"},"path":"value","expected":0.01,"tolerance":1e-10},{"input":{"value":10,"from":"bar","to":"kpa"},"path":"value","expected":1000.0,"tolerance":1e-10}],"energy-unit":[{"input":{"value":1,"from":"kwh","to":"kj"},"path":"value","expected":3600.0,"tolerance":1e-10},{"input":{"value":10,"from":"kj","to":"kwh"},"path":"value","expected":0.002777777777777778,"tolerance":1e-10}],"data-size":[{"input":{"value":1,"from":"gb","to":"mib"},"path":"value","expected":953.67431640625,"tolerance":1e-10},{"input":{"value":10,"from":"mib","to":"gb"},"path":"value","expected":0.01048576,"tolerance":1e-10}],"angle-unit":[{"input":{"value":1,"from":"deg","to":"rad"},"path":"value","expected":0.017453292519943295,"tolerance":1e-10},{"input":{"value":10,"from":"rad","to":"deg"},"path":"value","expected":572.9577951308232,"tolerance":1e-10}],"time-unit":[{"input":{"value":1,"from":"h","to":"min"},"path":"value","expected":60.0,"tolerance":1e-10},{"input":{"value":10,"from":"min","to":"h"},"path":"value","expected":0.16666666666666666,"tolerance":1e-10}],"power-unit":[{"input":{"value":1,"from":"kw","to":"w"},"path":"value","expected":1000.0,"tolerance":1e-10},{"input":{"value":10,"from":"w","to":"kw"},"path":"value","expected":0.01,"tolerance":1e-10}],"force-unit":[{"input":{"value":1,"from":"n","to":"kgf"},"path":"value","expected":0.10197162129779283,"tolerance":1e-10},{"input":{"value":10,"from":"kgf","to":"n"},"path":"value","expected":98.06649999999999,"tolerance":1e-10}],"frequency-unit":[{"input":{"value":1,"from":"mhz","to":"khz"},"path":"value","expected":1000.0,"tolerance":1e-10},{"input":{"value":10,"from":"khz","to":"mhz"},"path":"value","expected":0.01,"tolerance":1e-10}],"torque-unit":[{"input":{"value":1,"from":"nm","to":"kgfm"},"path":"value","expected":0.10197162129779283,"tolerance":1e-10},{"input":{"value":10,"from":"kgfm","to":"nm"},"path":"value","expected":98.06649999999999,"tolerance":1e-10}],"date-add":[{"input":{"date":"2024-01-31","amount":1,"unit":"month"},"path":"date","expected":"2024-02-29"},{"input":{"date":"2026-07-20","amount":10,"unit":"day"},"path":"date","expected":"2026-07-30"}],"day-of-week":[{"input":{"date":"2026-07-20"},"path":"name","expected":"월요일"},{"input":{"date":"2000-01-01"},"path":"name","expected":"토요일"}],"time-diff":[{"input":{"start":"09:00","end":"18:30","nextDay":false},"path":"minutes","expected":570},{"input":{"start":"23:00","end":"01:00","nextDay":true},"path":"minutes","expected":120}],"time-add":[{"input":{"time":"23:30","minutes":90},"path":"time","expected":"01:00"},{"input":{"time":"00:15","minutes":-30},"path":"dayOffset","expected":-1}],"leap-year":[{"input":{"year":2000},"path":"isLeap","expected":true},{"input":{"year":1900},"path":"isLeap","expected":false},{"input":{"year":2024},"path":"days","expected":366}],"days-in-month":[{"input":{"year":2024,"month":2},"path":"days","expected":29},{"input":{"year":2023,"month":2},"path":"days","expected":28}],"iso-week":[{"input":{"date":"2021-01-01"},"path":"label","expected":"2020년 53주차"},{"input":{"date":"2026-07-20"},"path":"week","expected":30}],"density":[{"input":{"mass":10,"volume":2},"path":"value","expected":5}],"pressure-formula":[{"input":{"force":100,"area":2},"path":"value","expected":50}],"force-formula":[{"input":{"mass":10,"acceleration":2},"path":"value","expected":20}],"kinetic-energy":[{"input":{"mass":2,"velocity":3},"path":"value","expected":9}],"potential-energy":[{"input":{"mass":2,"gravity":9.80665,"height":10},"path":"value","expected":196.133,"tolerance":1e-09}],"power-formula":[{"input":{"work":1000,"time":20},"path":"value","expected":50}],"electrical-power":[{"input":{"voltage":220,"current":2},"path":"value","expected":440}],"momentum":[{"input":{"mass":5,"velocity":3},"path":"value","expected":15}],"wave-speed":[{"input":{"frequency":50,"wavelength":2},"path":"value","expected":100}],"cylinder-volume":[{"input":{"radius":2,"height":3},"path":"value","expected":37.69911184307752,"tolerance":1e-10}],"sphere-volume":[{"input":{"radius":3},"path":"value","expected":113.09733552923255,"tolerance":1e-10}],"cone-volume":[{"input":{"radius":3,"height":4},"path":"value","expected":37.69911184307752,"tolerance":1e-10}],"work":[{"input":{"force":10,"distance":5,"angle":0},"path":"value","expected":50},{"input":{"force":10,"distance":5,"angle":90},"path":"value","expected":0,"tolerance":1e-10}],"speed-distance-time":[{"input":{"speed":"","distance":100,"time":20},"path":"value","expected":5},{"input":{"speed":10,"distance":"","time":3},"path":"value","expected":30}],"ohms-law":[{"input":{"voltage":12,"current":2,"resistance":""},"path":"value","expected":6},{"input":{"voltage":"","current":2,"resistance":6},"path":"value","expected":12}],"frequency-period":[{"input":{"mode":"frequency","value":50},"path":"value","expected":0.02},{"input":{"mode":"period","value":0.5},"path":"value","expected":2}],"discount-price":[{"input":{"price":10000,"rate":20},"path":"value","expected":8000}],"price-change-rate":[{"input":{"old":100,"newv":120},"path":"value","expected":20}],"tip":[{"input":{"amount":50000,"rate":10},"path":"value","expected":5000}],"custom-fee-total":[{"input":{"amount":10000,"rate":3},"path":"value","expected":10300}],"savings-progress":[{"input":{"current":75,"target":100},"path":"value","expected":75}],"target-difference":[{"input":{"current":70,"target":100},"path":"value","expected":30}],"hourly-cost":[{"input":{"cost":120000,"hours":60},"path":"value","expected":2000}],"daily-budget":[{"input":{"budget":300000,"days":30},"path":"value","expected":10000}],"annual-subscription":[{"input":{"monthly":9900},"path":"value","expected":118800}],"cost-per-use":[{"input":{"cost":100000,"uses":50},"path":"value","expected":2000}],"consumption-cost":[{"input":{"quantity":12.5,"unitPrice":200},"path":"value","expected":2500}],"simple-interest":[{"input":{"principal":1000000,"rate":5,"years":2},"path":"value","expected":100000}],"roi":[{"input":{"cost":100,"returnv":120},"path":"value","expected":20}],"cagr":[{"input":{"start":100,"end":121,"years":2},"path":"value","expected":10,"tolerance":1e-09}],"future-value":[{"input":{"pv":100,"rate":10,"periods":2},"path":"value","expected":121,"tolerance":1e-09}],"present-value":[{"input":{"fv":121,"rate":10,"periods":2},"path":"value","expected":100,"tolerance":1e-09}],"annuity-fv":[{"input":{"payment":100,"rate":0,"periods":12},"path":"value","expected":1200}],"annuity-pv":[{"input":{"payment":100,"rate":0,"periods":12},"path":"value","expected":1200}],"savings-goal-monthly":[{"input":{"target":1200,"rate":0,"months":12},"path":"value","expected":100}],"effective-annual-rate":[{"input":{"nominal":12,"m":12},"path":"value","expected":12.682503013196978,"tolerance":1e-09}],"profit-margin":[{"input":{"price":100,"cost":80},"path":"value","expected":20}],"markup-rate":[{"input":{"price":120,"cost":100},"path":"value","expected":20}],"break-even":[{"input":{"fixed":1000,"price":20,"variable":10},"path":"value","expected":100}],"body-surface-area":[{"input":{"height":180,"weight":80},"path":"value","expected":2,"tolerance":1e-12}],"waist-height-ratio":[{"input":{"waist":90,"height":180},"path":"value","expected":50}],"hourly-to-annual":[{"input":{"hourly":10000,"hours":40,"weeks":52},"path":"value","expected":20800000}],"annual-to-monthly":[{"input":{"annual":12000000},"path":"value","expected":1000000}],"monthly-to-annual":[{"input":{"monthly":1000000},"path":"value","expected":12000000}],"overtime-custom":[{"input":{"hourly":10000,"hours":2,"multiplier":1.5},"path":"value","expected":30000}],"commission":[{"input":{"sales":1000000,"rate":5},"path":"value","expected":50000}],"bonus-rate":[{"input":{"salary":3000000,"rate":10},"path":"value","expected":300000}],"salary-raise":[{"input":{"salary":3000000,"rate":5},"path":"value","expected":3150000}],"gross-to-net-custom":[{"input":{"gross":1000000,"rate":10},"path":"value","expected":900000}],"net-to-gross-custom":[{"input":{"net":900000,"rate":10},"path":"value","expected":1000000}],"custom-tax-amount":[{"input":{"base":1000000,"rate":3},"path":"value","expected":30000}],"price-per-pyeong":[{"input":{"price":500000000,"area":25},"path":"value","expected":20000000}],"price-per-m2":[{"input":{"price":100000000,"area":50},"path":"value","expected":2000000}],"total-from-pyeong":[{"input":{"area":25,"unitPrice":20000000},"path":"value","expected":500000000}],"total-from-m2":[{"input":{"area":50,"unitPrice":2000000},"path":"value","expected":100000000}],"ltv-simple":[{"input":{"loan":400000000,"value":500000000},"path":"value","expected":80}],"dti-simple":[{"input":{"debt":1000000,"income":5000000},"path":"value","expected":20}],"rent-income-ratio":[{"input":{"rent":1000000,"income":5000000},"path":"value","expected":20}],"deposit-rent-custom":[{"input":{"deposit":120000000,"rate":5},"path":"value","expected":500000}],"brokerage-custom":[{"input":{"price":100000000,"rate":0.4},"path":"value","expected":400000}],"trip-fuel-cost":[{"input":{"distance":100,"eff":10,"price":1700},"path":"value","expected":17000}],"fuel-needed":[{"input":{"distance":100,"eff":10},"path":"value","expected":10}],"kmpl-to-l100":[{"input":{"kmpl":20},"path":"value","expected":5}],"l100-to-kmpl":[{"input":{"l100":5},"path":"value","expected":20}],"ev-charging-cost":[{"input":{"kwh":50,"price":300},"path":"value","expected":15000}],"trip-time":[{"input":{"distance":120,"speed":60},"path":"value","expected":2}],"average-speed-trip":[{"input":{"distance":120,"hours":2},"path":"value","expected":60}],"tire-circumference":[{"input":{"width":205,"aspect":55,"rim":16},"path":"diameter","expected":631.9,"tolerance":1e-09}],"fuel-budget-distance":[{"input":{"budget":17000,"price":1700,"eff":10},"path":"value","expected":100}],"travel-cost-per-person":[{"input":{"total":100000,"people":4},"path":"value","expected":25000}],"score-percent":[{"input":{"score":80,"max":100},"path":"value","expected":80}],"weighted-grade":[{"input":{"s1":80,"w1":1,"s2":100,"w2":1},"path":"value","expected":90}],"target-final-score":[{"input":{"current":80,"finalWeight":50,"target":90},"path":"value","expected":100}],"gpa-simple":[{"input":{"values":"4,3,5"},"path":"value","expected":4}],"gpa-weighted":[{"input":{"g1":4,"c1":3,"g2":3,"c2":1},"path":"value","expected":3.75}],"attendance-rate":[{"input":{"attended":18,"total":20},"path":"value","expected":90}],"required-average":[{"input":{"target":300,"current":200,"remaining":2},"path":"value","expected":50}],"wrong-answer-rate":[{"input":{"wrong":2,"total":20},"path":"value","expected":10}],"study-hours-average":[{"input":{"hours":14,"days":7},"path":"value","expected":2}],"rank-percent":[{"input":{"rank":10,"total":100},"path":"value","expected":10}],"recipe-scale":[{"input":{"amount":100,"oldServ":2,"newServ":4},"path":"value","expected":200}],"serving-amount":[{"input":{"total":1000,"servings":4},"path":"value","expected":250}],"bakers-percentage":[{"input":{"ingredient":50,"flour":500},"path":"value","expected":10}],"dough-hydration":[{"input":{"water":350,"flour":500},"path":"value","expected":70}],"ingredient-ratio":[{"input":{"a":2,"b":4},"path":"value","expected":0.5}],"nutrition-per-serving":[{"input":{"total":800,"servings":4},"path":"value","expected":200}],"calorie-density":[{"input":{"kcal":500,"weight":250},"path":"value","expected":200}],"cooking-loss-rate":[{"input":{"raw":1000,"cooked":800},"path":"value","expected":20}],"cooking-yield":[{"input":{"raw":1000,"cooked":800},"path":"value","expected":80}],"sum-list":[{"input":{"values":"1,2,3"},"path":"value","expected":6}],"range-list":[{"input":{"values":"1,5,3"},"path":"value","expected":4}],"variance-pop":[{"input":{"values":"1,2,3"},"path":"value","expected":0.6666666666666666,"tolerance":1e-12}],"stddev-pop":[{"input":{"values":"1,2,3"},"path":"value","expected":0.816496580927726,"tolerance":1e-12}],"percent-change":[{"input":{"old":100,"newv":120},"path":"value","expected":20}],"arithmetic-nth":[{"input":{"a1":2,"d":3,"n":4},"path":"value","expected":11}],"arithmetic-sum":[{"input":{"a1":1,"d":1,"n":4},"path":"value","expected":10}],"geometric-nth":[{"input":{"a1":2,"r":3,"n":4},"path":"value","expected":54}],"geometric-sum":[{"input":{"a1":1,"r":2,"n":4},"path":"value","expected":15}],"slope":[{"input":{"x1":0,"y1":0,"x2":2,"y2":4},"path":"value","expected":2}],"midpoint":[{"input":{"x1":0,"y1":0,"x2":2,"y2":4},"path":"value","expected":1},{"input":{"x1":0,"y1":0,"x2":2,"y2":4},"path":"y","expected":2}],"distance-2d":[{"input":{"x1":0,"y1":0,"x2":3,"y2":4},"path":"value","expected":5}],"pythagorean":[{"input":{"a":3,"b":4},"path":"value","expected":5}],"rectangle":[{"input":{"w":3,"h":4},"path":"value","expected":12},{"input":{"w":3,"h":4},"path":"perimeter","expected":14}],"trapezoid-area":[{"input":{"a":2,"b":4,"h":3},"path":"value","expected":9}],"polygon-angle-sum":[{"input":{"n":5},"path":"value","expected":540}],"sector-area":[{"input":{"r":2,"angle":90},"path":"value","expected":3.141592653589793,"tolerance":1e-12}],"acceleration-unit":[{"input":{"value":9.80665,"from":"mps2","to":"g"},"path":"value","expected":1,"tolerance":1e-12}],"density-unit":[{"input":{"value":1000,"from":"kgm3","to":"gcm3"},"path":"value","expected":1}],"flow-rate-unit":[{"input":{"value":60,"from":"lpm","to":"lps"},"path":"value","expected":1}],"digital-speed-unit":[{"input":{"value":8,"from":"mbps","to":"MBs"},"path":"value","expected":1}],"mass-flow-unit":[{"input":{"value":3600,"from":"kgh","to":"kgs"},"path":"value","expected":1}],"acceleration-formula":[{"input":{"vi":0,"vf":10,"t":2},"path":"value","expected":5}],"centripetal-force":[{"input":{"m":2,"v":3,"r":3},"path":"value","expected":6}],"gravitational-force":[{"input":{"m1":1,"m2":1,"r":1},"path":"value","expected":6.6743e-11,"tolerance":1e-20}],"hooke-force":[{"input":{"k":100,"x":0.1},"path":"value","expected":10}],"electrical-energy":[{"input":{"power":100,"time":60},"path":"value","expected":6000}],"resistance-series":[{"input":{"values":"10,20,30"},"path":"value","expected":60}],"resistance-parallel":[{"input":{"values":"10,10"},"path":"value","expected":5}],"capacitor-energy":[{"input":{"c":1,"v":2},"path":"value","expected":2}],"wavelength":[{"input":{"speed":340,"freq":170},"path":"value","expected":2}],"pendulum-period":[{"input":{"length":9.80665,"g":9.80665},"path":"value","expected":6.283185307179586,"tolerance":1e-12}],"free-fall-distance":[{"input":{"t":2,"g":10},"path":"value","expected":20}],"projectile-range":[{"input":{"v":10,"angle":45,"g":10},"path":"value","expected":10,"tolerance":1e-12}],"torque-formula":[{"input":{"r":2,"f":3,"angle":90},"path":"value","expected":6,"tolerance":1e-12}],"day-of-year":[{"input":{"date":"2024-12-31"},"path":"value","expected":366}],"quarter-of-year":[{"input":{"date":"2026-07-20"},"path":"value","expected":3}],"month-difference":[{"input":{"start":"2025-01-01","end":"2026-03-01"},"path":"value","expected":14}],"birthday-countdown":[{"input":{"today":"2026-07-20","birth":"1990-07-25"},"path":"value","expected":5}],"average-purchase-price":[{"input":{"q1":10,"p1":1000,"q2":10,"p2":2000,"q3":0,"p3":0},"path":"avg","expected":1500},{"input":{"q1":5,"p1":1000,"q2":15,"p2":2000,"q3":0,"p3":0},"path":"totalQty","expected":20},{"input":{"q1":5,"p1":1000,"q2":15,"p2":2000,"q3":0,"p3":0},"path":"totalCost","expected":35000}],"additional-purchase-average":[{"input":{"currentQty":10,"currentAvg":1000,"newQty":10,"newPrice":2000},"path":"avg","expected":1500},{"input":{"currentQty":10,"currentAvg":1000,"newQty":10,"newPrice":2000},"path":"totalQty","expected":20},{"input":{"currentQty":10,"currentAvg":1000,"newQty":10,"newPrice":2000},"path":"totalCost","expected":30000}],"dividend-yield":[{"input":{"annualDividend":500,"price":10000},"path":"yield","expected":5},{"input":{"annualDividend":0,"price":10000},"path":"yield","expected":0},{"input":{"annualDividend":1200,"price":30000},"path":"yield","expected":4}],"annual-dividend":[{"input":{"shares":100,"dividendPerPayment":500,"payments":4},"path":"annual","expected":200000},{"input":{"shares":120,"dividendPerPayment":100,"payments":12},"path":"annual","expected":144000},{"input":{"shares":120,"dividendPerPayment":100,"payments":12},"path":"monthly","expected":12000}],"real-return-rate":[{"input":{"nominal":10,"inflation":2},"path":"value","expected":7.843137254901977,"tolerance":1e-12},{"input":{"nominal":0,"inflation":5},"path":"value","expected":-4.761904761904767,"tolerance":1e-12},{"input":{"nominal":5,"inflation":5},"path":"value","expected":0,"tolerance":1e-12}],"inflation-purchasing-power":[{"input":{"amount":1000000,"inflation":10,"years":1},"path":"currentValue","expected":909090.9090909091,"tolerance":1e-09},{"input":{"amount":1000,"inflation":0,"years":10},"path":"requiredFuture","expected":1000},{"input":{"amount":1000,"inflation":5,"years":2},"path":"requiredFuture","expected":1102.5,"tolerance":1e-12}],"loan-refinance-savings":[{"input":{"principal":12000000,"oldRate":6,"newRate":4,"months":12,"costs":0},"path":"paymentDiff","expected":10998.3061383178,"tolerance":1e-06},{"input":{"principal":12000000,"oldRate":6,"newRate":4,"months":12,"costs":0},"path":"grossSavings","expected":131979.67365981266,"tolerance":1e-06},{"input":{"principal":12000000,"oldRate":6,"newRate":4,"months":12,"costs":100000},"path":"netSavings","expected":31979.67365981266,"tolerance":1e-06}],"loan-prepayment-break-even":[{"input":{"principal":12000000,"rate":12,"months":12,"feeRate":1,"fixedCost":0},"path":"fee","expected":120000.0},{"input":{"principal":12000000,"rate":12,"months":12,"feeRate":1,"fixedCost":0},"path":"totalInterest","expected":794225.5696812064,"tolerance":1e-06},{"input":{"principal":12000000,"rate":12,"months":12,"feeRate":1,"fixedCost":0},"path":"breakEvenMonth","expected":1}],"target-profit-sales":[{"input":{"fixedCost":1000,"targetProfit":500,"contributionRate":30},"path":"requiredSales","expected":5000},{"input":{"fixedCost":0,"targetProfit":1000,"contributionRate":20},"path":"requiredSales","expected":5000},{"input":{"fixedCost":1000,"targetProfit":0,"contributionRate":50},"path":"requiredSales","expected":2000}],"contribution-margin-rate":[{"input":{"sales":10000,"variableCost":6000},"path":"amount","expected":4000},{"input":{"sales":10000,"variableCost":6000},"path":"rate","expected":40},{"input":{"sales":5000,"variableCost":0},"path":"rate","expected":100}],"ad-roas":[{"input":{"revenue":500000,"adSpend":100000},"path":"value","expected":500},{"input":{"revenue":500000,"adSpend":100000},"path":"multiple","expected":5},{"input":{"revenue":0,"adSpend":100000},"path":"value","expected":0}],"customer-acquisition-cost":[{"input":{"marketingCost":1000000,"salesCost":500000,"customers":100},"path":"value","expected":15000},{"input":{"marketingCost":1000000,"salesCost":500000,"customers":100},"path":"totalCost","expected":1500000},{"input":{"marketingCost":0,"salesCost":500000,"customers":50},"path":"value","expected":10000}],"platform-settlement":[{"input":{"grossSales":1000000,"platformFee":10,"paymentFee":3,"withholdingRate":3,"otherDeduction":10000},"path":"net","expected":830000},{"input":{"grossSales":1000000,"platformFee":10,"paymentFee":3,"withholdingRate":3,"otherDeduction":10000},"path":"totalFee","expected":170000},{"input":{"grossSales":1000000,"platformFee":10,"paymentFee":3,"withholdingRate":3,"otherDeduction":10000},"path":"rate","expected":16}],"required-selling-price":[{"input":{"unitCost":10000,"fixedPerSale":0,"feeRate":10,"targetMargin":20},"path":"price","expected":14285.714285714286,"tolerance":1e-09},{"input":{"unitCost":10000,"fixedPerSale":0,"feeRate":10,"targetMargin":20},"path":"fee","expected":1428.5714285714287,"tolerance":1e-09},{"input":{"unitCost":10000,"fixedPerSale":0,"feeRate":10,"targetMargin":20},"path":"profit","expected":2857.1428571428573,"tolerance":1e-09}],"inventory-turnover":[{"input":{"cogs":1200,"beginInventory":100,"endInventory":100},"path":"turnover","expected":12},{"input":{"cogs":1200,"beginInventory":100,"endInventory":100},"path":"days","expected":30.416666666666668,"tolerance":1e-12},{"input":{"cogs":1200,"beginInventory":80,"endInventory":120},"path":"averageInventory","expected":100}],"cash-runway":[{"input":{"cash":1000000,"monthlyRevenue":200000,"monthlyExpense":400000},"path":"monthlyBurn","expected":200000},{"input":{"cash":1000000,"monthlyRevenue":200000,"monthlyExpense":400000},"path":"months","expected":5},{"input":{"cash":500000,"monthlyRevenue":0,"monthlyExpense":100000},"path":"months","expected":5}],"sales-growth-rate":[{"input":{"previous":100,"current":120},"path":"rate","expected":20},{"input":{"previous":100,"current":120},"path":"change","expected":20},{"input":{"previous":200,"current":150},"path":"rate","expected":-25}],"average-order-value":[{"input":{"revenue":1000000,"orders":100},"path":"value","expected":10000},{"input":{"revenue":0,"orders":10},"path":"value","expected":0},{"input":{"revenue":99999,"orders":3},"path":"value","expected":33333}],"savings-rate":[{"input":{"income":5000000,"savings":1000000},"path":"rate","expected":20},{"input":{"income":5000000,"savings":1000000},"path":"remaining","expected":4000000},{"input":{"income":1000000,"savings":0},"path":"rate","expected":0}],"fixed-cost-ratio":[{"input":{"income":5000000,"fixedCost":2000000},"path":"rate","expected":40},{"input":{"income":5000000,"fixedCost":2000000},"path":"remaining","expected":3000000},{"input":{"income":1000000,"fixedCost":0},"path":"rate","expected":0}],"emergency-fund-months":[{"input":{"fund":12000000,"monthlyEssential":3000000},"path":"months","expected":4},{"input":{"fund":6000000,"monthlyEssential":2000000},"path":"months","expected":3},{"input":{"fund":0,"monthlyEssential":2000000},"path":"months","expected":0}],"subscription-break-even":[{"input":{"subscriptionFee":9900,"payPerUse":3000},"path":"exact","expected":3.3,"tolerance":1e-12},{"input":{"subscriptionFee":9900,"payPerUse":3000},"path":"uses","expected":4},{"input":{"subscriptionFee":10000,"payPerUse":2500},"path":"uses","expected":4}],"commute-monthly-cost":[{"input":{"roundTripKm":20,"workdays":20,"kmPerLiter":10,"fuelPrice":1700,"dailyExtra":5000},"path":"total","expected":168000},{"input":{"roundTripKm":20,"workdays":20,"kmPerLiter":10,"fuelPrice":1700,"dailyExtra":5000},"path":"liters","expected":40},{"input":{"roundTripKm":20,"workdays":20,"kmPerLiter":10,"fuelPrice":1700,"dailyExtra":5000},"path":"fuelCost","expected":68000}],"appliance-electricity-cost":[{"input":{"watts":1000,"hoursPerDay":2,"days":30,"kwhRate":150},"path":"kwh","expected":60},{"input":{"watts":1000,"hoursPerDay":2,"days":30,"kwhRate":150},"path":"cost","expected":9000},{"input":{"watts":100,"hoursPerDay":10,"days":1,"kwhRate":200},"path":"cost","expected":200}],"car-monthly-cost":[{"input":{"monthlyDistance":1000,"kmPerLiter":10,"fuelPrice":1700,"annualInsurance":1200000,"annualTax":600000,"annualMaintenance":1200000,"monthlyParkingToll":100000,"monthlyLoan":300000},"path":"total","expected":820000},{"input":{"monthlyDistance":1000,"kmPerLiter":10,"fuelPrice":1700,"annualInsurance":1200000,"annualTax":600000,"annualMaintenance":1200000,"monthlyParkingToll":100000,"monthlyLoan":300000},"path":"fuelCost","expected":170000},{"input":{"monthlyDistance":1000,"kmPerLiter":10,"fuelPrice":1700,"annualInsurance":1200000,"annualTax":600000,"annualMaintenance":1200000,"monthlyParkingToll":100000,"monthlyLoan":300000},"path":"fixedMonthly","expected":250000}],"ev-vs-ice-cost":[{"input":{"distance":1000,"evKwhPer100":15,"electricityPrice":300,"iceLiterPer100":8,"fuelPrice":1700,"evFixed":0,"iceFixed":0},"path":"evCost","expected":45000},{"input":{"distance":1000,"evKwhPer100":15,"electricityPrice":300,"iceLiterPer100":8,"fuelPrice":1700,"evFixed":0,"iceFixed":0},"path":"iceCost","expected":136000},{"input":{"distance":1000,"evKwhPer100":15,"electricityPrice":300,"iceLiterPer100":8,"fuelPrice":1700,"evFixed":0,"iceFixed":0},"path":"difference","expected":91000}],"fuel-cost-per-100km":[{"input":{"kmPerLiter":10,"fuelPrice":1700},"path":"liters","expected":10},{"input":{"kmPerLiter":10,"fuelPrice":1700},"path":"cost","expected":17000},{"input":{"kmPerLiter":20,"fuelPrice":1600},"path":"cost","expected":8000}],"rental-yield":[{"input":{"purchasePrice":200000000,"monthlyRent":1000000,"annualOperatingCost":2000000},"path":"grossYield","expected":6},{"input":{"purchasePrice":200000000,"monthlyRent":1000000,"annualOperatingCost":2000000},"path":"netYield","expected":5},{"input":{"purchasePrice":200000000,"monthlyRent":1000000,"annualOperatingCost":2000000},"path":"netIncome","expected":10000000}],"vacancy-adjusted-rental-yield":[{"input":{"purchasePrice":200000000,"monthlyRent":1000000,"occupancyRate":90,"annualOperatingCost":2000000},"path":"effectiveIncome","expected":10800000},{"input":{"purchasePrice":200000000,"monthlyRent":1000000,"occupancyRate":90,"annualOperatingCost":2000000},"path":"netIncome","expected":8800000},{"input":{"purchasePrice":200000000,"monthlyRent":1000000,"occupancyRate":90,"annualOperatingCost":2000000},"path":"netYield","expected":4.4,"tolerance":1e-12}],"deposit-loan-vs-rent":[{"input":{"loanAmount":100000000,"loanRate":4,"monthlyRent":500000,"annualLoanExtra":0,"annualRentExtra":0},"path":"loanAnnual","expected":4000000},{"input":{"loanAmount":100000000,"loanRate":4,"monthlyRent":500000,"annualLoanExtra":0,"annualRentExtra":0},"path":"rentAnnual","expected":6000000},{"input":{"loanAmount":100000000,"loanRate":4,"monthlyRent":500000,"annualLoanExtra":0,"annualRentExtra":0},"path":"difference","expected":2000000}],"customer-lifetime-value":[{"input":{"avgOrder":50000,"purchasesPerYear":4,"grossMargin":40,"years":3,"acquisitionCost":50000},"path":"revenue","expected":600000},{"input":{"avgOrder":50000,"purchasesPerYear":4,"grossMargin":40,"years":3,"acquisitionCost":50000},"path":"grossValue","expected":240000},{"input":{"avgOrder":50000,"purchasesPerYear":4,"grossMargin":40,"years":3,"acquisitionCost":50000},"path":"netValue","expected":190000}],"customer-churn-rate":[{"input":{"startCustomers":1000,"lostCustomers":50},"path":"rate","expected":5},{"input":{"startCustomers":1000,"lostCustomers":50},"path":"remaining","expected":950},{"input":{"startCustomers":100,"lostCustomers":0},"path":"rate","expected":0}],"monthly-recurring-revenue":[{"input":{"customers":100,"arpu":30000},"path":"mrr","expected":3000000},{"input":{"customers":100,"arpu":30000},"path":"arr","expected":36000000},{"input":{"customers":0,"arpu":30000},"path":"mrr","expected":0}],"annual-recurring-revenue":[{"input":{"mrr":1000000},"path":"arr","expected":12000000},{"input":{"mrr":0},"path":"arr","expected":0},{"input":{"mrr":250000},"path":"mrr","expected":250000}],"customer-payback-period":[{"input":{"cac":120000,"monthlyRevenue":50000,"grossMargin":40},"path":"months","expected":6},{"input":{"cac":120000,"monthlyRevenue":50000,"grossMargin":40},"path":"monthlyGrossProfit","expected":20000},{"input":{"cac":0,"monthlyRevenue":50000,"grossMargin":40},"path":"months","expected":0}],"inventory-reorder-point":[{"input":{"dailyDemand":10,"leadTime":7,"safetyStock":20},"path":"point","expected":90},{"input":{"dailyDemand":10,"leadTime":7,"safetyStock":20},"path":"leadDemand","expected":70},{"input":{"dailyDemand":0,"leadTime":7,"safetyStock":20},"path":"point","expected":20}],"paint-quantity":[{"input":{"area":100,"coverage":10,"coats":2,"waste":10,"canSize":4},"path":"liters","expected":22,"tolerance":1e-12},{"input":{"area":100,"coverage":10,"coats":2,"waste":10,"canSize":4},"path":"cans","expected":6},{"input":{"area":0,"coverage":10,"coats":2,"waste":10,"canSize":4},"path":"liters","expected":0}],"wallpaper-rolls":[{"input":{"area":50,"coveragePerRoll":5,"waste":10},"path":"adjustedArea","expected":55.00000000000001,"tolerance":1e-09},{"input":{"area":50,"coveragePerRoll":5,"waste":10},"path":"rolls","expected":12},{"input":{"area":10,"coveragePerRoll":5,"waste":0},"path":"rolls","expected":2}],"tile-quantity":[{"input":{"area":10,"tileWidth":50,"tileHeight":50,"waste":10},"path":"tileArea","expected":0.25},{"input":{"area":10,"tileWidth":50,"tileHeight":50,"waste":10},"path":"rawCount","expected":40},{"input":{"area":10,"tileWidth":50,"tileHeight":50,"waste":10},"path":"count","expected":44}],"flooring-packs":[{"input":{"area":30,"coveragePerPack":2,"waste":8},"path":"adjustedArea","expected":32.4,"tolerance":1e-12},{"input":{"area":30,"coveragePerPack":2,"waste":8},"path":"packs","expected":17},{"input":{"area":4,"coveragePerPack":2,"waste":0},"path":"packs","expected":2}],"concrete-volume":[{"input":{"length":5,"width":4,"thickness":10,"waste":5},"path":"base","expected":2},{"input":{"length":5,"width":4,"thickness":10,"waste":5},"path":"total","expected":2.1,"tolerance":1e-12},{"input":{"length":5,"width":4,"thickness":10,"waste":5},"path":"liters","expected":2100,"tolerance":1e-09}],"moving-box-volume":[{"input":{"length":50,"width":40,"height":30,"quantity":10},"path":"oneLiters","expected":60},{"input":{"length":50,"width":40,"height":30,"quantity":10},"path":"totalLiters","expected":600},{"input":{"length":50,"width":40,"height":30,"quantity":10},"path":"totalM3","expected":0.6}],"waist-hip-ratio":[{"input":{"waist":80,"hip":100},"path":"ratio","expected":0.8},{"input":{"waist":90,"hip":100},"path":"ratio","expected":0.9},{"input":{"waist":75,"hip":90},"path":"ratio","expected":0.8333333333333334,"tolerance":1e-12}],"navy-body-fat":[{"input":{"sex":"male","height":180,"waist":90,"neck":40,"hip":0},"path":"bodyFat","expected":18.367495150229843,"tolerance":1e-10},{"input":{"sex":"female","height":165,"waist":80,"neck":35,"hip":100},"path":"bodyFat","expected":30.914637304782957,"tolerance":1e-10},{"input":{"sex":"male","height":170,"waist":85,"neck":38,"hip":0},"path":"bodyFat","expected":17.796653044631967,"tolerance":1e-10}],"lean-body-mass":[{"input":{"weight":80,"bodyFat":20},"path":"lean","expected":64},{"input":{"weight":80,"bodyFat":20},"path":"fat","expected":16},{"input":{"weight":60,"bodyFat":0},"path":"lean","expected":60}],"target-heart-rate-zone":[{"input":{"age":40,"resting":60,"minIntensity":50,"maxIntensity":70},"path":"max","expected":180},{"input":{"age":40,"resting":60,"minIntensity":50,"maxIntensity":70},"path":"min","expected":120},{"input":{"age":40,"resting":60,"minIntensity":50,"maxIntensity":70},"path":"maxTarget","expected":144}],"pace-calculator":[{"input":{"distance":5,"hours":0,"minutes":25,"seconds":0},"path":"paceSeconds","expected":300},{"input":{"distance":5,"hours":0,"minutes":25,"seconds":0},"path":"speed","expected":12},{"input":{"distance":10,"hours":1,"minutes":0,"seconds":0},"path":"paceMinutes","expected":6}],"steps-distance":[{"input":{"steps":10000,"stride":70},"path":"km","expected":7},{"input":{"steps":10000,"stride":70},"path":"meters","expected":7000},{"input":{"steps":0,"stride":70},"path":"km","expected":0}],"reading-time":[{"input":{"characters":1000,"charsPerMinute":500},"path":"minutes","expected":2},{"input":{"characters":1000,"charsPerMinute":500},"path":"seconds","expected":120},{"input":{"characters":0,"charsPerMinute":500},"path":"minutes","expected":0}],"typing-time":[{"input":{"words":400,"wordsPerMinute":40},"path":"minutes","expected":10},{"input":{"words":400,"wordsPerMinute":40},"path":"seconds","expected":600},{"input":{"words":0,"wordsPerMinute":40},"path":"minutes","expected":0}],"download-time":[{"input":{"fileSize":900,"speed":100,"efficiency":90},"path":"seconds","expected":80},{"input":{"fileSize":900,"speed":100,"efficiency":90},"path":"minutes","expected":1.3333333333333333,"tolerance":1e-12},{"input":{"fileSize":0,"speed":100,"efficiency":90},"path":"seconds","expected":0}],"video-file-size":[{"input":{"videoBitrate":8,"audioBitrate":128,"duration":10},"path":"totalBitrate","expected":8.128},{"input":{"videoBitrate":8,"audioBitrate":128,"duration":10},"path":"mb","expected":609.6,"tolerance":1e-09},{"input":{"videoBitrate":8,"audioBitrate":128,"duration":10},"path":"gb","expected":0.6096,"tolerance":1e-12}],"aspect-ratio":[{"input":{"width":1920,"height":1080},"path":"rw","expected":16},{"input":{"width":1920,"height":1080},"path":"rh","expected":9},{"input":{"width":1000,"height":1000},"path":"decimal","expected":1}],"resize-dimensions":[{"input":{"originalWidth":1920,"originalHeight":1080,"mode":"width","target":1280},"path":"width","expected":1280},{"input":{"originalWidth":1920,"originalHeight":1080,"mode":"width","target":1280},"path":"height","expected":720},{"input":{"originalWidth":1920,"originalHeight":1080,"mode":"height","target":540},"path":"width","expected":960}],"cash-on-cash-return":[{"input":{"annualCashFlow":12000000,"cashInvested":200000000},"path":"rate","expected":6},{"input":{"annualCashFlow":12000000,"cashInvested":200000000},"path":"monthly","expected":1000000},{"input":{"annualCashFlow":0,"cashInvested":200000000},"path":"rate","expected":0}],"debt-service-coverage-ratio":[{"input":{"noi":15000000,"debtService":10000000},"path":"ratio","expected":1.5},{"input":{"noi":15000000,"debtService":10000000},"path":"margin","expected":5000000},{"input":{"noi":10000000,"debtService":10000000},"path":"ratio","expected":1}],"rent-increase":[{"input":{"currentRent":1000000,"increaseRate":5},"path":"newRent","expected":1050000},{"input":{"currentRent":1000000,"increaseRate":5},"path":"monthlyIncrease","expected":50000},{"input":{"currentRent":1000000,"increaseRate":5},"path":"annualIncrease","expected":600000}],"ev-charging-time":[{"input":{"capacity":60,"start":20,"target":80,"charger":7,"efficiency":90},"path":"energy","expected":36.00000000000001,"tolerance":1e-09},{"input":{"capacity":60,"start":20,"target":80,"charger":7,"efficiency":90},"path":"hours","expected":5.714285714285714,"tolerance":1e-12},{"input":{"capacity":60,"start":20,"target":80,"charger":7,"efficiency":90},"path":"minutes","expected":342.8571428571429,"tolerance":1e-09}],"tire-size-comparison":[{"input":{"oldWidth":205,"oldAspect":55,"oldRim":16,"newWidth":225,"newAspect":45,"newRim":17,"shownSpeed":100},"path":"oldDiameter","expected":631.9,"tolerance":1e-12},{"input":{"oldWidth":205,"oldAspect":55,"oldRim":16,"newWidth":225,"newAspect":45,"newRim":17,"shownSpeed":100},"path":"difference","expected":0.37980693147649586,"tolerance":1e-12},{"input":{"oldWidth":205,"oldAspect":55,"oldRim":16,"newWidth":225,"newAspect":45,"newRim":17,"shownSpeed":100},"path":"actualSpeed","expected":100.3798069314765,"tolerance":1e-12}],"vehicle-depreciation":[{"input":{"purchasePrice":50000000,"annualRate":10,"years":3},"path":"value","expected":36450000,"tolerance":1e-09},{"input":{"purchasePrice":50000000,"annualRate":10,"years":3},"path":"loss","expected":13550000,"tolerance":1e-09},{"input":{"purchasePrice":50000000,"annualRate":10,"years":3},"path":"retention","expected":72.9,"tolerance":1e-12}]},"blogger":{"appId":"healingMartCalculatorApp","expectedDataToolVersion":"4.4.0","expectedToolInfoVersion":"4.4.0","appSrcFragment":"hm-calc-app.v4.4.0.min.js?v=4.4.0","cssHrefFragment":"hm-calc.v4.2.css?v=4.2.0","representativeImageFragment":"ChatGPT%20Image%202026","adsenseClient":"ca-pub-8341470683891223","adsenseSlot":"5437512125","bottomBoundarySelector":"[data-hm-calc-bottom-boundary]","bottomNavSelector":".hm-calc-bottom-nav","bottomNavItems":["home","search","recent","categories"],"tocSelectors":["#toc",".toc","#auto-toc",".auto-toc",".post-toc",".toc-container",".table-of-contents","#toc-container","#toc_container",".tocify-wrap",".tocify-inner",".tocify-title"],"tocSourceMarkers":["body:has(#healingMartCalculatorApp) .tocify-wrap","body:has(#healingMartCalculatorApp) .tocify-inner","body:has(#healingMartCalculatorApp) .tocify-title"]}};
  var API = "HMCalculatorSelfTest";

  if (w[API] && w[API].version === CONFIG.selfTestVersion && typeof w[API].run === "function") {
    w[API].run();
    return;
  }

  var state = {
    results: [],
    running: false,
    fetched: Object.create(null),
    panel: null,
    shadow: null,
    list: null,
    summary: null,
    progressBar: null,
    progressLabel: null,
    startedAt: 0,
    finishedAt: 0
  };

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function add(section, name, status, detail, data) {
    state.results.push({
      section: section,
      name: name,
      status: status,
      detail: String(detail || ""),
      data: data || null,
      time: new Date().toISOString()
    });
    render();
  }

  function pass(s,n,d,x){ add(s,n,"PASS",d,x); }
  function fail(s,n,d,x){ add(s,n,"FAIL",d,x); }
  function warn(s,n,d,x){ add(s,n,"WARN",d,x); }
  function info(s,n,d,x){ add(s,n,"INFO",d,x); }

  function count() {
    var out = {PASS:0,FAIL:0,WARN:0,INFO:0};
    state.results.forEach(function (r) {
      out[r.status] = (out[r.status] || 0) + 1;
    });
    return out;
  }

  function setProgress(value, label) {
    value = Math.max(0, Math.min(1, Number(value) || 0));
    if (state.progressBar) state.progressBar.style.width = Math.round(value * 100) + "%";
    if (state.progressLabel) state.progressLabel.textContent = label || "";
  }

  function joinUrl(base, path) {
    return String(base).replace(/\/+$/,"") + "/" + String(path).replace(/^\/+/,"");
  }

  function timeout(promise, ms, label) {
    var id;
    return Promise.race([
      promise,
      new Promise(function (_, reject) {
        id = setTimeout(function () {
          reject(new Error((label || "작업") + " 시간 초과"));
        }, ms);
      })
    ]).finally(function () { clearTimeout(id); });
  }

  async function fetchBuffer(path) {
    if (state.fetched[path]) return state.fetched[path];
    var url = joinUrl(CONFIG.baseUrl, path) + "?hm-calc-test=" + Date.now();
    var res = await timeout(fetch(url, {cache:"no-store", mode:"cors"}), 15000, path);
    if (!res.ok) throw new Error("HTTP " + res.status + " " + res.statusText);
    var buffer = await res.arrayBuffer();
    var item = {
      url:url,
      buffer:buffer,
      size:buffer.byteLength,
      type:res.headers.get("content-type") || ""
    };
    state.fetched[path] = item;
    return item;
  }

  async function sha256(buffer) {
    if (!(w.crypto && w.crypto.subtle)) throw new Error("Web Crypto API 미지원");
    var dig = await w.crypto.subtle.digest("SHA-256", buffer);
    return Array.from(new Uint8Array(dig)).map(function (b) {
      return b.toString(16).padStart(2,"0");
    }).join("");
  }

  function utf8(buffer) {
    return new TextDecoder("utf-8").decode(buffer);
  }

  function compile(source) {
    try {
      new Function(source);
      return {ok:true, detail:"JavaScript parser PASS"};
    } catch (e) {
      if (/unsafe-eval|content security policy|csp/i.test(String(e && e.message || e))) {
        return {ok:null, detail:"CSP가 new Function 검사를 차단함"};
      }
      return {ok:false, detail:String(e && e.message || e)};
    }
  }

  function parseRegistrySource(source) {
    var ctx = { window:{} };
    // The registry is a plain IIFE assignment. Use a tiny sandbox iframe instead of eval in the page.
    return new Promise(function (resolve, reject) {
      var frame = d.createElement("iframe");
      frame.style.display = "none";
      d.body.appendChild(frame);
      try {
        var doc = frame.contentDocument;
        var script = doc.createElement("script");
        script.textContent = source;
        doc.head.appendChild(script);
        var data = frame.contentWindow.HM_CALC_INDEX;
        if (!data) throw new Error("HM_CALC_INDEX 등록 실패");
        resolve(JSON.parse(JSON.stringify(data)));
      } catch (e) {
        reject(e);
      } finally {
        frame.remove();
      }
    });
  }

  async function testCoreFiles() {
    var section = "배포 핵심 파일";
    var paths = Object.keys(CONFIG.files).filter(function (p) {
      return p.indexOf("/calculators/") < 0;
    });

    for (var i=0;i<paths.length;i++) {
      var path = paths[i];
      setProgress(0.05 + (i/paths.length)*0.12, "핵심 파일 · " + path.split("/").pop());
      try {
        var item = await fetchBuffer(path);
        pass(section, path + " HTTP", item.size.toLocaleString() + " bytes · " + (item.type || "content-type 없음"));

        try {
          var h = await sha256(item.buffer);
          if (h === CONFIG.files[path]) pass(section, path + " SHA-256", "검증 기준 파일과 정확히 일치");
          else fail(section, path + " SHA-256", "expected " + CONFIG.files[path] + " / actual " + h);
        } catch (hashErr) {
          warn(section, path + " SHA-256", hashErr.message || hashErr);
        }

        if (/\.js$/i.test(path)) {
          var c = compile(utf8(item.buffer));
          if (c.ok === true) pass(section, path + " syntax", c.detail);
          else if (c.ok === null) warn(section, path + " syntax", c.detail);
          else fail(section, path + " syntax", c.detail);
        }
      } catch (e) {
        fail(section, path + " HTTP", e.message || e);
      }
    }
  }

  async function testRegistry() {
    var section = "Registry";
    setProgress(0.18, "Registry 검사");

    var item;
    var reg;
    try {
      item = await fetchBuffer("dist/data/hm-calc-registry.v1.js");
      reg = await parseRegistrySource(utf8(item.buffer));
      pass(section, "Registry 파싱", "version " + reg.version);
    } catch (e) {
      fail(section, "Registry 파싱", e.message || e);
      return null;
    }

    reg.version === CONFIG.target.registryVersion
      ? pass(section, "Registry version", reg.version)
      : fail(section, "Registry version", "expected " + CONFIG.target.registryVersion + " / actual " + reg.version);

    var cats = Array.isArray(reg.categories) ? reg.categories : [];
    var calcs = Array.isArray(reg.calculators) ? reg.calculators : [];
    var published = calcs.filter(function (x) { return x.published === true && x.enabled !== false; });

    cats.length === CONFIG.expected.categories
      ? pass(section, "카테고리 수", cats.length + "개")
      : fail(section, "카테고리 수", "expected " + CONFIG.expected.categories + " / actual " + cats.length);

    calcs.length === CONFIG.expected.calculators
      ? pass(section, "전체 계산기 수", calcs.length + "개")
      : fail(section, "전체 계산기 수", "expected " + CONFIG.expected.calculators + " / actual " + calcs.length);

    published.length === CONFIG.expected.published
      ? pass(section, "공개 계산기 수", published.length + "개")
      : fail(section, "공개 계산기 수", "expected " + CONFIG.expected.published + " / actual " + published.length);

    var catIds = cats.map(function (x) { return x.id; });
    var dupCat = catIds.filter(function (id, idx) { return catIds.indexOf(id) !== idx; });
    dupCat.length ? fail(section, "중복 카테고리 ID", Array.from(new Set(dupCat)).join(", ")) : pass(section, "중복 카테고리 ID", "없음");

    var calcIds = calcs.map(function (x) { return x.id; });
    var dupCalc = calcIds.filter(function (id, idx) { return calcIds.indexOf(id) !== idx; });
    dupCalc.length ? fail(section, "중복 계산기 ID", Array.from(new Set(dupCalc)).join(", ")) : pass(section, "중복 계산기 ID", "없음");

    var catSet = new Set(catIds);
    var badCats = [];
    calcs.forEach(function (x) {
      (x.categories || []).forEach(function (cid) {
        if (!catSet.has(cid)) badCats.push(x.id + " -> " + cid);
      });
      if (!catSet.has(x.primaryCategory)) badCats.push(x.id + " primary -> " + x.primaryCategory);
    });
    badCats.length ? fail(section, "카테고리 참조", badCats.slice(0,30).join(", ")) : pass(section, "카테고리 참조", "모두 정상");

    var nonActiveCats = cats.filter(function (x) { return x.status !== "active"; });
    nonActiveCats.length ? fail(section, "카테고리 active", nonActiveCats.map(function(x){return x.id;}).join(", ")) : pass(section, "카테고리 active", "12개 모두 active");

    Object.keys(CONFIG.expected.categoryCounts).forEach(function (cid) {
      var expected = CONFIG.expected.categoryCounts[cid];
      var actual = published.filter(function (x) {
        return (x.categories || []).indexOf(cid) >= 0;
      }).length;
      actual === expected
        ? pass(section, "카테고리 " + cid, actual + "개")
        : fail(section, "카테고리 " + cid, "expected " + expected + " / actual " + actual);
    });

    var modules = Array.from(new Set(published.map(function (x) { return x.module || x.id; }))).sort();
    modules.length === CONFIG.expected.modules
      ? pass(section, "고유 모듈 수", modules.length + "개")
      : fail(section, "고유 모듈 수", "expected " + CONFIG.expected.modules + " / actual " + modules.length);

    return reg;
  }

  async function testModulesAndFormulas(registry) {
    var section = "계산 모듈 / 공식 QA";
    if (!registry) {
      fail(section, "실행 중단", "Registry가 없어서 모듈 테스트를 진행할 수 없습니다.");
      return;
    }

    var frame = d.createElement("iframe");
    frame.style.position = "fixed";
    frame.style.left = "-10000px";
    frame.style.width = "1px";
    frame.style.height = "1px";
    frame.style.border = "0";
    d.body.appendChild(frame);

    var cw = frame.contentWindow;
    var defs = Object.create(null);
    cw.HM_CALC = {
      register: function (id, def) { defs[id] = def; }
    };

    try {
      for (var i=0;i<CONFIG.modules.length;i++) {
        var moduleName = CONFIG.modules[i];
        var path = "dist/calculators/" + moduleName + ".min.js";
        setProgress(0.24 + (i/CONFIG.modules.length)*0.42, "모듈 " + (i+1) + "/" + CONFIG.modules.length + " · " + moduleName);

        try {
          var item = await fetchBuffer(path);
          var h = await sha256(item.buffer);
          if (h === CONFIG.files[path]) pass(section, moduleName + " hash", "SHA-256 일치");
          else fail(section, moduleName + " hash", "파일이 검증 기준과 다릅니다.");

          var source = utf8(item.buffer);
          var script = frame.contentDocument.createElement("script");
          script.textContent = source;
          frame.contentDocument.head.appendChild(script);
          pass(section, moduleName + " load", "모듈 실행/등록 완료");
        } catch (e) {
          fail(section, moduleName + " load", e.message || e);
        }
      }

      var allIds = registry.calculators.map(function (x) { return x.id; });
      var missingDefs = allIds.filter(function (id) { return !defs[id]; });
      missingDefs.length
        ? fail(section, "180개 register", "누락: " + missingDefs.slice(0,40).join(", ") + (missingDefs.length>40 ? " 외 " + (missingDefs.length-40) + "개" : ""))
        : pass(section, "180개 register", "모든 계산기 정의 등록 확인");

      var qaTotal = 0;
      var qaFail = [];

      registry.calculators.forEach(function (calc) {
        var def = defs[calc.id];
        var rows = CONFIG.cases[calc.id] || [];
        rows.forEach(function (tc, idx) {
          qaTotal += 1;

          if (!def || typeof def.compute !== "function") {
            qaFail.push(calc.id + " #" + (idx+1) + " compute 없음");
            return;
          }

          var out;
          try {
            out = def.compute(tc.input);
          } catch (e) {
            qaFail.push(calc.id + " #" + (idx+1) + " 예외: " + (e.message || e));
            return;
          }

          var actual = out && out[tc.path];
          if (typeof tc.expected === "number") {
            var tol = tc.tolerance == null ? 1e-9 : tc.tolerance;
            if (!Number.isFinite(actual) || Math.abs(actual - tc.expected) > tol) {
              qaFail.push(calc.id + " #" + (idx+1) + " " + String(actual) + " != " + String(tc.expected));
            }
          } else if (actual !== tc.expected) {
            qaFail.push(calc.id + " #" + (idx+1) + " " + String(actual) + " != " + String(tc.expected));
          }
        });
      });

      qaTotal === CONFIG.expected.qaCases
        ? pass(section, "QA 케이스 수", qaTotal + "개")
        : fail(section, "QA 케이스 수", "expected " + CONFIG.expected.qaCases + " / actual " + qaTotal);

      qaFail.length
        ? fail(section, "공식 QA", qaFail.slice(0,50).join(" | ") + (qaFail.length>50 ? " 외 " + (qaFail.length-50) + "건" : ""))
        : pass(section, "공식 QA", qaTotal + "개 전부 PASS");
    } finally {
      frame.remove();
    }
  }

  async function getRawPageHtml() {
    var url = location.href.split("#")[0];
    var res = await timeout(
      fetch(url + (url.indexOf("?") >= 0 ? "&" : "?") + "hm-calc-source-test=" + Date.now(), {
        cache:"no-store",
        credentials:"same-origin"
      }),
      15000,
      "Blogger 원본 HTML"
    );
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.text();
  }

  async function testBlogger() {
    var section = "Blogger 통합";
    setProgress(0.72, "Blogger 통합 검사");

    var app = d.getElementById(CONFIG.blogger.appId);
    if (!app) {
      fail(section, "Calculator App", "#" + CONFIG.blogger.appId + " 없음");
      return;
    }
    pass(section, "Calculator App", "#" + CONFIG.blogger.appId + " 존재");

    var v = app.getAttribute("data-tool-version") || "";
    v === CONFIG.blogger.expectedDataToolVersion
      ? pass(section, "data-tool-version", v)
      : fail(section, "data-tool-version", "expected " + CONFIG.blogger.expectedDataToolVersion + " / actual " + (v || "없음"));

    app.dataset.hmCalcAppMounted === "true"
      ? pass(section, "App mounted", "data-hm-calc-app-mounted=true")
      : fail(section, "App mounted", "계산기 앱이 마운트되지 않았습니다.");

    w.HM_CALC_APP_V4 && typeof w.HM_CALC_APP_V4.render === "function"
      ? pass(section, "HM_CALC_APP_V4", "render/search/route API 확인")
      : fail(section, "HM_CALC_APP_V4", "런타임 API를 찾지 못했습니다.");

    d.querySelector(".hm-c4-load-error,.hm-calc-error")
      ? fail(section, "런타임 오류 UI", "계산기 로드 오류 표시가 화면에 존재합니다.")
      : pass(section, "런타임 오류 UI", "없음");

    var html = d.documentElement.outerHTML || "";
    html.indexOf(CONFIG.blogger.representativeImageFragment) >= 0
      ? pass(section, "대표 이미지", "포함")
      : fail(section, "대표 이미지", "누락");

    html.indexOf(CONFIG.blogger.adsenseClient) >= 0 && html.indexOf(CONFIG.blogger.adsenseSlot) >= 0
      ? pass(section, "AdSense", "client + slot 확인")
      : fail(section, "AdSense", "client 또는 slot 누락");

    d.querySelector(CONFIG.blogger.bottomBoundarySelector)
      ? pass(section, "Bottom boundary", "존재")
      : fail(section, "Bottom boundary", "누락");

    var nav = d.querySelector(CONFIG.blogger.bottomNavSelector);
    if (!nav) {
      fail(section, "하단 메뉴", "nav 없음");
    } else {
      var items = Array.from(nav.querySelectorAll("[data-hm-calc-nav]")).map(function (el) {
        return el.getAttribute("data-hm-calc-nav");
      });
      JSON.stringify(items) === JSON.stringify(CONFIG.blogger.bottomNavItems)
        ? pass(section, "하단 메뉴", items.join(" / "))
        : fail(section, "하단 메뉴", "expected " + CONFIG.blogger.bottomNavItems.join(",") + " / actual " + items.join(","));
    }

    var tocNodes = Array.from(d.querySelectorAll(CONFIG.blogger.tocSelectors.join(",")));
    var visibleToc = tocNodes.filter(function (node) {
      if (node.closest("#" + CONFIG.blogger.appId)) return false;
      var s = getComputedStyle(node);
      var r = node.getBoundingClientRect();
      return s.display !== "none" && s.visibility !== "hidden" && Number(s.opacity || 1) !== 0 && r.width > 0 && r.height > 0;
    });
    visibleToc.length
      ? fail(section, "자동목차 비표시", "화면에 보이는 TOC " + visibleToc.length + "개")
      : pass(section, "자동목차 비표시", tocNodes.length ? "TOC 요소는 있으나 모두 숨김" : "TOC 요소 없음");

    var source = "";
    try {
      source = await getRawPageHtml();
      pass(section, "Blogger 원본 HTML", source.length.toLocaleString() + " chars");
    } catch (e) {
      warn(section, "Blogger 원본 HTML", e.message || e);
      source = html;
    }

    var norm = source
      .replace(/&#39;|&apos;/g,"'")
      .replace(/&quot;/g,'"')
      .replace(/&amp;/g,"&");

    norm.indexOf(CONFIG.blogger.appSrcFragment) >= 0
      ? pass(section, "App script 경로", CONFIG.blogger.appSrcFragment)
      : fail(section, "App script 경로", CONFIG.blogger.appSrcFragment + " 누락");

    norm.indexOf(CONFIG.blogger.cssHrefFragment) >= 0
      ? pass(section, "CSS 경로", CONFIG.blogger.cssHrefFragment)
      : fail(section, "CSS 경로", CONFIG.blogger.cssHrefFragment + " 누락");

    var toolInfoMatch = norm.match(/var\s+TOOL_INFO\s*=\s*Object\.freeze\(\{[\s\S]*?version:"([^"]+)"/);
    if (toolInfoMatch) {
      toolInfoMatch[1] === CONFIG.blogger.expectedToolInfoVersion
        ? pass(section, "TOOL_INFO.version", toolInfoMatch[1])
        : fail(section, "TOOL_INFO.version", "expected " + CONFIG.blogger.expectedToolInfoVersion + " / actual " + toolInfoMatch[1]);
    } else {
      warn(section, "TOOL_INFO.version", "원본에서 TOOL_INFO.version을 찾지 못했습니다.");
    }

    CONFIG.blogger.tocSourceMarkers.forEach(function (marker) {
      norm.indexOf(marker) >= 0
        ? pass(section, "자동목차 차단 CSS", marker)
        : fail(section, "자동목차 차단 CSS", "누락: " + marker);
    });

    if (w.HM_CALC_INDEX) {
      var live = JSON.parse(JSON.stringify(w.HM_CALC_INDEX));
      var expectedIds = CONFIG.expected.calculatorIds.slice();
      var liveIds = (live.calculators || []).map(function (x) { return x.id; });
      JSON.stringify(liveIds) === JSON.stringify(expectedIds)
        ? pass(section, "런타임 Registry", "180개 ID 순서/내용 일치")
        : fail(section, "런타임 Registry", "현재 페이지 Registry가 기준과 다릅니다.");
    } else {
      fail(section, "런타임 Registry", "window.HM_CALC_INDEX 없음");
    }
  }

  function testBrowser() {
    var s = "브라우저 환경";
    "fetch" in w ? pass(s,"Fetch","지원") : fail(s,"Fetch","미지원");
    w.crypto && w.crypto.subtle ? pass(s,"Web Crypto","지원") : warn(s,"Web Crypto","SHA-256 제한");
    "WebAssembly" in w ? pass(s,"WebAssembly","지원") : fail(s,"WebAssembly","미지원");
    "TextDecoder" in w ? pass(s,"TextDecoder","지원") : fail(s,"TextDecoder","미지원");
    "DOMParser" in w ? pass(s,"DOMParser","지원") : fail(s,"DOMParser","미지원");
    "Worker" in w ? pass(s,"Worker","지원") : warn(s,"Worker","미지원");
    d.createElement("canvas").getContext ? pass(s,"Canvas","지원") : fail(s,"Canvas","미지원");
    info(s,"화면", (w.matchMedia && w.matchMedia("(max-width:760px)").matches) ? "모바일 폭" : "PC/태블릿 폭");
  }

  function reportText() {
    var c = count();
    var lines = [
      "HealingMart Calculator Self Test v" + CONFIG.selfTestVersion,
      "Target App v" + CONFIG.target.appVersion,
      "Registry v" + CONFIG.target.registryVersion,
      "Location: " + location.href,
      "",
      "PASS: " + c.PASS,
      "FAIL: " + c.FAIL,
      "WARN: " + c.WARN,
      "INFO: " + c.INFO,
      ""
    ];

    Array.from(new Set(state.results.map(function (r) { return r.section; }))).forEach(function (section) {
      lines.push("[" + section + "]");
      state.results.filter(function (r) { return r.section === section; }).forEach(function (r) {
        lines.push(r.status + " | " + r.name + " | " + r.detail);
      });
      lines.push("");
    });
    return lines.join("\n");
  }

  function download(name, content, type) {
    var blob = new Blob([content], {type:type || "text/plain;charset=utf-8"});
    var url = URL.createObjectURL(blob);
    var a = d.createElement("a");
    a.href = url;
    a.download = name;
    d.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 30000);
  }

  function ensurePanel() {
    if (state.panel && state.panel.isConnected) return;

    var host = d.createElement("div");
    host.id = "hm-calculator-self-test-host";
    host.style.position = "fixed";
    host.style.zIndex = "2147483647";
    host.style.inset = "0";
    host.style.pointerEvents = "none";
    d.documentElement.appendChild(host);

    var sh = host.attachShadow({mode:"open"});
    sh.innerHTML = `
      <style>
        *{box-sizing:border-box}
        .p{pointer-events:auto;position:fixed;top:10px;right:10px;width:min(650px,calc(100vw - 20px));max-height:calc(100vh - 20px);display:flex;flex-direction:column;background:#fff;color:#172033;border:1px solid #dce5ee;border-radius:18px;box-shadow:0 24px 75px rgba(15,23,42,.24);overflow:hidden;font-family:Pretendard,"Noto Sans KR","Malgun Gothic",sans-serif}
        .h{padding:14px 15px 11px;background:linear-gradient(135deg,#eef8ff,#f8fbff);border-bottom:1px solid #e4ebf2}
        .ht{display:flex;justify-content:space-between;gap:10px}.h h2{margin:0;font-size:18px;font-weight:950}.h p{margin:4px 0 0;color:#637287;font-size:11px}.x{width:34px;height:34px;border:1px solid #d8e1ea;border-radius:9px;background:#fff;font-size:18px;cursor:pointer}
        .track{height:8px;margin-top:11px;background:#dfe8f1;border-radius:999px;overflow:hidden}.bar{display:block;width:0;height:100%;background:linear-gradient(90deg,#4f7df1,#27a8df);transition:width .15s}.pl{margin-top:6px;color:#52667d;font-size:10px;font-weight:850}
        .sum{display:flex;gap:6px;flex-wrap:wrap;padding:9px 14px;border-bottom:1px solid #edf1f5}.sum span{padding:5px 8px;border-radius:999px;font-size:10px;font-weight:950}.pass{background:#eaf9f4;color:#08775d}.fail{background:#fff0ef;color:#b3261e}.warn{background:#fff7df;color:#9b6100}.info{background:#eef6ff;color:#355d8a}
        .actions{display:flex;gap:6px;flex-wrap:wrap;padding:9px 14px;border-bottom:1px solid #edf1f5}.actions button{min-height:34px;padding:0 10px;border:1px solid #d8e1ea;border-radius:9px;background:#fff;color:#26384e;font-size:10px;font-weight:900;cursor:pointer}.actions .primary{color:#fff;border-color:#3d74e5;background:#3d74e5}
        .list{overflow:auto;padding:9px;background:#f6f9fc}.sec{margin-bottom:9px;padding:10px;background:#fff;border:1px solid #e1e8ef;border-radius:11px}.sect{display:flex;justify-content:space-between;gap:10px;padding-bottom:7px;border-bottom:1px solid #edf1f5}.sect strong{font-size:12px;font-weight:950}.sect span{color:#77869a;font-size:9px}
        .row{display:grid;grid-template-columns:48px minmax(0,1fr);gap:8px;padding:8px 0;border-bottom:1px dashed #e9eef3}.row:last-child{border-bottom:0}.badge{display:flex;align-items:center;justify-content:center;height:22px;border-radius:999px;font-size:9px;font-weight:950}.body strong{display:block;font-size:10px;font-weight:900;word-break:break-word}.body p{margin:2px 0 0;color:#68778b;font-size:9px;line-height:1.5;word-break:break-word}
        @media(max-width:760px){.p{top:5px;right:5px;width:calc(100vw - 10px);max-height:calc(100vh - 10px);border-radius:13px}.list{padding:7px}}
      </style>
      <aside class="p">
        <div class="h"><div class="ht"><div><h2>HealingMart 계산기 통합 테스트</h2><p>Self-Test v${CONFIG.selfTestVersion} · App v${CONFIG.target.appVersion}</p></div><button class="x">×</button></div><div class="track"><i class="bar"></i></div><div class="pl">대기 중</div></div>
        <div class="sum"></div>
        <div class="actions"><button class="primary" data-a="run">전체 재검사</button><button data-a="copy">결과 복사</button><button data-a="txt">TXT 저장</button><button data-a="json">JSON 저장</button></div>
        <div class="list"></div>
      </aside>`;

    state.panel = host;
    state.shadow = sh;
    state.list = sh.querySelector(".list");
    state.summary = sh.querySelector(".sum");
    state.progressBar = sh.querySelector(".bar");
    state.progressLabel = sh.querySelector(".pl");

    sh.querySelector(".x").onclick = function(){ host.remove(); };
    sh.querySelector('[data-a="run"]').onclick = run;
    sh.querySelector('[data-a="copy"]').onclick = async function(){
      try { await navigator.clipboard.writeText(reportText()); info("테스트 도구","결과 복사","완료"); }
      catch(e){ warn("테스트 도구","결과 복사","실패: " + (e.message || e)); }
    };
    sh.querySelector('[data-a="txt"]').onclick = function(){
      download("HealingMart_Calculator_Self_Test_v1.0.1.txt","\ufeff"+reportText());
    };
    sh.querySelector('[data-a="json"]').onclick = function(){
      download("HealingMart_Calculator_Self_Test_v1.0.1.json",JSON.stringify({
        selfTestVersion:CONFIG.selfTestVersion,
        target:CONFIG.target,
        location:location.href,
        startedAt:new Date(state.startedAt).toISOString(),
        finishedAt:state.finishedAt ? new Date(state.finishedAt).toISOString() : null,
        summary:count(),
        results:state.results
      },null,2),"application/json;charset=utf-8");
    };
  }

  function render() {
    if (!state.list || !state.summary) return;
    var c = count();
    state.summary.innerHTML =
      '<span class="pass">PASS '+c.PASS+'</span>'+
      '<span class="fail">FAIL '+c.FAIL+'</span>'+
      '<span class="warn">WARN '+c.WARN+'</span>'+
      '<span class="info">INFO '+c.INFO+'</span>';

    var sections = Array.from(new Set(state.results.map(function(r){return r.section;})));
    state.list.innerHTML = sections.map(function(section){
      var rows = state.results.filter(function(r){return r.section===section;});
      return '<section class="sec"><div class="sect"><strong>'+esc(section)+'</strong><span>'+rows.length+'건</span></div>'+
        rows.map(function(r){
          var cls = r.status.toLowerCase();
          return '<div class="row"><span class="badge '+cls+'">'+esc(r.status)+'</span><div class="body"><strong>'+esc(r.name)+'</strong><p>'+esc(r.detail)+'</p></div></div>';
        }).join('')+'</section>';
    }).join('');
  }

  async function run() {
    if (state.running) return;
    ensurePanel();
    state.running = true;
    state.results = [];
    state.fetched = Object.create(null);
    state.startedAt = Date.now();
    state.finishedAt = 0;
    render();

    try {
      info("테스트 도구","대상","Calculator app v"+CONFIG.target.appVersion+" · Registry v"+CONFIG.target.registryVersion);
      testBrowser();
      await testCoreFiles();
      var reg = await testRegistry();
      await testModulesAndFormulas(reg);
      await testBlogger();

      state.finishedAt = Date.now();
      var c = count();
      setProgress(1, c.FAIL === 0 ? "완료 · FAIL 0" : "완료 · FAIL " + c.FAIL);
      info("테스트 도구","검사 범위","180개 계산기 정의 + 80개 모듈 + 280 공식 QA + Blogger/배포 통합 검사");
    } catch(e) {
      fail("테스트 도구","실행 오류", e && e.stack ? e.stack : e);
      setProgress(1,"실행 오류");
    } finally {
      state.running = false;
      render();
    }

    return {summary:count(), results:state.results.slice()};
  }

  w[API] = {
    version:CONFIG.selfTestVersion,
    config:CONFIG,
    run:run,
    getResults:function(){return state.results.slice();},
    getTextReport:reportText
  };

  if (d.readyState === "loading") {
    d.addEventListener("DOMContentLoaded", function(){ setTimeout(run,0); }, {once:true});
  } else {
    setTimeout(run,0);
  }
})(window, document);

# 계산기 공개 카탈로그 연동 안내

블로그 메인과 웹도구 모음은 계산기 앱의 전체 실행 데이터를 직접 읽지 않습니다. 아래 고정 로더 하나만 최초 1회 연결합니다.

```html
<script
  defer
  src="https://healingmart.github.io/healingmart-calculator/dist/js/hm-calculator-catalog-loader.v1.js">
</script>
```

## Promise 방식

```html
<script>
window.addEventListener("DOMContentLoaded", function () {
  var loader = window.HM_CALCULATOR_CATALOG_LOADER;

  if (!loader) return;

  loader.load()
    .then(function (catalog) {
      var manifest = loader.getManifest();
      var title = "계산기 " +
        Number(manifest.publishedCount).toLocaleString("ko-KR") +
        "종 모음";

      document.querySelector("[data-calculator-hub-title]").textContent = title;
      registerCalculators(catalog);
    })
    .catch(function () {
      // 카탈로그 실패 시 대표 계산기 모음 링크는 그대로 유지합니다.
      registerCalculators([]);
    });
});
</script>
```

## 준비 완료 이벤트 방식

```javascript
window.addEventListener(
  "hm:calculator-catalog-ready",
  function (event) {
    registerCalculators(event.detail.catalog);
  }
);
```

로더가 먼저 완료된 뒤 소비자 코드가 실행될 수도 있으므로, 실제 연동에서는 Promise 방식이 가장 안전합니다. 이벤트는 여러 위젯이 동시에 반응해야 할 때 보조로 사용합니다.

## 공개 데이터 규격

```javascript
{
  id: "",
  type: "calculator",
  name: "",
  shortName: "",
  category: "",
  subcategory: "",
  description: "",
  aliases: [],
  keywords: [],
  status: "published",
  searchVisible: true,
  featured: false,
  featuredOrder: 9999,
  popular: false,
  addedAt: null,
  updatedAt: "",
  isNew: false,
  order: 0,
  url: ""
}
```

외부 검색에서는 `id`, `name`, `shortName`, `aliases`, `keywords`, `description`, `category`, `subcategory`만 검색 대상으로 사용하면 됩니다. 실행 모듈·핸들러·FAQ·내부 주소는 공개 카탈로그에 포함되지 않습니다.

## 대표 카드 실패 처리

카탈로그를 불러오지 못해도 다음 대표 링크는 항상 남겨 둡니다.

```text
https://healingmart.github.io/healingmart-calculator/
```

개별 계산기 주소는 다음 규격으로 자동 생성됩니다.

```text
https://healingmart.github.io/healingmart-calculator/?tool={calculator-id}
```

저장소 루트의 `index.html`은 `?tool=`, `?calc=`, `?category=`가 있으면 `demo.html`로 동일한 쿼리를 전달하므로 실제 계산기가 열립니다.

## 새 계산기 추가 절차

1. `dist/calculators/`에 계산 모듈을 추가합니다.
2. `registry-v6.json`에 계산기 객체를 추가합니다.
3. 신규 계산기는 `addedAt`, `updatedAt`, `searchVisible`을 입력합니다.
4. `npm test`를 실행합니다.
5. 생성된 `dist/catalog/`과 기존 배포 파일을 함께 업로드합니다.

`isNew`는 `addedAt` 기준 30일 동안 빌드 프로그램이 자동 계산합니다. 기존 계산기는 실제 등록 이력이 없으므로 `addedAt: null`을 유지합니다.


## 초기 속도 최적화: 필요할 때만 카탈로그 불러오기

계산기 수가 800개 이상으로 늘어나거나 컨버터 카탈로그와 함께 연결할 때는 로더에 `data-autoload="false"`를 지정할 수 있습니다. 이 경우 로더 API만 먼저 등록되고 카탈로그 파일은 다운로드하지 않습니다.

```html
<script
  defer
  data-autoload="false"
  src="https://healingmart.github.io/healingmart-calculator/dist/js/hm-calculator-catalog-loader.v1.js">
</script>
```

검색창을 클릭하거나 첫 글자가 입력될 때 한 번만 호출합니다.

```javascript
window.HM_CALCULATOR_CATALOG_LOADER.load()
  .then(function (catalog) {
    registerCalculators(catalog);
  })
  .catch(function () {
    registerCalculators([]);
  });
```

`data-autoload`를 생략하면 기존처럼 페이지 로드 직후 자동으로 카탈로그를 불러옵니다.

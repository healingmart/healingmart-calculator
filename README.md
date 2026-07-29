# HealingMart Calculator v6.1.2 자동 카탈로그판

기존 계산 공식과 화면 디자인은 유지하면서 중앙 레지스트리, 검색, 직접 주소, 검증, 배포 빌드에 **외부 공개 카탈로그 자동화**를 추가한 GitHub 덮어쓰기용 배포본입니다.

## 최종 운영 흐름

```text
registry-v6.json과 계산 모듈 업데이트
→ npm test
→ 내부 계산기 데이터 자동 생성
→ 외부 검색 카탈로그·매니페스트 자동 생성
→ GitHub 저장소 업로드
→ 블로그 메인·웹도구 모음 자동 반영
```

블로그 XML과 웹도구 중앙 데이터는 최초 1회 고정 로더에 연결한 뒤 계산기 수가 증가해도 다시 수정하지 않습니다.

## 단일 원본

직접 수정하는 계산기 메타데이터는 `registry-v6.json` 하나입니다.

다음 파일은 빌드 결과이므로 직접 수정하지 않습니다.

```text
dist/data/hm-calculator-categories.v2.js
dist/data/hm-calculators-data.v2.js
dist/catalog/hm-calculators-manifest.v1.js
dist/catalog/hm-calculators-search.v1.js
```

```bash
npm run build
npm test
npm run checksums
```

## 외부 공개 카탈로그

블로그 메인과 웹도구 모음에는 아래 고정 로더만 연결합니다.

```html
<script defer src="https://healingmart.github.io/healingmart-calculator/dist/js/hm-calculator-catalog-loader.v1.js"></script>
```

로더 공개 API:

```text
HM_CALCULATOR_CATALOG_LOADER.load()
HM_CALCULATOR_CATALOG_LOADER.getManifest()
HM_CALCULATOR_CATALOG_LOADER.getCatalog()
```

준비 완료 이벤트:

```text
hm:calculator-catalog-ready
```

상세 연동 코드는 `CATALOG_INTEGRATION_GUIDE.md`를 확인합니다.

## 자동 개수 처리

테스트와 빌드는 고정 숫자를 사용하지 않습니다.

- 내부 계산기 수: `registry-v6.json`의 `published + enabled !== false`
- 외부 검색 수: 위 조건에 `searchVisible !== false` 추가
- 핸들러 수: 실제 공개 계산기의 `handlerId` 수
- 매니페스트 개수: 빌드 시 자동 계산

421번째 계산기를 임시 프로젝트에 추가한 뒤 테스트 코드를 수정하지 않고 중첩 `npm test`를 실행하는 성장 시뮬레이션이 포함되어 있습니다.

## 등록일·신규 표시 규칙

기존 계산기는 실제 등록 이력이 없으므로 다음 값을 유지합니다.

```json
"addedAt": null
```

신규 계산기는 다음처럼 입력합니다.

```json
"addedAt": "2026-08-10",
"updatedAt": "2026-08-10",
"searchVisible": true
```

`isNew`는 빌드 시 등록 후 30일 이내인지 자동 계산합니다. 수정일은 등록일보다 빠를 수 없습니다.

## 허용 상태

```text
published
beta
development
maintenance
hidden
retired
```

외부 카탈로그에는 `published`, `enabled !== false`, `searchVisible !== false`를 모두 만족하는 계산기만 포함됩니다.

## 자동 검사

- 중앙 원본과 내부 생성 데이터 일치
- 동적 계산기·핸들러 개수 검사
- ID·기존 ID·이름 중복
- 모듈·핸들러·관련 ID 누락
- 등록일·수정일·상태·검색 노출 필드 검사
- 외부 공개 필드만 포함됐는지 검사
- 카탈로그 파일 SHA-256과 매니페스트 해시 일치
- 캐시 방지 매니페스트 URL과 해시 기반 카탈로그 URL
- 로더 중복 호출 시 동일 Promise 사용
- 준비 완료 이벤트와 실패 후 재시도
- 원본 앱과 min 앱 공개 API 계약
- 자동 base 경로
- 검색어 원문 분석 전송 차단
- 대표 공식 회귀 테스트
- 1개 계산기 증가 성장 시뮬레이션

## 기존 계산기 앱 유지 사항

다음은 변경하지 않았습니다.

- 계산기 화면과 디자인
- 계산 공식과 120개 계산 모듈
- `HM_CALCULATORS`
- `HM_CALCULATOR_APP`
- `?tool=` 직접 주소
- 기존 `?category=&calc=` 주소 호환
- 공유·검색·최근 사용 기록
- Blogger 내장 계산기 구조

## 새 계산기 추가

1. `dist/calculators/`에 계산 모듈을 추가합니다.
2. `registry-v6.json`에 계산기 객체를 추가합니다.
3. `handlerId`를 모듈의 `HM_CALC.register()` ID와 일치시킵니다.
4. 신규 계산기의 `addedAt`, `updatedAt`, `searchVisible`을 입력합니다.
5. `npm test`를 실행합니다.
6. `npm run checksums` 또는 `npm run release`로 체크섬을 갱신합니다.
7. 오류가 없을 때 저장소에 덮어씁니다.

카탈로그 개수·링크·해시·신규 표시는 모두 자동 생성됩니다.

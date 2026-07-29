# HealingMart Calculator v6.1.2 공개 카탈로그 자동화 보고서

## 적용 목적

계산기 저장소의 `registry-v6.json`과 계산 모듈만 업데이트하면 외부 공개 카탈로그, 계산기 수, 검색 데이터, 개별 주소가 자동 생성되도록 구성했습니다.

## 추가 파일

```text
dist/catalog/hm-calculators-manifest.v1.js
dist/catalog/hm-calculators-search.v1.js
dist/js/hm-calculator-catalog-loader.v1.js
scripts/build-public-catalog.js
scripts/registry-utils.js
scripts/generate-checksums.js
test/public-catalog-contract.v1.js
test/catalog-loader-contract.v1.js
test/catalog-growth-simulation.v1.js
CATALOG_INTEGRATION_GUIDE.md
```

## 핵심 결과

- 고정 계산기 수 검사 제거
- 실제 공개 계산기 수와 핸들러 수를 중앙 원본에서 계산
- 외부 검색용 경량 카탈로그 자동 생성
- SHA-256 카탈로그 해시와 매니페스트 자동 생성
- 매니페스트 무캐시 확인과 해시 기반 카탈로그 캐시 갱신
- 로더 중복 호출 시 동일 Promise 반환
- 준비 완료·오류 이벤트 제공
- 실패 후 상태 초기화 및 재시도 지원
- 기존 계산기에는 `addedAt: null`
- 신규 계산기의 `isNew`를 등록 후 30일 기준으로 자동 계산
- `searchVisible: false` 계산기는 내부 앱에는 유지하고 외부 카탈로그에서만 제외
- 루트 `?tool=` 주소를 실제 계산기 데모로 전달

## 공개 카탈로그 현재 상태

- 전체 등록: 420
- 공개: 420
- 외부 검색 노출: 420
- 카탈로그 스키마: 1
- 카탈로그 SHA-256: `be0f9d96cf914612760dcb913af60519993f6bfdea64a8ae0053f149c68a3fbd`

## 자동 테스트

- 구조 테스트: 26개 통과
- 공개 앱 API 계약: 7개 통과
- 앱 base 경로: 10개 통과
- 공개 카탈로그 계약: 23개 통과
- 카탈로그 로더 계약: 18개 통과
- 계산기 증가 시뮬레이션: 6개 통과
- 대표 공식 회귀 테스트: 12개 통과
- 검증 오류: 0
- 검증 경고: 0

## 성장 시뮬레이션

프로젝트 임시 복사본에 421번째 공개 계산기와 실행 핸들러를 추가하고 테스트 코드를 수정하지 않은 채 `npm test`를 실행했습니다.

결과:

- 공개 계산기 수: 420 → 421 자동 변경
- 외부 검색 노출 수: 420 → 421 자동 변경
- 카탈로그 항목 자동 추가
- 개별 `?tool=` URL 자동 생성
- `addedAt` 기준 `isNew: true` 자동 생성
- 전체 테스트 통과

## 외부 연동

블로그 메인과 웹도구 모음에는 최초 1회 다음 고정 로더를 연결합니다.

```html
<script defer src="https://healingmart.github.io/healingmart-calculator/dist/js/hm-calculator-catalog-loader.v1.js"></script>
```

세부 소비자 코드는 `CATALOG_INTEGRATION_GUIDE.md`에 포함했습니다.

## 변경하지 않은 기능

- 기존 계산 공식
- 기존 계산 모듈
- 계산기 앱 디자인
- 내부 검색과 최근 사용
- 공유 기능
- `HM_CALCULATORS`
- `HM_CALCULATOR_APP`
- 기존 주소 호환


## Final reporting and loading refinements

- `manifest.json.localChecks.nodeSyntaxFiles` is generated from the actual JavaScript file count.
- Contract tests fail if either JavaScript count field differs from the repository.
- The fixed catalog loader supports optional `data-autoload="false"` deferred loading; automatic loading remains the default.

# 이서현 UI/UX 포트폴리오

경력직 웹·UI/UX 기획자의 문제 정의, 분석 과정, 의사결정과 결과를 보여주는 개인 포트폴리오입니다.

## Live

[https://plusremon123-pixel.github.io/2026/](https://plusremon123-pixel.github.io/2026/)

## 현재 진행 상태

- 디자인 방향: Decision Archive × UX Editorial
- 메뉴: Projects / About / Contact
- 단계: 반응형 정적 웹사이트 구현 및 GitHub Pages 배포

설계안은 [docs/portfolio-blueprint.md](docs/portfolio-blueprint.md)에서 확인할 수 있습니다.

## 로컬 실행

별도 빌드 과정 없이 정적 서버에서 실행할 수 있습니다.

```bash
python -m http.server 4173
```

브라우저에서 `http://localhost:4173`을 엽니다.

## 콘텐츠 수정

- 프로젝트 내용: `assets/js/projects.js`
- 공통 스타일: `assets/css/style.css`
- 페이지 구조: `index.html`, `projects.html`, `project.html`, `about.html`, `contact.html`

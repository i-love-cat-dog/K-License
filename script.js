<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>정보처리기사 개념 정리</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- 네비게이션 바 -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow">
        <div class="container">
            <a class="navbar-brand fw-bold" href="#">📚 정보처리기사 개념</a>
        </div>
    </nav>

    <!-- 검색 & 필터 섹션 -->
    <div class="container mt-5 text-center">
        <h1 class="fw-bold text-dark-emphasis">필기 개념 정리</h1>
        <p class="text-muted">필기 시험 대비를 위한 핵심 개념을 정리해보세요.</p>

        <!-- 검색창 -->
        <div class="d-flex justify-content-center mt-4">
            <input type="text" id="searchBox" class="form-control form-control-lg w-50"
                   placeholder="검색어를 입력하세요..." onkeypress="handleSearchEnter(event)">
            <button class="btn btn-primary btn-lg ms-3 px-4 rounded-pill" onclick="searchConcepts()">🔍 검색</button>
        </div>

        <!-- 필터 버튼 -->
        <div class="btn-group mt-3" role="group">
            <button class="btn btn-outline-secondary" onclick="displayConcepts(concepts, 'all')">📖 전체 보기</button>
            <button class="btn btn-outline-warning" onclick="displayConcepts(concepts, 'weak')">⚠️ 약한 개념</button>
            <button class="btn btn-outline-info" onclick="displayConcepts(concepts, 'review')">🔄 복습 개념</button>
        </div>

        <!-- 퀴즈 시작 버튼 -->
        <div class="mt-4">
            <button class="btn btn-warning btn-lg rounded-pill" onclick="startQuiz()">🧠 퀴즈 시작!</button>
        </div>
    </div>

    <!-- 개념 카드 리스트 -->
    <div class="container mt-5">
        <div id="concepts-list" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <!-- 개념 카드가 여기에 추가됨 -->
        </div>
    </div>

    <!-- 퀴즈 모달 -->
    <div class="modal fade" id="quizModal" tabindex="-1" aria-labelledby="quizModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="quizModalLabel">🧠 퀴즈 문제</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p id="quizQuestion"></p>
                    <input type="text" id="quizAnswer" class="form-control" placeholder="정답을 입력하세요"
                           onkeypress="handleQuizEnter(event)">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" onclick="checkQuizAnswer()">✅ 정답 확인</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
                </div>
            </div>
        </div>
    </div>

    <script src="concepts.js"></script>
    <script src="script.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

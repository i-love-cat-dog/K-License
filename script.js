document.addEventListener("DOMContentLoaded", function () {
    if (typeof concepts === "undefined") {
        console.error("⚠️ concepts 변수가 정의되지 않았습니다. concepts.js를 확인하세요.");
        alert("❌ 데이터 로드 실패: concepts.js 파일이 없거나 올바르게 로드되지 않았습니다.");
        fetchConcepts(); // concepts.js가 없을 경우 동적으로 불러옴
        return;
    }
    console.log("✅ JSON 데이터 로드 성공:", concepts);
    displayConcepts(concepts);
    loadBookmarks();
    loadCompletedConcepts();
});

// 🔄 동적으로 concepts.js 불러오기
function fetchConcepts() {
    fetch("concepts.js")
        .then((response) => {
            if (!response.ok) throw new Error("concepts.js를 찾을 수 없습니다.");
            return response.text();
        })
        .then((data) => {
            eval(data); // 주의: eval() 사용은 보안 취약점을 유발할 수 있으므로 신뢰할 수 있는 환경에서만 사용
            if (typeof concepts !== "undefined") {
                console.log("✅ 동적 로드 성공:", concepts);
                displayConcepts(concepts);
            } else {
                throw new Error("concepts 변수가 여전히 정의되지 않음");
            }
        })
        .catch((error) => {
            console.error("❌ concepts.js 로드 실패:", error);
            alert("❌ 개념 데이터를 불러오지 못했습니다. 페이지를 새로고침하거나 관리자에게 문의하세요.");
        });
}

// 개념 목록을 카드 형태로 표시하는 함수
function displayConcepts(conceptList) {
    const conceptsList = document.getElementById("concepts-list");
    conceptsList.innerHTML = "";

    if (conceptList.length === 0) {
        conceptsList.innerHTML = `<p class="text-center text-danger">검색 결과가 없습니다.</p>`;
        return;
    }

    conceptList.forEach((concept) => {
        const card = document.createElement("div");
        card.classList.add("col");
        card.dataset.title = concept.title;

        card.innerHTML = `
            <div class="card border-0 shadow-sm rounded-4 h-100">
                <div class="card-body p-4">
                    <span class="badge bg-info mb-2">${concept.category || "기타"}</span>
                    <h5 class="card-title fw-bold text-primary">${concept.title}</h5>
                    <p class="card-text text-muted">${concept.description}</p>
                    <button class="btn btn-outline-primary btn-sm" onclick="toggleBookmark('${concept.title}')">⭐ 즐겨찾기</button>
                    <button class="btn btn-outline-success btn-sm" onclick="markAsRead('${concept.title}')">✅ 학습 완료</button>
                </div>
            </div>
        `;
        conceptsList.appendChild(card);
    });
}

// 검색 기능 (concepts 변수가 undefined일 경우 예외 처리 추가)
function searchConcepts() {
    if (typeof concepts === "undefined") {
        console.error("⚠️ 검색 기능 비활성화: concepts.js가 로드되지 않음");
        alert("❌ 검색 기능을 사용할 수 없습니다. 개념 데이터를 먼저 로드하세요.");
        return;
    }

    const searchTerm = document.getElementById("searchBox").value.toLowerCase();
    const filteredConcepts = concepts.filter((concept) =>
        concept.title.toLowerCase().includes(searchTerm) ||
        concept.description.toLowerCase().includes(searchTerm)
    );
    displayConcepts(filteredConcepts);
}

// 퀴즈 기능
let currentQuizAnswer = "";

// 퀴즈 시작 (모달 사용)
function startQuiz() {
    if (typeof concepts === "undefined" || concepts.length === 0) {
        alert("⚠️ 개념 데이터가 없습니다.");
        return;
    }

    const randomConcept = concepts[Math.floor(Math.random() * concepts.length)];
    currentQuizAnswer = randomConcept.title;

    document.getElementById("quizQuestion").textContent = `다음 개념의 정의는 무엇인가요?\n"${randomConcept.description}"`;
    document.getElementById("quizAnswer").value = "";

    // 모달 열기
    let quizModal = new bootstrap.Modal(document.getElementById("quizModal"));
    quizModal.show();
}

// 정답 확인
function checkQuizAnswer() {
    const userAnswer = document.getElementById("quizAnswer").value.trim().toLowerCase();
    
    if (!userAnswer) {
        alert("❌ 정답을 입력하세요!");
        return;
    }

    if (userAnswer === currentQuizAnswer.toLowerCase()) {
        alert("✅ 정답입니다!");
    } else {
        alert(`❌ 오답입니다! 정답: ${currentQuizAnswer}`);
    }
}

// 즐겨찾기 기능
function toggleBookmark(title) {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    if (bookmarks.includes(title)) {
        bookmarks = bookmarks.filter((item) => item !== title);
    } else {
        bookmarks.push(title);
    }
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    alert(`\"${title}\" ${bookmarks.includes(title) ? "즐겨찾기 추가됨" : "즐겨찾기 제거됨"}`);
}

// 학습 완료 체크 (UI 업데이트 추가)
function markAsRead(title) {
    let completedConcepts = JSON.parse(localStorage.getItem("completed")) || [];
    if (!completedConcepts.includes(title)) {
        completedConcepts.push(title);
    }
    localStorage.setItem("completed", JSON.stringify(completedConcepts));
    document.querySelector(`[data-title='${title}']`).classList.add("text-muted");

    // ✅ 학습 완료한 항목의 버튼을 비활성화하여 UI 업데이트
    document.querySelectorAll(`[data-title='${title}'] button`).forEach((btn) => {
        btn.disabled = true;
    });
}

// 즐겨찾기 개념 불러오기
function loadBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    console.log("📌 즐겨찾기 불러오기:", bookmarks);
}

// 학습 완료 개념 불러오기
function loadCompletedConcepts() {
    const completedConcepts = JSON.parse(localStorage.getItem("completed")) || [];
    console.log("✅ 학습 완료 불러오기:", completedConcepts);
}

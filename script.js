document.addEventListener("DOMContentLoaded", function () {
    if (typeof concepts === "undefined") {
        console.error("⚠️ concepts 변수가 정의되지 않았습니다. concepts.js를 확인하세요.");
        alert("❌ 데이터 로드 실패: concepts.js 파일이 없거나 올바르게 로드되지 않았습니다.");
        fetchConcepts(); // concepts.js가 없을 경우 동적으로 불러옴
        return;
    }
    console.log("✅ JSON 데이터 로드 성공:", concepts);

    loadWeakConcepts();
    loadReviewConcepts();
    loadCompletedConcepts();
    displayConcepts(concepts, "all");
});

// ✅ Enter 키로 검색 기능 실행
function handleSearchEnter(event) {
    if (event.key === "Enter") {
        searchConcepts();
    }
}

// ✅ Enter 키로 퀴즈 정답 확인 실행
function handleQuizEnter(event) {
    if (event.key === "Enter") {
        checkQuizAnswer();
    }
}

// ✅ 개념 목록을 카드 형태로 표시하는 함수 (필터링 기능 추가)
function displayConcepts(conceptList, filter = "all") {
    const conceptsList = document.getElementById("concepts-list");
    conceptsList.innerHTML = "";

    let filteredConcepts = conceptList;
    if (filter === "weak") {
        filteredConcepts = conceptList.filter(c => weakConcepts.includes(c.title));
    } else if (filter === "review") {
        filteredConcepts = conceptList.filter(c => reviewConcepts.includes(c.title));
    }

    if (filteredConcepts.length === 0) {
        conceptsList.innerHTML = `<p class="text-center text-danger">해당 목록에 개념이 없습니다.</p>`;
        return;
    }

    filteredConcepts.forEach((concept) => {
        const isCompleted = completedConcepts.includes(concept.title);
        const card = document.createElement("div");
        card.classList.add("col");
        card.dataset.title = concept.title;

        card.innerHTML = `
            <div class="card border-0 shadow-sm rounded-4 h-100 ${isCompleted ? "text-muted" : ""}">
                <div class="card-body p-4">
                    <span class="badge bg-info mb-2">${concept.category || "기타"}</span>
                    <h5 class="card-title fw-bold text-primary">${concept.title}</h5>
                    <p class="card-text text-muted">${concept.description}</p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-outline-primary btn-sm" onclick="toggleReview('${concept.title}')">🔄 복습 추가</button>
                        <input type="checkbox" class="form-check-input" id="check-${concept.title}" ${isCompleted ? "checked" : ""} onchange="markAsRead('${concept.title}')">
                        <label for="check-${concept.title}">✅ 학습 완료</label>
                    </div>
                </div>
            </div>
        `;
        conceptsList.appendChild(card);
    });
}

// ✅ 필터링 기능 (버튼 클릭 시 실행)
function filterConcepts(filter) {
    displayConcepts(concepts, filter);
}

// 📌 퀴즈 기능 - 오답이면 자동 저장
let currentQuizAnswer = "";

function startQuiz() {
    if (typeof concepts === "undefined" || concepts.length === 0) {
        alert("⚠️ 개념 데이터가 없습니다.");
        return;
    }

    const randomConcept = concepts[Math.floor(Math.random() * concepts.length)];
    currentQuizAnswer = randomConcept.title;

    document.getElementById("quizQuestion").textContent = `다음 개념의 정의는 무엇인가요?\n"${randomConcept.description}"`;
    document.getElementById("quizAnswer").value = "";

    let quizModal = new bootstrap.Modal(document.getElementById("quizModal"));
    quizModal.show();
}

// ✅ 정답 확인 기능
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
        saveWeakConcept(currentQuizAnswer);
    }
}

// 📌 약한 개념 저장
let weakConcepts = JSON.parse(localStorage.getItem("weakConcepts")) || [];

function saveWeakConcept(title) {
    if (!weakConcepts.includes(title)) {
        weakConcepts.push(title);
        localStorage.setItem("weakConcepts", JSON.stringify(weakConcepts));
    }
}

function loadWeakConcepts() {
    weakConcepts = JSON.parse(localStorage.getItem("weakConcepts")) || [];
}

// 📌 복습할 개념 저장
let reviewConcepts = JSON.parse(localStorage.getItem("reviewConcepts")) || [];

function toggleReview(title) {
    if (!reviewConcepts.includes(title)) {
        reviewConcepts.push(title);
    } else {
        reviewConcepts = reviewConcepts.filter(c => c !== title);
    }
    localStorage.setItem("reviewConcepts", JSON.stringify(reviewConcepts));
    displayConcepts(concepts, "review"); 
}

function loadReviewConcepts() {
    reviewConcepts = JSON.parse(localStorage.getItem("reviewConcepts")) || [];
}

// 📌 학습 완료 체크박스 기능 추가
let completedConcepts = JSON.parse(localStorage.getItem("completed")) || [];

function markAsRead(title) {
    if (!completedConcepts.includes(title)) {
        completedConcepts.push(title);
    } else {
        completedConcepts = completedConcepts.filter(c => c !== title);
    }
    localStorage.setItem("completed", JSON.stringify(completedConcepts));
    displayConcepts(concepts, currentFilter);
}

function loadCompletedConcepts() {
    completedConcepts = JSON.parse(localStorage.getItem("completed")) || [];
}

let concepts = []; // 개념 데이터를 저장할 배열
let weakConcepts = JSON.parse(localStorage.getItem("weakConcepts")) || [];
let reviewConcepts = JSON.parse(localStorage.getItem("reviewConcepts")) || [];
let completedConcepts = JSON.parse(localStorage.getItem("completed")) || [];

// 📌 JSON 파일에서 개념 데이터 불러오기
document.addEventListener("DOMContentLoaded", function () {
    fetchConcepts(); // 개념 데이터 불러오기
});

// ✅ 개념 데이터 불러오는 함수
function fetchConcepts() {
    fetch("concepts.json")
        .then(response => response.json())
        .then(data => {
            concepts = data;
            console.log("✅ JSON 데이터 로드 성공:", concepts);
            
            // 필터 및 학습 데이터 로드 후 개념 목록 표시
            loadWeakConcepts();
            loadReviewConcepts();
            loadCompletedConcepts();
            displayConcepts(concepts, "all");
        })
        .catch(error => {
            console.error("⚠️ JSON 데이터 로드 실패:", error);
            alert("❌ 개념 데이터를 불러오는 데 실패했습니다. 다시 시도해주세요.");
        });
}

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

// ✅ 개념 목록을 카드 형태로 표시하는 함수 (✅ 이모티콘 추가)
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
            <div class="card border-0 shadow-sm rounded-4 h-100">
                <div class="card-body p-4">
                    <span class="badge bg-info mb-2">${concept.category || "기타"}</span>
                    <h5 class="card-title fw-bold text-primary">
                        ${concept.title} <span id="emoji-${concept.title}">${isCompleted ? "✅" : ""}</span>
                    </h5>
                    <p class="card-text text-muted">${concept.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-outline-primary btn-sm" onclick="toggleReview('${concept.title}')">🔄 복습 추가</button>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="check-${concept.title}" ${isCompleted ? "checked" : ""} onchange="markAsRead('${concept.title}')">
                            <label for="check-${concept.title}" class="form-check-label">✅ 학습 완료</label>
                        </div>
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
    if (concepts.length === 0) {
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

// 📌 학습 완료 체크박스 기능 추가 (✅ 이모티콘 추가 및 제거)
function markAsRead(title) {
    const emojiSpan = document.getElementById(`emoji-${title}`);
    
    if (!completedConcepts.includes(title)) {
        completedConcepts.push(title);
        emojiSpan.textContent = "✅";
    } else {
        completedConcepts = completedConcepts.filter(c => c !== title);
        emojiSpan.textContent = "";
    }
    localStorage.setItem("completed", JSON.stringify(completedConcepts));
}

// 📌 학습 기록 불러오기
function loadCompletedConcepts() {
    completedConcepts = JSON.parse(localStorage.getItem("completed")) || [];
}

// 🔄 초기화 버튼: 저장된 데이터를 모두 삭제
function resetProgress() {
    if (confirm("⚠️ 모든 학습 기록을 초기화하시겠습니까?")) {
        localStorage.removeItem("weakConcepts");
        localStorage.removeItem("reviewConcepts");
        localStorage.removeItem("completed");
        
        weakConcepts = [];
        reviewConcepts = [];
        completedConcepts = [];

        displayConcepts(concepts, "all"); // 전체 개념 목록 다시 표시
        alert("✅ 학습 기록이 초기화되었습니다!");
    }
}

let concepts = []; // 개념 데이터를 저장할 배열
let weakConcepts = new Set(JSON.parse(localStorage.getItem("weakConcepts")) || []);
let reviewConcepts = new Set(JSON.parse(localStorage.getItem("reviewConcepts")) || []);
let completedConcepts = new Set(JSON.parse(localStorage.getItem("completed")) || []);

// 📌 JSON 파일에서 개념 데이터 불러오기
document.addEventListener("DOMContentLoaded", function () {
    fetchConcepts();
});

// ✅ JSON 파일에서 개념 데이터 불러오는 함수
function fetchConcepts() {
    fetch("concepts.json")
        .then(response => response.json())
        .then(data => {
            concepts = data;
            console.log("✅ JSON 데이터 로드 성공:", concepts);
            displayConcepts(concepts, "all");
        })
        .catch(error => {
            console.error("⚠️ JSON 데이터 로드 실패:", error);
            alert("❌ 개념 데이터를 불러오는 데 실패했습니다. 다시 시도해주세요.");
        });
}

// ✅ 개념 목록을 카드 형태로 표시하는 함수 (✅ 이모티콘 추가)
function displayConcepts(conceptList, filter = "all") {
    console.log(`📌 displayConcepts 실행됨 (필터: ${filter})`);

    const conceptsList = document.getElementById("concepts-list");
    conceptsList.innerHTML = ""; // 기존 목록 초기화 (중복 방지)

    let filteredConcepts = conceptList;
    if (filter === "weak") {
        filteredConcepts = conceptList.filter(c => weakConcepts.has(c.title));
    } else if (filter === "review") {
        filteredConcepts = conceptList.filter(c => reviewConcepts.has(c.title));
    }

    if (filteredConcepts.length === 0) {
        conceptsList.innerHTML = `<p class="text-center text-danger">해당 목록에 개념이 없습니다.</p>`;
        return;
    }

    filteredConcepts.forEach((concept) => {
        const isCompleted = completedConcepts.has(concept.title);
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

// ✅ 필터링 기능 (중복 실행 방지)
function filterConcepts(filter) {
    console.log(`📌 filterConcepts 실행됨 (필터: ${filter})`);
    displayConcepts(concepts, filter);
}

// ✅ 검색 기능 (중복 실행 방지)
function searchConcepts() {
    const searchTerm = document.getElementById("searchBox").value.toLowerCase();
    console.log(`📌 searchConcepts 실행됨 (검색어: ${searchTerm})`);

    if (!searchTerm) {
        displayConcepts(concepts, "all");
        return;
    }

    const filteredConcepts = concepts.filter(concept => 
        concept.title.toLowerCase().includes(searchTerm) || 
        concept.description.toLowerCase().includes(searchTerm)
    );

    displayConcepts(filteredConcepts, "all");
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

// ✅ 학습 완료 체크박스 기능 수정 (✅ 이모티콘 추가 및 중복 방지)
function markAsRead(title) {
    const emojiSpan = document.getElementById(`emoji-${title}`);

    if (completedConcepts.has(title)) {
        completedConcepts.delete(title);
        emojiSpan.textContent = "";
    } else {
        completedConcepts.add(title);
        emojiSpan.textContent = "✅";
    }
    saveToLocalStorage("completed", completedConcepts);
}

// 📌 복습할 개념 저장 (중복 추가 방지)
function toggleReview(title) {
    if (reviewConcepts.has(title)) {
        reviewConcepts.delete(title);
    } else {
        reviewConcepts.add(title);
    }
    saveToLocalStorage("reviewConcepts", reviewConcepts);
    displayConcepts([...concepts], "review");
}

// 📌 약한 개념 저장 (중복 추가 방지)
function saveWeakConcept(title) {
    if (!weakConcepts.has(title)) {
        weakConcepts.add(title);
        saveToLocalStorage("weakConcepts", weakConcepts);
    }
}

// ✅ `localStorage` 저장 함수 (중복 제거 & `Set` 변환)
function saveToLocalStorage(key, setData) {
    localStorage.setItem(key, JSON.stringify([...setData]));
}

// 🔄 초기화 버튼: 저장된 데이터를 모두 삭제
function resetProgress() {
    if (confirm("⚠️ 모든 학습 기록을 초기화하시겠습니까?")) {
        localStorage.removeItem("weakConcepts");
        localStorage.removeItem("reviewConcepts");
        localStorage.removeItem("completed");

        weakConcepts.clear();
        reviewConcepts.clear();
        completedConcepts.clear();

        displayConcepts(concepts, "all"); // 전체 개념 목록 다시 표시
        alert("✅ 학습 기록이 초기화되었습니다!");
    }
}

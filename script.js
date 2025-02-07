document.addEventListener("DOMContentLoaded", function () {
    if (typeof concepts === "undefined") {
        console.error("⚠️ concepts 변수가 정의되지 않았습니다. concepts.js를 확인하세요.");
        alert("❌ 데이터 로드 실패: concepts.js 파일이 없거나 올바르게 로드되지 않았습니다.");
        fetchConcepts();
        return;
    }
    console.log("✅ JSON 데이터 로드 성공:", concepts);
    displayConcepts(concepts);
    loadWeakConcepts(); // 자주 틀리는 개념 불러오기
    loadReviewConcepts(); // 복습해야 할 개념 불러오기
});

// 🔄 동적으로 concepts.js 불러오기 (필요 시)
function fetchConcepts() {
    fetch("concepts.js")
        .then((response) => {
            if (!response.ok) throw new Error("concepts.js를 찾을 수 없습니다.");
            return response.text();
        })
        .then((data) => {
            eval(data);
            if (typeof concepts !== "undefined") {
                console.log("✅ 동적 로드 성공:", concepts);
                displayConcepts(concepts);
            } else {
                throw new Error("concepts 변수가 여전히 정의되지 않음");
            }
        })
        .catch((error) => {
            console.error("❌ concepts.js 로드 실패:", error);
            alert("❌ 개념 데이터를 불러오지 못했습니다. 관리자에게 문의하세요.");
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
                    <button class="btn btn-outline-warning btn-sm" onclick="toggleReview('${concept.title}')">🔄 다시 복습</button>
                </div>
            </div>
        `;
        conceptsList.appendChild(card);
    });
}

// "다시 복습해야 할 개념" 체크 기능
function toggleReview(title) {
    let reviewConcepts = JSON.parse(localStorage.getItem("reviewConcepts")) || [];
    if (reviewConcepts.includes(title)) {
        reviewConcepts = reviewConcepts.filter(item => item !== title);
    } else {
        reviewConcepts.push(title);
    }
    localStorage.setItem("reviewConcepts", JSON.stringify(reviewConcepts));
    alert(`"${title}" ${reviewConcepts.includes(title) ? "다시 복습 목록에 추가됨" : "다시 복습 목록에서 제거됨"}`);
}

// 자주 틀리는 개념 저장 (퀴즈에서 오답일 경우 자동 저장)
function saveWeakConcept(title) {
    let weakConcepts = JSON.parse(localStorage.getItem("weakConcepts")) || [];
    if (!weakConcepts.includes(title)) {
        weakConcepts.push(title);
        localStorage.setItem("weakConcepts", JSON.stringify(weakConcepts));
    }
}

// 퀴즈 기능 (오답일 경우 자동 저장)
let currentQuizAnswer = "";
function startQuiz() {
    if (typeof concepts === "undefined" || concepts.length === 0) {
        alert("⚠️ 개념 데이터가 없습니다.");
        return;
    }

    const randomConcept = concepts[Math.floor(Math.random() * concepts.length)];
    currentQuizAnswer = randomConcept.title;

    document.getElementById("quizQuestion").textContent = `다음 개념의 정의는 무엇인가요?
"${randomConcept.description}"`;
    document.getElementById("quizAnswer").value = "";

    let quizModal = new bootstrap.Modal(document.getElementById("quizModal"));
    quizModal.show();
}

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
        saveWeakConcept(currentQuizAnswer); // 오답이면 자동 저장
    }
}

// 자주 틀리는 개념 불러오기
function loadWeakConcepts() {
    const weakConcepts = JSON.parse(localStorage.getItem("weakConcepts")) || [];
    console.log("⚠️ 자주 틀리는 개념:", weakConcepts);
}

// 복습해야 할 개념 불러오기
function loadReviewConcepts() {
    const reviewConcepts = JSON.parse(localStorage.getItem("reviewConcepts")) || [];
    console.log("🔄 다시 복습해야 할 개념:", reviewConcepts);
}

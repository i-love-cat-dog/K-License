document.addEventListener("DOMContentLoaded", function() {
    if (typeof concepts === 'undefined') {
        console.error("⚠️ concepts 변수가 정의되지 않았습니다. concepts.js를 확인하세요.");
        return;
    }
    console.log("✅ JSON 데이터 로드 성공:", concepts);
    displayConcepts(concepts);
    loadBookmarks();
    loadCompletedConcepts();
});

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

// 검색 기능
function searchConcepts() {
    const searchTerm = document.getElementById("searchBox").value.toLowerCase();
    const filteredConcepts = concepts.filter(concept => 
        concept.title.toLowerCase().includes(searchTerm) || 
        concept.description.toLowerCase().includes(searchTerm)
    );
    displayConcepts(filteredConcepts);
}

// 퀴즈 기능
function startQuiz() {
    if (typeof concepts === 'undefined' || concepts.length === 0) {
        alert("⚠️ 개념 데이터가 없습니다.");
        return;
    }
    const randomConcept = concepts[Math.floor(Math.random() * concepts.length)];
    const questionText = `다음 개념의 정의는 무엇인가요?\n\"${randomConcept.description}\"`;
    const userAnswer = prompt(questionText);

    if (userAnswer && userAnswer.toLowerCase() === randomConcept.title.toLowerCase()) {
        alert("✅ 정답입니다!");
    } else {
        alert(`❌ 오답입니다! 정답: ${randomConcept.title}`);
    }
}

// 즐겨찾기 기능
function toggleBookmark(title) {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    if (bookmarks.includes(title)) {
        bookmarks = bookmarks.filter(item => item !== title);
    } else {
        bookmarks.push(title);
    }
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    alert(`\"${title}\" ${bookmarks.includes(title) ? "즐겨찾기 추가됨" : "즐겨찾기 제거됨"}`);
}

// 학습 완료 체크
function markAsRead(title) {
    let completedConcepts = JSON.parse(localStorage.getItem("completed")) || [];
    if (!completedConcepts.includes(title)) {
        completedConcepts.push(title);
    }
    localStorage.setItem("completed", JSON.stringify(completedConcepts));
    document.querySelector(`[data-title='${title}']`).classList.add("text-muted");
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
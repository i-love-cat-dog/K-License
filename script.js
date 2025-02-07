let concepts = [];

// JSON 데이터 불러오기 (절대 경로로 변경)
fetch("https://i-love-cat-dog.github.io/K-License/concepts.json") 
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        concepts = data;
        console.log("JSON 데이터 로드 성공:", concepts); // 디버깅용 로그
        displayConcepts(concepts); // 데이터 로드 후 개념 표시
    })
    .catch(error => console.error("JSON 데이터 로드 오류:", error));

// 개념 목록을 카드 형태로 표시하는 함수
function displayConcepts(conceptList) {
    const conceptsList = document.getElementById("concepts-list");
    conceptsList.innerHTML = ""; // 기존 목록 초기화

    if (conceptList.length === 0) {
        conceptsList.innerHTML = `<p class="text-center text-danger">검색 결과가 없습니다.</p>`;
        return;
    }

    conceptList.forEach((concept) => {
        const card = document.createElement("div");
        card.classList.add("col");

        card.innerHTML = `
            <div class="card border-0 shadow-sm rounded-4 h-100">
                <div class="card-body p-4">
                    <span class="badge bg-info mb-2">${concept.category || "기타"}</span>
                    <h5 class="card-title fw-bold text-primary">${concept.title}</h5>
                    <p class="card-text text-muted">${concept.description}</p>
                </div>
            </div>
        `;
        conceptsList.appendChild(card);
    });
}

// 검색 기능 구현 (데이터가 로드되었는지 확인)
function searchConcepts() {
    if (concepts.length === 0) {
        console.warn("경고: JSON 데이터가 아직 로드되지 않았습니다.");
        alert("데이터가 아직 로드되지 않았습니다. 잠시 후 다시 검색해 주세요.");
        return;
    }

    const searchTerm = document.getElementById("searchBox").value.toLowerCase();
    const filteredConcepts = concepts.filter(concept => 
        concept.title.toLowerCase().includes(searchTerm) || 
        concept.description.toLowerCase().includes(searchTerm)
    );

    displayConcepts(filteredConcepts);
}

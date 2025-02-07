let concepts = [];

// JSON 데이터 불러오기
fetch("concepts.json")
    .then(response => response.json())
    .then(data => {
        concepts = data;
        displayConcepts(concepts); // 모든 개념 초기 표시
    })
    .catch(error => console.error("JSON 데이터 로드 오류:", error));

// 개념 목록을 카드 형태로 표시하는 함수
function displayConcepts(conceptList) {
    const conceptsList = document.getElementById("concepts-list");
    conceptsList.innerHTML = ""; // 기존 목록 초기화

    conceptList.forEach((concept) => {
        const card = document.createElement("div");
        card.classList.add("col");

        card.innerHTML = `
            <div class="card border-0 shadow-sm rounded-4 h-100">
                <div class="card-body p-4">
                    <h5 class="card-title fw-bold text-primary">${concept.title}</h5>
                    <p class="card-text text-muted">${concept.description}</p>
                </div>
            </div>
        `;
        conceptsList.appendChild(card);
    });
}

// 검색 기능 구현
function searchConcepts() {
    const searchTerm = document.getElementById("searchBox").value.toLowerCase();

    // 검색어와 일치하는 개념 필터링
    const filteredConcepts = concepts.filter(concept => 
        concept.title.toLowerCase().includes(searchTerm) || 
        concept.description.toLowerCase().includes(searchTerm)
    );

    displayConcepts(filteredConcepts);
}

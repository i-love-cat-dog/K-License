let concepts = [];

// 개념 데이터를 JSON에서 불러오기
fetch("concepts.json")
    .then(response => response.json())
    .then(data => {
        concepts = data;
        displayConcepts(concepts);
    })
    .catch(error => console.error("JSON 데이터 로드 오류:", error));

// 개념 목록을 HTML에 표시하는 함수
function displayConcepts(conceptList) {
    const conceptsList = document.getElementById("concepts-list");
    conceptsList.innerHTML = ""; // 기존 목록 초기화

    // 가나다 순으로 정렬
    conceptList.sort((a, b) => a.title.localeCompare(b.title));

    conceptList.forEach((concept) => {
        const card = document.createElement("div");
        card.classList.add("col-md-6", "mb-3");

        card.innerHTML = `
            <div class="card shadow-sm">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${concept.title}</h5>
                    <p class="card-text">${concept.description}</p>
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

    // 강조 표시 적용
    highlightSearchTerm(filteredConcepts, searchTerm);
}

// 검색어 강조 표시 기능
function highlightSearchTerm(conceptList, searchTerm) {
    const conceptsList = document.getElementById("concepts-list");
    conceptsList.innerHTML = "";

    conceptList.forEach((concept) => {
        const card = document.createElement("div");
        card.classList.add("col-md-6", "mb-3");

        let highlightedTitle = concept.title.replace(
            new RegExp(searchTerm, "gi"),
            match => `<span class="text-danger fw-bold">${match}</span>`
        );

        let highlightedDescription = concept.description.replace(
            new RegExp(searchTerm, "gi"),
            match => `<span class="text-primary fw-bold">${match}</span>`
        );

        card.innerHTML = `
            <div class="card shadow-sm">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${highlightedTitle}</h5>
                    <p class="card-text">${highlightedDescription}</p>
                </div>
            </div>
        `;
        conceptsList.appendChild(card);
    });
}

// 페이지 로드 시 개념 목록 표시
document.addEventListener("DOMContentLoaded", () => {
    displayConcepts(concepts);
});

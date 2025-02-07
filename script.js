// 개념 목록을 HTML에 표시하는 함수
function displayConcepts() {
    const conceptsList = document.getElementById("concepts-list");
    conceptsList.innerHTML = ""; // 기존 목록 초기화

    concepts.forEach((concept) => {
        const card = document.createElement("div");
        card.classList.add("col-md-4");

        card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${concept.title}</h5>
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
    const filteredConcepts = concepts.filter(concept => 
        concept.title.toLowerCase().includes(searchTerm) || 
        concept.description.toLowerCase().includes(searchTerm)
    );

    // 검색 결과 업데이트
    const conceptsList = document.getElementById("concepts-list");
    conceptsList.innerHTML = "";

    filteredConcepts.forEach((concept) => {
        const card = document.createElement("div");
        card.classList.add("col-md-4");

        card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${concept.title}</h5>
                    <p class="card-text">${concept.description}</p>
                </div>
            </div>
        `;
        conceptsList.appendChild(card);
    });
}

// 페이지 로드 시 개념 목록 표시
document.addEventListener("DOMContentLoaded", displayConcepts);

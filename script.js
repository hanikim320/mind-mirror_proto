// ▼▼▼ 여기에 아까 넣은 이미지 파일명을 적어주세요 ▼▼▼
const imageList = [
    "images/img1.png", 
    "images/img2.jpg",
    "images/img3.jpg"
    // 필요한 만큼 더 추가하세요. 콤마(,) 잊지 마세요!
];

const imgElement = document.getElementById('random-image');
const userInput = document.getElementById('user-input');
const analyzeBtn = document.getElementById('analyze-btn');
const testSection = document.getElementById('test-section');
const loadingSection = document.getElementById('loading-section');
const resultSection = document.getElementById('result-section');
const resultTitle = document.getElementById('result-title');
const resultDesc = document.getElementById('result-desc');
const resultGoal = document.getElementById('result-goal');
const retryBtn = document.getElementById('retry-btn');

function showRandomImage() {
    const randomIndex = Math.floor(Math.random() * imageList.length);
    imgElement.src = imageList[randomIndex];
}

async function callNetlify(text) {
    try {
        const response = await fetch("/.netlify/functions/analyze", {
            method: "POST",
            body: JSON.stringify({ text: text })
        });
        
        if (!response.ok) throw new Error("Server Error");
        
        const data = await response.json();
        return JSON.parse(data); 

    } catch (error) {
        console.error(error);
        alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        return null;
    }
}

async function showResult() {
    const text = userInput.value;
    if (text.length < 5) {
        alert("이야기를 조금 더 들려주세요!");
        return;
    }

    testSection.classList.add('hidden');
    loadingSection.classList.remove('hidden');

    const diagnosis = await callNetlify(text);

    loadingSection.classList.add('hidden');
    if (diagnosis) {
        resultTitle.textContent = diagnosis.title;
        resultDesc.textContent = diagnosis.desc;
        resultGoal.textContent = diagnosis.goal;
        resultSection.classList.remove('hidden');
    } else {
        testSection.classList.remove('hidden');
    }
}

function resetTest() {
    userInput.value = '';
    resultSection.classList.add('hidden');
    testSection.classList.remove('hidden');
    showRandomImage();
}

analyzeBtn.addEventListener('click', showResult);
retryBtn.addEventListener('click', resetTest);
showRandomImage();
let myVocabulary = [
  { word: "hello", meaning: "xin chào", pronunciation: "/həˈləʊ/", type: "n" },
];
let currentIndex = 0;

function renderCard() {
  const current = myVocabulary[currentIndex];
  document.getElementById("word").textContent = current.word;
  document.getElementById("pronunciation").textContent = current.pronunciation;
  document.getElementById("type").textContent = current.type;
  document.getElementById("meaning").textContent = current.meaning;
  document.getElementById("meaning").style.display = "none";

  const wordListEl = document.getElementById("wordList");
  wordListEl.innerHTML = "";

  myVocabulary.forEach((item, index) => {
    const div = document.createElement("div");
    div.textContent = item.word;
    div.className = "word-button" + (index === currentIndex ? " active" : "");
    div.onclick = () => {
      currentIndex = index;
      renderCard();
    };
    wordListEl.appendChild(div);
  });
}

function toggleMeaning() {
  const meaningEl = document.getElementById("meaning");
  meaningEl.style.display =
    meaningEl.style.display === "none" ? "block" : "none";
}

function prevCard(event) {
  event.stopPropagation();
  if (currentIndex > 0) {
    currentIndex--;
    renderCard();
  }
}

function nextCard(event) {
  event.stopPropagation();
  if (currentIndex < myVocabulary.length - 1) {
    currentIndex++;
    renderCard();
  }
}

function speakWord(event) {
  event.stopPropagation();
  const current = myVocabulary[currentIndex];
  const utter = new SpeechSynthesisUtterance(current.word);
  utter.lang = "en-US";
  speechSynthesis.speak(utter);
}

document.getElementById("fileInput").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      if (
        Array.isArray(data) &&
        data.every(
          (item) => item.word && item.meaning && item.pronunciation && item.type
        )
      ) {
        myVocabulary = data;
        currentIndex = 0;
        renderCard();
        alert("Tải từ vựng từ JSON thành công!");
      } else {
        alert(
          "File JSON cần có đủ các trường: word, meaning, pronunciation, type."
        );
      }
    } catch (err) {
      alert("Lỗi khi đọc file JSON: " + err.message);
    }
  };

  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowDown":
        if (currentIndex > 0) {
          currentIndex--;
          renderCard();
        }
        break;
      case "ArrowRight":
      case "ArrowUp":
        if (currentIndex < myVocabulary.length - 1) {
          currentIndex++;
          renderCard();
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        speakWord(event);
        break;
      case "1":
        console.log(123);
        toggleMeaning();
        break;
    }
  });

  reader.readAsText(file);
});

window.addEventListener('keydown', (e) => console.log(e));

renderCard();

const [sourceSelect, targetSelect] = document.getElementsByClassName("form-select");
const [sourceTextArea, targetTextArea] = document.querySelectorAll("textarea");

let targetLanguage = "en";

targetSelect.addEventListener("change", () => {
    targetLanguage = targetSelect.value;
});

let debouncer;
sourceTextArea.addEventListener("input", (event) => {
    if (debouncer) {
        clearTimeout(debouncer);
    }

    debouncer = setTimeout(() => {
        const text = event.target.value; // 번역할 텍스트
        if (!text) return;
        // 언어감지 URL
        const url = "/detect";

        // 보낼 데이터
        const requestData = {
            query: text
        };

        // fetch() 부가 옵션
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData),
        };

        // 언어 감지 요청
        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const sourceLanguage = data.langCode; // 'ko'
                console.log(sourceLanguage);
                sourceSelect.value = sourceLanguage;

                if (sourceLanguage === targetLanguage) { // 원본 언어와 타겟 언어가 서로 같고,
                    if (sourceLanguage === "ko") { // 원본 언어가 한국어일 경우
                        targetLanguage = "en"; // 타겟 언어를 영어로 변경
                    } else { // 원본 언어가 한국어가 아닐 경우
                        targetLanguage = "ko"; // 타겟 언어를 한국어로 변경
                    }
                }
                // 언어 번역 요청 URL
                const url = "/translate";

                // 보낼 데이터
                const requestData = {
                    source: sourceLanguage,
                    target: targetLanguage,
                    text,
                };

                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestData),
                };

                fetch(url, options)
                    .then(response => response.json())
                    .then(data => {
                        const result = data.message.result;
                        targetTextArea.value = result.translatedText;
                        targetSelect.value = result.tarLangType;
                    });
            });
    }, 2000);
});
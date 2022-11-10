let selectedInterests = [];

function selectTab(collectLists, sections) {
    collectLists.forEach(collect => {
        collect.addEventListener("click", function() {
            if (!this.classList.contains("selected")) {
                collectLists.forEach(el => {
                    el.classList.toggle("selected");
                })
                sections.forEach(section => {
                    section.classList.toggle("selected");
                    if (section.classList.contains("selected")) {
                        section.removeAttribute('hidden');
                    } else {
                        section.setAttribute('hidden', true);
                    }
            })}
        });
    })   
}

function translate(interest) {
    const interestData = {
        "인기" : "popularity",
        "투자" : "investment",
        "사회" : "society",
        "경제" : "economy",
        "국제" : "world",
        "IT/과학" : "it",
        "문화" : "culture",
        "연예" : "entertainment",
        "스포츠" : "sports",
        "비즈" : "biz",
        "자동차" : "",
    }

    return interestData[interest]
}

function initInterests(interests) {
    const savedInterests = localStorage.getItem("interests");

    if (savedInterests !== null) {
        const parseInterests = JSON.parse(savedInterests);
        selectedInterests = parseInterests;
    } 
    // else {
    //     // 모든 관심사 선택
    //     interests.forEach(interest => {
    //         console.log(translate(interest.innerText))
    //         selectedInterests.push(translate(interest.innerText));
    //         localStorage.setItem("interests", JSON.stringify(selectedInterests));
    //     })
    // }
}

function setInterests(interests) {
    interests.forEach(interest => {
        if (selectedInterests.includes(translate(interest.innerText))) {
            interest.classList.add("selected");
        } else {
            interest.classList.remove("selected");
        }
    });
}

function selectInterests(interests) {
    interests.forEach(interest => {
        interest.addEventListener("click", function() {
            interest.classList.toggle("selected");
            if (interest.classList.contains("selected")) {
                selectedInterests.push(translate(interest.innerText));
            } else {
                selectedInterests = selectedInterests.filter(el => el !== translate(interest.innerText));
            }
            localStorage.setItem("interests", JSON.stringify(selectedInterests));
        })
    })

    setInterests(interests);
}

const collectLists = document.querySelectorAll(".collect_wrapper .collect_sidebar li");
const sections = document.querySelectorAll(".collect_wrapper section");
const interestBtns = document.querySelectorAll(".interest_list button");

selectTab(collectLists, sections);
initInterests(interestBtns);
selectInterests(interestBtns);
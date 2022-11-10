let singleItemSmall = `
    <section class="news_single_item_small">
        <div>
            <a href={link} target="_blank">
            <div class="thumb">
                <img src={thumb} />
            </div>
            <ul class="info">
                <li>{category}</li>
                <li>{origin}</li>
            </ul>
            <div class="title">{title}</div>
            </a>
        </div>
        <div class="item_btns item_bottom">
            <button type="button" class="btn_bookmark {clicked}"></button>
        </div>
    </section>
`;

let singleItem = `
    <section class="news_single_item">
        <div>
            <a href={link} target="_blank">
                <div class="thumb">
                    <img src={thumb} />
                </div>
                <ul class="info">
                <li>{category}</li>
                <li>{origin}</li>
                </ul>
                <div class="title">{title}</div>
            </a>
        </div>
        <div class="item_btns item_bottom">
            <button type="button" class="btn_bookmark {clicked}"></button>
        </div>
        <div class="edit_bg"></div>
    </section>
`;

const commonData = {};
let clickedBookmarks = [];
let clickedInterests = [];

function setContents(activeTab) {
    let list = [];
    const contents = commonData.topicContents;
    const wrapperBlock = document.querySelector(".wrapper_block");
    const collectWrapper = document.querySelector(".collect_wrapper");
    const itemList = document.querySelector(".item_list");
    wrapperBlock.innerHTML = "";
    wrapperBlock.style.display = "";
    itemList.innerHTML = "";
    collectWrapper.style.display = "none";

    // 관심사 및 북마크
    getInterests();
    getBookmarks();
    
    switch (activeTab) {
        case '' :
            for (const [key, value] of Object.entries(contents)) {
                if (clickedInterests.includes(key)) {
                    contents[key].forEach(el => {
                        list.push(setCommonData(el, clickedBookmarks.includes(el.link)));
                    });
                }
            }
            wrapperBlock.innerHTML = list.join("");
            break
        case 'interest' :
            for (const [key, value] of Object.entries(contents)) {
                if (key == 'popularity') continue;
                value.forEach(el => {
                    if (clickedBookmarks.includes(el.link)) {
                        list.push(setCommonData(el, true));
                    }
                })
            }

            wrapperBlock.style.display = "none";
            collectWrapper.style.display = "";
            itemList.innerHTML = list.join("");
            break;
        default :
            contents[activeTab].forEach(el => {
                list.push(setCommonData(el, clickedBookmarks.includes(el.link)));
            });
            wrapperBlock.innerHTML = list.join("");
            break;
    }

    const bookmarks = document.querySelectorAll(".btn_bookmark");
    clickBookmarks(bookmarks);

    // 저장한 컨텐츠 없는 경우
    setErrorText(wrapperBlock);
    setErrorText(itemList);
    
}

function getCommonData() {
    const url = `http://localhost:8080/common-data`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => Object.assign(commonData, data))
        .then(() =>  {
            setContents(document.location.href.split("#")[1])
        })
        .catch(err => {
            // 데이터 가져오는 것에 실패한 경우
            const wrapperBlock = document.querySelector(".wrapper_block");
            setErrorText(wrapperBlock);
        })
}

function setCommonData(data, clicked) {
    let item = singleItemSmall;
    item = item.replace('{link}', data.link);
    item = item.replace('{thumb}', data.thumbnail);
    item = item.replace('{category}', data.category);
    item = item.replace('{origin}', data.origin);
    item = item.replace('{title}', data.title);

    if (clicked) {
        item = item.replace('{clicked}', 'clicked');
    }
    item = item.replace('{clicked}', '');
    return item;
}

function setErrorText(obj) {
    if (!obj.innerHTML) {
        obj.innerHTML = "컨텐츠가 없습니다!";
    }
}

function getActiveTab(tabList) {
    const activeTab = document.location.href.split("#")[1]
    tabList.forEach(tab => {
        if (activeTab == tab.querySelector("a").href.split("#")[1]) {
            tab.classList.add("selected");
        } else {
            tab.classList.remove("selected");
        }
    })   
}

function selectTab(tabList) {
    tabList.forEach(tab => {
        tab.addEventListener("click", function() {
            tabList.forEach(tab => {
                tab.classList.remove("selected");
            })
            tab.classList.add("selected");
        });
    })   
}

function getInterests() {
    const savedInterests = localStorage.getItem("interests");

    if (savedInterests !== null) {
        const parseInterests = JSON.parse(savedInterests);
        clickedInterests = parseInterests;
    } 
}

function getBookmarks() {
    const savedBookmarks = localStorage.getItem("bookmarks")

    if (savedBookmarks !== null) {
        const parseBookmarks = JSON.parse(savedBookmarks);
        clickedBookmarks = parseBookmarks;
    } 
}

function clickBookmarks(bookmarks) {
    bookmarks.forEach(bookmark => {
        bookmark.addEventListener("click", function() {
            bookmark.classList.toggle("clicked");
            const link = bookmark.closest("section").querySelector("a");

            if (bookmark.classList.contains("clicked")) {
                clickedBookmarks.push(link.href)
            } else {
                clickedBookmarks = clickedBookmarks.filter(el => el !== link.href);
            }

            localStorage.setItem("bookmarks", JSON.stringify(clickedBookmarks));
        });
    })
}

getCommonData();

const tabs = document.querySelector(".tabs");
tabs.addEventListener("click", function(event) {
    setContents(event.target.href.split("#")[1]);
});
const tabList = tabs.querySelectorAll("li");
getActiveTab(tabList);
selectTab(tabList);
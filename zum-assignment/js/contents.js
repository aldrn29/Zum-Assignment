let singleItemSmall = `
    <section class="news_single_item_small">
        <div>
            <a href={link}>
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
            <a href={link}>
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

let clickedBookmarks = [];

function getCommonData() {
    const url = `http://localhost:8080/common-data`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => {

            const list = [];

            // 현재 선택된 탭
            let activeTab = document.location.href.split("#")[1];
            let contents = data.topicContents[activeTab];

            // 북마크
            const savedBookmarks = localStorage.getItem("bookmarks");
            getBookmarks(savedBookmarks);

            switch (activeTab) {
                case '' :
                    break
                case 'interest' :
                    contents = data.topicContents;
                    for (const [key, value] of Object.entries(contents)) {
                        if (key == 'popularity') continue;
                        value.forEach(el => {
                            if (clickedBookmarks.includes(el.link)) {
                                list.push(setCommonData(el, true));
                            }
                        })
                    }
                    break
                default :
                    contents.forEach(el => {
                        list.push(setCommonData(el, clickedBookmarks.includes(el.link)));
                    });
                    break
            }
            
            const wrapperBlock = document.querySelector(".wrapper_block");
            wrapperBlock.innerHTML = '';
            wrapperBlock.innerHTML = list.join('');

            const bookmarks = document.querySelectorAll(".btn_bookmark");
            clickBookmark(bookmarks);
        });
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

function getBookmarks(bookmarks) {
    if (bookmarks !== null) {
        const parseBookmarks = JSON.parse(bookmarks);
        clickedBookmarks = parseBookmarks;
    } 
}

function clickBookmark(bookmarks) {
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

const tabs = document.querySelector(".tabs");
tabs.addEventListener("click", getCommonData);

const tabList = tabs.querySelectorAll("li");
selectTab(tabList);
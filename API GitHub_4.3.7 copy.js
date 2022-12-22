let elemClass;
let elemArr;
let arr = [];
let arrData = [];

createElement = (elementTag, ElementClass) => {
  const element = document.createElement(elementTag);
  if (ElementClass) {
    element.classList.add(ElementClass);
  }
  return element;
};

let app = document.getElementById("app");
let repoList = document.getElementById("repoList");
let searchLine = createElement("div", "searchLine");
let searchInput = createElement("input", "searchInput");
let searchCount = createElement("ul", "searchCount");

searchCount.style.listStyle = "none";

searchLine.append(searchInput);
searchLine.append(searchCount);

app.append(searchLine);

debounce = (fn, debounceTime) => {
  let timeout;

  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, debounceTime);
  };
};

createRepo = (repoData) => {
  const repoElement = createElement("li", "repo-prev");
  repoElement.innerHTML = `${repoData.name}`;
  searchCount.append(repoElement);
};

creatData = (el, data) => {
  data.push({
    name: el.name,
    owner: el.owner.login,
    stars: el.stargazers_count,
  });
  return data;
};

removeRepo = () => {
  const repoElement = document.querySelectorAll(".repo-prev");
  repoElement.forEach((el) => el.remove());
  arr = [];
};

function removeListRepo(event) {
  let getRemoveButton = event.target;

  if (getRemoveButton.tagName != "BUTTON") {
    return;
  }
  elemClass = getRemoveButton.className;

  let selectRepo = document.querySelector(`.${elemClass}`);
  selectRepo.remove();
}

function findRepo(data, elem) {
  data.forEach((el) => {
    if (el.name == elem) {
      return (elemArr = el);
    }
  });
}

clickRepo = (event) => {
  let getElement = event.target.innerText;

  findRepo(arrData, getElement);

  let repo = createElement("li", elemArr.name);
  let ulText = createElement("ul", "ulText");
  let buttonClose = createElement("button", elemArr.name);

  repoList.style.listStyle = "none";
  ulText.style.listStyle = "none";

  repo.append(ulText);
  repo.append(buttonClose);
  repoList.append(repo);

  addText(ulText, elemArr);
  removeRepo();
};

function addText(teg, arr) {
  let li = createElement("li", "repo-text");
  li.textContent = `Name: ${arr.name}`;
  teg.append(li);

  li = createElement("li", "repo-text");
  li.textContent = `Owner: ${arr.owner}`;
  teg.append(li);

  li = createElement("li", "repo-text");
  li.textContent = `Stars: ${arr.stars}`;
  teg.append(li);
}

searchInput.addEventListener("keyup", debounce(searchRepo, 450));

searchCount.addEventListener("click", clickRepo);

repoList.addEventListener("click", removeListRepo);

async function searchRepo() {
  if (!searchInput.value) {
    return removeRepo();
  }
  return await fetch(
    `https://api.github.com/search/repositories?q=${searchInput.value}`
  ).then((res) => {
    if (res.ok) {
      res.json().then((res) => {
        let data = res.items;

        for (let i = 0; i < 5; i++) {
          arr.push(data[i]);
        }

        arr.forEach((el) => {
          creatData(el, arrData);
          createRepo(el);
        });
      });
    }
    if (searchInput.value.length != 0) {
      removeRepo();
    }
  });
}

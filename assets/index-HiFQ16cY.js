var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _el, _favorite, _items, _totalTab, _category, _renderingItems;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function append(dom, ...elements) {
  elements.forEach((element) => dom.append(element));
}
function toElement(htmlString) {
  const template = document.createElement("template");
  template.innerHTML = htmlString.trim();
  return template.content.firstElementChild;
}
function Modal(id, modalContent) {
  function createModalBackdrop(id2) {
    const $el2 = toElement(`
      <div class="modal-backdrop" />
    `);
    $el2.addEventListener("click", () => Modal.close(id2));
    return $el2;
  }
  function createModalContainer(modalContent2) {
    const $el2 = toElement(`
      <div class="modal-container"/>
    `);
    append($el2, modalContent2);
    return $el2;
  }
  const $el = toElement(`<div id="${id}" class="modal" />`);
  append($el, createModalBackdrop(id), createModalContainer(modalContent));
  return $el;
}
Modal.open = function(id) {
  document.getElementById(id).classList.add("modal--open");
  Modal.keydownHandler = (e) => {
    if (e.key === "Escape") {
      Modal.close(id);
    }
  };
  document.addEventListener("keydown", Modal.keydownHandler, { once: true });
};
Modal.close = function(id) {
  document.getElementById(id).classList.remove("modal--open");
  if (Modal.keydownHandler) {
    document.removeEventListener("keydown", Modal.keydownHandler);
    Modal.keydownHandler = null;
  }
};
function Header(iconButton) {
  const $el = toElement(`
    <header class="gnb">
      <h1 class="gnb__title text-title">점심 뭐 먹지</h1>
    </header>`);
  append($el, iconButton);
  return $el;
}
function InputForm({ id, label, required, bottomDescription }) {
  const $el = toElement(
    `
      <div class="form-item" ${requiredClassName()}">
      <label for="${id} text-caption">${label}</label>
      <input type="text" name=${id} id=${id}  ${required ? "required" : ""}  />
        ${bottomDescription === "" ? "" : `<span class='help-text text-caption'>${bottomDescription}</span>`}
      </div>
      `
  );
  return $el;
}
function SelectForm({ id, label, dropdownList, required }) {
  const $el = toElement(
    ` <div class="form-item" ${requiredClassName()}">
            <label for="${id} text-caption">${label}</label>
              <select name=${id} id=${id} ${"required"} >
              ${dropdownList.map(
      ({ label: label2, value }) => `<option value="${value}">${label2}</option>`
    ).join("\n")}
              </select>
        </div>
  `
  );
  return $el;
}
function TextButton({ title, onClick, id }) {
  const $el = toElement(
    `<button class="text-caption button" id="${id}" type="${id === "add__button" ? "submit" : "button"}">
      ${title}
    </button>`
  );
  $el.addEventListener("click", onClick);
  return $el;
}
function ButtonContainer(left, right) {
  const $el = toElement(`<div class="button-container" />`);
  left.classList.add("button--secondary");
  right.classList.add("button--primary");
  append($el, left, right);
  return $el;
}
function TextareaForm({ id, bottomDescription, rows, label, required }) {
  const $el = toElement(
    `
      <div class="form-item" ${requiredClassName()}">
        <label for="${id} text-caption" >${label}</label>
        <Textarea
          name=${id}
          id=${id}
          cols="30"
          rows=${rows}
          ${""}
        ></Textarea>
        <span class="help-text text-caption"
          >${bottomDescription}</span
        >
      </div>
    `
  );
  return $el;
}
const RESTAURANT_NAME_LENGTH_MAX = 30;
const DESCRIPTION_LENGTH_MAX = 200;
const ERROR_MESSAGE = {
  NAME_LENGTH_MAX: `가게 이름은 ${RESTAURANT_NAME_LENGTH_MAX}자를 넘을 수 없습니다.`,
  DESCRIPTION_MAX: `설명은 ${DESCRIPTION_LENGTH_MAX}자를 넘을 수 없습니다.`,
  LINK: "유효하지 않은 링크입니다."
};
const CATEGORY_DROPDOWN = [
  {
    value: "",
    label: "선택해 주세요"
  },
  {
    value: "한식",
    label: "한식"
  },
  {
    value: "중식",
    label: "중식"
  },
  {
    value: "일식",
    label: "일식"
  },
  {
    value: "양식",
    label: "양식"
  },
  {
    value: "아시안",
    label: "아시안"
  },
  {
    value: "기타",
    label: "기타"
  }
];
const CATEGORY_ICON = {
  한식: "./category-korean.png",
  중식: "./category-chinese.png",
  일식: "./category-japanese.png",
  양식: "./category-western.png",
  아시안: "./category-asian.png",
  기타: "./category-etc.png"
};
const FAVORITE_ICON = {
  true: "./favorite-icon-filled.png",
  false: "./favorite-icon-lined.png"
};
const Validator = {
  name(name) {
    if (name.length > RESTAURANT_NAME_LENGTH_MAX) {
      throw new Error(ERROR_MESSAGE.NAME_LENGTH_MAX);
    }
  },
  description(description) {
    if (description.length > DESCRIPTION_LENGTH_MAX && description !== "") {
      throw new Error(ERROR_MESSAGE.DESCRIPTION_MAX);
    }
  },
  link(link) {
    const urlRegex = /^(https?|ftp):\/\/(-\.)?([^\s\/?\.#-]+\.?)+(\/[^\s]*)?$/i;
    if (!urlRegex.test(link) && link !== "") {
      throw new Error(ERROR_MESSAGE.LINK);
    }
  }
};
function requiredClassName(required) {
}
function AddLunchModalForm(restaurantList2, modalId) {
  const $el = toElement(`
    <form>
      <h2 class="modal-title text-title">새로운 음식점</h2>
    </form>
    `);
  $el.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { category, description, distance, link, name } = Object.fromEntries(
      formData.entries()
    );
    try {
      Validator.name(name);
      Validator.link(link);
      Validator.description(description);
      restaurantList2.add({
        category,
        name,
        distance: Number(distance),
        description,
        link,
        favorite: false
      });
      event.target.reset();
      Modal.close(modalId);
    } catch (e) {
      alert(e.message);
    }
  });
  append(
    $el,
    SelectForm({
      id: "category",
      label: "카테고리",
      dropdownList: CATEGORY_DROPDOWN,
      required: true
    }),
    InputForm({
      id: "name",
      label: "이름",
      required: true,
      bottomDescription: ""
    }),
    SelectForm({
      id: "distance",
      label: "거리(도보 이동 시간)",
      dropdownList: [
        {
          value: "",
          label: "선택해 주세요"
        },
        {
          value: 5,
          label: "5분 내"
        },
        {
          value: 10,
          label: "10분 내"
        },
        {
          value: 15,
          label: "15분 내"
        },
        {
          value: 20,
          label: "20분 내"
        },
        {
          value: 30,
          label: "30분 내"
        }
      ],
      required: true
    }),
    TextareaForm({
      id: "description",
      bottomDescription: "메뉴 등 추가 정보를 입력해 주세요.",
      rows: "5",
      label: "설명",
      required: false
    }),
    InputForm({
      id: "link",
      label: "참고 링크",
      required: false,
      bottomDescription: "매장 정보를 확인할 수 있는 링크를 입력해 주세요."
    }),
    ButtonContainer(
      TextButton({
        id: "cancel__button",
        title: "취소하기",
        onClick: () => Modal.close(modalId)
      }),
      TextButton({
        id: "add__button",
        title: "추가하기"
      })
    )
  );
  return $el;
}
function IconButton({ src, onClick, label }) {
  const $el = toElement(`
    <button type="button" class="gnb__button" aria-label="${label}">
      <img src="${src}" alt="${label}" />
    </button>
  `);
  $el.addEventListener("click", onClick);
  return $el;
}
const MOCK_ITEM = {
  restaurantList: [
    {
      category: "한식",
      name: "피양콩할마니",
      distance: 10,
      description: "평양 출신의 할머니가 수십 년간 운영해온 비지 전문점 피양콩 할마니. 두부를 빼지 않은 되비지를 맛볼 수 있는 곳으로, ‘피양’은 평안도 사투리로 ‘평양’을 의미한다. 딸과 함께 운영하는 이곳에선 맷돌로 직접 간 콩만을 사용하며, 일체의 조미료를 넣지 않은 건강식을 선보인다. 콩비지와 피양 만두가 이곳의 대표 메뉴지만, 할머니가 옛날 방식을 고수하며 만들어내는 비지전골 또한 이 집의 역사를 느낄 수 있는 특별한 메뉴다. 반찬은 손님들이 먹고 싶은 만큼 덜어 먹을 수 있게 준비돼 있다.",
      favorite: false
    },
    {
      category: "중식",
      name: "친친",
      distance: 5,
      description: "Since 2004 편리한 교통과 주차, 그리고 관록만큼 깊은 맛과 정성으로 정통 중식의 세계를 펼쳐갑니다",
      favorite: false
    },
    {
      category: "일식",
      name: "잇쇼우",
      distance: 10,
      description: "잇쇼우는 정통 자가제면 사누끼 우동이 대표메뉴입니다. 기술은 정성을 이길 수 없다는 신념으로 모든 음식에 최선을 다하는 잇쇼우는 고객 한분 한분께 최선을 다하겠습니다",
      favorite: false
    },
    {
      category: "양식",
      name: "이태리키친",
      distance: 20,
      description: "늘 변화를 추구하는 이태리키친입니다.",
      favorite: false
    },
    {
      category: "아시안",
      name: "호야빈 삼성점",
      distance: 15,
      description: "푸짐한 양에 국물이 일품인 쌀국수",
      favorite: false
    },
    {
      category: "기타",
      name: "도스타코스 선릉점",
      distance: 5,
      description: "멕시칸 캐주얼 그릴",
      favorite: false
    }
  ]
};
const $ = (selector) => document.querySelector(selector);
function Select({ name, id, className, dropdownList }, restaurantList2) {
  const $el = toElement(
    `  <select name=${name} id=${id} class=${id}>
              ${dropdownList.map(
      ({ label, value }) => `<option value="${value}">${label}</option>`
    ).join("\n")}
              </select>
  `
  );
  $el.addEventListener("change", function(event) {
    const { id: id2, value } = event.target;
    if (id2 === "sorting-filter") {
      if (value === "name") {
        restaurantList2.sortByName();
      }
      if (value === "distance") {
        restaurantList2.sortByDistance();
      }
    }
    if (id2 === "category-filter") {
      if (event.target.value === "") {
        return restaurantList2.resetFilter();
      }
      restaurantList2.setCategoryTab(event.target.value);
    }
  });
  return $el;
}
class FavoriteButton {
  constructor(parentEl, name, favorite, restaurantList2) {
    __privateAdd(this, _el);
    __privateAdd(this, _favorite);
    __privateSet(this, _favorite, favorite);
    __privateSet(this, _el, toElement(`
        <button type="button" class="gnb__button child-exclude" aria-label="favorite" style="margin-left: auto">
          <img src=${FAVORITE_ICON[favorite]} alt="favotire" />
        </button>
      `));
    __privateGet(this, _el).addEventListener(
      "click",
      () => this.toggleState(name, restaurantList2, favorite)
    );
    append(parentEl, __privateGet(this, _el));
  }
  toggleState(name, restaurantList2) {
    __privateSet(this, _favorite, !__privateGet(this, _favorite));
    __privateGet(this, _el).querySelector("img").src = FAVORITE_ICON[__privateGet(this, _favorite)];
    restaurantList2.changeFavoriteState(name);
  }
}
_el = new WeakMap();
_favorite = new WeakMap();
function LunchInfoCard({ category, name, distance, description, favorite }) {
  return `
        <li class="restaurant" id="restaurant_${name}">
          <div class="restaurant__category">
              <img src=${CATEGORY_ICON[category]} alt=${category} />
          </div>
          <div class="restaurant__info">
              <h3 class="restaurant__name text-subtitle">${name}</h3>
              <span class="restaurant__distance text-body">캠퍼스부터 ${distance}분 내</span>
              <p class="restaurant__description text-body">${description}</p>
          </div>
        </li>
  `;
}
function RestaurantDetail({ category, name, distance, description, link, favorite }, restaurantList2) {
  const $el = toElement(`<div class="restaurant__detail"></div>`);
  append(
    $el,
    toElement(`
    <div class="restaurant__detail">
        <div class="restaurant__detail__top">
          <div class="restaurant__category">
                <img src=${CATEGORY_ICON[category]} alt=${category} />
            </div>
        </div>
        <h3 class="restaurant__name text-subtitle">${name}</h3>
        <span class="restaurant__distance text-body">캠퍼스부터 ${distance}분 내</span>
        ${description ? `<p class="restaurant__detail__description text-body">${description}</p>` : ""}
        ${link ? `<p class="restaurant__detail__link text-body">${link}</p>` : ""}
    </div>`),
    ButtonContainer(
      TextButton({
        id: "remove__button",
        title: "삭제하기",
        onClick: () => {
          if (window.confirm(`${name}을(를) 삭제하시겠습니까?`)) {
            restaurantList2.remove(name, `restaurantModal_${name}`);
          }
        }
      }),
      TextButton({
        id: "cancel__button",
        title: "닫기",
        onClick: () => Modal.close(`restaurantModal_${name}`)
      })
    )
  );
  const favoriteParentEl = $el.querySelector(".restaurant__detail__top");
  new FavoriteButton(favoriteParentEl, name, favorite, restaurantList2);
  return $el;
}
function TabButton(tabType) {
  const text = tabType === "totalTab" ? "모든 음식점" : "자주 가는 음식점";
  const $el = toElement(`
    <div id="button_${text}" class="tab--button ${tabType}">
      ${text}
    </div>
  `);
  return $el;
}
class RestaurantList {
  constructor() {
    __privateAdd(this, _items);
    __privateAdd(this, _totalTab);
    __privateAdd(this, _category);
    __privateAdd(this, _renderingItems, []);
    if (!localStorage.getItem("restaurantList")) {
      localStorage.setItem(
        "restaurantList",
        JSON.stringify(MOCK_ITEM.restaurantList)
      );
    }
    __privateSet(this, _totalTab, true);
    __privateSet(this, _category, "선택해 주세요");
    __privateSet(this, _items, JSON.parse(localStorage.getItem("restaurantList") || "[]"));
    this.sortByName();
    this.renderTab();
  }
  setLocalStorage() {
    localStorage.setItem("restaurantList", JSON.stringify(__privateGet(this, _items)));
  }
  setCategoryTab(category) {
    __privateSet(this, _category, category);
    this.render();
  }
  render() {
    const el = $(".restaurant-list");
    __privateSet(this, _renderingItems, this.filterByCategory());
    if (!__privateGet(this, _totalTab)) {
      __privateSet(this, _renderingItems, this.filterByFavorite(__privateGet(this, _renderingItems)));
    }
    el.innerHTML = __privateGet(this, _renderingItems).map(LunchInfoCard).join("");
    __privateGet(this, _renderingItems).forEach((item) => {
      const $li = document.getElementById(`restaurant_${item.name}`);
      new FavoriteButton($li, item.name, item.favorite, this);
      $li == null ? void 0 : $li.addEventListener("click", (event) => {
        const target = event.target;
        if (target.closest(".child-exclude")) {
          return;
        }
        $("main").append(
          new Modal(
            `restaurantModal_${item.name}`,
            RestaurantDetail(item, this)
          )
        );
        Modal.open(`restaurantModal_${item.name}`);
      });
    });
  }
  renderTab() {
    const $el = toElement(`
      <div class="tab--button-container"/>`);
    append($el, TabButton("totalTab"), TabButton("favoriteTab"));
    $("body").prepend($el);
    const $leftButton = document.getElementById("button_모든 음식점");
    const $rightButton = document.getElementById("button_자주 가는 음식점");
    $leftButton == null ? void 0 : $leftButton.classList.add("focus");
    $rightButton == null ? void 0 : $rightButton.addEventListener("click", () => {
      $leftButton == null ? void 0 : $leftButton.classList.remove("focus");
      $rightButton == null ? void 0 : $rightButton.classList.add("focus");
      __privateSet(this, _totalTab, false);
      this.render();
    });
    $leftButton == null ? void 0 : $leftButton.addEventListener("click", () => {
      $leftButton == null ? void 0 : $leftButton.classList.add("focus");
      $rightButton == null ? void 0 : $rightButton.classList.remove("focus");
      __privateSet(this, _totalTab, true);
      this.render();
    });
  }
  resetFilter() {
    __privateSet(this, _items, JSON.parse(localStorage.getItem("restaurantList") || "[]"));
    __privateSet(this, _category, "선택해 주세요");
    this.render();
  }
  add(newRestaurant) {
    __privateGet(this, _items).push(newRestaurant);
    this.setLocalStorage();
    this.render();
  }
  sortByName() {
    __privateSet(this, _items, __privateGet(this, _items).sort(
      (a, b) => a.name.localeCompare(b.name)
    ));
    this.render();
  }
  sortByDistance() {
    __privateGet(this, _items).sort((a, b) => a.distance - b.distance);
    this.render();
  }
  filterByCategory() {
    if (__privateGet(this, _category) === "선택해 주세요") {
      return __privateGet(this, _items);
    }
    return __privateGet(this, _items).filter(
      ({ category: c }) => c === __privateGet(this, _category)
    );
  }
  filterByFavorite(data) {
    return data.filter(
      (restaurant) => restaurant.favorite === true
    );
  }
  remove(targetName, modalId) {
    Modal.close(modalId);
    __privateSet(this, _items, __privateGet(this, _items).filter(
      (restaurnat) => restaurnat.name !== targetName
    ));
    this.setLocalStorage();
    this.render();
  }
  changeFavoriteState(targetName) {
    __privateSet(this, _items, __privateGet(this, _items).map(
      (restaurant) => restaurant.name === targetName ? { ...restaurant, favorite: !restaurant.favorite } : restaurant
    ));
    this.setLocalStorage();
    this.render();
  }
}
_items = new WeakMap();
_totalTab = new WeakMap();
_category = new WeakMap();
_renderingItems = new WeakMap();
const restaurantList = new RestaurantList();
$("body").prepend(
  Header(
    IconButton({
      src: "./add-button.png",
      onClick: () => Modal.open("addLunchModal"),
      label: "음식점 추가"
    })
  )
);
$("section").append(
  Select(
    {
      name: "category",
      id: "category-filter",
      className: "restaurant-filter",
      dropdownList: CATEGORY_DROPDOWN
    },
    restaurantList
  ),
  Select(
    {
      name: "sorting",
      id: "sorting-filter",
      className: "restaurant-filter",
      dropdownList: [
        {
          value: "name",
          label: "이름순"
        },
        {
          value: "distance",
          label: "거리순"
        }
      ]
    },
    restaurantList
  )
);
$("main").append(
  new Modal("addLunchModal", AddLunchModalForm(restaurantList, "addLunchModal"))
);

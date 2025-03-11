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
function append(dom, element) {
  dom.append(element);
}
const $ = (selector) => document.querySelector(selector);
function toElement(htmlString) {
  const template = document.createElement("template");
  template.innerHTML = htmlString.trim();
  return template.content.firstElementChild;
}
function addRequired(element, required) {
  if (required) element.classList.add("form-item--required");
}
function InputForm({ id, label, required, bottomDescription }) {
  const $inputForm = toElement(
    `
        <div class="form-item">
      <label for="${id} text-caption">${label}</label>
      <input type="text" name=${id} id=${id}  ${required ? "required" : ""}  />
        ${bottomDescription === "" ? "" : `<span class='help-text text-caption'>${bottomDescription}</span>`}
        </div>
      `
  );
  addRequired($inputForm, required);
  return $inputForm;
}
function SelectForm({ id, label, dropdownList, required }) {
  const $selectForm = toElement(
    ` <div class="form-item">
            <label for="${id} text-caption">${label}</label>
              <select name=${id} id=${id} ${"required"} >
              ${dropdownList.map(
      ({ label: label2, value }) => `<option value="${value}">${label2}</option>`
    ).join("\n")}
              </select>
        </div>
  `
  );
  addRequired($selectForm, required);
  return $selectForm;
}
function TextButton({ title, onClick, id }) {
  const buttonStyled = {
    add__button: "button--primary",
    cancel__button: "button--secondary"
  };
  const $textButton = toElement(
    `<button class="text-caption button ${buttonStyled[id]}" id="${id}" type="${id === "add__button" ? "submit" : "button"}">
      ${title}
    </button>`
  );
  $textButton.addEventListener("click", onClick);
  return $textButton;
}
function ButtonContainer(buttonList) {
  const $buttonContainer = toElement(`<div class="button-container" />`);
  buttonList.forEach((button) => {
    append($buttonContainer, button);
  });
  return $buttonContainer;
}
function TextareaForm({ id, bottomDescription, rows, label, required }) {
  const $textareaForm = toElement(
    `
      <div class="form-item">
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
  addRequired($textareaForm, required);
  return $textareaForm;
}
const RESTAURANT_NAME_LENGTH_MAX = 30;
const DESCRIPTION_LENGTH_MAX = 200;
const ERROR_MESSAGE = {
  NAME_LENGTH_MAX: `가게 이름은 ${RESTAURANT_NAME_LENGTH_MAX}자를 넘을 수 없습니다.`,
  DESCRIPTION_MAX: `설명은 ${DESCRIPTION_LENGTH_MAX}자를 넘을 수 없습니다.`,
  LINK: "유효하지 않은 링크입니다."
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
const MOCK_ITEM = {
  restaurantList: [
    {
      src: "./category-korean.png",
      name: "피양콩할마니",
      distance: 10,
      description: "평양 출신의 할머니가 수십 년간 운영해온 비지 전문점 피양콩 할마니. 두부를 빼지 않은 되비지를 맛볼 수 있는 곳으로, ‘피양’은 평안도 사투리로 ‘평양’을 의미한다. 딸과 함께 운영하는 이곳에선 맷돌로 직접 간 콩만을 사용하며, 일체의 조미료를 넣지 않은 건강식을 선보인다. 콩비지와 피양 만두가 이곳의 대표 메뉴지만, 할머니가 옛날 방식을 고수하며 만들어내는 비지전골 또한 이 집의 역사를 느낄 수 있는 특별한 메뉴다. 반찬은 손님들이 먹고 싶은 만큼 덜어 먹을 수 있게 준비돼 있다.",
      label: "한식"
    },
    {
      src: "./category-chinese.png",
      name: "친친",
      distance: 5,
      description: "Since 2004 편리한 교통과 주차, 그리고 관록만큼 깊은 맛과 정성으로 정통 중식의 세계를 펼쳐갑니다",
      label: "중식"
    },
    {
      src: "./category-japanese.png",
      name: "잇쇼우",
      distance: 10,
      description: "잇쇼우는 정통 자가제면 사누끼 우동이 대표메뉴입니다. 기술은 정성을 이길 수 없다는 신념으로 모든 음식에 최선을 다하는 잇쇼우는 고객 한분 한분께 최선을 다하겠습니다",
      label: "일식"
    },
    {
      src: "./category-western.png",
      name: "이태리키친",
      distance: 20,
      description: "늘 변화를 추구하는 이태리키친입니다.",
      label: "양식"
    },
    {
      src: "./category-asian.png",
      name: "호야빈 삼성점",
      distance: 15,
      description: "푸짐한 양에 국물이 일품인 쌀국수",
      label: "아시안"
    },
    {
      src: "./category-etc.png",
      name: "도스타코스 선릉점",
      distance: 5,
      description: "멕시칸 캐주얼 그릴",
      label: "기타"
    }
  ]
};
function LunchInfoCard({ src, name, label, distance, description }) {
  return toElement(
    `
        <li class="restaurant">
          <div class="restaurant__category">
              <img src=${src} alt=${label} />
          </div>
          <div class="restaurant__info">
              <h3 class="restaurant__name text-subtitle">${name}</h3>
              <span class="restaurant__distance text-body">캠퍼스부터 ${distance}분 내</span>
              <p class="restaurant__description text-body">${description}</p>
          </div>
        </li>
`
  );
}
class RestaurantList {
  constructor(id, restaurantList2) {
    const $restaurantList = $(".restaurant-list");
    $restaurantList.id = id;
    restaurantList2.forEach(({ src, name, distance, description, label }) => {
      append(
        $restaurantList,
        LunchInfoCard({ src, name, distance, description, label })
      );
    });
  }
  static add(id, newRestaurant) {
    const $targetList = document.getElementById(id);
    append($targetList, LunchInfoCard(newRestaurant));
  }
}
const CATEGORY_ICON = {
  한식: "./category-korean.png",
  중식: "./category-chinese.png",
  일식: "./category-japanese.png",
  양식: "./category-western.png",
  아시안: "./category-asian.png",
  기타: "./category-etc.png"
};
function AddLunchModalForm(restaurantListId, modalId) {
  const $modalForm = toElement(`
    <form>
      <h2 class="modal-title text-title">새로운 음식점</h2>
    </form>
    `);
  $modalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { category, description, distance, link, name } = Object.fromEntries(
      formData.entries()
    );
    try {
      Validator.name(name);
      Validator.link(link);
      Validator.description(description);
      RestaurantList.add(restaurantListId, {
        src: CATEGORY_ICON[category],
        name,
        distance: Number(distance),
        description,
        label: category
      });
      MOCK_ITEM.restaurantList.push({
        src: CATEGORY_ICON[category],
        name,
        distance: Number(distance),
        description,
        label: category
      });
      event.target.reset();
      Modal.close(modalId);
    } catch (e) {
      alert(e.message);
    }
  });
  append(
    $modalForm,
    SelectForm({
      id: "category",
      label: "카테고리",
      dropdownList: [
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
      ],
      required: true
    })
  );
  append(
    $modalForm,
    InputForm({
      id: "name",
      label: "이름",
      required: true,
      bottomDescription: ""
    })
  );
  append(
    $modalForm,
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
    })
  );
  append(
    $modalForm,
    TextareaForm({
      id: "description",
      bottomDescription: "메뉴 등 추가 정보를 입력해 주세요.",
      rows: "5",
      label: "설명",
      required: false
    })
  );
  append(
    $modalForm,
    InputForm({
      id: "link",
      label: "참고 링크",
      required: false,
      bottomDescription: "매장 정보를 확인할 수 있는 링크를 입력해 주세요."
    })
  );
  append(
    $modalForm,
    ButtonContainer([
      TextButton({
        id: "cancel__button",
        title: "취소하기",
        onClick: () => Modal.close(modalId)
      }),
      TextButton({
        id: "add__button",
        title: "추가하기"
      })
    ])
  );
  return $modalForm;
}
class Modal {
  constructor(id, modalContent) {
    const $modal = toElement(`<div id="${id}" class="modal" />`);
    append($modal, this.createModalBackdrop(id));
    append($modal, this.createModalContainer(modalContent));
    return $modal;
  }
  createModalBackdrop(id) {
    const $modalBackdrop = toElement(`
      <div class="modal-backdrop" />
      `);
    $modalBackdrop.addEventListener("click", () => Modal.close(id));
    return $modalBackdrop;
  }
  createModalContainer(modalContent) {
    const $modalContainer = toElement(`
      <div class="modal-container"/>
      `);
    append($modalContainer, modalContent);
    return $modalContainer;
  }
  static open(id) {
    document.getElementById(id).classList.add("modal--open");
    this.keydownHandler = (e) => {
      if (e.key === "Escape") {
        this.close(id);
      }
    };
    document.addEventListener("keydown", this.keydownHandler, { once: true });
  }
  static close(id) {
    document.getElementById(id).classList.remove("modal--open");
    if (this.keydownHandler) {
      document.removeEventListener("keydown", this.keydownHandler);
      this.keydownHandler = null;
    }
  }
}
function Header(iconButton) {
  const $header = toElement(`
    <header class="gnb">
      <h1 class="gnb__title text-title">점심 뭐 먹지</h1>
    </header>`);
  append($header, iconButton);
  return $header;
}
function IconButton({ src, onClick, label }) {
  const $button = toElement(`
    <button type="button" class="gnb__button" aria-label="${label}">
      <img src="${src}" alt="${label}" />
    </button>
  `);
  $button.addEventListener("click", onClick);
  return $button;
}
$("body").prepend(
  Header(
    IconButton({
      src: "./add-button.png",
      onClick: () => Modal.open("addLunchModal"),
      label: "음식점 추가"
    })
  )
);
const restaurantList = new RestaurantList(
  "toalRestaurantList",
  MOCK_ITEM.restaurantList
);
restaurantList.$restaurantList;
$("main").append(
  new Modal(
    "addLunchModal",
    AddLunchModalForm("toalRestaurantList", "addLunchModal")
  )
);

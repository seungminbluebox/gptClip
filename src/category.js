import {
  clipData,
  currentCategoryId,
  setClipData,
  getOrderedCategoriesFromData,
  getCategoryOrder,
  setCategoryOrder,
  setCurrentCategory,
  getClipsForCategory,
  getCategoryNameById, // ✅
} from "./data.js";
import { renderClipList } from "./clip.js";

export function renderCategoryList() {
  const sidebar = document.querySelector(".sidebar");
  const categories = getCategoryOrder();

  sidebar.querySelectorAll(".category").forEach((el) => el.remove());

  categories.forEach((cat) => {
    const div = document.createElement("div");
    div.className = "category";

    div.setAttribute("draggable", true); // ✅ 드래그 가능
    div.dataset.categoryId = cat.id; // ✅ ID 저장
    if (currentCategoryId === cat.id) {
      div.classList.add("active"); // ✅ 현재 선택된 카테고리 강조
    }
    div.innerHTML = `
      <span class="editable">${cat.name}</span>
      <div class="actions">
        <button class="edit-cat">✏️</button>
        <button class="delete-cat">🗑️</button>
      </div>
    `;

    // 📌 드래그 이벤트
    div.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", cat.id);
      e.dataTransfer.effectAllowed = "move";
      div.classList.add("dragging");
    });

    div.addEventListener("dragover", (e) => {
      e.preventDefault();

      const bounding = div.getBoundingClientRect();
      const offset = e.clientY - bounding.top;

      div.classList.remove("drag-over-before", "drag-over-after");
      if (offset < bounding.height / 2) {
        div.classList.add("drag-over-before");
      } else {
        div.classList.add("drag-over-after");
      }
    });

    div.addEventListener("dragleave", () => {
      div.classList.remove("drag-over-before", "drag-over-after");
    });
    div.addEventListener("drop", (e) => {
      e.preventDefault();

      const fromId = e.dataTransfer.getData("text/plain");
      if (!fromId) return;

      const categories = getCategoryOrder().slice();
      const fromIndex = categories.findIndex((cat) => cat.id === fromId);
      const toIndex = categories.findIndex(
        (cat) => cat.id === div.dataset.categoryId
      );
      if (fromIndex === -1 || toIndex === -1) return;

      // 마우스 위치 기준 위/아래 계산
      const bounding = div.getBoundingClientRect();
      const offset = e.clientY - bounding.top;
      const insertAfter = offset > bounding.height / 2;

      // 꺼내기
      const moving = categories.splice(fromIndex, 1)[0];

      // toIndex 보정
      let insertIndex = toIndex;
      if (insertAfter) insertIndex++;
      if (fromIndex < insertIndex) insertIndex--; // 핵심: 삭제 후 인덱스 보정

      categories.splice(insertIndex, 0, moving);

      setCategoryOrder(categories);
      renderCategoryList();
    });

    div.addEventListener("dragend", () => {
      div.classList.remove("dragging");
      document
        .querySelectorAll(".drag-over-before, .drag-over-after")
        .forEach((el) => {
          el.classList.remove("drag-over-before", "drag-over-after");
        });
    });
    div.querySelector(".editable").addEventListener("click", () => {
      renderClipList(cat.id); // ✅ ID 기반
    });

    // ✅ 카테고리 이름 수정
    div.querySelector(".edit-cat").addEventListener("click", () => {
      const span = div.querySelector(".editable");
      const actions = div.querySelector(".actions");
      const original = span.textContent;

      // 이미 편집 중이면 무시
      if (div.classList.contains("editing")) return;
      div.classList.add("editing");

      // input 생성
      const input = document.createElement("input");
      input.className = "temp-input";
      input.value = original;

      span.replaceWith(input);
      input.focus();

      // 기존 ✏️🗑️ 버튼 숨기고 💾 버튼으로 교체
      actions.innerHTML = `<button class="save-cat">💾</button>`;

      const saveBtn = actions.querySelector(".save-cat");

      const save = () => {
        const newName = input.value.trim();
        if (!newName) return alert("카테고리명을 입력해주세요.");
        if (newName === original) {
          renderCategoryList();
          return;
        }

        const exists = getCategoryOrder().some(
          (c) => c.name === newName && c.id !== cat.id
        );
        if (exists) return alert("이미 존재하는 카테고리입니다.");

        const order = getCategoryOrder().map((catItem) =>
          catItem.id === cat.id ? { ...catItem, name: newName } : catItem
        );
        setCategoryOrder(order);

        renderCategoryList();
        if (currentCategoryId === cat.id) {
          renderClipList(cat.id);
        }
      };

      const restore = () => {
        div.classList.remove("editing");

        // input → span 복원
        const newSpan = document.createElement("span");
        newSpan.className = "editable";
        newSpan.textContent = original;
        input.replaceWith(newSpan);

        // 버튼 복원
        actions.innerHTML = `
      <button class="edit-cat">✏️</button>
      <button class="delete-cat">🗑️</button>
    `;

        // 이벤트 재연결
        renderCategoryList();
      };

      // 저장 버튼 클릭/엔터로 저장
      saveBtn.addEventListener("click", save);
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") save();
      });
    });

    div.querySelector(".delete-cat").addEventListener("click", () => {
      const confirmed = confirm(
        `카테고리 "${cat.name}"을 삭제하시겠습니까? 이 카테고리의 모든 클립이 사라집니다.`
      );
      if (!confirmed) return;

      setCategoryOrder(getCategoryOrder().filter((c) => c.id !== cat.id));
      setClipData(clipData.filter((c) => c.categoryId !== cat.id));

      if (currentCategoryId === cat.id) {
        document.querySelector(".clip-list").classList.add("hidden");
        document.querySelector(".clip-content").classList.add("hidden");
        setCurrentCategory(null);
      }

      renderCategoryList();
    });

    sidebar.insertBefore(div, sidebar.querySelector("hr"));
  });
}

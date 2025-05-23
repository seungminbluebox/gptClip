import { renderCategoryList } from "./category.js";
import { renderClipList, renderClipContent } from "./clip.js";
import {
  clipData,
  categoryOrder,
  currentCategoryId,
  toggleFavoritesOnly,
  getShowFavoritesOnly,
  setClipData,
  setCategoryOrder,
  getCategoryOrder,
  setCurrentCategory,
  uuid,
} from "./data.js";

// ✅ 새 카테고리 추가
document.querySelector(".add-category").addEventListener("click", () => {
  const sidebar = document.querySelector(".sidebar");
  const clipList = document.querySelector(".clip-list");
  const clipContent = document.querySelector(".clip-content");

  if (sidebar.querySelector(".new-cat")) return;

  const div = document.createElement("div");
  div.className = "category new-cat";
  div.innerHTML = `
    <input class="temp-input" placeholder="카테고리명 입력" />
    <div class="actions">
      <button class="save-cat">💾</button>
    </div>
  `;

  sidebar.insertBefore(div, sidebar.querySelector("hr"));

  const input = div.querySelector("input");
  const saveBtn = div.querySelector(".save-cat");

  const save = () => {
    const value = input.value.trim();
    if (!value) return alert("카테고리 이름을 입력해주세요.");

    const exists = categoryOrder.some((c) => c.name === value);
    if (exists) return alert("이미 존재하는 카테고리입니다.");

    const newCat = {
      id: uuid(), // ✅ 고유 ID 부여
      name: value,
    };

    setCategoryOrder([...getCategoryOrder(), newCat]);

    renderCategoryList();
    clipList.classList.add("hidden");
    clipContent.classList.add("hidden");
  };

  saveBtn.addEventListener("click", save);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") save();
  });

  input.focus();
});

// ✅ 새 클립 추가
document.querySelector(".add-clip").addEventListener("click", () => {
  if (!currentCategoryId) return alert("카테고리를 먼저 선택하세요.");

  const newClip = {
    id: uuid(), // ✅ 고유 ID
    categoryId: currentCategoryId,
    title: "(제목 없음)",
    content: "(내용 없음)",
    from: "(출처 없음)", // ✅ 기본값

    isFavorite: false,
  };

  clipData.push(newClip);
  renderClipList(currentCategoryId);
  renderClipContent(newClip);
});

// ⭐ 즐겨찾기 필터 토글
document.querySelector(".toggle-favorites").addEventListener("click", () => {
  toggleFavoritesOnly();

  const button = document.querySelector(".toggle-favorites");
  button.textContent = getShowFavoritesOnly()
    ? "⭐ 전체 보기"
    : "⭐ 즐겨찾기만 보기";

  if (currentCategoryId) {
    renderClipList(currentCategoryId);
  }
});

renderCategoryList();
document.querySelector(".clip-list").classList.add("hidden");
document.querySelector(".clip-content").classList.add("hidden");

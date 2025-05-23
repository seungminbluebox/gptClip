import {
  clipData,
  setCurrentClip,
  getShowFavoritesOnly,
  toggleFavoritesOnly,
  currentClip,
  setCurrentCategory,
  getCategoryNameById, // ✅ 추가
} from "./data.js";

export function renderClipList(categoryId) {
  setCurrentCategory(categoryId); // ✅ 이 한 줄 추가!!

  const showFavOnly = getShowFavoritesOnly();
  const container = document.querySelector(".clip-list");
  const listEl = container.querySelector(".clip-items");
  listEl.innerHTML = "";

  const clips = clipData.filter(
    (clip) =>
      clip.categoryId === categoryId && (!showFavOnly || clip.isFavorite)
  );

  clips.forEach((clip, index) => {
    const div = document.createElement("div");
    div.className = "clip";
    div.setAttribute("draggable", true);
    div.dataset.id = clip.id;
    div.dataset.index = index;
    if (clip.id === currentClip?.id) {
      div.classList.add("active");
    }
    div.innerHTML = `
    <div class="title editable">${clip.title}</div>
    <div class="actions">
      <button class="fav-btn">
  <img src="${
    clip.isFavorite ? "./image/favTrue.png" : "./image/favFalse.png"
  }" alt="즐겨찾기" />
</button>

      <button class="delete-btn">🗑️</button> <!-- ✅ 삭제 버튼 추가 -->
    </div>
  `;

    // 클릭 → 내용 보기
    div.querySelector(".title").addEventListener("click", () => {
      renderClipContent(clip);
    });

    // 즐겨찾기
    div.querySelector(".fav-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      clip.isFavorite = !clip.isFavorite;

      renderClipList(categoryId);
    });
    div.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation(); // 내용 보기 클릭 방지
      const confirmed = confirm(`"${clip.title}" 클립을 삭제할까요?`);
      if (!confirmed) return;

      const index = clipData.findIndex((c) => c.id === clip.id);
      if (index !== -1) {
        clipData.splice(index, 1); // ✅ 삭제
        renderClipList(categoryId); // ✅ 리스트 갱신
        document.querySelector(".clip-content").classList.add("hidden"); // 오른쪽도 닫기
      }
    });

    // 드래그 앤 드롭 이벤트
    div.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", index);
      e.dataTransfer.effectAllowed = "move";
      div.classList.add("dragging");
    });

    div.addEventListener("dragover", (e) => {
      e.preventDefault();
      const rect = div.getBoundingClientRect();
      const offset = e.clientY - rect.top;

      div.classList.remove("drag-over-before", "drag-over-after");
      if (offset < rect.height / 2) {
        div.classList.add("drag-over-before");
      } else {
        div.classList.add("drag-over-after");
      }
    });

    div.addEventListener("dragleave", () => {
      div.classList.remove("drag-over-before", "drag-over-after");
    });

    div.addEventListener("dragend", () => {
      div.classList.remove("dragging");
      document
        .querySelectorAll(".drag-over-before, .drag-over-after")
        .forEach((el) =>
          el.classList.remove("drag-over-before", "drag-over-after")
        );
    });

    div.addEventListener("drop", (e) => {
      e.preventDefault();

      const fromIndex = Number(e.dataTransfer.getData("text/plain"));
      const toIndex = index;

      const clipsInCategory = clipData.filter(
        (c) => c.categoryId === categoryId
      );

      const sourceClip = clipsInCategory[fromIndex];
      const targetClip = clipsInCategory[toIndex];

      const sourceGlobalIndex = clipData.indexOf(sourceClip);
      const targetGlobalIndex = clipData.indexOf(targetClip);

      const rect = div.getBoundingClientRect();
      const offset = e.clientY - rect.top;
      const insertAfter = offset > rect.height / 2;

      clipData.splice(sourceGlobalIndex, 1);
      let insertIndex = clipData.indexOf(targetClip);
      if (insertAfter) insertIndex++;
      clipData.splice(insertIndex, 0, sourceClip);

      renderClipList(categoryId); // ✅ categoryId 기준으로 다시 렌더링
    });

    listEl.appendChild(div);
  });

  container.classList.remove("hidden");
  document.querySelector(".clip-content").classList.add("hidden");
}

export function renderClipContent(clip) {
  setCurrentClip(clip);
  const container = document.querySelector(".clip-content");
  container.innerHTML = `
    <h3>${clip.title}</h3>
 
    <div>${marked.parse(clip.content)}</div>
    <p class="clip-from" style="font-size: 0.9em; color: #888;">
      출처: ${clip.from || "없음"}
    </p>
    <div class="controls">
      <button class="edit" data-mode="edit">수정</button>
    </div>
  `;
  container.classList.remove("hidden");

  container.querySelector(".edit").addEventListener("click", () => {
    enableClipEdit(container, clip);
  });
}

function enableClipEdit(container, clip) {
  const titleEl = container.querySelector("h3");
  const contentEl = container.querySelector("div");

  if (!titleEl || !contentEl) return;

  const fromEl = container.querySelector(".clip-from");
  if (fromEl) fromEl.remove();

  const originalTitle = clip.title;
  const originalContent = clip.content;

  const titleInput = document.createElement("input");
  titleInput.className = "temp-input";
  titleInput.value = originalTitle;

  const contentInput = document.createElement("textarea");
  contentInput.className = "temp-input";
  contentInput.value = originalContent;
  contentInput.rows = 6;

  const fromInput = document.createElement("input");
  fromInput.className = "temp-input";
  fromInput.value = clip.from || "";
  fromInput.placeholder = "출처 입력 (예: 채팅방 이름)";

  titleEl.replaceWith(titleInput);
  contentEl.replaceWith(contentInput);
  container.insertBefore(fromInput, container.querySelector(".controls"));

  const button = container.querySelector(".edit");
  button.textContent = "저장";
  button.style.backgroundColor = "#ff3b30"; // 붉은색
  button.setAttribute("data-mode", "save");

  const save = () => {
    const newTitle = titleInput.value.trim();
    const newContent = contentInput.value.trim();
    const newFrom = fromInput.value.trim();

    if (!newTitle || !newContent) return;

    // 데이터 반영
    clip.title = newTitle;
    clip.content = newContent;
    clip.from = newFrom;

    const clipEls = document.querySelectorAll(".clip");
    clipEls.forEach((el) => {
      if (el.dataset.id === clip.id) {
        const titleEl = el.querySelector(".title");
        if (titleEl) titleEl.textContent = newTitle;
      }
    });
    // 다시 렌더링
    renderClipList(clip.categoryId); // ✅ 리스트 다시 렌더링
    renderClipContent(clip); // ✅ 오른쪽도 다시 렌더링
  };

  button.addEventListener("click", save);
}

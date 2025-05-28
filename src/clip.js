import {
  clipData,
  setCurrentClip,
  getShowFavoritesOnly,
  setCurrentCategory,
  getCurrentClip,
  setClipData,
} from "./data.js";
marked.setOptions({
  breaks: true, // ← 핵심: 한 줄 엔터로도 <br> 처리됨
});

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
    if (clip.id === getCurrentClip()?.id) {
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
    div.addEventListener("click", (e) => {
      const isButton = e.target.closest("button");
      if (isButton) return;
      setCurrentClip(clip); // 상태 설정
      renderClipList(clip.categoryId); // ✅ .active 적용 위해 다시 렌더
      renderClipContent(clip); // 오른쪽 내용 표시
    });

    // 즐겨찾기
    div.querySelector(".fav-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      clip.isFavorite = !clip.isFavorite;
      setClipData([...clipData]); // 🔥 Firestore 반영
      renderClipList(categoryId);
    });
    div.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation(); // 내용 보기 클릭 방지
      const confirmed = confirm(`"${clip.title}" 클립을 삭제할까요?`);
      if (!confirmed) return;

      const index = clipData.findIndex((c) => c.id === clip.id);
      if (index !== -1) {
        clipData.splice(index, 1); // ✅ 삭제
        setClipData([...clipData]); // 🔥 Firestore 반영
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
      setClipData([...clipData]); // ✅ Firestore 동기화

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
  const contentArea = container.querySelector(".clip-body");

  contentArea.innerHTML = `
    <h1 title="${clip.title}">${clip.title}</h1>
    <div class="controls">
      <button class="edit" data-mode="edit" title="클립 수정">  
        <img class='editCilp' src="./image/editClip.png" alt="수정" />
      </button>
    </div> 
    <div class="markdown-content" title="클립 내용">${marked.parse(
      clip.content
    )}</div>
    <p class="clip-from" style="font-size: 0.9em; color: #888;" title="출처">
      출처: ${clip.from || "없음"}
    </p>
  `;
  container.classList.remove("hidden");

  contentArea.querySelector(".edit").addEventListener("click", () => {
    enableClipEdit(contentArea, clip);
  });
}

function enableClipEdit(container, clip) {
  const titleInput = document.createElement("input");
  titleInput.className = "temp-input";
  titleInput.value = clip.title;

  const contentInput = document.createElement("textarea");
  contentInput.className = "temp-input";
  contentInput.value = clip.content;
  contentInput.rows = 10;

  const fromInput = document.createElement("input");
  fromInput.className = "temp-input";
  fromInput.value = clip.from || "";
  fromInput.placeholder = "출처 입력 (예: 채팅방 이름)";

  const saveButton = document.createElement("button");
  saveButton.className = "edit";
  saveButton.innerHTML = `<img src="./image/saveClip.png" title="클립 저장" alt="저장" style="height: 24px;" />`;
  saveButton.style.backgroundColor = "transparent";
  saveButton.style.border = "none";
  saveButton.setAttribute("data-mode", "save");

  container.innerHTML = ""; // 이전 내용 초기화

  container.appendChild(titleInput); // 제목
  container.appendChild(saveButton); // 저장 버튼
  container.appendChild(contentInput); // 내용
  container.appendChild(fromInput); // 출처

  saveButton.onclick = () => {
    const newTitle = titleInput.value.trim();
    const newContent = contentInput.value.trim();
    const newFrom = fromInput.value.trim();
    if (!newTitle || !newContent) return;

    clip.title = newTitle;
    clip.content = newContent;
    clip.from = newFrom;

    setClipData([...clipData]); // Firestore 반영
    renderClipList(clip.categoryId);
    renderClipContent(clip);
  };
}

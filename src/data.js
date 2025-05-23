// ✅ 카테고리 순서 및 정보: name + uuid 기반 id
export let categoryOrder = [
  { id: "cat-1", name: "영양제" },
  { id: "cat-2", name: "운동" },
];

// ✅ clipData는 categoryId로 연결
export let clipData = [
  {
    id: "clip-1",
    categoryId: "cat-1",
    title: "비오틴 복용법",
    content: "### 비오틴\n- 하루 5000mcg\n- 공복에 복용",
    from: "건강 정보 채팅방", // ✅
    isFavorite: false,
  },
  {
    id: "clip-2",
    categoryId: "cat-2",
    title: "루틴 A",
    content: "- 스쿼트\n- 벤치프레스\n- 데드리프트",
    from: "건강 정보 채팅방", // ✅
    isFavorite: false,
  },
];

export let currentClip = null;
export let currentCategoryId = null;
export let showFavoritesOnly = false;

export function setCategoryOrder(newOrder) {
  categoryOrder = newOrder;
}

export function getCategoryOrder() {
  return categoryOrder;
}

export function toggleFavoritesOnly() {
  showFavoritesOnly = !showFavoritesOnly;
}

export function getShowFavoritesOnly() {
  return showFavoritesOnly;
}

export function setCurrentCategory(catId) {
  currentCategoryId = catId;
}

export function setCurrentClip(clip) {
  currentClip = clip;
}

export function setClipData(newData) {
  clipData = newData;
}

export function uuid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substr(2, 9);
}
export function getCurrentCategoryId() {
  return currentCategoryId;
}

export function getCurrentClip() {
  return currentClip;
}

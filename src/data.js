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

// ✅ 카테고리 ID로 이름 가져오기
export function getCategoryNameById(id) {
  const found = categoryOrder.find((cat) => cat.id === id);
  return found ? found.name : "(알 수 없음)";
}

// ✅ 이름으로 카테고리 ID 가져오기 (역방향)
export function getCategoryIdByName(name) {
  const found = categoryOrder.find((cat) => cat.name === name);
  return found ? found.id : null;
}

// ✅ 카테고리 순서 렌더링
export function getOrderedCategoriesFromData() {
  const actualIds = [...new Set(clipData.map((c) => c.categoryId))];

  let visible = categoryOrder.filter((cat) => actualIds.includes(cat.id));
  const missing = actualIds
    .filter((id) => !categoryOrder.some((cat) => cat.id === id))
    .map((id) => ({ id, name: "(미지정)" }));

  const full = [...visible, ...missing];
  setCategoryOrder(full);
  return full;
}

export function getClipsForCategory(categoryId) {
  return clipData
    .filter((c) => c.categoryId === categoryId)
    .map((clip, index) => ({ ...clip, _index: index }));
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

// ✅ 카테고리 순서 및 정보: name + uuid 기반 id
export let categoryOrder = [];

// ✅ clipData는 categoryId로 연결
export let clipData = [];
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

export let currentClip = null;
export let currentCategoryId = null;
export let showFavoritesOnly = false;
export let currentUserId = null;
export const setCurrentUserId = (id) => (currentUserId = id);

export function setCategoryOrder(newOrder) {
  // categoryOrder = newOrder;
  categoryOrder = newOrder;
  if (currentUserId) {
    const userRef = doc(db, "users", currentUserId);
    setDoc(userRef, { clipData, categoryOrder }, { merge: true });
  }
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
  // clipData = newData;
  clipData = newData;
  if (currentUserId) {
    const userRef = doc(db, "users", currentUserId);
    setDoc(userRef, { clipData, categoryOrder }, { merge: true });
  }
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

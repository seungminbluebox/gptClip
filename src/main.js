import { renderCategoryList } from "./category.js";
import { renderClipList, renderClipContent } from "./clip.js";
import {
  clipData,
  categoryOrder,
  currentCategoryId,
  toggleFavoritesOnly,
  getShowFavoritesOnly,
  setCategoryOrder,
  getCategoryOrder,
  setClipData,
  setCurrentUserId,
  uuid,
} from "./data.js";
import { db, auth, provider } from "./firebase-config.js";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  const logoutBtn = document.querySelector("#logout-btn");
  const app = document.querySelector(".app-container");
  const loginScreen = document.querySelector(".auth-area");
  const darkModeToggle = document.querySelector(".darkmode-toggle");

  if (user) {
    setCurrentUserId(user.uid);

    console.log("✅ 로그인됨:", user.uid);
    app.classList.remove("hidden");
    loginScreen.classList.add("hidden"); // ✅ 로그인 배경 숨김
    logoutBtn.classList.remove("hidden"); // ✅ 로그아웃 버튼 표시
    darkModeToggle.classList.remove("hidden"); // ✅ 다크모드 토글 표시
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      console.log("📥 Firestore에서 사용자 데이터 로드됨");
      setCategoryOrder(data.categoryOrder || []);
      setClipData(data.clipData || []);
    } else {
      console.log("🆕 사용자 첫 로그인 - 빈 데이터 생성");
      await setDoc(userRef, {
        categoryOrder: [],
        clipData: [],
      });
      setCategoryOrder([]);
      setClipData([]);
    }

    // 렌더링 시작
    renderCategoryList();
    document.querySelector(".clip-list").classList.add("hidden");
    document.querySelector(".clip-content").classList.add("hidden");
  } else {
    setCurrentUserId(null);

    console.log("🚪 로그아웃 상태");
    app.classList.add("hidden");
    loginScreen.classList.remove("hidden"); // ✅ 로그인 배경 다시 표시
    logoutBtn.classList.add("hidden"); // ✅ 로그아웃 버튼 숨김
    darkModeToggle.classList.add("hidden"); // ✅ 다크모드 토글 숨김
  }
});
const logoutImg = document.getElementById("logout-img");
const toggleCheckbox = document.getElementById("toggle-darkmode");

function updateLogoutImage(isDark) {
  logoutImg.src = isDark
    ? "./image/logoutForDark.png"
    : "./image/logoutForBright.png";
}

toggleCheckbox.addEventListener("change", () => {
  const isDark = toggleCheckbox.checked;
  document.body.classList.toggle("dark-mode", toggleCheckbox.checked);
  localStorage.setItem("theme", toggleCheckbox.checked ? "dark" : "light");
  updateLogoutImage(isDark);
});

// 페이지 로드시 상태 복원
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  const isDark = savedTheme === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  toggleCheckbox.checked = isDark;
  updateLogoutImage(isDark);
});

document.getElementById("login-btn").addEventListener("click", () => {
  signInWithPopup(auth, provider).catch((err) => {
    alert("로그인 오류: " + err.message);
  });
});

document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth).catch((err) => {
    alert("로그아웃 오류: " + err.message);
  });
});

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

  // clipData.push(newClip);
  setClipData([...clipData, newClip]); // 배열을 업데이트 함수로 넘김
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

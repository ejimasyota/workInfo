document.addEventListener("DOMContentLoaded", function () {
  /* 事前定義 */
  // 1. 基本色設定ボタン群
  const colorButtons = document.querySelectorAll(".CollorSetting");
  // 2. ヘッダー
  const header = document.querySelector(".HeaderInfo");

  /* 保存された色クラスがあれば、初期適用 */
  ApplyHeaderColor();

  /* 背景色の設定処理 */
  colorButtons.forEach((button) => {
    /* ボタンクリック時 */
    button.addEventListener("click", () => {
      /* 色クラスを取得 */
      const colorClass = Array.from(button.classList).find((Class) =>
        Class.startsWith("SettingColor-")
      );

      /* 背景色の設定 */
      if (colorClass) {
        // 1. DefoultHeaderクラスを除去
        header.classList.remove("DefoultHeader");
        // 2. 既存のSettingColor-*クラスを除去
        Array.from(header.classList).forEach((cls) => {
          if (cls.startsWith("SettingColor-")) {
            header.classList.remove(cls);
          }
        });
        // 3. 新しい色クラスを適用
        header.classList.add(colorClass);
        // 4. localStorageに保存
        localStorage.setItem("selectedHeaderColor", colorClass);
      }
    });
  });
});

/**
 * 戻るイベント
 */
function backPage() {
  window.history.back();
}

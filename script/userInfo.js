document.addEventListener("DOMContentLoaded", function () {
  /* 事前定義 */
  // 1.基本色設定ボタン群
  const colorButtons = document.querySelectorAll(".CollorSetting");
  // 2.ヘッダー
  const header = document.querySelector(".HeaderInfo");

  /* 保存された色クラスがあれば、初期適用 */
  // 1.ストレージ取得
  const savedColorClass = localStorage.getItem("selectedHeaderColor");
  // 2.クラス設定(後勝ち)
  if (savedColorClass) {
    Array.from(header.classList).forEach((Class)=>{
      header.classList.remove(Class)
    });
    header.classList.add("HeaderInfo", savedColorClass);
  }

  /* 背景色の設定処理 */
  colorButtons.forEach((button) => {
    /* ボタンクリック時 */
    button.addEventListener("click", () => {
      /* 色クラスを取得 */
      const colorClass = Array.from(button.classList).find((Class) =>
        Class.startsWith("SettingColor-")
      );

      /* 背景色のクラスを削除(後勝ちでいいけど念のため) */
      if (colorClass) {
        Array.from(header.classList).forEach((Class)=>{
          header.classList.remove(Class)
        });

        /* 新しい色クラスを適用 */
        header.classList.add("HeaderInfo", colorClass);

        /* localStorageに保存 */
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

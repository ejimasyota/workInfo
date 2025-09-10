document.addEventListener("DOMContentLoaded", function () {
  /* 事前定義 */
  // 1.基本色設定ボタン群
  const colorButtons = document.querySelectorAll(".CollorSetting");
  // 2.ヘッダー
  const header = document.querySelector("header");

  /* 保存された色クラスがあれば、初期適用 */
  // 1.ストレージ取得
  const savedColorClass = localStorage.getItem("selectedHeaderColor");
  // 2.クラス設定(後勝ち)
  if (savedColorClass) {
    header.classList.add(savedColorClass);
  }

  /* 背景色の設定処理 */
  colorButtons.forEach((button) => {
    /* ボタンクリック時 */
    button.addEventListener("click", () => {
      /* 色クラスを取得 */
      const colorClass = Array.from(button.classList).find((cls) =>
        cls.startsWith("SettingColor-")
      );

      /* 背景色のクラスを削除(後勝ちでいいけど念のため) */
      if (colorClass) {
        header.classList.remove(
          "SettingColor-green",
          "SettingColor-red",
          "SettingColor-black",
          "SettingColor-blue",
          "SettingColor-yellow",
          "SettingColor-purple",
          "SettingColor-orange",
          "SettingColor-pink",
          "SettingColor-brown",
          "SettingColor-gray",
          "SettingColor-cyan",
          "SettingColor-lime"
        );

        /* 新しい色クラスを適用 */
        header.classList.add(colorClass);

        /* localStorageに保存 */
        localStorage.setItem("selectedHeaderColor", colorClass);
      }
    });
  });

  /* 端末のIPアドレスを取得し、セットする処理 */
  // GetIpAddress();
});

/**
 * IPアドレスの取得処理
 */
async function GetIpAddress() {
  /* 定義 */
  // 1.IPアドレスフォーム
  const ipAddressForm = document.getElementById("ipAddressForm");

  /* IPアドレス取得処理 */
  try {
    // 1.外部APIを利用してIPアドレスを取得
    const response = await fetch("https://api.ipify.org?format=json");
    // 2.例外発生時はthrow
    if (!response.ok) {
      throw new Error("ネットワークエラー");
    }
    // 3.JSONデータを取得
    const IPADDRESS = await response.json();
    // 4.IPアドレスをフォームにセット
    ipAddressForm.value = IPADDRESS.ip;
    /* 例外処理 */
  } catch (error) {
    // 1.エラーログ
    console.error("IPアドレスの取得に失敗 :", error);
    // 2.フォームに取得失敗をセット
    ipAddressForm.value = "取得失敗";
  }
}

/**
 * 戻るイベント
 */
function backPage() {
  window.history.back();
}

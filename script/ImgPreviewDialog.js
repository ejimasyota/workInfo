class ImagePreviewDialog {
  /**
   * 画像を拡大表示するダイアログ
   * @param {string} ImageSrc 表示する画像データのソース
   * @returns
   */
  ShowImagePreview(ImageSrc = "") {
    return new Promise((resolve) => {
      /* ==========================================================
       * ダイアログ本体の作成
       * ========================================================== */
      // 1.グループ要素作成
      const dialogContainer = document.createElement("div");
      // 2.クラス設定
      dialogContainer.classList.add("MessageDialog", "w-auto");

      /* ==========================================================
       * 背景クリックの無効化
       * ========================================================== */
      // 1.クラス設定
      document.body.classList.add("DialogActive");

      /* ==========================================================
       * 画像プレビューエリアの作成
       * ========================================================== */
      // 1.画像表示用のコンテナ作成
      const imgWrapper = document.createElement("div");
      // 2.クラス設定
      imgWrapper.className = "FullImageWrapper";

      // 3.画像要素の作成
      const imgElement = document.createElement("img");
      // 4.画像ソース設定
      imgElement.src = ImageSrc;
      // 5.クラス設定
      imgElement.className = "FullPreviewImage";

      /* ==========================================================
       * ボタンコンテナの作成
       * ========================================================== */
      // 1.グループ要素作成
      const ButtonContainer = document.createElement("div");
      // 2.クラスの設定
      ButtonContainer.className = "SummaryDialogButtonForm";

      /* ==========================================================
       * 閉じるボタンの作成
       * ========================================================== */
      // 1.ボタン要素作成
      const closeButton = document.createElement("button");
      // 2.ラベル設定
      closeButton.innerHTML = "閉じる";
      // 3.クラス設定
      closeButton.classList.add("ButtonInfo");

     /* ==========================================================
      * バックドロップの作成
      * ========================================================== */
      // 1. グループ要素作成
      const DialogBackDrop = document.createElement("div");
      // 2. クラス名設定
      DialogBackDrop.className = "DialogBackDrop";

      /* ==========================================================
       * 各要素の格納
       * ========================================================== */
      // 1.画像をワッパーに格納
      imgWrapper.appendChild(imgElement);
      // 2.ワッパーをダイアログ本体に格納
      dialogContainer.appendChild(imgWrapper);
      // 3.閉じるボタンをボタンコンテナに格納
      ButtonContainer.appendChild(closeButton);
      // 4.ボタンコンテナをダイアログ本体に格納
      dialogContainer.appendChild(ButtonContainer);
      // 5. バックドロップをボディに追加
      document.body.appendChild(DialogBackDrop);
      // 6.ダイアログ本体をボディに格納
      document.body.appendChild(dialogContainer);

      /* ==========================================================
       * 閉じる処理の定義
       * ========================================================== */
      const closeDialog = () => {
        // 1.ダイアログを削除
        if (document.body.contains(dialogContainer) && document.body.contains(DialogBackDrop)) {
          document.body.removeChild(dialogContainer);
          document.body.removeChild(DialogBackDrop);
        }
        // 2.スタイル復旧
        document.body.classList.remove("DialogActive");
        // 3.イベント削除
        document.removeEventListener("keydown", escHandler);
        // 4.Promise完了
        resolve();
      };

      /* ==========================================================
       * イベントリスナー定義
       * ========================================================== */
      // 1.ESCキー
      const escHandler = (e) => {
        if (e.key === "Escape") closeDialog();
      };
      document.addEventListener("keydown", escHandler);

      // 2.閉じるボタンクリック
      closeButton.onclick = () => closeDialog();

      // 3.背景クリック（画像の周囲をクリックしても閉じる）
      dialogContainer.onclick = (e) => {
        if (e.target === dialogContainer) closeDialog();
      };
    });
  }
}

/* ==========================================================
 * イベントリスナー定義
 * ========================================================== */
window.ImagePreviewDialog = ImagePreviewDialog;
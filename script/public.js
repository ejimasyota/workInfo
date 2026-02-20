class DialogInfo {
  /* ダイアログの表示処理 */
  ShowDialog(message = "") {
    // 1.ダイアログの親要素の作成
    const MessageDialog = document.createElement("div");
    // 2.ダイアログの親要素のクラス名を設定
    MessageDialog.className = "MessageDialog";
    // 3.ダイアログ表示テキストの作成
    const dialogMessage = document.createElement("p");
    // 4.ダイアログ表示テキストにメッセージを設定
    dialogMessage.textContent = message;
    // 5.表示テキストをセット
    MessageDialog.appendChild(dialogMessage);
    // 6.閉じるボタンの要素を作成
    const closeButton = document.createElement("button");
    // 7.閉じるボタンのテキストを設定
    closeButton.textContent = "閉じる";
    // 8.閉じるボタンのクラス名を設定
    closeButton.classList.add("ButtonInfo");
    // 9.閉じるボタンをダイアログに追加
    MessageDialog.appendChild(closeButton);
    // 14.ダイアログ背景用の要素を作成
    const backdrop = document.createElement("div");
    // 15.クラス名を設定
    backdrop.className = "DialogBackDrop";
    // 16.バックドロップをボディに追加
    document.body.appendChild(backdrop);
    // 17.ダイアログ本体をボディに追加
    document.body.appendChild(MessageDialog);
    // 18.ダイアログ表示テキストのクラスを設定 --2025/08/19
    dialogMessage.className = "dialogMessage";

    /* 閉じるボタンの押下時イベントを定義 */
    closeButton.onclick = () => {
      // 1.ダイアログを閉じる
      document.body.removeChild(MessageDialog);
      // 2.バックドロップを閉じる
      document.body.removeChild(backdrop);
    };
  }

  /* コンファームの表示処理 */
  ShowConfirmDialog(message = "") {
    return new Promise((resolve) => {
      // 1.ダイアログの親要素の作成
      const MessageDialog = document.createElement("div");
      // 2.ダイアログの親要素のクラス名を設定
      MessageDialog.className = "MessageDialog";
      // 3.ダイアログ表示テキストの作成
      const dialogMessage = document.createElement("p");
      // 4.ダイアログ表示テキストにメッセージを設定
      dialogMessage.textContent = message;
      // 5.表示テキストをセット
      MessageDialog.appendChild(dialogMessage);
      // 6.[はい]ボタンの要素を作成
      const yesButton = document.createElement("button");
      // 7.[はい]ボタンのテキストを設定
      yesButton.textContent = "はい";
      // 8.[はい]ボタンのクラス名を設定
      yesButton.classList.add("ButtonInfo");
      // 9.[いいえ]ボタンの要素を作成
      const noButton = document.createElement("button");
      // 10.[いいえ]ボタンのテキストを設定
      noButton.textContent = "いいえ";
      // 11.[いいえ]ボタンのクラス名を設定
      noButton.classList.add("ButtonInfo");
      // 12.ボタン要素の親クラスを設定
      const ButtonForm = document.createElement("div");
      // 13.ボタン親要素のクラス名を設定
      ButtonForm.className = "ConfirmButtonForm";
      // 14.[はい]ボタンを親要素に設定
      ButtonForm.appendChild(yesButton);
      // 15.[いいえ]ボタンを親要素に設定
      ButtonForm.appendChild(noButton);
      // 16.ボタン要素をダイアログに設定
      MessageDialog.appendChild(ButtonForm);
      // 17.ダイアログ背景用の要素を作成
      const backdrop = document.createElement("div");
      // 18.クラス名を設定
      backdrop.className = "DialogBackDrop";
      // 19.バックドロップをボディに追加
      document.body.appendChild(backdrop);
      // 20.ダイアログ本体をボディに追加
      document.body.appendChild(MessageDialog);
      // 21.ダイアログ表示テキストのクラスを設定 --2025/08/19
      dialogMessage.className = "dialogMessage";

      /* [はい]ボタンの押下時イベントを定義 */
      yesButton.onclick = () => {
        // 1.ダイアログを閉じる
        document.body.removeChild(MessageDialog);
        // 2.バックドロップを閉じる
        document.body.removeChild(backdrop);
        // 3.結果を返す
        resolve(true);
      };

      /* [いいえ]ボタンの押下時イベントを定義 */
      noButton.onclick = () => {
        // 1.ダイアログを閉じる
        document.body.removeChild(MessageDialog);
        // 2.バックドロップを閉じる
        document.body.removeChild(backdrop);
        // 3.結果を返す
        resolve(false);
      };
    });
  }
}
/* クラスの公開 */
// 1.ダイアログクラス
window.DialogInfo = DialogInfo;

/* ==========================================================
 * ヘッダーカラー共通適用処理
 * ========================================================== */
/**
 * ヘッダーの背景色をlocalStorageから読み込み適用する
 * 全ページ共通で呼び出す
 */
function ApplyHeaderColor() {
  // 1. ヘッダー要素を取得
  const headerElement = document.querySelector(".HeaderInfo");
  // 2. ストレージから背景色取得
  const savedColorClass = localStorage.getItem("selectedHeaderColor");

  // 3. ヘッダーと背景色が存在する場合
  if (headerElement && savedColorClass) {
    // 1. DefoultHeaderクラスを除去（デフォルト色を上書きするため）
    headerElement.classList.remove("DefoultHeader");
    // 2. 既存のSettingColor-*クラスを除去
    Array.from(headerElement.classList).forEach((cls) => {
      if (cls.startsWith("SettingColor-")) {
        headerElement.classList.remove(cls);
      }
    });
    // 3. 保存された背景色クラスを追加
    headerElement.classList.add(savedColorClass);
  }
}

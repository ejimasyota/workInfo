/**
 * コードに紐づくメッセージを返す処理
 * 作成年月日 : 2025/11/04
 * @param type CDの種別を設定
 * @param cd   メッセージのCDを設定
 * @param msg  メッセージ内に埋め込みたい値
 * @return     メッセージの文字列を返す
 */
function GetMessageInfo(type, cd, msg = "") {
  /* ------------------------------
   *  1. 定義
   * ------------------------------*/
  // 1.戻り値を保持する変数
  let ReturnMessage = "";

  /* ------------------------------
   *  2. バリデーションチェック
   * ------------------------------*/
  // 1.CDの種別が取得できない場合
  if (!type) {
    return "";
  }
  // 2.CDが取得できない場合
  if (!cd) {
    return "";
  }

  /* ------------------------------
   *  3. メッセージ設定処理
   * ------------------------------*/
  /* 正常系 */
  if (type === "info") {
    switch (cd) {
      // 1.バックアップ復元成功
      case "001":
        ReturnMessage = "バックアップの復元が完了しました。";
        break;
      // 2.全データ削除成功
      case "002":
        ReturnMessage = "全てのデータを削除しました。";
        break;
      // 3.セクション内投稿削除成功
      case "003":
        ReturnMessage = "ページ内の全ての投稿を削除しました。";
    }
  } else if (type === "error") {
    /* 異常系 */
    switch (cd) {
      // 1.ファイル読み込み失敗
      case "001":
        ReturnMessage =
          "ファイルを認識できませんでした。再度実行してください。";
        break;
      // 2.データ取得失敗
      case "002":
        ReturnMessage = "データが存在しません。";
        break;
      // 3.投稿重複
      case "003":
        ReturnMessage =
          "重複した内容の投稿が存在します。タイトルを変更してください。";
        break;
      // 4.投稿編集中エラー
      case "004":
        ReturnMessage =
          "編集中の項目が存在します。編集を完了してから削除を行ってください。";
        break;
      // 5.データ取得失敗
      case "005":
        ReturnMessage = "データの取得に失敗しました。再度実行してください。";
        break;
      // 6.未入力エラー
      case "006":
        ReturnMessage = `${msg}を入力してください。`;
        break;
      // 7.未選択エラー
      case "007":
        ReturnMessage = `${msg}が選択されていません。`;
        break;
      // 8.投稿が存在しない
      case "008":
        ReturnMessage = "投稿が存在しません。";
        break;
    }
  } else if (type === "confirm") {
    /* 選択系 */
    switch (cd) {
      // 1.入力途中での遷移
      case "001":
        ReturnMessage = "入力中の内容が失われますが、戻りますか？";
        break;
      // 2.項目削除
      case "002":
        ReturnMessage = `${msg}の削除を行います。よろしいですか？`;
        break;
      // 3.削除確認
      case "003":
        ReturnMessage = "本当に削除しますか？";
        break;
      // 4.バックアップ復元
      case "004":
        ReturnMessage = "バックアップの復元を行いますか?";
        break;
    }
  }

  /* ------------------------------
   *  4. 戻り値設定
   * ------------------------------*/
  // 1.戻り値を設定
  return ReturnMessage;
}

/**
 * 現在年月日を作成し返す
 */
function CreatYear() {
  // 1.現在年月日を取得
  const now = new Date();
  // 2.年を取得
  const year = now.getFullYear();
  // 3.月を取得
  const month = String(now.getMonth() + 1).padStart(2, "0");
  // 4.日を取得
  const day = String(now.getDate()).padStart(2, "0");
  // 5.時間を取得
  const hours = String(now.getHours()).padStart(2, "0");
  // 6.分を取得
  const minutes = String(now.getMinutes()).padStart(2, "0");
  // 7.秒を取得
  const seconds = String(now.getSeconds()).padStart(2, "0");
  // 8.整形して返す
  return `${year}年${month}月${day}日_${hours}時${minutes}分${seconds}秒`;
}

/**
 * 直線を返す処理　--2025/08/20 コードが汚くなりすぎたので作成
 */
function CreateLine(LineNumber = 150) {
  // 1. 直線を保持する
  let Line = "";
  // 2. 指定文字数の直線文字列を作成
  for (let Index = 0; Index < LineNumber; Index++) {
    Line += "_";
  }
  // 3. 呼び出しもとに返す
  return Line;
}
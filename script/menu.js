/* 事前定義 */
// 1.メニューリストに表示する内容(今の構成ではkeyの値を変えたらデータにアクセスできなくなるので変えてはならない!!)
const menuList = [
  { section: "自己学習", key: "調べたこと", icon: "" },
  { section: "業務活用", key: "パスワード", icon: "" },
  { section: "基礎知識", key: "アクセス修飾子一覧", icon: "" },
  { section: "業務活用", key: "業務内のメモ", icon: "" },
  { section: "業務活用", key: "電話対応のメモ", icon: "" },
  { section: "業務活用", key: "勉強会のメモ", icon: "" },
  { section: "業務活用", key: "用語", icon: "" },
  { section: "基本情報", key: "基礎理論", icon: "" },
  { section: "基本情報", key: "アルゴリズム", icon: "" },
  { section: "基本情報", key: "コンピュータ構成", icon: "" },
  { section: "基本情報", key: "システム構成", icon: "" },
  { section: "基本情報", key: "ソフトウェア", icon: "" },
  { section: "基本情報", key: "ハードウェア", icon: "" },
  { section: "基本情報", key: "ユーザインタフェース", icon: "" },
  { section: "基本情報", key: "情報メディア", icon: "" },
  { section: "基本情報", key: "データベース", icon: "" },
  { section: "基本情報", key: "ネットワーク", icon: "" },
  { section: "基本情報", key: "セキュリティ", icon: "" },
  { section: "基本情報", key: "システム開発", icon: "" },
  { section: "基本情報", key: "ソフトウェア開発", icon: "" },
  { section: "基本情報", key: "プロジェクトマネジメント", icon: "" },
  { section: "基本情報", key: "サービスマネジメント", icon: "" },
  { section: "基本情報", key: "システム監査", icon: "" },
  { section: "基本情報", key: "システム戦略", icon: "" },
  { section: "基本情報", key: "システム企画", icon: "" },
  { section: "基本情報", key: "経営戦略マネジメント", icon: "" },
  { section: "基本情報", key: "技術戦略マネジメント", icon: "" },
  { section: "基本情報", key: "ビジネスインダストリ", icon: "" },
  { section: "基本情報", key: "企業活動", icon: "" },
  { section: "基本情報", key: "法務", icon: "" },
  { section: "基本情報", key: "プロジェクトマネジメント", icon: "" },
];

// 2.セクションリスト(これも上記と同様。いずれlocalStrageに保持するように変更して、カプセル化を行う)
const sectionList = [
  { section: "基礎知識", icon: "" },
  { section: "業務活用", icon: "" },
  { section: "自己学習", icon: "" },
  { section: "基本情報", icon: "" },
];

/* 画面ロード時処理 */
document.addEventListener("DOMContentLoaded", function () {
  /* 事前定義 */
  // 1.セクションの要素を取得
  const Section = document.getElementById("sectionContainer");
  // 2.メニューリストの要素を取得
  const container = document.getElementById("menuContainer");

  /* セクションリストの表示処理 */
  sectionList.forEach((item) => {
    // 1.ボタン要素作成
    const SectionButton = document.createElement("button");
    // 2.ボタンのラベル要素を作成
    const SectionLabel = document.createElement("p");
    // 3.ラベル内容を設定
    SectionLabel.textContent = item.section;
    // 4.ラベルクラスを設定
    SectionLabel.className = "sectionText";
    // 5.ボタンにラベルを追加
    SectionButton.appendChild(SectionLabel);
    // 6.コンテナにボタンを追加
    Section.appendChild(SectionButton);
    // 7.ボタンのクラスを設定
    SectionButton.className = "sectionButton";

    /* セクションボタンクリック時処理 */
    SectionButton.onclick = () => {
      // 1.メニューの表示コンテナをクリア
      container.innerHTML = "";
      // 2.メニューリストをフィルタリング
      const SectionContent = menuList.filter(
        (menu) => menu.section === item.section
      );

      /* セクションボタンの状態設定 */
      document.querySelectorAll(".sectionButton.selected").forEach((sec) => {
        // 1.背景色のクラスを削除
        sec.classList.remove("selected");
      });
      // 2.選択されたセクションに選択状態を付与
      SectionButton.classList.add("selected");

      /* 絞り込んだメニューの表示処理 */
      SectionContent.forEach((menuItem) => {
        // 1.ボタン要素作成
        const menuButton = document.createElement("button");
        // 2.ボタンのラベルをメニュー名で設定
        const menuText = document.createElement("p");
        // 3.ラベルの値にメニューのキーを設定
        menuText.textContent = menuItem.key;
        // 4.ラベルのクラスを設定
        menuText.className = "menuText";
        // 5.ボタンにラベルを追加
        menuButton.appendChild(menuText);

        /* アイコンがある場合は画像要素を作成してアイコンに設定 */
        if (menuItem.icon) {
          // 1.画像要素作成
          const img = document.createElement("img");
          // 2.画像のパスを設定
          img.src = `../asetts/icon/${menuItem.icon}`;
          // 3.画像のクラスを設定
          img.className = "icon";
          // 4.ボタンに画像を追加
          menuButton.appendChild(img);
        }

        /* ボタンのクリックイベント設定 */
        menuButton.onclick = () => {
          // 1.クリック時にメモ画面へ遷移(キーをパラメータとして渡す)
          window.location.href = `memo.html?key=${encodeURIComponent(
            menuItem.key
          )}`;
          // 2.セッションに保持されたセクション情報の削除
          if (sessionStorage.getItem("SectionInfo")) {
            sessionStorage.removeItem("SectionInfo");
          }
          // 3.セクション情報をストレージに保存
          sessionStorage.setItem("SectionInfo", menuItem.section);
        };
        // 2.コンテナにボタンを追加
        container.appendChild(menuButton);
        // 3.ボタンのクラスを設定
        menuButton.className = "menuButton";
      });
    };

    /* 画面からの戻り時であれば、該当画面のセクションを表示する --2025/08/20 */
    if (sessionStorage.getItem("SectionInfo")) {
      // 1.セッションに保持されているセクション情報を保持する
      const SectionInfo = sessionStorage.getItem("SectionInfo");

      /* セッションの保持されたセクションと一致するセクションがあれば処理 */
      if (SectionInfo === item.section) {
        // 1.セクションに遷移
        SectionButton.click();
        // 2.セクション情報を削除
        sessionStorage.removeItem("SectionInfo");
      }
    }
  });
});

/**
 * バックアップ読み取りボタン押下時
 */
function ReadBackUp() {
  // 1.ダイアログのインスタンスを作成
  const dialog = new DialogInfo(
    "バックアップの復元を行いますか? ※事前バックアップの作成を推奨します。"
  );

  // 2.ダイアログを表示
  dialog.ShowConfirmDialog().then((result) => {
    // 3.[はい]が押下された場合は画面を戻る
    if (result) {
      // 1.ファイル要素のイベントを発火
      document.getElementById("csvFile").click();
      // 4.[いいえ]が押下された場合は処理終了
    } else {
      return;
    }
  });
}

/**
 * バックアップ読み取りボタン押下時のファイル読み取り処理
 */
document.getElementById("csvFile").addEventListener("change", (event) => {
  /* 事前定義 */
  // 1.選択されたファイルを取得
  const BackUpFile = event.target.files[0];
  // 2.読み取り用reader
  const FileRead = new FileReader();

  /* バックアップファイルを選択していないか、読み取れなかった場合 */
  if (!BackUpFile) {
    // 1.アラート表示
    alert("ファイルを認識できませんでした。再度実行してください。");
    // 2.処理終了
    return;
  }

  /* ファイルの読み込み */
  FileRead.readAsText(BackUpFile);

  /* 読み取り処理実行 */
  FileRead.onload = (e) => {
    // 1.バックアップ内容の取得
    const BuckUpInfo = e.target.result;
    // 2.念のためストレージの内容を初期化
    localStorage.clear();
    // 3.バックアップから取得した内容をストレージにセット
    localStorage.setItem("savedPosts", BuckUpInfo);
    // 4.処理終了
    alert("バックアップの復元が完了しました。");
    // 5.画面の再読み込み
    location.reload();
  };

  /* 例外発生時 */
  FileRead.onerror = (e) => {
    // 1.デバッグログ
    console.error(e);
    // 2.アラート表示
    alert("ファイルの読み込みに失敗しました。");
  };
});

/**
 * バックアップ作成ボタン
 */
function CreateFullBackUp() {
  /* 事前定義 */
  // 1.投稿された内容の取得
  const BuckUpData = localStorage.getItem("savedPosts").toString();
  /* バックアップするようなデータが存在しない場合 */
  if (!BuckUpData) {
    // 1.アラート表示
    alert("バックアップデータが存在しません");
    // 2.処理終了
    return;
  }

  /* ダウンロード処理 */
  // 1.バイナリデータの作成
  const blob = new Blob([BuckUpData], { type: "text/csv;charset=utf-8;" });
  // 2.URLの作成
  const url = URL.createObjectURL(blob);
  // 3.アンカーの作成
  const a = document.createElement("a");
  // 4.遷移先に、項番2で作成したURLを設定
  a.href = url;
  // 5.ファイル名設定
  a.download = `学習データバックアップ_${CreatYear()}.csv`;
  // 6.アンカークリック時のイベントを発火
  a.click();
  // 7.URLの削除(ネット上のコピペのため不明点は調べる)
  URL.revokeObjectURL(url);
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

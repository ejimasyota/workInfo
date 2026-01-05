/* 事前定義 */
// 1.メニューリストに表示する内容
/**********************************************************************************
 * ※ 今の構成ではkeyの値を変えたらデータにアクセスできなくなるので変えてはならない!! ※ *
 **********************************************************************************/
const menuList = [
  { section: "自己学習", key: "調べたこと", icon: "" },
  { section: "自己学習", key: "アクセス修飾子一覧", icon: "" },
  { section: "自己学習", key: "Web通信について", icon: "" },
  { section: "自己学習", key: "ネットワークの基礎", icon: "" },
  { section: "自己学習", key: "サーバについて", icon: "" },
  { section: "自己学習", key: "正規表現について", icon: "" },
  { section: "業務活用", key: "議事録", icon: "" },
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
  { section: "基本情報", key: "間違えた問題", icon: "" },
  { section: "基本情報", key: "間違えた問題(計算)", icon: "" },
  { section: "基本情報", key: "まとめて覚えたい内容", icon: "" },
  { section: "基本情報", key: "間違えそうな問題の重点対策", icon: "" },
  { section: "基本情報", key: "計算公式", icon: "" },
  { section: "言語学習", key: "PHP", icon: "" },
  { section: "言語学習", key: "SQL", icon: "" },
  { section: "言語学習", key: "JavaScript", icon: "" },
  { section: "OS", key: "Linux", icon: "" },
  { section: "エディター", key: "Vim", icon: "Vim.png" },
  { section: "個人用", key: "参考サイト", icon: "" },
  { section: "個人用", key: "プロジェクトURL", icon: "" },
  { section: "個人用", key: "アイデア", icon: "" },
  { section: "プロジェクト", key: "宮崎", icon: "" },
];

// 2.セクションリスト(これも上記と同様。いずれlocalStrageに保持するように変更して、カプセル化を行う)
const sectionList = [
  { section: "業務活用", icon: "" },
  { section: "自己学習", icon: "" },
  { section: "基本情報", icon: "" },
  { section: "言語学習", icon: "" },
  { section: "OS", icon: "" },
  { section: "エディター", icon: "" },
  { section: "個人用", icon: "" },
  { section: "プロジェクト", icon: "" },
];

// 3.ダイアログのインスタンスを作成
const dialog = new DialogInfo();

/* 画面ロード時処理 */
document.addEventListener("DOMContentLoaded", function () {
  /* ------------------------------
   * ヘッダーカラーの設定
   * 作成日 : 2025/09/08
   * 更新日 : 2025/12/22
   * ------------------------------*/
  /* 1. 事前定義 */
  // 1.ヘッダー要素を取得
  const HeaderColor = document.querySelector(".HeaderInfo");
  // 2.ストレージから背景色取得
  const SavedColorClass = localStorage.getItem("selectedHeaderColor");
    
  /* 2. ヘッダーと背景色が存在する場合 */
  if (HeaderColor && SavedColorClass) {
    // 1. ヘッダーのクラスをすべて除去
    Array.from(HeaderColor.classList).forEach((Class)=>{
      HeaderColor.classList.remove(Class)
    });
    // 2. ヘッダーの基底クラスとストレージに保管された背景色クラスを設定
    HeaderColor.classList.add("HeaderInfo", SavedColorClass);
  }

  /* 事前定義 */
  // 1.セクションの要素を取得
  const Section = document.getElementById("SectionContainer");
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
          img.src = `/asetts/img/icon/${menuItem.icon}`;
          // 3.画像のクラスを設定
          img.className = "IconImg";
          // 4.ボタンに画像を追加
          menuButton.appendChild(img);
        }

        /* ボタンのクリックイベント設定 */
        menuButton.onclick = () => {
          // 1.クリック時にメモ画面へ遷移(キーをパラメータとして渡す)
          window.location.href = `/pages/memo.html?key=${encodeURIComponent(
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
  // 1.ダイアログを表示
  dialog.ShowConfirmDialog(GetMessageInfo("confirm", "004")).then((result) => {
    /* [はい]が押下された場合 */
    if (result) {
      // 1.ファイル要素のイベントを発火
      document.getElementById("csvFile").click();
    } else {
      /* [いいえ]が押下された場合 */
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
    dialog.ShowDialog(GetMessageInfo("error", "001"));
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
    dialog.ShowDialog(GetMessageInfo("info", "001"), () => {
      // 5.画面の再読み込み
      window.location.reload(true);
    });
  };

  /* 例外発生時 */
  FileRead.onerror = (e) => {
    // 1.デバッグログ
    console.error(e);
    // 2.エラーダイアログ表示
    dialog.ShowDialog(GetMessageInfo("error", "001"), () => {
      // 3.画面の再読み込み
      location.reload();
    });
  };
});

/**
 * バックアップ作成ボタン
 */
function CreateFullBackUp() {
  /* バリデーションチェック --2025/11/04 */
  if (!localStorage.getItem("savedPosts")) {
    // 1.ダイアログ表示 --同期処理に修正
    dialog.ShowDialog(GetMessageInfo("error", "002"));
    // 2.処理終了
    return;
  }

  /* 事前定義 */
  // 1.投稿された内容の取得
  const BuckUpData = localStorage.getItem("savedPosts").toString();

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
  a.download = `フルバックアップ_${CreatYear()}.csv`;
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

/**
 * ユーザー設定画面への遷移
 */
function UserInfo() {
  // 1.ユーザー設定画面へ遷移
  window.location.href = "workInfo/pages/userInfo.html";
}

/**
 * 全データ削除
 */
function AllDataDelete() {
  // 1.ダイアログを表示
  dialog
    .ShowConfirmDialog(GetMessageInfo("confirm", "002", "全てのデータ"))
    .then((result) => {
      /* [はい]が押下された場合 */
      if (result) {
        // 1.データキーを指定して削除
        localStorage.removeItem("savedPosts");
        // 2.ダイアログ表示
        dialog.ShowDialog(GetMessageInfo("info", "002"), () => {
          // 3.画面の再読み込み
          location.reload();
        });
      } else {
        /* [いいえ]が押下された場合 */
        return;
      }
    });
}

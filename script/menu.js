/* ==========================================================
 * 事前定義
 * ========================================================== */
// 1. デフォルトメニューリスト（初期データ用）
/**********************************************************************************
 * ※ 初回ロード時にlocalStorageへUUID付きで格納される初期データ                    *
 * ※ 以降のデータ管理はすべてlocalStorageを通じて行う                              *
 **********************************************************************************/
const DEFAULT_MENU_LIST = [];

// 2. デフォルトセクションリスト（初期データ用）
const DEFAULT_SECTION_LIST = [];

// 3. ダイアログのインスタンスを作成
const dialog = new DialogInfo();

/* ==========================================================
 * localStorageアクセサ関数
 * ========================================================== */
/**
 * セクションリストをlocalStorageから取得する
 * @returns {Array} セクションリスト
 */
function GetSectionList() {
  return JSON.parse(localStorage.getItem("sectionList") || "[]");
}

/**
 * メニューリストをlocalStorageから取得する
 * @returns {Array} メニューリスト
 */
function GetMenuList() {
  return JSON.parse(localStorage.getItem("menuList") || "[]");
}

/**
 * メニューリストをlocalStorageに保存する
 * @param {Array} menuList メニューリスト
 */
function SaveMenuList(menuList) {
  localStorage.setItem("menuList", JSON.stringify(menuList));
}

/**
 * セクションリストをlocalStorageに保存する
 * @param {Array} sectionList セクションリスト
 */
function SaveSectionList(sectionList) {
  localStorage.setItem("sectionList", JSON.stringify(sectionList));
}

/* ==========================================================
 * ストレージ初期化処理
 * ========================================================== */
/**
 * localStorageにメニュー・セクションデータが存在しない場合、
 * デフォルトデータからUUID付きで初期化する
 */
function InitializeStorageData() {
  if (!localStorage.getItem("sectionList")) {
    localStorage.setItem("sectionList", JSON.stringify([]));
  }

  if (!localStorage.getItem("menuList")) {
    localStorage.setItem("menuList", JSON.stringify([]));
  }

  MigratePostData();
}

/**
 * 既存の投稿データにmenuIdが存在しない場合、
 * legacyKeyを使ってmenuIdを付与する
 */
function MigratePostData() {
  // 1. 投稿データを取得
  const posts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
  // 2. メニューリストを取得
  const menus = JSON.parse(localStorage.getItem("menuList") || "[]");

  // 3. legacyKey -> id のマップを作成
  const keyToIdMap = {};
  menus.forEach((m) => {
    keyToIdMap[m.legacyKey] = m.id;
  });

  // 4. menuIdが未設定の投稿にmenuIdを付与
  let migrated = false;
  posts.forEach((post) => {
    if (!post.menuId && post.key) {
      const menuId = keyToIdMap[post.key];
      if (menuId) {
        post.menuId = menuId;
        migrated = true;
      }
    }
  });

  // 5. 変更があれば保存
  if (migrated) {
    localStorage.setItem("savedPosts", JSON.stringify(posts));
  }
}

/* ==========================================================
 * メニュー削除関連
 * ========================================================== */
/**
 * 指定メニューIDに紐づく投稿データをlocalStorageから削除する
 * @param {string} menuId 削除対象のメニューID
 */
function DeleteMenuPosts(menuId) {
  // 1. 投稿データを取得
  const posts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
  // 2. 対象メニューの投稿を除外
  const filtered = posts.filter((post) => post.menuId !== menuId);
  // 3. 保存
  localStorage.setItem("savedPosts", JSON.stringify(filtered));
}

/**
 * 指定メニューIDをメニューリストから削除する
 * @param {string} menuId 削除対象のメニューID
 */
function DeleteMenuItem(menuId) {
  // 1. メニューリストを取得
  const menus = GetMenuList();
  // 2. 対象メニューを除外
  const filtered = menus.filter((m) => m.id !== menuId);
  // 3. 保存
  SaveMenuList(filtered);
}

/* ==========================================================
 * メニュー追加ダイアログ
 * ========================================================== */
/**
 * メニュー追加ダイアログを表示する
 * @param {string} sectionId 追加先のセクションID
 * @param {HTMLElement} sectionButton 再描画用のセクションボタン要素
 */
function ShowAddMenuDialog(sectionId, sectionButton) {
  /* ---------------------------------------------
   *  1. ダイアログ本体の作成
   * --------------------------------------------- */
  // 1. グループ要素作成
  const dialogContainer = document.createElement("div");
  // 2. クラス設定
  dialogContainer.className = "MessageDialog";

  /* ---------------------------------------------
   *  2. メニュー名入力フォームの作成
   * --------------------------------------------- */
  // 1. ラベル要素作成
  const label = document.createElement("p");
  // 2. ラベル設定
  label.textContent = "メニュー名を入力してください";
  // 3. クラス設定
  label.className = "dialogMessage";

  // 4. 入力フォーム作成
  const input = document.createElement("input");
  // 5. 属性設定
  input.type = "text";
  input.maxLength = 50;
  input.placeholder = "メニュー名";
  input.className = "FormInfo";
  input.style.width = "100%";

  /* ---------------------------------------------
   *  3. ボタンコンテナの作成
   * --------------------------------------------- */
  const btnContainer = document.createElement("div");
  btnContainer.className = "ConfirmButtonForm";

  /* ---------------------------------------------
   *  4. 追加ボタンの作成
   * --------------------------------------------- */
  const addBtn = document.createElement("button");
  addBtn.textContent = "追加";
  addBtn.classList.add("ButtonInfo");

  /* ---------------------------------------------
   *  5. 閉じるボタンの作成
   * --------------------------------------------- */
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "閉じる";
  closeBtn.classList.add("ButtonInfo");

  /* ---------------------------------------------
   *  6. バックドロップの作成
   * --------------------------------------------- */
  const backdrop = document.createElement("div");
  backdrop.className = "DialogBackDrop";

  /* ---------------------------------------------
   *  7. DOM組み立て
   * --------------------------------------------- */
  dialogContainer.appendChild(label);
  dialogContainer.appendChild(input);
  btnContainer.appendChild(addBtn);
  btnContainer.appendChild(closeBtn);
  dialogContainer.appendChild(btnContainer);
  document.body.appendChild(backdrop);
  document.body.appendChild(dialogContainer);

  // 8. 初期フォーカス
  input.focus();

  /* ---------------------------------------------
   *  8. 閉じる処理
   * --------------------------------------------- */
  const closeDialog = () => {
    if (
      document.body.contains(dialogContainer) &&
      document.body.contains(backdrop)
    ) {
      document.body.removeChild(dialogContainer);
      document.body.removeChild(backdrop);
    }
  };

  /* ---------------------------------------------
   *  9. 追加ボタンのクリックイベント
   * --------------------------------------------- */
  addBtn.onclick = () => {
    // 1. 入力値を取得
    const menuName = input.value.trim();

    // 2. バリデーション（空文字）
    if (!menuName) {
      dialog.ShowDialog(GetMessageInfo("error", "006", "メニュー名"));
      return;
    }

    // 3. 重複チェック
    const existingMenus = GetMenuList();
    const isDuplicate = existingMenus.some(
      (m) => m.sectionId === sectionId && m.name === menuName
    );
    if (isDuplicate) {
      dialog.ShowDialog("同じ名前のメニューが既に存在します。");
      return;
    }

    // 4. 新しいメニューを作成
    const newMenu = {
      id: crypto.randomUUID(),
      sectionId: sectionId,
      name: menuName,
      icon: "",
      order: existingMenus.filter((m) => m.sectionId === sectionId).length,
      legacyKey: menuName,
    };

    // 5. メニューリストに追加して保存
    existingMenus.push(newMenu);
    SaveMenuList(existingMenus);

    // 6. ダイアログを閉じる
    closeDialog();

    // 7. セクションを再描画
    sectionButton.click();
  };

  /* ---------------------------------------------
   *  10. 閉じるボタンのクリックイベント
   * --------------------------------------------- */
  closeBtn.onclick = () => {
    closeDialog();
  };
}

/* ==========================================================
 * 画面ロード時処理
 * ========================================================== */
document.addEventListener("DOMContentLoaded", function () {
  /* ---------------------------------------------
   *  1. ストレージデータの初期化
   * --------------------------------------------- */
  InitializeStorageData();

  /* 事前定義 */
  // 1. セクションの要素を取得
  const Section = document.getElementById("SectionContainer");
  // 2. メニューリストの要素を取得
  const container = document.getElementById("menuContainer");
  // 3. localStorageからセクションリストを取得
  const sectionListData = GetSectionList();

  /* セクションリストの表示処理 */
  sectionListData.forEach((item) => {
    // 1. ボタン要素作成
    const SectionButton = document.createElement("button");
    // 2. ボタンのラベル要素を作成
    const SectionLabel = document.createElement("p");
    // 3. ラベル内容を設定
    SectionLabel.textContent = item.name;
    // 4. ラベルクラスを設定
    SectionLabel.className = "sectionText";
    // 5. ボタンにラベルを追加
    SectionButton.appendChild(SectionLabel);

    /* セクション削除ボタンの作成 */
    // 1. 削除ボタン要素作成
    const sectionDeleteBtn = document.createElement("span");
    // 2. ラベル設定
    sectionDeleteBtn.textContent = "×";
    // 3. クラス設定
    sectionDeleteBtn.className = "sectionDeleteButton";

    /* セクション削除ボタンのクリックイベント */
    sectionDeleteBtn.addEventListener("click", (e) => {
      // 1. 親ボタンのクリックイベントを抑止
      e.stopPropagation();

      // 2. 確認ダイアログを表示
      dialog
        .ShowConfirmDialog(
          GetMessageInfo("confirm", "002", item.name)
        )
        .then((result) => {
          /* [はい]が押下された場合 */
          if (result) {
            // 1. セクションに属するメニュー一覧を取得
            const menus = GetMenuList().filter((m) => m.sectionId === item.id);
            // 2. 各メニューに紐づく投稿データを削除
            menus.forEach((menu) => {
              DeleteMenuPosts(menu.id);
            });
            // 3. メニューリストからセクションのメニューを削除
            const filteredMenus = GetMenuList().filter((m) => m.sectionId !== item.id);
            SaveMenuList(filteredMenus);
            // 4. セクションリストからセクションを削除
            const filteredSections = GetSectionList().filter((s) => s.id !== item.id);
            SaveSectionList(filteredSections);
            // 5. 画面の再読み込み
            location.reload();
          }
        });
    });

    // 4. 削除ボタンをセクションボタンに追加
    SectionButton.appendChild(sectionDeleteBtn);
    // 5. コンテナにボタンを追加
    Section.appendChild(SectionButton);
    // 6. ボタンのクラスを設定
    SectionButton.className = "sectionButton";

    /* セクションボタンクリック時処理 */
    SectionButton.onclick = () => {
      // 1. メニューの表示コンテナをクリア
      container.innerHTML = "";
      // 2. メニューリストをフィルタリング
      const SectionContent = GetMenuList().filter(
        (menu) => menu.sectionId === item.id
      );

      /* セクションボタンの状態設定 */
      document.querySelectorAll(".sectionButton.selected").forEach((sec) => {
        // 1. 背景色のクラスを削除
        sec.classList.remove("selected");
      });
      // 2. 選択されたセクションに選択状態を付与
      SectionButton.classList.add("selected");

      /* モバイル版対応 : サイドバーを閉じる */
      if (document.getElementById("sideBar").classList.contains("open")) {
        document.getElementById("sideBar").classList.remove('open')
      }

      /* 絞り込んだメニューの表示処理 */
      SectionContent.forEach((menuItem) => {
        // 1. ボタン要素作成
        const menuButton = document.createElement("button");
        // 2. ボタンのラベルをメニュー名で設定
        const menuText = document.createElement("p");
        // 3. ラベルの値にメニュー名を設定
        menuText.textContent = menuItem.name;
        // 4. ラベルのクラスを設定
        menuText.className = "menuText";
        // 5. ボタンにラベルを追加
        menuButton.appendChild(menuText);

        /* アイコンがある場合は画像要素を作成してアイコンに設定 */
        if (menuItem.icon) {
          // 1. 画像要素作成
          const img = document.createElement("img");
          // 2. 画像のパスを設定
          img.src = `/workInfo/asetts/img/icon/${menuItem.icon}`;
          // 3. 画像のクラスを設定
          img.className = "IconImg";
          // 4. ボタンに画像を追加
          menuButton.appendChild(img);
        }

        /* ボタンのクリックイベント設定 */
        menuButton.onclick = () => {
          // 1. クリック時にメモ画面へ遷移(メニューIDをパラメータとして渡す)
          window.location.href = `/workInfo/pages/memo.html?menuId=${encodeURIComponent(
            menuItem.id
          )}`;
          // 2. セッションに保持されたセクション情報の削除
          if (sessionStorage.getItem("SectionInfo")) {
            sessionStorage.removeItem("SectionInfo");
          }
          // 3. セクション情報をストレージに保存
          sessionStorage.setItem("SectionInfo", item.name);
        };

        /* メニュー削除ボタンの作成 */
        // 1. 削除ボタン要素作成
        const deleteBtn = document.createElement("span");
        // 2. ラベル設定
        deleteBtn.textContent = "×";
        // 3. クラス設定
        deleteBtn.className = "menuDeleteButton";

        /* メニュー削除ボタンのクリックイベント */
        deleteBtn.addEventListener("click", (e) => {
          // 1. 親ボタンのクリックイベントを抑止
          e.stopPropagation();

          // 2. 確認ダイアログを表示
          dialog
            .ShowConfirmDialog(
              GetMessageInfo("confirm", "002", menuItem.name)
            )
            .then((result) => {
              /* [はい]が押下された場合 */
              if (result) {
                // 1. メニューに紐づく投稿データを削除
                DeleteMenuPosts(menuItem.id);
                // 2. メニューリストからメニューを削除
                DeleteMenuItem(menuItem.id);
                // 3. セクションボタンを再クリックして画面を再描画
                SectionButton.click();
              }
            });
        });

        // 4. 削除ボタンをメニューボタンに追加
        menuButton.appendChild(deleteBtn);
        // 5. コンテナにボタンを追加
        container.appendChild(menuButton);
        // 6. ボタンのクラスを設定
        menuButton.className = "menuButton";
      });

      /* メニュー追加ボタンの作成 */
      // 1. ボタン要素作成
      const addMenuButton = document.createElement("button");
      // 2. ラベル設定
      addMenuButton.textContent = "＋ メニュー追加";
      // 3. クラス設定
      addMenuButton.className = "menuButton menuAddButton";

      /* メニュー追加ボタンのクリックイベント */
      addMenuButton.onclick = () => {
        // 1. メニュー追加ダイアログを表示
        ShowAddMenuDialog(item.id, SectionButton);
      };

      // 4. コンテナに追加ボタンを追加
      container.appendChild(addMenuButton);
    };

    /* 画面からの戻り時であれば、該当画面のセクションを表示する --2025/08/20 */
    if (sessionStorage.getItem("SectionInfo")) {
      // 1. セッションに保持されているセクション情報を保持する
      const SectionInfo = sessionStorage.getItem("SectionInfo");

      /* セッションの保持されたセクションと一致するセクションがあれば処理 */
      if (SectionInfo === item.name) {
        // 1. セクションに遷移
        SectionButton.click();
        // 2. セクション情報を削除
        sessionStorage.removeItem("SectionInfo");
      }
    }
  });

  /* ---------------------------------------------
   *  3. セクション追加ボタンの作成
   * --------------------------------------------- */
  // 1. ボタン要素作成
  const sectionAddButton = document.createElement("button");
  // 2. ラベル設定
  sectionAddButton.textContent = "＋ 項目追加";
  // 3. クラス設定
  sectionAddButton.className = "sectionAddButton";

  /* セクション追加ボタンのクリックイベント */
  sectionAddButton.onclick = () => {
    ShowAddSectionDialog();
  };

  // 4. コンテナに追加ボタンを追加
  Section.appendChild(sectionAddButton);

  /* ---------------------------------------------
   *  4. サイドバートグル処理（モバイル用）
   * --------------------------------------------- */
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sideBar");

  if (sidebarToggle && sidebar) {
    // 1. トグルボタンクリックイベント
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }
});


/* ==========================================================
 * バックアップ読み取りボタン押下時
 * ========================================================== */
/**
 * バックアップ読み取りボタン押下時
 */
function ReadBackUp() {
  dialog.ShowConfirmDialog(GetMessageInfo("confirm", "004")).then((result) => {
    if (!result) {
      return;
    }

    OpenBackupFilePicker();
  });
}

function OpenBackupFilePicker() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json,.csv,application/json,text/csv";
  fileInput.style.display = "none";

  fileInput.addEventListener("change", (event) => {
    HandleBackupFileSelected(event, fileInput);
  });

  document.body.appendChild(fileInput);
  fileInput.click();
}

function HandleBackupFileSelected(event, fileInput) {
  const backUpFile = event.target.files && event.target.files[0];
  const fileRead = new FileReader();

  const cleanup = () => {
    if (fileInput && fileInput.parentNode) {
      fileInput.parentNode.removeChild(fileInput);
    }
  };

  if (!backUpFile) {
    cleanup();
    dialog.ShowDialog(GetMessageInfo("error", "001"));
    return;
  }

  fileRead.readAsText(backUpFile);

  fileRead.onload = (e) => {
    const backupInfo = e.target.result;

    try {
      const parsed = JSON.parse(backupInfo);
      localStorage.clear();

      if (parsed.version === 2) {
        localStorage.setItem("savedPosts", JSON.stringify(parsed.savedPosts || []));
        localStorage.setItem("sectionList", JSON.stringify(parsed.sectionList || []));
        localStorage.setItem("menuList", JSON.stringify(parsed.menuList || []));
        if (parsed.selectedHeaderColor) {
          localStorage.setItem("selectedHeaderColor", parsed.selectedHeaderColor);
        }
      } else if (Array.isArray(parsed)) {
        localStorage.setItem("savedPosts", JSON.stringify(parsed));
      } else {
        localStorage.setItem("savedPosts", backupInfo);
      }
    } catch (parseError) {
      localStorage.clear();
      localStorage.setItem("savedPosts", backupInfo);
    }

    cleanup();
    dialog.ShowDialog(GetMessageInfo("info", "001"), () => {
      window.location.reload(true);
    });
  };

  fileRead.onerror = (e) => {
    cleanup();
    console.error(e);
    dialog.ShowDialog(GetMessageInfo("error", "001"), () => {
      location.reload();
    });
  };
}

/* ==========================================================
 * バックアップ作成ボタン
 * ========================================================== */
/**
 * バックアップ作成ボタン
 */
function CreateFullBackUp() {
  /* バリデーションチェック --2025/11/04 */
  if (
    !localStorage.getItem("savedPosts") &&
    !localStorage.getItem("menuList")
  ) {
    // 1. ダイアログ表示
    dialog.ShowDialog(GetMessageInfo("error", "002"));
    // 2. 処理終了
    return;
  }

  /* 事前定義 */
  // 1. 全データをオブジェクトとして取得
  const backupData = {
    savedPosts: JSON.parse(localStorage.getItem("savedPosts") || "[]"),
    sectionList: JSON.parse(localStorage.getItem("sectionList") || "[]"),
    menuList: JSON.parse(localStorage.getItem("menuList") || "[]"),
    selectedHeaderColor:
      localStorage.getItem("selectedHeaderColor") || null,
    version: 2,
  };

  // 2. JSON文字列に変換
  const BuckUpData = JSON.stringify(backupData);

  /* ダウンロード処理 */
  // 1. バイナリデータの作成
  const blob = new Blob([BuckUpData], { type: "application/json;charset=utf-8;" });
  // 2. URLの作成
  const url = URL.createObjectURL(blob);
  // 3. アンカーの作成
  const a = document.createElement("a");
  // 4. 遷移先に、項番2で作成したURLを設定
  a.href = url;
  // 5. ファイル名設定
  a.download = `フルバックアップ_${CreatYear()}.json`;
  // 6. アンカークリック時のイベントを発火
  a.click();
  // 7. URLの削除
  URL.revokeObjectURL(url);
}

/**
 * 現在年月日を作成し返す
 */
function CreatYear() {
  // 1. 現在年月日を取得
  const now = new Date();
  // 2. 年を取得
  const year = now.getFullYear();
  // 3. 月を取得
  const month = String(now.getMonth() + 1).padStart(2, "0");
  // 4. 日を取得
  const day = String(now.getDate()).padStart(2, "0");
  // 5. 時間を取得
  const hours = String(now.getHours()).padStart(2, "0");
  // 6. 分を取得
  const minutes = String(now.getMinutes()).padStart(2, "0");
  // 7. 秒を取得
  const seconds = String(now.getSeconds()).padStart(2, "0");
  // 8. 整形して返す
  return `${year}年${month}月${day}日_${hours}時${minutes}分${seconds}秒`;
}

/* ==========================================================
 * セクション追加ダイアログ
 * ========================================================== */
/**
 * セクション追加ダイアログを表示する
 */
function ShowAddSectionDialog() {
  /* ---------------------------------------------
   *  1. ダイアログ本体の作成
   * --------------------------------------------- */
  // 1. グループ要素作成
  const dialogContainer = document.createElement("div");
  // 2. クラス設定
  dialogContainer.className = "MessageDialog";

  /* ---------------------------------------------
   *  2. セクション名入力フォームの作成
   * --------------------------------------------- */
  // 1. ラベル要素作成
  const label = document.createElement("p");
  // 2. ラベル設定
  label.textContent = "セクション名を入力してください";
  // 3. クラス設定
  label.className = "dialogMessage";

  // 4. 入力フォーム作成
  const input = document.createElement("input");
  // 5. 属性設定
  input.type = "text";
  input.maxLength = 50;
  input.placeholder = "セクション名";
  input.className = "FormInfo";
  input.style.width = "100%";

  /* ---------------------------------------------
   *  3. ボタンコンテナの作成
   * --------------------------------------------- */
  const btnContainer = document.createElement("div");
  btnContainer.className = "ConfirmButtonForm";

  /* ---------------------------------------------
   *  4. 追加ボタンの作成
   * --------------------------------------------- */
  const addBtn = document.createElement("button");
  addBtn.textContent = "追加";
  addBtn.classList.add("ButtonInfo");

  /* ---------------------------------------------
   *  5. 閉じるボタンの作成
   * --------------------------------------------- */
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "閉じる";
  closeBtn.classList.add("ButtonInfo");

  /* ---------------------------------------------
   *  6. バックドロップの作成
   * --------------------------------------------- */
  const backdrop = document.createElement("div");
  backdrop.className = "DialogBackDrop";

  /* ---------------------------------------------
   *  7. DOM組み立て
   * --------------------------------------------- */
  dialogContainer.appendChild(label);
  dialogContainer.appendChild(input);
  btnContainer.appendChild(addBtn);
  btnContainer.appendChild(closeBtn);
  dialogContainer.appendChild(btnContainer);
  document.body.appendChild(backdrop);
  document.body.appendChild(dialogContainer);

  // 8. 初期フォーカス
  input.focus();

  /* ---------------------------------------------
   *  8. 閉じる処理
   * --------------------------------------------- */
  const closeDialog = () => {
    if (
      document.body.contains(dialogContainer) &&
      document.body.contains(backdrop)
    ) {
      document.body.removeChild(dialogContainer);
      document.body.removeChild(backdrop);
    }
  };

  /* ---------------------------------------------
   *  9. 追加ボタンのクリックイベント
   * --------------------------------------------- */
  addBtn.onclick = () => {
    // 1. 入力値を取得
    const sectionName = input.value.trim();

    // 2. バリデーション（空文字）
    if (!sectionName) {
      dialog.ShowDialog(GetMessageInfo("error", "006", "セクション名"));
      return;
    }

    // 3. 重複チェック
    const existingSections = GetSectionList();
    const isDuplicate = existingSections.some(
      (s) => s.name === sectionName
    );
    if (isDuplicate) {
      dialog.ShowDialog("同じ名前のセクションが既に存在します。");
      return;
    }

    // 4. 新しいセクションを作成
    const newSection = {
      id: crypto.randomUUID(),
      name: sectionName,
      icon: "",
      order: existingSections.length,
    };

    // 5. セクションリストに追加して保存
    existingSections.push(newSection);
    SaveSectionList(existingSections);

    // 6. ダイアログを閉じる
    closeDialog();

    // 7. 画面の再読み込み
    location.reload();
  };

  /* ---------------------------------------------
   *  10. 閉じるボタンのクリックイベント
   * --------------------------------------------- */
  closeBtn.onclick = () => {
    closeDialog();
  };
}

/**
 * 全データ削除
 */
function AllDataDelete() {
  // 1. ダイアログを表示
  dialog
    .ShowConfirmDialog(GetMessageInfo("confirm", "002", "全てのデータ"))
    .then((result) => {
      /* [はい]が押下された場合 */
      if (result) {
        // 1. 投稿データを削除
        localStorage.removeItem("savedPosts");
        // 2. セクションリストを削除
        localStorage.removeItem("sectionList");
        // 3. メニューリストを削除
        localStorage.removeItem("menuList");
        // 4. ダイアログ表示
        dialog.ShowDialog(GetMessageInfo("info", "002"), () => {
          // 5. 画面の再読み込み
          location.reload();
        });
      } else {
        /* [いいえ]が押下された場合 */
        return;
      }
    });
}

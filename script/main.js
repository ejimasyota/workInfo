/* 事前定義 */
// 1.投稿された内容の保持
let savedPosts = [];
// 2.編集中の投稿のインデックス
let editingIndex = null;
// 3.投稿リストの要素を取得
const postList = document.getElementById("postList");
// 4.URLパラメータ取得
const urlParams = new URLSearchParams(window.location.search);
// 5.現在のキーを取得
const currentKey = urlParams.get("key");
// 6.画像用カウンタ
let ImageCount = 0;
// 7.ダイアログのインスタンスを作成
const dialog = new DialogInfo();

/* 画面ロード時処理 */
document.addEventListener("DOMContentLoaded", () => {
  /* 投稿の表示 */
  // 1.投稿された内容の取得
  const data = localStorage.getItem("savedPosts");
  // 2.データが存在する場合はJSON形式に変換して保存
  savedPosts = data ? JSON.parse(data) : [];
  // 3.画面の表示処理
  displayPosts();
});

/* 投稿内容の保存処理 */
function savePosts() {
  // 1.ストレージへ投稿内容を保存
  localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
}

/* 投稿の表示処理 */
function displayPosts() {
  /* 事前処理 */
  // 1.投稿リストの内容を初期化
  postList.innerHTML = "";
  // 2.ヘッダーのテキストにkeyに紐づく値をセット
  document.getElementById("headerText").textContent = currentKey;
  // 3.タブ名を選択値に変更
  document.querySelector("title").textContent = currentKey;

  /* 投稿内容の表示処理 */
  if (0 < savedPosts.length) {
    /* 投稿されている内容分の処理を行う */
    savedPosts.forEach((post, index) => {
      /* 投稿のキーが現在のキーと一致しない場合はスキップ */
      if (post.key && post.key !== currentKey) {
        return;
      }

      /* 投稿内容のラッパー要素作成 */
      // 1.投稿の要素を作成
      const div = document.createElement("div");
      // 2.投稿のクラスを設定
      div.className = "Entry";

      /* 投稿のタイトルラッパー要素作成 */
      // 1.投稿のタイトル領域の要素を作成
      const titleArea = document.createElement("div");
      // 2.タイトル領域の要素にクラスを設定
      titleArea.className = "titleArea";
      // 3.タイトルエリアにIDを設定
      titleArea.id = "titleArea";

      /* タイトル設定 */
      // 1.タイトル要素を作成
      const title = document.createElement("h2");
      // 2.タイトル要素にクラスを設定
      title.className = "titleText";
      // 3.投稿のタイトルを設定
      title.textContent = post.title;
      // 4.タイトル領域要素内にタイトル要素を追加
      titleArea.appendChild(title);
      // 5.タイトル領域の要素を投稿要素に追加
      div.appendChild(titleArea);

      /* 投稿の本文要素作成 */
      // 1.投稿の本文要素を作成
      const body = document.createElement("p");
      // 2.投稿の本文にクラスを設定
      body.className = "PostBodyInfo";
      // 3.ボディの内容を設定
      body.textContent = post.body;
      // 4.投稿の要素に本文を追加
      div.appendChild(body);

      /* 投稿に画像がある場合は画像要素を作成 */
      if (post.image) {
        /* img親要素作成 */
        // 1.投稿の画像要素の親要素を作成
        const imgWrapper = document.createElement("div");
        // 2.親要素にクラスを設定
        imgWrapper.className = "imgWrapper";

        /* 画像要素の作成 */
        // 1.img要素の作成
        const img = document.createElement("img");
        // 2.画像パスに投稿パスを設定
        img.src = post.image;
        // 3.画像のクラスを設定
        img.className = "imgInfo";

        /* 画像削除ボタンの作成 */
        // 1.画像削除ボタン要素を作成
        const ImgDeleteButton = document.createElement("span");
        // 2.ボタンにクラスを設定
        ImgDeleteButton.className = "ImgDeleteButton";
        // 3.ボタンのテキストを設定
        ImgDeleteButton.textContent = "×";

        /* 各要素を設定 */
        // 1.親要素に画像削除ボタンを追加
        imgWrapper.appendChild(ImgDeleteButton);
        // 2.親要素に画像を追加
        imgWrapper.appendChild(img);
        // 3.要素を追加
        div.appendChild(imgWrapper);

        /* 画像クリック時のイベントを定義 */
        img.addEventListener("click", () => {
          // 1.モーダルを表示
          document.getElementById("imageModal").style.display = "block";
          // 2.モーダルに表示する画像を設定
          document.getElementById("modalImg").src = img.src;
        });

        /* 画像削除ボタンクリック時のイベントを定義 */
        ImgDeleteButton.addEventListener("click", () => {
          dialog
            .ShowConfirmDialog("画像の削除を行います。よろしいですか？")
            .then((result) => {
              /* [はい]が押下された場合は画面を戻る */
              if (result) {
                // 1.投稿から画像を削除
                post.image = null;
                // 2.画像名を削除
                post.imagename = null;
                // 3.画面の再表示
                displayPosts();
              } else {
                /* [いいえ]が押下された場合は処理終了 */
                return;
              }
            });
        });
      }

      /* コピーボタンの設定 */
      // 1.コピーボタンを作成
      const copyBtn = document.createElement("button");
      // 2.コピーボタンのテキストを設定
      copyBtn.textContent = "コピー";
      // 3.コピーボタンのクリックイベントを設定
      copyBtn.onclick = () => PostCopy(body, index);
      // 4.コピーボタンのクラスを設定
      copyBtn.classList.add("ButtonInfo", "PoupuleButton");
      // 5.コピーボタンのIDを設定(querySelectorではほかに影響が出そうなので)
      copyBtn.id = `copyBtn-${index}`;

      /* 編集ボタンの設定 */
      // 1.編集ボタンを作成
      const editBtn = document.createElement("button");
      // 2.編集ボタンのテキストを設定
      editBtn.textContent = "修正";
      // 3.編集ボタンのクリックイベントを設定
      editBtn.onclick = () => editPost(index);
      // 4.編集ボタンのクラスを設定
      editBtn.classList.add("ButtonInfo", "BlueButton");

      /* 削除ボタンの設定 */
      // 1.削除ボタンを作成
      const deleteBtn = document.createElement("button");
      // 2.削除ボタンのテキストを設定
      deleteBtn.textContent = "削除";
      // 3.削除ボタンのクリックイベントを設定
      deleteBtn.onclick = () => deletePost(index);
      // 4.削除ボタンのクラスを設定
      deleteBtn.classList.add("ButtonInfo", "RedButton");

      /* ボタンのラッパー要素 */
      // 1.親要素作成
      const buttonForm = document.createElement("div");
      // 2.クラス設定
      buttonForm.className = "PostButtonForm";
      // 3.コピーボタン追加
      buttonForm.appendChild(copyBtn);
      // 4.編集ボタン追加
      buttonForm.appendChild(editBtn);
      // 5.削除ボタン追加
      buttonForm.appendChild(deleteBtn);
      // 6.投稿内容フォームに追加
      div.appendChild(buttonForm);
      // 7.投稿リストに投稿の要素を追加
      postList.appendChild(div);
    });

    /* ヘッダーカラーの設定 --2025/09/08 */
    // 1.ヘッダー要素を取得
    const header = document.querySelector("header");
    // 2.ストレージから背景色取得
    const savedColorClass = localStorage.getItem("selectedHeaderColor");
    // 3.背景色を設定
    if (header && savedColorClass) {
      header.classList.add(savedColorClass);
      /* タイトルエリアの背景色も設定 */
      const titleAreas = document.querySelectorAll(".titleArea");

      /* 存在する場合は設定 */
      titleAreas.forEach((element) => {
        element.classList.add(savedColorClass);
      });
    }

    /* 画面のスクロール --2025/09/08 */
    const postListEl = document.getElementById("postList");
    if (postListEl) {
      postListEl.scrollTop = postListEl.scrollHeight;
    }
  } else {
    // 21.投稿がない場合はメッセージを表示
    const noPostsMessage = document.createElement("p");
    noPostsMessage.textContent = "投稿がありません。";
    postList.appendChild(noPostsMessage);
  }
}

/**
 * モーダルを閉じる処理
 */
function ModalCloseEvent() {
  document.getElementById("imageModal").style.display = "none";
}

/**
 * 検索フォームのロストフォーカス時イベント
 */
function SearchEvent() {
  /* 事前定義 */
  // 1.検索フォームの要素を取得
  const searchForm = document.getElementById("SearchWordForm");
  // 2.検索ワードを取得
  const searchWord = searchForm.value.trim();
  // 3.投稿内容要素取得
  const postEntries = document.querySelectorAll(".Entry");

  if (searchWord) {
    /* 投稿内容のフィルタリング */
    postEntries.forEach((entry) => {
      // 1.タイトル要素を取得
      const title = entry.querySelector(".titleText").textContent;
      // 2.タイトルに検索ワードが含まれる場合は表示、含まれない場合は非表示
      if (title.includes(searchWord)) {
        entry.style.display = "block";
      } else {
        entry.style.display = "none";
      }
    });
  } else {
    displayPosts();
  }
}

/**
 * 検索フォームのクリア処理
 */
function ClearSearch() {
  /* 事前定義 */
  // 1.検索フォームの要素を取得
  const searchForm = document.getElementById("SearchWordForm");
  // 2.検索フォームをクリア
  searchForm.value = "";
  // 3.投稿の再表示
  displayPosts();
}

/**
 * 画像選択時イベント
 */
document.getElementById("imageInput").addEventListener("change", (event) => {
  /* 事前定義 */
  // 1.画像名を保持する要素を取得
  const FileName = document.getElementById("SelectFileNameForm");
  // 2.選択されたファイルを取得
  const SelectImage = event.target.files[0];

  /* 選択されたファイル名の設定 */
  if (SelectImage) {
    FileName.value = SelectImage.name;
  } else {
    FileName.value = "ファイルが選択されていません";
  }
});

/**
 * 投稿処理
 * @returns
 */
function addPost() {
  // 1.タイトル取得
  const title = document.getElementById("titleInput").value.trim();
  // 2.本文取得
  const body = document.getElementById("bodyInput").value.trim();
  // 3.画像ファイル取得
  const file = document.getElementById("imageInput").files[0];
  // 4.画像名を保持する要素を取得
  const fileName = document.getElementById("SelectFileNameForm").value.trim();

  /* タイトルが空の場合は処理を終了 */
  if (!title) {
    // 1.ダイアログ表示
    dialog.ShowDialog("タイトルを入力してください。");
    // 2.処理終了
    return;
  }

  /* 本文が空の場合は処理を終了 */
  if (!body) {
    // 1.ダイアログ表示
    dialog.ShowDialog("本文を入力してください。");
    // 2.処理終了
    return;
  }

  /* 投稿処理 */
  const finalize = (imageData) => {
    // 1.新しい投稿のデータを作成
    const newPost = {
      title,
      body,
      image: imageData,
      key: currentKey || null,
      imagename: fileName || null,
    };

    // 2.編集中の投稿がある場合は更新、なければ新規追加
    if (editingIndex !== null) {
      savedPosts[editingIndex] = newPost;
      editingIndex = null;
    } else {
      savedPosts.push(newPost);
    }
    // 3.投稿内容を保存
    savePosts();
    // 4.投稿リストを再表示
    displayPosts();
    // 5.入力フィールドをクリア
    document.getElementById("titleInput").value = "";
    document.getElementById("bodyInput").value = "";
    document.getElementById("imageInput").value = "";
    document.getElementById("SearchWordForm").value = "";
    document.getElementById("SelectFileNameForm").value = "";
  };
  // 5.画像ファイルが選択されている場合はFileReaderで読み込み
  if (file) {
    const reader = new FileReader();
    reader.onload = () => finalize(reader.result);
    reader.readAsDataURL(file);
  } else {
    // 6.画像が選択されていない場合は既存の画像を使用
    const existingImage =
      editingIndex !== null ? savedPosts[editingIndex].image : null;
    finalize(existingImage);
  }
}
/**
 * 学習内容の出力処理
 * CSVファイルを出力する(PDFはさすがにできなさそう)
 */
function PreateLearningInfo() {
  /* 事前定義 */
  // 1.出力内容を保持する配列
  const CsvInfo = [];
  // 2.セッションに保持されているセクション名を取得
  const SectionName = sessionStorage.getItem("SectionInfo");
  // 3.学習内容のヘッダーを保持する
  const LearningHeader = `${document
    .getElementById("headerText")
    .textContent.trim()}`;

  /* 投稿内容の取得処理 */
  if (0 < savedPosts.length) {
    savedPosts.forEach((post) => {
      /* 投稿のキーが現在のキーと一致しない場合はスキップ */
      if (post.key && post.key !== currentKey) {
        return;
      }
      /* 投稿内容のタイトルと本文を取得 */
      const CsvInfoItems = {
        // 1.タイトル
        title: post.title,
        // 2.本文
        body: post.body,
      };
      /* 出力内容を保持する配列にセット */
      CsvInfo.push(CsvInfoItems);
    });
  }
  /* 出力用にデータを整形 */
  const PrintData = CsvInfo.map((item, index) => {
    return `【${index + 1}】${item.title}\n\n${item.body}\n${createLine()}\n`;
  }).join("\n");

  /* printDataの先頭にヘッダーを追加 */
  const csvData =
    `\n【${SectionName} : ${LearningHeader}】\n${createLine()}\n\n` + PrintData;

  /* ダウンロード処理 */
  // 1.バイナリデータの作成
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  // 2.URLの作成
  const url = URL.createObjectURL(blob);
  // 3.アンカーの作成
  const a = document.createElement("a");
  // 4.遷移先に、項番2で作成したURLを設定
  a.href = url;
  // 5.ファイル名設定
  a.download = `${LearningHeader}_${CreatYear()}.csv`;
  // 6.アンカークリック時のイベントを発火
  a.click();
  // 7.URLの削除(ネット上のコピペのため不明点は調べる)
  URL.revokeObjectURL(url);
}

/**
 * 戻るボタンの処理
 */
function backPage() {
  /* 事前定義 */
  // 1.タイトル要素の取得
  const titleInput = document.getElementById("titleInput").value.trim();
  // 2.本文要素の取得
  const bodyInput = document.getElementById("bodyInput").value.trim();
  // 3.画像要素の取得
  const imageInput = document.getElementById("imageInput").files[0];
  // 4.画像名要素の取得
  const imageName = document.getElementById("SelectFileNameForm").value.trim();

  /* 入力途中の要素が存在する場合 */
  if (titleInput || bodyInput || imageInput || imageName) {
    // 1.ダイアログを表示
    dialog
      .ShowConfirmDialog("入力中の内容が失われますが、戻りますか？")
      .then((result) => {
        /* [はい]が押下された場合は画面を戻る */
        if (result) {
          window.history.back();
        } else {
          /* [いいえ]が押下された場合は処理終了 */
          return;
        }
      });
    // 4.入力途中が存在しなければそのまま処理終了
  } else {
    window.history.back();
  }
}
/**
 * クリアボタンの処理(入力フォームを初期化する)
 */
function clearEvent() {
  /* 事前定義 */
  // 1.タイトル要素の取得
  const titleInput = document.getElementById("titleInput").value.trim();
  // 2.本文要素の取得
  const bodyInput = document.getElementById("bodyInput").value.trim();
  // 3.画像要素の取得
  const imageInput = document.getElementById("imageInput").files[0];
  // 4.画像名要素の取得
  const imageName = document.getElementById("SelectFileNameForm").value.trim();

  /* 入力途中の要素が存在する場合 */
  if (titleInput || bodyInput || imageInput || imageName) {
    // 1.ダイアログを表示
    dialog
      .ShowConfirmDialog("入力中の内容が失われますが、戻りますか？")
      .then((result) => {
        /* [はい]が押下された場合は画面を戻る */
        if (result) {
          // 1.タイトルをクリア
          document.getElementById("titleInput").value = "";
          // 2.本文をクリア
          document.getElementById("bodyInput").value = "";
          // 3.選択中の画像をクリア
          document.getElementById("imageInput").files[0] = "";
          // 4.画像名クリア
          document.getElementById("SelectFileNameForm").value = "";
          // 5.編集中のインデックスをリセット
          editingIndex = null;
        } else {
          /* [いいえ]が押下された場合は処理終了 */
          return;
        }
      });
  } else {
    /* 入力途中が存在しなければそのまま処理終了 */
    // 1.タイトルをクリア
    document.getElementById("titleInput").value = "";
    // 2.本文をクリア
    document.getElementById("bodyInput").value = "";
    // 3.選択中の画像をクリア
    document.getElementById("imageInput").files[0] = "";
    // 4.画像名クリア
    document.getElementById("SelectFileNameForm").value = "";
    // 5.編集中のインデックスをリセット
    editingIndex = null;
  }
}

/**
 * テキストのコピーイベント
 */
function PostCopy(bodyElement, index) {
  /* 定義 */
  // 1.コピー内容の取得
  const textToCopy = bodyElement.textContent;
  // 2.ボタン要素の取得(ラベル変更用)
  const CopyButtonEl = document.getElementById(`copyBtn-${index}`);
  // 3.コピーボタンに表示されているラベル
  const CopyButtonLabel = CopyButtonEl.textContent.trim();

  /* クリップボードへの設定処理 */
  navigator.clipboard
    .writeText(textToCopy)
    /* 成功時 */
    .then(() => {
      // 1.ラベル設定
      CopyButtonEl.textContent = "コピー完了";
      // 2.仮で10秒後にラベルを戻す
      setTimeout(() => {
        CopyButtonEl.textContent = CopyButtonLabel;
      }, 10000);
    })
    /* 例外発生時 */
    .catch((err) => {
      // 1.エラーログ
      console.error("コピー失敗 : ", err);
      // 2.ラベル設定
      CopyButtonEl.textContent = "コピー失敗";
      // 3.仮で3秒後にラベルを戻す
      setTimeout(() => {
        CopyButtonEl.textContent = CopyButtonLabel;
      }, 3000);
    });
}

/**
 * 修正ボタン押下時の処理
 * @param {*} index 選択中の投稿インデックス
 */
function editPost(index) {
  const post = savedPosts[index];
  document.getElementById("titleInput").value = post.title;
  document.getElementById("bodyInput").value = post.body;
  document.getElementById("SelectFileNameForm").value = post.imagename || "";
  editingIndex = index;
  window.scrollTo(0, document.body.scrollHeight);
}

/**
 * 削除ボタン押下時の処理
 * @param {*} index 選択中の投稿インデックス
 */
function deletePost(index) {
  /* 修正中の項目が存在する場合は削除を行わせない | 更新年月日 : 2025/09/09 | 更新者 : 恵島 */
  if (editingIndex !== null) {
    dialog.ShowDialog(
      "編集中の項目が存在します。編集を完了してから削除を行ってください。"
    );
    return;
  }

  /* 削除処理 */
  // 1.ダイアログを表示
  dialog.ShowConfirmDialog("本当に削除しますか？").then((result) => {
    /* [はい]が押下された場合は画面を戻る */
    if (result) {
      // 1.対象インデックスの要素を切り取り
      savedPosts.splice(index, 1);
      // 2.投稿内容を保存
      savePosts();
      // 3.画面の読み込み
      displayPosts();
      // 4.検索フォームをクリア
      document.getElementById("SearchWordForm").value = "";
    } else {
      /* [いいえ]が押下された場合は処理終了 */
      return;
    }
  });
}

/**
 * スクロールのトップへ移動するイベント
 */
function ScrollTop() {
  // 1.コンテンツ要素取得
  const postListEl = document.getElementById("postList");
  // 2.スクロール位置を初期化
  if (postListEl) {
    postListEl.scrollTop = 0;
  }
}

/**
 * スクロールの下部へ移動するイベント
 */
function ScrollBottom() {
  // 1.コンテンツ要素取得
  const postListEl = document.getElementById("postList");
  // 2.スクロール位置を設定
  if (postListEl) {
    postListEl.scrollTop = postListEl.scrollHeight;
  }
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
function createLine() {
  // 1.直線を保持する
  let Line = "";
  // 2.とりあえず150文字の直線を作成
  for (let index = 0; index < 150; index++) {
    Line += "_";
  }
  // 3.返す
  return Line;
}

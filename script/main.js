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

/* 画面ロード時処理 */
document.addEventListener("DOMContentLoaded", () => {
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

  /* 投稿内容の表示処理 */
  if (0 < savedPosts.length) {
    /* 投稿されている内容分の処理を行う */
    savedPosts.forEach((post, index) => {
      /* 投稿のキーが現在のキーと一致しない場合はスキップ */
      if (post.key && post.key !== currentKey) {
        return;
      }

      /* 投稿内容の作成 */
      // 1.投稿の要素を作成
      const div = document.createElement("div");
      // 2.投稿のクラスを設定
      div.className = "entry";

      // 3.投稿のタイトル領域の要素を作成
      const titleArea = document.createElement("div");
      // 4.タイトル領域の要素にクラスを設定
      titleArea.className = "titleArea";
      // 5.タイトル要素を作成
      const title = document.createElement("h2");
      // 6.タイトル要素にクラスを設定
      title.className = "titleText";
      // 7.投稿のタイトルを設定
      title.textContent = post.title;
      // 8.タイトル領域要素内にタイトル要素を追加
      titleArea.appendChild(title);
      // 9.タイトル領域の要素を投稿要素に追加
      div.appendChild(titleArea);

      // 10.投稿の本文要素を作成
      const body = document.createElement("p");
      // 11.投稿の本文にクラスを設定
      body.className = "bodyInfo";
      // 12.ボディの内容を設定
      body.textContent = post.body;
      // 13.投稿の要素に本文を追加
      div.appendChild(body);

      /* 投稿に画像がある場合は画像要素を作成 */
      if (post.image) {
        // 1.img要素の作成
        const img = document.createElement("img");
        // 2.画像パスに投稿パスを設定
        img.src = post.image;
        // 3.画像のクラスを設定
        img.className = "imgInfo";
        // 4.要素を追加
        div.appendChild(img);

        /* 画像クリック時のイベントを定義 */
        img.addEventListener("click", () => {
          // 1.モーダルを表示
          document.getElementById("imageModal").style.display = "block";
          // 2.モーダルに表示する画像を設定
          document.getElementById("modalImg").src = img.src;
        });
      }

      /* 各ボタン要素の設定 */
      // 1.編集ボタンを作成
      const editBtn = document.createElement("button");
      // 2.編集ボタンのテキストを設定
      editBtn.textContent = "修正";
      // 3.編集ボタンのクリックイベントを設定
      editBtn.onclick = () => editPost(index);
      // 4.編集ボタンのクラスを設定
      editBtn.className = "editButton";

      // 5.削除ボタンを作成
      const deleteBtn = document.createElement("button");
      // 6.削除ボタンのテキストを設定
      deleteBtn.textContent = "削除";
      // 7.削除ボタンのクリックイベントを設定
      deleteBtn.onclick = () => deletePost(index);
      // 8.削除ボタンのクラスを設定
      deleteBtn.className = "deleteButton";

      const buttonForm = document.createElement("div");
      buttonForm.className = "buttonForm";
      buttonForm.appendChild(editBtn);
      buttonForm.appendChild(deleteBtn);

      div.appendChild(buttonForm);
      // 19.投稿リストに投稿の要素を追加
      postList.appendChild(div);
    });
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

  /* タイトルが空の場合は処理を終了 */
  if (!title) {
    // 1.インスタンス作成
    const dialog = new DialogInfo("タイトルを入力してください。");
    // 2.ダイアログ表示
    dialog.ShowDialog();
    // 3.処理終了
    return;
  }
  /* 本文が空の場合は処理を終了 */
  if (!body) {
    // 1.インスタンス作成
    const dialog = new DialogInfo("本文を入力してください。");
    // 2.ダイアログ表示
    dialog.ShowDialog();
    // 3.処理終了
    return;
  }

  /* 投稿処理 */
  const finalize = (imageData) => {
    // 1.新しい投稿のデータを作成
    const newPost = { title, body, image: imageData, key: currentKey || null };

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
    .textContent.trim()}に関して`;

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
    return `${createLine()}\n【${index + 1}】${item.title}\n\n${
      item.body
    }\n${createLine()}\n\n`;
  }).join("\n");

  /* printDataの先頭にヘッダーを追加 */
  const csvData = `\n【${SectionName} : ${LearningHeader}】\n\n` + PrintData;

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

  /* 入力途中の要素が存在する場合 */
  if (titleInput || bodyInput || imageInput) {
    // 1.ダイアログのインスタンスを作成
    const dialog = new DialogInfo("入力中の内容が失われますが、戻りますか？");
    // 2.ダイアログを表示
    dialog.ShowConfirmDialog().then((result) => {
      // 3.[はい]が押下された場合は画面を戻る
      if (result) {
        window.history.back();
        // 4.[いいえ]が押下された場合は処理終了
      } else {
        return;
      }
    });
    // 5.入力途中が存在しなければそのまま処理終了
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

  /* 入力途中の要素が存在する場合 */
  if (titleInput || bodyInput || imageInput) {
    // 1.ダイアログのインスタンスを作成
    const dialog = new DialogInfo("入力中の内容が失われますが、戻りますか？");
    // 2.ダイアログを表示
    dialog.ShowConfirmDialog().then((result) => {
      /* [はい]が押下された場合は画面を戻る */
      if (result) {
        // 1.タイトルをクリア
        document.getElementById("titleInput").value = "";
        // 2.本文をクリア
        document.getElementById("bodyInput").value = "";
        // 3.選択中の画像をクリア
        document.getElementById("imageInput").files[0] = "";
        // 4.編集中のインデックスをリセット
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
    // 4.編集中のインデックスをリセット
    editingIndex = null;
  }
}

/**
 * 修正ボタン押下時の処理
 * @param {*} index 選択中の投稿インデックス
 */
function editPost(index) {
  const post = savedPosts[index];
  document.getElementById("titleInput").value = post.title;
  document.getElementById("bodyInput").value = post.body;
  editingIndex = index;
  window.scrollTo(0, document.body.scrollHeight);
}

/**
 * 削除ボタン押下時の処理
 * @param {*} index 選択中の投稿インデックス
 */
function deletePost(index) {
  // 1.ダイアログのインスタンスを作成
  const dialog = new DialogInfo("本当に削除しますか？");
  // 2.ダイアログを表示
  dialog.ShowConfirmDialog().then((result) => {
    /* [はい]が押下された場合は画面を戻る */
    if (result) {
      // 1.対象インデックスの要素を切り取り
      savedPosts.splice(index, 1);
      // 2.投稿内容を保存
      savePosts();
      // 3.画面の読み込み
      displayPosts();
    } else {
      /* [いいえ]が押下された場合は処理終了 */
      return;
    }
  });
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

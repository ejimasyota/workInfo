/* ==========================================================
 * 事前定義
 * ========================================================== */
// 1. 投稿された内容の保持する
let SavePostArray = [];
// 2. 編集中の投稿のインデックス
let EditIndex = null;
// 3. 投稿リストの要素を取得
const PostListElement = document.getElementById("postList");
// 4. URLパラメータ取得
const UrlParam = new URLSearchParams(window.location.search);
// 5. メニューIDを取得（新形式）
const CurrentMenuId = UrlParam.get("menuId");
// 6. レガシーキーを取得（後方互換性のため）
const LegacyKey = UrlParam.get("key");
// 7. 現在のメニュー情報を取得
const CurrentMenu = GetCurrentMenu(CurrentMenuId, LegacyKey);
// 8. 表示用のキー名
const CurrentDisplayName = CurrentMenu ? CurrentMenu.name : (LegacyKey || "");
// 9. ダイアログのインスタンスを作成
const DialogIncetance = new DialogInfo();
// 10. 画像プレビューダイアログインスタンス
const ImgPreviewInfo = new ImagePreviewDialog();

/**
 * 現在のメニュー情報を取得する
 * @param {string} menuId メニューID
 * @param {string} legacyKey レガシーキー
 * @returns {Object|null} メニュー情報
 */
function GetCurrentMenu(menuId, legacyKey) {
  const menus = JSON.parse(localStorage.getItem("menuList") || "[]");
  if (menuId) {
    return menus.find((m) => m.id === menuId) || null;
  }
  if (legacyKey) {
    return menus.find((m) => m.legacyKey === legacyKey) || null;
  }
  return null;
}

/**
 * 投稿がこの画面に属するかを判定する
 * @param {Object} post 投稿データ
 * @returns {boolean} 属する場合true
 */
function IsCurrentPost(post) {
  // 1. menuIdで判定（新形式）
  if (CurrentMenu && post.menuId) {
    return post.menuId === CurrentMenu.id;
  }
  // 2. legacyKeyで判定（後方互換性）
  if (CurrentDisplayName && post.key) {
    return post.key === CurrentDisplayName;
  }
  return false;
}

/* ==========================================================
 * 画面ロード時処理
 * ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
 /* ------------------------------
  *  1. 投稿の表示
  * ------------------------------ */
  // 1. 投稿された内容の取得
  const StrageSavePost = localStorage.getItem("savedPosts");
  // 2. データが存在する場合はJSON形式に変換して保存
  SavePostArray = StrageSavePost ? JSON.parse(StrageSavePost) : [];
  // 3. 画面の表示処理
  DisplayPostList();

});


/* ==========================================================
 * モバイル用検索イベント
 * ========================================================== */
/**
 * モバイルツールバーの検索フォーム入力時イベント
 */
function MobileSearchEvent() {
  // 1. モバイル検索フォームの値をPC側にも同期
  const mobileForm = document.getElementById("MobileSearchWordForm");
  const pcForm = document.getElementById("SearchWordForm");
  if (pcForm) pcForm.value = mobileForm.value;
  // 2. 検索処理を実行
  SearchEvent();
}

/**
 * モバイルツールバーの検索クリア処理
 */
function MobileClearSearch() {
  // 1. モバイル検索フォームをクリア
  const mobileForm = document.getElementById("MobileSearchWordForm");
  if (mobileForm) mobileForm.value = "";
  // 2. PC側の検索クリアも実行
  ClearSearch();
}

/**
 * 投稿内容の保存処理
 * @returns {void}
 */
function SavePostList() {
  // 1. ストレージへ投稿内容を保存
  localStorage.setItem("savedPosts", JSON.stringify(SavePostArray));
}

/**
 * 投稿の表示処理
 * @returns {void}
 */
function DisplayPostList() {
 /* ==========================================================
  * 事前定義
  * ========================================================== */
  // 1. 投稿リストの内容を初期化
  PostListElement.innerHTML = "";
  // 2. ヘッダーのテキストにメニュー名をセット
  document.getElementById("HeaderText").textContent = CurrentDisplayName;
  // 3. タブ名を選択値に変更
  document.querySelector("title").textContent = CurrentDisplayName;
  // 4. 選択されたメニュー項目の投稿件数を取得
  const PostCount = SavePostArray.filter((Post) => IsCurrentPost(Post)).length;

 /* ==========================================================
  * 投稿内容の表示処理
  * ========================================================== */
  if (0 < PostCount) {
    SavePostArray.forEach((Post, Index) => {
     /* ---------------------------------------------
      *  1. 投稿のキーが現在のキーと一致しない場合
      * --------------------------------------------- */
      if (!IsCurrentPost(Post)) {
        // 1. 処理スキップ
        return;
      }

     /* ---------------------------------------------
      *  2. 投稿内容のラッパー要素作成
      * --------------------------------------------- */
      // 1. グループ要素を作成
      const PostListWrapper = document.createElement("div");
      // 2. クラスを設定
      PostListWrapper.className = "PostListWrapper";

     /* ---------------------------------------------
      *  3. 投稿タイトルのラッパー要素作成
      * --------------------------------------------- */
      // 1. グループ要素を作成
      const PostTitleWrapper = document.createElement("div");
      // 2. クラスを設定
      PostTitleWrapper.classList.add("PostTitleWrapper", "DefoultHeader");

     /* ---------------------------------------------
      *  4. 投稿タイトル作成
      * --------------------------------------------- */
      // 1. テキスト要素を作成
      const PostTitle = document.createElement("h2");
      // 2. クラスを設定
      PostTitle.className = "PostTitle";
      // 3. ラベル設定
      PostTitle.textContent = Post.title;
      // 4. タイトルラッパーにタイトルを格納
      PostTitleWrapper.appendChild(PostTitle);
      // 5. タイトルラッパーを投稿内容ラッパーに格納
      PostListWrapper.appendChild(PostTitleWrapper);

     /* ---------------------------------------------
      *  5. 投稿本文作成
      * --------------------------------------------- */
      // 1. テキスト要素を作成
      const PostBody = document.createElement("p");
      // 2. クラスを設定
      PostBody.className = "PostBodyInfo";
      // 3. 投稿本文の内容を設定
      PostBody.innerHTML = convertMarkdown(Post.body);
      // 4. 投稿本文を投稿内容ラッパーに格納
      PostListWrapper.appendChild(PostBody);

     /* ---------------------------------------------
      *  6. 投稿に画像が存在する場合
      * --------------------------------------------- */
      // 1. 画像配列を取得（後方互換性対応）
      const postImages = Post.images || (Post.image ? [Post.image] : []);

      if (postImages.length > 0) {
        /* 1. 画像ラッパー作成 */
        // 1. グループ要素を作成
        const ImgWrapper = document.createElement("div");
        // 2. クラスを設定
        ImgWrapper.className = "PostImgWrapper";

        postImages.forEach((imgSrc, imgIndex) => {
          /* 2. 個別画像コンテナ */
          // 1. グループ要素を作成
          const imgContainer = document.createElement("div");
          // 2. クラスを設定
          imgContainer.className = "PostImgContainer";

          /* 3. 画像要素の作成 */
          // 1. img要素の作成
          const ImgElement = document.createElement("img");
          // 2. 画像パスに投稿パスを設定
          ImgElement.src = imgSrc;
          // 3. クラスを設定
          ImgElement.className = "PostImgInfo";

          /* 4. 画像削除ボタンの作成 */
          // 1. ボタン要素を作成
          const ImgDeleteButton = document.createElement("span");
          // 2. クラスを設定
          ImgDeleteButton.className = "ImgDeleteButton";
          // 3. ラベルを設定
          ImgDeleteButton.textContent = "×";

          /* 5. DOMの組み立て */
          // 1. 画像コンテナに画像削除ボタンを格納
          imgContainer.appendChild(ImgDeleteButton);
          // 2. 画像コンテナに画像を格納
          imgContainer.appendChild(ImgElement);
          // 3. 画像ラッパーに画像コンテナを格納
          ImgWrapper.appendChild(imgContainer);

          /* 6. 画像クリック時イベント */
          ImgElement.addEventListener("click", async () => {
            /* 1. 画像パスが存在する場合 */
            if (ImgElement && ImgElement.src) {
              // 1. 画像プレビューダイアログ表示
              await ImgPreviewInfo.ShowImagePreview(ImgElement.src);
            }
          });

          /* 7. 画像削除ボタンクリック時イベント */
          ImgDeleteButton.addEventListener("click", () => {
            DialogIncetance.ShowConfirmDialog(
              GetMessageInfo("confirm", "002", "画像")
            ).then((Result) => {
              /* [はい]が押下された場合 */
              if (Result) {
                // 1. 配列から画像を削除
                if (Post.images) {
                  Post.images.splice(imgIndex, 1);
                  if (Post.imagenames) {
                    Post.imagenames.splice(imgIndex, 1);
                  }
                } else {
                  // 2. 旧形式の単一画像を削除
                  Post.image = null;
                  Post.imagename = null;
                }
                // 3. 後方互換フィールドも更新
                Post.image = Post.images && Post.images.length > 0 ? Post.images[0] : null;
                Post.imagename = Post.imagenames && Post.imagenames.length > 0 ? Post.imagenames[0] : null;
                // 4. 保存して再表示
                SavePostList();
                DisplayPostList();
              } else {
                /* [いいえ]が押下された場合 */
                // 1. 処理終了
                return;
              }
            });
          });
        });

        // 4. 投稿内容ラッパーに画像ラッパーを格納
        PostListWrapper.appendChild(ImgWrapper);
      }

     /* ---------------------------------------------
      *  7. コピーボタンの作成
      * --------------------------------------------- */
      // 1. ボタン要素を作成
      const CopyButton = document.createElement("button");
      // 2. ラベルを設定
      CopyButton.textContent = "コピー";
      // 3. クラスを設定
      CopyButton.classList.add("ButtonInfo");
      // 4. IDを設定(querySelectorではほかに影響が出そうなので)
      CopyButton.id = `CopyButton-${Index}`;

     /* ---------------------------------------------
      *  8. コピーボタンのクリックイベント
      * --------------------------------------------- */
      CopyButton.onclick = () => {
        // 1. 投稿内容コピー処理を呼び出し
        PostCopy(PostBody, Index);
      };

     /* ---------------------------------------------
      *  9. 編集ボタンの作成
      * --------------------------------------------- */
      // 1. ボタン要素を作成
      const EditButton = document.createElement("button");
      // 2. ラベルを設定
      EditButton.textContent = "修正";
      // 3. クラスを設定
      EditButton.classList.add("ButtonInfo");

     /* ---------------------------------------------
      *  10. 編集ボタンのクリックイベント
      * --------------------------------------------- */
      EditButton.onclick = () => {
        // 1. 投稿内容編集処理の呼び出し
        EditPostInfo(Index);
      };

     /* ---------------------------------------------
      *  11. 削除ボタンの作成
      * --------------------------------------------- */
      // 1. ボタン要素を作成
      const DeleteButton = document.createElement("button");
      // 2. ラベルを設定
      DeleteButton.textContent = "削除";
      // 3. クラスを設定
      DeleteButton.classList.add("ButtonInfo");

     /* ---------------------------------------------
      *  12. 削除ボタンのクリックイベント
      * --------------------------------------------- */
      DeleteButton.onclick = () => {
        // 1. 投稿内容削除処理の呼び出し
        DeletePostInfo(Index);
      }

     /* ---------------------------------------------
      *  13. 学習内容出力ボタンの作成
      * --------------------------------------------- */
      // 1. ボタン要素を作成
      const PostOutputButton = document.createElement("button");
      // 2. ラベルを設定
      PostOutputButton.textContent = "学習内容出力";
      // 3. クラスを設定
      PostOutputButton.classList.add("ButtonInfo");

     /* ---------------------------------------------
      *  14. 学習内容出力ボタンのクリックイベント
      * --------------------------------------------- */
      PostOutputButton.onclick = () =>{
        // 1. 学習内容出力処理の呼び出し
        OutputPostInfo(Index);
      }

     /* ---------------------------------------------
      *  15. ボタンラッパー作成
      * --------------------------------------------- */
      // 1. グループ要素作成
      const ButtonWrapper = document.createElement("div");
      // 2. クラス設定
      ButtonWrapper.className = "PostButtonWrapper";

     /* ---------------------------------------------
      *  16. DOM組み立て
      * --------------------------------------------- */
      // 1. ボタンラッパーにコピーボタンを格納
      ButtonWrapper.appendChild(CopyButton);
      // 2. ボタンラッパーに編集ボタンを格納
      ButtonWrapper.appendChild(EditButton);
      // 3. ボタンラッパーに削除ボタンを格納
      ButtonWrapper.appendChild(DeleteButton);
      // 4. ボタンラッパーに出力ボタンを格納
      ButtonWrapper.appendChild(PostOutputButton);
      // 5. 投稿内容ラッパーにボタンラッパーを格納
      PostListWrapper.appendChild(ButtonWrapper);
      // 6. 投稿リストに投稿内容ラッパーを格納
      PostListElement.appendChild(PostListWrapper);
    });


   /* ==========================================================
    * 画面スクロール位置を設定
    * ========================================================== */
    if (PostListElement) {
      // 1. スクロール位置を最下部に設定
      PostListElement.scrollTop = PostListElement.scrollHeight;
    }
  }
 /* ==========================================================
  * 投稿内容が存在しない場合
  * ========================================================== */
  else {
   /* ---------------------------------------------
    *  1. 投稿内容のラッパー要素作成
    * --------------------------------------------- */
    // 1. グループ要素を作成
    const PostListWrapper = document.createElement("div");
    // 2. クラスを設定
    PostListWrapper.className = "PostListWrapper";

   /* ---------------------------------------------
    *  2. 表示メッセージ要素作成
    * --------------------------------------------- */
    // 1. テキスト要素を作成
    const NotPostsMessage = document.createElement("p");
    // 2. ラベル設定
    NotPostsMessage.textContent = GetMessageInfo("error", "008");

   /* ---------------------------------------------
    *  3. DOMの組み立て
    * --------------------------------------------- */
    // 1. 投稿内容のラッパーに表示メッセージを格納
    PostListWrapper.appendChild(NotPostsMessage)
    // 2. 投稿内容リストにメッセージを格納
    PostListElement.appendChild(PostListWrapper);
  }
}


/**
 * モーダルを閉じる処理
 */
function ModalCloseEvent() {
  // 1. 画面から非表示に設定
  document.getElementById("ImgDialog").style.display = "none";
}

/**
 * 検索フォームの入力時イベント
 */
function SearchEvent() {
 /* ==========================================================
  * 事前定義
  * ========================================================== */
  // 1. 検索フォームの要素を取得
  const SearchFormElement = document.getElementById("SearchWordForm");
  // 2. 検索ワードを取得
  const SearchWord = SearchFormElement.value.trim();
  // 3. 投稿内容ラッパー要素取得
  const PostListWrapper = document.querySelectorAll(".PostListWrapper");

 /* ==========================================================
  * 投稿内容のフィルタリング
  * ========================================================== */
  if (SearchWord) {
    PostListWrapper.forEach((Post) => {
     /* ---------------------------------------------
      *  1. 事前定義
      * --------------------------------------------- */
      // 1. 投稿タイトルを取得
      const PostTitleElement = Post.querySelector(".PostTitle").textContent;

     /* ---------------------------------------------
      *  2. 投稿タイトルに検索ワードが含まれる場合
      * --------------------------------------------- */
      if (PostTitleElement.includes(SearchWord)) {
        // 1. 画面に表示
        Post.style.display = "block";

     /* ---------------------------------------------
      *  3. タイトルに検索ワードが含まれない場合
      * --------------------------------------------- */
      } else {
        // 1. 画面から非表示
        Post.style.display = "none";
      }
    });

 /* ==========================================================
  * 検索ワード未入力時
  * ========================================================== */
  } else {
    // 1. 投稿内容再表示
    DisplayPostList();
  }
}

/**
 * 検索フォームのクリア処理
 */
function ClearSearch() {
  // 1. 検索フォームの要素を取得
  const searchForm = document.getElementById("SearchWordForm");
  // 2. 検索フォームをクリア
  searchForm.value = "";
  // 3. 投稿の再表示
  DisplayPostList();
}

/**
 * 画像選択時イベント（複数画像対応）
 */
document.getElementById("imageInput").addEventListener("change", (event) => {
 /* ---------------------------------------------
  *  1. 事前定義
  * --------------------------------------------- */
  // 1. 画像名要素取得
  const FileName = document.getElementById("SelectFileNameForm");
  FileName.value = "";
  // 2. 選択されたファイルを取得
  const SelectImages = Array.from(event.target.files);

 /* ---------------------------------------------
  *  2. ファイルが存在する場合
  * --------------------------------------------- */
  if (SelectImages.length > 0) {
    // 1. 4枚を超える場合は警告
    if (SelectImages.length > 4) {
      DialogIncetance.ShowDialog("画像は最大4枚まで選択できます。");
      event.target.value = "";
      return;
    }
    // 2. ファイル名を結合して表示
    FileName.value = SelectImages.map((f) => f.name).join(", ");

 /* ---------------------------------------------
  *  3. ファイルが存在しない場合
  * --------------------------------------------- */
  } else {
    // 1. ファイル未選択のメッセージを表示
    FileName.value = GetMessageInfo("error", "007", "ファイル");
  }
});

/**
 * マークダウンやURLの変換処理
 * @param {*} FormattText 整形を行う投稿内容の文字列
 * @returns 入力内容を埋め込んだDOM文字列
 */
function convertMarkdown(FormattText) {
 /* ==========================================================
  * 事前定義
  * ========================================================== */
 /* ---------------------------------------------
  *  1. 入力バリデーションチェック
  * --------------------------------------------- */
  if (!FormattText) {
    return "";
  }

 /* ==========================================================
  * マークダウン変換
  * ========================================================== */
 /* ---------------------------------------------
  *  1. [```diff]で差分コードブロックの作成
  * --------------------------------------------- */
  FormattText = FormattText.replace(/```diff\n([\s\S]*?)```/g, (_, code) => {
    // 1. 各行を処理して色分け
    const lines = escapeHtml(code)
      .split("\n")
      .map((line) => {
        if (line.startsWith("+")) {
          return `<span class="diff-add">${line}</span>`;
        } else if (line.startsWith("-")) {
          return `<span class="diff-remove">${line}</span>`;
        }
        return `<span>${line}</span>`;
      })
      .join("\n");
    return `<pre class="CodeBlock DiffBlock"><code>${lines}</code></pre>`;
  });

 /* ---------------------------------------------
  *  2. [```]でコードブロックの作成
  * --------------------------------------------- */
  FormattText = FormattText.replace(/```([\s\S]*?)```/g, (_, code) => {
    return `<pre class="CodeBlock"><code>${escapeHtml(code)}</code></pre>`;
  });

 /* ---------------------------------------------
  *  3. [**]で見出し(大)の作成
  * --------------------------------------------- */
  FormattText = FormattText.replace(/\*\*(.+?)\*\*/g, '<h2 class="md-h2">$1</h2>');

 /* ---------------------------------------------
  *  4. [*]で見出し(小)の作成
  * --------------------------------------------- */
  FormattText = FormattText.replace(/\*(.+?)\*/g, '<h3 class="md-h3">$1</h3>');

 /* ---------------------------------------------
  *  5. [-]でリスト項目の作成
  * --------------------------------------------- */
  FormattText = FormattText.replace(
    /(^|\n)(- .+(?:\n- .+)*)/g,
    (_, prefix, block) => {
      const items = block
        .split("\n")
        .map((line) => {
          const text = line.replace(/^- /, "");
          return `<li class="md-list-item">${text}</li>`;
        })
        .join("");
      return `${prefix}<ul class="md-list">${items}</ul>`;
    }
  );

 /* ---------------------------------------------
  *  6. URL を自動リンク化
  * --------------------------------------------- */
  FormattText = FormattText.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" class="md-link" target="_blank" rel="noopener noreferrer">$1</a>'
  );

 /* ==========================================================
  * 処理終了時
  * ========================================================== */
  // 1. 戻り値を返す
  return FormattText;
}

/**
 * HTMLエスケープ処理
 * @param {string} EscapeString 特殊文字
 * @returns エスケープされた文字列
 */
function escapeHtml(EscapeString) {
  // 1. 特殊文字をエスケープして返す
  return EscapeString
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * 投稿処理（複数画像対応）
 * @returns
 */
function addPost() {
  // 1. タイトル取得
  const title = document.getElementById("titleInput").value.trim();
  // 2. 本文取得
  const rawBody = document.getElementById("bodyInput").value.trim();
  // 3. 画像ファイル取得（複数）
  const files = Array.from(document.getElementById("imageInput").files);

  /* タイトルが空の場合は処理を終了 */
  if (!title) {
    DialogIncetance.ShowDialog(GetMessageInfo("error", "006", "タイトル"));
    return;
  }

  /* 本文が空の場合は処理を終了 */
  if (!rawBody) {
    DialogIncetance.ShowDialog(GetMessageInfo("error", "006", "本文"));
    return;
  }

  /* 重複チェック */
  const isDuplicate = SavePostArray.some((post, Index) => {
    if (EditIndex !== null && EditIndex === Index){
       return false;
    }
    return post.title === title && IsCurrentPost(post);
  });

  if (isDuplicate) {
    DialogIncetance.ShowDialog(GetMessageInfo("error", "003"));
    return;
  }

  /* 投稿処理 */
  const finalize = (imageDataArray) => {
    const newPost = {
      title,
      body: rawBody,
      images: imageDataArray,
      imagenames: files.length > 0 ? files.map((f) => f.name) : [],
      image: imageDataArray.length > 0 ? imageDataArray[0] : null,
      imagename: files.length > 0 ? files[0].name : null,
      menuId: CurrentMenu ? CurrentMenu.id : null,
      key: CurrentDisplayName || null,
    };

    if (EditIndex !== null) {
      SavePostArray[EditIndex] = newPost;
      EditIndex = null;
    } else {
      SavePostArray.push(newPost);
    }

    SavePostList();
    DisplayPostList();

    // 入力クリア
    document.getElementById("titleInput").value = "";
    document.getElementById("bodyInput").value = "";
    document.getElementById("imageInput").value = "";
    document.getElementById("SearchWordForm").value = "";
    document.getElementById("SelectFileNameForm").value = "";
  };

  if (files.length > 0) {
    // 1. 複数画像の読み込み
    const promises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then((results) => finalize(results));
  } else {
    // 2. 既存画像の保持（編集時）
    const existingImages =
      EditIndex !== null
        ? SavePostArray[EditIndex].images ||
          (SavePostArray[EditIndex].image
            ? [SavePostArray[EditIndex].image]
            : [])
        : [];
    finalize(existingImages);
  }
}

/**
 * 学習内容の出力処理
 * CSVファイルを出力する(PDFはさすがにできなさそう)
 */
function PreateLearningInfo() {
  /* 事前定義 */
  // 1. 出力内容を保持する配列
  const CsvInfo = [];
  // 2. セッションに保持されているセクション名を取得
  const SectionName = sessionStorage.getItem("SectionInfo");
  // 3. 学習内容のヘッダーを保持する
  const LearningHeader = `${document
    .getElementById("HeaderText")
    .textContent.trim()}`;

  /* 投稿内容の取得処理 */
  if (0 < SavePostArray.length) {
    SavePostArray.forEach((post) => {
      /* 投稿のキーが現在のキーと一致しない場合はスキップ */
      if (!IsCurrentPost(post)) {
        return;
      }
      /* 投稿内容のタイトルと本文を取得 */
      const CsvInfoItems = {
        // 1. タイトル
        title: post.title,
        // 2. 本文
        body: post.body,
      };
      /* 出力内容を保持する配列にセット */
      CsvInfo.push(CsvInfoItems);
    });
  }
  /* 出力用にデータを整形 */
  const PrintData = CsvInfo.map((item, Index) => {
    return `【${Index + 1}】${item.title}\n\n${item.body}\n${CreateLine()}\n`;
  }).join("\n");

  /* printDataの先頭にヘッダーを追加 */
  const csvData =
    `\n【${SectionName} : ${LearningHeader}】\n${CreateLine()}\n\n` + PrintData;

  /* ダウンロード処理 */
  // 1. バイナリデータの作成
  const blob = new Blob([csvData], { type: "text/plain;charset=utf-8;" });
  // 2. URLの作成
  const url = URL.createObjectURL(blob);
  // 3. アンカーの作成
  const a = document.createElement("a");
  // 4. 遷移先に、項番2で作成したURLを設定
  a.href = url;
  // 5. ファイル名設定
  a.download = `${LearningHeader}_${CreatYear()}.txt`;
  // 6. アンカークリック時のイベントを発火
  a.click();
  // 7. URLの削除
  URL.revokeObjectURL(url);
}

/**
 * 指定の投稿の出力
 */
function OutputPostInfo(Index) {
  /* 事前定義 */
  // 1. 出力内容を保持する配列
  const CsvInfo = [];
  // 2. セッションに保持されているセクション名を取得
  const SectionName = sessionStorage.getItem("SectionInfo");
  // 3. 学習内容のヘッダーを保持する
  const LearningHeader = `${document
    .getElementById("HeaderText")
    .textContent.trim()}`;
  // 4. 指定の投稿を取得
  const post = SavePostArray[Index];

  /* 投稿内容の取得処理 */
  if (!IsCurrentPost(post)) {
    return;
  }
  /* 投稿内容のタイトルと本文を取得 */
  const CsvInfoItems = {
    // 1. タイトル
    title: post.title,
    // 2. 本文
    body: post.body,
  };
  /* 出力内容を保持する配列にセット */
  CsvInfo.push(CsvInfoItems);
  /* 出力用にデータを整形 */
  const PrintData = CsvInfo.map((item, Index) => {
    return `【${Index + 1}】${item.title}\n\n${item.body}\n${CreateLine()}\n`;
  }).join("\n");
  /* printDataの先頭にヘッダーを追加 */
  const csvData =
    `\n【${SectionName} : ${LearningHeader}】\n${CreateLine()}\n\n` + PrintData;
  /* ダウンロード処理 */
  // 1. バイナリデータの作成
  const blob = new Blob([csvData], { type: "text/plain;charset=utf-8;" });
  // 2. URLの作成
  const url = URL.createObjectURL(blob);
  // 3. アンカーの作成
  const a = document.createElement("a");
  // 4. 遷移先に、項番2で作成したURLを設定
  a.href = url;
  // 5. ファイル名設定
  a.download = `${post.title}_${CreatYear()}.txt`;
  // 6. アンカークリック時のイベントを発火
  a.click();
  // 7. URLの削除
  URL.revokeObjectURL(url);
}

/**
 * 入力欄の拡大処理
 * 作成年月日 : 2025/11/06
 */
function CreateTextArea() {
  /* ==========================================================
   * 定義
   * ========================================================== */
  // 1. 入力フォーム内のテキストを取得
  const FormTextValue = document.getElementById("bodyInput").value;

  /* ==========================================================
   * ダイアログ本体の作成
   * ========================================================== */
  // 1. グループ要素作成
  const dialogContainer = document.createElement("div");
  // 2. クラス設定
  dialogContainer.classList.add("MessageDialog", "w-1000", "max-w-1000");

  /* ==========================================================
   * 背景クリックの無効化
   * ========================================================== */
  // 1. クラス設定
  document.body.classList.add("DialogActive");

  /* ==========================================================
   * テキストエリアの作成
   * ========================================================== */
  // 1. テキストエリア要素を作成
  const textArea = document.createElement("textarea");
  // 2. プレースホルダーの作成
  textArea.placeholder = "詳細・・・";
  // 3. クラス設定
  textArea.classList.add("TextAreaForm", "w-full", "h-500");
  // 4. ID設定
  textArea.id = "SummaryTextArea";
  // 5. 値の設定
  textArea.value = FormTextValue;

  /* ==========================================================
   * ボタンコンテナの作成
   * ========================================================== */
  // 1. グループ要素作成
  const ButtonContainer = document.createElement("div");
  // 2. クラスの設定
  ButtonContainer.className = "SummaryDialogButtonForm";

  /* ==========================================================
   * 決定ボタンの作成
   * ========================================================== */
  // 1. ボタン要素作成
  const resultButton = document.createElement("button");
  // 2. ラベル設定
  resultButton.innerHTML = "決定";
  // 3. クラス設定
  resultButton.classList.add("ButtonInfo");

  /* ==========================================================
   * クリアボタンの作成
   * ========================================================== */
  // 1. ボタン要素作成
  const clearButton = document.createElement("button");
  // 2. ラベル設定
  clearButton.innerHTML = "クリア";
  // 3. クラス設定
  clearButton.classList.add("ButtonInfo");


  /* ==========================================================
   * 閉じるボタンの作成
   * ========================================================== */
  // 1. ボタン要素作成
  const closeButton = document.createElement("button");
  // 2. ラベル設定
  closeButton.innerHTML = "閉じる";
  // 3. クラス設定
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
  // 1. テキストエリアをダイアログ本体に格納
  dialogContainer.appendChild(textArea);
  // 2. 各ボタンをボタンコンテナに格納
  ButtonContainer.append(resultButton, clearButton, closeButton);
  // 3. ボタンコンテナをダイアログ本体に格納
  dialogContainer.appendChild(ButtonContainer);
  // 4. バックドロップをボディに追加
  document.body.appendChild(DialogBackDrop);
  // 5. ダイアログ本体をボディに格納
  document.body.appendChild(dialogContainer);

  /* ==========================================================
   * 初期フォーカスを設定
   * ========================================================== */
  // 1. テキストエリアにフォーカスを設定
  textArea.focus();

  /* ==========================================================
   * 閉じるボタンの処理関数を作成
   * ========================================================== */
  const closeDialog = () => {
    // 1. ダイアログ本体をボディから取り除く
    if (document.body.contains(dialogContainer) && document.body.contains(DialogBackDrop)) {
      document.body.removeChild(dialogContainer);
      document.body.removeChild(DialogBackDrop);
    }
    // 2. 背景クリック無効化のクラスをボディから取り除く
    document.body.classList.remove("DialogActive");
    // 3. ESCキーの押下時のイベントリスナーを取り除く
    document.removeEventListener("keydown", escHandler);
  };

  /* ==========================================================
   * ESCキーの押下時のイベント定義
   * ========================================================== */
  const escHandler = (e) => {
    // 1. 押下されたキーがESCキーであれば閉じるボタンの処理を呼び出す
    if (e.key === "Escape") {
      closeDialog();
    }
  };

  /* ==========================================================
   * ESCキーをイベントリスナーに登録
   * ========================================================== */
  // 1. ESCキーをイベントリスナーに登録する
  document.addEventListener("keydown", escHandler);

  /* ==========================================================
   * 閉じるボタンの押下時のイベント定義
   * ========================================================== */
  closeButton.onclick = () => {
    // 1. 閉じるボタンの処理関数を呼び出す
    closeDialog();
  };

  /* ==========================================================
   * クリアボタンの押下時のイベント定義
   * ========================================================== */
  clearButton.onclick = () => {
    // 1. テキストエリアの入力値を初期化する
    textArea.value = "";
    // 2. フォーカスをテキストエリアに設定する
    textArea.focus();
  };

  /* ==========================================================
   * 決定ボタンの押下時のイベント定義
   * ========================================================== */
  resultButton.onclick = () => {
    /* 定義 */
    // 1. テキストエリアの入力値を取得する
    const result = textArea.value.trim();
    // 2. 元の入力欄の要素取得
    const FormText = document.getElementById("bodyInput");

    /* 値の反映を行う要素の取得が行えた場合 */
    if (FormText) {
      // 1. テキストエリアの入力値を反映させる
      FormText.value = result;
    }

    /* 閉じるボタンの処理を呼び出す */
    closeDialog(result);
  };
}

/**
 * 戻るボタンの処理
 */
function backPage() {
  /* 事前定義 */
  // 1. タイトル要素の取得
  const titleInput = document.getElementById("titleInput").value.trim();
  // 2. 本文要素の取得
  const bodyInput = document.getElementById("bodyInput").value.trim();
  // 3. 画像要素の取得
  const imageInput = document.getElementById("imageInput").files[0];
  // 4. 画像名要素の取得
  const imageName = document.getElementById("SelectFileNameForm").value.trim();

  /* 入力途中の要素が存在する場合 */
  if (titleInput || bodyInput || imageInput || imageName) {
    // 1. ダイアログを表示
    DialogIncetance
      .ShowConfirmDialog(GetMessageInfo("confirm", "001"))
      .then((result) => {
        /* [はい]が押下された場合は画面を戻る */
        if (result) {
          window.history.back();
        } else {
          /* [いいえ]が押下された場合は処理終了 */
          return;
        }
      });
    // 4. 入力途中が存在しなければそのまま処理終了
  } else {
    window.history.back();
  }
}
/**
 * クリアボタンの処理(入力フォームを初期化する)
 */
function clearEvent() {
  /* 事前定義 */
  // 1. タイトル要素の取得
  const titleInput = document.getElementById("titleInput").value.trim();
  // 2. 本文要素の取得
  const bodyInput = document.getElementById("bodyInput").value.trim();
  // 3. 画像要素の取得
  const imageInput = document.getElementById("imageInput").files[0];
  // 4. 画像名要素の取得
  const imageName = document.getElementById("SelectFileNameForm").value.trim();

  /* 入力途中の要素が存在する場合 */
  if (titleInput || bodyInput || imageInput || imageName) {
    // 1. ダイアログを表示
    DialogIncetance
      .ShowConfirmDialog(GetMessageInfo("confirm", "001"))
      .then((result) => {
        /* [はい]が押下された場合は画面を戻る */
        if (result) {
          // 1. タイトルをクリア
          document.getElementById("titleInput").value = "";
          // 2. 本文をクリア
          document.getElementById("bodyInput").value = "";
          // 3. 選択中の画像をクリア
          document.getElementById("imageInput").value = "";
          // 4. 画像名クリア
          document.getElementById("SelectFileNameForm").value = "";
          // 5. 編集中のインデックスをリセット
          EditIndex = null;
        } else {
          /* [いいえ]が押下された場合は処理終了 */
          return;
        }
      });
  } else {
    /* 入力途中が存在しなければそのまま処理終了 */
    // 1. タイトルをクリア
    document.getElementById("titleInput").value = "";
    // 2. 本文をクリア
    document.getElementById("bodyInput").value = "";
    // 3. 選択中の画像をクリア
    document.getElementById("imageInput").value = "";
    // 4. 画像名クリア
    document.getElementById("SelectFileNameForm").value = "";
    // 5. 編集中のインデックスをリセット
    EditIndex = null;
  }
}

/**
 * テキストのコピーイベント
 */
function PostCopy(bodyElement, Index) {
  /* 定義 */
  // 1. コピー内容の取得
  const textToCopy = bodyElement.textContent;
  // 2. ボタン要素の取得(ラベル変更用)
  const CopyButtonEl = document.getElementById(`CopyButton-${Index}`);
  // 3. コピーボタンに表示されているラベル
  const CopyButtonLabel = CopyButtonEl.textContent.trim();

  /* クリップボードへの設定処理 */
  navigator.clipboard
    .writeText(textToCopy)
    /* 成功時 */
    .then(() => {
      // 1. ラベル設定
      CopyButtonEl.textContent = "コピー完了";
      // 2. 仮で10秒後にラベルを戻す
      setTimeout(() => {
        CopyButtonEl.textContent = CopyButtonLabel;
      }, 10000);
    })
    /* 例外発生時 */
    .catch((err) => {
      // 1. エラーログ
      console.error("コピー失敗 : ", err);
      // 2. ラベル設定
      CopyButtonEl.textContent = "コピー失敗";
      // 3. 仮で3秒後にラベルを戻す
      setTimeout(() => {
        CopyButtonEl.textContent = CopyButtonLabel;
      }, 3000);
    });
}

/**
 * 修正ボタン押下時の処理
 * @param {int} Index 選択中の投稿インデックス
 */
function EditPostInfo(Index) {
  // 1. 編集対象の投稿内容を取得
  const EditPost = SavePostArray[Index];
  // 2. 入力フォームに値をセット
  document.getElementById("titleInput").value = EditPost.title;
  // 3. 本文入力フォームに値をセット
  document.getElementById("bodyInput").value = EditPost.body;
  // 4. 画像名入力フォームに値をセット（複数画像対応）
  const imageNames = EditPost.imagenames || (EditPost.imagename ? [EditPost.imagename] : []);
  document.getElementById("SelectFileNameForm").value = imageNames.join(", ");
  // 5. 編集中のインデックスを設定
  EditIndex = Index;
  // 6. 画面スクロールを最下部に移動
  window.scrollTo(0, document.body.scrollHeight);
}

/**
 * 削除ボタン押下時の処理
 * @param {*} Index 選択中の投稿インデックス
 */
function DeletePostInfo(Index) {
  /* 修正中の項目が存在する場合は削除を行わせない | 更新年月日 : 2025/09/09 | 更新者 : 恵島 */
  if (EditIndex !== null) {
    DialogIncetance.ShowDialog(GetMessageInfo("error", "004"));
    return;
  }

  /* 削除処理 */
  // 1. ダイアログを表示
  DialogIncetance.ShowConfirmDialog(GetMessageInfo("confirm", "003")).then((result) => {
    /* [はい]が押下された場合は画面を戻る */
    if (result) {
      // 1. 対象インデックスの要素を切り取り
      SavePostArray.splice(Index, 1);
      // 2. 投稿内容を保存
      SavePostList();
      // 3. 画面の読み込み
      DisplayPostList();
      // 4. 検索フォームをクリア
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
  // 1. コンテンツ要素取得
  const postListEl = document.getElementById("postList");
  // 2. スクロール位置を初期化
  if (postListEl) {
    postListEl.scrollTop = 0;
  }
}

/**
 * スクロールの下部へ移動するイベント
 */
function ScrollBottom() {
  // 1. コンテンツ要素取得
  const postListEl = document.getElementById("postList");
  // 2. スクロール位置を設定
  if (postListEl) {
    postListEl.scrollTop = postListEl.scrollHeight;
  }
}

/**
 * 学習内容の削除処理
 * menuIdに紐づくデータをlocalStorageから削除する
 * 作成年月日 : 2025/11/04
 */
function DeleteLearningInfo() {
  /* 事前定義 */
  // 1. ストレージ内の投稿を取得
  const SavePostArray = JSON.parse(localStorage.getItem("savedPosts")) || [];

  /* バリデーションチェック */
  // 1. currentMenuが存在しない場合
  if (!CurrentMenu && !CurrentDisplayName) {
    // 1. ダイアログ表示
    DialogIncetance.ShowDialog(GetMessageInfo("error", "005"));
    // 2. 処理終了
    return;
  }
  // 2. 投稿が存在しない場合
  if (SavePostArray.length === 0) {
    // 1. ダイアログ表示
    DialogIncetance.ShowDialog(GetMessageInfo("error", "002"));
    // 2. 処理終了
    return;
  }

  /* コンファーム表示 */
  DialogIncetance
    .ShowConfirmDialog(GetMessageInfo("confirm", "002", "ページ内の全ての投稿"))
    .then((result) => {
      /* [はい]が押下された場合 */
      if (result) {
        /* 削除対象の抽出処理 */
        const filterePost = SavePostArray.filter((post) => {
          // 1. 現在のメニューに属する投稿を除外
          return !IsCurrentPost(post);
        });

        /* 保持しているデータをクリア */
        localStorage.removeItem("savedPosts");

        /* localStorageへ再保存 */
        localStorage.setItem("savedPosts", JSON.stringify(filterePost));

        /* 画面の再読み込み */
        window.location.reload();
      } else {
        /* [いいえ]が押下された場合 */
        return;
      }
    });
}

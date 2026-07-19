/*
 * GrooBeat ヒアリングシート — 質問セット「ゴム印」v1.1
 * 指示書§3-2準拠。簡素構成（データ分岐なし／NGなし／やらないこと宣言なし／画像アップロードなし）。
 * 補足①（社長確定）：会社名・名前・住所・電話は「顧客管理」ではなく「印面に彫る内容（版下）」。
 *   → 独立した顧客情報欄は作らず、「印面に入れる内容」1本にまとめる。他システム整合は不要。
 * エンジン(index.html)の共通契約：{ meta, questions[] } を HEARING_SETS['gomuin'] へ登録するだけ。
 */
(function () {
  'use strict';

  var Q = [
    {
      id: 'G1', round: 'ご相談内容', sum: '種類',
      title: 'どのゴム印ですか？',
      options: [
        { emoji: '🟫', label: 'のべ板（台なしのゴム板のみ）', val: 'nobe' },
        { emoji: '🧱', label: 'プラ台（プラスチック台木つき）', val: 'puradai' },
        { emoji: '🔤', label: 'フリーメイト（文字を差し替えられる組み合わせ印）', val: 'freemate' },
        { emoji: '🏠', label: 'アドレス印（住所・社名用）', val: 'address' },
        { emoji: '⬛', label: 'T角（角型の既製ゴム印）', val: 'tkaku' },
        { emoji: '⚫', label: 'T丸（丸型の既製ゴム印）', val: 'tmaru' },
        { emoji: '📅', label: 'データー印（回転式の日付入り）', val: 'deta' },
        { emoji: '❓', label: 'その他・分からない（相談したい）', val: 'other' },
      ],
    },

    // ---- 種類別の追加（該当種類のときだけ表示）----
    {
      id: 'G2', round: '種類別のご確認', sum: '日付の表示形式',
      title: '日付の表示形式は？（データー印）',
      showIf: function (a) { return a.G1 && a.G1.val === 'deta'; },
      options: [
        { emoji: '🔢', label: '西暦（例 2026.7.20）' },
        { emoji: '🎌', label: '和暦（例 R8.7.20）' },
        { emoji: '🎨', label: 'おまかせ' },
      ],
    },
    {
      id: 'G3', round: '種類別のご確認', sum: '本体号数', type: 'text', optional: true,
      title: 'データー印の本体号数（分かれば）',
      placeholder: '例）1号・2号 など。分からなければ空欄でOK',
      showIf: function (a) { return a.G1 && a.G1.val === 'deta'; },
    },
    {
      id: 'G4', round: '種類別のご確認', sum: '段数', type: 'text',
      title: 'フリーメイトの段数は？',
      placeholder: '例）3段',
      showIf: function (a) { return a.G1 && a.G1.val === 'freemate'; },
    },
    {
      id: 'G5', round: '種類別のご確認', sum: '行数', type: 'text', optional: true,
      title: '何行入れますか？（分かる範囲でOK）',
      placeholder: '例）3行',
      showIf: function (a) { return a.G1 && ['nobe', 'puradai', 'address'].indexOf(a.G1.val) >= 0; },
    },

    // ---- 印面（版下）----
    {
      id: 'G6', round: '印面に入れる内容', sum: '印面内容', type: 'text', multiline: true,
      title: 'ハンコに彫る内容を教えてください',
      note: '会社名・お名前・ご住所・お電話番号など、印面に入れる文字をそのまま入力してください。レイアウトのご希望があれば一緒にどうぞ。',
      placeholder: '例）\n有限会社ぶんちゃん\n郡山市○○町1-2-3\nTEL 024-000-0000',
    },

    // ---- 共通仕様 ----
    {
      id: 'G7', round: '仕様', sum: 'サイズ', type: 'text', optional: true,
      title: 'サイズ（分かる範囲でOK）',
      placeholder: '例）mm または 号数。分からなければ空欄でOK（現物に合わせます）',
    },
    {
      id: 'G8', round: '仕様', sum: '書体',
      title: '書体はどれがよいですか？',
      options: [
        { emoji: '🖌️', label: '楷書' },
        { emoji: '🔠', label: 'ゴシック' },
        { emoji: '📜', label: '明朝' },
        { emoji: '🔵', label: '丸ゴシック' },
        { emoji: '✍️', label: '行書' },
        { emoji: '🏛️', label: '隷書' },
        { emoji: '🏯', label: '古印体' },
      ],
    },
    {
      id: 'G9', round: '仕様', sum: 'ゴム材質',
      title: 'ゴムの種類',
      options: [
        { emoji: '🔴', label: '赤ゴム' },
        { emoji: '⚪', label: '樹脂ゴム' },
        { emoji: '⚫', label: '黒ゴム' },
      ],
    },
    {
      id: 'G10', round: '仕様', sum: '個数', type: 'text',
      title: '必要な個数',
      placeholder: '例）1個',
      inputmode: 'numeric',
    },
    {
      id: 'G11', round: '納期', sum: '納期', type: 'text', optional: true,
      title: 'ご希望の納期（あれば）',
      placeholder: '例）7/25まで／なるべく早く など',
    },
  ];

  window.HEARING_SETS = window.HEARING_SETS || {};
  window.HEARING_SETS['gomuin'] = {
    meta: { key: 'gomuin', label: 'ゴム印', title: 'ゴム印ヒアリング' },
    questions: Q,
  };
})();

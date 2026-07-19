/*
 * GrooBeat ヒアリングシート — 質問セット「チラシ」v1（第2便・§3-5）
 * 共通型（データ分岐・NG・C・宣言）。原稿は受付後。アップロードは案内文(note)。宣言は本番文面（2026-07-20 社長確定）。
 */
(function () {
  'use strict';
  var Q = [
    { id: 'F1', round: 'ご相談内容', sum: 'ご依頼区分', title: 'ご依頼の種類は？',
      options: [
        { emoji: '✨', label: '新しくデザインする', val: 'new' },
        { emoji: '📎', label: '仕上がりデータを持っている（入稿）', val: 'data' },
        { emoji: '🔁', label: '前回と同じ・リピート', val: 'repeat' },
      ] },
    { id: 'F2', round: 'デザイン', sum: '避けたいこと', type: 'text', optional: true, showIf: isNew,
      title: 'これだけは避けたい、はありますか？（任意）', placeholder: '任意（原稿・記載内容は受付後にお伺いします）' },
    { id: 'F3', round: 'データ入稿', type: 'note', showIf: isData,
      title: '仕上がりデータの送付', body: '印刷用データ（ai / PDF など）は、受付後にLINE・メールでお送りください。' },
    { id: 'F4', round: 'リピート', sum: 'リピート内容', showIf: isRepeat,
      title: '前回からの変更は？',
      options: [{ emoji: '🟰', label: '前回とまったく同じ', val: 'same' }, { emoji: '✏️', label: '一部変更あり', val: 'change' }] },
    { id: 'F5', round: 'リピート', sum: '変更点', type: 'text', multiline: true, title: '変更したい点',
      placeholder: '例）日付と価格を変更 など',
      showIf: function (a) { return isRepeat(a) && a.F4 && a.F4.val === 'change'; } },

    { id: 'F6', round: '仕様', sum: 'サイズ', title: 'サイズ',
      options: [
        { emoji: '📄', label: 'A4' }, { emoji: '📄', label: 'A5' }, { emoji: '📄', label: 'A6' },
        { emoji: '📃', label: 'B4' }, { emoji: '📃', label: 'B5' }, { emoji: '📃', label: 'B6' },
        { emoji: '📰', label: 'A3' }, { emoji: '❓', label: 'その他・相談' },
      ] },
    { id: 'F7', round: '仕様', sum: '印刷面', title: '印刷面',
      options: [{ emoji: '1️⃣', label: '片面' }, { emoji: '2️⃣', label: '両面' }] },
    { id: 'F8', round: '仕様', sum: 'カラー', title: 'カラー',
      options: [
        { emoji: '🌈', label: '両面カラー' },
        { emoji: '⚫', label: '両面モノクロ' },
        { emoji: '🎭', label: '表カラー・裏モノクロ' },
      ] },
    { id: 'F9', round: '仕様', sum: '用紙の質感', title: '用紙の質感',
      note: '具体的な銘柄はお店で最適なものを選びます。',
      options: [
        { emoji: '✨', label: '光沢' },
        { emoji: '📄', label: 'マット' },
        { emoji: '📃', label: '上質紙（さらさら）' },
        { emoji: '🎨', label: 'おまかせ' },
      ] },
    { id: 'F10', round: '仕様', sum: '用紙の厚さ', title: '用紙の厚さ',
      options: [
        { emoji: '🍃', label: '薄め' },
        { emoji: '📄', label: '標準' },
        { emoji: '🧱', label: '厚め' },
      ] },
    { id: 'F11', round: '仕様', sum: '折り加工', title: '折り加工',
      options: [
        { emoji: '➖', label: 'なし（1枚もの）' },
        { emoji: '📑', label: '二つ折り' },
        { emoji: '📐', label: '三つ折り' },
      ] },
    { id: 'F12', round: '仕様', sum: '用途', multi: true, note: '複数選べます',
      title: '主な使い道は？',
      options: [
        { emoji: '🤝', label: '手渡し' },
        { emoji: '📮', label: 'ポスティング' },
        { emoji: '📰', label: '新聞折込' },
        { emoji: '🏪', label: '店頭設置' },
      ] },
    { id: 'F13', round: '仕様', sum: '数量', type: 'text', title: '数量', placeholder: '例）1000枚', inputmode: 'numeric' },
    { id: 'F14', round: '納期', sum: '納期', title: 'お急ぎ度',
      options: [
        { emoji: '⚡', label: '特急（できるだけ早く）' },
        { emoji: '🕒', label: '通常' },
        { emoji: '🍵', label: 'ゆっくりでOK' },
      ] },
    { id: 'F15', round: '納期', sum: '希望日', type: 'text', optional: true, title: 'ご希望日があれば（任意）', placeholder: '例）配布は8/1から' },

    { id: 'F16', round: 'お客様情報', sum: 'お客様のお名前', type: 'text', title: 'ご記入者のお名前', placeholder: 'ご記入ください' },
    { id: 'F17', round: 'お客様情報', sum: '会社名・屋号', type: 'text', optional: true, title: '会社名・屋号（任意）', placeholder: 'あれば' },
    { id: 'F18', round: 'お客様情報', sum: 'ご希望の連絡手段', title: 'ご連絡はどの方法がよいですか？',
      options: [{ emoji: '📞', label: '電話' }, { emoji: '💬', label: 'LINE' }, { emoji: '✉️', label: 'メール' }] },
    { id: 'F19', round: 'お客様情報', sum: 'ご連絡先', type: 'text', title: 'ご連絡先', placeholder: '電話番号／LINE ID／メールアドレス' },
    { id: 'F20', round: '素材', type: 'note', title: '素材・原稿について',
      body: '掲載する情報（原稿）やロゴ・写真などの素材は、受付後にLINE・メールでお送りいただけます。今お手元になくても大丈夫です。' },
    { id: 'F21', round: 'ご確認', type: 'confirm', title: '最後にご確認ください',
      body: [
        'このフォームの送信はご注文の確定ではありません。内容を確認のうえ、お店からご連絡いたします。',
        '金額の自動表示はいたしません。お見積りは内容を確認してから、責任を持ってお出しします。',
        'いただいた内容を、ご相談の目的以外に使うことはありません。',
      ], checkLabel: '上記を確認しました' },
  ];

  function isNew(a) { return a.F1 && a.F1.val === 'new'; }
  function isData(a) { return a.F1 && a.F1.val === 'data'; }
  function isRepeat(a) { return a.F1 && a.F1.val === 'repeat'; }

  window.HEARING_SETS = window.HEARING_SETS || {};
  window.HEARING_SETS['flyer'] = { meta: { key: 'flyer', label: 'チラシ', title: 'チラシ ヒアリング' }, questions: Q };
})();

/*
 * GrooBeat ヒアリングシート — 質問セット「ポスター」v1（第2便・§3-6）
 * 共通型（データ分岐・NG・C・宣言）。A3以下はチラシ側。宣言は本番文面（2026-07-20 社長確定）。
 */
(function () {
  'use strict';
  var Q = [
    { id: 'P1', round: 'ご相談内容', sum: 'ご依頼区分', title: 'ご依頼の種類は？',
      options: [
        { emoji: '✨', label: '新しくデザインする', val: 'new' },
        { emoji: '📎', label: '仕上がりデータを持っている（入稿）', val: 'data' },
        { emoji: '🔁', label: '前回と同じ・リピート', val: 'repeat' },
      ] },
    { id: 'P2', round: 'デザイン', sum: '避けたいこと', type: 'text', optional: true, showIf: isNew,
      title: 'これだけは避けたい、はありますか？（任意）', placeholder: '任意' },
    { id: 'P3', round: 'データ入稿', type: 'note', showIf: isData,
      title: '仕上がりデータの送付', body: '印刷用データ（ai / PDF など）は、受付後にLINE・メールでお送りください。' },
    { id: 'P4', round: 'リピート', sum: 'リピート内容', showIf: isRepeat,
      title: '前回からの変更は？',
      options: [{ emoji: '🟰', label: '前回とまったく同じ', val: 'same' }, { emoji: '✏️', label: '一部変更あり', val: 'change' }] },
    { id: 'P5', round: 'リピート', sum: '変更点', type: 'text', multiline: true, title: '変更したい点',
      placeholder: '例）日付を変更 など',
      showIf: function (a) { return isRepeat(a) && a.P4 && a.P4.val === 'change'; } },

    { id: 'P6', round: '仕様', sum: 'サイズ', title: 'サイズ',
      note: 'A3以下のサイズはチラシからご相談ください。',
      options: [
        { emoji: '📄', label: 'A2' }, { emoji: '📄', label: 'A1' },
        { emoji: '📃', label: 'B3' }, { emoji: '📃', label: 'B2' }, { emoji: '📃', label: 'B1' },
        { emoji: '❓', label: 'その他・相談' },
      ] },
    { id: 'P7', round: '仕様', sum: 'サイズ補足', type: 'text', optional: true,
      title: 'サイズの補足（任意）', placeholder: '例）幅900mmで作りたい など' },
    { id: 'P8', round: '仕様', sum: '用紙', title: '用紙',
      options: [
        { emoji: '✨', label: '光沢' },
        { emoji: '📄', label: 'マット' },
        { emoji: '🧱', label: '厚手' },
        { emoji: '🎨', label: 'おまかせ' },
      ] },
    { id: 'P9', round: '仕様', sum: '加工', title: '加工',
      options: [
        { emoji: '➖', label: 'なし' },
        { emoji: '✨', label: 'ラミネート 艶あり' },
        { emoji: '🌫️', label: 'ラミネート 艶なし（マット）' },
        { emoji: '🖼️', label: 'パネル貼り' },
      ] },
    { id: 'P10', round: '仕様', sum: '掲示場所', title: '掲示する場所',
      options: [{ emoji: '🏠', label: '屋内' }, { emoji: '🌤️', label: '屋外' }] },
    { id: 'P11', round: '仕様', sum: '数量', type: 'text', title: '数量', placeholder: '例）5枚', inputmode: 'numeric' },
    { id: 'P12', round: '納期', sum: '納期', title: 'お急ぎ度',
      options: [
        { emoji: '⚡', label: '特急（できるだけ早く）' },
        { emoji: '🕒', label: '通常' },
        { emoji: '🍵', label: 'ゆっくりでOK' },
      ] },
    { id: 'P13', round: '納期', sum: '希望日', type: 'text', optional: true, title: 'ご希望日があれば（任意）', placeholder: '例）掲示は8/1から' },

    { id: 'P14', round: 'お客様情報', sum: 'お客様のお名前', type: 'text', title: 'ご記入者のお名前', placeholder: 'ご記入ください' },
    { id: 'P15', round: 'お客様情報', sum: '会社名・屋号', type: 'text', optional: true, title: '会社名・屋号（任意）', placeholder: 'あれば' },
    { id: 'P16', round: 'お客様情報', sum: 'ご希望の連絡手段', title: 'ご連絡はどの方法がよいですか？',
      options: [{ emoji: '📞', label: '電話' }, { emoji: '💬', label: 'LINE' }, { emoji: '✉️', label: 'メール' }] },
    { id: 'P17', round: 'お客様情報', sum: 'ご連絡先', type: 'text', title: 'ご連絡先', placeholder: '電話番号／LINE ID／メールアドレス' },
    { id: 'P18', round: '素材', type: 'note', title: '素材について',
      body: '掲載する情報やロゴ・写真などの素材は、受付後にLINE・メールでお送りいただけます。今お手元になくても大丈夫です。' },
    { id: 'P19', round: 'ご確認', type: 'confirm', title: '最後にご確認ください',
      body: [
        'このフォームの送信はご注文の確定ではありません。内容を確認のうえ、お店からご連絡いたします。',
        '金額の自動表示はいたしません。お見積りは内容を確認してから、責任を持ってお出しします。',
        'いただいた内容を、ご相談の目的以外に使うことはありません。',
      ], checkLabel: '上記を確認しました' },
  ];

  function isNew(a) { return a.P1 && a.P1.val === 'new'; }
  function isData(a) { return a.P1 && a.P1.val === 'data'; }
  function isRepeat(a) { return a.P1 && a.P1.val === 'repeat'; }

  window.HEARING_SETS = window.HEARING_SETS || {};
  window.HEARING_SETS['poster'] = { meta: { key: 'poster', label: 'ポスター', title: 'ポスター ヒアリング' }, questions: Q };
})();

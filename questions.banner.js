/*
 * GrooBeat ヒアリングシート — 質問セット「横断幕・タペストリー」v1（第3便・§3-9）
 * 共通型（データ分岐・NG・C・宣言）。宣言は本番文面（2026-07-20 社長確定）。
 */
(function () {
  'use strict';
  var Q = [
    { id: 'B1', round: 'ご相談内容', sum: 'ご依頼区分', title: 'ご依頼の種類は？',
      options: [
        { emoji: '✨', label: '新しくデザインする', val: 'new' },
        { emoji: '📎', label: '仕上がりデータを持っている（入稿）', val: 'data' },
        { emoji: '🔁', label: '前回と同じ・リピート', val: 'repeat' },
      ] },
    { id: 'B2', round: 'デザイン', sum: '避けたいこと', type: 'text', optional: true, showIf: isNew,
      title: 'これだけは避けたい、はありますか？（任意）', placeholder: '任意' },
    { id: 'B3', round: 'データ入稿', type: 'note', showIf: isData,
      title: '仕上がりデータの送付', body: 'データ（ai / PDF など）は、受付後にLINE・メールでお送りください。' },
    { id: 'B4', round: 'リピート', sum: 'リピート内容', showIf: isRepeat,
      title: '前回からの変更は？',
      options: [{ emoji: '🟰', label: '前回とまったく同じ', val: 'same' }, { emoji: '✏️', label: '一部変更あり', val: 'change' }] },
    { id: 'B5', round: 'リピート', sum: '変更点', type: 'text', multiline: true, title: '変更したい点', placeholder: '例）文字を変更 など',
      showIf: function (a) { return isRepeat(a) && a.B4 && a.B4.val === 'change'; } },

    { id: 'B6', round: '仕様', sum: '種類', title: 'どちらですか？',
      options: [
        { emoji: '➡️', label: '横断幕（横長・掲示用）' },
        { emoji: '⬇️', label: 'タペストリー（縦長・吊り下げ）' },
      ] },
    { id: 'B7', round: '仕様', sum: 'サイズ', type: 'text', title: 'サイズ（mm）', placeholder: '例）3000×900mm。わかる範囲でOK' },
    { id: 'B8', round: '仕様', sum: '素材', title: '素材',
      options: [
        { emoji: '🧵', label: 'トロマット（布地・発色きれい）' },
        { emoji: '🏗️', label: 'ターポリン（ナイロン・丈夫で屋外向き）' },
        { emoji: '🎨', label: 'おまかせ' },
      ] },
    { id: 'B9', round: '仕様', sum: '仕上げ', title: '仕上げ（取り付け方）',
      options: [
        { emoji: '⭕', label: 'ハトメ（穴＋金具）' },
        { emoji: '🪵', label: '棒袋（棒を通す袋）' },
        { emoji: '🎨', label: 'おまかせ' },
      ] },
    { id: 'B10', round: '仕様', sum: '数量', type: 'text', title: '数量', placeholder: '例）1枚', inputmode: 'numeric' },
    { id: 'B11', round: '納期', sum: '納期', title: 'お急ぎ度',
      options: [{ emoji: '⚡', label: '特急（できるだけ早く）' }, { emoji: '🕒', label: '通常' }, { emoji: '🍵', label: 'ゆっくりでOK' }] },
    { id: 'B12', round: '納期', sum: '使用日', type: 'text', optional: true, title: '使う予定日があれば（任意）', placeholder: '例）8/1から掲示' },

    { id: 'B13', round: 'お客様情報', sum: 'お客様のお名前', type: 'text', title: 'ご記入者のお名前', placeholder: 'ご記入ください' },
    { id: 'B14', round: 'お客様情報', sum: '会社名・屋号', type: 'text', optional: true, title: '会社名・屋号（任意）', placeholder: 'あれば' },
    { id: 'B15', round: 'お客様情報', sum: 'ご希望の連絡手段', title: 'ご連絡はどの方法がよいですか？',
      options: [{ emoji: '📞', label: '電話' }, { emoji: '💬', label: 'LINE' }, { emoji: '✉️', label: 'メール' }] },
    { id: 'B16', round: 'お客様情報', sum: 'ご連絡先', type: 'text', title: 'ご連絡先', placeholder: '電話番号／LINE ID／メールアドレス' },
    { id: 'B17', round: '素材', type: 'note', title: '素材について', body: 'ロゴやデザインの素材は、受付後にLINE・メールでお送りいただけます。' },
    { id: 'B18', round: 'ご確認', type: 'confirm', title: '最後にご確認ください',
      body: [
        'このフォームの送信はご注文の確定ではありません。内容を確認のうえ、お店からご連絡いたします。',
        '金額の自動表示はいたしません。お見積りは内容を確認してから、責任を持ってお出しします。',
        'いただいた内容を、ご相談の目的以外に使うことはありません。',
      ], checkLabel: '上記を確認しました' },
  ];
  function isNew(a) { return a.B1 && a.B1.val === 'new'; }
  function isData(a) { return a.B1 && a.B1.val === 'data'; }
  function isRepeat(a) { return a.B1 && a.B1.val === 'repeat'; }
  window.HEARING_SETS = window.HEARING_SETS || {};
  window.HEARING_SETS['banner'] = { meta: { key: 'banner', label: '横断幕・タペストリー', title: '横断幕・タペストリー ヒアリング' }, questions: Q };
})();

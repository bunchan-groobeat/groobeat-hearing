/*
 * GrooBeat ヒアリングシート — 質問セット「のぼり」v1（第3便・§3-8）
 * 共通型（データ分岐・NG・C・宣言）。宣言は仮文言。
 */
(function () {
  'use strict';
  var Q = [
    { id: 'N1', round: 'ご相談内容', sum: 'ご依頼区分', title: 'ご依頼の種類は？',
      options: [
        { emoji: '✨', label: '新しくデザインする', val: 'new' },
        { emoji: '📎', label: '仕上がりデータを持っている（入稿）', val: 'data' },
        { emoji: '🔁', label: '前回と同じ・リピート', val: 'repeat' },
      ] },
    { id: 'N2', round: 'デザイン', sum: '避けたいこと', type: 'text', optional: true, showIf: isNew,
      title: 'これだけは避けたい、はありますか？（任意）', placeholder: '任意' },
    { id: 'N3', round: 'データ入稿', type: 'note', showIf: isData,
      title: '仕上がりデータの送付', body: 'データ（ai / PDF など）は、受付後にLINE・メールでお送りください。' },
    { id: 'N4', round: 'リピート', sum: 'リピート内容', showIf: isRepeat,
      title: '前回からの変更は？',
      options: [{ emoji: '🟰', label: '前回とまったく同じ', val: 'same' }, { emoji: '✏️', label: '一部変更あり', val: 'change' }] },
    { id: 'N5', round: 'リピート', sum: '変更点', type: 'text', multiline: true, title: '変更したい点', placeholder: '例）色だけ変更 など',
      showIf: function (a) { return isRepeat(a) && a.N4 && a.N4.val === 'change'; } },

    { id: 'N6', round: '仕様', sum: 'サイズ', title: 'サイズ',
      options: [
        { emoji: '🚩', label: '600×1800mm（標準）' },
        { emoji: '🎏', label: '450×1800mm（スリム）' },
        { emoji: '❓', label: 'その他・相談' },
      ] },
    { id: 'N7', round: '仕様', sum: 'サイズ補足', type: 'text', optional: true, title: 'サイズの補足（任意）', placeholder: '例）幅700mmで など' },
    { id: 'N8', round: '仕様', sum: '設置環境', title: '設置環境',
      options: [{ emoji: '🏠', label: '屋内' }, { emoji: '🌤️', label: '屋外' }] },
    { id: 'N9', round: '仕様', sum: '付属', title: 'ポール・スタンドは？',
      options: [
        { emoji: '🚩', label: '本体のみ' },
        { emoji: '📏', label: 'ポール付き' },
        { emoji: '🦵', label: 'ポール＋スタンド付き' },
      ] },
    { id: 'N10', round: '仕様', sum: '生地', type: 'text', optional: true, title: '生地の希望（任意）', placeholder: 'おまかせでOK。希望があれば' },
    { id: 'N11', round: '仕様', sum: 'チチの向き', title: 'チチ（ポールを通す輪）の向き',
      options: [{ emoji: '⬅️', label: '左' }, { emoji: '➡️', label: '右' }, { emoji: '🎨', label: 'おまかせ' }] },
    { id: 'N12', round: '仕様', sum: '枚数', type: 'text', title: '枚数', placeholder: '例）5枚', inputmode: 'numeric' },
    { id: 'N13', round: '仕様', sum: 'デザイン種類', title: 'デザインは何種類？',
      options: [{ emoji: '1️⃣', label: '1種類', val: 'one' }, { emoji: '🔢', label: '複数', val: 'multi' }] },
    { id: 'N14', round: '仕様', sum: 'デザイン内訳', type: 'text', multiline: true, title: '種類数と内訳枚数',
      placeholder: '例）A柄×3、B柄×2',
      showIf: function (a) { return a.N13 && a.N13.val === 'multi'; } },
    { id: 'N15', round: '納期', sum: '納期', title: 'お急ぎ度',
      options: [{ emoji: '⚡', label: '特急（できるだけ早く）' }, { emoji: '🕒', label: '通常' }, { emoji: '🍵', label: 'ゆっくりでOK' }] },
    { id: 'N16', round: '納期', sum: '使用日', type: 'text', optional: true, title: '使う予定日があれば（任意）', placeholder: '例）8/1のイベントで' },

    { id: 'N17', round: 'お客様情報', sum: 'お客様のお名前', type: 'text', title: 'ご記入者のお名前', placeholder: 'ご記入ください' },
    { id: 'N18', round: 'お客様情報', sum: '会社名・屋号', type: 'text', optional: true, title: '会社名・屋号（任意）', placeholder: 'あれば' },
    { id: 'N19', round: 'お客様情報', sum: 'ご希望の連絡手段', title: 'ご連絡はどの方法がよいですか？',
      options: [{ emoji: '📞', label: '電話' }, { emoji: '💬', label: 'LINE' }, { emoji: '✉️', label: 'メール' }] },
    { id: 'N20', round: 'お客様情報', sum: 'ご連絡先', type: 'text', title: 'ご連絡先', placeholder: '電話番号／LINE ID／メールアドレス' },
    { id: 'N21', round: '素材', type: 'note', title: '素材について', body: 'ロゴやデザインの素材は、受付後にLINE・メールでお送りいただけます。' },
    { id: 'N22', round: 'ご確認', type: 'confirm', title: '最後にご確認ください',
      body: [
        'お預かりしたデザイン・データは、この案件の制作以外には使用しません。',
        '校了（最終確認）後の作り直しは、別途お見積りになる場合があります。',
        '仕上がりの色味は、画面と実物で多少異なる場合があります。',
      ], checkLabel: '上記を確認しました' },
  ];
  function isNew(a) { return a.N1 && a.N1.val === 'new'; }
  function isData(a) { return a.N1 && a.N1.val === 'data'; }
  function isRepeat(a) { return a.N1 && a.N1.val === 'repeat'; }
  window.HEARING_SETS = window.HEARING_SETS || {};
  window.HEARING_SETS['nobori'] = { meta: { key: 'nobori', label: 'のぼり', title: 'のぼり ヒアリング' }, questions: Q };
})();

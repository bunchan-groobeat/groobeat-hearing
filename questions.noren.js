/*
 * GrooBeat ヒアリングシート — 質問セット「のれん」v1（第3便・§3-10）
 * 共通型（データ分岐・NG・C・宣言）。宣言は仮文言。
 */
(function () {
  'use strict';
  var Q = [
    { id: 'R1', round: 'ご相談内容', sum: 'ご依頼区分', title: 'ご依頼の種類は？',
      options: [
        { emoji: '✨', label: '新しくデザインする', val: 'new' },
        { emoji: '📎', label: '仕上がりデータを持っている（入稿）', val: 'data' },
        { emoji: '🔁', label: '前回と同じ・リピート', val: 'repeat' },
      ] },
    { id: 'R2', round: 'デザイン', sum: '避けたいこと', type: 'text', optional: true, showIf: isNew,
      title: 'これだけは避けたい、はありますか？（任意）', placeholder: '任意' },
    { id: 'R3', round: 'データ入稿', type: 'note', showIf: isData,
      title: '仕上がりデータの送付', body: 'データ（ai / PDF など）は、受付後にLINE・メールでお送りください。' },
    { id: 'R4', round: 'リピート', sum: 'リピート内容', showIf: isRepeat,
      title: '前回からの変更は？',
      options: [{ emoji: '🟰', label: '前回とまったく同じ', val: 'same' }, { emoji: '✏️', label: '一部変更あり', val: 'change' }] },
    { id: 'R5', round: 'リピート', sum: '変更点', type: 'text', multiline: true, title: '変更したい点', placeholder: '例）屋号を変更 など',
      showIf: function (a) { return isRepeat(a) && a.R4 && a.R4.val === 'change'; } },

    { id: 'R6', round: '仕様', sum: 'サイズ', type: 'text', title: 'サイズ（mm）',
      note: '設置する間口に合わせます。わかる範囲でOK。', placeholder: '例）幅1700×高さ450mm' },
    { id: 'R7', round: '仕様', sum: '割れ数', title: '割れ数（のれんの切れ込み）',
      options: [
        { emoji: '2️⃣', label: '2巾（ふたはば）' },
        { emoji: '3️⃣', label: '3巾' },
        { emoji: '4️⃣', label: '4巾' },
        { emoji: '🎨', label: 'おまかせ' },
      ] },
    { id: 'R8', round: '仕様', sum: '仕立て', title: '仕立て（吊り方）',
      options: [
        { emoji: '🪵', label: '棒袋（棒を通す袋）' },
        { emoji: '⭕', label: 'チチ（輪）' },
        { emoji: '🎨', label: 'おまかせ' },
      ] },
    { id: 'R9', round: '仕様', sum: '設置環境', title: '設置環境',
      options: [{ emoji: '🏠', label: '屋内' }, { emoji: '🌤️', label: '屋外' }] },
    { id: 'R10', round: '仕様', sum: '生地', type: 'text', optional: true, title: '生地の希望（任意）', placeholder: 'おまかせでOK。希望があれば' },
    { id: 'R11', round: '仕様', sum: '数量', type: 'text', title: '数量', placeholder: '例）1枚', inputmode: 'numeric' },
    { id: 'R12', round: '納期', sum: '納期', title: 'お急ぎ度',
      options: [{ emoji: '⚡', label: '特急（できるだけ早く）' }, { emoji: '🕒', label: '通常' }, { emoji: '🍵', label: 'ゆっくりでOK' }] },
    { id: 'R13', round: '納期', sum: '使用日', type: 'text', optional: true, title: '使う予定日があれば（任意）', placeholder: '例）開店に合わせて' },

    { id: 'R14', round: 'お客様情報', sum: 'お客様のお名前', type: 'text', title: 'ご記入者のお名前', placeholder: 'ご記入ください' },
    { id: 'R15', round: 'お客様情報', sum: '会社名・屋号', type: 'text', optional: true, title: '会社名・屋号（任意）', placeholder: 'あれば' },
    { id: 'R16', round: 'お客様情報', sum: 'ご希望の連絡手段', title: 'ご連絡はどの方法がよいですか？',
      options: [{ emoji: '📞', label: '電話' }, { emoji: '💬', label: 'LINE' }, { emoji: '✉️', label: 'メール' }] },
    { id: 'R17', round: 'お客様情報', sum: 'ご連絡先', type: 'text', title: 'ご連絡先', placeholder: '電話番号／LINE ID／メールアドレス' },
    { id: 'R18', round: '素材', type: 'note', title: '素材について', body: '屋号やロゴの素材は、受付後にLINE・メールでお送りいただけます。' },
    { id: 'R19', round: 'ご確認', type: 'confirm', title: '最後にご確認ください',
      body: [
        'お預かりしたデザイン・データは、この案件の制作以外には使用しません。',
        '校了（最終確認）後の作り直しは、別途お見積りになる場合があります。',
        '仕上がりの色味は、画面と実物で多少異なる場合があります。',
      ], checkLabel: '上記を確認しました' },
  ];
  function isNew(a) { return a.R1 && a.R1.val === 'new'; }
  function isData(a) { return a.R1 && a.R1.val === 'data'; }
  function isRepeat(a) { return a.R1 && a.R1.val === 'repeat'; }
  window.HEARING_SETS = window.HEARING_SETS || {};
  window.HEARING_SETS['noren'] = { meta: { key: 'noren', label: 'のれん', title: 'のれん ヒアリング' }, questions: Q };
})();

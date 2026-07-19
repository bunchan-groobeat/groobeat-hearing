/*
 * GrooBeat ヒアリングシート — 質問セット「グッズ・ノベルティ」v1（第3便・§3-12）
 * 共通型（データ分岐・NG・C・宣言）。品目に「その他（新商品の受け皿）」。宣言は仮文言。
 */
(function () {
  'use strict';
  var Q = [
    { id: 'D1', round: 'ご相談内容', sum: '品目', title: 'どのグッズですか？',
      options: [
        { emoji: '🔥', label: 'ライター', val: 'std' },
        { emoji: '☕', label: 'マグカップ', val: 'std' },
        { emoji: '📛', label: '缶バッジ', val: 'std' },
        { emoji: '🪪', label: 'ネームプレート', val: 'std' },
        { emoji: '🥤', label: 'タンブラー', val: 'std' },
        { emoji: '🔑', label: 'キーホルダー', val: 'std' },
        { emoji: '❓', label: 'その他（相談したい）', val: 'other' },
      ] },
    { id: 'D2', round: 'ご相談内容', sum: '品目（その他）', type: 'text',
      title: 'どんなグッズか教えてください', placeholder: '例）モバイルバッテリー、トートバッグ など',
      showIf: function (a) { return a.D1 && a.D1.val === 'other'; } },

    { id: 'D3', round: 'ご相談内容', sum: 'ご依頼区分', title: 'ご依頼の種類は？',
      options: [
        { emoji: '✨', label: '新しくデザインする', val: 'new' },
        { emoji: '📎', label: '仕上がりデータを持っている（入稿）', val: 'data' },
        { emoji: '🔁', label: '前回と同じ・リピート', val: 'repeat' },
      ] },
    { id: 'D4', round: 'デザイン', sum: '避けたいこと', type: 'text', optional: true, showIf: isNew,
      title: 'これだけは避けたい、はありますか？（任意）', placeholder: '任意' },
    { id: 'D5', round: 'データ入稿', type: 'note', showIf: isData,
      title: '仕上がりデータの送付', body: 'データ（ai / PDF / 画像など）は、受付後にLINE・メールでお送りください。' },
    { id: 'D6', round: 'リピート', sum: 'リピート内容', showIf: isRepeat,
      title: '前回からの変更は？',
      options: [{ emoji: '🟰', label: '前回とまったく同じ', val: 'same' }, { emoji: '✏️', label: '一部変更あり', val: 'change' }] },
    { id: 'D7', round: 'リピート', sum: '変更点', type: 'text', multiline: true, title: '変更したい点', placeholder: '例）数量だけ変更 など',
      showIf: function (a) { return isRepeat(a) && a.D6 && a.D6.val === 'change'; } },

    { id: 'D8', round: '仕様', sum: '入れる内容', title: '入れる内容',
      options: [
        { emoji: '🅰️', label: 'ロゴ' },
        { emoji: '🔤', label: '文字' },
        { emoji: '🎯', label: 'ロゴ＋文字' },
        { emoji: '🤝', label: '相談したい' },
      ] },
    { id: 'D9', round: '仕様', sum: '個別名入れ', title: '個別の名入れは？', note: '詳細（名前リスト等）は受付後に承ります。',
      options: [{ emoji: '➖', label: 'なし' }, { emoji: '🔢', label: 'あり' }] },
    { id: 'D10', round: '仕様', sum: 'サイズ', type: 'text', optional: true, title: 'サイズ（わかる範囲でOK・任意）', placeholder: 'わからなければ空欄でOK' },
    { id: 'D11', round: '仕様', sum: '数量', type: 'text', title: '数量', placeholder: '例）100個', inputmode: 'numeric' },
    { id: 'D12', round: '仕様', sum: '色・仕様の希望', type: 'text', optional: true, title: '色・仕様の希望（任意）', placeholder: '例）本体は白、印刷は1色 など' },
    { id: 'D13', round: '納期', sum: '納期', title: 'お急ぎ度',
      options: [{ emoji: '⚡', label: '特急（できるだけ早く）' }, { emoji: '🕒', label: '通常' }, { emoji: '🍵', label: 'ゆっくりでOK' }] },
    { id: 'D14', round: '納期', sum: '使用日', type: 'text', optional: true, title: '使う予定日があれば（任意）', placeholder: '例）8/10のイベントで配布' },

    { id: 'D15', round: 'お客様情報', sum: 'お客様のお名前', type: 'text', title: 'ご記入者のお名前', placeholder: 'ご記入ください' },
    { id: 'D16', round: 'お客様情報', sum: '会社名・屋号', type: 'text', optional: true, title: '会社名・屋号（任意）', placeholder: 'あれば' },
    { id: 'D17', round: 'お客様情報', sum: 'ご希望の連絡手段', title: 'ご連絡はどの方法がよいですか？',
      options: [{ emoji: '📞', label: '電話' }, { emoji: '💬', label: 'LINE' }, { emoji: '✉️', label: 'メール' }] },
    { id: 'D18', round: 'お客様情報', sum: 'ご連絡先', type: 'text', title: 'ご連絡先', placeholder: '電話番号／LINE ID／メールアドレス' },
    { id: 'D19', round: '素材', type: 'note', title: '素材について', body: 'ロゴやデザインの素材は、受付後にLINE・メールでお送りいただけます。' },
    { id: 'D20', round: 'ご確認', type: 'confirm', title: '最後にご確認ください',
      body: [
        'お預かりしたデザイン・データは、この案件の制作以外には使用しません。',
        '校了（最終確認）後の作り直しは、別途お見積りになる場合があります。',
        '仕上がりの色味・質感は、画面と実物で多少異なる場合があります。',
      ], checkLabel: '上記を確認しました' },
  ];
  function isNew(a) { return a.D3 && a.D3.val === 'new'; }
  function isData(a) { return a.D3 && a.D3.val === 'data'; }
  function isRepeat(a) { return a.D3 && a.D3.val === 'repeat'; }
  window.HEARING_SETS = window.HEARING_SETS || {};
  window.HEARING_SETS['goods'] = { meta: { key: 'goods', label: 'グッズ・ノベルティ', title: 'グッズ・ノベルティ ヒアリング' }, questions: Q };
})();

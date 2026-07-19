/*
 * GrooBeat ヒアリングシート — 質問セット「Tシャツプリント」v1（第2便・§3-3）
 * 簡素化（§4.1/§0）：サイズ別枚数のマトリクス入力はエンジン非対応→自由記述1欄に集約。
 *   プリントサイズは位置ごと個別選択でなく「サイズ感」1問に集約。アップロードは案内文(note)。
 * 宣言は仮文言（社長支給待ち・★確定後差し替え）。
 */
(function () {
  'use strict';
  var Q = [
    {
      id: 'T1', round: 'ご相談内容', sum: 'ご依頼区分',
      title: 'ご依頼の種類は？',
      options: [
        { emoji: '✨', label: '新しくデザインする', val: 'new' },
        { emoji: '📎', label: '仕上がりデータを持っている（入稿）', val: 'data' },
        { emoji: '🔁', label: '前回と同じ・リピート', val: 'repeat' },
      ],
    },
    { id: 'T2', round: 'デザイン', sum: '避けたいこと', type: 'text', optional: true, showIf: isNew,
      title: 'これだけは避けたい、はありますか？（任意）', placeholder: '例）ごちゃごちゃさせたくない など' },
    { id: 'T3', round: 'データ入稿', type: 'note', showIf: isData,
      title: '仕上がりデータの送付', body: '印刷用データ（ai / PDF / 画像など）は、受付後にLINE・メールでお送りください。' },
    { id: 'T4', round: 'リピート', sum: 'リピート内容', showIf: isRepeat,
      title: '前回からの変更は？',
      options: [{ emoji: '🟰', label: '前回とまったく同じ', val: 'same' }, { emoji: '✏️', label: '一部変更あり', val: 'change' }] },
    { id: 'T5', round: 'リピート', sum: '変更点', type: 'text', multiline: true,
      title: '変更したい点', placeholder: '例）色を変えたい／枚数だけ変更 など',
      showIf: function (a) { return isRepeat(a) && a.T4 && a.T4.val === 'change'; } },

    // ---- 仕様 ----
    { id: 'T6', round: '仕様', sum: 'ボディ（生地）',
      title: 'ボディ（生地）のイメージ', note: '具体的な品番はお店で最適なものを提案します。',
      options: [
        { emoji: '👕', label: '定番（ほどよい厚み）' },
        { emoji: '🧥', label: '厚手（しっかり）' },
        { emoji: '💨', label: 'ドライ（速乾・スポーツ向き）' },
        { emoji: '🎨', label: 'おまかせ' },
      ] },
    { id: 'T7', round: '仕様', sum: 'ボディ色', type: 'text',
      title: 'ボディの色', placeholder: '例）白／黒／ネイビー など。決まっていなければ希望の系統を' },
    { id: 'T8', round: '仕様', sum: 'サイズ別の枚数', type: 'text', multiline: true,
      title: 'サイズと枚数',
      note: 'サイズごとの枚数を書いてください。品番により選べるサイズが変わるため、お店で調整します。',
      placeholder: '例）\nM × 10\nL × 5\nキッズ140 × 3' },
    { id: 'T9', round: '仕様', sum: 'プリント位置', multi: true, note: '複数選べます',
      title: 'プリントする位置',
      options: [
        { emoji: '⬆️', label: '前面' },
        { emoji: '⬇️', label: '背面' },
        { emoji: '↖️', label: '左胸（ワンポイント）' },
        { emoji: '💪', label: '袖' },
      ] },
    { id: 'T10', round: '仕様', sum: 'プリントサイズ感',
      title: 'プリントの大きさ',
      options: [
        { emoji: '🅰️', label: '大きめ（A4程度）' },
        { emoji: '🔲', label: '中くらい' },
        { emoji: '📍', label: 'ワンポイント（小さめ）' },
        { emoji: '🎨', label: 'おまかせ' },
      ] },
    { id: 'T11', round: '仕様', sum: '名入れ・背番号',
      title: '個別の名入れ・背番号は？', note: '詳細（名前リスト等）は受付後に承ります。',
      options: [{ emoji: '🔢', label: 'あり' }, { emoji: '➖', label: 'なし' }] },
    { id: 'T12', round: '納期', sum: '納期',
      title: 'お急ぎ度',
      options: [
        { emoji: '⚡', label: '特急（できるだけ早く）' },
        { emoji: '🕒', label: '通常' },
        { emoji: '🍵', label: 'ゆっくりでOK' },
      ] },
    { id: 'T13', round: '納期', sum: '使用日', type: 'text', optional: true,
      title: '着る予定日があれば（任意）', placeholder: '例）8/10のイベントで使用 など' },

    // ---- お客様情報 ----
    { id: 'T14', round: 'お客様情報', sum: 'お客様のお名前', type: 'text', title: 'ご記入者のお名前', placeholder: 'ご記入ください' },
    { id: 'T15', round: 'お客様情報', sum: '会社名・屋号', type: 'text', optional: true, title: '会社名・屋号・チーム名（任意）', placeholder: 'あれば' },
    { id: 'T16', round: 'お客様情報', sum: 'ご希望の連絡手段', title: 'ご連絡はどの方法がよいですか？',
      options: [{ emoji: '📞', label: '電話' }, { emoji: '💬', label: 'LINE' }, { emoji: '✉️', label: 'メール' }] },
    { id: 'T17', round: 'お客様情報', sum: 'ご連絡先', type: 'text', title: 'ご連絡先', placeholder: '電話番号／LINE ID／メールアドレス' },
    { id: 'T18', round: '素材', type: 'note', title: '素材について',
      body: 'ロゴやデザインの素材は、受付後にLINE・メールでお送りいただけます。今お手元になくても大丈夫です。' },
    { id: 'T19', round: 'ご確認', type: 'confirm', title: '最後にご確認ください',
      body: [
        'お預かりしたデザイン・データは、この案件の制作以外には使用しません。',
        '校了（最終確認）後の作り直しは、別途お見積りになる場合があります。',
        '仕上がりの色味は、画面と実物で多少異なる場合があります。',
      ], checkLabel: '上記を確認しました' },
  ];

  function isNew(a) { return a.T1 && a.T1.val === 'new'; }
  function isData(a) { return a.T1 && a.T1.val === 'data'; }
  function isRepeat(a) { return a.T1 && a.T1.val === 'repeat'; }

  window.HEARING_SETS = window.HEARING_SETS || {};
  window.HEARING_SETS['tshirt'] = { meta: { key: 'tshirt', label: 'Tシャツプリント', title: 'Tシャツプリント ヒアリング' }, questions: Q };
})();

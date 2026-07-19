/*
 * GrooBeat ヒアリングシート — 質問セット「看板」v1（第3便・§3-7）
 * 相談受付型：現地確認が前提。現場写真は本フォームの主役だがアップロード非対応→案内文(note)。
 * 完了は「送信＝見積ではなく現地確認・ご提案のご連絡」を明示（冒頭noteで案内）。宣言は仮文言。
 */
(function () {
  'use strict';
  var Q = [
    { id: 'K1', round: 'ご相談内容', sum: '看板の種類', multi: true, note: '複数選べます',
      title: 'どんな看板ですか？',
      options: [
        { emoji: '🧱', label: '壁面看板（パネル・チャンネル文字）' },
        { emoji: '🪧', label: 'スタンド看板（A型・電飾）' },
        { emoji: '🪟', label: 'ウィンドウサイン（ガラスシート）' },
        { emoji: '🚚', label: '車両マーキング（カッティングシート）' },
        { emoji: '🔧', label: '既存看板の貼り替え・修繕' },
      ] },
    { id: 'K2', round: 'ご相談内容', type: 'note',
      title: 'このフォームについて',
      body: '看板は現地確認が要になります。これは「ご相談の受付」です。送信後、現地確認・ご提案のご連絡をします（送信＝お見積り確定ではありません）。' },

    { id: 'K3', round: 'ご相談内容', sum: 'ご依頼区分', title: 'ご依頼の種類は？',
      options: [
        { emoji: '✨', label: '新しく作る／デザインから', val: 'new' },
        { emoji: '📎', label: '仕上がりデータを持っている（入稿）', val: 'data' },
        { emoji: '🔁', label: '前回と同じ・リピート', val: 'repeat' },
      ] },
    { id: 'K4', round: 'デザイン', sum: '避けたいこと', type: 'text', optional: true, showIf: isNew,
      title: 'これだけは避けたい、はありますか？（任意）', placeholder: '任意' },
    { id: 'K5', round: 'データ入稿', type: 'note', showIf: isData,
      title: '仕上がりデータの送付', body: 'データ（ai / PDF など）は、受付後にLINE・メールでお送りください。' },
    { id: 'K6', round: 'リピート', sum: 'リピート内容', showIf: isRepeat,
      title: '前回からの変更は？',
      options: [{ emoji: '🟰', label: '前回とまったく同じ', val: 'same' }, { emoji: '✏️', label: '一部変更あり', val: 'change' }] },
    { id: 'K7', round: 'リピート', sum: '変更点', type: 'text', multiline: true, title: '変更したい点', placeholder: '例）文字だけ変更 など',
      showIf: function (a) { return isRepeat(a) && a.K6 && a.K6.val === 'change'; } },

    { id: 'K8', round: '現地情報', sum: '設置場所', type: 'text', multiline: true,
      title: '設置する場所', note: '店舗名・ご住所など。現地調査に使います。', placeholder: '例）〇〇店（郡山市○○町1-2-3）の入口上' },
    { id: 'K9', round: '現地情報', type: 'note',
      title: '現場のお写真（あると話が早いです）',
      body: '設置場所のお写真があると、ご提案がスムーズです。受付後にLINE・メールでお送りください（このフォームでは画像は送信しません）。' },
    { id: 'K10', round: '現地情報', sum: 'サイズ感', type: 'text', optional: true,
      title: '大きさの希望（わかる範囲でOK）', placeholder: '不明でもOK（現地で採寸します）' },
    { id: 'K11', round: '現地情報', sum: '希望時期', type: 'text', optional: true,
      title: 'ご希望の時期（あれば）', placeholder: '例）来月中に など' },
    { id: 'K12', round: 'ご予算', sum: '予算感', title: 'ご予算の目安',
      note: 'あくまで目安です。現地確認のうえご提案します。',
      options: [
        { emoji: '💰', label: '〜5万円' },
        { emoji: '💰', label: '5〜15万円' },
        { emoji: '💰', label: '15〜30万円' },
        { emoji: '💰', label: '30万円以上' },
        { emoji: '🤝', label: '相談しながら決めたい' },
      ] },

    { id: 'K13', round: 'お客様情報', sum: 'お客様のお名前', type: 'text', title: 'ご記入者のお名前', placeholder: 'ご記入ください' },
    { id: 'K14', round: 'お客様情報', sum: '会社名・屋号', type: 'text', optional: true, title: '会社名・屋号（任意）', placeholder: 'あれば' },
    { id: 'K15', round: 'お客様情報', sum: 'ご希望の連絡手段', title: 'ご連絡はどの方法がよいですか？',
      options: [{ emoji: '📞', label: '電話' }, { emoji: '💬', label: 'LINE' }, { emoji: '✉️', label: 'メール' }] },
    { id: 'K16', round: 'お客様情報', sum: 'ご連絡先', type: 'text', title: 'ご連絡先', placeholder: '電話番号／LINE ID／メールアドレス' },
    { id: 'K17', round: 'ご確認', type: 'confirm', title: '最後にご確認ください',
      body: [
        '送信は「ご相談の受付」です。現地確認・ご提案のご連絡をします（お見積り確定ではありません）。',
        'お預かりした情報は、この案件の対応以外には使用しません。',
        '仕上がりの色味・見え方は、環境により多少異なる場合があります。',
      ], checkLabel: '上記を確認しました' },
  ];

  function isNew(a) { return a.K3 && a.K3.val === 'new'; }
  function isData(a) { return a.K3 && a.K3.val === 'data'; }
  function isRepeat(a) { return a.K3 && a.K3.val === 'repeat'; }

  window.HEARING_SETS = window.HEARING_SETS || {};
  window.HEARING_SETS['sign'] = { meta: { key: 'sign', label: '看板', title: '看板ヒアリング' }, questions: Q };
})();

/*
 * GrooBeat ヒアリングシート — 質問セット「名刺」v1
 * 指示書§3-1準拠。データ分岐（新規／入稿／リピート）＋新規A＋B仕様＋Cフル。
 * ファイルアップロードはエンジン非対応 → §4.2どおり「受付後にLINE等で送付」の案内文（note）に降格。
 * 記載情報（掲載する名前・肩書・連絡先等）は受付後の個別回収とし、ここでは訊かない。
 * やらないこと宣言は本番文面（2026-07-20 社長確定・全種目同文）。
 */
(function () {
  'use strict';

  var Q = [
    {
      id: 'M0', round: 'ご相談内容', sum: '種別',
      title: 'どんな名刺ですか？',
      options: [
        { emoji: '📇', label: '一般的な名刺', val: 'normal' },
        { emoji: '🎴', label: 'その他カード類（ショップカード・スタンプカード等）', val: 'other' },
      ],
    },
    {
      id: 'M0b', round: 'ご相談内容', sum: 'その他カードのご希望', type: 'text',
      title: 'どんなカードか教えてください',
      placeholder: '形状・用途・イメージなど（相談として承ります）',
      showIf: function (a) { return a.M0 && a.M0.val === 'other'; },
    },
    {
      id: 'M1', round: 'ご相談内容', sum: 'ご依頼区分',
      title: 'ご依頼の種類は？',
      options: [
        { emoji: '✨', label: '新しくデザインする', val: 'new' },
        { emoji: '📎', label: '仕上がりデータを持っている（入稿）', val: 'data' },
        { emoji: '🔁', label: '前回と同じ・リピート', val: 'repeat' },
      ],
    },

    // ===== 新規デザイン（Aブロック）=====
    {
      id: 'M2', round: 'デザイン', sum: '向き', showIf: isNew,
      title: '名刺の向き',
      options: [{ emoji: '📄', label: '縦型' }, { emoji: '📃', label: '横型' }],
    },
    {
      id: 'M3', round: 'デザイン', sum: '色の系統', showIf: isNew,
      title: '色の系統',
      options: [
        { emoji: '🔴', label: '暖色系（赤・オレンジ・黄など）' },
        { emoji: '🔵', label: '寒色系（青・緑など）' },
        { emoji: '⚫', label: 'モノトーン（白黒・グレー）' },
        { emoji: '🎨', label: 'おまかせ' },
      ],
    },
    {
      id: 'M4', round: 'デザイン', sum: '色の希望', type: 'text', optional: true, showIf: isNew,
      title: '色のご希望があれば（任意）',
      placeholder: '例）コーポレートカラーの紺色を使いたい など',
    },
    {
      id: 'M5', round: 'デザイン', sum: 'ロゴ', showIf: isNew,
      title: 'ロゴはありますか？',
      options: [
        { emoji: '✅', label: 'ロゴがある' },
        { emoji: '❌', label: 'ロゴはない' },
        { emoji: '🆕', label: 'ついでに作りたい' },
      ],
    },
    {
      id: 'M6', round: 'デザイン', type: 'note', showIf: isNew,
      title: '参考イメージのお写真',
      body: 'お好きな名刺の写真など、参考イメージがあれば受付後にLINE・メールでお送りください。このフォームでは画像は送信しません（受付後のやりとりで大丈夫です）。',
    },
    {
      id: 'M7', round: 'デザイン', sum: '避けたいこと', type: 'text', optional: true, showIf: isNew,
      title: 'これだけは避けたい、はありますか？（任意）',
      placeholder: '例）派手すぎるのは避けたい など',
    },

    // ===== リピート =====
    {
      id: 'M8', round: 'リピート', sum: 'リピート内容', showIf: isRepeat,
      title: '前回からの変更は？',
      options: [
        { emoji: '🟰', label: '前回とまったく同じ', val: 'same' },
        { emoji: '✏️', label: '一部変更あり', val: 'change' },
      ],
    },
    {
      id: 'M9', round: 'リピート', sum: '変更点', type: 'text', multiline: true,
      title: '変更したい点',
      placeholder: '例）電話番号を変更／肩書きを変更 など',
      showIf: function (a) { return isRepeat(a) && a.M8 && a.M8.val === 'change'; },
    },

    // ===== データ入稿 =====
    {
      id: 'M10', round: 'データ入稿', type: 'note', showIf: isData,
      title: '仕上がりデータの送付',
      body: '印刷用データ（PDF / ai など）は、受付後にLINE・メールでお送りください。',
    },

    // ===== 仕様（Bブロック・全区分共通）=====
    {
      id: 'M11', round: '仕様', sum: 'サイズ',
      title: 'サイズ',
      options: [
        { emoji: '📐', label: '標準（91×55mm）' },
        { emoji: '📐', label: '欧米サイズ（85×49mm）' },
        { emoji: '📐', label: '小型・その他' },
      ],
    },
    {
      id: 'M12', round: '仕様', sum: '数量', type: 'text',
      title: '枚数',
      placeholder: '例）100枚',
      inputmode: 'numeric',
    },
    {
      id: 'M13', round: '仕様', sum: '印刷面',
      title: '印刷面',
      options: [{ emoji: '1️⃣', label: '片面' }, { emoji: '2️⃣', label: '両面' }],
    },
    {
      id: 'M14', round: '仕様', sum: 'カラー',
      title: 'カラーは？',
      options: [
        { emoji: '🌈', label: 'フルカラー' },
        { emoji: '⚫', label: 'モノクロ' },
        { emoji: '🎭', label: '表カラー・裏モノクロ' },
      ],
    },
    {
      id: 'M15', round: '仕様', sum: '用紙',
      title: '用紙の質感',
      note: '具体的な銘柄はお店で最適なものを選びます。',
      options: [
        { emoji: '📄', label: 'マット（さらり・上品）' },
        { emoji: '✨', label: '光沢（つやあり・写真映え）' },
        { emoji: '🧱', label: '高級厚手（しっかり厚い）' },
        { emoji: '🎨', label: 'おまかせ' },
      ],
    },
    {
      id: 'M16', round: '仕様', sum: '加工', multi: true, note: '複数選べます',
      title: '加工のご希望',
      options: [
        { emoji: '⚪', label: '角丸' },
        { emoji: '🍃', label: 'PP（マット）' },
        { emoji: '💧', label: 'PP（グロス）' },
        { emoji: '🥇', label: '箔押し' },
        { emoji: '🔲', label: 'エンボス（凹凸）' },
        { emoji: '➖', label: '特になし', none: true },
      ],
    },
    {
      id: 'M17', round: '納期', sum: '納期',
      title: 'お急ぎ度',
      options: [
        { emoji: '⚡', label: '特急（できるだけ早く）' },
        { emoji: '🕒', label: '通常' },
        { emoji: '🍵', label: 'ゆっくりでOK' },
      ],
    },

    // ===== お客様情報（Cブロック）=====
    {
      id: 'M18', round: 'お客様情報', sum: 'お客様のお名前', type: 'text',
      title: 'ご記入者のお名前',
      placeholder: 'ご記入ください',
    },
    {
      id: 'M19', round: 'お客様情報', sum: '会社名・屋号', type: 'text', optional: true,
      title: '会社名・屋号（任意）',
      placeholder: 'あれば',
    },
    {
      id: 'M20', round: 'お客様情報', sum: 'ご希望の連絡手段',
      title: 'ご連絡はどの方法がよいですか？',
      options: [
        { emoji: '📞', label: '電話' },
        { emoji: '💬', label: 'LINE' },
        { emoji: '✉️', label: 'メール' },
      ],
    },
    {
      id: 'M21', round: 'お客様情報', sum: 'ご連絡先', type: 'text',
      title: 'ご連絡先',
      placeholder: '電話番号／LINE ID／メールアドレス',
    },
    {
      id: 'M22', round: '素材', type: 'note',
      title: '素材について',
      body: 'ロゴや掲載する情報などの素材は、受付後にLINE・メールでお送りいただけます。今お手元になくても大丈夫です。',
    },
    {
      id: 'M23', round: 'ご確認', type: 'confirm',
      title: '最後にご確認ください',
      // ★本番文面（2026-07-20 社長確定）。
      body: [
        'このフォームの送信はご注文の確定ではありません。内容を確認のうえ、お店からご連絡いたします。',
        '金額の自動表示はいたしません。お見積りは内容を確認してから、責任を持ってお出しします。',
        'いただいた内容を、ご相談の目的以外に使うことはありません。',
      ],
      checkLabel: '上記を確認しました',
    },
  ];

  function isNew(a) { return a.M1 && a.M1.val === 'new'; }
  function isData(a) { return a.M1 && a.M1.val === 'data'; }
  function isRepeat(a) { return a.M1 && a.M1.val === 'repeat'; }

  window.HEARING_SETS = window.HEARING_SETS || {};
  window.HEARING_SETS['meishi'] = {
    meta: { key: 'meishi', label: '名刺', title: '名刺ヒアリング' },
    questions: Q,
  };
})();

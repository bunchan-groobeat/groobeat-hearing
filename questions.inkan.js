/*
 * GrooBeat ヒアリングシート — 質問セット「印鑑」v1
 * 指示書§3-11準拠。個人/法人で分岐、法人3点セットはサイズ3本を連続表示。
 * C＝お客様情報＋やらないこと宣言のみ（素材送付・データ分岐・NGは非搭載）。
 * やらないこと宣言の文面は社長支給待ち＝仮文言（★確定後に body を差し替え）。
 */
(function () {
  'use strict';

  var Q = [
    {
      id: 'I1', round: 'ご相談内容', sum: '種別',
      title: '個人の印鑑ですか？ 会社の印鑑ですか？',
      options: [
        { emoji: '🙋', label: '個人印（実印・銀行印・認印）', val: 'personal' },
        { emoji: '🏢', label: '法人印（会社の印鑑）', val: 'corp' },
      ],
    },

    // ===== 個人ルート =====
    {
      id: 'I2', round: '個人印', sum: '種類', showIf: isP,
      title: '種類はどれですか？',
      options: [
        { emoji: '🏛️', label: '実印（役所に登録する印）' },
        { emoji: '🏦', label: '銀行印' },
        { emoji: '📮', label: '認印（普段使い）' },
      ],
    },
    {
      id: 'I3', round: '個人印', sum: '彫刻する名前', type: 'text', showIf: isP,
      title: '彫刻するお名前',
      placeholder: '例）山田太郎',
    },
    {
      id: 'I4', round: '個人印', sum: '彫り方', showIf: isP,
      title: '彫り方',
      options: [
        { emoji: '🈵', label: 'フルネーム' },
        { emoji: '👤', label: '名字のみ' },
        { emoji: '🔤', label: '名前のみ' },
      ],
    },
    {
      id: 'I5', round: '個人印', sum: 'サイズ', showIf: isP,
      title: 'サイズ',
      note: '実印は15mm以上が一般的です。',
      options: [
        { emoji: '⚫', label: '10.5mm' },
        { emoji: '⚫', label: '12.0mm' },
        { emoji: '⚫', label: '13.5mm' },
        { emoji: '⚫', label: '15.0mm' },
        { emoji: '⚫', label: '16.5mm' },
        { emoji: '⚫', label: '18.0mm' },
      ],
    },

    // ===== 法人ルート =====
    {
      id: 'I6', round: '法人印', sum: '種類', showIf: isC,
      title: 'どの印鑑ですか？',
      options: [
        { emoji: '🎁', label: '3点セット（代表印＋銀行印＋角印）', val: 'set' },
        { emoji: '👑', label: '代表印（丸印）', val: 'rep' },
        { emoji: '🏦', label: '法人銀行印', val: 'bank' },
        { emoji: '⬛', label: '角印（社印）', val: 'kaku' },
      ],
    },
    {
      id: 'I7', round: '法人印', sum: '彫刻内容', type: 'text', multiline: true, showIf: isC,
      title: '彫刻する内容',
      note: '会社名＋中文字（代表取締役印・銀行之印 など）。角印は「之印」の有無もお書きください。',
      placeholder: '例）\n有限会社ぶんちゃん\n代表取締役印',
    },
    // 3点セット：サイズを3本連続で
    {
      id: 'I8', round: '法人印（3点セット）', sum: '代表印サイズ', showIf: isSet,
      title: '① 代表印のサイズ',
      options: [{ emoji: '👑', label: '16.5mm' }, { emoji: '👑', label: '18.0mm' }],
    },
    {
      id: 'I9', round: '法人印（3点セット）', sum: '銀行印サイズ', showIf: isSet,
      title: '② 銀行印のサイズ',
      options: [{ emoji: '🏦', label: '16.5mm' }, { emoji: '🏦', label: '18.0mm' }],
    },
    {
      id: 'I10', round: '法人印（3点セット）', sum: '角印サイズ', showIf: isSet,
      title: '③ 角印のサイズ',
      options: [{ emoji: '⬛', label: '21.0mm' }, { emoji: '⬛', label: '24.0mm' }],
    },
    // 法人・単体（3点セット以外）
    {
      id: 'I11', round: '法人印', sum: 'サイズ', type: 'text', showIf: isCorpSingle,
      title: 'ご希望サイズ（分かる範囲でOK）',
      note: '目安：代表印 16.5/18mm・法人銀行印 16.5/18mm・角印 21/24mm',
      placeholder: '例）18mm',
    },

    // ===== 共通 =====
    {
      id: 'I12', round: 'ご希望', sum: '書体',
      title: '書体',
      note: '実印・銀行印は、偽造されにくい篆書・印相体がおすすめです。（3点セットは3本共通で1回選択）',
      options: [
        { emoji: '🔐', label: '篆書（てんしょ）' },
        { emoji: '🌀', label: '印相体（吉相体）' },
        { emoji: '🏯', label: '古印体' },
        { emoji: '🏛️', label: '隷書' },
        { emoji: '🖌️', label: '楷書' },
        { emoji: '✍️', label: '行書' },
      ],
    },
    {
      id: 'I13', round: 'ご希望', sum: '材質',
      title: '材質',
      note: '3点セットは3本共通で1回選択（変えたい場合は最後の連絡先欄で一言添えてください）。',
      options: [
        { emoji: '🌳', label: '薩摩本柘植（さつまほんつげ）' },
        { emoji: '🟤', label: 'アグニ' },
        { emoji: '⚫', label: 'アグニブラック' },
        { emoji: '🐃', label: '黒水牛' },
        { emoji: '🐃', label: '天然黒水牛' },
        { emoji: '🟡', label: '牛角（色）' },
        { emoji: '⚪', label: '牛角（白）' },
        { emoji: '🩶', label: 'チタン' },
        { emoji: '🦣', label: '象牙' },
      ],
    },
    {
      id: 'I14', round: 'ご希望', sum: 'ケース',
      title: '印鑑ケースは？',
      options: [
        { emoji: '🧰', label: 'つける' },
        { emoji: '➖', label: 'なし' },
      ],
    },
    {
      id: 'I15', round: '納期', sum: '納期', type: 'text', optional: true,
      title: 'ご希望の納期（あれば）',
      placeholder: '例）7/25まで／なるべく早く など',
    },

    // ===== お客様情報 ＋ 宣言 =====
    {
      id: 'I16', round: 'お客様情報', sum: 'お客様のお名前', type: 'text',
      title: 'ご記入者のお名前',
      placeholder: 'ご記入ください',
    },
    {
      id: 'I17', round: 'お客様情報', sum: 'ご希望の連絡手段',
      title: 'ご連絡はどの方法がよいですか？',
      options: [
        { emoji: '📞', label: '電話' },
        { emoji: '💬', label: 'LINE' },
        { emoji: '✉️', label: 'メール' },
      ],
    },
    {
      id: 'I18', round: 'お客様情報', sum: 'ご連絡先', type: 'text',
      title: 'ご連絡先',
      placeholder: '電話番号／LINE ID／メールアドレス',
    },
    {
      id: 'I19', round: 'ご確認', type: 'confirm',
      title: '最後にご確認ください',
      // ★仮文言（社長支給待ち）。確定後に差し替え。
      body: [
        'お預かりしたお名前・情報は、この案件の制作以外には使用しません。',
        '彫刻内容（お名前・会社名・中文字など）の最終確認はお客様にお願いします。',
        '実印・銀行印としての登録可否は、お客様の役所・金融機関の規定に従います。',
      ],
      checkLabel: '上記を確認しました',
    },
  ];

  function isP(a) { return a.I1 && a.I1.val === 'personal'; }
  function isC(a) { return a.I1 && a.I1.val === 'corp'; }
  function isSet(a) { return isC(a) && a.I6 && a.I6.val === 'set'; }
  function isCorpSingle(a) { return isC(a) && a.I6 && a.I6.val !== 'set'; }

  window.HEARING_SETS = window.HEARING_SETS || {};
  window.HEARING_SETS['inkan'] = {
    meta: { key: 'inkan', label: '印鑑', title: '印鑑ヒアリング' },
    questions: Q,
  };
})();

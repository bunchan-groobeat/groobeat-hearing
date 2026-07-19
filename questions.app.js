/*
 * GrooBeat ヒアリングシート — 質問セット「アプリ制作」v1.1（正本）
 * ------------------------------------------------------------------
 * このファイル1本が「1種目ぶんの箱」。将来 HP版 / デザイン版 / 印刷物版 は
 * この形（meta + questions + buildConcept）のファイルを増やして差し替えるだけで作れる。
 * エンジン（index.html）はこの箱を読むだけで種目を知らない。
 *
 * データ構造：
 *   meta       … 種目キー・見出し
 *   questions  … 質問配列。各質問は { id, round, title, multi, note?, options[] }
 *     options  … { emoji, label, feedback, concept, quote?, none? }
 *       feedback … 選択直後に1文で出す「見えてきた像」
 *       concept  … 最終コンセプト文に埋める断片（null＝おまかせ等でコンセプトに載せない）
 *       quote    … true なら「※別途お見積り」バッジを付ける
 *       none     … true なら「特にない/おまかせ」枠（複数選択で他と排他にする）
 *   buildConcept(answers) … answers から最終コンセプト文（複数段落の文字列）を組む
 */
(function () {
  'use strict';

  var QUESTIONS = [
    // ===== R1 方向性 =====
    {
      id: 'Q1', round: 'R1 方向性',
      title: 'アプリを開いた瞬間、最初に何が目に入ると嬉しいですか？',
      multi: false,
      options: [
        { emoji: '🐻', label: 'お店のキャラクターが出迎えてくれる',
          feedback: '開くたびにキャラクターが迎えてくれる、遊び心のあるアプリになりそうです',
          concept: 'キャラクターが出迎える' },
        { emoji: '✨', label: 'ロゴや映像がふわっと動く演出',
          feedback: 'ロゴや映像がふわっと動く、ブランドの世界に引き込む入口になりそうです',
          concept: 'ロゴや映像がふわっと動く' },
        { emoji: '⬜', label: '余計なものがない、すっきりした画面',
          feedback: '余白を活かした、すっきり迷わない画面になりそうです',
          concept: '余計のないすっきりした画面が広がる' },
        { emoji: '🎨', label: 'プロにおまかせ',
          feedback: 'ここはプロの提案にお任せください。一番似合う入口をご用意します',
          concept: null, none: true },
      ],
    },
    {
      id: 'Q2', round: 'R1 方向性',
      title: 'アプリ全体の雰囲気は？',
      multi: false,
      options: [
        { emoji: '🎪', label: '賑やかで楽しい（開くたびワクワク）',
          feedback: '開くたびにワクワクする、にぎやかな空気感でいきましょう',
          concept: '賑やかで楽しい', pv: 'fun' },
        { emoji: '🥂', label: '上品で落ち着いている（大人の空気感）',
          feedback: '大人が心地よい、上品で落ち着いた空気感でいきましょう',
          concept: '上品で落ち着いた', pv: 'calm' },
        { emoji: '⚖️', label: 'その中間（楽しさも落ち着きも）',
          feedback: '楽しさと落ち着きのバランスをとった雰囲気でいきましょう',
          concept: '楽しさと落ち着きが同居する', pv: 'mid' },
      ],
    },
    {
      id: 'Q3', round: 'R1 方向性',
      title: '見た目の質感は？',
      multi: false,
      options: [
        { emoji: '💎', label: '立体感のあるリッチな質感（つや・厚み）',
          feedback: 'つやと厚みのある、リッチで存在感のある質感でいきましょう',
          concept: '立体感のあるリッチな質感', pv: 'rich' },
        { emoji: '📱', label: 'フラットで今風（すっきり軽やか）',
          feedback: 'すっきり軽やかな、今どきのフラットな質感でいきましょう',
          concept: 'フラットで今風', pv: 'flat' },
        { emoji: '📻', label: 'レトロで懐かしい（昔ながらの味わい）',
          feedback: '昔ながらの味わいのある、レトロで懐かしい質感でいきましょう',
          concept: 'レトロで懐かしい味わい', pv: 'retro' },
      ],
    },
    // ===== R2 詳細 =====
    {
      id: 'Q4', round: 'R2 詳細',
      title: '一番の山場——スタンプが貯まった・特典が届いた瞬間の演出は？',
      multi: false,
      options: [
        { emoji: '🎉', label: '派手にお祝い（紙吹雪・ファンファーレ級）',
          feedback: '紙吹雪が舞うくらい派手にお祝いする、盛り上がる瞬間にしましょう',
          concept: '派手にお祝い' },
        { emoji: '🌟', label: 'さりげなく光る程度（大人の喜び）',
          feedback: 'さりげなく光る、大人の喜びを感じる演出にしましょう',
          concept: 'さりげなく光る程度に演出' },
        { emoji: '➖', label: '演出なし（実用重視）',
          feedback: '演出は控えめに、実用性を重視した作りにしましょう',
          concept: 'あえて控えめに演出' },
      ],
    },
    {
      id: 'Q5', round: 'R2 詳細',
      title: '色のベースは？',
      multi: false,
      options: [
        { emoji: '🏪', label: 'お店のロゴ・看板の色を軸に',
          feedback: 'お店のロゴ・看板の色を軸に、ブランドと地続きの配色にします',
          concept: 'お店のロゴカラーを軸に', pv: 'logo' },
        { emoji: '🌈', label: '明るく元気な色合い',
          feedback: '明るく元気な色合いで、開くと気分が上がる配色にします',
          concept: '明るく元気な色合いで', pv: 'bright' },
        { emoji: '🌑', label: '濃くシックな色合い',
          feedback: '濃くシックな色合いで、落ち着いた高級感のある配色にします',
          concept: '濃くシックな色合いで', pv: 'chic' },
        { emoji: '🎨', label: 'プロにおまかせ',
          feedback: 'ここはプロの提案にお任せください。お店に一番似合う色を選びます',
          concept: null, none: true, pv: 'logo' },
      ],
    },
    {
      id: 'Q6', round: 'R2 詳細',
      title: '「集める楽しみ」はどのくらい欲しいですか？',
      multi: false,
      options: [
        { emoji: '🏅', label: 'コレクション要素たっぷり（バッジ・称号を集める）',
          feedback: 'バッジや称号を集める、コレクションの楽しさをたっぷり入れましょう',
          concept: '称号やスタンプを集める楽しみ' },
        { emoji: '👑', label: 'ランクアップ型（常連ほど偉くなる）',
          feedback: '通うほど偉くなる、ランクアップの楽しさを主役にしましょう',
          concept: '常連ほど偉くなるランクの楽しみ' },
        { emoji: '➖', label: 'なし・シンプルに（貯めて使うだけ）',
          feedback: '貯めて使うだけの、シンプルで分かりやすい作りにしましょう',
          concept: null },
      ],
    },
    // ===== R3 部品 =====
    {
      id: 'Q7', round: 'R3 部品',
      title: 'バッジやアイコンの質感は？',
      multi: false,
      options: [
        { emoji: '🛡️', label: 'メタル・エンブレム調（重厚・勲章っぽく）',
          feedback: '勲章のように重厚な、メタル・エンブレム調のバッジにしましょう',
          concept: 'メタル・エンブレム調' },
        { emoji: '🍭', label: 'ポップなイラスト調（かわいく親しみやすく）',
          feedback: 'かわいく親しみやすい、ポップなイラスト調のバッジにしましょう',
          concept: 'ポップなイラスト調' },
        { emoji: '◻️', label: 'ミニマルな記号調（すっきり記号的に）',
          feedback: 'すっきり記号的な、ミニマルなアイコンにしましょう',
          concept: 'ミニマルな記号調' },
      ],
    },
    {
      id: 'Q8', round: 'R3 部品',
      title: 'クーポンの見せ方は？',
      multi: false,
      options: [
        { emoji: '🎟️', label: 'チケット風（切り取り線・半券のワクワク感）',
          feedback: '切り取り線のある、半券みたいにワクワクするチケット風にしましょう',
          concept: 'チケット風' },
        { emoji: '💳', label: 'カード風（きれいに並ぶギフトカード風）',
          feedback: 'きれいに並ぶ、ギフトカードのようなカード風にしましょう',
          concept: 'カード風' },
        { emoji: '📋', label: 'リスト表示（一覧でパッと見える実用型）',
          feedback: '一覧でパッと見える、実用的なリスト表示にしましょう',
          concept: '一覧で見えるリスト表示' },
      ],
    },
    {
      id: 'Q9', round: 'R3 部品',
      title: '初めて開いたときの画面のノリは？',
      multi: false,
      options: [
        { emoji: '🎊', label: 'ワクワクの歓迎ムード（「ようこそ！」感たっぷり）',
          feedback: '「ようこそ！」感たっぷりの、歓迎ムードのある入口にしましょう',
          concept: '初回は歓迎ムードたっぷりで迎える' },
        { emoji: '📖', label: '説明しっかり（使い方を丁寧に案内）',
          feedback: '使い方を丁寧に案内する、迷わせない入口にしましょう',
          concept: '初回は使い方を丁寧に案内する' },
        { emoji: '⚡', label: 'すぐ使える（説明は最小限、即メイン画面）',
          feedback: '説明は最小限、すぐ使えるスピード重視の入口にしましょう',
          concept: '初回から説明は最小限ですぐ使える' },
      ],
    },
    // ===== R3.5 避けたいもの（NGヒアリング・手戻り防止の要）=====
    {
      id: 'Q10', round: 'R3.5 避けたいもの',
      title: '使いたくない色はありますか？',
      multi: true, note: '複数選択できます',
      options: [
        { emoji: '🔴', label: '赤系', feedback: '赤系は避けます', concept: '赤系' },
        { emoji: '🔵', label: '青系', feedback: '青系は避けます', concept: '青系' },
        { emoji: '🟡', label: '黄系', feedback: '黄系は避けます', concept: '黄系' },
        { emoji: '🟢', label: '緑系', feedback: '緑系は避けます', concept: '緑系' },
        { emoji: '🟣', label: '紫系', feedback: '紫系は避けます', concept: '紫系' },
        { emoji: '🩷', label: 'ピンク系', feedback: 'ピンク系は避けます', concept: 'ピンク系' },
        { emoji: '⚫', label: '黒・暗い色', feedback: '黒・暗い色は避けます', concept: '黒・暗い色' },
        { emoji: '✅', label: '特にない（おまかせ）', feedback: '色の制限なし。自由に選べます', concept: null, none: true },
      ],
    },
    {
      id: 'Q11', round: 'R3.5 避けたいもの',
      title: '「こう見られたくない」はありますか？',
      multi: true, note: '複数選択できます',
      options: [
        { emoji: '💸', label: '安っぽく見えるのは嫌', feedback: '安っぽさは避けます', concept: '安っぽく' },
        { emoji: '🪩', label: 'チャラく・軽く見えるのは嫌', feedback: '軽さ・チャラさは避けます', concept: 'チャラく軽く' },
        { emoji: '🕰️', label: '古くさく見えるのは嫌', feedback: '古くささは避けます', concept: '古くさく' },
        { emoji: '🏛️', label: '堅苦しく見えるのは嫌', feedback: '堅苦しさは避けます', concept: '堅苦しく' },
        { emoji: '🧸', label: '子どもっぽく見えるのは嫌', feedback: '子どもっぽさは避けます', concept: '子どもっぽく' },
        { emoji: '✅', label: '特にない', feedback: '特に避けたい印象はなし', concept: null, none: true },
      ],
    },
    // ===== R4 機能 =====
    {
      id: 'Q12', round: 'R4 機能',
      title: '機能パックを選んでください',
      multi: false,
      options: [
        { emoji: '🍃', label: 'ライト：スタンプ・クーポン・店舗情報・お知らせ',
          feedback: 'まずは基本を押さえた、身軽なライトパックでいきましょう',
          concept: 'ライトパック（スタンプ・クーポン・店舗情報・お知らせ）' },
        { emoji: '🌿', label: 'スタンダード：ライト＋会員ランク・誕生日特典・プッシュ通知・ギャラリー',
          feedback: '会員ランクやプッシュ通知まで入った、王道のスタンダードパックでいきましょう',
          concept: 'スタンダードパック（会員ランク・誕生日特典・プッシュ通知・ギャラリーまで）' },
        { emoji: '🌳', label: 'フル：スタンダード＋予約・モバイルオーダー・決済など',
          feedback: '予約や決済まで見据えた、フルパックでいきましょう',
          concept: 'フルパック（予約・モバイルオーダー・決済まで）', quote: true },
      ],
    },
    {
      id: 'Q13', round: 'R4 機能',
      title: 'ポイントの仕組みは？',
      multi: false,
      options: [
        { emoji: '📍', label: 'スタンプ型（来店1回で1個、貯めて特典）',
          feedback: '来店1回で1個貯まる、分かりやすいスタンプ型でいきましょう',
          concept: 'スタンプ型', pv: 'stamp' },
        { emoji: '🪙', label: 'ポイント型（お会計金額に応じて貯まる）',
          feedback: 'お会計に応じて貯まるポイント型。運用設計もあわせてご相談しましょう',
          concept: 'ポイント型', quote: true, pv: 'point' },
        { emoji: '👑', label: 'ランク型（通うほどランクが上がる）',
          feedback: '通うほどランクが上がる、常連が育つランク型でいきましょう',
          concept: 'ランク型', pv: 'rank' },
        { emoji: '🔗', label: '併用（スタンプ＋ランクなど組み合わせ）',
          feedback: 'スタンプとランクを組み合わせた、欲張りな併用型でいきましょう',
          concept: 'スタンプとランクの併用', pv: 'combo' },
      ],
    },
    {
      id: 'Q14', round: 'R4 機能',
      title: '追加で気になる機能はありますか？',
      multi: true, note: '複数選択できます（※は別途お見積り）',
      options: [
        { emoji: '🎫', label: '順番待ち整理券', feedback: '順番待ち整理券も候補に入れます', concept: '順番待ち整理券' },
        { emoji: '🤝', label: '友達紹介', feedback: '友達紹介も候補に入れます', concept: '友達紹介' },
        { emoji: '🎠', label: '回数券・サブスク', feedback: '回数券・サブスクも候補に入れます', concept: '回数券・サブスク', quote: true },
        { emoji: '🛒', label: 'ネット販売（EC）', feedback: 'ネット販売（EC）も候補に入れます', concept: 'ネット販売（EC）', quote: true },
        { emoji: '⭐', label: '口コミ・レビュー', feedback: '口コミ・レビューも候補に入れます', concept: '口コミ・レビュー' },
        { emoji: '👥', label: 'スタッフ紹介', feedback: 'スタッフ紹介も候補に入れます', concept: 'スタッフ紹介' },
        { emoji: '🎰', label: 'ガチャ・ミニゲームなどおまけ要素', feedback: 'ガチャ・ミニゲームも候補に入れます', concept: 'ガチャ・ミニゲームなどのおまけ' },
        { emoji: '📊', label: '来店データの分析画面（お店側用）', feedback: '来店データの分析画面も候補に入れます', concept: '来店データの分析画面' },
        { emoji: '➖', label: '特になし', feedback: '追加機能は特になし。まずは主役の機能に集中します', concept: null, none: true },
      ],
    },
    {
      id: 'Q15', round: 'R4 機能',
      title: '最後に——今回「やらないこと」を決めましょう',
      multi: true, note: '複数選択できます（スコープを先に決めると手戻りが減ります）',
      options: [
        { emoji: '🚫', label: '予約機能はやらない', feedback: '予約機能は今回やらないと決めました', concept: '予約機能' },
        { emoji: '🚫', label: '決済機能はやらない', feedback: '決済機能は今回やらないと決めました', concept: '決済機能' },
        { emoji: '🚫', label: 'プッシュ通知はやらない', feedback: 'プッシュ通知は今回やらないと決めました', concept: 'プッシュ通知' },
        { emoji: '🚫', label: 'ゲーム系のおまけはやらない', feedback: 'ゲーム系のおまけは今回やらないと決めました', concept: 'ゲーム系のおまけ' },
        { emoji: '🚫', label: 'ネット販売はやらない', feedback: 'ネット販売は今回やらないと決めました', concept: 'ネット販売' },
        { emoji: '✅', label: '全部前向きに検討（やらないことは決めない）', feedback: '今回は"やらないこと"を決めず、すべて前向きに検討します', concept: null, none: true },
      ],
    },
  ];

  // ---- コンセプト文の組み立て（この種目の"文体"はここに閉じる）----
  // answers[qid] = 単一選択なら option、複数選択なら option の配列
  function buildConcept(answers) {
    function one(qid) { return answers[qid] || null; }
    function frag(qid, fallback) {
      var o = answers[qid];
      if (o && o.concept != null) return o.concept;
      return fallback || null;
    }
    // 複数選択の concept 断片（none/未選択は除外）
    function fragList(qid) {
      var a = answers[qid];
      if (!Array.isArray(a)) return [];
      return a.filter(function (o) { return o && o.concept != null; })
              .map(function (o) { return o.concept; });
    }

    var paragraphs = [];

    // 段落1：世界観（固定文型。おまかせ／未回答の箇所は言葉でフォローする）
    var g1 = frag('Q1', null);
    var g2 = frag('Q2', null);
    var g3 = frag('Q3', null);
    var g5 = frag('Q5', null);
    var g4 = frag('Q4', null);
    var g6 = frag('Q6', null);
    var g7 = frag('Q7', null);
    var g8 = frag('Q8', null);
    var g9 = frag('Q9', null);

    var s = '';
    s += g1 ? ('開いた瞬間に' + g1 + '、') : '開いた瞬間の第一印象はプロにおまかせで、';
    s += g2 ? (g2 + '世界観。') : '雰囲気はこれから一緒に詰めていく世界観。';
    if (g3) s += '質感は' + g3 + '、';
    s += g5 ? ('色は' + g5 + '。') : '色はプロのご提案にお任せ。';
    if (g4 || g7 || g6) {
      var celebrate = g4 ? ('スタンプが貯まる瞬間は' + g4 + 'し、') : '';
      var badge = '';
      if (g7 && g6) badge = 'バッジは' + g7 + 'で' + g6 + 'を演出。';
      else if (g7) badge = 'バッジは' + g7 + '。';
      else if (g6) badge = g6 + 'を大切にします。';
      s += celebrate + badge;
    }
    if (g8) s += 'クーポンは' + g8 + '。';
    if (g9) s += g9.charAt(0) === '初' ? (g9 + '流れにします。') : (g9 + '。');
    paragraphs.push(s);

    // 段落2：機能
    var f = '';
    var g12 = frag('Q12', null);
    var g13 = frag('Q13', null);
    if (g12) f += '機能は' + g12 + '。';
    if (g13) f += 'ポイントは' + g13 + '。';
    var extras = fragList('Q14');
    if (extras.length) f += 'あわせて' + extras.join('・') + 'も候補に入れます。';
    if (f) paragraphs.push(f);

    // 段落3：避けたいこと（NGは手戻りの最大要因なので必ず明記。両方なしなら段落省略）
    var avoidColor = fragList('Q10');
    var avoidImpr = fragList('Q11');
    if (avoidColor.length || avoidImpr.length) {
      var av = '避けたいこと：';
      if (avoidColor.length) av += avoidColor.join('・') + 'は使わない。';
      if (avoidImpr.length) av += avoidImpr.join('・') + '見えないようにする。';
      paragraphs.push(av);
    }

    // 段落4：やらないこと（スコープ確定の証拠。末尾に必ず）
    var notDo = fragList('Q15');
    var q15 = one('Q15');
    var isAllForward = Array.isArray(q15) && q15.some(function (o) { return o && o.none; });
    if (notDo.length) {
      paragraphs.push('今回、' + notDo.join('・') + 'はやらないと決めました。');
    } else if (isAllForward) {
      paragraphs.push('今回は「やらないこと」を決めず、すべて前向きに検討します。');
    }

    return paragraphs.join('\n\n');
  }

  window.HEARING_SET = {
    meta: { key: 'app', label: 'アプリ制作', title: 'アプリ制作ヒアリング' },
    questions: QUESTIONS,
    buildConcept: buildConcept,
    showPreview: true,   // アプリ版のみ：コンセプト文＋スマホ完成イメージを出す（種目別は受付内容まとめ）
  };
  // 複数種目レジストリへ登録（エンジンは ?s=キー で種目を切り替える）
  window.HEARING_SETS = window.HEARING_SETS || {};
  window.HEARING_SETS['app'] = window.HEARING_SET;
})();

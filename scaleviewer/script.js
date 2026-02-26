$(document).ready(function () {
  const SCALE = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

  const TUNING_BASE = [
    // --- 標準系 ---
    [4,11,7,2,9,4], // 1: Standard (E A D G B E)

    // --- ダウン系 ---
    [3,10,6,1,8,3], // 2: Half-step Down (Eb Ab Db Gb Bb Eb)
    [2,9,5,0,7,2],  // 3: D Standard (D G C F A D)
    [1,8,4,11,6,1], // 4: C# Standard (C# F# B E G# C#)
    [0,5,10,3,7,0], // 5: C Standard (C F A# D# G C)

    // --- ドロップ系 ---
    [4,11,7,2,9,2], // 6: Drop D (E B G D A D)
    [3,10,6,1,8,1], // 7: Drop C# (Eb Bb Gb Db Ab C#)
    [2,9,5,0,7,0],  // 8: Drop C (D A F C G C)

    // --- オープン系 ---
    [4,11,4,8,11,4], // 9: Open E (E B E G# B E)
    [2,9,2,6,9,2],   // 10: Open D (D A D F# A D)
    [4,1,9,4,9,4],   // 11: Open A (E C# A E A E)
    [2,11,7,2,7,2],  // 12: Open G (D B G D G D)
    [4,0,7,0,7,0],   // 13: Open C (E C G C G C)

    // --- 変則系 ---
    [2,9,2,7,9,2],   // 14: DADGAD (D A D G A D)
    [4,11,7,2,9,4],  // 15: Nashville High (ピッチクラスは同じ / 弦ゲージによるオクターブ上)
  ];

  const SCALE_BASE = [
    // Major modes
    [0,2,4,5,7,9,11], // 0: Major (Ionian)
    [0,2,3,5,7,9,10], // 1: Dorian
    [0,1,3,5,7,8,10], // 2: Phrygian
    [0,2,4,6,7,9,11], // 3: Lydian
    [0,2,4,5,7,9,10], // 4: Mixolydian
    [0,2,3,5,7,8,10], // 5: Natural Minor (Aeolian)
    [0,1,3,5,6,8,10], // 6: Locrian
    // Minor / harmonic families
    [0,2,3,5,7,8,11], // 7: Harmonic Minor
    [0,2,3,5,7,9,11], // 8: Melodic Minor (ascending)
    [0,2,4,5,7,8,11], // 9: Harmonic Major
    [0,1,4,5,7,8,11], // 10: Double Harmonic (Byzantine)
    // Pentatonic / Blues
    [0,2,4,7,9],      // 11: Major Pentatonic
    [0,3,5,7,10],     // 12: Minor Pentatonic
    [0,3,5,6,7,10],   // 13: Blues (minor)
    // Symmetric / others
    [0,2,4,6,8,10],   // 14: Whole Tone
    [0,1,3,4,6,7,9,10], // 15: Diminished (Half-Whole)
    [0,2,3,5,6,8,9,11], // 16: Diminished (Whole-Half)
    // Reference
    [0,1,2,3,4,5,6,7,8,9,10,11], // 17: Chromatic
  ];

  const SCALE_NAMES = [
    "Major (Ionian)","Dorian","Phrygian","Lydian","Mixolydian",
    "Natural Minor (Aeolian)","Locrian",
    "Harmonic Minor","Melodic Minor","Harmonic Major","Double Harmonic (Byzantine)",
    "Major Pentatonic","Minor Pentatonic","Blues (minor)",
    "Whole Tone","Diminished (Half-Whole)","Diminished (Whole-Half)",
    "Chromatic",
  ];

// 表示名（TUNING_BASE と 1:1 対応）
const TUNING_NAMES = [
  "Standard (E A D G B E)",   // 1
  "Half-step Down (Eb Ab Db Gb Bb Eb)", // 2
  "D Standard (D G C F A D)", // 3
  "C# Standard (C# F# B E G# C#)", // 4
  "C Standard (C F A# D# G C)",     // 5
  "Drop D (E B G D A D)",      // 6
  "Drop C# (Eb Bb Gb Db Ab C#)", // 7
  "Drop C (D A F C G C)",      // 8
  "Open E (E B E G# B E)",     // 9
  "Open D (D A D F# A D)",     // 10
  "Open A (E C# A E A E)",     // 11
  "Open G (D B G D G D)",      // 12
  "Open C (E C G C G C)",      // 13
  "DADGAD (D A D G A D)",      // 14
  "Nashville High (stringing)",// 15
];

  // セレクトの生成（既存どおり）
  const $sel = $("#scale-selector");
  $sel.empty();
  SCALE_NAMES.forEach((name, idx) => {
    $sel.append($('<option>', { value: idx, text: name }));
  });

  
  const $tuning = $("#tuning-selector");
  $tuning.empty();
  TUNING_NAMES.forEach((name, idx) => {
    $tuning.append($('<option>', { value: idx, text: name }));
  });


  const FRET_MAX = 24;
  const STRINGS = 6;
  const mod12 = x => x % 12;

  // ←★ ここから追加：フレットボードに ○/● を描画
  function render() {
    const tuning = TUNING_BASE[ Number($('#tuning-selector').val()) ];
    const root   = Number($('#root-selector').val());
    const scale  = SCALE_BASE[ Number($('#scale-selector').val()) ];

    // ルートを加算したスケール音（0..11）を集合化（高速化＆重複排除）
    const inScale = new Set(scale.map(sc => mod12(sc + root)));
    const inScaleStr = Array.from(
      new Set(scale.map(sc => mod12(sc + root)))  // 0..11 のユニーク化
    ).map(i => SCALE[i]);   

    const $out = $('#in-scale-str');
    $out.empty();
    inScaleStr.forEach((name, index) => {
      if (index == 0) {
        $out.append($('<span class="scale-chip root-chip"/>').text(name));
      } else {
        $out.append($('<span class="scale-chip"/>').text(name));
      }
    });

    for (let s = 1; s <= STRINGS; s++) {
      const openPc = tuning[s - 1]; // 開放音のピッチクラス（0..11）

      // 開放（fret 0）は id="fl-<弦>-0"
      const pc0 = mod12(openPc);
      const symbol0 = (pc0 === root) ? '●' : (inScale.has(pc0) ? '○' : '');
      $(`#fl-${s}-0`).text(symbol0);
      $(`#fl-${s}-12`).text(symbol0);


      // 1〜24フレットは id="tr-<弦>-<フレット>"
      for (let f = 1; f <= FRET_MAX / 2; f++) {
        const pc = mod12(openPc + f);
        const symbol = (pc === root) ? '●' : (inScale.has(pc) ? '○' : '');
        $(`#tr-${s}-${f}`).text(symbol);
        $(`#tr-${s}-${f+12}`).text(symbol);
      }
    }
  }
  // ★ここまで追加

  // 変更イベントで描画
  $('.config-selector').on("change", render);

  // 初期描画
  render();
});
/**
 * بيانات لعبة كلمات أبانا الذي (Lord's Prayer Words Jigsaw)
 * -------------------------------------------------------------
 * الصورة النقية للرب يسوع المسيح + نصوص الكلمات القبطية الديناميكية.
 * 36 قطعة كلمة دقيقة تُمثّل النص الكامل للصلاة الربانية القبطية.
 * -------------------------------------------------------------
 */

const PUZZLE_CONFIG = {
  imagePath: "assets/images/ChatGPT Image Aug 5, 2026, 05_09_56 PM.png",
  aspectRatio: 1136 / 1385,
  wordUnits: [
    // الترويسة
    { id: 0,  coptic: "Ariten `n`m`p]a `njoc" },
    { id: 1,  coptic: "‘en ou]e`phmot Je" },
    { id: 2,  coptic: "peniwt et'en nivhou`i>" },

    // بداية الصلاة
    { id: 3,  coptic: "mareftoubo `nje pekran> " },
    { id: 4,  coptic: "marec`i `nje " },
    { id: 5,  coptic: "tekmetouro> pete\nak " },
    { id: 6,  coptic: "maref]wpi `m`vrh; " },
    { id: 7,  coptic: "en `tve" },
    { id: 8,  coptic: "nem \ijen" },
    { id: 9,  coptic: "pika\> penwik" },
    { id: 10, coptic: "nte rac;" },
    { id: 11, coptic: "mhif nan" },
    { id: 12, coptic: "mvoou> ouo\ " },
    { id: 13, coptic: "xa nh`eteron " },
    { id: 14, coptic: "nan `ebol>" },
    { id: 15, coptic: "`m`vrh; \wn " },
    { id: 16, coptic: "ntenxw `ebol`nnh`ete " },
    { id: 17, coptic: "ouon `ntan " },
    { id: 18, coptic: "erwou> ouo\ " },
    { id: 19, coptic: "mperenten `e'oun " },
    { id: 20, coptic: "epiracmoc> alla " },
    { id: 21, coptic: "na\men `ebol\a " },
    { id: 22, coptic: "pipet\wou> 'en " },
    { id: 23, coptic: "Pi`xrictoc Ihcouc " },
    { id: 24, coptic: "Pensoic>" },
    { id: 25, coptic: "je" },
    { id: 26, coptic: "qwk" },
    { id: 27, coptic: "te" },
    { id: 28, coptic: ";metouro>" },

    // الختام والدكصولوجية
    { id: 29, coptic: "nem" },
    { id: 30, coptic: ";jom" },
    { id: 31, coptic: "nem" },
    { id: 32, coptic: ";jom nem" },
    { id: 33, coptic: "pi`wou ]a" },
    { id: 34, coptic: "`ene\>" },
    { id: 35, coptic: "amhn." }
  ]
};

/**
 * بيانات الحروف القبطية (٣٢ حرف بحيري)
 * -------------------------------------------------------------
 * كل حرف عنده:
 *   char      : الرمز اليونيكود بتاع الحرف القبطي (fallback لو مفيش صورة)
 *   name      : اسم الحرف بالعربي
 *   imagePath : مسار صورة شكل الحرف (سيبها فاضية "" وهتحطها انت)
 *               مثال: "assets/images/letters/alpha.png"
 *   audioPath : مسار الصوت اللي بيشرح الحرف/الكلمة (سيبها فاضية "" وهتحطها انت)
 *               مثال: "assets/audio/letters/alpha.mp3"
 *
 * لو imagePath فاضي، الحرف هيتعرض تلقائي بالخط القبطي المختار (Tab1)
 * باستخدام حقل char.
 * -------------------------------------------------------------
 */

const COPTIC_LETTERS = [
  { char: "A", name: "ألفا",   imagePath: "", audioPath: "assets/audio/letters/alfa.ogg" },
  { char: "Ⲃ", name: "فيدا",   imagePath: "", audioPath: ["assets/audio/letters/veta.ogg", "assets/audio/letters/veta2.ogg"] },
  { char: "J", name: "غاما",   imagePath: "", audioPath: "assets/audio/letters/gama.ogg" },
  { char: "D", name: "دلتا",   imagePath: "", audioPath: "assets/audio/letters/delta.ogg" },
  { char: "E", name: "إي",     imagePath: "", audioPath: "assets/audio/letters/ai.ogg" },
  { char: "6", name: "سو",     imagePath: "", audioPath: "assets/audio/letters/so.ogg" },
  { char: "Z", name: "زيتا",   imagePath: "", audioPath: "assets/audio/letters/zeta.ogg" },
  { char: "3", name: "إيتا",   imagePath: "", audioPath: "assets/audio/letters/eta.ogg" },
  { char: "0", name: "ثيتا",   imagePath: "", audioPath: "assets/audio/letters/theta.ogg" },
  { char: "I", name: "يوتا",  imagePath: "", audioPath: ["assets/audio/letters/yota.ogg", "assets/audio/letters/yota2.ogg", "assets/audio/letters/yota3.ogg"] },
  { char: "K", name: "كابا",   imagePath: "", audioPath: "assets/audio/letters/kaba.ogg" },
  { char: "L", name: "لاولا",  imagePath: "", audioPath: "assets/audio/letters/lavla.ogg" },
  { char: "M", name: "مي",     imagePath: "", audioPath: "assets/audio/letters/mi.ogg" },
  { char: "N", name: "ني",     imagePath: "", audioPath: "assets/audio/letters/ni.ogg" },
  { char: "7", name: "إكسي",   imagePath: "", audioPath: "assets/audio/letters/exy.ogg" },
  { char: "O", name: "أو",     imagePath: "", audioPath: "assets/audio/letters/omicron.ogg" },
  { char: "P", name: "بي",     imagePath: "", audioPath: "assets/audio/letters/bi.ogg" },
  { char: "R", name: "رو",     imagePath: "", audioPath: "assets/audio/letters/ro.ogg" },
  { char: "C", name: "سيما",   imagePath: "", audioPath: "assets/audio/letters/cema.ogg" },
  { char: "T", name: "تاف",    imagePath: "", audioPath: "assets/audio/letters/taf.ogg" },
  { char: "v", name: "إبسيلون", imagePath: "", audioPath: "assets/audio/letters/ebslon.ogg" },
  { char: "F", name: "في",     imagePath: "", audioPath: "assets/audio/letters/fe.ogg" },
  { char: "Q", name: "خي",     imagePath: "", audioPath: "assets/audio/letters/ke.ogg" },
  { char: "Y", name: "إبسي",   imagePath: "", audioPath: "assets/audio/letters/ebsi.ogg" },
  { char: "W", name: "أوو",    imagePath: "", audioPath: "assets/audio/letters/omega.ogg" },
  { char: "2", name: "شاي",    imagePath: "", audioPath: "assets/audio/letters/shy.ogg" },
  { char: "4", name: "فاي",    imagePath: "", audioPath: "assets/audio/letters/fy.ogg" },
  { char: "Q", name: "خاي",    imagePath: "", audioPath: "assets/audio/letters/kai.ogg" },
  { char: "H", name: "هوري",   imagePath: "", audioPath: "assets/audio/letters/hori.ogg" },
  { char: "G", name: "جانجا", imagePath: "", audioPath: "assets/audio/letters/genga.ogg" },
  { char: "S", name: "تشيما",   imagePath: "", audioPath: "assets/audio/letters/chima.ogg" },
  { char: "5", name: "تي",     imagePath: "", audioPath: "assets/audio/letters/ti.ogg" },
  { char: "Ov", name: "أوميكرون إبسيلون", imagePath: "", audioPath: "assets/audio/letters/omicron ebslon.ogg" },
];

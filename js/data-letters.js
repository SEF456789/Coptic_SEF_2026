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
  { char: "Ⲁ", name: "ألفا",   imagePath: "", audioPath: "" },
  { char: "Ⲃ", name: "فيدا",   imagePath: "", audioPath: "" },
  { char: "Ⲅ", name: "غاما",   imagePath: "", audioPath: "" },
  { char: "Ⲇ", name: "دلدا",   imagePath: "", audioPath: "" },
  { char: "Ⲉ", name: "إي",     imagePath: "", audioPath: "" },
  { char: "Ⲋ", name: "سو",     imagePath: "", audioPath: "" },
  { char: "Ⲍ", name: "زيتا",   imagePath: "", audioPath: "" },
  { char: "Ⲏ", name: "هيتا",   imagePath: "", audioPath: "" },
  { char: "Ⲑ", name: "ثيتا",   imagePath: "", audioPath: "" },
  { char: "Ⲓ", name: "ياودا",  imagePath: "", audioPath: "" },
  { char: "Ⲕ", name: "كابا",   imagePath: "", audioPath: "" },
  { char: "Ⲗ", name: "لاولا",  imagePath: "", audioPath: "" },
  { char: "Ⲙ", name: "مي",     imagePath: "", audioPath: "" },
  { char: "Ⲛ", name: "ني",     imagePath: "", audioPath: "" },
  { char: "Ⲝ", name: "إكسي",   imagePath: "", audioPath: "" },
  { char: "Ⲟ", name: "أو",     imagePath: "", audioPath: "" },
  { char: "Ⲡ", name: "بي",     imagePath: "", audioPath: "" },
  { char: "Ⲣ", name: "رو",     imagePath: "", audioPath: "" },
  { char: "Ⲥ", name: "سيما",   imagePath: "", audioPath: "" },
  { char: "Ⲧ", name: "تاف",    imagePath: "", audioPath: "" },
  { char: "Ⲩ", name: "إبسيلون", imagePath: "", audioPath: "" },
  { char: "Ⲫ", name: "في",     imagePath: "", audioPath: "" },
  { char: "Ⲭ", name: "خي",     imagePath: "", audioPath: "" },
  { char: "Ⲯ", name: "إبسي",   imagePath: "", audioPath: "" },
  { char: "Ⲱ", name: "أوو",    imagePath: "", audioPath: "" },
  { char: "Ϣ", name: "شاي",    imagePath: "", audioPath: "" },
  { char: "Ϥ", name: "فاي",    imagePath: "", audioPath: "" },
  { char: "Ϧ", name: "خاي",    imagePath: "", audioPath: "" },
  { char: "Ϩ", name: "هوري",   imagePath: "", audioPath: "" },
  { char: "Ϫ", name: "جانجيا", imagePath: "", audioPath: "" },
  { char: "Ϭ", name: "شيما",   imagePath: "", audioPath: "" },
  { char: "Ϯ", name: "تي",     imagePath: "", audioPath: "" },
];

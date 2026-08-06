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
  { char: "A", name: "ألفا",   imagePath: "", audioPath: "" },
  { char: "Ⲃ", name: "فيدا",   imagePath: "", audioPath: "" },
  { char: "J", name: "غاما",   imagePath: "", audioPath: "" },
  { char: "D", name: "دلتا",   imagePath: "", audioPath: "" },
  { char: "E", name: "إي",     imagePath: "", audioPath: "" },
  { char: "6", name: "سو",     imagePath: "", audioPath: "" },
  { char: "Z", name: "زيتا",   imagePath: "", audioPath: "" },
  { char: "3", name: "إيتا",   imagePath: "", audioPath: "" },
  { char: "0", name: "ثيتا",   imagePath: "", audioPath: "" },
  { char: "I", name: "يوتا",  imagePath: "", audioPath: "" },
  { char: "K", name: "كابا",   imagePath: "", audioPath: "" },
  { char: "L", name: "لاولا",  imagePath: "", audioPath: "" },
  { char: "M", name: "مي",     imagePath: "", audioPath: "" },
  { char: "N", name: "ني",     imagePath: "", audioPath: "" },
  { char: "7", name: "إكسي",   imagePath: "", audioPath: "" },
  { char: "O", name: "أو",     imagePath: "", audioPath: "" },
  { char: "P", name: "بي",     imagePath: "", audioPath: "" },
  { char: "R", name: "رو",     imagePath: "", audioPath: "" },
  { char: "C", name: "سيما",   imagePath: "", audioPath: "" },
  { char: "T", name: "تاف",    imagePath: "", audioPath: "" },
  { char: "v", name: "إبسيلون", imagePath: "", audioPath: "" },
  { char: "F", name: "في",     imagePath: "", audioPath: "" },
  { char: "Q", name: "خي",     imagePath: "", audioPath: "" },
  { char: "Y", name: "إبسي",   imagePath: "", audioPath: "" },
  { char: "W", name: "أوو",    imagePath: "", audioPath: "" },
  { char: "2", name: "شاي",    imagePath: "", audioPath: "" },
  { char: "4", name: "فاي",    imagePath: "", audioPath: "" },
  { char: "Q", name: "خاي",    imagePath: "", audioPath: "" },
  { char: "H", name: "هوري",   imagePath: "", audioPath: "" },
  { char: "G", name: "جانجا", imagePath: "", audioPath: "" },
  { char: "S", name: "تشيما",   imagePath: "", audioPath: "" },
  { char: "5", name: "تي",     imagePath: "", audioPath: "" },
];

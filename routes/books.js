const express = require("express"); //web sunucumuzu oluşturmak içn kullanıyoruz bilyosun
const path = require("path"); //dosya yollarını birleştirelim
const fs = require("fs"); //dosya okuma yazma işlemlerimiz için modulümüz
const { error } = require("console");
const router = express.Router(); //yolları tanımlamak içn kullanıyrıuz
// const { v4: uuidv4 } = require("uuid");//denemek istedim geçiniz.

const bookData = path.join(__dirname, "..", "books.json"); //anadizinde olduğu için dotları koydun pelina
console.log(bookData); //dosyanın tam yolunu belirle yoksa karıştırıyor yav

//!const fs = require('fs').promises; senkron yazdın başlangıçta ama async olması daha iyi olur bu modül ile düzelt.trycatchaçvekullan.

//!VALIDATION
function validateBook(req, res, next) {
  const { title, author, year, genre, pages } = req.body;
  if (!title || !author || !year || !genre || !pages) {
    return res.status(400).json({ error: "Tüm alanlar zorunludur." });
  }
  if (typeof year !== "number" || typeof pages !== "number") {
    return res
      .status(400)
      .json({ error: "Yıl ve sayfa sayısı sayı olmalıdır." });
  }
  next();
}

//!GET
router.get("/", (req, res) => {
  fs.readFile(bookData, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Kitaplara ulaşılamadı." });
    }
    //trim yeterli .
    if (!data.trim()) {
      return res.json([]);
    }
    //burada const kullandığımda hem filterda değiştirmeye açlışıorum hem de sabit kalmasını istiyorum diyince sıkıntı çıkıt LET İLE TANIMLA. books dizisini filtreleyip güncellemek istiyorsun let kullan.
    let books = JSON.parse(data);
    const { genre, year } = req.query; //kategori paramtresini alalım bi
    //ŞU APTAL LOWERCASEİ İHMAL ETME
    //!FİLTRELEME

    if (genre) {
      books = books.filter(
        (book) => book.genre.toLowerCase() === genre.toLowerCase()
      );
    }

    if (year) {
      books = books.filter((book) => book.year === parseInt(year));
    }

    //sayfalamayı yap.
    res.json(books); // Eğer genre ver
  });
});

//!POST
router.post("/", validateBook, (req, res) => {
  const { title, author, year, genre, pages } = req.body; //client tarafından gleen veriyi içeriyor biz bunu dest. ile titledir bir şeydir diye doğrudan değişkenlere atayoryız

  fs.readFile(bookData, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Kitap verileri okunamadı." });
    }

    const books = JSON.parse(data);
    //aynı başlığa sahip olanlar var mı bakalım ama her zaman şu lanet lowercasei kapatmayı ihmal etme.
    const sameTitle = books.some(
      (book) => book.title.toLowerCase() === title.toLowerCase()
    );
    if (sameTitle) {
      return res.status(400).json({ error: " bu başlıkta kitap var" });
    }
    // const newId = books.length > 0 ? books[books.length - 1].id + 1 : 1; //yeni kitap için id oluşturalım otamatik elinle girme yav
    const newId = books.length > 0 ? books[books.length - 1].id + 1 : 1;
    const newBook = { id: newId, title, author, year, genre, pages };

    books.push(newBook); // Yeni kitabı  mevcut kitaplara ekle pushla

    // books.json dosyasını güncelle
    fs.writeFile(bookData, JSON.stringify(books, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Kitap verileri kaydedilemedi." });
      }
      res.status(201).json(newBook);
    }); //güncellenen kitap listesini books.jsona yazdırmış oluruz böylece
  });
});

//!PUT

router.put("/:id", validateBook, (req, res) => {
  const bookId = parseInt(req.params.id); //urlden kitap idsini aldırdık ve sayııa dönüştürdük en olru ne lömaz
  const { title, author, year, genre, pages } = req.body;

  fs.readFile(bookData, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Kitap verileri okunamıyor." });
    } //bookdata dosyasını oku ve içierği data olarak ald dedik

    let books = JSON.parse(data); //datayı stirng aldığımızdan jsona dönüştürdük
    const bookIndex = books.findIndex((book) => book.id == bookId);

    //burada some ile belirtilen ilk koşula uyan ögeyi de kontrlo ettirip boolean döndürebilrdik
    const book = books.find((book) => book.id == bookId);
    if (!book) {
      return res.status(404).json({ error: "Kitap bulunamadı." });
    }

    books[bookIndex] = {
      ...books[bookIndex],
      title: title || books[bookIndex].title,
      author: author || books[bookIndex].author,
      year: year || books[bookIndex].year,
      genre: genre || books[bookIndex].genre,
      pages: pages || books[bookIndex].pages,
    };

    fs.writeFile(bookData, JSON.stringify(books, null, 2), (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Kitap verileri güncellenemedi." });
      }
      res.status(200).json(books[bookIndex]);
    });
  });
});

//!DELETE
router.delete("/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  fs.readFile(bookData, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Kitap verilerini okuyamıyorum" });
    }
    const books = JSON.parse(data);
    const updatedBooks = books.filter((book) => book.id !== bookId);

    if (updatedBooks.length === books.length) {
      return res.status(204).json({ error: "Kitap bulunamadı" });
    }

    fs.writeFile(bookData, JSON.stringify(updatedBooks), (err) => {
      if (err) {
        return res.status(500).json({ error: "Kitapları güncelleyemedik" });
      }
      return res.status(204).json({ message: "Kitap başarıyla silindi" });
    });
  });
});

module.exports = router;

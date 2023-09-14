const checkIsToday = async (date, gosterim_tarihi = new Date()) => {
    return new Promise((resolve, reject) => {
      // İki tarih nesnesi oluştur
      var karsilastirilacakTarih = new Date(date); // Karşılaştırılacak tarih
  
      // Tarihleri gün bazında karşılaştır
      var bugunYil = gosterim_tarihi.getFullYear();
      var bugunAy = gosterim_tarihi.getMonth();
      var bugunGun = gosterim_tarihi.getDate();
  
      var karsilastirmaYil = karsilastirilacakTarih.getFullYear();
      var karsilastirmaAy = karsilastirilacakTarih.getMonth();
      var karsilastirmaGun = karsilastirilacakTarih.getDate();
  
      if (
        bugunYil === karsilastirmaYil &&
        bugunAy === karsilastirmaAy &&
        bugunGun === karsilastirmaGun
      ) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  };
  
  export default checkIsToday;
  
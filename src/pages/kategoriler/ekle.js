import { Button, Card, Divider, TextField } from "@mui/material";
import React, { useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { BiUpload } from "react-icons/bi";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const KategoriEkle = () => {
  const router = useRouter();
  const [kategoriAdi, setKategoriAdi] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const handleChangePhoto = (file) => {
    setIsFetching(true);
    const url = "https://panel.filozofunmutfagi.com/api/photo-upload"; // Uygulamanın port numarasını uygun şekilde değiştirin

    const formData = new FormData();
    formData.append("image", file.target.files[0]);

    axios
      .post(url, formData)
      .then((response) => {
        setPhoto(response.data.url);
      })
      .catch((error) => {
        console.error("İstek başarısız!");
        console.error(error.response.data);
      })
      .finally(() => setIsFetching(false));
    // setPhoto(file.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsFetching(true);
    const payload = {
      kategori_adi: kategoriAdi,
      fotograf: photo,
    };

    const url = "https://panel.filozofunmutfagi.com/api/categories/add"; // Uygulamanın port numarasını uygun şekilde değiştirin

    const postCategory = new Promise((resolve, reject) =>
      axios
        .post(url, payload)
        .then((response) => {
          console.log("İstek başarılı!");
          console.log(response.data);
          resolve();
        })
        .catch((error) => {
          reject();
          console.error("İstek başarısız!");
          console.error(error.response.data);
        })
        .finally(() => setIsFetching(false))
    );

    toast.promise(postCategory, {
      pending: "İşleniyor",
      success: {
        render({ data }) {
          setTimeout(() => {
            router.push("/kategoriler");
          }, 2000);
          return `Kategori eklendi!`;
        },
        autoClose: 2000,
      },
      error: "Kategoriyi eklerken bir hatayla karşılaştık :(",
    });
  };
  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="text-2xl">Yeni Kategori Ekle</div>
      <Card className="p-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-2">Kategori fotoğrafı</div>
            <label htmlFor="upload-image">
              <Button variant="contained" component="span" startIcon={<BiUpload />}>
                Tarif Fotoğrafı Yükle
              </Button>
              <input
                id="upload-image"
                hidden
                accept="image/*"
                type="file"
                onChange={handleChangePhoto}
              />
            </label>
            {photo && <img src={`https://panel.filozofunmutfagi.com/uploads/${photo}`} className="h-40 mt-4" />}
          </div>
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-1">Kategori adı</div>
            <TextField
              value={kategoriAdi}
              onChange={(e) => setKategoriAdi(e.target.value)}
              fullWidth
              label="Kategori adı"
              name="kategoriAdi"
              required
            />
          </div>
          <Divider />
          <div className="col-span-2 flex justify-end">
            <Button type="submit" size="large" variant="contained" color="success">
              Kategoriyi Ekle
            </Button>
          </div>
        </div>
      </Card>
    </form>
  );
};

KategoriEkle.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default KategoriEkle;

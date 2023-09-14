import { Button, Card, Divider, TextField } from "@mui/material";
import React, { useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { BiUpload } from "react-icons/bi";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Loader from "../../components/loader";

const KaloriSayacEkle = () => {
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);
  const [kalori_sayac_adi, setKalori_sayac_adi] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsFetching(true);
    const payload = {
      kalori_sayac_adi,
    };

    const url = "http://localhost:3000/api/calorie-meters/add"; // Uygulamanın port numarasını uygun şekilde değiştirin

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
            router.push("/kalori-sayaclari");
          }, 2000);
          return `Kalori sayacı eklendi!`;
        },
        autoClose: 2000,
      },
      error: "Kalori sayacını eklerken bir hatayla karşılaştık :(",
    });
  };
  return (
    <form onSubmit={handleSubmit} className="p-4">
      {isFetching && <Loader />}
      <div className="text-2xl">Yeni Kalori Sayacı Ekle</div>
      <Card className="p-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <div className="mb-1">Sayaç adı</div>
            <TextField
              value={kalori_sayac_adi}
              onChange={(e) => setKalori_sayac_adi(e.target.value)}
              fullWidth
              label="Kategori adı"
              name="kategoriAdi"
              required
            />
          </div>
          <Divider />
          <div className="col-span-2 flex justify-end">
            <Button type="submit" size="large" variant="contained" color="success">
              Sayacı Ekle
            </Button>
          </div>
        </div>
      </Card>
    </form>
  );
};

KaloriSayacEkle.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default KaloriSayacEkle;

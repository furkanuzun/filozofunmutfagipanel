import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  Modal,
  TextField,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";

const Page = () => {
  const [kategoriler, setKategoriler] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const editCategory = (category_id) => {
    setSelectedCategory(kategoriler.find((category) => category._id == category_id));
    setShowModal(true);
  };

  useEffect(() => {
    getCalorieMeters();
  }, []);

  const getCalorieMeters = () => {
    axios
      .get("http://localhost:3001/api/calorie-meters")
      .then((res) => setKategoriler(res.data.calorieMeters))
      .catch((err) => console.log(err));
  };

  const updateCategory = (e) => {
    e.preventDefault();

    const url = "http://localhost:3001/api/calorie-meters/edit"; // Uygulamanın port numarasını uygun şekilde değiştirin

    const putCategory = new Promise((resolve, reject) =>
      axios
        .put(url, selectedCategory)
        .then((response) => {
          console.log("--edit", response);
          resolve();
        })
        .catch((error) => {
          reject();
          console.error("İstek başarısız!");
          console.error(error.response.data);
        })
    );

    toast.promise(putCategory, {
      pending: "İşleniyor",
      success: {
        render({ data }) {
          getCalorieMeters();
          setShowModal(false);
          return `Kalori sayacı düzenlendi!`;
        },
        autoClose: 2000,
      },
      error: "Kalori sayacını düzenlerken bir hatayla karşılaştık :(",
    });
  };

  return (
    <>
      <Head>
        <title>Filozofun Mutfağı | Kalori Sayaçları</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Sayaçlar</Typography>
              </Stack>
              <div>
                <Button
                  href="/kalori-sayaclari/ekle"
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Yeni Ekle
                </Button>
              </div>
            </Stack>
          </Stack>
          <Card className="mt-8">
            {kategoriler.length > 0 && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>KATEGORİ ADI</TableCell>
                    <TableCell>OLŞTR. TARİHİ</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {kategoriler.map((kategori) => {
                    const createdAt = format(new Date(kategori.createdAt), "dd/MM/yyyy");

                    return (
                      <TableRow hover key={kategori._id}>
                        <TableCell>
                          <Typography variant="subtitle2">{kategori.kalori_sayac_adi}</Typography>
                        </TableCell>
                        <TableCell>{createdAt}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => editCategory(kategori._id)}
                              className="flex items-center justify-center bg-green-500 text-white w-10 h-10 rounded-lg"
                            >
                              <AiOutlineEdit size={20} />
                            </button>
                            <button className="flex items-center justify-center bg-red-500 text-white w-10 h-10 rounded-lg">
                              <AiOutlineDelete size={20} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Card>
        </Container>
      </Box>
      {showModal && (
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="flex items-center justify-center"
        >
          <form onSubmit={updateCategory} className="bg-white w-[90%] lg:w-1/2 p-4 rounded-xl">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Sayacı Düzenle
            </Typography>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="col-span-2">
                <TextField
                  placeholder="Sayaç adı"
                  label="Sayaç Adı"
                  className="w-full"
                  value={selectedCategory.kalori_sayac_adi}
                  onChange={(val) =>
                    setSelectedCategory((prevState) => {
                      return { ...prevState, kalori_sayac_adi: val.target.value };
                    })
                  }
                />
              </div>
              <div className="col-span-1">
                <Button type="submit" variant="contained" color="success" className="w-full h-full">
                  Kaydet
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

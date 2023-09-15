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
import { BiUpload } from "react-icons/bi";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";

const Page = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [kategoriler, setKategoriler] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const editCategory = (_id) => {
    setSelectedCategory(kategoriler.find((category) => category._id == _id));
    setShowModal(true);
  };

  const updateCategory = (e) => {
    e.preventDefault();
    setIsFetching(true);

    const url = "https://filozofunmutfagi.com/api/contact-categories/edit"; // Uygulamanın port numarasını uygun şekilde değiştirin

    const putCategory = new Promise((resolve, reject) =>
      axios
        .put(url, selectedCategory)
        .then((response) => {
          resolve();
        })
        .catch((error) => {
          reject();
          console.error("İstek başarısız!");
          console.error(error.response.data);
        })
        .finally(() => setIsFetching(false))
    );

    toast.promise(putCategory, {
      pending: "İşleniyor",
      success: {
        render({ data }) {
          getCategories();
          setShowModal(false);
          return `Kategori düzenlendi!`;
        },
        autoClose: 2000,
      },
      error: "Kategoriyi düzenlerken bir hatayla karşılaştık :(",
    });
  };

  const deleteCategory = (_id) => {
    setIsFetching(true);

    const putCategory = new Promise((resolve, reject) =>
      axios
        .delete(`https://filozofunmutfagi.com/api/contact-categories/delete?_id=${_id}`)
        .then((res) => {
          resolve();
        })
        .catch((err) => reject())
        .finally((res) => setIsFetching(false))
    );

    toast.promise(putCategory, {
      pending: "İşleniyor",
      success: {
        render({ data }) {
          getCategories();
          return `Kategori silindi!`;
        },
        autoClose: 2000,
      },
      error: "Kategoriyi silerken bir hatayla karşılaştık :(",
    });
  };

  const getCategories = () => {
    axios
      .get("https://filozofunmutfagi.com/api/contact-categories")
      .then((res) => {
        setKategoriler(res.data.categories);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <Head>
        <title>Filozofun Mutfağı | İletişim Kategorileri</title>
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
                <Typography variant="h4">İletişim Kategorileri</Typography>
              </Stack>
              <div>
                <Button
                  href="/iletisim-kategorileri/ekle"
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Yeni İletişim Kategorisi Ekle
                </Button>
              </div>
            </Stack>
          </Stack>
          <Card className="mt-8">
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
                        <Typography variant="subtitle2">{kategori.kategori_adi}</Typography>
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
                          <button
                            onClick={() => deleteCategory(kategori._id)}
                            className="flex items-center justify-center bg-red-500 text-white w-10 h-10 rounded-lg"
                          >
                            <AiOutlineDelete size={20} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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
          <form onSubmit={updateCategory} className="bg-white w-1/2 p-4 rounded-xl">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Kategori Düzenle
            </Typography>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-1">
                <TextField
                  placeholder="Kategori adı"
                  label="Kategori Adı"
                  className="w-full"
                  value={selectedCategory.kategori_adi}
                  onChange={(val) =>
                    setSelectedCategory((prevState) => {
                      return { ...prevState, kategori_adi: val.target.value };
                    })
                  }
                  required
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

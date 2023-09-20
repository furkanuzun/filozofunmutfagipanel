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
  const [photo, setPhoto] = useState(null);
  const handleChangePhoto = (file) => {
    setIsFetching(true);
    const url = "http://localhost:3001/api/photo-upload"; // Uygulamanın port numarasını uygun şekilde değiştirin

    const formData = new FormData();
    formData.append("image", file.target.files[0]);

    axios
      .post(url, formData)
      .then((response) => {
        setSelectedCategory((prevState) => ({ ...prevState, fotograf: response.data.url }));
      })
      .catch((error) => {
        console.error("İstek başarısız!");
        console.error(error.response.data);
      })
      .finally(() => setIsFetching(false));
    // setPhoto(file.target.files[0]);
  };
  const editCategory = (_id) => {
    setSelectedCategory(kategoriler.find((category) => category._id == _id));
    console.log(kategoriler.find((category) => category._id == _id));
    setShowModal(true);
  };

  const updateCategory = (e) => {
    e.preventDefault();
    setIsFetching(true);

    const url = "http://localhost:3001/api/categories/edit"; // Uygulamanın port numarasını uygun şekilde değiştirin

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
        .delete(`http://localhost:3001/api/categories/delete?_id=${_id}`)
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
      .get("http://localhost:3001/api/categories")
      .then((res) => {
        console.log(res.data.categories);
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
        <title>Filozofun Mutfağı | Kategoriler</title>
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
                <Typography variant="h4">Kategoriler</Typography>
              </Stack>
              <div>
                <Button
                  href="/kategoriler/ekle"
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
                  console.log(kategori.createdAt);
                  const createdAt = format(new Date(kategori.createdAt), "dd/MM/yyyy");

                  return (
                    <TableRow hover key={kategori._id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <img
                            className="rounded-full w-8 h-8"
                            src={`http://localhost:3001/uploads/${kategori.fotograf}`}
                            alt=""
                          />
                          <Typography variant="subtitle2">{kategori.kategori_adi}</Typography>
                        </div>
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
          <form onSubmit={updateCategory} className="bg-white w-[90%] lg:w-1/2 p-4 rounded-xl">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Kategori Düzenle
            </Typography>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2 lg:col-span-1">
                <div className="mb-2">Kategori fotoğrafı</div>
                <label htmlFor="upload-image">
                  {selectedCategory.fotograf && (
                    <img
                      src={`http://localhost:3001/uploads/${selectedCategory.fotograf}`}
                      className="h-40 my-4"
                    />
                  )}

                  <input
                    id="upload-image"
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleChangePhoto}
                  />
                </label>
              </div>
              <div className="col-span-2 lg:col-span-1">
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
              <div className="col-span-2 lg:col-span-1">
                <Button
                  variant="contained"
                  component="span"
                  className="w-full"
                  startIcon={<BiUpload />}
                >
                  Tarif Fotoğrafı Yükle
                </Button>
              </div>
              <div className="col-span-2 lg:col-span-1">
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

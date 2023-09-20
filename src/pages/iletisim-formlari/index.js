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
    console.log(kategoriler.find((category) => category._id == _id));
    setShowModal(true);
  };

  const getForms = () => {
    axios
      .get("http://localhost:3001/api/contacts")
      .then((res) => {
        console.log(res.data.contacts);
        setKategoriler(res.data.contacts);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getForms();
  }, []);

  return (
    <>
      <Head>
        <title>Filozofun Mutfağı | İletişim Formları</title>
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
                <Typography variant="h4">İletişim Formları</Typography>
              </Stack>
            </Stack>
          </Stack>
          <Card className="mt-8">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="20%">BAŞLIK</TableCell>
                  <TableCell>MESAJ</TableCell>
                  <TableCell width="15%">KATEGORİ ADI</TableCell>
                  <TableCell width="10%">TARİH</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {kategoriler.map((kategori) => {
                  console.log(kategori.createdAt);
                  const createdAt = format(new Date(kategori.createdAt), "dd/MM/yyyy");

                  return (
                    <TableRow hover key={kategori._id}>
                      <TableCell>
                        <Typography variant="subtitle2">{kategori.baslik}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="subtitle2"
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            "-webkit-line-clamp": "1",
                            "-webkit-box-orient": "vertical",
                          }}
                        >
                          {kategori.mesaj}
                        </Typography>
                      </TableCell>
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
          <form className="bg-white w-[90%] lg:w-1/2 p-4 rounded-xl">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {selectedCategory.baslik}
            </Typography>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-1">
                <div className="mb-2 text-sm font-bold">Kullanıcı</div>
                <div>{selectedCategory.user.isim}</div>
              </div>
              <div className="col-span-1">
                <div className="mb-2 text-sm font-bold">Kategori</div>
                <div>{selectedCategory.kategori_adi}</div>
              </div>
              <div className="col-span-2 border-t border-gray-200 pt-4">
                <div className="mb-2 text-sm font-bold">Mesaj</div>
                <div>{selectedCategory.mesaj}</div>
              </div>
              <div className="col-span-2">
                <Button
                  onClick={() => setShowModal(false)}
                  variant="contained"
                  color="success"
                  className="w-full h-full"
                >
                  Tamam
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

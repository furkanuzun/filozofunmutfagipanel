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
import { SeverityPill } from "src/components/severity-pill";

const Page = () => {
  const statusMap = {
    pending: "warning",
    delivered: "success",
    refunded: "error",
  };
  const [isFetching, setIsFetching] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const editCategory = (_id) => {
    setSelectedCategory(kategoriler.find((category) => category._id == _id));
    console.log(kategoriler.find((category) => category._id == _id));
    setShowModal(true);
  };

  const getForms = () => {
    axios
      .get("http://localhost:3001/api/subscriptions/all-earnings")
      .then((res) => {
        console.log(res.data.earnings);
        setUsers(res.data.earnings);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getForms();
  }, []);

  return (
    <>
      <Head>
        <title>Filozofun Mutfağı | Aboneler</title>
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
                <Typography variant="h4">Aboneler</Typography>
              </Stack>
            </Stack>
          </Stack>
          <Card className="mt-8">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Kullanıcı</TableCell>
                  <TableCell>Paket Adı</TableCell>
                  <TableCell>Tarih</TableCell>
                  <TableCell>Tutar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => {
                  // TODO: Servise createdAt eklenecek
                  // TODO: Hangi paketi aldığı eklenecek - listede gösterilecek
                  // console.log(kategori.createdAt);
                  const createdAt = format(new Date(user.date), "dd/MM/yyyy");

                  return (
                    <TableRow hover key={user._id}>
                      <TableCell>
                        <Typography variant="subtitle2">{user.userId}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{user.product.title}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{createdAt}</Typography>
                      </TableCell>
                      <TableCell>
                        <SeverityPill color={statusMap.delivered}>{user.product.localizedPrice}</SeverityPill>
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

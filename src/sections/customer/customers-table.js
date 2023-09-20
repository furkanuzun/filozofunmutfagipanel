import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import Loader from "src/components/loader";

export const CustomersTable = (props) => {
  const router = useRouter();
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 1,
    rowsPerPage = 10,
    selected = [],
    getter,
  } = props;
  const [isFetching, setIsFetching] = useState(false);

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  const handleDelete = (_id) => {
    setIsFetching(true);
    axios
      .delete(`http://localhost:3001/api/recipes/delete?_id=${_id}`)
      .then((res) => {
        toast.success("Tarif başarıyla silindi");
        getter();
      })
      .catch((err) => console.log(err))
      .finally((res) => setIsFetching(false));
  };

  return (
    <Card>
      {isFetching && <Loader />}
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>TARİF ADI</TableCell>
                <TableCell>KALORİ</TableCell>
                <TableCell>SÜRE</TableCell>
                <TableCell>OLŞTR. TARİHİ</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((recipe) => {
                const isSelected = selected.includes(recipe.id);
                const createdAt = format(new Date(), "dd/MM/yyyy");

                return (
                  <TableRow hover key={recipe._id} selected={isSelected}>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar src={`http://localhost:3001/uploads/${recipe.fotograf}`}>
                          {getInitials(recipe.name)}
                        </Avatar>
                        <Typography variant="subtitle2">{recipe.tarif_adi}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{recipe.besin_degerleri.kalori}</TableCell>
                    <TableCell>{recipe.sure}dk</TableCell>
                    <TableCell>{createdAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => router.push(`/tarifler/${recipe._id}`)}
                          className="flex items-center justify-center bg-green-500 text-white w-10 h-10 rounded-lg"
                        >
                          <BiSearch size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(recipe._id)}
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
        </Box>
      </Scrollbar>
      {/* <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      /> */}
    </Card>
  );
};

CustomersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};

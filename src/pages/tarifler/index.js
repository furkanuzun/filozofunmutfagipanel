import { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { subDays, subHours } from "date-fns";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/sections/customer/customers-table";
import { CustomersSearch } from "src/sections/customer/customers-search";
import { applyPagination } from "src/utils/apply-pagination";
import axios from "axios";

const now = new Date();

const data = [
  {
    id: "5e887ac47eed253091be10cb",
    tarif_adi: "Yulaflı Fit Browni",
    tarif_fotograf: "https://via.placeholder.com/100x100",
    kalori: "600",
    sure: "5dk",
    createdAt: subDays(subHours(now, 1), 2).getTime(),
  },
  {
    id: "5e887ac47eed253091be10cb",
    tarif_adi: "Yulaflı Fit Browni",
    tarif_fotograf: "https://via.placeholder.com/100x100",
    kalori: "600",
    sure: "5dk",
    createdAt: subDays(subHours(now, 1), 2).getTime(),
  },
  {
    id: "5e887ac47eed253091be10cb",
    tarif_adi: "Yulaflı Fit Browni",
    tarif_fotograf: "https://via.placeholder.com/100x100",
    kalori: "600",
    sure: "5dk",
    createdAt: subDays(subHours(now, 1), 2).getTime(),
  },
  {
    id: "5e887ac47eed253091be10cb",
    tarif_adi: "Yulaflı Fit Browni",
    tarif_fotograf: "https://via.placeholder.com/100x100",
    kalori: "600",
    sure: "5dk",
    createdAt: subDays(subHours(now, 1), 2).getTime(),
  },
  {
    id: "5e887ac47eed253091be10cb",
    tarif_adi: "Yulaflı Fit Browni",
    tarif_fotograf: "https://via.placeholder.com/100x100",
    kalori: "600",
    sure: "5dk",
    createdAt: subDays(subHours(now, 1), 2).getTime(),
  },
];

const useCustomers = (recipes, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(recipes, page, rowsPerPage);
  }, [page, rowsPerPage]);
};

const useCustomerIds = (customers) => {
  return useMemo(() => {
    return customers.map((customer) => customer.id);
  }, [customers]);
};

const Page = () => {
  const [recipes, setRecipes] = useState([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    getRecipes();
  }, []);

  const getRecipes = () => {
    axios
      .get("http://localhost:3001/api/recipes")
      .then((res) => {
        setRecipes(res.data.recipes);
        setReady(true);
      })
      .catch((err) => {
        setReady(true);
        console.log(err);
        Error(err);
      });
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customers = useCustomers(recipes, page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  return (
    <>
      <Head>
        <title>Filozofun Mutfağı | Tarifler</title>
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
                <Typography variant="h4">Tarifler</Typography>
              </Stack>
              <div>
                <Button
                  href="/tarifler/ekle"
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Yeni Tarif Ekle
                </Button>
              </div>
            </Stack>
            {ready && (
              <>
                <CustomersSearch data={recipes} />
                <CustomersTable
                  count={recipes.length}
                  items={recipes}
                  getter={getRecipes}
                  onDeselectAll={customersSelection.handleDeselectAll}
                  onDeselectOne={customersSelection.handleDeselectOne}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  onSelectAll={customersSelection.handleSelectAll}
                  onSelectOne={customersSelection.handleSelectOne}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  selected={customersSelection.selected}
                />
              </>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

import Head from "next/head";
import { subDays, subHours } from "date-fns";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import { OverviewLatestOrders } from "src/sections/overview/overview-latest-orders";
import { OverviewLatestProducts } from "src/sections/overview/overview-latest-products";
import { OverviewSales } from "src/sections/overview/overview-sales";
import { OverviewTasksProgress } from "src/sections/overview/overview-tasks-progress";
import { OverviewTotalCustomers } from "src/sections/overview/overview-total-customers";
import { OverviewTotalProfit } from "src/sections/overview/overview-total-profit";
import { OverviewTraffic } from "src/sections/overview/overview-traffic";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "src/components/loader";

const now = new Date();


// TODO : NameServer ve DNS yapılandırmaları tamamlanacak. Muhammed'den dönüş bekleniyor.
// TODO : DNS ayarları yapıldıktan sonra nextapp ayağa kaldırılacak. Veritabanı testleri ve app testleri yapılacak.

const Page = () => {
  const [contactForms, setContactForms] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [latestSubscriptions, setLatestSubscriptions] = useState([]);

  const getLatestSubscriptions = () => {
    axios
      .get("http://localhost:3000/api/subscriptions/latest-subscriptions")
      .then((res) => {
        console.log("--from stats", res.data);
        setLatestSubscriptions(res.data.latestSubscriptions);
        getForms();
      })
      .catch((err) => {
        console.log("-err", err);
      });
  };

  const getStatistics = () => {
    axios
      .get("http://localhost:3000/api/statistics")
      .then((res) => {
        console.log("--from stats", res.data);
        setStatistics(res.data);
        getLatestSubscriptions();
      })
      .catch((err) => {
        console.log("-err", err);
      });
  };

  const getForms = () => {
    axios
      .get("http://localhost:3000/api/contacts")
      .then((res) => {
        setContactForms(res.data.contacts.splice(0, 10));
        setIsLoading(false);
      })
      .catch((err) => setIsLoading(false));
  };

  useEffect(() => {
    getStatistics();
  }, []);

  return (
    <>
      <Head>
        <title>Filozofun Mutfağı</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <Container maxWidth="xl">
            <Grid container spacing={3}>
              <Grid xs={12} sm={6} lg={4}>
                <OverviewBudget
                  difference={12}
                  positive
                  sx={{ height: "100%" }}
                  value={`${statistics.totalEarningsAmount} ₺`}
                />
              </Grid>
              <Grid xs={12} sm={6} lg={4}>
                <OverviewTotalCustomers
                  difference={16}
                  positive={false}
                  sx={{ height: "100%" }}
                  value={statistics.usersCount}
                />
              </Grid>
              <Grid xs={12} sm={6} lg={4}>
                <OverviewTasksProgress
                  sx={{ height: "100%" }}
                  unread={statistics.unboxedContacts}
                />
              </Grid>
              <Grid xs={12} md={6} lg={4}>
                <OverviewLatestProducts products={contactForms} sx={{ height: "100%" }} />
              </Grid>
              <Grid xs={12} md={12} lg={8}>
                <OverviewLatestOrders
                  orders={latestSubscriptions}
                  sx={{ height: "100%" }}
                />
              </Grid>
            </Grid>
          </Container>
        )}
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

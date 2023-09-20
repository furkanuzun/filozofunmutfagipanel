import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import { withAuthGuard } from "src/hocs/with-auth-guard";
import { SideNav } from "./side-nav";
import { Logo } from "src/components/logo";
import { Box } from "@mui/system";
import NextLink from "next/link";
import { HiMenuAlt3 } from "react-icons/hi";

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

const LayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
});

export const Layout = withAuthGuard((props) => {
  const { children } = props;
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(false);

  const handlePathnameChange = useCallback(() => {
    if (openNav) {
      setOpenNav(false);
    }
  }, [openNav]);

  useEffect(
    () => {
      handlePathnameChange();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );

  return (
    <>
      <SideNav onClose={() => setOpenNav(false)} open={openNav} />

      {/* Mobil header */}

      <div className="flex lg:hidden items-center justify-between px-5 pt-5">
        <div className="flex items-center space-x-2">
          <img className="h-8 rounded-lg" src="/assets/filozof-logo.png" alt="" />
          <div>Filozofun Mutfağı</div>
        </div>
        <div onClick={() => setOpenNav((prevState) => !prevState)}>
          <HiMenuAlt3 size={30}/>
        </div>
      </div>
      <LayoutRoot>
        <LayoutContainer>{children}</LayoutContainer>
      </LayoutRoot>
    </>
  );
});

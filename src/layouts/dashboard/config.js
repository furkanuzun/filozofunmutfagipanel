import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import { SvgIcon } from "@mui/material";
import { BiCookie, BiCategory, BiUser, BiMailSend, BiMoney, BiHomeSmile } from "react-icons/bi";
import { AiOutlineFire } from "react-icons/ai";
import { RiContactsLine } from "react-icons/ri";
import { GiReceiveMoney } from "react-icons/gi";

export const items = [
  {
    title: "Ana sayfa",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <BiHomeSmile />
      </SvgIcon>
    ),
  },
  {
    title: "Tarifler",
    path: "/tarifler",
    icon: (
      <SvgIcon fontSize="small">
        <BiCookie />
      </SvgIcon>
    ),
  },
  {
    title: "Kategoriler",
    path: "/kategoriler",
    icon: (
      <SvgIcon fontSize="small">
        <BiCategory />
      </SvgIcon>
    ),
  },
  {
    title: "Kalori Sayaçları",
    path: "/kalori-sayaclari",
    icon: (
      <SvgIcon fontSize="small">
        <AiOutlineFire />
      </SvgIcon>
    ),
  },
  {
    title: "İletişim Kategorileri",
    path: "/iletisim-kategorileri",
    icon: (
      <SvgIcon fontSize="small">
        <RiContactsLine />
      </SvgIcon>
    ),
  },
  {
    title: "İletişim Formları",
    path: "/iletisim-formlari",
    icon: (
      <SvgIcon fontSize="small">
        <BiMailSend />
      </SvgIcon>
    ),
  },
  {
    title: "Kullanıcılar",
    path: "/kullanicilar",
    icon: (
      <SvgIcon fontSize="small">
        <BiUser />
      </SvgIcon>
    ),
  },
  {
    title: "Aboneler",
    path: "/aboneler",
    icon: (
      <SvgIcon fontSize="small">
        <BiMoney />
      </SvgIcon>
    ),
  },
  {
    title: "Tüm Kazançlar",
    path: "/aboneler/kazanclar",
    icon: (
      <SvgIcon fontSize="small">
        <GiReceiveMoney />
      </SvgIcon>
    ),
  },
];

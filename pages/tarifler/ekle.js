import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { Box, useTheme } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { WithContext as ReactTags } from "react-tag-input";
import { MdRemoveCircle } from "react-icons/md";
import { BiUpload } from "react-icons/bi";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";
import Loader from "../../src/components/loader";
import { toast } from "react-toastify";
import notify from "src/components/notify";
import { useRouter } from "next/router";
import { rejects } from "assert";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

function getStyles(name, categoryName, theme) {
  return {
    fontWeight:
      categoryName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const TarifEkle = () => {
  useEffect(() => {
    getCats();
  }, []);

  const getCats = () => {
    const getCategories = new Promise((resolve, reject) =>
      axios
        .get("http://localhost:3000/api/categories")
        .then((res) => {
          setMainCategories(res.data.categories);
          resolve();
        })
        .catch((err) => reject())
    );
    const getCalorieMeters = new Promise((resolve, reject) =>
      axios
        .get("http://localhost:3000/api/calorie-meters")
        .then((res) => {
          setCalorieMeters(res.data.calorieMeters);
          resolve();
        })
        .catch((err) => reject())
    );
    Promise.all([getCategories, getCalorieMeters]).then((values) => {
      setIsFetching(false);
    });
  };

  const router = useRouter();

  const [tarif, setTarif] = useState({
    video: null,
    tarif_adi: null,
    sure: null,
    aciklama: null,
    besin_degerleri: { kalori: null, karbonhidrat: null, protein: null, yag: null },
    isPro: true,
  });
  const [ingredients, setIngredients] = React.useState([]);
  const [instructions, setInstructions] = React.useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const theme = useTheme();
  const [mainCategories, setMainCategories] = useState([
    "Kahvaltı",
    "Ekonomik",
    "Yüksek Protein",
    "Düşük Karbonhidrat",
  ]);
  const [selectedMainCategories, setSelectedMainCategories] = React.useState([]);
  const [calorieMeters, setCalorieMeters] = useState([
    "100-200 kcal",
    "200-300 kcal",
    "300-400 kcal",
    "400-500 kcal",
  ]);
  const [selectedCalorieMeters, setSelectedCalorieMeters] = React.useState(null);
  const [video, setVideo] = useState(null);
  const handleChangeVideo = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setVideo(reader.result);
    };

    reader.readAsDataURL(file);
  };
  const [photo, setPhoto] = useState(null);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedMainCategories(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleChangeSelectedCalorieMeter = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCalorieMeters(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const KeyCodes = {
    enter: 13,
  };
  const delimiters = [KeyCodes.enter];
  const handleDeleteIngredient = (i) => {
    setIngredients(ingredients.filter((tag, index) => index !== i));
  };

  const handleAddIngredient = (tag) => {
    setIngredients([...ingredients, tag]);
  };

  const handleDragIngredient = (tag, currPos, newPos) => {
    const newTags = ingredients.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setIngredients(newTags);
  };

  const IngredientTagsRemoveComponent = ({ className, onRemove }) => {
    return (
      <button onClick={onRemove} className="ml-2">
        <MdRemoveCircle size={20} color="white" />
      </button>
    );
  };

  const handleDeleteInstruction = (i) => {
    setInstructions(instructions.filter((tag, index) => index !== i));
  };

  const handleAddInstruction = (tag) => {
    setInstructions([...instructions, tag]);
  };

  const handleDragInstruction = (tag, currPos, newPos) => {
    const newTags = instructions.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setInstructions(newTags);
  };

  const InstructionTagsRemoveComponent = ({ className, onRemove }) => {
    return (
      <button onClick={onRemove} className="ml-2">
        <MdRemoveCircle size={20} color="white" />
      </button>
    );
  };

  const handleChangePhoto = (file) => {
    setIsFetching(true);
    const url = "http://localhost:3000/api/photo-upload"; // Uygulamanın port numarasını uygun şekilde değiştirin

    const formData = new FormData();
    formData.append("image", file.target.files[0]);

    axios
      .post(url, formData)
      .then((response) => {
        setPhoto(response.data.url);
      })
      .catch((error) => {
        console.error("İstek başarısız!");
        console.error(error.response.data);
      })
      .finally(() => setIsFetching(false));
    // setPhoto(file.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsFetching(true);
    const payload = {
      ...tarif,
      fotograf: photo,
      malzemeler: ingredients,
      talimatlar: instructions,
      kategoriler: selectedMainCategories,
      kalori_sayaci: selectedCalorieMeters,
    };

    const url = "http://localhost:3000/api/recipes/add"; // Uygulamanın port numarasını uygun şekilde değiştirin

    const postRecipe = new Promise((resolve, reject) =>
      axios
        .post(url, payload)
        .then((response) => {
          console.log("İstek başarılı!");
          console.log(response.data);
          resolve();
          // toast.success("Tarif kaydedildi!\n Yönlendiriliyorsunuz..", {
          //   position: toast.POSITION.BOTTOM_RIGHT,
          // });
          // setTimeout(() => {
          //   router.push("/tarifler");
          // }, 2000);
        })
        .catch((error) => {
          reject();
          console.error("İstek başarısız!");
          console.error(error.response.data);
        })
        .finally(() => setIsFetching(false))
    );

    toast.promise(postRecipe, {
      pending: "İşleniyor",
      success: {
        render({ data }) {
          setTimeout(() => {
            router.push("/tarifler");
          }, 2000);
          return `Tarif eklendi!`;
        },
        autoClose: 2000,
      },
      error: "Tarifi eklerken bir hatayla karşılaştık :(",
    });
  };
  return (
    <div className="p-4">
      {isFetching && <Loader />}
      <div className="text-3xl font-medium">Yeni Tarif Ekle</div>

      <form className="mt-4" onSubmit={handleSubmit}>
        <Card>
          <CardContent sx={{ px: 3 }}>
            <div className="grid grid-cols-2 gap-4">
              {/* Başlık */}
              <div className="col-span-2 flex items-center justify-between">
                <div className="font-medium text-xl">Genel bilgiler</div>
              </div>
              <div className="col-span-1">
                <TextField
                  onChange={(e) =>
                    setTarif((prevState) => ({ ...prevState, tarif_adi: e.target.value }))
                  }
                  autoFocus
                  fullWidth
                  label="Tarif adı"
                  name="firstName"
                  required
                />
              </div>
              <div className="col-span-1">
                <TextField
                  onChange={(e) =>
                    setTarif((prevState) => ({ ...prevState, sure: e.target.value }))
                  }
                  fullWidth
                  label="Tarif süresi"
                  name="firstName"
                  required
                />
              </div>
              <div className="col-span-2">
                <TextField
                  onChange={(e) =>
                    setTarif((prevState) => ({ ...prevState, aciklama: e.target.value }))
                  }
                  label="Tarif açıklaması"
                  className="w-full placeholder-gray-500"
                  placeholder="Tarifi açıklayıcı bir metin girin"
                  multiline
                  rows={3}
                />
              </div>
              <Divider />
              {/* Kalori/makro bilgileri */}
              <div className="col-span-2">
                <div className="font-medium text-xl">Kalori/makro bilgileri</div>
              </div>
              <div className="col-span-2 grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <TextField
                    onChange={(e) =>
                      setTarif((prevState) => ({
                        ...prevState,
                        besin_degerleri: {
                          ...prevState.besin_degerleri,
                          kalori: e.target.value,
                        },
                      }))
                    }
                    fullWidth
                    label="Kalori"
                    name="firstName"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <TextField
                    onChange={(e) =>
                      setTarif((prevState) => ({
                        ...prevState,
                        besin_degerleri: {
                          ...prevState.besin_degerleri,
                          karbonhidrat: e.target.value,
                        },
                      }))
                    }
                    fullWidth
                    label="Karbonhidrat"
                    name="firstName"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <TextField
                    onChange={(e) =>
                      setTarif((prevState) => ({
                        ...prevState,
                        besin_degerleri: {
                          ...prevState.besin_degerleri,
                          protein: e.target.value,
                        },
                      }))
                    }
                    fullWidth
                    label="Protein"
                    name="firstName"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <TextField
                    onChange={(e) =>
                      setTarif((prevState) => ({
                        ...prevState,
                        besin_degerleri: {
                          ...prevState.besin_degerleri,
                          yag: e.target.value,
                        },
                      }))
                    }
                    fullWidth
                    label="Yağ"
                    name="firstName"
                    required
                  />
                </div>
              </div>
              <Divider />
              <div className="col-span-2">
                <div className="font-medium text-xl mb-4">Tarif detayları</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <div className="mb-1">Malzemeler</div>
                    <ReactTags
                      classNames={{
                        tag: "font-semibold text-sm p-2 bg-emerald-500 text-white mr-2 inline-flex items-center justify-center rounded-lg shadow mb-2",
                        remove:
                          "text-white h-7 w-7 bg-gray-400 rounded-full flex items-center justify-center ml-2",
                        tagInputField:
                          "text-sm font-medium py-3 px-3 border border-gray-200 rounded-lg w-full",
                        tagInput: "mb-2",
                      }}
                      tags={ingredients}
                      delimiters={delimiters}
                      handleDelete={handleDeleteIngredient}
                      handleAddition={handleAddIngredient}
                      handleDrag={handleDragIngredient}
                      inputFieldPosition="top"
                      removeComponent={IngredientTagsRemoveComponent}
                      placeholder="Malzeme girin ve enter'a basın"
                      autofocus={false}
                    />
                  </div>
                  <div className="col-span-1">
                    <div className="mb-1">Talimatlar</div>
                    <ReactTags
                      classNames={{
                        tag: "flex justify-between font-semibold text-sm p-2 bg-violet-500 text-white mr-2 inline-flex items-center justify-center rounded-lg shadow mb-2",
                        remove:
                          "text-white h-7 w-7 bg-gray-400 rounded-full flex items-center justify-center ml-2",
                        tagInputField:
                          "text-sm font-medium py-3 px-3 border border-gray-200 rounded-lg w-full",
                        tagInput: "mb-2",
                        selected: "flex flex-col",
                      }}
                      tags={instructions}
                      delimiters={delimiters}
                      handleDelete={handleDeleteInstruction}
                      handleAddition={handleAddInstruction}
                      handleDrag={handleDragInstruction}
                      inputFieldPosition="top"
                      removeComponent={InstructionTagsRemoveComponent}
                      placeholder="Talimat girin ve enter'a basın"
                      autofocus={false}
                    />
                  </div>
                </div>
              </div>
              <Divider />
              {!isFetching && (
                <div className="col-span-2">
                  <div className="font-medium text-xl mb-4">Kategorizasyon</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                      {/* <div className="mb-1">Ana Kategoriler</div> */}
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="demo-multiple-chip-label">Ana Kategoriler</InputLabel>
                        <Select
                          labelId="demo-multiple-chip-label"
                          id="demo-multiple-chip"
                          multiple
                          className="focus:border-0"
                          value={selectedMainCategories}
                          onChange={handleChange}
                          input={
                            <OutlinedInput id="select-multiple-chip" label="Ana Kategoriler" />
                          }
                          renderValue={(selected) => (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                              {selected.map((value) => (
                                <Chip
                                  key={value}
                                  label={
                                    mainCategories.find((item) => item._id === value._id)
                                      .kategori_adi
                                  }
                                />
                              ))}
                            </Box>
                          )}
                          MenuProps={MenuProps}
                        >
                          {mainCategories.map((category) => (
                            <MenuItem
                              key={category._id}
                              value={category}
                              style={getStyles(category, selectedMainCategories, theme)}
                            >
                              {category.kategori_adi}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="col-span-1">
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="demo-multiple-chip-label">
                          Kalori Sayaç Kategorisi
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-chip-label"
                          id="demo-multiple-chip"
                          className="focus:border-0"
                          value={selectedCalorieMeters}
                          onChange={handleChangeSelectedCalorieMeter}
                          input={
                            <OutlinedInput
                              id="select-multiple-chip"
                              label="Kalori Sayaç Kategorisi"
                            />
                          }
                          renderValue={(selected) => (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                              <Chip key={selected._id} label={selected.kalori_sayac_adi} />
                            </Box>
                          )}
                          MenuProps={MenuProps}
                        >
                          {calorieMeters.map((name) => (
                            <MenuItem key={name._id} value={name}>
                              {name.kalori_sayac_adi}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
              )}
              <Divider />
              <div className="col-span-2">
                <div className="font-medium text-xl mb-4">Medyalar</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <TextField
                      onChange={(e) =>
                        setTarif((prevState) => ({
                          ...prevState,
                          video: e.target.value,
                        }))
                      }
                      fullWidth
                      label="Tarif video linki"
                      name="firstName"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label htmlFor="upload-image">
                      <Button variant="contained" component="span" startIcon={<BiUpload />}>
                        Tarif Fotoğrafı Yükle
                      </Button>
                      <input
                        id="upload-image"
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={handleChangePhoto}
                      />
                    </label>
                    {photo && <img src={`/uploads/${photo}`} className="h-40 mt-4" />}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <div className="flex items-center space-x-2 mr-8">
              <div className="font-medium">PRO</div>
              <Switch
                onChange={(e) =>
                  setTarif((prevState) => ({
                    ...prevState,
                    isPro: e.target.checked,
                  }))
                }
                defaultChecked
                sx={{}}
              />
            </div>
            <Button type="submit" size="large" variant="contained" color="success">
              Tarifi ekle
            </Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
};

TarifEkle.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TarifEkle;

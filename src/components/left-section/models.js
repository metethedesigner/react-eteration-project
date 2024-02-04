import React, { useEffect, useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { FormLabel } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updateFiltersAndSort } from "../../store/products/action";

const Models = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const [selectedModels, setSelectedModels] = useState([]);

  //Güncel ürünleri çekerek model listesi oluşturuyoruz.
  const models = [...new Set(products?.map((product) => product.model))];

  // Seçili markaları güncelleme fonksiyonu
  const handleSelectModels = (event, newValue) => {
    setSelectedModels(newValue);
  };

  // Checkbox'ın durumunu güncellemek için fonksiyon
  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setSelectedModels([...selectedModels, event.target.name]);
    } else {
      setSelectedModels(
        selectedModels.filter((model) => model !== event.target.name)
      );
    }
  };

  //Seçilen model ile istek atmak için fonksiyon
  useEffect(() => {
    dispatch(updateFiltersAndSort({ selectedModels: selectedModels }));
  }, [selectedModels]);

  return (
    <div
      style={{
        padding: 10,
        marginTop: 10,
        backgroundColor: "#FFF",
      }}
      className="shadow-md rounded-md w-full xs:w-[220px]"
    >
      <FormGroup>
        <FormLabel id="demo-radio-buttons-group-label">Model</FormLabel>
        <Stack spacing={2} sx={{ width: "100%", marginTop: "10px" }}>
          <Autocomplete
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            options={models}
            value={selectedModels}
            onChange={handleSelectModels}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Models.."
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                }}
              />
            )}
          />
        </Stack>
        <div className="h-[200px] mt-3 overflow-auto flex flex-col">
          {models.map((model) => (
            <FormControlLabel
              key={model}
              control={
                <Checkbox
                  checked={selectedModels?.includes(model)}
                  onChange={handleCheckboxChange}
                  name={model}
                />
              }
              label={model}
            />
          ))}
        </div>
      </FormGroup>
    </div>
  );
};

export default Models;

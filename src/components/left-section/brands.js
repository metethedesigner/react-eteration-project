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

const Brands = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Markaları al ve bir liste oluştur
  const brands = [...new Set(products?.map((product) => product.brand))];

  // Seçili markaları güncelleme fonksiyonu
  const handleSelectBrand = (event, newValue) => {
    setSelectedBrands(newValue);
  };

  // Checkbox'ın durumunu güncellemek için fonksiyon
  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setSelectedBrands([...selectedBrands, event.target.name]);
    } else {
      setSelectedBrands(
        selectedBrands.filter((brand) => brand !== event.target.name)
      );
    }
  };

  //Seçilen marka ile istek atmak için fonksiyon
  useEffect(() => {
    dispatch(updateFiltersAndSort({ selectedBrands: selectedBrands }));
  }, [selectedBrands]);

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
        <FormLabel id="demo-radio-buttons-group-label">Brands</FormLabel>
        <Stack spacing={2} sx={{ width: "100%", marginTop: "10px" }}>
          <Autocomplete
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            multiple
            options={brands}
            value={selectedBrands}
            onChange={handleSelectBrand}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Brands..."
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                }}
              />
            )}
          />
        </Stack>
        <div className="h-[200px] mt-3 overflow-auto flex flex-col">
          {brands.map((brand) => (
            <FormControlLabel
              key={brand}
              control={
                <Checkbox
                  checked={selectedBrands?.includes(brand)}
                  onChange={handleCheckboxChange}
                  name={brand}
                />
              }
              label={brand}
            />
          ))}
        </div>
      </FormGroup>
    </div>
  );
};

export default Brands;

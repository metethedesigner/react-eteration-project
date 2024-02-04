import { put, select, takeEvery } from "redux-saga/effects";
import {
  actionTypes,
  getProductsFailure,
  getProductsSuccess,
  setFilteredAndSortedProducts,
} from "./action";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import baseApi from "../../API/api";

function* getProductsSaga() {
  try {
    const response = yield baseApi.get(`/products`);

    yield put(getProductsSuccess(response.data));
  } catch (error) {
    yield put(getProductsFailure(error));
  }
}

function* handleFiltersAndSortSaga(action) {
  try {
    const { products, originalProducts } = yield select(
      (state) => state.products
    );
    let result = [...products];

    const { searchQuery, sortBy, selectedBrands, selectedModels } =
      action.payload;

    // Eğer hiçbir filtre uygulanmadıysa, orijinal ürün listesini kullan
    if (
      !searchQuery &&
      !sortBy &&
      (!selectedBrands || selectedBrands.length === 0) &&
      (!selectedModels || selectedModels.length === 0)
    ) {
      result = [...originalProducts];
    } else {
      // Arama işlemi
      if (searchQuery) {
        result = result.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Markaya göre filtreleme
      if (selectedBrands && selectedBrands.length > 0) {
        result = result.filter((product) =>
          selectedBrands.includes(product.brand)
        );
      }

      // Modele göre filtreleme
      if (selectedModels && selectedModels.length > 0) {
        result = result.filter((product) =>
          selectedModels.includes(product.model)
        );
      }

      // Sıralama işlemi
      if (sortBy) {
        switch (sortBy) {
          case "old-to-new":
            result.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
            break;
          case "new-to-old":
            result.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            break;
          case "price-low-to-high":
            result.sort((a, b) => a.price - b.price);
            break;
          case "price-high-to-low":
            result.sort((a, b) => b.price - a.price);
            break;
        }
      }
    }

    // Filtrelenmiş ve sıralanmış sonuçları güncelle
    yield put(setFilteredAndSortedProducts(result));
  } catch (error) {
    yield put(getProductsFailure(error.toString()));
    toast.error("Filter and Sort failed!");
  }
}

function* resetProductsSaga() {
  console.log("reset products çalıştı");
  // originalProducts state'ini seç
  const originalProducts = yield select(
    (state) => state.products.originalProducts
  );

  console.log(originalProducts);
  // originalProducts'ı kullanarak products listesini güncelle
  yield put(getProductsSuccess(originalProducts));
}

export default function* productsSaga() {
  yield takeEvery(actionTypes.GET_PRODUCTS_REQUEST, getProductsSaga);
  yield takeEvery(
    actionTypes.UPDATE_FILTERS_AND_SORT,
    handleFiltersAndSortSaga
  );
  yield takeEvery(actionTypes.RESET_PRODUCTS_TO_ORIGINAL, resetProductsSaga);
}

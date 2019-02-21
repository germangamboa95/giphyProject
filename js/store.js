const StorageCtrl = (function() {
  myStorage = window.localStorage;

  const store = {
    categories: ["cats", "dogs", "birds"],
    saved: []
  };

  const saveDataStoreToLocalStorage = function() {
    const parsedStore = JSON.stringify(store);
    console.log(parsedStore);
    myStorage.setItem("store", parsedStore);
  };

  const loadCategoriesFromLocalStorage = function() {
    const str = myStorage.getItem("store");
    const obj = JSON.parse(str);
    store.categories = obj.categories;
    return store.categories;
  };

  const loadSavedImgsFromLocalStorage = function() {
    const str = myStorage.getItem("store");
    const obj = JSON.parse(str);
    store.saved = obj.saved;
    return store.saved;
  };

  return {
    dataStore: store,
    saveDataStoreToLocalStorage: saveDataStoreToLocalStorage,
    getCategories: loadCategoriesFromLocalStorage,
    generateSavedImages: loadSavedImgsFromLocalStorage
  };
})();

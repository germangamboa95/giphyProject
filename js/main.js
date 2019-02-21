const appCtrl = (function(StorageCtrl, UICtrl) {
  // I must give credit to handtrix on jsfiddle for this function.

  const tempQueryData = {
    keyword: "Cats",
    limit: 12,
    offset: 0
  };

  const DOM = {
    modalStore: "modals",
    pagination: ".pagination",
    searchBar: "#search",
    mobileBar: "#search-m",
    categorySection: ".categories",
    loadMore: "#load-more"
  };

  const saveImageClickHandler = function() {
    $(".save-me").on("click", function(e) {
      console.log(this);
      let val = $(this).attr("data-id");

      if (StorageCtrl.dataStore.saved.indexOf(val) == -1) {
        StorageCtrl.dataStore.saved.push(val);
        StorageCtrl.saveDataStoreToLocalStorage();
      }
    });
    $(".download-me").on("click", function() {
      console.log("asd");
      const url = $(this).attr("data-ref");
      convertFileToDataURL(url, function(data) {
        $("#trigger").attr("href", data);
        document.querySelector("#trigger").click();
      });
    });
  };

  //getSearchImages automatically calls the functions that generate the gallery
  const getSearchImages = function() {
    fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=YqLensbIWv5skyGVSr6ZPFClfQImMmX4&q=${
        tempQueryData.keyword
      }&limit=${tempQueryData.limit}&offset=${
        tempQueryData.offset
      }&rating=G&lang=en`
    )
      .then(res => res.json())
      .then(data => {
        let foo = UICtrl.galleryGenerator(data.data);
        $(".img-gal").html(foo);
        saveCategories();
        saveImageClickHandler(); // Move once app controller is in place
      });
  };
  const getSearchImagesV1 = function() {
    fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=YqLensbIWv5skyGVSr6ZPFClfQImMmX4&q=${
        tempQueryData.keyword
      }&limit=${tempQueryData.limit}&offset=${
        tempQueryData.offset
      }&rating=G&lang=en`
    )
      .then(res => res.json())
      .then(data => {
        let foo = UICtrl.galleryGenerator(data.data);
        $(".img-gal").append(foo);
        saveCategories();
        saveImageClickHandler(); // Move once app controller is in place
      });
  };

  const generateSavedImages = function() {
    const query = StorageCtrl.generateSavedImages().join(",");
    fetch(
      `https://api.giphy.com/v1/gifs?api_key=YqLensbIWv5skyGVSr6ZPFClfQImMmX4&ids=${query}`
    )
      .then(res => res.json())
      .then(data => {
        let foo = UICtrl.galleryGenerator(data.data);
        $(".img-gal").html(foo);
      });
  };

  const generateCategoryBtn = function() {
    $(".categories .row").append(
      `<button data-word="${
        tempQueryData.keyword
      }" class="btn btn-large btn-info  col-2 col-md-2 m-1">${
        tempQueryData.keyword
      }</button>`
    );
  };

  const generateRecentSearchItem = function() {
    $(".search-list").append(
      `<li class="list-group-item p-0 pt-2">${tempQueryData.keyword}</li>`
    );
  };

  const saveCategories = function() {
    let key = tempQueryData.keyword.toLowerCase();
    if (StorageCtrl.dataStore.categories.indexOf(key) == -1) {
      StorageCtrl.dataStore.categories.push(key);
      StorageCtrl.saveDataStoreToLocalStorage();
    }
  };

  const loadCategoriesFromLocalStorage = function() {
    const list = StorageCtrl.getCategories();
    UICtrl.dispBtn(list);
  };

  $(DOM.loadMore).on("click", function() {
    tempQueryData.offset += 12;
    getSearchImagesV1();
  });

  $(DOM.searchBar).on("submit", function(e) {
    e.preventDefault();
    let query = e.target[1].value;
    tempQueryData.keyword = query;
    getSearchImages();
    e.target[1].value = "";
    generateRecentSearchItem();
    generateCategoryBtn();
  });

  $(DOM.mobileBar).on("submit", function(e) {
    e.preventDefault();
    let query = e.target[1].value;
    tempQueryData.keyword = query;
    getSearchImages();
    e.target[1].value = "";
    generateRecentSearchItem();
    generateCategoryBtn();
  });

  $(DOM.categorySection).on("click", ".btn", function() {
    let word = $(this).attr("data-word");
    tempQueryData.keyword = word;
    getSearchImages();
  });

  return {
    initHome: getSearchImages,
    initSaved: generateSavedImages,
    loadCat: loadCategoriesFromLocalStorage
  };
})(StorageCtrl, UICtrl);

//Bootstrap local storage into existance
if (window.localStorage.getItem("store") == null) {
  StorageCtrl.saveDataStoreToLocalStorage();
}
StorageCtrl.generateSavedImages();
appCtrl.loadCat();

const StorageCtrl = (function() {

  myStorage = window.localStorage;

  const store = {
    categories: ['cats','dogs','birds'],
    saved: []
  }

  const saveDataStoreToLocalStorage = function() {
    const parsedStore = JSON.stringify(store);
    console.log(parsedStore);
    myStorage.setItem('store',parsedStore);
  }


  const loadCategoriesFromLocalStorage = function() {
    const str = myStorage.getItem('store');
    const obj = JSON.parse(str);
    store.categories = obj.categories;
    return store.categories;
  }

  const loadSavedImgsFromLocalStorage = function() {
    const str = myStorage.getItem('store');
    const obj = JSON.parse(str);
    store.saved = obj.saved;
    return store.saved;
  }




  return {
    dataStore: store,
    saveDataStoreToLocalStorage: saveDataStoreToLocalStorage,
    getCategories: loadCategoriesFromLocalStorage,
    generateSavedImages: loadSavedImgsFromLocalStorage
  }


})()

const UICtrl = (function() {


  const cardTemplate = function(data) {
    const info = {
      imgStill: data.images['480w_still'].url,
      imgGif: data.images['downsized'].url,
      id: data.id,
      rating: data.rating,
      createdDate: data.import_datetime,
      title: data.title
    }

    let cardMarkUp =
      `
      <div  class="card mb-3 mx-auto mx-md-0 p-0 col-lg-3 col-md-6" data-id="${info.id}">
        <img data-toggle="modal" data-target="#${info.id}"  src="${info.imgStill}"
          alt="Card image">
        <div class="card-body">
          <p class="card-text">${info.title.toUpperCase()}</p>
          <p class="card-text mb-0"><strong>Rating:</strong> ${info.rating.toUpperCase()}</p>
          <p class="card-text"><strong>Date Added: </strong> <br> ${new Date(info.createdDate).toDateString()}</p>
          <butto data-id="${info.id}"  class="btn btn-primary save-me">Save</button>
        </div>



      </div>
      `;

    let modal = `<div class="modal" id='${info.id}'>
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <img data-toggle="modal" data-target="" style="height: auto; width: 100%; display: block;" src="${info.imgGif}"
            alt="Card image">

        </div>
      </div></div>`;

    return cardMarkUp + modal;
  };

  const galleryGenerator = function(data) {

    let container = document.createElement('div');
    let node = document.createElement('div');
    node.classList.add('row');
    data.forEach((item, index) => {
      node.innerHTML += cardTemplate(item);
    });
    container.appendChild(node);

    return container;
  }

  const categoryBtnGenerator = function(data) {
    data.forEach( item => {
      $('.categories .row').append(`<button data-word="${item}" class="btn btn-large btn-info  col-2 col-md-2 m-1">${item}</button>`);
    });

  }

  return {
    galleryGenerator: galleryGenerator,
    dispBtn: categoryBtnGenerator
  }

})();



const appCtrl = (function(StorageCtrl,UICtrl){

  const tempQueryData = {
    keyword: 'Cats',
    limit: 12,
    offset: 0,

  }

  const DOM = {
    modalStore: 'modals',
    pagination: '.pagination',
    searchBar: '#search',
    mobileBar: '#search-m',
    categorySection: '.categories',
    loadMore: '#load-more'
  }

  const saveImageClickHandler = function(){
    $('.save-me').on('click', function(e) {
      console.log(this);
      let val = $(this).attr('data-id');

      if(StorageCtrl.dataStore.saved.indexOf(val) == -1) {
        StorageCtrl.dataStore.saved.push(val);
        StorageCtrl.saveDataStoreToLocalStorage();
      }

    });
  }

  //getSearchImages automatically calls the functions that generate the gallery
  const getSearchImages = function() {
    fetch(`https://api.giphy.com/v1/gifs/search?api_key=YqLensbIWv5skyGVSr6ZPFClfQImMmX4&q=${tempQueryData.keyword}&limit=${tempQueryData.limit}&offset=${tempQueryData.offset}&rating=G&lang=en`)
      .then(res => res.json())
      .then(data => {
        let foo = UICtrl.galleryGenerator(data.data);
        $('.img-gal').html(foo);
        saveCategories();
        saveImageClickHandler(); // Move once app controller is in place

      });
  }
  const getSearchImagesV1 = function() {
    fetch(`https://api.giphy.com/v1/gifs/search?api_key=YqLensbIWv5skyGVSr6ZPFClfQImMmX4&q=${tempQueryData.keyword}&limit=${tempQueryData.limit}&offset=${tempQueryData.offset}&rating=G&lang=en`)
      .then(res => res.json())
      .then(data => {
        let foo = UICtrl.galleryGenerator(data.data);
        $('.img-gal').append(foo);
        saveCategories();
        saveImageClickHandler(); // Move once app controller is in place

      });
  }

  const generateSavedImages = function() {
    const query = StorageCtrl.generateSavedImages().join(',');
    fetch(`https://api.giphy.com/v1/gifs?api_key=YqLensbIWv5skyGVSr6ZPFClfQImMmX4&ids=${query}`)
      .then(res => res.json())
      .then(data => {
        let foo = UICtrl.galleryGenerator(data.data);
        $('.img-gal').html(foo);
      });

  }

  const generateCategoryBtn = function() {
    $('.categories .row').append(`<button data-word="${tempQueryData.keyword}" class="btn btn-large btn-info  col-2 col-md-2 m-1">${tempQueryData.keyword}</button>`);
  }

  const generateRecentSearchItem = function() {
    $('.search-list').append(`<li class="list-group-item p-0 pt-2">${tempQueryData.keyword}</li>`);
  }

  const saveCategories = function() {
    let key  = tempQueryData.keyword.toLowerCase();
    if(StorageCtrl.dataStore.categories.indexOf(key) == -1) {
      StorageCtrl.dataStore.categories.push(key);
      StorageCtrl.saveDataStoreToLocalStorage();
    }
  }

  const loadCategoriesFromLocalStorage = function() {
    const list = StorageCtrl.getCategories();
    UICtrl.dispBtn(list);


  }

  $(DOM.loadMore).on('click', function() {
    tempQueryData.offset+= 12;
    getSearchImagesV1();


  });

  $(DOM.searchBar).on('submit', function(e) {
    e.preventDefault();
    let query = e.target[1].value;
    tempQueryData.keyword = query;
    getSearchImages();
    e.target[1].value = '';
    generateRecentSearchItem();
    generateCategoryBtn();
  });

  $(DOM.mobileBar).on('submit', function(e) {
    e.preventDefault();
    let query = e.target[1].value;
    tempQueryData.keyword = query;
    getSearchImages();
    e.target[1].value = '';
    generateRecentSearchItem();
    generateCategoryBtn();
  });

  $(DOM.categorySection).on('click', '.btn', function() {
    let word = $(this).attr('data-word');
    tempQueryData.keyword = word;
    getSearchImages();
  });

return {
  initHome: getSearchImages,
  initSaved: generateSavedImages,
  loadCat: loadCategoriesFromLocalStorage

}
})(StorageCtrl,UICtrl)

//Bootstrap local storage into existance
if(window.localStorage.getItem('store') == null) {
  StorageCtrl.saveDataStoreToLocalStorage();
}
StorageCtrl.generateSavedImages();
appCtrl.loadCat();

const StorageCtrl = (function() {

  myStorage = window.localStorage;

  const store = {
    categories: ['cats','dogs','birds'],
    saved: []
  }

  const setToLocal = function() {
    const parsedStore = JSON.stringify(store);
    console.log(parsedStore);
    myStorage.setItem('store',parsedStore);
  }


  const loadCategories = function() {
    const str = myStorage.getItem('store');
    const obj = JSON.parse(str);
    store.categories = obj.categories;

    return store.categories;
  }

  const loadSavedImgs = function() {
    const str = myStorage.getItem('store');
    const obj = JSON.parse(str);
    store.saved = obj.saved;

    return store.saved;
  }




  return {
    storeCategory: store,
    setToLocal: setToLocal,
    getCategories: loadCategories,
    getSavedImages: loadSavedImgs
  }


})()

const UICtrl = (function(StorageCtrl) {




  const onScreen = {
    keyword: 'Cats',
    limit: 12,
    offset: 0,

  }

  const htmlHooks = {
    modalStore: 'modals',
    pagination: '.pagination',
    searchBar: '#search',
    categorySection: '.categories',
    currentPage: document.querySelector('.starter')
  }

  const saveImage = function(){
    $('.save-me').on('click', function(e) {
      console.log(this);
      let val = $(this).attr('data-id');

      if(StorageCtrl.storeCategory.saved.indexOf(val) == -1) {
        StorageCtrl.storeCategory.saved.push(val);
        StorageCtrl.setToLocal();
      }






    });
  }

  //Row Generator and cardTemplate take care of generating the gallery as needed.
  const rowGenerator = function(data) {

    let container = document.createElement('div');
    let node = document.createElement('div');
    node.classList.add('row');
    data.forEach((item, index) => {
      node.innerHTML += cardTemplate(item);
    });
    container.appendChild(node);

    return container;
  }

  const cardTemplate = function(data) {
    const info = {
      imgStill: data.images['480w_still'].url,
      imgGif: data.images['downsized'].url,
      id: data.id,
      rating: data.rating,
      createdDate: data.import_datetime
    }
    let cardMarkUp =
      `
      <div  class="card mb-3 mx-auto mx-md-0 p-0 col-md-3" data-id="${info.id}">
        <img data-toggle="modal" data-target="#${info.id}"  src="${info.imgStill}"
          alt="Card image">
        <div class="card-body">
          <p class="card-text">Rating: ${info.rating.toUpperCase()}</p>
          <p class="card-text">Date Added: ${info.createdDate}</p>
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

    $(htmlHooks.modalStore).append(modal);

    return cardMarkUp;
  };
  //getSearchImages automatically calls the functions that generate the gallery
  // Destructure this mess later
  const getSearchImages = function() {
    fetch(`https://api.giphy.com/v1/gifs/search?api_key=YqLensbIWv5skyGVSr6ZPFClfQImMmX4&q=${onScreen.keyword}&limit=${onScreen.limit}&offset=${onScreen.offset}&rating=G&lang=en`)
      .then(res => res.json())
      .then(data => {
        let foo = rowGenerator(data.data);
        $('.img-gal').html(foo);
        saveCategories();
        saveImage();

      });
  }

  const getSavedImages = function() {
    const query = StorageCtrl.getSavedImages().join(',');
    console.log(query);
    fetch(`https://api.giphy.com/v1/gifs?api_key=YqLensbIWv5skyGVSr6ZPFClfQImMmX4&ids=${query}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        let foo = rowGenerator(data.data);
        $('.img-gal').html(foo);
        //saveCategories();
        //saveImage();

      });

  }

  const categoryBtn = function() {
    $('.categories .row').append(`<button data-word="${onScreen.keyword}" class="btn btn-large btn-info  col-2 col-md-2 m-1">${onScreen.keyword}</button>`);
  }

  const searchListUpdate = function() {
    $('.search-list').append(`<li class="list-group-item p-0 pt-2">${onScreen.keyword}</li>`);
  }

  const saveCategories = function() {
    let key  = onScreen.keyword.toLowerCase();
    if(StorageCtrl.storeCategory.categories.indexOf(key) == -1) {
      StorageCtrl.storeCategory.categories.push(key);
      StorageCtrl.setToLocal();

    }
    console.log(StorageCtrl.storeCategory.categories);

  }

  const loadCategories = function() {
    const list = StorageCtrl.getCategories();
    StorageCtrl.getSavedImages();
    list.forEach( item => {
      $('.categories .row').append(`<button data-word="${item}" class="btn btn-large btn-info  col-2 col-md-2 m-1">${item}</button>`);
    });

  }



  // Event listners
  $(htmlHooks.pagination).on('click', '.page-item', function() {
    htmlHooks.currentPage.classList.remove('active');
    htmlHooks.currentPage = this;
    this.classList.add('active');
    const value = this.attributes.value.value;
    onScreen.offset = value * onScreen.limit;
    getSearchImages();
  });

  $(htmlHooks.searchBar).on('submit', function(e) {
    e.preventDefault();
    let query = e.target[1].value;
    onScreen.keyword = query;
    getSearchImages();
    e.target[1].value = '';
    searchListUpdate();
    categoryBtn();
  });

  $(htmlHooks.categorySection).on('click', '.btn', function() {
    let word = $(this).attr('data-word');
    onScreen.keyword = word;
    getSearchImages();


  });



  //Public Methods
  return {
    initHome: getSearchImages,
    initSaved: getSavedImages,
    loadCat: loadCategories
  }

})(StorageCtrl);

UICtrl.loadCat();





//Bootstrap local storage into existance
if(window.localStorage.getItem('store') == null) {
  StorageCtrl.setToLocal();
}

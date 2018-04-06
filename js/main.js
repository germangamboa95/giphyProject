
const UICtrl = (function(){
  const onScreen = {
    keyword: 'dogs',
    limit: 12,
    offset: 0,
    currBtn: document.querySelector('.starter')
  }
const rowGenerator = function(data){

    let container = document.createElement('div');
    let node = document.createElement('div');
    node.classList.add('row');
    // This works. I do not know why but all the nodes are there before it is called.
    data.forEach((item, index) => {
      let card = cardTemplate(item);

      node.append(card);
    //  console.log(node);




    });
    container.appendChild(node);


    return container;

  }
const cardTemplate = function(data){
    const info = {
      imgStill: data.images['480w_still'].url,
      imgGif: data.images['downsized'].url,
      id: data.id,
      rating: data.rating,
      createdDate: data.import_datetime
    }
    let cardMarkUp =
      `
      <div data-toggle="modal" data-target="#${info.id}" class="card mb-3 mx-auto mx-md-0 p-0 col-md-3" data-id="${info.id}">
      <img style="height: 200px; width: 100%; display: block;" src="${info.imgGif}"
        alt="Card image">
        <div class="card-body">
          <p class="card-text">Rating: ${info.rating.toUpperCase()}</p>
          <p class="card-text">Date Added: ${info.createdDate}</p>
        </div>
        <div class="card-body py-0 ">
        <a href="#" class="card-link">Card link</a>
        <a href="#" class="card-link">Another link</a>
      </div>
      `;
    let modal = `<div class="modal" id='${info.id}'>
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <img data-toggle="modal" data-target="" style="height: auto; width: 100%; display: block;" src="${info.imgGif}"
            alt="Card image">

        </div>
      </div></div>`;

    $('modals').append(modal);

    let $card = $(cardMarkUp)[0];

    return $card;
  };

const getSearchImages = function() {
  fetch(`https://api.giphy.com/v1/gifs/search?api_key=YqLensbIWv5skyGVSr6ZPFClfQImMmX4&q=${onScreen.keyword}&limit=${onScreen.limit}&offset=${onScreen.offset}&rating=G&lang=en`)
  .then(res => res.json())
  .then(data => {
    console.log(data.data)
    let foo = rowGenerator(data.data);
    $('.img-gal').html(foo);
  });
}

$('.pagination').on('click','.page-item', function(){
  onScreen.currBtn.classList.remove('active');
  onScreen.currBtn = this;
  this.classList.add('active');
  const value = this.attributes.value.value;
  onScreen.offset = value * onScreen.limit;

  getSearchImages();
});

$('#search').on('submit', function(e) {
  e.preventDefault();
  let query = e.target[1].value;
  onScreen.keyword = query;
  getSearchImages();
  e.target[1].value = '';


});

return {
  init: getSearchImages
}

})();


UICtrl.init();

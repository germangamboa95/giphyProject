const UICtrl = (function() {
  const cardTemplate = function(data) {
    const info = {
      imgStill: data.images["480w_still"].url,
      imgGif: data.images["downsized"].url,
      id: data.id,
      rating: data.rating,
      createdDate: data.import_datetime,
      title: data.title
    };

    let cardMarkUp = `
      <div  class="card mb-3 mx-auto mx-md-0 p-0 col-lg-3 col-md-6" data-id="${
        info.id
      }">
        <img data-toggle="modal" data-target="#${info.id}"  src="${
      info.imgStill
    }"

          alt="Card image">
        <div class="card-body">
          <p class="card-text">${info.title.toUpperCase()}</p>
          <p class="card-text mb-0"><strong>Rating:</strong> ${info.rating.toUpperCase()}</p>
          <p class="card-text"><strong>Date Added: </strong> <br> ${new Date(
            info.createdDate
          ).toDateString()}</p>
          <button data-id="${
            info.id
          }"  class="btn btn-primary save-me">Save</button>
          <button data-ref="${
            info.imgGif
          }" class="btn btn-secondary download-me">DownLoad</button>



        </div>



      </div>
      `;

    let modal = `<div class="modal" id='${info.id}'>
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <img data-toggle="modal" data-target="" style="height: auto; width: 100%; display: block;" src="${
            info.imgGif
          }"
            alt="Card image">

        </div>
      </div></div>`;

    return cardMarkUp + modal;
  };

  const galleryGenerator = function(data) {
    let container = document.createElement("div");
    let node = document.createElement("div");
    node.classList.add("row");
    data.forEach((item, index) => {
      node.innerHTML += cardTemplate(item);
    });
    container.appendChild(node);

    return container;
  };

  const categoryBtnGenerator = function(data) {
    data.forEach(item => {
      $(".categories .row").append(
        `<button data-word="${item}" class="btn btn-large btn-info  col-2 col-md-2 m-1">${item}</button>`
      );
    });
  };

  return {
    galleryGenerator: galleryGenerator,
    dispBtn: categoryBtnGenerator
  };
})();

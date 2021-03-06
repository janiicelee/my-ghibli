/* global data */
const $susuwatari = document.querySelector('#susuwatari');
const $frontPage = document.querySelector('.front-page');
const $listPage = document.querySelector('#list-page');
const $infoPage = document.querySelector('#info-page');
const $reviewPage = document.querySelector('#review-page');

// loading spinner
const loadingSpinner = document.querySelector('.lds-default');
loadingSpinner.className = 'lds-default';

// click the susuwatari to start
function clickSuswatari(event) {
  $frontPage.className = 'front-page hidden';
  $listPage.className = '';
}
$susuwatari.addEventListener('click', clickSuswatari);

// show movie list on list page
const $movielist = document.querySelector('#movie-list');

const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://ghibliapi.herokuapp.com/films');
xhr.responseType = 'json';

xhr.addEventListener('load', function () {
  // show the susuwatari to get started
  $frontPage.className = 'front-page';

  // hide the loading spinner
  loadingSpinner.className = 'lds-default hidden';

  data.films = xhr.response;

  for (let i = 0; i < data.films.length; i++) {
    const $movielistitem = document.createElement('div');
    $movielist.appendChild($movielistitem);
    $movielistitem.setAttribute('class', 'column');
    $movielistitem.setAttribute('id', 'movielistitem');
    const $imgElement = document.createElement('img');
    $movielistitem.appendChild($imgElement);
    $imgElement.setAttribute('src', xhr.response[i].image);
    $imgElement.setAttribute('data-movie-index', i);
    $imgElement.setAttribute('id', 'movie-poster');

    $movielist.addEventListener('click', handlePosterClick);
    $addReviewButton.addEventListener('click', handleReviewButton);
  }

});

xhr.send();

const $movieinfo = document.querySelector('#movie-info');

function handlePosterClick(event) {

  if (event.target.tagName === 'IMG') {
    $movielist.className = 'hidden';
    $infoPage.className = '';
    $reviewPage.className = 'hidden';

    const id = event.target.getAttribute('data-movie-index');
    const movieInfoDOMTree = createMovieInfo(data.films[id]);
    $movieinfo.appendChild(movieInfoDOMTree);
  }
}

// remove childNodes for the detail page
function removeChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// create info page for each movie
function createMovieInfo(movie) {

  const $movieInfoContainer = document.createElement('div');
  const titleElement = document.createElement('h3');
  titleElement.setAttribute('id', 'movie-title');
  titleElement.textContent = movie.title + ' ' + '(' + movie.original_title + ')';
  $movieInfoContainer.appendChild(titleElement);

  const imgElement = document.createElement('img');
  imgElement.setAttribute('src', movie.movie_banner);
  imgElement.setAttribute('id', 'movie-banner');
  $movieInfoContainer.appendChild(imgElement);

  const pElement = document.createElement('p');
  pElement.textContent = movie.description;
  $movieInfoContainer.appendChild(pElement);

  const infobox = document.createElement('div');
  infobox.setAttribute('class', 'info-box');
  $movieInfoContainer.appendChild(infobox);

  const ulElement = document.createElement('ul');
  infobox.appendChild(ulElement);

  const liElement1 = document.createElement('li');
  liElement1.textContent = 'Director: ' + movie.director;
  ulElement.appendChild(liElement1);

  const liElement2 = document.createElement('li');
  liElement2.textContent = 'Producer: ' + movie.producer;
  ulElement.appendChild(liElement2);

  const liElement3 = document.createElement('li');
  liElement3.textContent = 'Release Year: ' + movie.release_date;
  ulElement.appendChild(liElement3);

  const liElement4 = document.createElement('li');
  liElement4.textContent = 'Running Time: ' + movie.running_time + ' min';
  ulElement.appendChild(liElement4);

  return $movieInfoContainer;
}

// click event for the 'go back' button in the info page.
const $goBackButton = document.querySelector('#go-back');
$goBackButton.addEventListener('click', goBackToList);

function goBackToList(event) {
  $infoPage.className = 'hidden';
  $movielist.className = 'row';
  $reviewPage.className = 'hidden';

  if (event.target) {
    removeChildNodes($movieinfo);
  }
}

// show list when user clicks the 'my ghibli' tab
const $myGhibliTab = document.querySelector('#my-ghibli-tab');
$myGhibliTab.addEventListener('click', function (event) {
  $movielist.className = 'row';
  $infoPage.className = 'hidden';
  $reviewPage.className = 'hidden';

  if (event.target) {
    removeChildNodes($movieinfo);
  }
});

const $reviewsTab = document.querySelector('#reviews-tab');
const $reviewsList = document.querySelector('#reviews-list');

// show reviews when user clicks the 'reviews' tab
$reviewsTab.addEventListener('click', clickReviewTab);

function clickReviewTab(event) {
  $movielist.className = 'hidden';
  $infoPage.className = 'hidden';

  // when there is no review
  if (data.reviews.length === 0) {
    noReviews.className = 'text-center';
    newReview.className = 'hidden';
    $reviewPage.className = '';
    $reviewsList.className = 'hidden';
  } else {
    // when theres one or more reviews
    noReviews.className = 'text-center hidden';
    $reviewPage.className = '';
    newReview.className = 'hidden';
    $reviewsList.className = '';

    data.view = 'reviews-list';
  }

  if (event.target) {
    removeChildNodes($movieinfo);
  }
}

// click event function for the 'add review' button
const noReviews = document.querySelector('#no-reviews');
const newReview = document.querySelector('#new-review');
const $addReviewButton = document.querySelector('#add-review');

function handleReviewButton(event) {
  $reviewPage.className = '';
  noReviews.classList.add('hidden');
  newReview.className = '';
  $movielist.className = 'hidden';
  $infoPage.className = 'hidden';
  $reviewsList.className = 'hidden';

  // hide the delete button when adding a new review
  $deleteButton.className = 'visibility-hidden';

  const reviewMovieTitle = document.querySelector('#review-movie');
  const reviewImage = document.querySelector('#review-image');
  reviewMovieTitle.textContent = document.querySelector('#movie-title').textContent;
  reviewImage.setAttribute('src', document.querySelector('#movie-banner').src);
}

// submit event for the review form
const $form = document.querySelector('form');
const $ulElement = document.querySelector('ul');

$form.addEventListener('submit', saveReview);

function saveReview(event) {
  event.preventDefault();
  let review = {};
  if (data.editing === null) {
    review = {
      title: document.querySelector('#movie-title').textContent,
      image: document.querySelector('#movie-banner').src,
      text: $form.elements[0].value,
      reviewId: data.nextReviewId
    };

    // add new review to the data model
    data.nextReviewId++;
    data.reviews.unshift(review);
    $ulElement.prepend(createReviewListItem(review));
    $form.reset();

  } else if (data.editing !== null) {
    review.title = document.querySelector('#movie-title').textContent;
    review.image = document.querySelector('#movie-banner').src;
    review.text = $form.elements[0].value;
    review.reviewId = data.editing.reviewId;

    // put the edited review into the reviews list
    for (let i = 0; i < data.reviews.length; i++) {
      if (data.reviews[i].reviewId === review.reviewId) {
        data.reviews[i] = review;
      }
    }

    // replace exisiting DOM element with another one
    const reviewItems = document.querySelectorAll('.review-list-item');
    for (let i = 0; i < reviewItems.length; i++) {
      const reviewItemId = JSON.parse(reviewItems[i].getAttribute('data-review-id'));
      if (reviewItemId === data.editing.reviewId) {
        reviewItems[i].replaceWith(createReviewListItem(review));
      }
    }

    data.editing = null;
    $form.reset();
  }

  // switches to the reviews list
  $movielist.className = 'hidden';
  $infoPage.className = 'hidden';
  noReviews.className = 'text-center hidden';
  newReview.className = 'hidden';
  $reviewPage.className = '';
  $reviewsList.className = '';

  data.view = 'reviews-list';
}

// create DOM to display the reviews
function createReviewListItem(review) {
  const liElement = document.createElement('li');
  liElement.setAttribute('class', 'review-list-item');
  liElement.setAttribute('data-review-id', review.reviewId);

  const titleElement = document.createElement('h3');
  titleElement.setAttribute('id', 'movie-title');
  titleElement.textContent = review.title;
  liElement.appendChild(titleElement);

  const imageElement = document.createElement('img');
  imageElement.setAttribute('id', 'movie-banner');
  imageElement.setAttribute('src', review.image);
  liElement.appendChild(imageElement);

  const pElement = document.createElement('p');
  pElement.textContent = review.text;
  liElement.appendChild(pElement);

  const divElement = document.createElement('div');
  divElement.setAttribute('class', 'align-right');
  liElement.appendChild(divElement);

  const editButton = document.createElement('button');
  editButton.setAttribute('class', 'edit-button');
  editButton.setAttribute('type', 'button');
  editButton.textContent = 'Edit Review';
  divElement.appendChild(editButton);

  return liElement;
}

const newReviewsList = document.querySelector('#new-reviews-list');

// remain the reviews list even after refreshing the page
document.addEventListener('DOMContentLoaded', function (event) {
  for (let i = 0; i < data.reviews.length; i++) {
    const result = createReviewListItem(data.reviews[i]);
    newReviewsList.appendChild(result);
  }
});

// listen for click event on the parent element of all rendered reviews
newReviewsList.addEventListener('click', handleEditButton);

function handleEditButton(event) {
  if (event.target.matches('.edit-button')) {
    $deleteButton.className = '';
    const $liClosest = event.target.closest('li');
    let $reviewId = $liClosest.getAttribute('data-review-id');
    $reviewId = JSON.parse($reviewId);

    for (let i = 0; i < data.reviews.length; i++) {
      if (data.reviews[i].reviewId === $reviewId) {
        data.editing = data.reviews[i];
      }
    }

    // populate the input fields with the object stored in data.editing
    document.querySelector('#review-movie').textContent = data.editing.title;
    document.querySelector('#review-image').src = data.editing.image;
    $form.elements[0].value = data.editing.text;

    // show the review page where user wants to edit
    $reviewPage.className = '';
    noReviews.classList.add('hidden');
    newReview.className = '';
    $movielist.className = 'hidden';
    $infoPage.className = 'hidden';
    $reviewsList.className = 'hidden';
  }
}

const $deleteButton = document.querySelector('#delete-button');

// show the confirmation modal
const $modal = document.querySelector('#modal');
$deleteButton.addEventListener('click', function (event) {
  $modal.className = 'dark-bg';
});

// hide the confirmation modal when the user clicks cancel
const $cancelButton = document.querySelector('#cancel-button');
$cancelButton.addEventListener('click', function (event) {
  $modal.className = 'dark-bg hidden';
});

// remove the review from the data model and the dom tree
const $confirmButton = document.querySelector('#confirm-button');
$confirmButton.addEventListener('click', function (event) {

  const reviewItems = document.querySelectorAll('.review-list-item');
  for (let i = 0; i < data.reviews.length; i++) {
    if (data.reviews[i].reviewId === data.editing.reviewId) {
      data.reviews.splice(i, 1);
    }

    const reviewIdNum = JSON.parse(reviewItems[i].getAttribute('data-review-id'));
    if (reviewIdNum === data.editing.reviewId) {
      reviewItems[i].remove();
    }
  }

  // reset form and go back to reviews list
  data.editing = null;
  data.view = 'reviews-list';
  $modal.className = 'dark-bg hidden';
  $form.reset();
  clickReviewTab(event);
});

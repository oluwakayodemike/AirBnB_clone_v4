$(document).ready(function() {
  const api = 'http://' + window.location.hostname;

  $.get(api + ':5001/api/v1/status/', function(response) {
    if (response.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  function updatePlacesSearch() {
    const amenityIds = Object.keys(amenities);
    const stateIds = Object.keys(states);
    const cityIds = Object.keys(cities);
    const data = {
      amenities: amenityIds,
      states: stateIds,
      cities: cityIds
    };

    $.ajax({
      url: api + ':5001/api/v1/places_search/',
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      dataType: 'json',
      success: function(data) {
        $('section.places').empty();
        data.forEach(function(place) {
          const article = `
            <article>
              <div class="title">
                <h2>${place.name}</h2>
                <div class="price_by_night">
                  ${place.price_by_night}
                </div>
              </div>
              <div class="information">
                <div class="max_guest">
                  <i class="fa fa-users fa-3x" aria-hidden="true"></i>
                  <br>
                  ${place.max_guest} Guests
                </div>
                <div class="number_rooms">
                  <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
                  <br>
                  ${place.number_rooms} Bedrooms
                </div>
                <div class="number_bathrooms">
                  <i class="fa fa-bath fa-3x" aria-hidden="true"></i>
                  <br>
                  ${place.number_bathrooms} Bathrooms
                </div>
              </div>
              <div class="description">
                ${place.description}
              </div>
            </article>`;
          $('section.places').append(article);
        });
      }
    });
  }

  let amenities = {};
  let states = {};
  let cities = {};

  $('input[type="checkbox"]').change(function() {
    const id = $(this).attr('data-id');
    const name = $(this).attr('data-name');
    const type = $(this).parent().parent().parent().find('h3').text().trim();

    if (type === 'States') {
      if ($(this).is(':checked')) {
        states[id] = name;
      } else {
        delete states[id];
      }
      $('.locations h4').text(Object.values(states).join(', '));
    } else if (type === 'Cities') {
      if ($(this).is(':checked')) {
        cities[id] = name;
      } else {
        delete cities[id];
      }
      $('.locations h4').text(Object.values(cities).join(', '));
    } else {
      if ($(this).is(':checked')) {
        amenities[id] = name;
      } else {
        delete amenities[id];
      }
      if (Object.values(amenities).length === 0) {
        $('.amenities h4').html('&nbsp;');
      } else {
        $('.amenities h4').text(Object.values(amenities).join(', '));
      }
    }
  });

  $('button').click(function() {
    updatePlacesSearch();
  });

  // Function to fetch and display reviews
  function fetchAndDisplayReviews() {
    // Fetch reviews from the server
    $.ajax({
      url: api + ':5001/api/v1/places/' + placeId + '/reviews',
      type: 'GET',
      success: function(data) {
        // Clear existing reviews
        $('.reviews ul').empty();
        // Append each review to the reviews list
        data.forEach(function(review) {
          const reviewItem = `
            <li>
              <h3>${review.user} the ${review.date}</h3>
              <p>${review.text}</p>
            </li>
          `;
          $('.reviews ul').append(reviewItem);
        });
      }
    });
  }

  // Event listener for toggling reviews
  $('#toggleReviews').click(function() {
    const buttonText = $(this).text();
    if (buttonText === 'show') {
      // Change button text to 'hide'
      $(this).text('hide');
      // Fetch and display reviews
      fetchAndDisplayReviews();
    } else if (buttonText === 'hide') {
      // Change button text to 'show'
      $(this).text('show');
      // Remove all review elements from the DOM
      $('.reviews ul').empty();
    }
  });
});


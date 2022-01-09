import React from 'react';
import ReactDOM from 'react-dom';
import Overview from '../components/Overview.jsx';
import QuestionsAndAnswers from '../components/QuestionsAndAnswers.jsx';
import RatingsAndReviews from '../components/RatingsAndReviews.jsx';
import RelatedItems from '../components/RelatedItems.jsx';
import Search from '../components/Search.jsx';


import $ from 'jquery';
import { APIkey } from '../config.js';

// importing search bar icon from react library
import { FaSistrix } from 'react-icons/fa';
import parseAverageRating from '../modules/parseRatings.js';
import mockProduct from '../mock_api/mock_product.js';
import mockStyles from '../mock_api/mock_styles.js';
import getPercentRecommended from '../modules/percentRecommended.js';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      productId: 59553,
      product: null,
      styles: null,
      ratings: null,
      averageRating: null,
      products: null,
      percentRecommended: null,
      currentItemFeatures: [],
      relatedItems: [],
      relatedStyles: [],
      relatedIds: [],
      relatedRatings: [],
      all: [],

    }

    this.retrieveProduct = this.retrieveProduct.bind(this);
    this.retrieveStyles = this.retrieveStyles.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.retrieveRelatedProducts = this.retrieveRelatedProducts.bind(this);
    this.retrieveProductForRelated = this.retrieveProductForRelated.bind(this);
    this.retrieveStyleForRelated = this.retrieveStyleForRelated.bind(this);
    this.retrieveRatingForRelated = this.retrieveRatingForRelated.bind(this);
    this.renderRelatedItems = this.renderRelatedItems.bind(this);
    this.handleRelatedCardClick = this.handleRelatedCardClick.bind(this);
    this.retrieveAllForRelated = this.retrieveAllForRelated.bind(this);

    this.retrieveRatings = this.retrieveRatings.bind(this);
  }

  componentDidMount() {

    this.retrieveProduct(this.state.productId);
    this.retrieveStyles(this.state.productId);
    this.retrieveRelatedProducts(this.state.productId);
    this.retrieveRatings();
  }

  componentDidUpdate() {

  }

  retrieveProduct(id) {

    var self = this;

    $.ajax({
      method: 'GET',
      url: `products/${id}`
    }).done((res) => {
        this.retrieveStyles(res, this.state.productId);
        //console.log('state product => ', self.state.product);
    })

  }


  retrieveStyles(product, productNumber) {
    var self = this;

    $.ajax({
      method: 'GET',
      url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products/${productNumber}/styles`,
      headers: {
        "Authorization": APIkey
      }
    }).done((res) => {
      self.setState({
        ...self.state,
        product: product,
        styles: res,
        currentItemFeatures: product.features
      }, () => {
        //console.log('state styles => ', self.state.styles);
      })
    })

  }

  retrieveRatings() {

    var self = this;

    $.ajax({
      method: 'GET',
      url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/reviews/?product_id=${this.state.productId}`,
      headers: {
        "Authorization": APIkey
      }
    }).done((res) => {
      self.setState({
        ...self.state,
        ratings: res,
      }, () => {
        self.setState({
          ...self.state,
          averageRating: parseAverageRating(this.state.ratings)
        }, () => {
          self.setState({
            ...self.state,
            percentRecommended: getPercentRecommended(this.state.ratings)
          }, () => {
            // console.log('percent recommended: ', this.state.percentRecommended);
          })
        })
      })
    })

  }

  // now available for use - must use string parameter with product name
  // not case sensitive but spelling must be correct
  handleSearch(searchTerm) {

    //console.log('search toggled')

    $.ajax({
      method: 'GET',
      url: `search/${searchTerm}`,
    }).done((res) => {
      this.setState({
        ...this.state,
        productId: res
      }, () => {
        $('.searchInput').val('');
        this.retrieveProduct(this.state.productId);
      })
    })

  }

  //after getting all of the related products in an array
  //perform calls to the api to get all of the data
  //then arrange the data in the server, send it back and set state


  retrieveRelatedProducts(productId) {
    $.ajax({
      method: 'GET',
      url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products/${this.state.productId}/related`,
      headers: {
        "Authorization": APIkey
      },
      success: (data) => {
        //data might have duplicates
        //[3, 4, 3, 5]
        //
        this.retrieveAllForRelated(data);




        var nonDuplicateObj = {};
        data.forEach(item => {
          nonDuplicateObj[item] = true;
        })
        var nonDuplicateArray = [];
        for (var id in nonDuplicateObj) {
          nonDuplicateArray.push(id);
        }
        this.setState({
          relatedIds: nonDuplicateArray
        });
        nonDuplicateArray.forEach(id => {
          this.retrieveProductForRelated(id);
          this.retrieveStyleForRelated(id);
          this.retrieveRatingForRelated(id);

        })
      },
      error: (err) => {
        console.log('error getting related products', err);
      }
    })
  }

  retrieveAllForRelated(ids) {

    var ids = ids.join('&');

    $.ajax({
      method: 'GET',
      url: `related/${ids}`,
      success: (data) => {
        console.log('data', data)
      },
      error: (err) => {
        console.log('error getting all for related', err)
      }
    })
  }


  retrieveProductForRelated(productId) {
    $.ajax({
      method: 'GET',
      url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products/${productId}`,
      headers: {
        "Authorization": APIkey
      },
      success: (data) => {
        var relatedData = this.state.relatedItems.concat(data);
        this.setState({
          relatedItems: relatedData
        });
      },
      error: (err) => {
        console.log('error', err);
      }
    })
  }

  retrieveStyleForRelated(productNumber) {
    $.ajax({
      method: 'GET',
      url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products/${productNumber}/styles`,
      headers: {
        "Authorization": APIkey
      },
      success: (data) => {
        var relatedStyle = this.state.relatedStyles.concat(data);
        this.setState({
          relatedStyles: relatedStyle
        });
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  retrieveRatingForRelated(productId) {

    var self = this;

    $.ajax({
      method: 'GET',
      url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/reviews/?product_id=${productId}`,
      headers: {
        "Authorization": APIkey
      }
    }).done((res) => {
      var avgRating = parseAverageRating(res);
      var ratingObj = {ratingId: productId, rating: avgRating}
      var currentRating = this.state.relatedRatings.concat(ratingObj);
      self.setState({
        relatedRatings: currentRating,
      }, () => {

      })
    })
  }

  handleRelatedCardClick(e) {
    var clickedCardId = e.currentTarget.getAttribute('data-txt');
    this.setState({
      productId: clickedCardId,
      relatedItems: [],
      relatedStyles: [],
      relatedIds: [],
      relatedRatings: [],

    }, () => {
      this.retrieveProduct(this.state.productId);
      this.retrieveRelatedProducts();
      this.retrieveRatings();

    }
    )
  }

  renderRelatedItems() {
    var noOfRelated = this.state.relatedIds.length;
    if (noOfRelated > 0 && this.state.product && this.state.styles && this.state.averageRating) {
      if (noOfRelated === this.state.relatedItems.length && noOfRelated === this.state.relatedStyles.length && noOfRelated === this.state.relatedRatings.length) {
          return <RelatedItems items={this.state.relatedItems} styles={this.state.relatedStyles} self={this.state.product} ratings={this.state.relatedRatings} clickCard={this.handleRelatedCardClick} />
      }
    }
  }

  render() {

    return (
      <div>
        <div className={'topBar'}>
          <div className={'pageTitle'}>ATELIER</div>
          <div className={'searchUnit'}>
            <Search handleSearch={this.handleSearch} />
            <div className={'searchFieldUnderline'} />
          </div>
        </div>
        <div className={'siteAnnouncementBar'}>
          <div className={'announcement'}><i>SITE-WIDE ANNOUNCEMENT MESSAGE!</i> - SALE / DISCOUNT <b>OFFER</b> - NEW PRODUCT HIGHLIGHT</div>
        </div>
        <div>{this.state.product && this.state.styles ? <Overview product={this.state.product} styles={this.state.styles} rating={this.state.averageRating}/> : null }</div>
        {this.renderRelatedItems()}
        <QuestionsAndAnswers />
        <div className="ratingsAndReviews">
        {this.state.ratings ? <RatingsAndReviews reviews={this.state.ratings} averageRating={this.state.averageRating} percent={this.state.percentRecommended}/> : null }
        </div>
      </div>
    )
  }
}

export default App;

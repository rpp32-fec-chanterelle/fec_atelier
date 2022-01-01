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

import mockProduct from '../mock_api/mock_product.js';
import mockStyles from '../mock_api/mock_styles.js';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      productId: 59553,
      product: null,
      styles: null,
      products: null,
    }

    this.retrieveProduct = this.retrieveProduct.bind(this);
    this.retrieveStyles = this.retrieveStyles.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

  }

  componentDidMount() {
    // invoke retrieveProduct
    this.retrieveProduct();
  }

  componentDidUpdate() {

  }

  retrieveProduct() {

    var self = this;

    //console.log(APIkey);

    $.ajax({
      method: 'GET',
      url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products/${this.state.productId}`,
      headers: {
        "Authorization": APIkey
      }
    }).done((res) => {
      self.setState({
        ...self.state,
        product: res
      }, () => {
        this.retrieveStyles(this.state.productId);
        //console.log('state product => ', self.state.product);
      })
    })

  }


  retrieveStyles(productNumber) {

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
        styles: res
      }, () => {
        //console.log('state styles => ', self.state.styles);
      })
    })

  }

  handleSearch(searchTerm) {

    // this method will retrieve search term from topbar on page and use a
    // server route + modularized helpers to construct search query and perform
    // API pull.
    // Then state will be updated with new product / styles

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
        <div>{this.state.product && this.state.styles ? <Overview product={this.state.product} styles={this.state.styles} /> : null }</div>
        <RelatedItems />
        <QuestionsAndAnswers />
        <RatingsAndReviews />
      </div>
    )

  }


}

export default App;
import React from 'react';
import ReactDOM from 'react-dom';
import Overview from '../components/Overview.jsx';
import QuestionsAndAnswers from '../components/QuestionsAndAnswers.jsx';
import RatingsAndReviews from '../components/RatingsAndReviews.jsx';
import RelatedItems from '../components/RelatedItems.jsx';
import $ from 'jquery';
import APIkey from '../config.js';

import mockProduct from '../mock_api/mock_product.js';
import mockStyles from '../mock_api/mock_styles.js';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      productId: 1,
      product: mockProduct,
      styles: mockStyles,
      products: null,
    }

    this.retrieveProduct = this.retrieveProduct.bind(this);
    this.retrieveStyles = this.retrieveStyles.bind(this);

  }

  componentDidMount() {
    // invoke retrieveProduct
    this.retrieveProduct();
    this.retrieveStyles(3);
  }

  retrieveProduct() {

    var self = this;

    $.ajax({
      method: 'GET',
      url: 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products/',
      headers: {
        "Authorization": APIkey
      }
    }).done((res) => {
      self.setState({
        ...self.state,
        products: res
      }, () => {
        //console.log('state products => ', self.state.products);
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

  render() {

    return (
      <div>
        <div className={'pageTitle'}>ATELIER</div>
        <Overview product={this.state.product} styles={this.state.styles}/>
        <RelatedItems />
        <QuestionsAndAnswers />
        <RatingsAndReviews />
      </div>
    )

  }


}

export default App;